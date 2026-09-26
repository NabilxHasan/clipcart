'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { useLanguage } from '../../../lib/i18n/context';

export default function LeaderboardPage() {
  const { t, lang } = useLanguage();
  const [leaders, setLeaders] = useState<Array<{
    rank: number;
    name: string;
    tiktokHandle?: string;
    approvedViews: number;
    approvedClips: number;
    approvedEarnings: number;
  }>>([]);

  const [timeFilter, setTimeFilter] = useState<'ALL_TIME' | 'THIS_MONTH' | 'THIS_WEEK'>('ALL_TIME');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await ClipBDRepository.getLeaderboard();
      setLeaders(data);
      setLoading(false);
    }
    load();
  }, [timeFilter]);

  const timeFilterLabels: Record<'ALL_TIME' | 'THIS_MONTH' | 'THIS_WEEK', string> = {
    ALL_TIME: t.dashboardLeaderboard.filterAllTime,
    THIS_MONTH: t.dashboardLeaderboard.filterThisMonth,
    THIS_WEEK: t.dashboardLeaderboard.filterThisWeek,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              {t.dashboardLeaderboard.tagTopCutters}
            </span>
            <span className="neo-sticker bg-amber-100 text-amber-950 border-amber-950 text-[10px] flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-600" />
              {t.dashboardLeaderboard.tagVerifiedPerformance}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            {t.dashboardLeaderboard.title}
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            {t.dashboardLeaderboard.subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-mono shrink-0">
          {(['ALL_TIME', 'THIS_MONTH', 'THIS_WEEK'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1.5 rounded-xl font-bold border-2 transition-all ${
                timeFilter === tf
                  ? 'bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-950 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {timeFilterLabels[tf] || tf.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="neo-box overflow-hidden">
        <div className="p-5 border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-[#181920] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span className="font-['Unbounded'] font-bold text-xs uppercase text-zinc-950 dark:text-white">
              {t.dashboardLeaderboard.cardTitle}
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
            {t.dashboardLeaderboard.activeRanked.replace('{count}', String(leaders.length))}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
            {t.dashboardLeaderboard.loading}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase font-bold">
                <tr>
                  <th className="py-3 px-4 text-center w-16">{t.dashboardLeaderboard.thRank}</th>
                  <th className="py-3 px-4">{t.dashboardLeaderboard.thClipper}</th>
                  <th className="py-3 px-4 text-right">{t.dashboardLeaderboard.thViews}</th>
                  <th className="py-3 px-4 text-right">{t.dashboardLeaderboard.thClips}</th>
                  <th className="py-3 px-4 text-right">{t.dashboardLeaderboard.thPayouts}</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#14151a]">
                {leaders.map((lead) => {
                  return (
                    <tr 
                      key={lead.rank} 
                      className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-850 ${
                        lead.rank === 1 ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        {lead.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400 text-zinc-950 font-black border-2 border-zinc-950 shadow-[2px_2px_0px_#09090b] text-xs">
                            🥇 1
                          </span>
                        ) : lead.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-200 text-zinc-950 font-black border-2 border-zinc-950 shadow-[2px_2px_0px_#09090b] text-xs">
                            🥈 2
                          </span>
                        ) : lead.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-600 text-white font-black border-2 border-zinc-950 shadow-[2px_2px_0px_#09090b] text-xs">
                            🥉 3
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-zinc-500 dark:text-zinc-400 text-xs">
                            #{lead.rank}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-950 dark:text-white font-['Space_Grotesk'] text-sm">
                          {lead.name}
                        </div>
                        {lead.tiktokHandle && (
                          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                            {lead.tiktokHandle}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right font-black text-zinc-950 dark:text-white text-sm bn-amount">
                        {lead.approvedViews.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right font-bold text-zinc-600 dark:text-zinc-300 bn-amount">
                        {lead.approvedClips} {t.dashboardLeaderboard.clipsSuffix}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right font-black text-emerald-600 dark:text-emerald-400 text-sm bn-amount">
                        ৳{lead.approvedEarnings.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
