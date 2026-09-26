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
import { useLanguage } from '../../lib/i18n/context';

export default function ClipperOverviewPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
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
        {t.dashboard.loadingLedger}
      </div>
    );
  }

  const isPendingVerification = currentUser.status === 'PENDING';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="neo-sticker bg-zinc-950 text-white text-[10px]">{t.dashboard.verifiedLedger}</span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] bn-amount">{t.dashboard.minCashout}</span>
            {isPendingVerification ? (
              <span className="neo-sticker bg-amber-100 text-amber-950 border-amber-950 text-[10px] bn-amount">
                {t.dashboard.feePendingReview}
              </span>
            ) : (
              <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px]">
                {t.dashboard.accountVerified}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            {t.dashboard.welcomeBack}, <span className="font-bold text-rose-600 dark:text-rose-400">{currentUser.fullName}</span>. {t.dashboard.welcomeSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/dashboard/withdrawals"
            className="neo-btn neo-btn-white px-4 py-2 text-xs"
          >
            {t.dashboard.cashout}
          </Link>
          <Link
            href="/campaigns"
            className="neo-btn neo-btn-primary px-4 py-2 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.dashboard.browseBriefs}</span>
          </Link>
        </div>
      </div>

      {/* Pending Fee Notice */}
      {isPendingVerification && (
        <div className="neo-box p-4 bg-amber-50 dark:bg-amber-950/40 border-amber-950 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-mono font-bold flex items-center gap-3 shadow-[2px_2px_0px_#09090b]">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="space-y-0.5">
            <div className="bn-amount">{t.dashboard.feeReviewTitle}</div>
            <div className="text-[11px] font-normal text-amber-800 dark:text-amber-300 leading-relaxed">
              {t.dashboard.feeReviewDesc}
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{t.dashboard.availableBalance}</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-emerald-600 bn-amount">
            ৳{financials.availableBalance.toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-400 font-bold">{t.dashboard.readyToWithdraw}</div>
        </div>

        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{t.dashboard.pendingReview}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-amber-600 bn-amount">
            ৳{financials.pendingEarnings.toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-400 font-bold">{t.dashboard.estimatedPending}</div>
        </div>

        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{t.dashboard.lifetimeEarnings}</span>
            <CheckCircle2 className="w-4 h-4 text-zinc-950 dark:text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-zinc-950 dark:text-white bn-amount">
            ৳{financials.totalApprovedEarnings.toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-400 font-bold">{t.dashboard.totalApproved}</div>
        </div>

        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">{t.dashboard.activeBriefs}</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-rose-600 bn-amount">
            {activeCampaignsCount}
          </div>
          <div className="text-[10px] text-zinc-400 font-bold">{t.dashboard.openForSubmissions}</div>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="neo-box overflow-hidden">
        <div className="p-5 border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-[#181920] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <h2 className="font-['Unbounded'] font-bold text-xs uppercase text-zinc-950 dark:text-white">
              {t.dashboard.recentSubmissions}
            </h2>
          </div>
          <Link
            href="/dashboard/submissions"
            className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>{t.dashboard.viewAll} ({submissions.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="p-12 text-center space-y-3 font-mono">
            <p className="text-xs text-zinc-500">{t.dashboard.noSubmissionsYet}</p>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 neo-btn neo-btn-primary px-4 py-2 text-xs"
            >
              {t.dashboard.browseActiveCampaigns}
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
                    {t.dashboard.submitted}: {new Date(s.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                  <div className="text-right">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 bn-amount">
                      {(s.views ?? 0).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')} {t.dashboard.viewsText}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {t.dashboard.auditedViews}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-600 bn-amount">
                      ৳{(s.payout ?? 0).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {t.dashboard.payoutEarned}
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
