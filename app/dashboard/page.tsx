'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Banknote, 
  Clock, 
  CheckCircle2, 
  Flame, 
  ArrowRight, 
  Plus,
  AlertCircle
} from 'lucide-react';
import { ClipBDRepository } from '../../lib/db/repository';
import { Submission, Profile } from '../../lib/types/database';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { SafeExternalLink } from '../../components/shared/SafeExternalLink';
import { getActiveUser } from '../../lib/auth/session';

export default function ClipperOverviewPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [financials, setFinancials] = useState<{
    availableBalance: number;
    pendingEarnings: number;
    totalApprovedEarnings: number;
  } | null>(null);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeCampaignsCount, setActiveCampaignsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getActiveUser();
    if (!user) {
      router.push('/login');
      return;
    }
    const userId = user.id;
    setCurrentUser(user);

    async function load() {
      const fin = await ClipBDRepository.getClipperFinancials(userId);
      const subs = await ClipBDRepository.getSubmissions({ clipperId: userId });
      const camps = await ClipBDRepository.getActiveCampaigns();

      setFinancials(fin);
      setSubmissions(subs.slice(0, 5)); // recent 5
      setActiveCampaignsCount(camps.length);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading || !financials || !currentUser) {
    return (
      <div className="neo-box p-12 text-center font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">
        Loading real-time ledger data...
      </div>
    );
  }

  const isPendingVerification = currentUser.status === 'PENDING';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white text-[10px]">Verified Ledger</span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px]">৳50 Min Cashout</span>
            {isPendingVerification ? (
              <span className="neo-sticker bg-amber-100 text-amber-950 border-amber-950 text-[10px]">
                ৳50 Fee Pending Review
              </span>
            ) : (
              <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px]">
                Account Verified
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Clipper Workspace
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Welcome back, <span className="font-bold text-rose-600 dark:text-rose-400">{currentUser.fullName}</span>. Real-time balance calculated from verified views.
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

      {/* Pending Fee Notice */}
      {isPendingVerification && (
        <div className="neo-box p-4 bg-amber-50 dark:bg-amber-950/40 border-amber-950 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-mono font-bold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="space-y-0.5">
            <div>৳50 Verification In Review by Operations</div>
            <div className="text-[11px] font-normal text-amber-800 dark:text-amber-300">
              We are verifying your bKash TrxID. You can browse active briefs and submit clips immediately. Payout withdrawals unlock upon approval.
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Available Balance</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-emerald-600">
            ৳{financials.availableBalance.toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-400 font-bold">Ready to withdraw to bKash</div>
        </div>

        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-amber-600">
            ৳{financials.pendingEarnings.toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-400 font-bold">Estimated pending views</div>
        </div>

        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Lifetime Earnings</span>
            <CheckCircle2 className="w-4 h-4 text-zinc-950 dark:text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-zinc-950 dark:text-white">
            ৳{financials.totalApprovedEarnings.toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-400 font-bold">Total approved to date</div>
        </div>

        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Active Briefs</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-rose-600">
            {activeCampaignsCount}
          </div>
          <div className="text-[10px] text-zinc-400 font-bold">Open for submissions</div>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="neo-box overflow-hidden">
        <div className="p-5 border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-[#181920] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <h2 className="font-['Unbounded'] font-bold text-xs uppercase text-zinc-950 dark:text-white">
              Recent Submissions
            </h2>
          </div>
          <Link
            href="/dashboard/submissions"
            className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({submissions.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="p-12 text-center space-y-3 font-mono">
            <p className="text-xs text-zinc-500">No submissions yet.</p>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 neo-btn neo-btn-primary px-4 py-2 text-xs"
            >
              Browse Active Campaigns
            </Link>
          </div>
        ) : (
          <div className="divide-y-2 divide-zinc-200 dark:divide-zinc-800">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="neo-sticker bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-bold">
                      {s.platform}
                    </span>
                    <StatusBadge status={s.status} size="sm" />
                  </div>
                  <SafeExternalLink
                    href={s.postUrl}
                    className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 hover:text-rose-600 truncate max-w-md block"
                  >
                    {s.postUrl}
                  </SafeExternalLink>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Submitted: {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                  <div className="text-right">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">
                      {(s.views ?? 0).toLocaleString()} views
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Audited View Count
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-600">
                      ৳{(s.payout ?? 0).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Payout Earned
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
