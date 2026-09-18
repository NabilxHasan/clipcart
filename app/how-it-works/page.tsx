'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const hw = t.howItWorksPage;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 pb-4">
        <div className="flex items-center gap-2">
          <span className="neo-sticker bg-rose-100 text-rose-950 border-rose-950">
            {hw.tag}
          </span>
          <span className="neo-sticker bg-zinc-900 text-white">
            4-Step System
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
          {hw.title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
          {hw.subtitle}
        </p>
      </div>

      {/* Step 1 */}
      <div className="neo-box p-6 sm:p-7 space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
        <div className="flex items-center gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-rose-600 text-white font-['Unbounded'] font-black flex items-center justify-center text-sm border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            {hw.step1Num}
          </span>
          <h2 className="text-lg sm:text-xl font-['Unbounded'] font-black text-zinc-950 dark:text-white">{hw.step1Title}</h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-13 font-medium">
          {hw.step1Desc}
        </p>
      </div>

      {/* Step 2 */}
      <div className="neo-box p-6 sm:p-7 space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
        <div className="flex items-center gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-zinc-950 dark:bg-zinc-800 text-white font-['Unbounded'] font-black flex items-center justify-center text-sm border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            {hw.step2Num}
          </span>
          <h2 className="text-lg sm:text-xl font-['Unbounded'] font-black text-zinc-950 dark:text-white">{hw.step2Title}</h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-13 font-medium">
          {hw.step2Desc}
        </p>
      </div>

      {/* Step 3 */}
      <div className="neo-box p-6 sm:p-7 space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
        <div className="flex items-center gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-['Unbounded'] font-black flex items-center justify-center text-sm border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            {hw.step3Num}
          </span>
          <h2 className="text-lg sm:text-xl font-['Unbounded'] font-black text-zinc-950 dark:text-white">{hw.step3Title}</h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-13 font-medium">
          {hw.step3Desc}
        </p>
      </div>

      {/* Step 4 */}
      <div className="neo-box p-6 sm:p-7 space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
        <div className="flex items-center gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 font-['Unbounded'] font-black flex items-center justify-center text-sm border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            {hw.step4Num}
          </span>
          <h2 className="text-lg sm:text-xl font-['Unbounded'] font-black text-zinc-950 dark:text-white">{hw.step4Title}</h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-13 font-medium">
          {hw.step4Desc}
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/campaigns"
          className="neo-btn neo-btn-primary px-6 py-3 text-xs"
        >
          {hw.ctaExplore}
        </Link>
        <Link
          href="/client-request"
          className="neo-btn neo-btn-white px-6 py-3 text-xs"
        >
          {hw.ctaLaunch}
        </Link>
      </div>
    </div>
  );
}
