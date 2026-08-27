import { useState, useEffect } from 'react';
import { ThemeMode, SortOption, VehicleType, FilterState } from '../domain/types';

const STORAGE_THEME = 'parkinghk_theme_mode';
const STORAGE_SORT = 'parkinghk_sort_pref';
const STORAGE_VEHICLE = 'parkinghk_vehicle_pref';

export const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  vehicleType: 'PRIVATE_CAR',
  district: 'ALL',
  region: 'ALL',
  openingStatusOnly: false,
  onlyWithVacancy: false,
  maxDistanceKm: Infinity,
  maxHourlyRate: Infinity,
  evChargingOnly: false,
  limitToMapZone: true
};

export function usePreferences() {
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  const [sortOption, setSortOption] = useState<SortOption>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SORT);
      if (stored === 'recommended' || stored === 'distance' || stored === 'vacancy' || stored === 'price') {
        return stored;
      }
    } catch {
      // Ignore
    }
    return 'recommended';
  });

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Apply dark theme exclusively to DOM documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
  }, []);

  const setTheme = (_newTheme: ThemeMode) => {
    // App is dark mode focused exclusively
    setThemeState('dark');
  };

  const handleSetSortOption = (newSort: SortOption) => {
    setSortOption(newSort);
    try {
      localStorage.setItem(STORAGE_SORT, newSort);
    } catch {
      // Ignore
    }
  };

  const setVehicleType = (vType: VehicleType) => {
    setFilters(prev => ({ ...prev, vehicleType: vType }));
    try {
      localStorage.setItem(STORAGE_VEHICLE, vType);
    } catch {
      // Ignore
    }
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return {
    theme,
    setTheme,
    sortOption,
    setSortOption: handleSetSortOption,
    filters,
    setFilters,
    setVehicleType,
    resetFilters
  };
}
