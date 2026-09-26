'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { Submission } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { SafeExternalLink } from '../../../components/shared/SafeExternalLink';
import { useRouter } from 'next/navigation';
import { getActiveUser } from '../../../lib/auth/session';
import { useLanguage } from '../../../lib/i18n/context';

export default function ClipperSubmissionsPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getActiveUser();
    if (!user) {
      router.push('/login');
      return;
    }

    async function load() {
      const data = await ClipBDRepository.getSubmissions({ 
        clipperId: user!.id,
        status: filterStatus 
      });
      setSubmissions(data);
      setLoading(false);
    }
    load();
  }, [filterStatus, router]);

  const filterLabels: Record<string, string> = {
    ALL: t.dashboardSubmissions.filterAll,
    PENDING_HUMAN_REVIEW: t.dashboardSubmissions.filterPendingReview,
    APPROVED: t.dashboardSubmissions.filterApproved,
    REJECTED: t.dashboardSubmissions.filterRejected,
    FLAGGED: t.dashboardSubmissions.filterFlagged,
  };

  return (
    <div className="space-y-6">
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white text-[10px]">{t.dashboardSubmissions.tagAuditFeed}</span>
            <span className="neo-sticker bg-rose-100 text-rose-950 border-rose-950 text-[10px]">{t.dashboardSubmissions.tagLivePosts}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            {t.dashboardSubmissions.title}
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            {t.dashboardSubmissions.subtitle}
          </p>
        </div>
        <Link
          href="/campaigns"
          className="neo-btn neo-btn-primary px-4 py-2 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.dashboardSubmissions.newClipSubmission}</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        {['ALL', 'PENDING_HUMAN_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl font-bold border-2 border-zinc-950 transition-all ${
              filterStatus === st
                ? 'bg-rose-600 text-white shadow-[2px_2px_0px_#09090b]'
                : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-[2px_2px_0px_#09090b]'
            }`}
          >
            {filterLabels[st] || st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="neo-box p-12 text-center text-xs text-zinc-500 dark:text-zinc-400 font-mono font-bold">
          {t.dashboardSubmissions.loading}
        </div>
      ) : submissions.length === 0 ? (
        <div className="neo-box p-12 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-2 font-medium">
          <p>{t.dashboardSubmissions.noSubmissions}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(sub => (
            <div
              key={sub.id}
              className="neo-box p-6 space-y-4 text-xs hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-zinc-950 dark:border-zinc-700 pb-3.5">
                <div className="space-y-0.5">
                  <span className="font-mono font-bold text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">
                    {t.dashboardSubmissions.submissionId}: {sub.id}
                  </span>
                  <h2 className="text-base font-['Unbounded'] font-black text-zinc-950 dark:text-white">{sub.campaignTitle || 'Campaign'}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-950 dark:border-zinc-700 font-mono text-[10px] font-bold text-zinc-900 dark:text-zinc-200">
                    {sub.platform}
                  </span>
                  <StatusBadge status={sub.status} size="sm" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-zinc-500 font-bold">{t.dashboardSubmissions.livePost}</span>
                  <SafeExternalLink
                    href={sub.postUrl}
                    showIcon={true}
                    className="text-rose-600 dark:text-rose-400 font-bold hover:underline truncate max-w-md inline-flex items-center gap-1"
                  >
                    <span>{sub.postUrl}</span>
                  </SafeExternalLink>
                </div>

                {sub.caption && (
                  <p className="text-zinc-700 dark:text-zinc-300 italic bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-medium">
                    &ldquo;{sub.caption}&rdquo;
                  </p>
                )}
              </div>

              {/* AI Pre-filter & Review Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {sub.flags && (
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border-2 border-zinc-950 dark:border-zinc-700 space-y-1 shadow-[2px_2px_0px_#09090b]">
                    <span className="text-[10px] font-mono uppercase text-zinc-600 dark:text-zinc-300 font-bold block">
                      {t.dashboardSubmissions.preFilterEvaluation}
                    </span>
                    <div className="flex gap-4 font-mono text-[11px]">
                      <span>{t.dashboardSubmissions.compliance}: <strong className="text-emerald-600 dark:text-emerald-400 font-black">{sub.flags.complianceScore}%</strong></span>
                      <span>{t.dashboardSubmissions.suspicion}: <strong className={sub.flags.suspicionScore > 20 ? 'text-amber-500 font-black' : 'text-zinc-600 dark:text-zinc-400 font-bold'}>{sub.flags.suspicionScore}%</strong></span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{sub.flags.reasoningSummary}</p>
                  </div>
                )}

                {sub.review && (
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border-2 border-zinc-950 dark:border-zinc-700 space-y-1 shadow-[2px_2px_0px_#09090b]">
                    <span className="text-[10px] font-mono uppercase text-zinc-600 dark:text-zinc-300 font-bold block">
                      {t.dashboardSubmissions.moderatorAudit}
                    </span>
                    <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium">{sub.review.adminNote || t.dashboardSubmissions.noNotes}</p>
                    {sub.review.rejectionReason && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">{t.dashboardSubmissions.reasonLabel}: {sub.review.rejectionReason}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Financial Outcome Footer */}
              {sub.status === 'APPROVED' && (
                <div className="pt-3 border-t-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-between font-mono">
                  <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                    {t.dashboardSubmissions.verifiedReach} <strong className="text-zinc-950 dark:text-white font-bold bn-amount">{sub.views?.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')} {t.dashboardSubmissions.viewsText}</strong>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm bn-amount">
                    {t.dashboardSubmissions.approvedPayout} ৳{sub.payout?.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
