import React from 'react';
import { Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n/context';

interface ScoreBadgeProps {
  score: number;
  onExplainClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  onExplainClick,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const { lang, t } = useI18n();

  const getColor = () => {
    if (score >= 85) return 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-xs';
    if (score >= 70) return 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-xs';
    if (score >= 50) return 'bg-slate-800 text-slate-300 border-slate-700';
    return 'bg-slate-900 text-slate-400 border-slate-800';
  };

  const getSparkleColor = () => {
    if (score >= 85) return 'text-amber-400';
    if (score >= 70) return 'text-sky-400';
    if (score >= 50) return 'text-amber-400/70';
    return 'text-slate-500';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5 font-semibold',
    lg: 'px-3 py-1.5 text-base gap-2 font-bold'
  }[size];

  const sparkleSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  if (onExplainClick) {
    return (
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onExplainClick();
        }}
        className={`inline-flex items-center rounded-xl border font-mono transition-all hover:scale-105 active:scale-95 min-h-[32px] ${getColor()} ${sizeClasses} cursor-pointer hover:shadow-md ${className}`}
        title={`${t.score.title}: ${score}/100 - ${t.score.whyRecommended}`}
      >
        <Sparkles className={`${sparkleSizes} ${getSparkleColor()}`} />
        <span className="font-bold tracking-tight text-white">
          {score}
        </span>
        {showLabel && size !== 'sm' && (
          <span className="text-[11px] font-sans text-slate-300 font-normal">
            {lang === 'tc' ? '分' : 'pts'}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-xl border font-mono ${getColor()} ${sizeClasses} cursor-default select-none ${className}`}
      title={`${t.score.title}: ${score}/100`}
    >
      <Sparkles className={`${sparkleSizes} ${getSparkleColor()}`} />
      <span className="font-bold tracking-tight text-white">
        {score}
      </span>
      {showLabel && size !== 'sm' && (
        <span className="text-[11px] font-sans text-slate-300 font-normal">
          {lang === 'tc' ? '分' : 'pts'}
        </span>
      )}
    </div>
  );
};

