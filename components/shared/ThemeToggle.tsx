'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/theme/context';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label="Toggle color theme"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border-2 border-zinc-950 bg-white text-zinc-900 shadow-[2px_2px_0px_#09090b] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#09090b] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#000000] dark:hover:bg-zinc-700 ${className}`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-zinc-800 fill-zinc-800" />
          <span className="hidden xl:inline text-[11px]">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="hidden xl:inline text-[11px]">Light</span>
        </>
      )}
    </button>
  );
}
