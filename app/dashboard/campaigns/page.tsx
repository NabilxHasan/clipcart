'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipBDRepository } from '../../../lib/db/repository';
import { Campaign } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useLanguage } from '../../../lib/i18n/context';

export default function DashboardCampaignsPage() {
  const { t, lang } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await ClipBDRepository.getActiveCampaigns();
      setCampaigns(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="neo-box-lg p-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="neo-sticker bg-zinc-950 text-white text-[10px]">{t.dashboardCampaigns.tagOpportunities}</span>
          <span className="neo-sticker bg-rose-100 text-rose-950 border-rose-950 text-[10px]">{t.dashboardCampaigns.tagSprints}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
          {t.dashboardCampaigns.title}
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          {t.dashboardCampaigns.subtitle}
        </p>
      </div>

      {loading ? (
        <div className="neo-box p-12 text-center text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">{t.dashboardCampaigns.loadingBriefs}</div>
      ) : campaigns.length === 0 ? (
        <div className="neo-box p-12 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          {t.dashboardCampaigns.noCampaigns}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {campaigns.map(c => (
            <div key={c.id} className="neo-box p-6 flex flex-col justify-between space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400">{c.clientName}</span>
                  <StatusBadge status={c.status} size="sm" />
                </div>
                <h3 className="text-lg font-['Unbounded'] font-black text-zinc-950 dark:text-white leading-snug">{c.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium line-clamp-2">{c.description}</p>
              </div>

              <div className="pt-3 border-t-2 border-zinc-950 dark:border-zinc-700 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b]">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-bold uppercase">{t.dashboardCampaigns.cpmRate}</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm bn-amount">৳{c.cpmRate}{t.dashboardCampaigns.per1k}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b]">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-bold uppercase">{t.dashboardCampaigns.budgetLeft}</span>
                    <span className="font-black text-zinc-950 dark:text-white text-sm bn-amount">৳{c.remainingBudget.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}</span>
                  </div>
                </div>

                <Link
                  href={`/campaigns/${c.slug}`}
                  className="w-full py-3 rounded-xl font-['Unbounded'] font-bold text-center text-xs uppercase text-white bg-rose-600 hover:bg-rose-700 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#09090b] transition-all block"
                >
                  {t.dashboardCampaigns.downloadAndSubmit}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
