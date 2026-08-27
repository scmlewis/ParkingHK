import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'parkinghk_favourite_ids_v1';

export function useFavourites() {
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return ['td_cp_001', 'td_cp_005']; // Provide 2 default demo favourites for instant delight
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteIds));
    } catch {
      // LocalStorage full / private mode
    }
  }, [favouriteIds]);

  const toggleFavourite = useCallback((id: string) => {
    setFavouriteIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const isFavourite = useCallback((id: string) => {
    return favouriteIds.includes(id);
  }, [favouriteIds]);

  return {
    favouriteIds,
    toggleFavourite,
    isFavourite,
    count: favouriteIds.length
  };
}
