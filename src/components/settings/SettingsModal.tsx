import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../../i18n/context';
import { X, Shield, Database, Award, Globe, Check } from 'lucide-react';
import { AppLogo } from '../common/AppLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { lang, setLang, t } = useI18n();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="settings-modal-backdrop"
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
            key="settings-modal-content"
            initial={{ y: '100%', opacity: 0.6, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-2.5 sm:hidden" />

            {/* Header */}
            <div className="px-5 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AppLogo className="w-6 h-6" size={24} />
                <h2 className="font-bold text-lg text-white">
                  {t.settings.title}
                </h2>
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

            {/* Content */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-sm">
              {/* 1. Language Toggle */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span>{t.settings.language}</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setLang('tc')}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between min-h-[46px] ${
                      lang === 'tc'
                        ? 'bg-sky-600 border-sky-500 text-white shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    <span>繁體中文 (香港)</span>
                    {lang === 'tc' && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between min-h-[46px] ${
                      lang === 'en'
                        ? 'bg-sky-600 border-sky-500 text-white shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    <span>English</span>
                    {lang === 'en' && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>
                </div>
              </div>

              {/* 2. Transparent Algorithm Explanation */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <div className="flex items-center gap-2 font-bold text-white text-xs mb-1.5">
                  <Award className="w-4 h-4 text-sky-400" />
                  <span>{t.settings.scoreFormula}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.settings.scoreFormulaDesc}
                </p>
              </div>

              {/* 3. Data Attribution */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <div className="flex items-center gap-2 font-bold text-white text-xs mb-1.5">
                  <Database className="w-4 h-4 text-sky-400" />
                  <span>{t.settings.dataSources}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.settings.dataSourceDesc}
                </p>
              </div>

              {/* 4. Privacy Policy */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <div className="flex items-center gap-2 font-bold text-white text-xs mb-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>{t.settings.privacyTitle}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.settings.privacyDesc}
                </p>
              </div>

              <div className="text-center pt-2 text-xs text-slate-400">
                {t.settings.version} • Made for Hong Kong Drivers
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end pb-[max(env(safe-area-inset-bottom),1rem)]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition cursor-pointer min-h-[42px]"
              >
                {lang === 'tc' ? '完成' : 'Done'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
