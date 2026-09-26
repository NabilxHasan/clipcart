'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, PlaySquare, MessageCircle, CheckCircle2, AlertTriangle, Copy } from 'lucide-react';
import { PlatformType, PaymentMethod, Profile, ClipperProfile } from '../../../lib/types/database';
import { mockStore } from '../../../lib/db/mock-store';
import { useLanguage } from '../../../lib/i18n/context';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  // Basic Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [country, setCountry] = useState('Bangladesh');

  // Socials & Portfolio
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [youtubeHandle, setYoutubeHandle] = useState('');
  const [facebookHandle, setFacebookHandle] = useState('');
  const [preferredPlatforms, setPreferredPlatforms] = useState<PlatformType[]>(['TIKTOK', 'YOUTUBE', 'FACEBOOK']);
  const [editingExperience, setEditingExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Payment Setup
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BKASH');
  const [paymentIdentifier, setPaymentIdentifier] = useState('');

  // One-time ৳50 Sign-up Verification Fee
  const [signupPaymentMethod, setSignupPaymentMethod] = useState<'BKASH' | 'NAGAD'>('BKASH');
  const [signupTrxId, setSignupTrxId] = useState('');
  const [copiedBkash, setCopiedBkash] = useState(false);

  const copyBkashNumber = () => {
    navigator.clipboard.writeText('+8801882480457');
    setCopiedBkash(true);
    setTimeout(() => setCopiedBkash(false), 2000);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mandatory WhatsApp Community Gate Modal/Screen
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [hasClickedCommunity, setHasClickedCommunity] = useState(false);

  const togglePlatform = (p: PlatformType) => {
    if (preferredPlatforms.includes(p)) {
      if (preferredPlatforms.length > 1) setPreferredPlatforms(preferredPlatforms.filter(item => item !== p));
    } else {
      setPreferredPlatforms([...preferredPlatforms, p]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      setLoading(false);
      return;
    }

    if (signupPaymentMethod === 'NAGAD') {
      setError(
        'Nagad is currently not available. Please send the ৳50 verification fee via bKash to +8801882480457.'
      );
      setLoading(false);
      return;
    }

    if (!signupTrxId.trim() || signupTrxId.trim().length < 6) {
      setError(
        'Please provide a valid ৳50 verification Transaction ID (TrxID) from bKash (Sent to +8801882480457).'
      );
      setLoading(false);
      return;
    }

    try {
      const newUserId = `usr-${Date.now().toString(36)}`;

      // 1. Create Profile with PENDING status until ৳50 fee is verified
      const newProfile: Profile = {
        id: newUserId,
        email: email.trim().toLowerCase(),
        role: 'CLIPPER' as const,
        fullName: fullName.trim(),
        phoneWhatsapp: phoneWhatsapp.trim(),
        country,
        status: 'PENDING' as const,
        password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 2. Create Clipper Profile with verification TrxID & social handles
      const newClipperProfile: ClipperProfile = {
        userId: newUserId,
        tiktokHandle: tiktokHandle.trim() || undefined,
        instagramHandle: instagramHandle.trim() || undefined,
        youtubeHandle: youtubeHandle.trim() || undefined,
        facebookHandle: facebookHandle.trim() || undefined,
        preferredPlatforms,
        editingExperience: editingExperience.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        paymentMethod,
        paymentIdentifier: paymentIdentifier.trim(),
        signupTrxId: signupTrxId.trim().toUpperCase(),
        signupPaymentMethod,
        approvedViewsTotal: 0,
        approvedEarningsTotal: 0,
        approvedClipsTotal: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 3. Register to server store and Supabase via backend API
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: newProfile,
            clipperProfile: newClipperProfile,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Registration failed');
          setLoading(false);
          return;
        }
      } catch (apiErr) {
        console.warn('API sync notice:', apiErr);
      }

      // 4. Update local mockStore
      const existingProfileIdx = mockStore.profiles.findIndex(
        p => p.email.toLowerCase() === newProfile.email.toLowerCase() || p.id === newProfile.id
      );
      if (existingProfileIdx >= 0) {
        mockStore.profiles[existingProfileIdx] = newProfile;
      } else {
        mockStore.profiles.push(newProfile);
      }

      const existingCpIdx = mockStore.clipperProfiles.findIndex(cp => cp.userId === newUserId);
      if (existingCpIdx >= 0) {
        mockStore.clipperProfiles[existingCpIdx] = newClipperProfile;
      } else {
        mockStore.clipperProfiles.push(newClipperProfile);
      }

      mockStore.saveToStorage();
      if (typeof window !== 'undefined') {
        localStorage.setItem('clipcart_active_user', JSON.stringify(newProfile));
      }

      // Show Mandatory WhatsApp Community Gate instead of direct router.push
      setRegisteredUserId(newUserId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Clipper Community URL (Live Channel)
  const whatsappCommunityUrl = 'https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 space-y-8">
      {/* 1. MANDATORY WHATSAPP COMMUNITY GATE (Shown after registration) */}
      {registeredUserId ? (
        <div className="neo-box-lg bg-white dark:bg-[#14151a] p-8 sm:p-12 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-[#25D366]/20 border-2 border-zinc-950 dark:border-zinc-700 text-[#25D366] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]">
            <MessageCircle className="w-8 h-8 fill-current" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-['JetBrains_Mono'] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-zinc-950 dark:border-zinc-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.registerPage.gateBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-zinc-950 dark:text-white">
              {t.registerPage.gateTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto font-['Space_Grotesk'] leading-relaxed">
              {t.registerPage.gateWelcome.replace('{name}', fullName).replace('{trxId}', signupTrxId)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 max-w-lg mx-auto text-left text-xs font-['Space_Grotesk'] space-y-3 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]">
            <span className="font-['Unbounded'] font-bold text-zinc-950 dark:text-white block text-xs">
              {t.registerPage.gateWhyTitle}
            </span>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.registerPage.gateReason1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.registerPage.gateReason2}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.registerPage.gateReason3}</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 space-y-3 max-w-md mx-auto">
            <a
              href={whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setHasClickedCommunity(true)}
              className="w-full py-3.5 px-6 rounded-xl font-['Unbounded'] font-black text-xs text-white bg-[#25D366] hover:bg-[#20bd5a] border-2 border-zinc-950 dark:border-zinc-700 shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_#09090b] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t.registerPage.gateJoinButton}</span>
            </a>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className={`w-full py-3 px-6 rounded-xl font-['Unbounded'] font-bold text-xs border-2 border-zinc-950 dark:border-zinc-700 transition-all cursor-pointer ${
                hasClickedCommunity
                  ? 'bg-rose-600 text-white shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] hover:bg-rose-500'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {hasClickedCommunity ? t.registerPage.gateEnterButton : t.registerPage.gateEnterPending}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-white mx-auto shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]">
              <PlaySquare className="w-6 h-6 fill-white text-rose-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black text-zinc-950 dark:text-white tracking-tight">
              {t.registerPage.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto font-['Space_Grotesk'] font-medium">
              {t.registerPage.subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="neo-sticker bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-zinc-950 dark:border-zinc-700 rotate-[-1deg]">
                {t.registerPage.stickerMinPayout}
              </span>
              <span className="neo-sticker bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 rotate-[1deg]">
                {t.registerPage.stickerZeroFee}
              </span>
              <span className="neo-sticker bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-zinc-950 dark:border-zinc-700 rotate-[-1deg]">
                {t.registerPage.stickerAntiBot}
              </span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="neo-box-lg bg-white dark:bg-[#14151a] p-6 sm:p-10 space-y-8 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-100 dark:bg-rose-950/50 border-2 border-rose-800 dark:border-rose-700 text-rose-900 dark:text-rose-200 font-bold">
                {error}
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-2">
                <h2 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 dark:text-white font-black">
                  {t.registerPage.step1Title}
                </h2>
                <span className="text-[10px] font-['JetBrains_Mono'] text-zinc-500 dark:text-zinc-400 font-bold">
                  {t.registerPage.step1Subtitle}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.registerPage.fullNamePlaceholder}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t.registerPage.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.passwordLabel}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder={t.registerPage.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.confirmPasswordLabel}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder={t.registerPage.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.registerPage.phonePlaceholder}
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 font-['JetBrains_Mono'] text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.countryLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white focus:outline-none text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Creator Handles & Platforms (Including Facebook) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-2">
                <h2 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 dark:text-white font-black">
                  {t.registerPage.step2Title}
                </h2>
                <span className="text-[10px] font-['JetBrains_Mono'] text-zinc-500 dark:text-zinc-400 font-bold">
                  {t.registerPage.step2Subtitle}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-['JetBrains_Mono']">
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.tiktokLabel}
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={tiktokHandle}
                    onChange={(e) => setTiktokHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.instagramLabel}
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.youtubeLabel}
                  </label>
                  <input
                    type="text"
                    placeholder="@Channel"
                    value={youtubeHandle}
                    onChange={(e) => setYoutubeHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.facebookLabel}
                  </label>
                  <input
                    type="text"
                    placeholder="facebook.com/... or @handle"
                    value={facebookHandle}
                    onChange={(e) => setFacebookHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                  {t.registerPage.platformsLabel}
                </label>
                <div className="flex flex-wrap gap-2 font-['JetBrains_Mono']">
                  {(['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK'] as PlatformType[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3.5 py-1.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                        preferredPlatforms.includes(p)
                          ? 'bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                  {t.registerPage.experienceLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.registerPage.experiencePlaceholder}
                  value={editingExperience}
                  onChange={(e) => setEditingExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                  {t.registerPage.portfolioLabel}
                </label>
                <input
                  type="url"
                  placeholder={t.registerPage.portfolioPlaceholder}
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 font-['JetBrains_Mono'] text-xs font-medium"
                />
              </div>
            </div>

            {/* Section 3: Payment Destination */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-2">
                <h2 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 dark:text-white font-black">
                  {t.registerPage.step3Title}
                </h2>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 font-['JetBrains_Mono'] font-bold">
                  <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.registerPage.maskedNote}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {t.registerPage.channelLabel}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white focus:outline-none text-xs font-['JetBrains_Mono'] font-bold"
                  >
                    <option value="BKASH">{t.registerPage.channelBkash}</option>
                    <option value="NAGAD" disabled>{t.registerPage.channelNagadDisabled}</option>
                    <option value="BANK">{t.registerPage.channelBank}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                    {paymentMethod === 'BANK' ? t.registerPage.bankDetailsLabel : t.registerPage.bkashNumberLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={paymentMethod === 'BANK' ? 'EBL, Dhanmondi Branch, Acc # 102...' : t.registerPage.bkashPlaceholder}
                    value={paymentIdentifier}
                    onChange={(e) => setPaymentIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 font-['JetBrains_Mono'] text-xs font-medium"
                  />
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-['Space_Grotesk']">
                {t.registerPage.payoutFloorNotice}
              </p>
            </div>

            {/* Section 4: One-time ৳50 Sign-up Verification Fee */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-2">
                <h2 className="text-xs font-['Unbounded'] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-black">
                  {t.registerPage.step4Title}
                </h2>
                <span className="neo-sticker bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-zinc-950 dark:border-zinc-700 text-[10px]">
                  {t.registerPage.oneTimeBadge}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 space-y-3 font-['Space_Grotesk']">
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-zinc-950 dark:text-white block">{t.registerPage.whyFeeTitle}</span>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t.registerPage.whyFeeDesc}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-700 text-xs space-y-2.5 font-['JetBrains_Mono']">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
                      <span className="text-zinc-700 dark:text-zinc-200 font-bold">{t.registerPage.bkashSendMoney}</span>
                      <span className="font-black text-rose-600 dark:text-rose-400 text-sm tracking-wide select-all">+8801882480457</span>
                    </div>
                    <button
                      type="button"
                      onClick={copyBkashNumber}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white dark:bg-zinc-800 border border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-rose-100 dark:hover:bg-zinc-700 flex items-center justify-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer shadow-[1px_1px_0px_#09090b] dark:shadow-[1px_1px_0px_#000000]"
                    >
                      {copiedBkash ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-400">{t.registerPage.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                          <span>{t.registerPage.copy}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold">{t.registerPage.nagadSendMoney}</span>
                    <span className="font-bold text-amber-700 dark:text-amber-300 text-[11px] bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                      {t.registerPage.nagadNotice}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1.5 border-t border-zinc-200 dark:border-zinc-800 px-1">
                    <span>{t.registerPage.referenceLabel}</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">CLIP</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                      {t.registerPage.feeSentViaLabel}
                    </label>
                    <select
                      value={signupPaymentMethod}
                      onChange={(e) => setSignupPaymentMethod(e.target.value as 'BKASH' | 'NAGAD')}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white focus:outline-none text-xs font-['JetBrains_Mono'] font-bold"
                    >
                      <option value="BKASH">{t.registerPage.bkashOptionText}</option>
                      <option value="NAGAD" disabled>{t.registerPage.channelNagadDisabled}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-800 dark:text-zinc-200 font-bold block font-['Space_Grotesk']">
                      {t.registerPage.trxIdLabel} <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t.registerPage.trxIdPlaceholder}
                      value={signupTrxId}
                      onChange={(e) => setSignupTrxId(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-zinc-950 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link href="/login" className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-['Space_Grotesk'] font-medium">
                {t.registerPage.alreadyRegistered}{' '}
                <span className="text-rose-600 dark:text-rose-400 font-bold underline">
                  {t.registerPage.loginLink}
                </span>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl font-['Unbounded'] font-black text-xs text-white bg-rose-600 hover:bg-rose-500 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? t.registerPage.submittingButton : t.registerPage.submitButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
