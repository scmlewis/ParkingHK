import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Navigation,
  Star,
  Zap,
  ChevronRight,
  ChevronLeft,
  Info,
  ZoomIn,
  Compass
} from 'lucide-react';
import { ScoredParkingLot } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { VacancyBadge } from '../common/VacancyBadge';
import { formatDistance, formatWalkingTime } from '../../services/distanceService';
import { DISTRICTS } from '../../constants/districts';

interface ModernCarouselProps {
  lots: ScoredParkingLot[];
  selectedLot: ScoredParkingLot | null;
  onSelectLot: (lot: ScoredParkingLot) => void;
  onOpenDetail: (lot: ScoredParkingLot) => void;
  isFavourite: (id: string) => boolean;
  onToggleFavourite: (id: string) => void;
  parkingDurationHours: number;
  currentZoom?: number;
  searchQuery?: string;
  mapCenter?: { lat: number; lng: number } | null;
  onSelectDistrictZoom?: (lat: number, lng: number) => void;
}

export const ModernCarousel: React.FC<ModernCarouselProps> = ({
  lots,
  selectedLot,
  onSelectLot,
  onOpenDetail,
  isFavourite,
  onToggleFavourite,
  parkingDurationHours,
  currentZoom = 14,
  searchQuery = '',
  mapCenter,
  onSelectDistrictZoom
}) => {
  const { lang } = useI18n();
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check if zoom level is high enough to display individual car parks
  // (aligned strictly with ModernListView & DesktopSidePanel display logic)
  const isZoomHighEnough = currentZoom >= 14.5 || Boolean(searchQuery.trim()) || Boolean(selectedLot);

  // Mouse Dragging Refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const lastSelectedIdRef = useRef<string | null>(null);

  // Search Results & Map Position tracking refs to reset carousel
  const prevLotsKeyRef = useRef<string>('');
  const prevMapCenterRef = useRef<{ lat: number; lng: number } | null>(null);

  const checkScrollBounds = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  // Scroll active card into view ONLY when selected externally (e.g. clicking map pin)
  useEffect(() => {
    if (!selectedLot) {
      lastSelectedIdRef.current = null;
      return;
    }
    if (selectedLot.lot.id !== lastSelectedIdRef.current) {
      lastSelectedIdRef.current = selectedLot.lot.id;
      const cardEl = cardRefs.current.get(selectedLot.lot.id);
      if (cardEl && !isDraggingRef.current) {
        cardEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [selectedLot]);

  // Reset carousel scroll to the first item whenever search results refresh or map position changes
  useEffect(() => {
    const currentLotsKey = `${lots.length}:${lots.slice(0, 6).map(l => l.lot.id).join(',')}`;
    const lotsChanged = prevLotsKeyRef.current !== '' && prevLotsKeyRef.current !== currentLotsKey;
    prevLotsKeyRef.current = currentLotsKey;

    let mapMoved = false;
    if (mapCenter) {
      if (prevMapCenterRef.current) {
        const dLat = Math.abs(prevMapCenterRef.current.lat - mapCenter.lat);
        const dLng = Math.abs(prevMapCenterRef.current.lng - mapCenter.lng);
        if (dLat > 0.0002 || dLng > 0.0002) {
          mapMoved = true;
        }
      }
      prevMapCenterRef.current = mapCenter;
    }

    if (lotsChanged || mapMoved) {
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [lots, mapCenter]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScrollBounds();
    el.addEventListener('scroll', checkScrollBounds, { passive: true });
    return () => el.removeEventListener('scroll', checkScrollBounds);
  }, [lots, checkScrollBounds]);

  // When zoom multiplier is small (macro district overview) and no search query or selected lot,
  // align display logic with list mode by presenting district quick chips instead of individual car park cards.
  if (!isZoomHighEnough) {
    return (
      <div className="absolute bottom-[58px] sm:bottom-[64px] left-0 right-0 z-20 pointer-events-none select-none px-3">
        <div className="max-w-xl mx-auto pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <ZoomIn className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>{lang === 'tc' ? '請放大地圖以查看車位列表' : 'Zoom in to view parking lots'}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700/60">
              {lang === 'tc' ? '宏觀分區模式' : 'District Overview'}
            </span>
          </div>

          {/* Quick District Navigation Chips */}
          {onSelectDistrictZoom && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-1 text-[10px] font-bold text-sky-400 pl-1 shrink-0">
                <Compass className="w-3 h-3" />
                <span>{lang === 'tc' ? '快速前往:' : 'Jump to:'}</span>
              </div>
              {DISTRICTS.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onSelectDistrictZoom(d.center.lat, d.center.lng)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white border border-slate-700 text-slate-300 text-[11px] font-semibold whitespace-nowrap transition cursor-pointer active:scale-95 shadow-xs shrink-0"
                >
                  {d.name[lang]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!lots || lots.length === 0) return null;

  const handleNavigate = (e: React.MouseEvent, lot: ScoredParkingLot['lot']) => {
    e.stopPropagation();
    const lat = lot.latitude;
    const lng = lot.longitude;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.open(`maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(lot.name[lang])}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(lot.name[lang])}`, '_blank');
    }
  };

  const handleScrollStep = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = 280;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const el = carouselRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
    }
  };

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = carouselRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = carouselRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (e: React.MouseEvent, scoredLot: ScoredParkingLot) => {
    // If user dragged, suppress the click selection
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    lastSelectedIdRef.current = scoredLot.lot.id;
    onSelectLot(scoredLot);
  };

  return (
    <div
      className="absolute bottom-[58px] sm:bottom-[64px] left-0 right-0 z-20 pointer-events-none select-none"
      onWheel={e => e.stopPropagation()}
    >
      <div className="relative max-w-3xl mx-auto px-2 sm:px-4">
        {/* Floating Left Arrow for Desktop */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScrollStep('left')}
            className="pointer-events-auto absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-slate-900/95 border border-slate-700 text-slate-200 shadow-xl flex items-center justify-center hover:bg-slate-800 hover:text-white transition active:scale-95 cursor-pointer backdrop-blur-md hidden sm:flex"
            title="Previous car park"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Floating Right Arrow for Desktop */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScrollStep('right')}
            className="pointer-events-auto absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-slate-900/95 border border-slate-700 text-slate-200 shadow-xl flex items-center justify-center hover:bg-slate-800 hover:text-white transition active:scale-95 cursor-pointer backdrop-blur-md hidden sm:flex"
            title="Next car park"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Horizontal Carousel Track with Native Scrollbar */}
        <div
          ref={carouselRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="pointer-events-auto flex items-stretch gap-2.5 overflow-x-scroll overflow-y-hidden pt-1 pb-2 px-1.5 native-carousel-scrollbar snap-x snap-proximity scroll-smooth cursor-grab active:cursor-grabbing"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x'
          }}
        >
          {lots.slice(0, 30).map((scoredLot, index) => {
            const { lot, vacancyStatus, selectedVacancy, distanceMeters, walkingMinutes } = scoredLot;
            const isSelected = selectedLot?.lot.id === lot.id;
            const fav = isFavourite(lot.id);
            const hourlyRate = lot.pricing?.hourlyRate;
            const isEstimated = lot.pricing?.estimated === true;
            const displayRate = hourlyRate != null && !isEstimated ? hourlyRate : null;
            const totalCost = displayRate != null ? displayRate * parkingDurationHours : null;
            const formattedDist = formatDistance(distanceMeters, lang);
            const formattedWalking = formatWalkingTime(walkingMinutes, lang, distanceMeters);

            return (
              <div
                key={lot.id}
                ref={el => {
                  if (el) cardRefs.current.set(lot.id, el);
                  else cardRefs.current.delete(lot.id);
                }}
                onClick={e => handleCardClick(e, scoredLot)}
                className={`w-[245px] sm:w-[265px] shrink-0 snap-center rounded-xl border transition-all duration-150 cursor-pointer p-2 sm:p-2.5 flex flex-col justify-between backdrop-blur-md shadow-lg select-none ${
                  isSelected
                    ? 'bg-slate-900/98 border-sky-500 ring-2 ring-sky-500/40 -translate-y-0.5 shadow-sky-950/60'
                    : 'bg-slate-900/92 border-slate-700/80 hover:border-slate-600 hover:bg-slate-850/95'
                }`}
              >
                {/* Row 1: Badges (District + EV + Status) & Price */}
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center gap-1 min-w-0 flex-wrap">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700/70 text-slate-300 truncate">
                      {lot.district[lang]}
                    </span>
                    {lot.facilities?.evCharging && (
                      <span className="text-[10px] font-bold px-1 py-0.5 rounded-md bg-sky-950/90 border border-sky-600/70 text-sky-300 flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" />
                        <span>EV</span>
                      </span>
                    )}
                    {index === 0 && (
                      <span className="text-[10px] font-bold px-1 py-0.5 rounded-md bg-amber-950/90 border border-amber-600/70 text-amber-300">
                        TOP 1
                      </span>
                    )}
                  </div>

                  {/* Total Rate Display */}
                  <div className="text-right shrink-0">
                    {displayRate != null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-sky-400">
                          ${totalCost}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          (${displayRate}/h)
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        {lang === 'tc' ? '現場公布' : 'On-site'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Carpark Name & Walking Distance */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-sky-400 flex-1">
                    {lot.name[lang]}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-300 shrink-0">
                    {formattedDist}
                    {formattedWalking && <span className="text-slate-400 font-normal ml-1">({formattedWalking})</span>}
                  </span>
                </div>

                {/* Row 3: Vacancy Status Badge & Fast Action Buttons */}
                <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80">
                  {/* Vacancy Badge */}
                  <VacancyBadge
                    status={vacancyStatus}
                    count={selectedVacancy?.vacancy ?? null}
                    size="sm"
                    isClosed={lot.openingStatus === 'CLOSED'}
                  />

                  {/* Actions: Navigation + Fav + Detail */}
                  <div className="flex items-center gap-1">
                    {/* Navigation */}
                    <button
                      type="button"
                      onClick={e => handleNavigate(e, lot)}
                      className="py-1 px-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs shadow-sky-600/30 transition active:scale-95 cursor-pointer shrink-0"
                      title="Navigate"
                    >
                      <Navigation className="w-3 h-3 fill-white" />
                      <span>{lang === 'tc' ? '導航' : 'Go'}</span>
                    </button>

                    {/* Favourite Star */}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleFavourite(lot.id);
                      }}
                      className={`p-1.5 rounded-xl border transition cursor-pointer flex items-center justify-center shrink-0 ${
                        fav
                          ? 'bg-amber-950/80 border-amber-500 text-amber-400'
                          : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={fav ? 'Favorited' : 'Add to Favorites'}
                    >
                      <Star className={`w-3 h-3 ${fav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    {/* Detail Modal */}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onOpenDetail(scoredLot);
                      }}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                      title={lang === 'tc' ? '查看詳細資料' : 'View Details'}
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
