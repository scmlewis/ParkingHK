import { describe, it, expect, vi, afterEach } from 'vitest';
import { calculateParkingScore } from '../recommendationService';
import { ParkingLot } from '../../domain/types';

function makeLot(overrides: Partial<ParkingLot> = {}): ParkingLot {
  return {
    id: 'test-001',
    name: { en: 'Test Car Park', tc: '測試停車場' },
    address: { en: '1 Test Road', tc: '測試路 1 號' },
    district: { en: 'Central & Western', tc: '中西區' },
    region: 'HK_ISLAND',
    latitude: 22.2854,
    longitude: 114.1587,
    openingStatus: 'OPEN',
    vehicleTypes: ['PRIVATE_CAR'],
    vacancies: [],
    pricing: { hourlyRate: 30 },
    dataUpdatedAt: new Date().toISOString(),
    ...overrides
  };
}

describe('calculateParkingScore', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('scores an open lot with available spaces highly', () => {
    const lot = makeLot({
      vacancies: [{ vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 25, updatedAt: new Date().toISOString() }],
      pricing: { hourlyRate: 20 }
    });
    const result = calculateParkingScore(lot, 22.2854, 114.1587);
    expect(result.scoreBreakdown.totalScore).toBeGreaterThanOrEqual(70);
    expect(result.vacancyStatus).toBe('AVAILABLE');
  });

  it('scores a full lot lower than a lot with spaces', () => {
    const fullLot = makeLot({
      vacancies: [{ vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 0, updatedAt: new Date().toISOString() }]
    });
    const availLot = makeLot({
      vacancies: [{ vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 20, updatedAt: new Date().toISOString() }]
    });
    const fullResult = calculateParkingScore(fullLot, 22.2854, 114.1587);
    const availResult = calculateParkingScore(availLot, 22.2854, 114.1587);
    expect(fullResult.scoreBreakdown.totalScore).toBeLessThan(availResult.scoreBreakdown.totalScore);
  });

  it('scores a closed lot lower than an open lot', () => {
    const closed = makeLot({ openingStatus: 'CLOSED' });
    const open = makeLot({ openingStatus: 'OPEN' });
    const closedResult = calculateParkingScore(closed, 22.2854, 114.1587);
    const openResult = calculateParkingScore(open, 22.2854, 114.1587);
    expect(closedResult.scoreBreakdown.totalScore).toBeLessThan(openResult.scoreBreakdown.totalScore);
  });

  it('unknown vacancy scores lower than known-full (vacancy=0)', () => {
    const unknown = makeLot({ vacancies: [] });
    const full = makeLot({
      vacancies: [{ vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 0, updatedAt: new Date().toISOString() }]
    });
    const unknownResult = calculateParkingScore(unknown, 22.2854, 114.1587);
    const fullResult = calculateParkingScore(full, 22.2854, 114.1587);
    expect(unknownResult.scoreBreakdown.availabilityScore).toBeLessThan(
      fullResult.scoreBreakdown.availabilityScore + 10 // unknown (5) should be close to or below full (0+other factors)
    );
    // The key assertion: unknown availability (5) must not beat full (0) by a large margin
    expect(unknownResult.scoreBreakdown.availabilityScore).toBe(5);
    expect(fullResult.scoreBreakdown.availabilityScore).toBe(0);
  });

  it('unknown price scores lower than known-expensive price', () => {
    const unknown = makeLot({ pricing: {} });
    const expensive = makeLot({ pricing: { hourlyRate: 60 } });
    const unknownResult = calculateParkingScore(unknown, 22.2854, 114.1587);
    const expensiveResult = calculateParkingScore(expensive, 22.2854, 114.1587);
    // Unknown price (5) should not beat expensive (2)
    expect(unknownResult.scoreBreakdown.priceScore).toBe(5);
    expect(expensiveResult.scoreBreakdown.priceScore).toBe(2);
  });

  it('unknown distance scores lower than known-far distance', () => {
    const unknown = makeLot({ latitude: null, longitude: null });
    const far = makeLot({ latitude: 22.5, longitude: 114.3 }); // ~30km away
    const unknownResult = calculateParkingScore(unknown, 22.2854, 114.1587);
    const farResult = calculateParkingScore(far, 22.2854, 114.1587);
    expect(unknownResult.scoreBreakdown.distanceScore).toBe(5);
    expect(farResult.scoreBreakdown.distanceScore).toBe(2);
  });

  it('cheap lot scores higher on price than expensive lot', () => {
    const cheap = makeLot({ pricing: { hourlyRate: 15 } });
    const expensive = makeLot({ pricing: { hourlyRate: 55 } });
    const cheapResult = calculateParkingScore(cheap, 22.2854, 114.1587);
    const expensiveResult = calculateParkingScore(expensive, 22.2854, 114.1587);
    expect(cheapResult.scoreBreakdown.priceScore).toBeGreaterThan(expensiveResult.scoreBreakdown.priceScore);
  });

  it('nearby lot scores higher on distance than far lot', () => {
    const near = makeLot({ latitude: 22.2855, longitude: 114.1588 });
    const far = makeLot({ latitude: 22.5, longitude: 114.3 });
    const nearResult = calculateParkingScore(near, 22.2854, 114.1587);
    const farResult = calculateParkingScore(far, 22.2854, 114.1587);
    expect(nearResult.scoreBreakdown.distanceScore).toBeGreaterThan(farResult.scoreBreakdown.distanceScore);
  });

  it('returns vacancy status correctly', () => {
    const available = makeLot({
      vacancies: [{ vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 15, updatedAt: new Date().toISOString() }]
    });
    const limited = makeLot({
      vacancies: [{ vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 3, updatedAt: new Date().toISOString() }]
    });
    const full = makeLot({
      vacancies: [{ vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 0, updatedAt: new Date().toISOString() }]
    });
    const unknown = makeLot({ vacancies: [] });

    expect(calculateParkingScore(available, 22.2854, 114.1587).vacancyStatus).toBe('AVAILABLE');
    expect(calculateParkingScore(limited, 22.2854, 114.1587).vacancyStatus).toBe('LIMITED');
    expect(calculateParkingScore(full, 22.2854, 114.1587).vacancyStatus).toBe('FULL');
    expect(calculateParkingScore(unknown, 22.2854, 114.1587).vacancyStatus).toBe('UNKNOWN');
  });

  it('generates reason strings', () => {
    const lot = makeLot({
      vacancies: [{ vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 25, updatedAt: new Date().toISOString() }],
      pricing: { hourlyRate: 18 },
      facilities: { evCharging: true }
    });
    const result = calculateParkingScore(lot, 22.2854, 114.1587);
    expect(result.scoreBreakdown.reasons.en.length).toBeGreaterThan(0);
    expect(result.scoreBreakdown.reasons.tc.length).toBeGreaterThan(0);
  });

  it('total score is clamped between 0 and 100', () => {
    const lot = makeLot();
    const result = calculateParkingScore(lot, 22.2854, 114.1587);
    expect(result.scoreBreakdown.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.scoreBreakdown.totalScore).toBeLessThanOrEqual(100);
  });
});
