'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';

interface LanguageToggleProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function LanguageToggle({ className = '', variant = 'compact' }: LanguageToggleProps) {
  const { lang, setLang } = useLanguage();

  if (variant === 'full') {
    return (
      <div className={`w-full bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 p-1.5 rounded-xl flex items-center gap-1.5 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] ${className}`}>
        <button
          type="button"
          onClick={() => setLang('bn')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
            lang === 'bn'
              ? 'bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border-transparent'
          }`}
          aria-label="বাংলা ভাষায় পরিবর্তন করুন"
        >
          <span className="text-sm">🇧🇩</span>
          <span>বাংলা (Bangla)</span>
        </button>
        <button
          type="button"
          onClick={() => setLang('en')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
            lang === 'en'
              ? 'bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border-transparent'
          }`}
          aria-label="Switch to English"
        >
          <span className="text-sm">🌐</span>
          <span>English</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-xl border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1 text-xs select-none shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <div className="pl-1.5 pr-1 text-zinc-500 dark:text-zinc-400 hidden sm:flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
          lang === 'en'
            ? 'bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[1px_1px_0px_#09090b] dark:shadow-[1px_1px_0px_#000000]'
            : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700'
        }`}
        title="Switch to English"
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('bn')}
        className={`px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
          lang === 'bn'
            ? 'bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[1px_1px_0px_#09090b] dark:shadow-[1px_1px_0px_#000000]'
            : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700'
        }`}
        title="বাংলায় পরিবর্তন করুন"
        aria-pressed={lang === 'bn'}
      >
        বাং
      </button>
    </div>
  );
}
