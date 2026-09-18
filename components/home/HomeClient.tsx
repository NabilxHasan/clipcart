'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Banknote, 
  CheckCircle2, 
  ChevronRight,
  MessageCircle,
  Sparkles,
  Calculator,
  Flame,
  Zap,
  Users
} from 'lucide-react';
import { Campaign } from '../../lib/types/database';
import { StatusBadge } from '../shared/StatusBadge';
import { useLanguage } from '../../lib/i18n/context';

export function HomeClient({ activeCampaigns }: { activeCampaigns: Campaign[] }) {
  const { t } = useLanguage();

  // Campaign Calculator State (Flexible BD Market Tiers)
  const [calcTier, setCalcTier] = useState<'1000' | '2500' | '5000' | 'custom'>('1000');
  const [customBudget, setCustomBudget] = useState<number>(3000);
  const [customDays, setCustomDays] = useState<number>(4);

  const getTierDetails = () => {
    switch (calcTier) {
      case '1000':
        return { budget: 1000, days: 3, cpm: 50 };
      case '2500':
        return { budget: 2500, days: 5, cpm: 60 };
      case '5000':
        return { budget: 5000, days: 7, cpm: 75 };
      case 'custom':
        return { budget: customBudget, days: customDays, cpm: 60 };
    }
  };

  const currentTier = getTierDetails();
  const platformFee = Math.round(currentTier.budget * 0.10); // 10% platform fee
  const totalCampaignCost = currentTier.budget + platformFee;
  const estimatedViews = Math.round((currentTier.budget / currentTier.cpm) * 1000);

  // Pre-formatted WhatsApp Business link for brands (+8801337142248)
  const whatsappCalcLaunchUrl = 'https://wa.me/8801337142248?text=' + encodeURIComponent(
    `Hi ClipCart! I want to launch a ৳${currentTier.budget.toLocaleString()} campaign for ${currentTier.days} days (৳${currentTier.cpm} CPM, Est. ${estimatedViews.toLocaleString()} views). Please set up my brand brief!`
  );

  const whatsappGeneralLaunchUrl = 'https://wa.me/8801337142248?text=' + encodeURIComponent(
    'Hi ClipCart, I want to launch a content clipping campaign for my brand.'
  );

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION (GP FutureMakers High-Energy Canvas) */}
      <section className="relative pt-6 sm:pt-12 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Top Neo-Sticker Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] text-zinc-900 dark:text-zinc-100">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse shrink-0" />
            <span className="uppercase tracking-wide">{t.hero.badge}</span>
          </div>

          {/* Bold Display Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-['Unbounded'] font-black tracking-tight text-zinc-950 dark:text-white uppercase leading-[1.12]">
            {t.hero.titleStart}
            <span className="relative inline-block mx-1.5 px-3 py-1 bg-rose-600 text-white rounded-xl border-[2.5px] border-zinc-950 dark:border-zinc-700 shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000] rotate-[-1.5deg]">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-['Space_Grotesk'] font-medium">
            {t.hero.subtitle}
          </p>

          {/* Floating Feature Stickers (FutureMakers aesthetic) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-1">
            <span className="neo-sticker bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] rotate-[-1.5deg]">
              🔥 ৳1,000 Micro-Campaigns (3 Days)
            </span>
            <span className="neo-sticker bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] rotate-[1.5deg]">
              💰 ৳50 Min Cashout • 0% Clipper Fee
            </span>
            <span className="neo-sticker bg-zinc-950 dark:bg-zinc-850 text-white border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] rotate-[-1deg]">
              🛡️ 10% Brand Curation Fee
            </span>
            <a 
              href="https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-sticker bg-[#25D366] text-white border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] rotate-[2deg] hover:scale-105 transition-transform"
            >
              💬 Clipper WhatsApp Community
            </a>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-['Unbounded'] font-bold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-500 border-[2.5px] border-zinc-950 dark:border-zinc-700 shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#09090b] transition-all flex items-center justify-center gap-2 text-center"
            >
              <span>{t.hero.becomeClipper}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappGeneralLaunchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-['Unbounded'] font-bold text-xs sm:text-sm text-zinc-950 dark:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 border-[2.5px] border-zinc-950 dark:border-zinc-700 shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#09090b] transition-all flex items-center justify-center gap-2 text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.hero.launchCampaign}</span>
            </a>

            <Link
              href="/campaigns"
              className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-['Space_Grotesk'] font-bold text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-center"
            >
              {t.hero.viewCampaigns}
            </Link>
          </div>

          {/* Trust Guarantees Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400 font-['JetBrains_Mono'] font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.hero.trustBkash}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{t.hero.trustAudit}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>{t.hero.trustNoBots}</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. NEO-MARQUEE TICKER (High-Voltage FutureMakers Strip) */}
      <div className="border-y-[2.5px] border-zinc-950 bg-zinc-950 text-white py-3.5 overflow-hidden shadow-[0px_4px_0px_#e11d48]">
        <div className="flex items-center gap-8 whitespace-nowrap animate-[fmMarquee_25s_linear_infinite] font-['Unbounded'] font-black text-xs uppercase tracking-wider">
          <span className="flex items-center gap-2 text-rose-500">
            <Flame className="w-4 h-4" /> NO SCRIPTED ADS
          </span>
          <span className="text-zinc-600">✦</span>
          <span>MICRO-CAMPAIGNS STARTING ৳1,000 FOR 3 DAYS</span>
          <span className="text-zinc-600">✦</span>
          <span className="text-emerald-400">৳50 CPM RATE (৳50 PER 1K VIEWS)</span>
          <span className="text-zinc-600">✦</span>
          <span>10% PLATFORM CURATION & AUDIT FEE</span>
          <span className="text-zinc-600">✦</span>
          <span className="text-rose-400">0% FEES FOR CLIPPERS (৳50 MIN CASHOUT)</span>
          <span className="text-zinc-600">✦</span>
          <span>MANDATORY WHATSAPP CLIPPER COMMUNITY</span>
          <span className="text-zinc-600">✦</span>
          <span className="flex items-center gap-2 text-rose-500">
            <Flame className="w-4 h-4" /> NO SCRIPTED ADS
          </span>
          <span className="text-zinc-600">✦</span>
          <span>MICRO-CAMPAIGNS STARTING ৳1,000 FOR 3 DAYS</span>
          <span className="text-zinc-600">✦</span>
          <span className="text-emerald-400">৳50 CPM RATE</span>
        </div>
      </div>

      {/* 3. INTERACTIVE FLEXIBLE CAMPAIGN CALCULATOR (Bangladesh Friendly) */}
      {/* 3. INTERACTIVE FLEXIBLE CAMPAIGN CALCULATOR (Bangladesh Friendly) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="neo-box-lg bg-white dark:bg-[#14151a] p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-950 dark:border-zinc-700 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-['JetBrains_Mono'] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-zinc-950 dark:border-zinc-700">
                <Calculator className="w-3.5 h-3.5" />
                <span>BANGLADESH FLEXIBLE BUDGET CALCULATOR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-zinc-950 dark:text-white">
                Design Your Campaign Budget
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk'] font-medium">
                No rigid ৳50,000 contracts. Start with flexible 3-day micro-campaigns to test hooks, or scale across Dhaka with larger sprints.
              </p>
            </div>
            
            <div className="neo-sticker bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-zinc-950 dark:border-emerald-800 self-start sm:self-center rotate-[1.5deg]">
              10% Service Fee • 0% Clipper Fee
            </div>
          </div>

          {/* Tier Selector Buttons */}
          <div className="space-y-3">
            <span className="text-xs font-['JetBrains_Mono'] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
              Select Campaign Package / Duration:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setCalcTier('1000')}
                className={`p-3.5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 text-left transition-all ${
                  calcTier === '1000'
                    ? 'bg-rose-600 text-white shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                }`}
              >
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold block opacity-90">Micro-Sprint</span>
                <span className="text-lg font-['Unbounded'] font-black block">৳1,000</span>
                <span className="text-xs font-medium opacity-90">3 Days • ৳50 CPM</span>
              </button>

              <button
                type="button"
                onClick={() => setCalcTier('2500')}
                className={`p-3.5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 text-left transition-all ${
                  calcTier === '2500'
                    ? 'bg-rose-600 text-white shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                }`}
              >
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold block opacity-90">Growth Run</span>
                <span className="text-lg font-['Unbounded'] font-black block">৳2,500</span>
                <span className="text-xs font-medium opacity-90">5 Days • ৳60 CPM</span>
              </button>

              <button
                type="button"
                onClick={() => setCalcTier('5000')}
                className={`p-3.5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 text-left transition-all ${
                  calcTier === '5000'
                    ? 'bg-rose-600 text-white shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                }`}
              >
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold block opacity-90">Viral Surge</span>
                <span className="text-lg font-['Unbounded'] font-black block">৳5,000</span>
                <span className="text-xs font-medium opacity-90">7 Days • ৳75 CPM</span>
              </button>

              <button
                type="button"
                onClick={() => setCalcTier('custom')}
                className={`p-3.5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 text-left transition-all ${
                  calcTier === 'custom'
                    ? 'bg-rose-600 text-white shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000] translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                }`}
              >
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold block opacity-90">Custom BD</span>
                <span className="text-lg font-['Unbounded'] font-black block">Flexible</span>
                <span className="text-xs font-medium opacity-90">Tailored Budget</span>
              </button>
            </div>

            {/* Custom Sliders when 'custom' is selected */}
            {calcTier === 'custom' && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border-2 border-zinc-950 dark:border-zinc-700 space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-['JetBrains_Mono'] font-bold text-zinc-700 dark:text-zinc-300 block">
                      Custom Budget (৳ BDT): ৳{customBudget.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min={1000}
                      max={20000}
                      step={500}
                      value={customBudget}
                      onChange={(e) => setCustomBudget(Number(e.target.value))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-['JetBrains_Mono'] font-bold text-zinc-700 dark:text-zinc-300 block">
                      Campaign Duration: {customDays} Days
                    </label>
                    <input
                      type="range"
                      min={3}
                      max={30}
                      step={1}
                      value={customDays}
                      onChange={(e) => setCustomDays(Number(e.target.value))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Breakdown Box */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]">
            <div className="space-y-1">
              <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                Clipper Prize Pool
              </span>
              <span className="text-2xl font-['Unbounded'] font-black text-zinc-950 dark:text-white block">
                ৳{currentTier.budget.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">100% paid to editors</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                10% ClipCart Service Fee
              </span>
              <span className="text-2xl font-['Unbounded'] font-black text-rose-600 dark:text-rose-400 block">
                ৳{platformFee.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Brief, AI + view audit</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                Target Rate (CPM)
              </span>
              <span className="text-2xl font-['Unbounded'] font-black text-emerald-600 dark:text-emerald-400 block">
                ৳{currentTier.cpm}/1K
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Per 1,000 real views</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                Est. Verified Reach
              </span>
              <span className="text-2xl font-['Unbounded'] font-black text-zinc-950 dark:text-white block">
                ~{estimatedViews.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Across TikTok/Reels</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-['Space_Grotesk'] font-bold text-zinc-900 dark:text-zinc-100 block">
                Total Campaign Outlay: <span className="text-rose-600 dark:text-rose-400 font-['Unbounded'] font-extrabold text-base">৳{totalCampaignCost.toLocaleString()} BDT</span>
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-['JetBrains_Mono']">
                🔒 Only ClipCart Admins publish campaigns. No self-serve errors.
              </p>
            </div>

            <a
              href={whatsappCalcLaunchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-['Unbounded'] font-black text-xs text-white bg-emerald-600 hover:bg-emerald-500 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] dark:hover:shadow-[5px_5px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Launch on WhatsApp Business →</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. TWO-SIDED MARKETPLACE (Neo-Brutalist FutureMakers Cards) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* For Brands */}
          <div className="neo-box bg-white dark:bg-[#14151a] p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  {t.marketplace.forBrandsTag}
                </span>
                <h2 className="text-2xl font-['Unbounded'] font-black text-zinc-950 dark:text-white mt-1">
                  {t.marketplace.forBrandsTitle}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk'] leading-relaxed">
                {t.marketplace.forBrandsDesc}
              </p>
              <ul className="space-y-2.5 text-xs font-['Space_Grotesk'] font-medium text-zinc-800 dark:text-zinc-200 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Flexible CPM pricing (from ৳50 per 1,000 real views)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Strict content rules & 100% brand safety guarantee</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Turnkey service: 10% platform fee covers full curation & audits</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t-2 border-zinc-950/10 dark:border-zinc-800">
              <a
                href={whatsappGeneralLaunchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn font-['Unbounded'] text-xs font-bold w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Chat on WhatsApp Business</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* For Clippers */}
          <div className="neo-box bg-white dark:bg-[#14151a] p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  {t.marketplace.forClippersTag}
                </span>
                <h2 className="text-2xl font-['Unbounded'] font-black text-zinc-950 dark:text-white mt-1">
                  {t.marketplace.forClippersTitle}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk'] leading-relaxed">
                {t.marketplace.forClippersDesc}
              </p>
              <ul className="space-y-2.5 text-xs font-['Space_Grotesk'] font-medium text-zinc-800 dark:text-zinc-200 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct withdrawals to bKash (minimum ৳50, 0% fee • Nagad currently unavailable)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>One-time ৳50 signup fee stops spam bots & protects real editors</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Mandatory WhatsApp Community for instant footage releases</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t-2 border-zinc-950/10 dark:border-zinc-800">
              <Link
                href="/register"
                className="neo-btn-primary font-['Unbounded'] text-xs font-bold w-full flex items-center justify-center gap-2 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]"
              >
                <span>{t.marketplace.clipperCta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACTIVE CAMPAIGNS SHOWCASE (Neo-Brutalist Cards) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-zinc-950 dark:border-zinc-700 pb-4">
          <div>
            <span className="text-xs font-['JetBrains_Mono'] uppercase text-zinc-500 dark:text-zinc-400 font-bold tracking-wider">
              {t.campaigns.sectionTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-zinc-950 dark:text-white mt-1">
              {t.campaigns.title}
            </h2>
          </div>
          <Link
            href="/campaigns"
            className="text-xs font-['JetBrains_Mono'] font-bold text-rose-600 dark:text-rose-400 hover:text-zinc-950 dark:hover:text-white inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{t.campaigns.viewAll} ({activeCampaigns.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeCampaigns.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#14151a] border-2 border-zinc-950 dark:border-zinc-700 shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000]">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk']">{t.campaigns.noActive}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activeCampaigns.map(campaign => (
              <div
                key={campaign.id}
                className="neo-box bg-white dark:bg-[#14151a] p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-['JetBrains_Mono'] font-bold text-zinc-500 dark:text-zinc-400 truncate">
                      {campaign.clientName}
                    </span>
                    <StatusBadge status={campaign.status} size="sm" />
                  </div>
                  <Link href={`/campaigns/${campaign.slug}`}>
                    <h3 className="text-base font-['Unbounded'] font-bold text-zinc-950 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors line-clamp-2">
                      {campaign.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk'] line-clamp-2 leading-relaxed">
                    {campaign.description}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-zinc-950/10 dark:border-zinc-800 space-y-3">
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-950 dark:border-zinc-700">
                      <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block font-['JetBrains_Mono'] font-bold truncate">CPM</span>
                      <span className="font-black text-rose-600 dark:text-rose-400 font-['JetBrains_Mono'] text-xs">৳{campaign.cpmRate}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-950 dark:border-zinc-700">
                      <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block font-['JetBrains_Mono'] font-bold truncate">POOL</span>
                      <span className="font-black text-zinc-950 dark:text-white font-['JetBrains_Mono'] text-xs">৳{campaign.remainingBudget.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-950 dark:border-zinc-700">
                      <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block font-['JetBrains_Mono'] font-bold truncate">MAX/CLIP</span>
                      <span className="font-black text-zinc-800 dark:text-zinc-200 font-['JetBrains_Mono'] text-xs">৳{campaign.maxPayoutPerClip.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex gap-1 flex-wrap">
                      {campaign.platforms.map((p: string) => (
                        <span key={p} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-[9px] font-['JetBrains_Mono'] font-bold text-zinc-800 dark:text-zinc-200">
                          {p}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/campaigns/${campaign.slug}`}
                      className="text-xs font-['Unbounded'] font-bold text-rose-600 dark:text-rose-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 whitespace-nowrap pl-2"
                    >
                      <span>Brief</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS (Neo-Brutalist 4-Step Road) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b-2 border-zinc-950 dark:border-zinc-700 pb-4">
          <span className="text-xs font-['JetBrains_Mono'] uppercase text-zinc-500 dark:text-zinc-400 font-bold tracking-wider">
            {t.workflow.sectionTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-zinc-950 dark:text-white mt-1">
            {t.workflow.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="neo-box bg-white dark:bg-[#14151a] p-5 space-y-3">
            <span className="text-xs font-['JetBrains_Mono'] font-black text-rose-600 dark:text-rose-400 block">
              {t.workflow.step1Tag}
            </span>
            <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
              {t.workflow.step1Title}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk'] leading-relaxed">
              {t.workflow.step1Desc}
            </p>
          </div>

          <div className="neo-box bg-white dark:bg-[#14151a] p-5 space-y-3">
            <span className="text-xs font-['JetBrains_Mono'] font-black text-rose-600 dark:text-rose-400 block">
              {t.workflow.step2Tag}
            </span>
            <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
              {t.workflow.step2Title}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk'] leading-relaxed">
              {t.workflow.step2Desc}
            </p>
          </div>

          <div className="neo-box bg-white dark:bg-[#14151a] p-5 space-y-3">
            <span className="text-xs font-['JetBrains_Mono'] font-black text-rose-600 dark:text-rose-400 block">
              {t.workflow.step3Tag}
            </span>
            <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
              {t.workflow.step3Title}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk'] leading-relaxed">
              {t.workflow.step3Desc}
            </p>
          </div>

          <div className="neo-box bg-white dark:bg-[#14151a] p-5 space-y-3">
            <span className="text-xs font-['JetBrains_Mono'] font-black text-rose-600 dark:text-rose-400 block">
              {t.workflow.step4Tag}
            </span>
            <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
              {t.workflow.step4Title}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk'] leading-relaxed">
              {t.workflow.step4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 7. HIGH-VOLTAGE CALL TO ACTION BAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="neo-box-lg bg-rose-600 text-white p-8 sm:p-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 border-zinc-950 dark:border-zinc-700 shadow-[6px_6px_0px_#09090b] dark:shadow-[6px_6px_0px_#000000]">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-white">
              {t.cta.title}
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 font-['Space_Grotesk'] font-medium">
              {t.cta.subtitle}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href={whatsappGeneralLaunchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl font-['Unbounded'] font-black text-xs text-zinc-950 dark:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2 text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.cta.launchBrand}</span>
            </a>
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl font-['Unbounded'] font-bold text-xs text-white bg-zinc-950 dark:bg-zinc-900 hover:bg-zinc-900 dark:hover:bg-zinc-850 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] text-center"
            >
              {t.cta.joinClipper}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

