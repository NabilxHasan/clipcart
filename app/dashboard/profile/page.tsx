'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, ShieldCheck, Sparkles, Smartphone, Lock } from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { ClipperProfile, PaymentMethod } from '../../../lib/types/database';
import { useRouter } from 'next/navigation';
import { getActiveUser } from '../../../lib/auth/session';
import { useLanguage } from '../../../lib/i18n/context';

export default function ClipperProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ClipperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState<string>('');

  // Form State
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [youtubeHandle, setYoutubeHandle] = useState('');
  const [facebookHandle, setFacebookHandle] = useState('');
  const [editingExperience, setEditingExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BKASH');
  const [paymentIdentifier, setPaymentIdentifier] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = getActiveUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setActiveUserId(user.id);

    async function load() {
      const cp = await ClipBDRepository.getClipperProfile(user!.id);
      if (cp) {
        setProfile(cp);
        setTiktokHandle(cp.tiktokHandle || '');
        setInstagramHandle(cp.instagramHandle || '');
        setYoutubeHandle(cp.youtubeHandle || '');
        setFacebookHandle(cp.facebookHandle || '');
        setEditingExperience(cp.editingExperience || '');
        setPortfolioUrl(cp.portfolioUrl || '');
        setPaymentMethod(cp.paymentMethod);
        setPaymentIdentifier(cp.paymentIdentifier || '');
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUserId) return;
    setSaving(true);
    setSaved(false);

    try {
      await ClipBDRepository.updateClipperProfile(activeUserId, {
        tiktokHandle,
        instagramHandle,
        youtubeHandle,
        facebookHandle,
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
        {t.dashboardProfile.loading}
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
              {t.dashboardProfile.tagSettings}
            </span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              {t.dashboardProfile.tagDirect}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            {t.dashboardProfile.title}
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            {t.dashboardProfile.subtitle}
          </p>
        </div>
      </div>

      {saved && (
        <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t.dashboardProfile.savedSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="neo-box p-6 sm:p-8 space-y-8 text-xs">
        {/* Social Accounts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <h2 className="text-xs font-['Unbounded'] font-black uppercase tracking-wider text-zinc-950 dark:text-white">
                {t.dashboardProfile.socialSectionTitle}
              </h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 font-bold">{t.dashboardProfile.publicAttribution}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">{t.dashboardProfile.tiktokLabel}</label>
              <input
                type="text"
                placeholder="@username"
                value={tiktokHandle}
                onChange={(e) => setTiktokHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">{t.dashboardProfile.instagramLabel}</label>
              <input
                type="text"
                placeholder="@username"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">{t.dashboardProfile.youtubeLabel}</label>
              <input
                type="text"
                placeholder="@channel"
                value={youtubeHandle}
                onChange={(e) => setYoutubeHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block font-sans text-xs">{t.dashboardProfile.facebookLabel}</label>
              <input
                type="text"
                placeholder="facebook.com/... or @handle"
                value={facebookHandle}
                onChange={(e) => setFacebookHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">{t.dashboardProfile.experienceLabel}</label>
            <input
              type="text"
              placeholder={t.dashboardProfile.experiencePlaceholder}
              value={editingExperience}
              onChange={(e) => setEditingExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">{t.dashboardProfile.portfolioLabel}</label>
            <input
              type="url"
              placeholder={t.dashboardProfile.portfolioPlaceholder}
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
                {t.dashboardProfile.payoutSectionTitle}
              </h2>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.dashboardProfile.encryptedAccount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">{t.dashboardProfile.disbursalMethodLabel}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
              >
                <option value="BKASH">{t.dashboardProfile.bkashOption}</option>
                <option value="NAGAD" disabled>{t.dashboardProfile.nagadOption}</option>
                <option value="BANK">{t.dashboardProfile.bankOption}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">{t.dashboardProfile.accountNumberLabel}</label>
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
            <span>{saving ? t.dashboardProfile.saving : t.dashboardProfile.saveBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
