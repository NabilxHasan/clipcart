'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  FileVideo, 
  Play
} from 'lucide-react';
import { Campaign, PlatformType } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { ClipBDRepository } from '../../../lib/db/repository';
import { getActiveUser } from '../../../lib/auth/session';
import { useLanguage } from '../../../lib/i18n/context';

// Platform display labels (short, avoids overflow in small buttons)
const PLATFORM_LABELS: Record<PlatformType, string> = {
  TIKTOK: 'TikTok',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'YouTube',
  FACEBOOK: 'Facebook',
};

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params?.id as string;
  const { t } = useLanguage();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  // Submission Form State
  const [platform, setPlatform] = useState<PlatformType>('TIKTOK');
  const [postUrl, setPostUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);

  useEffect(() => {
    async function load() {
      if (!idOrSlug) return;
      const data = await ClipBDRepository.getCampaignBySlugOrId(idOrSlug);
      setCampaign(data);
      if (data && data.platforms.length > 0) {
        setPlatform(data.platforms[0]);
      }
      setLoading(false);
    }
    load();
  }, [idOrSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    setSubmitting(true);
    setSubmissionFeedback(null);

    try {
      const activeUser = getActiveUser();
      if (!activeUser) {
        setSubmissionFeedback({
          success: false,
          message: 'Please sign in or register to submit your video clip.',
        });
        setSubmitting(false);
        router.push('/login');
        return;
      }

      const result = await ClipBDRepository.createSubmission({
        campaignId: campaign.id,
        clipperId: activeUser.id,
        platform,
        postUrl,
        caption,
        notes,
      });

      setSubmissionFeedback({
        success: true,
        message: result.status === 'FLAGGED'
          ? 'Clip submitted. Flagged by AI pre-filter for priority moderator inspection.'
          : 'Clip submitted successfully! It is now pending human review & view audit.',
        details: `Submission ID: ${result.id} • Target Platform: ${platform}`,
      });

      setPostUrl('');
      setCaption('');
      setNotes('');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit clip';
      setSubmissionFeedback({
        success: false,
        message: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400 font-mono text-sm">
        Loading campaign brief...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Campaign Not Found</h2>
        <p className="text-sm text-slate-400">The campaign brief you requested could not be located in the database.</p>
        <Link href="/campaigns" className="text-xs text-rose-400 font-mono hover:underline inline-block">
          ← Back to All Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.nav.campaigns}</span>
        </Link>
      </div>

      {/* Campaign Header Brief */}
      <div className="neo-box-lg p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-950 dark:border-zinc-700 pb-5">
          <div className="space-y-1.5">
            <span className="neo-sticker bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-950 dark:border-zinc-700">
              {campaign.clientName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
              {campaign.title}
            </h1>
          </div>
          <StatusBadge status={campaign.status} />
        </div>

        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          {campaign.description}
        </p>

        {/* Payout & Budget Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block uppercase">{t.campaigns.rateCpm}</span>
            <span className="text-base font-black text-emerald-800 dark:text-emerald-400">
              {campaign.payoutType === 'CPM' ? `৳${campaign.cpmRate} / 1k views` : `৳${campaign.fixedReward} Fixed`}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block uppercase">{t.campaigns.budgetLeft}</span>
            <span className="text-base font-black text-zinc-950 dark:text-zinc-50">৳{campaign.remainingBudget.toLocaleString()}</span>
            {/* Budget spend progress bar */}
            <div className="mt-1.5 w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-600 overflow-hidden">
              <div
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${Math.min(Math.round(((campaign.totalBudget - campaign.remainingBudget) / campaign.totalBudget) * 100), 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              {Math.round(((campaign.totalBudget - campaign.remainingBudget) / campaign.totalBudget) * 100)}% spent
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block uppercase">{t.campaigns.maxPerClip}</span>
            <span className="text-base font-black text-rose-800 dark:text-rose-400">
              {campaign.maxPayoutPerClip > 0 ? `৳${campaign.maxPayoutPerClip.toLocaleString()}` : 'No Cap'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
            {(() => {
              const endDate = new Date(campaign.endDate);
              const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold block uppercase">Ends On</span>
                  <span className="text-base font-black text-zinc-900 dark:text-zinc-100">
                    {endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className={`text-[10px] font-bold font-mono block ${
                    daysLeft <= 2 ? 'text-rose-600 dark:text-rose-400' :
                    daysLeft <= 7 ? 'text-amber-600 dark:text-amber-400' :
                    'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                  </span>
                </>
              );
            })()}
          </div>
        </div>

        {/* Source Footage Access */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-['Unbounded'] font-black text-zinc-950 dark:text-zinc-50 uppercase">
              <FileVideo className="w-4 h-4 text-rose-600" />
              <span>Raw Footage Library (Google Drive)</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              {t.campaigns.rawFootageNotice}
            </p>
          </div>
          <a
            href={campaign.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-['Unbounded'] font-bold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-xl border-2 border-zinc-950 dark:border-zinc-600 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] transition-all whitespace-nowrap"
          >
            <span>{t.campaigns.openDrive}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Brief, Rules & Restrictions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rules */}
          <div className="neo-box p-6 space-y-4">
            <h3 className="text-sm font-['Unbounded'] uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.campaigns.rulesTitle}
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
              {campaign.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Restrictions */}
          {campaign.restrictions.length > 0 && (
            <div className="neo-box p-6 space-y-4">
              <h3 className="text-sm font-['Unbounded'] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-black flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                {t.campaigns.restrictionsTitle}
              </h3>
              <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                {campaign.restrictions.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">✕</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Winning Reference Example */}
          {campaign.exampleUrl && (
            <div className="neo-box p-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium">
                <Play className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.campaigns.exampleTitle}</span>
              </div>
              <a
                href={campaign.exampleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1 shrink-0"
              >
                <span>View Sample</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Submit Clip Drawer */}
        <div className="space-y-4">
          <div className="neo-box p-6 space-y-5">
            <div>
              <span className="neo-sticker bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-950 dark:border-rose-700 mb-2">
                {t.campaigns.submitActionTag}
              </span>
              <h3 className="text-lg font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-zinc-50 mt-1">
                {t.campaigns.submitTitle}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1">
                {t.campaigns.submitSubtitle}
              </p>
            </div>

            {campaign.status !== 'ACTIVE' ? (
              <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-center text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <p className="font-bold text-zinc-900 dark:text-zinc-100">Submissions Closed</p>
                <p>{t.campaigns.closedNotice}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Platform select — use flex-wrap so labels never overflow */}
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">
                    {t.campaigns.platformLabel}
                  </label>
                  <div className="flex flex-wrap gap-2 font-mono">
                    {campaign.platforms.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlatform(p)}
                        className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border-2 border-zinc-950 dark:border-zinc-700 cursor-pointer whitespace-nowrap ${
                          platform === p
                            ? 'bg-rose-600 text-white shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {PLATFORM_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Post URL */}
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">
                    {t.campaigns.postUrlLabel}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder={
                      platform === 'TIKTOK'
                        ? 'https://www.tiktok.com/@user/video/...'
                        : platform === 'INSTAGRAM'
                        ? 'https://www.instagram.com/reel/...'
                        : platform === 'FACEBOOK'
                        ? 'https://www.facebook.com/reel/...'
                        : 'https://youtube.com/shorts/...'
                    }
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-xs shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]"
                  />
                </div>

                {/* Caption / Hook used */}
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">
                    {t.campaigns.captionLabel}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Why 90% of Dhaka startups fail in year one"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]"
                  />
                </div>

                {/* Notes for Moderator */}
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">
                    {t.campaigns.notesLabel}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Timestamp in source footage, specific angles, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]"
                  />
                </div>

                {/* Feedback alert */}
                {submissionFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] text-xs space-y-1 ${
                      submissionFeedback.success
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-300'
                    }`}
                  >
                    <p className="font-bold">{submissionFeedback.message}</p>
                    {submissionFeedback.details && (
                      <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">{submissionFeedback.details}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl font-['Unbounded'] font-bold text-xs uppercase text-white bg-rose-600 hover:bg-rose-700 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#09090b] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? t.campaigns.submittingButton : t.campaigns.submitButton}</span>
                </button>

                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center font-medium leading-relaxed">
                  {t.campaigns.submitDisclaimer}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
