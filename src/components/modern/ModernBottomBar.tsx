import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpDown, List, Map as MapIcon, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '../../i18n/context';
import { SortOption } from '../../domain/types';

interface ModernBottomBarProps {
  totalCount: number;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'map' | 'list';
  onToggleViewMode: (mode: 'map' | 'list') => void;
  isOffline?: boolean;
  isUsingCachedData?: boolean;
}

export const ModernBottomBar: React.FC<ModernBottomBarProps> = ({
  totalCount,
  sortOption,
  onSortChange,
  viewMode,
  onToggleViewMode,
  isOffline = false,
  isUsingCachedData = false
}) => {
  const { lang, t } = useI18n();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions: { id: SortOption; label: { tc: string; en: string } }[] = [
    { id: 'recommended', label: { tc: '智能推薦', en: 'Recommended' } },
    { id: 'vacancy', label: { tc: '最多位', en: 'Most Space' } },
    { id: 'distance', label: { tc: '最近', en: 'Nearest' } },
    { id: 'price', label: { tc: '最平', en: 'Cheapest' } }
  ];

  const currentSortLabel = sortOptions.find(s => s.id === sortOption)?.label[lang] ?? t.sort.recommended;

  return (
    <div className="absolute bottom-2.5 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 z-30 max-w-md mx-auto pointer-events-none flex justify-center select-none">
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/90 shadow-2xl p-1 sm:p-1.5 flex items-center justify-between gap-1 sm:gap-1.5 w-full">
        {/* 1. Carpark Count Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/70 text-slate-100 text-[11px] sm:text-xs font-bold shrink-0 whitespace-nowrap">
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            isOffline ? 'bg-rose-400' : isUsingCachedData ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
          }`} />
          <span>
            {totalCount} {lang === 'tc' ? '個停車場' : 'Lots'}
          </span>
        </div>

        {/* 2. Sort Dropdown Pill */}
        <div ref={sortRef} className="relative">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 text-[11px] sm:text-xs font-semibold transition cursor-pointer border border-slate-700/70 whitespace-nowrap"
          >
            <ArrowUpDown className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="truncate">{currentSortLabel}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {isSortOpen && (
            <div className="absolute bottom-full left-0 mb-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-40 flex flex-col gap-0.5 min-w-[130px] animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                {lang === 'tc' ? '排序方式' : 'Sort By'}
              </div>
              {sortOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSortChange(opt.id);
                    setIsSortOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between cursor-pointer whitespace-nowrap ${
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

        {/* 3. Segmented Map / List Toggle */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onToggleViewMode('map')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              viewMode === 'map'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3 h-3" />
            <span>{lang === 'tc' ? '地圖' : 'Map'}</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode('list')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              viewMode === 'list'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3 h-3" />
            <span>{lang === 'tc' ? '列表' : 'List'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
