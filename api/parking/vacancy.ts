import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getVacancies, forceVacancyRefresh } from '../lib/dataService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Force refresh if query param ?force=true
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
