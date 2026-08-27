import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../domain/types';
import { translations, Translations } from './translations';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'parkinghk_language';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'tc') {
        return saved;
      }
      // Auto-detect browser language: if starts with zh, default to Traditional Chinese
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes('zh') || browserLang.includes('hk') || browserLang.includes('tw')) {
        return 'tc';
      }
    } catch {
      // Fallback
    }
    return 'tc'; // Default Hong Kong Traditional Chinese
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang === 'tc' ? 'zh-HK' : 'en';
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'tc' ? 'zh-HK' : 'en';
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: translations[lang]
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
