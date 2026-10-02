import React, { memo } from 'react';
import {
  Zap,
  Navigation,
  Star,
  ChevronRight
} from 'lucide-react';
import { ScoredParkingLot } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { VacancyBadge } from './VacancyBadge';
import { ScoreBadge } from './ScoreBadge';
import { formatDistance, formatWalkingTime } from '../../services/distanceService';

export interface CarParkCardProps {
  scoredLot: ScoredParkingLot;
  isSelected?: boolean;
  // Stable handler references (called with scoredLot / lot id) so that
  // memo() can actually bail out — call sites must NOT wrap these in arrows
  onSelect?: (lot: ScoredParkingLot) => void;
  onOpenDetail: (lot: ScoredParkingLot) => void;
  onExplainScore?: (lot: ScoredParkingLot) => void;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  parkingDurationHours?: number;
}

export const CarParkCard: React.FC<CarParkCardProps> = memo(({
  scoredLot,
  isSelected = false,
  onSelect,
  onOpenDetail,
  onExplainScore,
  isFav,
  onToggleFav,
  parkingDurationHours = 2
}) => {
  const { lang } = useI18n();
  const { lot, scoreBreakdown, distanceMeters, walkingMinutes, selectedVacancy, vacancyStatus } = scoredLot;

  const hourlyRate = lot.pricing?.hourlyRate;
  const isEstimated = lot.pricing?.estimated === true;
  const displayRate = hourlyRate != null && !isEstimated ? hourlyRate : null;
  const totalCost = displayRate ? displayRate * parkingDurationHours : null;
  const formattedDist = distanceMeters !== undefined ? formatDistance(distanceMeters) : null;
  const formattedWalking = walkingMinutes !== undefined ? formatWalkingTime(walkingMinutes) : null;

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const lat = lot.latitude;
    const lng = lot.longitude;
    if (!lat || !lng) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.open(
        `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(lot.name[lang])}`,
        '_blank'
      );
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
          lot.name[lang]
        )}`,
        '_blank'
      );
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(scoredLot);
    } else {
      onOpenDetail(scoredLot);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`rounded-xl border p-2.5 sm:p-2.5 transition-all duration-150 cursor-pointer flex flex-col gap-1.5 shadow-sm select-none ${
        isSelected
          ? 'bg-slate-900 border-sky-500 ring-2 ring-sky-500/30 shadow-sky-950/50 -translate-y-0.5'
          : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Header: District Badge + Tags + Rates */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1 flex-wrap min-w-0 flex-1">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700/80 text-slate-300">
            {lot.district[lang]}
          </span>
          {lot.facilities?.evCharging && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-950 border border-sky-600/70 text-sky-300 flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" />
              <span>EV</span>
            </span>
          )}
          {lot.facilities?.covered && (
            <span className="text-[10px] font-medium px-1 py-0.5 rounded-md bg-slate-800/80 text-slate-400">
              {lang === 'tc' ? '室內' : 'Covered'}
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="text-right shrink-0">
          {displayRate != null ? (
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-sm font-black text-sky-400">${totalCost}</span>
              <span className="text-[10px] text-slate-400 font-medium">({parkingDurationHours}h)</span>
              <span className="text-[10px] text-slate-500 ml-0.5">${displayRate}/h</span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">
              {lang === 'tc' ? '現場公布' : 'On-site'}
            </span>
          )}
        </div>
      </div>

      {/* Carpark Name & Address */}
      <div className="min-w-0">
        <h3 className="text-xs sm:text-sm font-bold text-white leading-tight hover:text-sky-400 transition truncate">
          {lot.name[lang]}
        </h3>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">
          {lot.address[lang]}
        </p>
      </div>

      {/* Metrics Row: Vacancy Status, Distance, AI Score */}
      <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs">
        <div className="flex items-center gap-1.5">
          <VacancyBadge
            status={vacancyStatus}
            count={selectedVacancy?.vacancy ?? null}
            size="sm"
            isClosed={lot.openingStatus === 'CLOSED'}
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <span className="font-bold text-slate-200 text-xs">{formattedDist}</span>
            {formattedWalking && (
              <span className="text-[10px] text-slate-400 ml-1">({formattedWalking})</span>
            )}
          </div>

          <ScoreBadge
            score={scoreBreakdown.totalScore}
            size="sm"
            onExplainClick={onExplainScore ? (e => {
              e?.stopPropagation();
              onExplainScore(scoredLot);
            }) : undefined}
          />
        </div>
      </div>

      {/* Actions: Navigate, Detail, Favorite */}
      <div className="flex items-center gap-1.5 pt-0.5">
        <button
          type="button"
          onClick={handleDirections}
          className="flex-1 py-1 sm:py-1.5 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs shadow-sky-600/30 transition active:scale-95 cursor-pointer"
        >
          <Navigation className="w-3 h-3 fill-white" />
          <span>{lang === 'tc' ? '一鍵導航' : 'Directions'}</span>
        </button>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onOpenDetail(scoredLot);
          }}
          className="py-1 sm:py-1.5 px-2 sm:px-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-[11px] sm:text-xs font-semibold transition cursor-pointer flex items-center gap-0.5"
        >
          <span>{lang === 'tc' ? '詳情' : 'Details'}</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onToggleFav(lot.id);
          }}
          className={`p-1 sm:p-1.5 rounded-lg border transition cursor-pointer flex items-center justify-center ${
            isFav
              ? 'bg-amber-950/80 border-amber-500 text-amber-400'
              : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title={isFav ? 'Remove from Favorites' : 'Save'}
        >
          <Star className={`w-3 h-3 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      </div>
    </div>
  );
});

CarParkCard.displayName = 'CarParkCard';
