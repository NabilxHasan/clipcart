'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ExternalLink, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Campaign, PlatformType } from '../../lib/types/database';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ClipBDRepository } from '../../lib/db/repository';
import { useLanguage } from '../../lib/i18n/context';

export default function CampaignsPage() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE');

  useEffect(() => {
    async function load() {
      const data = await ClipBDRepository.getCampaigns('ALL');
      setCampaigns(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = campaigns.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform =
      selectedPlatform === 'ALL' || c.platforms.includes(selectedPlatform as PlatformType);
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="neo-sticker bg-zinc-900 text-white dark:bg-zinc-800 dark:border-zinc-700">
            {t.campaignsPage.tagMarketplace}
          </span>
          <span className="neo-sticker bg-rose-100 text-rose-900 border-rose-950 dark:bg-rose-950/60 dark:text-rose-300 dark:border-zinc-700">
            {t.campaignsPage.tagActive}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
          {t.campaignsPage.title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
          {t.campaignsPage.subtitle}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="neo-box p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
          <input
            type="text"
            placeholder={t.campaignsPage.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-1 font-mono font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t.campaignsPage.platformLabel}
          </span>
          {['ALL', 'TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK'].map(plat => (
            <button
              key={plat}
              type="button"
              onClick={() => setSelectedPlatform(plat)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border-2 border-zinc-950 dark:border-zinc-700 transition-all cursor-pointer ${
                selectedPlatform === plat
                  ? 'bg-rose-600 text-white shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                  : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
              }`}
            >
              {plat === 'ALL' ? t.campaignsPage.allPlatforms : plat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-700 dark:text-zinc-300 font-mono font-bold">
            {t.campaignsPage.statusLabel}
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] focus:outline-none"
          >
            <option value="ALL">{t.campaignsPage.allStatuses}</option>
            <option value="ACTIVE">{t.campaignsPage.statusActive}</option>
            <option value="PENDING_PAYMENT">{t.campaignsPage.statusPendingPayment}</option>
            <option value="COMPLETED">{t.campaignsPage.statusCompleted}</option>
          </select>
        </div>
      </div>

      {/* Campaign Grid */}
      {loading ? (
        <div className="neo-box p-12 text-center text-sm text-zinc-600 dark:text-zinc-400 font-mono font-bold">
          {t.campaignsPage.loadingText}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="neo-box-lg p-8 sm:p-12 text-center space-y-6 bg-white dark:bg-[#14151a]">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-[3px_3px_0px_#e11d48]">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              {t.campaignsPage.emptyBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
              {t.campaignsPage.emptyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              {t.campaignsPage.emptyDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2 text-left">
            <div className="neo-box p-5 space-y-3 bg-zinc-50 dark:bg-zinc-800/80 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[11px] font-['Unbounded'] font-bold text-zinc-950 dark:text-white uppercase block">
                  {t.campaignsPage.forEditorsTag}
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  {t.campaignsPage.forEditorsDesc}
                </p>
              </div>
              <a
                href="https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn bg-[#25D366] hover:bg-[#20b858] text-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t.campaignsPage.joinWhatsApp}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="neo-box p-5 space-y-3 bg-zinc-50 dark:bg-zinc-800/80 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[11px] font-['Unbounded'] font-bold text-zinc-950 dark:text-white uppercase block">
                  {t.campaignsPage.forBrandsTag}
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  {t.campaignsPage.forBrandsDesc}
                </p>
              </div>
              <a
                href="https://wa.me/8801337142248?text=Hello%20ClipCart%2C%20I%20want%20to%20launch%20a%20campaign"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn neo-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t.campaignsPage.launchOnWhatsApp}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="neo-box p-12 text-center space-y-4">
          <p className="text-base text-zinc-800 dark:text-zinc-200 font-bold">
            {t.campaignsPage.noMatchTitle}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedPlatform('ALL');
              setSelectedStatus('ALL');
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-950 dark:bg-zinc-800 text-white border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] hover:bg-zinc-800 cursor-pointer"
          >
            {t.campaignsPage.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(campaign => (
            <div
              key={campaign.id}
              className="neo-box p-6 flex flex-col justify-between space-y-5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                      {campaign.clientName}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-500">•</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-950 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold">
                      {campaign.category}
                    </span>
                  </div>
                  <StatusBadge status={campaign.status} size="sm" />
                </div>

                <Link href={`/campaigns/${campaign.slug}`}>
                  <h3 className="text-xl font-['Unbounded'] font-black text-zinc-950 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors leading-snug">
                    {campaign.title}
                  </h3>
                </Link>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed font-medium">
                  {campaign.description}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-zinc-950 dark:border-zinc-700 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold block uppercase">
                      {t.campaignsPage.cpmRate}
                    </span>
                    <span className="font-black text-emerald-800 dark:text-emerald-400 text-sm">
                      ৳ {campaign.cpmRate}{t.campaignsPage.per1k}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold block uppercase">
                      {t.campaignsPage.budgetLeft}
                    </span>
                    <span className="font-black text-zinc-950 dark:text-white text-sm">
                      ৳ {campaign.remainingBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold block uppercase">
                      {t.campaignsPage.maxPerClip}
                    </span>
                    <span className="font-black text-rose-800 dark:text-rose-400 text-sm">
                      ৳ {campaign.maxPayoutPerClip.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1.5 flex-wrap">
                    {campaign.platforms.map(p => (
                      <span
                        key={p}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-950 dark:border-zinc-700 text-[10px] font-mono font-bold text-zinc-900 dark:text-zinc-200"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/campaigns/${campaign.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-['Unbounded'] font-bold text-white bg-rose-600 hover:bg-rose-700 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#09090b] transition-all"
                  >
                    <span>{t.campaignsPage.viewBrief}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
