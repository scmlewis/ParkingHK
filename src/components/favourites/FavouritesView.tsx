import React from 'react';
import { ScoredParkingLot } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { CarParkCard } from '../common/CarParkCard';
import { Star, Compass, ArrowLeft } from 'lucide-react';

interface FavouritesViewProps {
  favouriteLots: ScoredParkingLot[];
  onToggleFavourite: (id: string) => void;
  onSelectLot: (lot: ScoredParkingLot) => void;
  onExplainScore: (lot: ScoredParkingLot) => void;
  onGoToExplore: () => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  favouriteLots,
  onToggleFavourite,
  onSelectLot,
  onExplainScore,
  onGoToExplore
}) => {
  const { lang, t } = useI18n();

  return (
    <div className="w-full max-w-4xl mx-auto py-2 space-y-4">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onGoToExplore}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white transition active:scale-95 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>{lang === 'tc' ? '返回停車場搜尋及地圖' : 'Back to Search & Map'}</span>
        </button>

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300">
          {favouriteLots.length} {lang === 'tc' ? '個已收藏' : 'saved'}
        </span>
      </div>

      {/* View Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>{t.favourites.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.favourites.subtitle}
          </p>
        </div>
      </div>

      {/* Favourites Cards List */}
      {favouriteLots.length > 0 ? (
        <div className="space-y-3 pb-20 md:pb-6">
          {favouriteLots.map(scoredLot => (
            <CarParkCard
              key={scoredLot.lot.id}
              scoredLot={scoredLot}
              isFav={true}
              onToggleFav={onToggleFavourite}
              onSelect={onSelectLot}
              onOpenDetail={onSelectLot}
              onExplainScore={onExplainScore}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 my-4 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/40 border border-amber-900/50 text-amber-400 flex items-center justify-center mb-3">
            <Star className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {t.favourites.empty}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
            {t.favourites.emptyHint}
          </p>
          <button
            type="button"
            onClick={onGoToExplore}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>{t.favourites.exploreBtn}</span>
          </button>
        </div>
      )}
    </div>
  );
};
