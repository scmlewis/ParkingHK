import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    service: 'ParkingHK API',
    timestamp: new Date().toISOString(),
    version: '1.2.0'
  });
}
