'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ExternalLink, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Campaign, PlatformType } from '../../lib/types/database';
import { StatusBadge } from '../shared/StatusBadge';
import { useLanguage } from '../../lib/i18n/context';
import { ClipBDRepository } from '../../lib/db/repository';

export function CampaignsClient({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE');

  useEffect(() => {
    ClipBDRepository.getCampaigns('ALL').then((loaded) => {
      if (loaded && loaded.length > 0) {
        setCampaigns(loaded);
      }
    });
  }, []);

  const filtered = campaigns.filter((c) => {
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
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.campaignsPage.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">{t.campaignsPage.platformLabel}</span>
          </div>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] focus:outline-none"
          >
            <option value="ALL">{t.campaignsPage.allPlatforms}</option>
            <option value="TIKTOK">TikTok</option>
            <option value="INSTAGRAM">Instagram Reels</option>
            <option value="YOUTUBE">YouTube Shorts</option>
            <option value="FACEBOOK">Facebook</option>
          </select>

          <span className="text-zinc-400 dark:text-zinc-600 font-mono text-xs hidden sm:inline">|</span>

          <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 hidden sm:inline">
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
      {filtered.length === 0 ? (
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
                className="neo-btn neo-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>{t.campaignsPage.launchOnWhatsApp}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((campaign) => (
            <div
              key={campaign.id}
              className="neo-box bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between space-y-5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                    {campaign.category}
                  </span>
                  <StatusBadge status={campaign.status} />
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-base font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight line-clamp-2">
                    {campaign.title}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono font-bold">
                    by {campaign.clientName}
                  </p>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {campaign.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-zinc-950/10 dark:border-zinc-800 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-950/10 dark:border-zinc-700">
                    <span className="text-zinc-400 block text-[10px] font-bold">RATE (CPM)</span>
                    <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                      ৳{campaign.cpmRate}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-950/10 dark:border-zinc-700">
                    <span className="text-zinc-400 block text-[10px] font-bold">BUDGET LEFT</span>
                    <span className="font-black text-zinc-950 dark:text-white text-sm">
                      ৳{campaign.remainingBudget.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Platform Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {campaign.platforms.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-950/20 dark:border-zinc-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/campaigns/${campaign.slug || campaign.id}`}
                  className="neo-btn neo-btn-primary w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <span>{t.campaigns.briefAndSubmit}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
