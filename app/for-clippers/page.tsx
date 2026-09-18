'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';

export default function ForClippersPage() {
  const { t } = useLanguage();
  const cp = t.forClippersPage;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 pb-4">
        <div className="flex items-center gap-2">
          <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950">
            {cp.tag}
          </span>
          <span className="neo-sticker bg-zinc-900 text-white">
            0% Fee On Earnings
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
          {cp.title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
          {cp.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
        <div className="neo-box p-5 space-y-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
          <span className="text-zinc-500 dark:text-zinc-400 font-bold text-[10px] block uppercase">{cp.card1Label}</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-['Unbounded']">{cp.card1Value}</span>
          <p className="text-zinc-600 dark:text-zinc-400 font-sans text-xs font-medium">{cp.card1Desc}</p>
        </div>
        <div className="neo-box p-5 space-y-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
          <span className="text-zinc-500 dark:text-zinc-400 font-bold text-[10px] block uppercase">{cp.card2Label}</span>
          <span className="text-2xl font-black text-zinc-950 dark:text-white font-['Unbounded']">{cp.card2Value}</span>
          <p className="text-zinc-600 dark:text-zinc-400 font-sans text-xs font-medium">{cp.card2Desc}</p>
        </div>
        <div className="neo-box p-5 space-y-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
          <span className="text-zinc-500 dark:text-zinc-400 font-bold text-[10px] block uppercase">{cp.card3Label}</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-['Unbounded']">{cp.card3Value}</span>
          <p className="text-zinc-600 dark:text-zinc-400 font-sans text-xs font-medium">{cp.card3Desc}</p>
        </div>
      </div>

      <div className="neo-box-lg p-6 sm:p-8 space-y-5">
        <h2 className="text-xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">{cp.qualificationTitle}</h2>
        <div className="space-y-3.5 text-xs text-zinc-700 dark:text-zinc-300">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border-2 border-zinc-950 dark:border-zinc-700 flex items-start gap-3 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-zinc-950 dark:text-white text-sm block">{cp.qual1Title}</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">{cp.qual1Desc}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border-2 border-zinc-950 dark:border-zinc-700 flex items-start gap-3 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-zinc-950 dark:text-white text-sm block">{cp.qual2Title}</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">{cp.qual2Desc}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border-2 border-zinc-950 dark:border-zinc-700 flex items-start gap-3 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-zinc-950 dark:text-white text-sm block">{cp.qual3Title}</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">{cp.qual3Desc}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-4">
        <Link
          href="/register"
          className="neo-btn neo-btn-primary px-6 py-3 text-xs"
        >
          <span>{cp.ctaJoin}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/campaigns"
          className="neo-btn neo-btn-white px-6 py-3 text-xs"
        >
          {cp.ctaCampaigns}
        </Link>
      </div>
    </div>
  );
}
