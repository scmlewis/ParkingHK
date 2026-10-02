import { ParkingLot, Vacancy } from '../domain/types';
// NOTE: seed dataset is dynamically imported ONLY on the fallback path so it
// never ships inside the initial bundle on the happy path (see catch below).

const CACHE_KEY_PARKING_LOTS = 'parkinghk_cached_lots_v1';
const CACHE_KEY_LAST_FETCH = 'parkinghk_last_fetch_ts';

export type DataSource = 'live' | 'cached' | 'seed';

export async function fetchAllParkingLots(): Promise<{ lots: ParkingLot[]; dataSource: DataSource; timestamp: string }> {
  try {
    const res = await fetch('/api/parking/all', {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      // Persist to localStorage for offline cache — deferred off the critical
      // path (JSON serialization of ~575 lots stalls the main thread) with a
      // size guard so quota errors can't break the happy path.
      const payload = json.data;
      const persist = () => {
        try {
          const serialized = JSON.stringify(payload);
          if (serialized.length > 4 * 1024 * 1024) return; // skip oversized payloads
          localStorage.setItem(CACHE_KEY_PARKING_LOTS, serialized);
          localStorage.setItem(CACHE_KEY_LAST_FETCH, json.timestamp || new Date().toISOString());
        } catch {
          // LocalStorage quota or private mode error
        }
      };
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(persist, { timeout: 5000 });
      } else {
        setTimeout(persist, 0);
      }
      return {
        lots: json.data,
        dataSource: 'live',
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
            dataSource: 'cached',
            timestamp: ts || new Date().toISOString()
          };
        }
      }
    } catch {
      // Ignore
    }

    // Last resort: bundled seed dataset (lazy chunk, only fetched on total failure)
    const { HK_CARPARK_SEED_DATA } = await import('../server/mockData');
    return {
      lots: HK_CARPARK_SEED_DATA,
      dataSource: 'seed',
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
