import { FreshnessStatus, LocalizedString } from '../domain/types';

export function getFreshnessStatus(timestampStr?: string): FreshnessStatus {
  if (!timestampStr) return 'UNKNOWN';

  try {
    const updatedAt = new Date(timestampStr).getTime();
    if (isNaN(updatedAt)) return 'UNKNOWN';

    const now = Date.now();
    const diffMs = now - updatedAt;

    // Handle future clock skew gracefully
    if (diffMs < 0) return 'LIVE';

    const diffMinutes = diffMs / (1000 * 60);

    if (diffMinutes < 2) {
      return 'LIVE';
    } else if (diffMinutes < 5) {
      return 'RECENT';
    } else if (diffMinutes < 15) {
      return 'STALE';
    } else {
      return 'VERY_STALE';
    }
  } catch {
    return 'UNKNOWN';
  }
}

export function formatRelativeTime(timestampStr?: string, lang: 'en' | 'tc' = 'tc'): LocalizedString {
  if (!timestampStr) {
    return {
      en: 'Update time unknown',
      tc: '更新時間未知'
    };
  }

  try {
    const updatedAt = new Date(timestampStr).getTime();
    if (isNaN(updatedAt)) {
      return { en: 'Update time unknown', tc: '更新時間未知' };
    }

    const now = Date.now();
    const diffSeconds = Math.max(0, Math.round((now - updatedAt) / 1000));

    if (diffSeconds < 60) {
      return {
        en: `Updated ${diffSeconds}s ago`,
        tc: `${diffSeconds} 秒前更新`
      };
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return {
        en: `Updated ${diffMinutes}m ago`,
        tc: `${diffMinutes} 分鐘前更新`
      };
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return {
        en: `Updated ${diffHours}h ago`,
        tc: `${diffHours} 小時前更新`
      };
    }

    const date = new Date(updatedAt);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return {
      en: `Updated at ${dateStr}`,
      tc: `於 ${dateStr} 更新`
    };
  } catch {
    return { en: 'Update time unknown', tc: '更新時間未知' };
  }
}

export function getFreshnessLabel(status: FreshnessStatus, lang: 'en' | 'tc' = 'tc'): string {
  switch (status) {
    case 'LIVE':
      return lang === 'tc' ? '即時更新' : 'Live (<2m)';
    case 'RECENT':
      return lang === 'tc' ? '近期數據' : 'Recent (2-5m)';
    case 'STALE':
      return lang === 'tc' ? '稍早數據' : 'Stale (5-15m)';
    case 'VERY_STALE':
      return lang === 'tc' ? '非即時數據' : 'Very Stale (>15m)';
    default:
      return lang === 'tc' ? '狀態未知' : 'Status Unknown';
  }
}
