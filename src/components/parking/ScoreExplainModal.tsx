import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScoredParkingLot } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { X, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { ScoreBadge } from '../common/ScoreBadge';

interface ScoreExplainModalProps {
  scoredLot: ScoredParkingLot | null;
  onClose: () => void;
}

export const ScoreExplainModal: React.FC<ScoreExplainModalProps> = ({
  scoredLot,
  onClose
}) => {
  const { lang, t } = useI18n();

  const breakdownMetrics = scoredLot ? [
    {
      label: t.score.availability,
      weight: '40%',
      score: scoredLot.scoreBreakdown.availabilityScore,
      max: 40,
      color: 'bg-emerald-500'
    },
    {
      label: t.score.distance,
      weight: '25%',
      score: scoredLot.scoreBreakdown.distanceScore,
      max: 25,
      color: 'bg-sky-500'
    },
    {
      label: t.score.price,
      weight: '20%',
      score: scoredLot.scoreBreakdown.priceScore,
      max: 20,
      color: 'bg-amber-500'
    },
    {
      label: t.score.opening,
      weight: '10%',
      score: scoredLot.scoreBreakdown.openingScore,
      max: 10,
      color: 'bg-indigo-500'
    },
    {
      label: t.score.freshness,
      weight: '5%',
      score: scoredLot.scoreBreakdown.freshnessScore,
      max: 5,
      color: 'bg-teal-500'
    }
  ] : [];

  return (
    <AnimatePresence>
      {scoredLot && (
        <motion.div
          key="score-explain-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="score-explain-content"
            initial={{ y: '100%', opacity: 0.6, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-2.5 sm:hidden" />

            {/* Modal Header */}
            <div className="px-5 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <div>
                  <h2 className="font-bold text-base text-white">
                    {t.score.whyRecommended}
                  </h2>
                  <p className="text-xs text-slate-400 truncate max-w-[260px]">
                    {scoredLot.lot.name[lang]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-sm">
              {/* Top Score Banner */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    {t.score.title}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {scoredLot.scoreBreakdown.totalScore} / 100 {t.score.pts}
                  </h3>
                </div>
                <ScoreBadge score={scoredLot.scoreBreakdown.totalScore} size="lg" />
              </div>

              {/* Explainable Reasons Bullet Points */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.score.whyRecommended}</span>
                </h4>
                <div className="space-y-2">
                  {scoredLot.scoreBreakdown.reasons[lang].map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-xs font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed 5-metric Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <span>{t.score.scoreBreakdown}</span>
                </h4>
                <div className="space-y-3">
                  {breakdownMetrics.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">
                          {item.label}{' '}
                          <span className="text-slate-400 font-normal">({item.weight})</span>
                        </span>
                        <span className="font-bold text-white font-mono">
                          {item.score} / {item.max}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-300`}
                          style={{ width: `${(item.score / item.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mathematical / Neutral algorithm note */}
              <div className="p-3 rounded-xl bg-slate-800/40 text-slate-400 text-xs leading-relaxed">
                {lang === 'tc'
                  ? '💡 評分根據運輸署即時空位、實時距離、官方時租及開放時間計算，不受任何商業贊助影響。'
                  : '💡 Score is deterministically calculated from live government vacancies, distance, rates, and opening status.'}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end pb-[max(env(safe-area-inset-bottom),1rem)]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer min-h-[38px]"
              >
                {lang === 'tc' ? '了解' : 'Got it'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
