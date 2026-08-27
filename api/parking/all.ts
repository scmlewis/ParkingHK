import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCarParksBasic, getVacancies } from '../lib/dataService';
import { ParkingLot } from '../../src/domain/types';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const [basicLots, vacanciesMap] = await Promise.all([
      getCarParksBasic(),
      getVacancies()
    ]);

    // Merge vacancies into basic lot models
    const merged: ParkingLot[] = basicLots.map(lot => {
      const lotVacancies = vacanciesMap[lot.id] || lot.vacancies || [];
      return {
        ...lot,
        vacancies: lotVacancies.length > 0 ? lotVacancies : lot.vacancies,
        dataUpdatedAt: lotVacancies[0]?.updatedAt || lot.dataUpdatedAt || new Date().toISOString()
      };
    });

    res.status(200).json({
      success: true,
      count: merged.length,
      timestamp: new Date().toISOString(),
      data: merged
    });
  } catch (error) {
    console.error('Error fetching parking lots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve parking data'
    });
  }
}
