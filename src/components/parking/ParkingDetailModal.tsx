import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScoredParkingLot } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { ScoreBadge } from '../common/ScoreBadge';
import { FreshnessBadge } from '../common/FreshnessBadge';
import { formatDistance, formatWalkingTime } from '../../services/distanceService';
import { getVehicleTypeLabel } from '../../constants/vehicleTypes';
import {
  X,
  MapPin,
  Navigation,
  Star,
  Phone,
  Globe,
  Zap,
  ZapOff,
  Accessibility,
  CreditCard,
  Building,
  ShieldCheck,
  ArrowUpRight,
  Info,
  Car,
  Ruler,
  ChevronRight
} from 'lucide-react';

interface ParkingDetailModalProps {
  scoredLot: ScoredParkingLot | null;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  onClose: () => void;
  onExplainScore: (lot: ScoredParkingLot) => void;
  parkingDurationHours?: number;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.24, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

const modalVariants = {
  hidden: {
    y: '100%',
    opacity: 0.4,
    scale: 0.98
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 28,
      stiffness: 320,
      mass: 0.85
    }
  },
  exit: {
    y: '100%',
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.22,
      ease: [0.32, 0, 0.67, 0]
    }
  }
};

const contentContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.05
    }
  }
};

const contentItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 280
    }
  }
};

export const ParkingDetailModal: React.FC<ParkingDetailModalProps> = ({
  scoredLot,
  isFavourite,
  onToggleFavourite,
  onClose,
  onExplainScore,
  parkingDurationHours = 1
}) => {
  const { lang, t } = useI18n();
  const [showAllNavApps, setShowAllNavApps] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const deltaY = e.clientY - dragRef.current.startY;
    const scrollEl = scrollRef.current;
    const atTop = scrollEl ? scrollEl.scrollTop <= 0 : true;
    if (atTop && deltaY > 80) {
      onClose();
    }
    dragRef.current = null;
  }, [onClose]);

  // Lock body scroll when modal is open on mobile
  useEffect(() => {
    if (scoredLot) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [scoredLot]);

  if (!scoredLot) return null;

  const { lot } = scoredLot;
  const isClosed = lot.openingStatus === 'CLOSED';
  const primaryVacancy = lot.vacancies.find(v => v.vehicleType === 'PRIVATE_CAR') || lot.vacancies[0];
  const vacancyCount = primaryVacancy?.vacancy;

  // Determine vacancy badge styling — closed lots override to rose
  const isFull = isClosed ? false : vacancyCount === 0;
  const isLimited = !isClosed && vacancyCount !== null && vacancyCount !== undefined && vacancyCount > 0 && vacancyCount < 10;
  const isAvailable = !isClosed && vacancyCount !== null && vacancyCount !== undefined && vacancyCount >= 10;
  const isUnknown = vacancyCount === null || vacancyCount === undefined;

  const handleOpenGoogleMaps = () => {
    if (lot.latitude && lot.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lot.latitude},${lot.longitude}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenAppleMaps = () => {
    if (lot.latitude && lot.longitude) {
      window.open(`https://maps.apple.com/?daddr=${lot.latitude},${lot.longitude}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenWaze = () => {
    if (lot.latitude && lot.longitude) {
      window.open(`https://waze.com/ul?ll=${lot.latitude},${lot.longitude}&navigate=yes`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="parking-detail-modal-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          key="parking-detail-modal-content"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-slate-900 w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-800/90 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
        >
          {/* Mobile Drag Indicator Bar */}
          <div className="w-12 h-1 bg-slate-700/60 rounded-full mx-auto mt-2.5 sm:hidden shrink-0 cursor-grab active:cursor-grabbing" />

          {/* Header Bar */}
          <div className="px-5 py-3.5 sm:py-4 border-b border-slate-800/80 flex items-start justify-between gap-3 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
                  {lot.district[lang]}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    lot.openingStatus === 'OPEN'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                  }`}
                >
                  {lot.openingStatus === 'OPEN' ? t.status.open : t.status.closed}
                </span>
                <FreshnessBadge status={scoredLot.freshness} text={scoredLot.freshnessText} />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight tracking-tight">
                {lot.name[lang]}
              </h2>

              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{lot.address[lang]}</span>
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => onToggleFavourite(lot.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center"
                title={isFavourite ? t.detail.removedFromFav : t.detail.addedToFav}
              >
                <Star
                  className={`w-5 h-5 ${
                    isFavourite ? 'text-amber-400 fill-amber-400' : ''
                  }`}
                />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center"
                title="Close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <motion.div
            ref={scrollRef}
            variants={contentContainerVariants}
            initial="hidden"
            animate="visible"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="p-5 space-y-5 overflow-y-auto flex-1 text-sm custom-modal-scrollbar overscroll-contain"
          >
            {/* 1. Driver-Centric Hero Status & Action Card */}
            <motion.div
              variants={contentItemVariants}
              className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/80 shadow-md flex flex-col gap-4"
            >
              {/* Top Row: Live Availability + Hourly Rate */}
              <div className="flex items-center justify-between gap-4">
                {/* Live Vacancy Stat */}
                <div className="flex items-baseline gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isClosed
                          ? 'bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'
                          : isAvailable
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : isLimited
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                          : isFull
                          ? 'bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${
                        isClosed
                          ? 'text-rose-400'
                          : isAvailable
                          ? 'text-emerald-400'
                          : isLimited
                          ? 'text-amber-400'
                          : isFull
                          ? 'text-rose-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {isClosed
                        ? (lang === 'tc' ? '已落閘' : 'Closed')
                        : isUnknown
                        ? (lang === 'tc' ? '實時未明' : 'Unknown')
                        : isFull
                        ? (lang === 'tc' ? '已泊滿' : 'Full')
                        : vacancyCount}
                    </span>
                  </div>
                  {!isClosed && !isUnknown && !isFull && (
                    <span className="text-xs font-bold text-slate-300">
                      {lang === 'tc' ? '個空位' : 'spaces'}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 ml-1">
                    ({lang === 'tc' ? '私家車' : 'Private Car'})
                  </span>
                </div>

                {/* Primary Hourly Rate Display */}
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {lang === 'tc' ? '標準時租' : 'Hourly Rate'}
                  </span>
                  <div className="flex items-baseline justify-end gap-0.5">
                    <span className="text-xl sm:text-2xl font-black text-white">
                      {lot.pricing?.hourlyRate ? `HK$${lot.pricing.hourlyRate}` : (lang === 'tc' ? '現場公布' : 'On-site')}
                    </span>
                    {lot.pricing?.hourlyRate && (
                      <span className="text-xs text-slate-400 font-semibold">/hr</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Distance context + Direct Map Launcher */}
              <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Navigation className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="font-bold text-white">
                    {formatDistance(scoredLot.distanceMeters, lang)}
                  </span>
                  {scoredLot.walkingMinutes !== null && (
                    <span className="text-slate-400 font-normal">
                      • {formatWalkingTime(scoredLot.walkingMinutes, lang, scoredLot.distanceMeters)}
                    </span>
                  )}
                </div>

                {/* Direct Launch Buttons */}
                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={handleOpenGoogleMaps}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer min-h-[36px]"
                  >
                    <span>Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={handleOpenAppleMaps}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition cursor-pointer min-h-[36px]"
                    title="Apple Maps"
                  >
                    <span>Apple</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={handleOpenWaze}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition cursor-pointer min-h-[36px]"
                    title="Waze"
                  >
                    <span>Waze</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* 2. Recommendation Score Strip */}
            <motion.div
              variants={contentItemVariants}
              className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ScoreBadge score={scoredLot.scoreBreakdown.totalScore} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="font-bold text-white text-xs">
                      {t.score.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {scoredLot.scoreBreakdown.reasons[lang][0] || t.score.recommended}
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => onExplainScore(scoredLot)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs border border-slate-700/80 transition cursor-pointer shrink-0 min-h-[30px] flex items-center gap-1"
              >
                <span>{t.score.whyRecommended}</span>
                <ChevronRight className="w-3 h-3 text-sky-400" />
              </motion.button>
            </motion.div>

            {/* 3. Additional Vehicle Types (if available, and lot is open) */}
            {lot.vacancies.length > 1 && !isClosed && (
              <motion.div variants={contentItemVariants}>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.detail.vacancyByVehicle}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {lot.vacancies.map((vac, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-850/50 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-300 truncate">
                        {getVehicleTypeLabel(vac.vehicleType, lang)}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          vac.vacancy === 0
                            ? 'text-rose-400'
                            : vac.vacancy && vac.vacancy > 0
                            ? 'text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {vac.vacancy === null ? '—' : vac.vacancy === 0 ? t.status.full : `${vac.vacancy} 位`}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. Pricing & Rates Details */}
            <motion.div variants={contentItemVariants}>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.detail.pricingTitle}</span>
              </div>

              {/* Duration-based Estimated Price Banner */}
              {lot.pricing?.hourlyRate && (
                <div className="mb-2.5 p-3 rounded-xl bg-sky-950/40 border border-sky-600/30 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200">
                      {lang === 'tc' ? `預估費用 (泊 ${parkingDurationHours} 小時)` : `Estimated Price (${parkingDurationHours}h)`}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-sky-400">
                      HK${lot.pricing.hourlyRate * parkingDurationHours}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      (${lot.pricing.hourlyRate}/h)
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center">
                {/* Hourly */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-800/30 flex flex-col justify-center">
                  <span className="text-slate-400 text-[11px] block mb-0.5">
                    {lang === 'tc' ? '基礎時租' : 'Hourly Rate'}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {lot.pricing?.hourlyRate ? `HK$${lot.pricing.hourlyRate}` : (lang === 'tc' ? '現場公布' : 'On-site')}
                  </span>
                </div>

                {/* Day park */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-800/30 flex flex-col justify-center">
                  <span className="text-slate-400 text-[11px] block mb-0.5">
                    {lang === 'tc' ? '全日泊 / 日泊' : 'Day Rate'}
                  </span>
                  <span className={`text-sm sm:text-base ${lot.pricing?.dayRate ? 'font-bold text-white' : 'text-xs text-slate-400 font-medium'}`}>
                    {lot.pricing?.dayRate ? `HK$${lot.pricing.dayRate}` : '—'}
                  </span>
                </div>

                {/* Night park */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-800/30 flex flex-col justify-center">
                  <span className="text-slate-400 text-[11px] block mb-0.5">
                    {lang === 'tc' ? '夜泊優惠' : 'Night Rate'}
                  </span>
                  <span className={`text-sm sm:text-base ${lot.pricing?.nightRate ? 'font-bold text-white' : 'text-xs text-slate-400 font-medium'}`}>
                    {lot.pricing?.nightRate ? `HK$${lot.pricing.nightRate}` : '—'}
                  </span>
                </div>
              </div>

              {/* Payment Methods Chips */}
              {lot.pricing?.paymentMethods && lot.pricing.paymentMethods.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 mr-0.5">
                    {t.detail.paymentLabel}:
                  </span>
                  {lot.pricing.paymentMethods.map((m, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-medium border border-slate-700/60"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 5. Key Specs & Facilities */}
            <motion.div variants={contentItemVariants}>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.detail.facilities}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Height Clearance */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-800/20">
                  <Ruler className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">{t.detail.heightLimit}</span>
                    <span className="font-bold text-white">
                      {lot.heightLimit ? `${lot.heightLimit} m` : (lang === 'tc' ? '現場留意標示' : 'Check on-site')}
                    </span>
                  </div>
                </div>

                {/* EV Charging */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-800/20">
                  {lot.facilities?.evCharging ? (
                    <>
                      <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-400 block">{lang === 'tc' ? '電動車' : 'EV'}</span>
                        <span className="font-bold text-emerald-300">{t.detail.evChargingAvailable}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ZapOff className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-400 block">{lang === 'tc' ? '電動車' : 'EV'}</span>
                        <span className="text-slate-400 font-medium">{lang === 'tc' ? '無充電樁' : 'No EV Charging'}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Accessibility */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-800/20">
                  <Accessibility className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">{lang === 'tc' ? '無障礙' : 'Accessibility'}</span>
                    <span className="text-slate-300 font-medium">{t.detail.disabledAccess}</span>
                  </div>
                </div>

                {/* Indoor / Covered */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-800/20">
                  <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">{lang === 'tc' ? '泊位類型' : 'Type'}</span>
                    <span className="text-slate-300 font-medium">{t.detail.covered}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 6. Remarks & Special notes (if present) */}
            {lot.remarks && (
              <motion.div
                variants={contentItemVariants}
                className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs"
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>{t.detail.remarks}</span>
                </div>
                <p className="text-amber-200/90 leading-relaxed">
                  {lot.remarks[lang]}
                </p>
              </motion.div>
            )}

            {/* 7. Contact & Official Website */}
            {(lot.contactNumber || lot.website) && (
              <motion.div
                variants={contentItemVariants}
                className="flex flex-wrap items-center gap-2 pt-1"
              >
                {lot.contactNumber && (
                  <a
                    href={`tel:${lot.contactNumber.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/80 transition min-h-[36px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.detail.call}: {lot.contactNumber}</span>
                  </a>
                )}

                {lot.website && (
                  <a
                    href={lot.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/80 transition min-h-[36px]"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.detail.website}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/95 flex items-center justify-end pb-[max(env(safe-area-inset-bottom),0.75rem)]">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer min-h-[36px]"
            >
              {lang === 'tc' ? '關閉' : 'Close'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

