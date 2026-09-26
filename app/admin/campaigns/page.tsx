'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Plus, Check, ExternalLink, ShieldCheck, Banknote, Sparkles, X } from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { Campaign, PlatformType, PaymentMethod } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activePaymentCampaign, setActivePaymentCampaign] = useState<Campaign | null>(null);

  // New Campaign Form
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Business & Podcasts');
  const [totalBudget, setTotalBudget] = useState<number>(50000);
  const [cpmRate, setCpmRate] = useState<number>(100);
  const [maxPayoutPerClip, setMaxPayoutPerClip] = useState<number>(5000);
  const [minViews, setMinViews] = useState<number>(2000);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [sourceUrl, setSourceUrl] = useState('');
  const [exampleUrl, setExampleUrl] = useState('');
  const [platforms, setPlatforms] = useState<PlatformType[]>(['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK']);
  const [rulesText, setRulesText] = useState('Must include animated captions\nVertical 9:16 format between 20-58 seconds\nTag @BrandName');
  const [restrictionsText, setRestrictionsText] = useState('No copyrighted audio that mutes playback\nNo altered robot voices');

  // Payment Verification Form
  const [paymentAmount, setPaymentAmount] = useState<number>(50000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK');
  const [trxRef, setTrxRef] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const actorId = 'usr-admin-01';

  const loadData = async () => {
    const list = await ClipBDRepository.getCampaigns('ALL');
    setCampaigns(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setFeedback(null);

    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const rules = rulesText.split('\n').map(r => r.trim()).filter(Boolean);
      const restrictions = restrictionsText.split('\n').map(r => r.trim()).filter(Boolean);

      await ClipBDRepository.createCampaign({
        title,
        slug,
        clientName,
        description,
        category,
        totalBudget: Number(totalBudget),
        payoutType: 'CPM',
        cpmRate: Number(cpmRate),
        fixedReward: 0,
        maxPayoutPerClip: Number(maxPayoutPerClip),
        minViews: Number(minViews),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + Number(durationDays) * 24 * 60 * 60 * 1000).toISOString(),
        platforms,
        rules,
        restrictions,
        sourceUrl,
        exampleUrl: exampleUrl || undefined,
        createdBy: actorId,
      }, actorId);

      setFeedback('Campaign draft created in PENDING_PAYMENT status. Verify client deposit to activate.');
      setShowCreateModal(false);
      await loadData();
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setProcessing(false);
    }
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentCampaign) return;
    setProcessing(true);
    setFeedback(null);

    try {
      await ClipBDRepository.markCampaignPaymentReceived(
        activePaymentCampaign.id,
        Number(paymentAmount),
        paymentMethod,
        trxRef,
        actorId,
        adminNote
      );

      setFeedback(`Payment verified! Campaign "${activePaymentCampaign.title}" is now ACTIVE.`);
      setActivePaymentCampaign(null);
      setTrxRef('');
      setAdminNote('');
      await loadData();
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : 'Payment verification failed');
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
              Admin Only
            </span>
            <span className="neo-sticker bg-rose-100 text-rose-950 border-rose-950 text-[10px] flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-600" />
              Campaign Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Campaigns & Briefs
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Author briefs, set CPM limits, and activate campaigns upon manual client payment receipt.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="neo-btn neo-btn-primary px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Author New Campaign</span>
        </button>
      </div>

      {feedback && (
        <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold font-mono">
          {feedback}
        </div>
      )}

      {/* Verify Payment Modal */}
      {activePaymentCampaign && (
        <div className="neo-box p-6 space-y-4 border-2.5 border-emerald-600 text-xs">
          <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
            <div>
              <h2 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                Verify Client Deposit: {activePaymentCampaign.title}
              </h2>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                Record bank wire or merchant payment reference to unlock campaign budget and activate submissions.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActivePaymentCampaign(null)}
              className="neo-btn neo-btn-white px-3 py-1 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleVerifyPayment} className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">Verified Amount (৳ BDT)</label>
              <input
                type="number"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">Deposit Channel</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
              >
                <option value="BANK">Bank Wire / Transfer</option>
                <option value="BKASH">bKash Merchant</option>
                <option value="NAGAD">Nagad Business</option>
                <option value="CASH">Cash / Cheque</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">Transaction Ref / Cheque No.</label>
              <input
                type="text"
                required
                placeholder="e.g. EBL-WIRE-92841"
                value={trxRef}
                onChange={(e) => setTrxRef(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-3 border-t-2 border-zinc-950 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setActivePaymentCampaign(null)}
                className="neo-btn neo-btn-white px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="neo-btn bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-xs font-bold"
              >
                {processing ? 'Verifying...' : 'Mark Payment Received & Activate'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <form onSubmit={handleCreateCampaign} className="neo-box p-6 sm:p-8 space-y-6 text-xs">
          <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
            <div>
              <h2 className="text-sm font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">
                Create New Clipping Campaign
              </h2>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Created in PENDING_PAYMENT status until client deposit is verified.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="neo-btn neo-btn-white px-3 py-1 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Campaign Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Bangladesh FinTech Summit — Best Clips"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Client / Brand Name</label>
              <input
                type="text"
                required
                placeholder="e.g. FinTech Forum Ltd"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Description & Hook Guidance</label>
              <textarea
                rows={3}
                required
                placeholder="Core themes to clip, angles, target audience."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Total Budget (৳ BDT)</label>
              <input
                type="number"
                min={1000}
                required
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">CPM Rate (৳ per 1k views)</label>
              <input
                type="number"
                min={10}
                required
                value={cpmRate}
                onChange={(e) => setCpmRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Max Payout / Clip (৳ BDT)</label>
              <input
                type="number"
                min={100}
                required
                value={maxPayoutPerClip}
                onChange={(e) => setMaxPayoutPerClip(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Minimum Qualifying Views</label>
              <input
                type="number"
                min={100}
                required
                value={minViews}
                onChange={(e) => setMinViews(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Campaign Duration (Days)</label>
              <input
                type="number"
                min={1}
                max={365}
                required
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 font-medium">
                Campaign ends {durationDays} day{durationDays !== 1 ? 's' : ''} from activation. After end date, status will show as COMPLETED.
              </span>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Google Drive Master Footage Link</label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/drive/folders/..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 font-medium">
                High-resolution raw video is kept on Google Drive to maintain database efficiency.
              </span>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Target Platforms</label>
              <div className="flex flex-wrap gap-2 font-mono">
                {(['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK'] as PlatformType[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      if (platforms.includes(p)) {
                        if (platforms.length > 1) setPlatforms(platforms.filter(item => item !== p));
                      } else {
                        setPlatforms([...platforms, p]);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                      platforms.includes(p)
                        ? 'bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Rules (One per line)</label>
              <textarea
                rows={3}
                value={rulesText}
                onChange={(e) => setRulesText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Restrictions (One per line)</label>
              <textarea
                rows={3}
                value={restrictionsText}
                onChange={(e) => setRestrictionsText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-zinc-950 dark:border-zinc-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="neo-btn neo-btn-white px-4 py-2.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="neo-btn neo-btn-primary px-5 py-2.5 text-xs font-bold"
            >
              Save Campaign as Pending Payment
            </button>
          </div>
        </form>
      )}

      {/* Campaigns List */}
      <div className="neo-box overflow-hidden">
        <div className="p-5 border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-[#181920] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <span className="font-['Unbounded'] font-bold text-xs uppercase text-zinc-950 dark:text-white">
              All Campaigns ({campaigns.length})
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
            PostgreSQL Managed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase font-bold">
              <tr>
                <th className="py-3 px-4">Title & Client</th>
                <th className="py-3 px-4 font-mono">Budget / Remaining</th>
                <th className="py-3 px-4 font-mono">CPM</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Platforms</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#14151a]">
              {campaigns.map(c => {
                const endDate = new Date(c.endDate);
                const now = new Date();
                const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const budgetUsed = c.totalBudget - c.remainingBudget;
                const budgetPct = Math.round((budgetUsed / c.totalBudget) * 100);
                return (
                <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-zinc-950 dark:text-white truncate font-['Space_Grotesk'] text-sm">{c.title}</div>
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 font-bold">{c.clientName}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <div className="text-zinc-950 dark:text-white font-bold">৳{c.totalBudget.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Rem: ৳{c.remainingBudget.toLocaleString()}</div>
                    <div className="mt-1 w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-rose-500"
                        style={{ width: `${Math.min(budgetPct, 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{budgetPct}% spent</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-950 dark:text-white">
                    ৳{c.cpmRate}/1k
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
                      {endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    {c.status === 'ACTIVE' && (
                      <span className={`text-[10px] font-bold font-mono ${
                        daysLeft <= 2 ? 'text-rose-600 dark:text-rose-400' :
                        daysLeft <= 7 ? 'text-amber-600 dark:text-amber-400' :
                        'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 font-mono text-[10px]">
                      {c.platforms.map(p => (
                        <span key={p} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 font-bold">
                          {p.slice(0, 2)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {c.status === 'PENDING_PAYMENT' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActivePaymentCampaign(c);
                          setPaymentAmount(c.totalBudget);
                        }}
                        className="neo-btn bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold whitespace-nowrap"
                      >
                        Verify Payment
                      </button>
                    ) : (
                      <Link
                        href={`/campaigns/${c.slug}`}
                        className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 font-mono text-[11px] font-bold underline"
                      >
                        View Public
                      </Link>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
