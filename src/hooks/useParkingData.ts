import { useState, useEffect, useCallback, useRef } from 'react';
import { ParkingLot } from '../domain/types';
import { fetchAllParkingLots, fetchVacanciesOnly } from '../api/parkingApi';

export const REFRESH_INTERVAL_SECONDS = 60; // 60s as recommended in spec Section 11

export function useParkingData() {
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isUsingCachedData, setIsUsingCachedData] = useState<boolean>(false);
  const [secondsUntilNextRefresh, setSecondsUntilNextRefresh] = useState<number>(REFRESH_INTERVAL_SECONDS);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial load
  const loadData = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const result = await fetchAllParkingLots();
      setLots(result.lots);
      setIsUsingCachedData(result.isCached);
      setLastUpdated(new Date(result.timestamp));
      setSecondsUntilNextRefresh(REFRESH_INTERVAL_SECONDS);
    } catch (err) {
      console.error('Failed to load parking data:', err);
      setError((err as Error).message || 'Failed to fetch parking data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Lightweight refresh (vacancies only)
  const refreshVacancies = useCallback(async (force = false) => {
    setIsRefreshing(true);
    try {
      const newVacancies = await fetchVacanciesOnly(force);
      if (Object.keys(newVacancies).length > 0) {
        setLots(prevLots =>
          prevLots.map(lot => {
            const lotVacancies = newVacancies[lot.id];
            if (lotVacancies && lotVacancies.length > 0) {
              return {
                ...lot,
                vacancies: lotVacancies,
                dataUpdatedAt: lotVacancies[0]?.updatedAt || new Date().toISOString()
              };
            }
            return lot;
          })
        );
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.warn('Could not refresh dynamic vacancies:', err);
    } finally {
      setIsRefreshing(false);
      setSecondsUntilNextRefresh(REFRESH_INTERVAL_SECONDS);
    }
  }, []);

  // Initial trigger
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Periodic refresh & countdown timer
  useEffect(() => {
    // Refresh interval
    timerRef.current = setInterval(() => {
      refreshVacancies(false);
    }, REFRESH_INTERVAL_SECONDS * 1000);

    // Countdown interval (every second)
    countdownRef.current = setInterval(() => {
      setSecondsUntilNextRefresh(prev => (prev > 1 ? prev - 1 : REFRESH_INTERVAL_SECONDS));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [refreshVacancies]);

  // Manual refresh trigger
  const handleManualRefresh = useCallback(() => {
    refreshVacancies(true);
  }, [refreshVacancies]);

  return {
    lots,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    isOffline,
    isUsingCachedData,
    secondsUntilNextRefresh,
    refreshNow: handleManualRefresh,
    retryInitialLoad: () => loadData(true)
  };
}
