'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Banknote, 
  Clock, 
  CheckCircle2, 
  Flame, 
  ArrowRight, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { ClipBDRepository } from '../../lib/db/repository';
import { Submission } from '../../lib/types/database';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { SafeExternalLink } from '../../components/shared/SafeExternalLink';

export default function ClipperOverviewPage() {
  const [financials, setFinancials] = useState<{
    availableBalance: number;
    pendingEarnings: number;
    totalApprovedEarnings: number;
  } | null>(null);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeCampaignsCount, setActiveCampaignsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Default demo user: Tanvir
  const currentUserId = 'usr-clipper-01';

  useEffect(() => {
    async function load() {
      const fin = await ClipBDRepository.getClipperFinancials(currentUserId);
      const subs = await ClipBDRepository.getSubmissions({ clipperId: currentUserId });
      const camps = await ClipBDRepository.getActiveCampaigns();

      setFinancials(fin);
      setSubmissions(subs.slice(0, 5)); // recent 5
      setActiveCampaignsCount(camps.length);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !financials) {
    return (
      <div className="neo-box p-12 text-center font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">
        Loading real-time ledger data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white text-[10px]">Verified Ledger</span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px]">৳50 Min Cashout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Clipper Workspace
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Real-time balance calculated from verified views and double-entry ledger. Zero fake numbers.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/dashboard/withdrawals"
            className="neo-btn neo-btn-white px-4 py-2 text-xs"
          >
            Cashout
          </Link>
          <Link
            href="/campaigns"
            className="neo-btn neo-btn-primary px-4 py-2 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Browse Briefs</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 block font-bold">Available Balance</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-['Unbounded']">
            ৳{financials.availableBalance.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-500 font-sans font-medium block">Ready for bKash/Nagad</span>
        </div>

        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 block font-bold">Pending Review</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 font-['Unbounded']">
            ৳{financials.pendingEarnings.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-500 font-sans font-medium block">Awaiting view audit</span>
        </div>

        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 block font-bold">Total Approved</span>
          <span className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-100 font-['Unbounded']">
            ৳{financials.totalApprovedEarnings.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-500 font-sans font-medium block">All-time earnings</span>
        </div>

        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 block font-bold">Active Sprints</span>
          <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-['Unbounded']">
            {activeCampaignsCount}
          </span>
          <span className="text-[10px] text-zinc-500 font-sans font-medium block">Accepting clips</span>
        </div>
      </div>

      {/* Recent Submissions Feed */}
      <div className="neo-box p-6 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-4">
          <div>
            <h2 className="text-lg font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">Recent Submissions</h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Status, verified views, and payout allocations</span>
          </div>
          <Link
            href="/dashboard/submissions"
            className="neo-btn neo-btn-white px-3 py-1 text-xs"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            No clip submissions recorded yet. Pick an active campaign to submit your first clip.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-zinc-950 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="pb-3 font-bold">Campaign</th>
                  <th className="pb-3 font-bold">Platform</th>
                  <th className="pb-3 font-bold">Public Link</th>
                  <th className="pb-3 font-bold">Audit Status</th>
                  <th className="pb-3 text-right font-bold">Verified Views</th>
                  <th className="pb-3 text-right font-bold">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-3.5 font-bold text-zinc-950 dark:text-white max-w-[200px] truncate">
                      {sub.campaignTitle || 'Campaign'}
                    </td>
                    <td className="py-3.5 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-950 dark:border-zinc-700 font-bold">
                        {sub.platform}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono">
                      <SafeExternalLink
                        href={sub.postUrl}
                        showIcon={true}
                        className="text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1 font-bold"
                      >
                        <span>View Post</span>
                      </SafeExternalLink>
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="py-3.5 font-mono text-right text-zinc-700 dark:text-zinc-300 font-bold">
                      {sub.views ? sub.views.toLocaleString() : '—'}
                    </td>
                    <td className="py-3.5 font-mono text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {sub.payout ? `৳${sub.payout.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
