import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin,
  ArrowUpDown,
  Check,
  ZoomIn,
  Sparkles,
  Compass
} from 'lucide-react';
import { ScoredParkingLot, SortOption, FilterState } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { CarParkCard } from '../common/CarParkCard';
import { DISTRICTS } from '../../constants/districts';

interface DesktopSidePanelProps {
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
  onSelectDistrictZoom?: (lat: number, lng: number) => void;
  currentZoom?: number;
  searchQuery?: string;
  isOffline?: boolean;
  isUsingCachedData?: boolean;
}

const ITEMS_PER_PAGE = 30;

export const DesktopSidePanel: React.FC<DesktopSidePanelProps> = ({
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
  onSelectDistrictZoom,
  currentZoom = 14,
  searchQuery = '',
  isOffline = false,
  isUsingCachedData = false
}) => {
  const { lang, t } = useI18n();
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close sort menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset pagination count when lots change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [lots.length, filters, sortOption]);

  // Handle scroll for progressive lazy loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 250) {
      if (visibleCount < lots.length) {
        setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, lots.length));
      }
    }
  };

  const sortOptions: { id: SortOption; label: { tc: string; en: string } }[] = [
    { id: 'recommended', label: { tc: '智能推薦', en: 'Recommended' } },
    { id: 'vacancy', label: { tc: '最多位', en: 'Most Space' } },
    { id: 'distance', label: { tc: '最近', en: 'Nearest' } },
    { id: 'price', label: { tc: '最平', en: 'Cheapest' } }
  ];

  const currentSortLabel = sortOptions.find(s => s.id === sortOption)?.label[lang] ?? t.sort.recommended;

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
  // (or if user specifically searched for something or selected a lot)
  const isZoomHighEnough = currentZoom >= 14.5 || Boolean(searchQuery.trim()) || Boolean(selectedLot);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border-r border-slate-800 text-slate-100 overflow-hidden">
      {/* 1. Clean Non-Duplicated Header: Title + Count + Sort */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-2 shrink-0 relative z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            isOffline ? 'bg-rose-400' : isUsingCachedData ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
          }`} />
          <h2 className="font-extrabold text-sm sm:text-base text-white">
            {lang === 'tc' ? '停車場列表' : 'Parking Lots'}
          </h2>
          {isZoomHighEnough && (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-sky-400 text-xs font-black">
              {orderedLots.length}
            </span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div ref={sortRef} className="relative">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-700 shadow-xs"
          >
            <ArrowUpDown className="w-3 h-3 text-sky-400" />
            <span className="truncate">{currentSortLabel}</span>
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 min-w-[135px]">
              {sortOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSortChange(opt.id);
                    setIsSortOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center justify-between cursor-pointer ${
                    sortOption === opt.id
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{opt.label[lang]}</span>
                  {sortOption === opt.id && <Check className="w-3 h-3 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Scrollable Content Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-2.5 native-carousel-scrollbar"
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
                      onClick={() => onSelectDistrictZoom(d.center.lat, d.center.lng)}
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
          /* Empty Search / Zone State */
          <div className="py-20 text-center text-slate-400 text-xs px-4 flex flex-col items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-1">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="font-semibold text-slate-200 text-sm">
              {lang === 'tc' ? '當前地圖區域未有符合條件的停車場' : 'No parking lots found in this area'}
            </p>
            <p className="text-slate-400 text-xs max-w-xs">
              {lang === 'tc'
                ? '請移動地圖、放大視野，或放寬篩選條件。'
                : 'Try panning the map, zooming out slightly, or relaxing your filters.'}
            </p>
          </div>
        ) : (
          /* Render Scored Lot Cards with Selected Lot on top */
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
                  onClick={() => setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, orderedLots.length))}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
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
    </div>
  );
};
