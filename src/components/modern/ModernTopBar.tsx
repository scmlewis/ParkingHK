import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  X,
  Clock,
  Zap,
  SlidersHorizontal,
  Star,
  Settings,
  ChevronDown,
  Car,
  Bike,
  Truck,
  Bus,
  Check,
  RotateCcw
} from 'lucide-react';
import { AppLogo } from '../common/AppLogo';
import { useI18n } from '../../i18n/context';
import { Destination, FilterState, ScoredParkingLot } from '../../domain/types';
import { POPULAR_DESTINATIONS } from '../../constants/destinations';
import { DISTRICTS } from '../../constants/districts';
import { VEHICLE_TYPES } from '../../constants/vehicleTypes';

interface ModernTopBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedDestination: Destination | null;
  onSelectDestination: (dest: Destination | null) => void;
  isLocating: boolean;
  filters: FilterState;
  onFiltersChange: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  favouritesCount: number;
  onOpenFavourites: () => void;
  onOpenSettings: () => void;
  parkingDurationHours: number;
  onChangeDurationHours: (hours: number) => void;
  matchingLotsCount?: number;
  lots?: ScoredParkingLot[];
  onSelectLot?: (lot: ScoredParkingLot) => void;
}

export const ModernTopBar: React.FC<ModernTopBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedDestination,
  onSelectDestination,
  isLocating,
  filters,
  onFiltersChange,
  onResetFilters,
  activeFilterCount,
  favouritesCount,
  onOpenFavourites,
  onOpenSettings,
  parkingDurationHours,
  onChangeDurationHours,
  matchingLotsCount = 0,
  lots = [],
  onSelectLot
}) => {
  const { lang, t } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterTrayOpen, setIsFilterTrayOpen] = useState(false);
  const [isDurationMenuOpen, setIsDurationMenuOpen] = useState(false);
  const [isVehicleMenuOpen, setIsVehicleMenuOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setIsFilterTrayOpen(false);
        setIsDurationMenuOpen(false);
        setIsVehicleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const tokens = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    type ScoredDest = { dest: typeof POPULAR_DESTINATIONS[number]; score: number };
    const scored: ScoredDest[] = [];

    for (const dest of POPULAR_DESTINATIONS) {
      const nameEn = dest.name.en.toLowerCase();
      const nameTc = dest.name.tc.toLowerCase();
      const distEn = dest.district.en.toLowerCase();
      const distTc = dest.district.tc.toLowerCase();
      const allText = `${nameEn} ${nameTc} ${distEn} ${distTc}`;

      // All tokens must match somewhere
      const allMatch = tokens.every(t => allText.includes(t));
      if (!allMatch) continue;

      // Score: name match (10) > district match (5), full token in name (bonus)
      let score = 0;
      for (const t of tokens) {
        if (nameEn.includes(t) || nameTc.includes(t)) score += 10;
        if (distEn.includes(t) || distTc.includes(t)) score += 5;
      }
      // Bonus: query appears as substring in name (higher relevance)
      if (nameEn.includes(searchQuery.toLowerCase()) || nameTc.includes(searchQuery.toLowerCase())) {
        score += 15;
      }
      // Popular destinations rank higher
      if (dest.popular) score += 2;

      scored.push({ dest, score });
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .map(s => s.dest);
  }, [searchQuery]);

  // Car park name autocomplete
  const matchingLots = useMemo(() => {
    if (!searchQuery.trim() || lots.length === 0) return [];
    const q = searchQuery.toLowerCase().trim();
    return lots
      .filter(item => {
        const lot = item.lot;
        return (
          lot.name.en.toLowerCase().includes(q) ||
          lot.name.tc.toLowerCase().includes(q) ||
          lot.address.en.toLowerCase().includes(q) ||
          lot.address.tc.toLowerCase().includes(q)
        );
      })
      .slice(0, 8); // Limit to 8 suggestions
  }, [searchQuery, lots]);

  const calculateUntilTime = (hours: number) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const getVehicleIcon = (type: string, className = "w-3.5 h-3.5") => {
    switch (type) {
      case 'MOTORCYCLE':
        return <Bike className={className} />;
      case 'LGV':
        return <Truck className={className} />;
      case 'HGV':
        return <Truck className={className} />;
      case 'COACH':
        return <Bus className={className} />;
      case 'PRIVATE_CAR':
      default:
        return <Car className={className} />;
    }
  };

  const currentVehicleMeta = VEHICLE_TYPES.find(v => v.id === filters.vehicleType) || VEHICLE_TYPES[0];

  return (
    <div
      ref={containerRef}
      className="absolute top-2 left-2 right-2 sm:top-3 sm:left-4 sm:right-4 z-30 max-w-xl mx-auto flex flex-col gap-1.5 pointer-events-none select-none"
    >
      {/* ── Single Unified Card Container ── */}
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-1.5 sm:p-2.5 flex flex-col gap-1.5 transition-all">
        {/* Row 1: Brand + Search Bar + Quick Actions */}
        <div className="flex items-center gap-1.5">
          {/* Logo Mark */}
          <AppLogo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />

          {/* Search Input Box */}
          <div className="relative flex-1 flex items-center min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                onSearchQueryChange(e.target.value);
                setIsSearchOpen(true);
                setIsFilterTrayOpen(false);
                setIsDurationMenuOpen(false);
                setIsVehicleMenuOpen(false);
              }}
              onFocus={() => {
                setIsSearchOpen(true);
                setIsFilterTrayOpen(false);
                setIsDurationMenuOpen(false);
                setIsVehicleMenuOpen(false);
              }}
              placeholder={
                selectedDestination
                  ? selectedDestination.name[lang]
                  : lang === 'tc'
                  ? '搜尋地點或停車場 (如：啟德、旺角、時代廣場)'
                  : 'Search carparks or district...'
              }
              className="w-full bg-slate-800/90 hover:bg-slate-800 text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-7.5 pr-7 py-1.5 sm:py-2 border border-slate-700/70 focus:outline-none focus:ring-2 focus:ring-sky-500 transition truncate font-medium"
            />
            {(searchQuery || selectedDestination) && (
              <button
                type="button"
                onClick={() => {
                  onSearchQueryChange('');
                  onSelectDestination(null);
                }}
                className="absolute right-2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action Icons: Favs, Settings (Language inside Settings) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Favourites */}
            <button
              type="button"
              onClick={onOpenFavourites}
              className="relative p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title={t.favourites.title}
            >
              <Star className={`w-3.5 h-3.5 ${favouritesCount > 0 ? 'text-amber-400 fill-amber-400' : ''}`} />
              {favouritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                  {favouritesCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title={t.settings.title}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Duration Selector + Vehicle Switcher + Filters */}
        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 relative">
            {/* Duration Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setIsDurationMenuOpen(prev => !prev);
                  setIsFilterTrayOpen(false);
                  setIsSearchOpen(false);
                  setIsVehicleMenuOpen(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-medium transition cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                  isDurationMenuOpen
                    ? 'bg-slate-750 text-white border-sky-500 ring-1 ring-sky-500'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                }`}
              >
                <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                <span>
                  {lang === 'tc' ? `泊 ${parkingDurationHours}小時` : `${parkingDurationHours}h`}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isDurationMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Duration Menu Dropdown */}
              {isDurationMenuOpen && (
                <div
                  className="absolute top-full left-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    {lang === 'tc' ? '預計泊車時長' : 'Parking Duration'}
                  </div>
                  {[1, 2, 3, 4, 6, 8, 12, 24].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {
                        onChangeDurationHours(h);
                        setIsDurationMenuOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center justify-between cursor-pointer whitespace-nowrap transition ${
                        parkingDurationHours === h
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>
                        {h} {lang === 'tc' ? '小時' : 'hr' + (h > 1 ? 's' : '')} ({calculateUntilTime(h)})
                      </span>
                      {parkingDurationHours === h && <Check className="w-3 h-3 ml-2 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Type Selector Dropdown (All 5 vehicle types) */}
            <div className="relative">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setIsVehicleMenuOpen(prev => !prev);
                  setIsDurationMenuOpen(false);
                  setIsFilterTrayOpen(false);
                  setIsSearchOpen(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-semibold transition cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                  isVehicleMenuOpen
                    ? 'bg-slate-750 text-white border-sky-500 ring-1 ring-sky-500'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                }`}
              >
                {getVehicleIcon(filters.vehicleType, "w-3 h-3 text-sky-400 shrink-0")}
                <span>{currentVehicleMeta.shortLabel[lang]}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isVehicleMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Vehicle Menu Dropdown */}
              {isVehicleMenuOpen && (
                <div
                  className="absolute top-full left-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    {lang === 'tc' ? '車輛類型' : 'Vehicle Type'}
                  </div>
                  {VEHICLE_TYPES.map(vt => (
                    <button
                      key={vt.id}
                      type="button"
                      onClick={() => {
                        onFiltersChange(prev => ({ ...prev, vehicleType: vt.id }));
                        setIsVehicleMenuOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center justify-between cursor-pointer whitespace-nowrap transition ${
                        filters.vehicleType === vt.id
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getVehicleIcon(vt.id, "w-3.5 h-3.5 text-sky-400")}
                        <span>{vt.label[lang]}</span>
                      </div>
                      {filters.vehicleType === vt.id && <Check className="w-3 h-3 ml-2 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters Trigger */}
          <button
            type="button"
            onClick={() => {
              setIsFilterTrayOpen(!isFilterTrayOpen);
              setIsDurationMenuOpen(false);
              setIsSearchOpen(false);
              setIsVehicleMenuOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-[11px] sm:text-xs transition cursor-pointer whitespace-nowrap shrink-0 ${
              activeFilterCount > 0 || isFilterTrayOpen
                ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3 text-sky-400" />
            <span>{lang === 'tc' ? '篩選' : 'Filter'}</span>
            {activeFilterCount > 0 && (
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white text-[8px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${isFilterTrayOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* ── Search Dropdown ── */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto p-2 space-y-1.5">
            {filteredDestinations.length > 0 && (
              <>
                <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
                  {lang === 'tc' ? '目的地' : 'Destinations'}
                </div>
                {filteredDestinations.map(dest => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => {
                      onSelectDestination(dest);
                      onSearchQueryChange('');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-xs flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="font-semibold text-slate-100 truncate">{dest.name[lang]}</span>
                      <span className="text-[11px] text-slate-400 truncate">({dest.district[lang]})</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      {dest.district[lang]}
                    </span>
                  </button>
                ))}
              </>
            )}

            {/* Car park autocomplete suggestions */}
            {matchingLots.length > 0 && (
              <>
                <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider border-t border-slate-800 mt-1 pt-2">
                  {lang === 'tc' ? '停車場' : 'Car Parks'}
                </div>
                {matchingLots.map(scoredLot => (
                  <button
                    key={scoredLot.lot.id}
                    type="button"
                    onClick={() => {
                      if (onSelectLot) onSelectLot(scoredLot);
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-xs flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <Car className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-slate-100 truncate">{scoredLot.lot.name[lang]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {scoredLot.selectedVacancy?.vacancy != null && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          scoredLot.selectedVacancy.vacancy > 10
                            ? 'bg-emerald-900/60 text-emerald-300'
                            : scoredLot.selectedVacancy.vacancy > 0
                            ? 'bg-amber-900/60 text-amber-300'
                            : 'bg-red-900/60 text-red-300'
                        }`}>
                          {scoredLot.selectedVacancy.vacancy}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">{scoredLot.lot.district[lang]}</span>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Parking lot match count */}
            {matchingLotsCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 text-[11px] text-slate-400 border-t border-slate-800 mt-1 pt-2">
                <span className="font-bold text-sky-400">{matchingLotsCount}</span>
                <span>
                  {lang === 'tc'
                    ? `個停車場匹配「${searchQuery}」`
                    : `car park${matchingLotsCount !== 1 ? 's' : ''} match "${searchQuery}"`}
                </span>
              </div>
            )}

            {/* No results at all */}
            {filteredDestinations.length === 0 && matchingLots.length === 0 && (
              <div className="px-3 py-4 text-center text-slate-500 text-xs">
                {lang === 'tc' ? '找不到匹配的地點或停車場' : 'No matching destinations or car parks'}
              </div>
            )}
          </div>
        )}

        {/* ── Filter Slide-Down Card ── */}
        {isFilterTrayOpen && (
          <div className="mt-1 bg-slate-900/98 rounded-xl border border-slate-700 p-3 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150 text-xs max-h-[75vh] overflow-y-auto">
            {/* Header with Reset */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-slate-200 text-xs">
                {lang === 'tc' ? '進階篩選條件' : 'Filter Options'}
              </span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-sky-400 hover:text-sky-300 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'tc' ? '重設所有' : 'Reset All'}</span>
                </button>
              )}
            </div>

            {/* Amenities Section */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {lang === 'tc' ? '設施及狀態' : 'Amenities & Status'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onFiltersChange(prev => ({ ...prev, onlyWithVacancy: !prev.onlyWithVacancy }))}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    filters.onlyWithVacancy
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  🟢 {lang === 'tc' ? '尚有車位' : 'Has Vacancy'}
                </button>

                <button
                  type="button"
                  onClick={() => onFiltersChange(prev => ({ ...prev, evChargingOnly: !prev.evChargingOnly }))}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                    filters.evChargingOnly
                      ? 'bg-sky-950/90 border-sky-500 text-sky-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lang === 'tc' ? '充電樁 (EV)' : 'EV Charging'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onFiltersChange(prev => ({ ...prev, openingStatusOnly: !prev.openingStatusOnly }))}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    filters.openingStatusOnly
                      ? 'bg-sky-950/90 border-sky-500 text-sky-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {lang === 'tc' ? '營業中' : 'Open Now'}
                </button>
              </div>
            </div>

            {/* Hourly Rate Filter */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {lang === 'tc' ? '時租上限' : 'Max Hourly Rate'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: lang === 'tc' ? '不限' : 'Any', value: Infinity },
                  { label: '≤ $20/h', value: 20 },
                  { label: '≤ $30/h', value: 30 },
                  { label: '≤ $40/h', value: 40 }
                ].map(opt => {
                  const isSelected = filters.maxHourlyRate === opt.value;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => onFiltersChange(prev => ({ ...prev, maxHourlyRate: opt.value }))}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        isSelected
                          ? 'bg-sky-600 border-sky-500 text-white font-bold'
                          : 'bg-slate-850 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Done button */}
            <button
              type="button"
              onClick={() => setIsFilterTrayOpen(false)}
              className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition cursor-pointer text-center"
            >
              {lang === 'tc' ? '完成' : 'Done'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
