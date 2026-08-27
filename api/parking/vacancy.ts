import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Vacancy, VehicleType } from '../../src/domain/types';

const cache: {
  vacancies: Record<string, Vacancy[]> | null;
  vacanciesTimestamp: number;
} = {
  vacancies: null,
  vacanciesTimestamp: 0
};

const VACANCY_CACHE_TTL = 45 * 1000; // 45 seconds

export async function getVacancies(): Promise<Record<string, Vacancy[]>> {
  const now = Date.now();
  if (cache.vacancies && now - cache.vacanciesTimestamp < VACANCY_CACHE_TTL) {
    return cache.vacancies;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('https://api.data.gov.hk/v1/carpark-info-vacancy?data=vacancy', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json', 'User-Agent': 'ParkingHK-App/1.0' }
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = (await res.json()) as any;
      const results = data?.results || [];
      if (Array.isArray(results) && results.length > 0) {
        const vacanciesMap: Record<string, Vacancy[]> = {};
        for (const item of results) {
          const parkId = item.park_Id || item.parkId;
          if (!parkId) continue;
          const entries: Vacancy[] = [];
          for (const key of ['privateCar', 'motorCycle', 'LGV', 'HGV', 'coach'] as const) {
            const v = item[key];
            if (Array.isArray(v) && v.length > 0) {
              const entry = v[0];
              const count = typeof entry.vacancy === 'number' && entry.vacancy >= 0 ? entry.vacancy : null;
              const vt: VehicleType = key === 'privateCar' ? 'PRIVATE_CAR' : key === 'motorCycle' ? 'MOTORCYCLE' : key === 'LGV' ? 'LGV' : key === 'HGV' ? 'HGV' : 'COACH';
              entries.push({ vehicleType: vt, serviceCategory: 'HOURLY', vacancy: count, vacancyType: entry.vacancy_type || 'A', updatedAt: entry.lastupdate || new Date().toISOString() });
            }
          }
          if (entries.length > 0) vacanciesMap[parkId] = entries;
        }
        if (Object.keys(vacanciesMap).length > 0) {
          cache.vacancies = vacanciesMap;
          cache.vacanciesTimestamp = now;
          return vacanciesMap;
        }
      }
    }
    return {};
  } catch (err) {
    console.warn('Could not fetch live vacancy from data.gov.hk:', (err as Error).message);
    return {};
  }
}

export function forceVacancyRefresh(): void {
  cache.vacanciesTimestamp = 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.query.force === 'true') {
      forceVacancyRefresh();
    }
    const vacanciesMap = await getVacancies();
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      vacancies: vacanciesMap
    });
  } catch (error) {
    console.error('Error refreshing vacancies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh vacancies'
    });
  }
}
