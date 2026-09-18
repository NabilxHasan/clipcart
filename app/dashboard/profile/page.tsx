'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Save, CheckCircle2, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { ClipperProfile, PaymentMethod, PlatformType } from '../../../lib/types/database';

export default function ClipperProfilePage() {
  const [profile, setProfile] = useState<ClipperProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [youtubeHandle, setYoutubeHandle] = useState('');
  const [editingExperience, setEditingExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BKASH');
  const [paymentIdentifier, setPaymentIdentifier] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentUserId = 'usr-clipper-01';

  useEffect(() => {
    async function load() {
      const cp = await ClipBDRepository.getClipperProfile(currentUserId);
      if (cp) {
        setProfile(cp);
        setTiktokHandle(cp.tiktokHandle || '');
        setInstagramHandle(cp.instagramHandle || '');
        setYoutubeHandle(cp.youtubeHandle || '');
        setEditingExperience(cp.editingExperience || '');
        setPortfolioUrl(cp.portfolioUrl || '');
        setPaymentMethod(cp.paymentMethod);
        setPaymentIdentifier(cp.paymentIdentifier || '');
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await ClipBDRepository.updateClipperProfile(currentUserId, {
        tiktokHandle,
        instagramHandle,
        youtubeHandle,
        editingExperience,
        portfolioUrl,
        paymentMethod,
        paymentIdentifier,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="neo-box p-12 text-center font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
        Loading creator profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Profile Settings
            </span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              Direct Disbursal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Clipper Profile & Payouts
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Manage your social handles, portfolio links, and default disbursement destination.
          </p>
        </div>
      </div>

      {saved && (
        <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile and payout settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="neo-box p-6 sm:p-8 space-y-8 text-xs">
        {/* Social Accounts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <h2 className="text-xs font-['Unbounded'] font-black uppercase tracking-wider text-zinc-950 dark:text-white">
                Creator Channels & Social Handles
              </h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 font-bold">Public Attribution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">TikTok Handle</label>
              <input
                type="text"
                placeholder="@username"
                value={tiktokHandle}
                onChange={(e) => setTiktokHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">Instagram Handle</label>
              <input
                type="text"
                placeholder="@username"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">YouTube Handle</label>
              <input
                type="text"
                placeholder="@channel"
                value={youtubeHandle}
                onChange={(e) => setYoutubeHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Editing Experience & Primary Tools</label>
            <input
              type="text"
              placeholder="e.g. CapCut Pro, Premiere Pro, DaVinci Resolve — 2 years short-form editing"
              value={editingExperience}
              onChange={(e) => setEditingExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Portfolio / Sample Reel Link</label>
            <input
              type="url"
              placeholder="https://drive.google.com/... or https://tiktok.com/@..."
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
            />
          </div>
        </div>

        {/* Payment Setup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-['Unbounded'] font-black uppercase tracking-wider text-zinc-950 dark:text-white">
                Default Disbursement Destination
              </h2>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted Account Target</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Disbursal Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
              >
                <option value="BKASH">bKash Personal / Merchant</option>
                <option value="NAGAD">Nagad Wallet</option>
                <option value="BANK">Bangladeshi Bank Account</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Wallet Mobile Number / Account Number</label>
              <input
                type="text"
                required
                placeholder="01XXXXXXXXX"
                value={paymentIdentifier}
                onChange={(e) => setPaymentIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-zinc-950 dark:border-zinc-700 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="neo-btn neo-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
