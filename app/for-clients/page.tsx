'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';

export default function ForClientsPage() {
  const { t } = useLanguage();
  const cp = t.forClientsPage;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 pb-4">
        <div className="flex items-center gap-2">
          <span className="neo-sticker bg-rose-100 text-rose-950 border-rose-950">
            {cp.tag}
          </span>
          <span className="neo-sticker bg-zinc-900 text-white">
            10% Transparent Fee
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
          {cp.title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
          {cp.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="neo-box p-6 space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 text-rose-600 dark:text-rose-400 flex items-center justify-center font-['Unbounded'] font-black text-sm shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            {cp.box1Num}
          </div>
          <h2 className="text-lg font-['Unbounded'] font-bold text-zinc-950 dark:text-white">{cp.box1Title}</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {cp.box1Desc}
          </p>
        </div>

        <div className="neo-box p-6 space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 text-rose-600 dark:text-rose-400 flex items-center justify-center font-['Unbounded'] font-black text-sm shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            {cp.box2Num}
          </div>
          <h2 className="text-lg font-['Unbounded'] font-bold text-zinc-950 dark:text-white">{cp.box2Title}</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {cp.box2Desc}
          </p>
        </div>

        <div className="neo-box p-6 space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 text-rose-600 dark:text-rose-400 flex items-center justify-center font-['Unbounded'] font-black text-sm shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            {cp.box3Num}
          </div>
          <h2 className="text-lg font-['Unbounded'] font-bold text-zinc-950 dark:text-white">{cp.box3Title}</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {cp.box3Desc}
          </p>
        </div>

        <div className="neo-box p-6 space-y-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 text-rose-600 dark:text-rose-400 flex items-center justify-center font-['Unbounded'] font-black text-sm shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            {cp.box4Num}
          </div>
          <h2 className="text-lg font-['Unbounded'] font-bold text-zinc-950 dark:text-white">{cp.box4Title}</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {cp.box4Desc}
          </p>
        </div>
      </div>

      <div className="neo-box-lg p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="neo-sticker bg-zinc-900 dark:bg-zinc-800 text-white border-zinc-950 dark:border-zinc-700 text-[10px]">
            Bangladesh Micro-Tiers Available
          </span>
          <h3 className="text-xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">{cp.ctaTitle}</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{cp.ctaSubtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link
            href="/client-request"
            className="neo-btn neo-btn-primary px-6 py-3 text-xs"
          >
            <span>{cp.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/8801337142248?text=Hello%20ClipCart%2C%20I%20want%20to%20launch%20a%20video%20campaign%20for%20my%20brand."
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn neo-btn-whatsapp px-5 py-3 text-xs"
          >
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
