'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  X, 
  Clock, 
  Filter, 
  Search,
  Zap,
  Sparkles,
  Bot
} from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { Submission, ReviewDecision } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { LedgerEngine } from '../../../lib/ledger/service';
import { SafeExternalLink } from '../../../components/shared/SafeExternalLink';

export default function AdminSubmissionsDesk() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('PENDING_HUMAN_REVIEW');
  const [platformFilter, setPlatformFilter] = useState('ALL');

  // Review Action Form
  const [verifiedViews, setVerifiedViews] = useState<number>(10000);
  const [adminNote, setAdminNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const reviewerId = 'usr-mod-01';

  const loadSubmissions = async () => {
    const list = await ClipBDRepository.getSubmissions({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    });
    setSubmissions(list);
    if (list.length > 0 && !selectedSub) {
      setSelectedSub(list[0]);
    } else if (list.length === 0) {
      setSelectedSub(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter]);

  const handleReview = async (decision: ReviewDecision) => {
    if (!selectedSub) return;
    setProcessing(true);
    setFeedback(null);

    try {
      const res = await ClipBDRepository.reviewSubmission({
        submissionId: selectedSub.id,
        reviewerId,
        decision,
        verifiedViews: decision === 'APPROVED' ? Number(verifiedViews) : 0,
        rejectionReason: decision === 'REJECTED' ? rejectionReason : undefined,
        adminNote,
      });

      setFeedback(
        decision === 'APPROVED'
          ? `Approved! Credited ৳${res.payoutCreated?.toLocaleString()} to clipper wallet ledger.`
          : 'Submission marked as Rejected.'
      );

      setAdminNote('');
      setRejectionReason('');
      await loadSubmissions();
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? `Error: ${err.message}` : 'Review action failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Moderation Desk
            </span>
            <span className="neo-sticker bg-amber-100 text-amber-950 border-amber-950 text-[10px] flex items-center gap-1">
              <Bot className="w-3 h-3 text-amber-700" />
              AI Pre-Screened
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Submissions Moderation Desk
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Keyboard-efficient view audits and ledger credits. AI pre-filter assists with suspicion scoring.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs shrink-0">
          {['PENDING_HUMAN_REVIEW', 'FLAGGED', 'APPROVED', 'REJECTED', 'ALL'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold border-2 transition-all ${
                statusFilter === st
                  ? 'bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-950 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold font-mono">
          {feedback}
        </div>
      )}

      {loading ? (
        <div className="neo-box p-12 text-center font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
          Loading moderation queue...
        </div>
      ) : submissions.length === 0 ? (
        <div className="neo-box p-12 text-center text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
          Queue is clear! No submissions found matching filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Queue List (5 cols) */}
          <div className="lg:col-span-5 space-y-3 max-h-[720px] overflow-y-auto scroll-y pr-1">
            {submissions.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              const suspicion = sub.flags?.suspicionScore || 0;
              return (
                <div
                  key={sub.id}
                  onClick={() => { setSelectedSub(sub); setFeedback(null); }}
                  className={`neo-box p-4 text-xs cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/60 dark:bg-rose-950/30 shadow-[4px_4px_0px_#e11d48]'
                      : 'hover:translate-x-[-1px] hover:translate-y-[-1px]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="neo-sticker bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[9px] px-2 py-0.5 font-bold">
                      {sub.platform}
                    </span>
                    <StatusBadge status={sub.status} size="sm" />
                  </div>

                  <h3 className="font-bold text-zinc-950 dark:text-white font-['Space_Grotesk'] text-sm line-clamp-1">
                    {sub.campaignTitle || 'Campaign'}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                    <span className="font-bold">{sub.clipperName}</span>
                    {suspicion > 20 && (
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Risk: {suspicion}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Review Inspector (7 cols) */}
          <div className="lg:col-span-7">
            {selectedSub ? (
              <div className="neo-box p-6 space-y-6 text-xs">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-4">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 font-bold">
                      INSPECTING SUBMISSION: {selectedSub.id}
                    </span>
                    <h2 className="text-base font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                      {selectedSub.campaignTitle}
                    </h2>
                  </div>
                  <StatusBadge status={selectedSub.status} />
                </div>

                {/* Direct Link Preview */}
                <div className="neo-box p-4 flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-800/60">
                  <div className="space-y-0.5 max-w-[75%] min-w-0">
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase font-bold block">
                      Published Live Post
                    </span>
                    <SafeExternalLink
                      href={selectedSub.postUrl}
                      className="font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline truncate block"
                    >
                      {selectedSub.postUrl}
                    </SafeExternalLink>
                  </div>
                  <SafeExternalLink
                    href={selectedSub.postUrl}
                    showIcon={true}
                    className="neo-btn neo-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <span>Open Link</span>
                  </SafeExternalLink>
                </div>

                {selectedSub.caption && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase font-bold">Clipper Caption</span>
                    <p className="text-zinc-700 dark:text-zinc-300 italic bg-zinc-100 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 font-medium">
                      &ldquo;{selectedSub.caption}&rdquo;
                    </p>
                  </div>
                )}

                {/* AI Pre-Filter Diagnostics */}
                {selectedSub.flags && (
                  <div className="neo-box p-4 space-y-3 bg-zinc-50 dark:bg-zinc-800/40">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-zinc-950 dark:text-white uppercase text-[10px] flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-rose-600" />
                        AI Pre-Filter Diagnostic Report
                      </span>
                      <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                        Queue: {selectedSub.flags.recommendedQueue}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block font-bold">COMPLIANCE</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{selectedSub.flags.complianceScore}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block font-bold">DUPLICATE</span>
                        <span className="font-black text-zinc-700 dark:text-zinc-300 text-sm">{selectedSub.flags.duplicateProbability}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block font-bold">SUSPICION</span>
                        <span className={`font-black text-sm ${selectedSub.flags.suspicionScore > 20 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          {selectedSub.flags.suspicionScore}%
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed font-mono">
                      {selectedSub.flags.reasoningSummary}
                    </p>
                  </div>
                )}

                {/* Moderator Approval Controls */}
                <div className="neo-box p-5 space-y-4 border-2.5 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-[#14151a]">
                  <h3 className="text-xs font-['Unbounded'] font-bold text-zinc-950 dark:text-white uppercase">
                    Audit Decision & View Verification
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Verified Organic View Count</label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={verifiedViews}
                        onChange={(e) => setVerifiedViews(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Admin Review Note (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Verified 25k views, kinetic captions confirmed."
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Rejection Reason (Required if Rejecting)</label>
                    <input
                      type="text"
                      placeholder="e.g. Muted audio due to copyright, or views below threshold."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t-2 border-zinc-950 dark:border-zinc-700">
                    <button
                      type="button"
                      disabled={processing || !rejectionReason}
                      onClick={() => handleReview('REJECTED')}
                      className="neo-btn bg-rose-100 hover:bg-rose-200 text-rose-950 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-200 border-rose-950 px-4 py-2 text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject Clip</span>
                    </button>

                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => handleReview('APPROVED')}
                      className="neo-btn bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Credit Ledger</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="neo-box p-12 text-center text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
                Select a submission from the queue to inspect.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
