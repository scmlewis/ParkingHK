import { useState, useEffect, useCallback, useRef } from 'react';
import { ParkingLot } from '../domain/types';
import { fetchAllParkingLots, fetchVacanciesOnly, DataSource } from '../api/parkingApi';

export const REFRESH_INTERVAL_SECONDS = 60; // 60s as recommended in spec Section 11

export function useParkingData() {
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [dataSource, setDataSource] = useState<DataSource>('live');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Guards overlapping refreshes: timer + manual refresh + online-event
  // retries must never have two vacancy fetches in flight (last-to-resolve
  // would otherwise overwrite fresher data).
  const refreshInFlightRef = useRef<boolean>(false);

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
      setDataSource(result.dataSource);
      setLastUpdated(new Date(result.timestamp));
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
    if (refreshInFlightRef.current) return; // dedupe overlapping refreshes
    refreshInFlightRef.current = true;
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
      refreshInFlightRef.current = false;
      setIsRefreshing(false);
    }
  }, []);

  // Initial trigger
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Periodic refresh (no per-second countdown — that re-rendered the whole
  // tree 60x/min for a value nothing renders; refresh resets the cycle)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (document.hidden) return; // background tabs don't poll
      refreshVacancies(false);
    }, REFRESH_INTERVAL_SECONDS * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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
    dataSource,
    refreshNow: handleManualRefresh,
    retryInitialLoad: () => loadData(true)
  };
}
