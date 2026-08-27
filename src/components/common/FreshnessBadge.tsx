import React from 'react';
import { FreshnessStatus, LocalizedString } from '../../domain/types';
import { Clock, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { useI18n } from '../../i18n/context';

interface FreshnessBadgeProps {
  status: FreshnessStatus;
  text?: LocalizedString;
  showIcon?: boolean;
  className?: string;
}

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({
  status,
  text,
  showIcon = true,
  className = ''
}) => {
  const { lang, t } = useI18n();

  const getBadgeStyle = () => {
    switch (status) {
      case 'LIVE':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
      case 'RECENT':
        return 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20';
      case 'STALE':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20';
      case 'VERY_STALE':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'LIVE':
        return <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />;
      case 'RECENT':
        return <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />;
      case 'STALE':
      case 'VERY_STALE':
        return <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />;
      default:
        return <HelpCircle className="w-3 h-3 text-slate-500" />;
    }
  };

  const displayText = text
    ? text[lang]
    : status === 'LIVE'
    ? t.freshness.live
    : status === 'RECENT'
    ? t.freshness.recent
    : status === 'STALE'
    ? t.freshness.stale
    : status === 'VERY_STALE'
    ? t.freshness.veryStale
    : t.freshness.unknown;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()} ${className}`}
      title={t.freshness.disclaimer}
    >
      {showIcon && getIcon()}
      <span className="truncate">{displayText}</span>
    </span>
  );
};
