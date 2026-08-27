import React from 'react';
import { VacancyStatus } from '../../domain/types';
import { useI18n } from '../../i18n/context';

interface VacancyBadgeProps {
  status: VacancyStatus;
  count: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VacancyBadge: React.FC<VacancyBadgeProps> = ({
  status,
  count,
  size = 'md',
  className = ''
}) => {
  const { t } = useI18n();

  const getTheme = () => {
    switch (status) {
      case 'AVAILABLE':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50',
          dot: 'bg-emerald-500 shadow-emerald-500/50'
        };
      case 'LIMITED':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/50',
          dot: 'bg-amber-500 shadow-amber-500/50'
        };
      case 'FULL':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700/50',
          dot: 'bg-rose-500 shadow-rose-500/50'
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          dot: 'bg-slate-400'
        };
    }
  };

  const theme = getTheme();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1.5',
    md: 'px-2.5 py-1 text-sm font-semibold gap-2',
    lg: 'px-3.5 py-1.5 text-base font-bold gap-2.5'
  }[size];

  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  }[size];

  let label = '';
  if (count === null) {
    label = t.status.unknown;
  } else if (count === 0) {
    label = t.status.full;
  } else {
    label = `${count} ${count === 1 ? t.status.space : t.status.spaces}`;
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg border shadow-xs ${theme.bg} ${sizeClasses} ${className}`}
    >
      <span className={`rounded-full shrink-0 ${theme.dot} ${dotSize} animate-pulse`} />
      <span className="tracking-tight whitespace-nowrap">{label}</span>
    </span>
  );
};
