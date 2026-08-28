import { describe, it, expect } from 'vitest';
import { calculateDistanceMeters, estimateWalkingMinutes } from '../distanceService';

describe('calculateDistanceMeters', () => {
  it('returns null when either point is null', () => {
    expect(calculateDistanceMeters(null, null, 22.3, 114.2)).toBeNull();
    expect(calculateDistanceMeters(22.3, 114.2, null, null)).toBeNull();
  });

  it('returns 0 for identical coordinates', () => {
    const dist = calculateDistanceMeters(22.2854, 114.1587, 22.2854, 114.1587);
    expect(dist).toBe(0);
  });

  it('calculates reasonable distance between IFC and Times Square (~3km)', () => {
    const dist = calculateDistanceMeters(22.2854, 114.1587, 22.2783, 114.1824);
    expect(dist).toBeGreaterThan(2000);
    expect(dist).toBeLessThan(4000);
  });

  it('returns a non-negative number', () => {
    const dist = calculateDistanceMeters(22.3, 114.1, 22.4, 114.2);
    expect(dist).toBeGreaterThanOrEqual(0);
  });
});

describe('estimateWalkingMinutes', () => {
  it('returns null for null distance', () => {
    expect(estimateWalkingMinutes(null)).toBeNull();
  });

  it('returns 1 for 0 distance (minimum walk time)', () => {
    expect(estimateWalkingMinutes(0)).toBe(1);
  });

  it('returns reasonable walking time (~5 min for 400m)', () => {
    const mins = estimateWalkingMinutes(400);
    expect(mins).toBeGreaterThanOrEqual(4);
    expect(mins).toBeLessThanOrEqual(7);
  });

  it('returns 1 for very short distances', () => {
    expect(estimateWalkingMinutes(50)).toBe(1);
  });
});
