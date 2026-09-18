'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationSchema } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to 'bn' (Bangla) as requested for Bangladesh-first audience, with instant EN toggle
  const [lang, setLangState] = useState<Language>('bn');

  useEffect(() => {
    const saved = (localStorage.getItem('clipcart_lang') || localStorage.getItem('clipbd_lang')) as Language | null;
    if (saved === 'en' || saved === 'bn') {
      setLangState(saved);
      document.documentElement.lang = saved;
    } else {
      document.documentElement.lang = 'bn';
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clipcart_lang', newLang);
      document.documentElement.lang = newLang;
    }
  };

  const toggleLang = () => {
    const next = lang === 'bn' ? 'en' : 'bn';
    setLang(next);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
