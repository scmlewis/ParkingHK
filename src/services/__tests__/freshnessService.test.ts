import { describe, it, expect, vi, afterEach } from 'vitest';
import { getFreshnessStatus, formatRelativeTime, getFreshnessLabel } from '../freshnessService';

describe('getFreshnessStatus', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns UNKNOWN for undefined timestamp', () => {
    expect(getFreshnessStatus(undefined)).toBe('UNKNOWN');
  });

  it('returns UNKNOWN for empty string', () => {
    expect(getFreshnessStatus('')).toBe('UNKNOWN');
  });

  it('returns UNKNOWN for invalid date string', () => {
    expect(getFreshnessStatus('not-a-date')).toBe('UNKNOWN');
  });

  it('returns LIVE for timestamp within 2 minutes', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const twoMinAgo = new Date(now - 2 * 60 * 1000 + 1000).toISOString();
    expect(getFreshnessStatus(twoMinAgo)).toBe('LIVE');
  });

  it('returns RECENT for timestamp 2-5 minutes ago', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const threeMinAgo = new Date(now - 3 * 60 * 1000).toISOString();
    expect(getFreshnessStatus(threeMinAgo)).toBe('RECENT');
  });

  it('returns STALE for timestamp 5-15 minutes ago', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const tenMinAgo = new Date(now - 10 * 60 * 1000).toISOString();
    expect(getFreshnessStatus(tenMinAgo)).toBe('STALE');
  });

  it('returns VERY_STALE for timestamp older than 15 minutes', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const twentyMinAgo = new Date(now - 20 * 60 * 1000).toISOString();
    expect(getFreshnessStatus(twentyMinAgo)).toBe('VERY_STALE');
  });

  it('returns LIVE for future timestamp (clock skew)', () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const future = new Date(now + 5 * 60 * 1000).toISOString();
    expect(getFreshnessStatus(future)).toBe('LIVE');
  });
});

describe('formatRelativeTime', () => {
  it('returns unknown message for undefined timestamp', () => {
    const result = formatRelativeTime(undefined);
    expect(result.en).toContain('unknown');
    expect(result.tc).toContain('未知');
  });

  it('returns seconds ago for recent timestamps', () => {
    const now = new Date().toISOString();
    const result = formatRelativeTime(now);
    expect(result.en).toMatch(/\d+s ago/);
  });
});

describe('getFreshnessLabel', () => {
  it('returns correct English labels', () => {
    expect(getFreshnessLabel('LIVE', 'en')).toContain('Live');
    expect(getFreshnessLabel('RECENT', 'en')).toContain('Recent');
    expect(getFreshnessLabel('STALE', 'en')).toContain('Stale');
    expect(getFreshnessLabel('VERY_STALE', 'en')).toContain('Very Stale');
    expect(getFreshnessLabel('UNKNOWN', 'en')).toContain('Unknown');
  });

  it('returns correct Chinese labels', () => {
    expect(getFreshnessLabel('LIVE', 'tc')).toBe('即時更新');
    expect(getFreshnessLabel('RECENT', 'tc')).toBe('近期數據');
    expect(getFreshnessLabel('STALE', 'tc')).toBe('稍早數據');
    expect(getFreshnessLabel('VERY_STALE', 'tc')).toBe('非即時數據');
    expect(getFreshnessLabel('UNKNOWN', 'tc')).toBe('狀態未知');
  });
});
