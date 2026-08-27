import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin,
  ZoomIn,
  Compass,
  Sparkles
} from 'lucide-react';
import { ScoredParkingLot, SortOption, FilterState } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { CarParkCard } from '../common/CarParkCard';
import { DISTRICTS } from '../../constants/districts';

interface ModernListViewProps {
  lots: ScoredParkingLot[];
  isLoading: boolean;
  selectedLot: ScoredParkingLot | null;
  onSelectLot: (lot: ScoredParkingLot) => void;
  onOpenDetail: (lot: ScoredParkingLot) => void;
  onExplainScore: (lot: ScoredParkingLot) => void;
  isFavourite: (id: string) => boolean;
  onToggleFavourite: (id: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  parkingDurationHours: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  onSwitchToMap: () => void;
  currentZoom?: number;
  searchQuery?: string;
  onSelectDistrictZoom?: (lat: number, lng: number) => void;
}

const ITEMS_PER_BATCH = 25;

export const ModernListView: React.FC<ModernListViewProps> = ({
  lots,
  isLoading,
  selectedLot,
  onSelectLot,
  onOpenDetail,
  onExplainScore,
  isFavourite,
  onToggleFavourite,
  sortOption,
  onSortChange,
  parkingDurationHours,
  filters,
  onFiltersChange,
  onSwitchToMap,
  currentZoom = 14,
  searchQuery = '',
  onSelectDistrictZoom
}) => {
  const { lang, t } = useI18n();
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_BATCH);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
  }, [lots.length, filters, sortOption]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 300) {
      if (visibleCount < lots.length) {
        setVisibleCount(prev => Math.min(prev + ITEMS_PER_BATCH, lots.length));
      }
    }
  };

  // Ensure selected lot is the first item in the list if present
  const orderedLots = useMemo(() => {
    if (!selectedLot) return lots;
    const selectedId = selectedLot.lot.id;
    const found = lots.find(item => item.lot.id === selectedId);
    if (!found) return lots;
    return [found, ...lots.filter(item => item.lot.id !== selectedId)];
  }, [lots, selectedLot]);

  const visibleLots = useMemo(() => {
    return orderedLots.slice(0, visibleCount);
  }, [orderedLots, visibleCount]);

  // Check if zoom level is high enough to display individual car parks
  const isZoomHighEnough = currentZoom >= 14.5 || Boolean(searchQuery.trim()) || Boolean(selectedLot);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full h-full pt-28 sm:pt-32 pb-24 px-3 sm:px-4 overflow-y-auto max-w-2xl mx-auto space-y-2.5 native-carousel-scrollbar"
    >
      {/* Zoom Level Not High Enough Empty / Prompt State */}
      {!isZoomHighEnough ? (
        <div className="py-12 px-4 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-950/60 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-1 shadow-lg shadow-sky-950/50">
            <ZoomIn className="w-7 h-7 animate-pulse" />
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">
              {lang === 'tc' ? '請放大地圖以查看停車場列表' : 'Zoom in to view parking lots'}
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-xs mx-auto">
              {lang === 'tc'
                ? '目前處於全港或分區宏觀視野。放大地圖至個別街區，或點選下方熱門分區即可載入詳細車位。'
                : 'Currently at district overview level. Zoom in to street level or select a district below to view parking lots.'}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={onSwitchToMap}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-sky-600/30"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{lang === 'tc' ? '返回地圖並放大' : 'Back to Map & Zoom In'}</span>
            </button>
          </div>

          {/* Quick District Shortcuts */}
          {onSelectDistrictZoom && (
            <div className="w-full mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'tc' ? '熱門泊車分區' : 'Popular Districts'}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {DISTRICTS.slice(0, 9).map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      onSelectDistrictZoom(d.center.lat, d.center.lng);
                      onSwitchToMap();
                    }}
                    className="px-2 py-2 rounded-xl bg-slate-900 hover:bg-sky-600 hover:text-white border border-slate-800 text-slate-300 text-xs font-semibold text-center truncate transition cursor-pointer shadow-xs"
                  >
                    {d.name[lang]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : orderedLots.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-1">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="font-semibold text-slate-200 text-sm">
            {lang === 'tc' ? '當前地圖範圍內未有停車場' : 'No parking lots found in this area'}
          </p>
          <p className="text-slate-400 text-xs max-w-xs">
            {lang === 'tc'
              ? '請嘗試移動地圖視野、放大至個別街區或更換搜尋關鍵字。'
              : 'Try panning the map, zooming in to street level, or resetting filters.'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={onSwitchToMap}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{lang === 'tc' ? '返回地圖' : 'Back to Map'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* List Items with Selected Lot first */
        <>
          {visibleLots.map((scoredLot, index) => {
            const isSelected = selectedLot?.lot.id === scoredLot.lot.id;
            return (
              <div key={scoredLot.lot.id} className="relative">
                {isSelected && index === 0 && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-sky-400 mb-1 px-1">
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    <span>{lang === 'tc' ? '目前選中停車場' : 'Currently Selected'}</span>
                  </div>
                )}
                <CarParkCard
                  scoredLot={scoredLot}
                  isSelected={isSelected}
                  isFav={isFavourite(scoredLot.lot.id)}
                  parkingDurationHours={parkingDurationHours}
                  onSelect={() => onSelectLot(scoredLot)}
                  onOpenDetail={() => onOpenDetail(scoredLot)}
                  onExplainScore={() => onExplainScore(scoredLot)}
                  onToggleFav={() => onToggleFavourite(scoredLot.lot.id)}
                />
              </div>
            );
          })}

          {/* Load More Indicator */}
          {visibleCount < orderedLots.length && (
            <div className="py-3 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount(prev => Math.min(prev + ITEMS_PER_BATCH, orderedLots.length))}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                {lang === 'tc'
                  ? `載入更多 (${orderedLots.length - visibleCount} 處待載入)`
                  : `Load More (${orderedLots.length - visibleCount} remaining)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
