import {
  ParkingLot,
  ParkingScoreBreakdown,
  ScoredParkingLot,
  VehicleType,
  VacancyStatus
} from '../domain/types';
import { calculateDistanceMeters, estimateWalkingMinutes } from './distanceService';
import { getFreshnessStatus, formatRelativeTime } from './freshnessService';

export function calculateParkingScore(
  lot: ParkingLot,
  targetLat: number | null,
  targetLng: number | null,
  selectedVehicleType: VehicleType = 'PRIVATE_CAR'
): ScoredParkingLot {
  // 1. Find matching vacancy for vehicle type
  const targetVacancy = lot.vacancies.find(v => v.vehicleType === selectedVehicleType) ||
    lot.vacancies[0] ||
    null;

  const vacancyCount = targetVacancy?.vacancy ?? null;

  // Classify vacancy status
  let vacancyStatus: VacancyStatus = 'UNKNOWN';
  if (vacancyCount !== null) {
    if (vacancyCount <= 0) {
      vacancyStatus = 'FULL';
    } else if (vacancyCount < 10) {
      vacancyStatus = 'LIMITED';
    } else {
      vacancyStatus = 'AVAILABLE';
    }
  }

  // 2. Availability score (out of 40)
  // Closed lots get 0 — vacancies are irrelevant when the lot is not operating
  // Unknown vacancy gets a low score — must not outperform known-full lots
  let availabilityScore = 0;
  if (lot.openingStatus === 'CLOSED') {
    availabilityScore = 0;
  } else if (vacancyCount === null) {
    availabilityScore = 5;
  } else if (vacancyCount === 0) {
    availabilityScore = 0;
  } else if (vacancyCount < 5) {
    availabilityScore = 12;
  } else if (vacancyCount < 15) {
    availabilityScore = 24;
  } else if (vacancyCount < 30) {
    availabilityScore = 34;
  } else {
    availabilityScore = 40;
  }

  // 3. Distance score (out of 25)
  const distanceMeters = calculateDistanceMeters(
    targetLat,
    targetLng,
    lot.latitude,
    lot.longitude
  );
  const walkingMinutes = estimateWalkingMinutes(distanceMeters);

  // Unknown distance gets a low score — must not outperform known-far lots
  let distanceScore = 5;
  if (distanceMeters !== null) {
    if (distanceMeters <= 250) {
      distanceScore = 25;
    } else if (distanceMeters <= 500) {
      distanceScore = 22;
    } else if (distanceMeters <= 1000) {
      distanceScore = 18;
    } else if (distanceMeters <= 2000) {
      distanceScore = 12;
    } else if (distanceMeters <= 4000) {
      distanceScore = 6;
    } else {
      distanceScore = 2;
    }
  }

  // 4. Price score (out of 20)
  // Standard HK hourly rates: <$20 (very cheap), $20-$30 (standard), $31-$45 (premium), >$45 (expensive)
  // Unknown price gets a low score — must not outperform known-expensive lots
  let priceScore = 5;
  const hourlyRate = lot.pricing?.hourlyRate;
  if (hourlyRate != null) {
    if (hourlyRate <= 18) {
      priceScore = 20;
    } else if (hourlyRate <= 25) {
      priceScore = 17;
    } else if (hourlyRate <= 32) {
      priceScore = 14;
    } else if (hourlyRate <= 40) {
      priceScore = 10;
    } else if (hourlyRate <= 50) {
      priceScore = 6;
    } else {
      priceScore = 2;
    }
  }

  // 5. Opening status score (out of 10)
  let openingScore = 2;
  if (lot.openingStatus === 'OPEN') {
    openingScore = 10;
  } else if (lot.openingStatus === 'CLOSED') {
    openingScore = 0;
  }

  // 6. Freshness score (out of 5)
  const timestampStr = targetVacancy?.updatedAt || lot.dataUpdatedAt;
  const freshness = getFreshnessStatus(timestampStr);
  let freshnessScore = 2;
  if (freshness === 'LIVE') {
    freshnessScore = 5;
  } else if (freshness === 'RECENT') {
    freshnessScore = 4;
  } else if (freshness === 'STALE') {
    freshnessScore = 2;
  } else if (freshness === 'VERY_STALE') {
    freshnessScore = 1;
  }

  // Total score calculation
  const totalScore = Math.min(100, Math.max(0, Math.round(
    availabilityScore +
    distanceScore +
    priceScore +
    openingScore +
    freshnessScore
  )));

  // Generate explainable bullet reasons
  const reasonsEn: string[] = [];
  const reasonsTc: string[] = [];

  // Availability reason
  if (vacancyCount !== null) {
    if (vacancyCount >= 20) {
      reasonsEn.push(`Ample spaces available (${vacancyCount} vacancies)`);
      reasonsTc.push(`車位充裕 (尚餘 ${vacancyCount} 個空位)`);
    } else if (vacancyCount > 0) {
      reasonsEn.push(`${vacancyCount} spaces currently available`);
      reasonsTc.push(`尚有 ${vacancyCount} 個空位`);
    } else {
      reasonsEn.push(`Currently marked as full`);
      reasonsTc.push(`目前顯示已客滿`);
    }
  }

  // Distance reason
  if (distanceMeters !== null) {
    if (distanceMeters <= 400) {
      reasonsEn.push(`Very close (${distanceMeters}m, ~${walkingMinutes} min walk)`);
      reasonsTc.push(`極近目的地 (${distanceMeters} 米，步行約 ${walkingMinutes} 分鐘)`);
    } else if (distanceMeters <= 1000) {
      reasonsEn.push(`Within walking distance (${(distanceMeters / 1000).toFixed(1)}km)`);
      reasonsTc.push(`步行可達距離 (${(distanceMeters / 1000).toFixed(1)} 公里)`);
    }
  }

  // Price reason
  if (hourlyRate !== undefined && hourlyRate !== null) {
    if (hourlyRate <= 22) {
      reasonsEn.push(`Competitive rate: HK$${hourlyRate}/hr`);
      reasonsTc.push(`收費相宜：HK$${hourlyRate} / 小時`);
    } else {
      reasonsEn.push(`Standard rate: HK$${hourlyRate}/hr`);
      reasonsTc.push(`泊車時租：HK$${hourlyRate} / 小時`);
    }
  }

  // Facilities reason
  if (lot.facilities?.evCharging) {
    reasonsEn.push('EV charging facilities available');
    reasonsTc.push('設有電動車充電泊位');
  }

  // Freshness reason
  if (freshness === 'LIVE') {
    reasonsEn.push('Live data updated less than 2 minutes ago');
    reasonsTc.push('2 分鐘內最新即時政府數據');
  }

  const scoreBreakdown: ParkingScoreBreakdown = {
    totalScore,
    availabilityScore,
    distanceScore,
    priceScore,
    openingScore,
    freshnessScore,
    reasons: {
      en: reasonsEn,
      tc: reasonsTc
    }
  };

  return {
    lot,
    distanceMeters,
    walkingMinutes,
    scoreBreakdown,
    selectedVacancy: targetVacancy,
    vacancyStatus,
    freshness,
    freshnessText: formatRelativeTime(timestampStr)
  };
}
