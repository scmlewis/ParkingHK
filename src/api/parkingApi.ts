import { ParkingLot, Vacancy } from '../domain/types';
import { HK_CARPARK_SEED_DATA } from '../server/mockData';

const CACHE_KEY_PARKING_LOTS = 'parkinghk_cached_lots_v1';
const CACHE_KEY_LAST_FETCH = 'parkinghk_last_fetch_ts';

export async function fetchAllParkingLots(): Promise<{ lots: ParkingLot[]; isCached: boolean; timestamp: string }> {
  try {
    const res = await fetch('/api/parking/all', {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      // Save to localStorage for offline cache
      try {
        localStorage.setItem(CACHE_KEY_PARKING_LOTS, JSON.stringify(json.data));
        localStorage.setItem(CACHE_KEY_LAST_FETCH, json.timestamp || new Date().toISOString());
      } catch {
        // LocalStorage quota or private mode error
      }
      return {
        lots: json.data,
        isCached: false,
        timestamp: json.timestamp || new Date().toISOString()
      };
    }
    throw new Error('Invalid API response structure');
  } catch (err) {
    console.warn('Falling back to local cache or seed dataset:', (err as Error).message);

    // Try reading cached data from localStorage
    try {
      const cached = localStorage.getItem(CACHE_KEY_PARKING_LOTS);
      const ts = localStorage.getItem(CACHE_KEY_LAST_FETCH);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            lots: parsed,
            isCached: true,
            timestamp: ts || new Date().toISOString()
          };
        }
      }
    } catch {
      // Ignore
    }

    return {
      lots: HK_CARPARK_SEED_DATA,
      isCached: true,
      timestamp: new Date().toISOString()
    };
  }
}

export async function fetchVacanciesOnly(force = false): Promise<Record<string, Vacancy[]>> {
  try {
    const url = force ? '/api/parking/vacancy?force=true' : '/api/parking/vacancy';
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.vacancies) {
      return json.vacancies;
    }
    return {};
  } catch (err) {
    console.warn('Failed to fetch vacancies endpoint:', (err as Error).message);
    return {};
  }
}
