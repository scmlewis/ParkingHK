/**
 * Distance and walking time calculations for ParkingHK
 */

// Haversine formula calculating great-circle distance in meters between two lat/lng points
export function calculateDistanceMeters(
  lat1: number | null | undefined,
  lon1: number | null | undefined,
  lat2: number | null | undefined,
  lon2: number | null | undefined
): number | null {
  if (
    lat1 === null || lat1 === undefined ||
    lon1 === null || lon1 === undefined ||
    lat2 === null || lat2 === undefined ||
    lon2 === null || lon2 === undefined ||
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
  ) {
    return null;
  }

  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Format distance string (e.g. "350 m" or "1.2 km")
export function formatDistance(meters: number | null, lang: 'en' | 'tc' = 'tc'): string {
  if (meters === null || meters === undefined) {
    return lang === 'tc' ? '距離未知' : 'Distance unknown';
  }

  if (meters < 1000) {
    return `${meters} m`;
  }

  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

// Estimate walking / transit time contextually based on distance
export function estimateWalkingMinutes(meters: number | null): number | null {
  if (meters === null || meters === undefined) return null;
  const effectiveDistance = meters * 1.25;
  const minutes = Math.max(1, Math.round(effectiveDistance / 75));
  return minutes;
}

export function formatWalkingTime(minutes: number | null, lang: 'en' | 'tc' = 'tc', meters?: number | null): string {
  if (meters !== undefined && meters !== null) {
    if (meters <= 1200) {
      const walkMin = Math.max(1, Math.round((meters * 1.25) / 75));
      return lang === 'tc' ? `步行約 ${walkMin} 分鐘` : `~${walkMin} min walk`;
    }
    // Driving estimate for > 1.2km
    const driveMin = Math.max(2, Math.round((meters / 1000) / 0.45)); // ~27 km/h urban traffic speed
    return lang === 'tc' ? `車程約 ${driveMin} 分鐘` : `~${driveMin} min drive`;
  }

  if (minutes === null) return '';
  if (minutes > 20) {
    // If minutes passed was raw walking estimate for long distance, scale to drive time
    const driveMin = Math.max(3, Math.round(minutes / 7.5));
    return lang === 'tc' ? `車程約 ${driveMin} 分鐘` : `~${driveMin} min drive`;
  }
  if (lang === 'tc') {
    return `步行約 ${minutes} 分鐘`;
  }
  return `~${minutes} min walk`;
}
