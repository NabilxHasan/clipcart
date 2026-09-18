'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Lock, PlaySquare, MessageCircle, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { PlatformType, PaymentMethod } from '../../../lib/types/database';
import { mockStore } from '../../../lib/db/mock-store';

export default function RegisterPage() {
  const router = useRouter();

  // Basic Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [country, setCountry] = useState('Bangladesh');

  // Socials & Portfolio
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [youtubeHandle, setYoutubeHandle] = useState('');
  const [preferredPlatforms, setPreferredPlatforms] = useState<PlatformType[]>(['TIKTOK', 'YOUTUBE']);
  const [editingExperience, setEditingExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Payment Setup
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BKASH');
  const [paymentIdentifier, setPaymentIdentifier] = useState('');

  // One-time ৳50 Sign-up Verification Fee
  const [signupPaymentMethod, setSignupPaymentMethod] = useState<'BKASH' | 'NAGAD'>('BKASH');
  const [signupTrxId, setSignupTrxId] = useState('');

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

    if (!signupTrxId.trim() || signupTrxId.trim().length < 6) {
      setError('Please provide a valid ৳50 verification Transaction ID (TrxID) from bKash or Nagad.');
      setLoading(false);
      return;
    }

    try {
      const newUserId = `usr-${Date.now().toString(36)}`;

      // 1. Create Profile
      mockStore.profiles.push({
        id: newUserId,
        email,
        role: 'CLIPPER',
        fullName,
        phoneWhatsapp,
        country,
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 2. Create Clipper Profile
      mockStore.clipperProfiles.push({
        userId: newUserId,
        tiktokHandle: tiktokHandle || undefined,
        instagramHandle: instagramHandle || undefined,
        youtubeHandle: youtubeHandle || undefined,
        preferredPlatforms,
        editingExperience: editingExperience || undefined,
        portfolioUrl: portfolioUrl || undefined,
        paymentMethod,
        paymentIdentifier,
        approvedViewsTotal: 0,
        approvedEarningsTotal: 0,
        approvedClipsTotal: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

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
        <div className="neo-box-lg bg-white p-8 sm:p-12 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-[#25D366]/20 border-2 border-zinc-950 text-[#25D366] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#09090b]">
            <MessageCircle className="w-8 h-8 fill-current" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-['JetBrains_Mono'] font-bold bg-rose-100 text-rose-700 border border-zinc-950">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>FINAL STEP (MANDATORY)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-zinc-950">
              Join the Clipper WhatsApp Community
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto font-['Space_Grotesk'] leading-relaxed">
              Welcome, <span className="font-bold text-zinc-950">{fullName}</span>! Your profile has been created with verified TrxID: <span className="font-['JetBrains_Mono'] font-bold text-zinc-950">{signupTrxId}</span>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border-2 border-zinc-950 max-w-lg mx-auto text-left text-xs font-['Space_Grotesk'] space-y-3 shadow-[3px_3px_0px_#09090b]">
            <span className="font-['Unbounded'] font-bold text-zinc-950 block text-xs">
              Why must you join the WhatsApp community?
            </span>
            <ul className="space-y-2 text-zinc-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant alerts when brands drop new raw interview footage on Google Drive.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Real-time notifications whenever view audits are completed and payouts are sent.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Community editing tips, trending hooks, and direct moderator communication.</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 space-y-3 max-w-md mx-auto">
            <a
              href={whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setHasClickedCommunity(true)}
              className="w-full py-3.5 px-6 rounded-xl font-['Unbounded'] font-black text-xs text-white bg-[#25D366] hover:bg-[#20bd5a] border-2 border-zinc-950 shadow-[4px_4px_0px_#09090b] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_#09090b] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Join WhatsApp Clipper Community (Required) →</span>
            </a>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className={`w-full py-3 px-6 rounded-xl font-['Unbounded'] font-bold text-xs border-2 border-zinc-950 transition-all ${
                hasClickedCommunity
                  ? 'bg-rose-600 text-white shadow-[3px_3px_0px_#09090b] hover:bg-rose-500'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
              }`}
            >
              {hasClickedCommunity ? 'I Have Joined • Enter Clipper Workspace →' : 'I Have Joined the Community • Enter Workspace'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 border-2 border-zinc-950 flex items-center justify-center text-white mx-auto shadow-[3px_3px_0px_#09090b]">
              <PlaySquare className="w-6 h-6 fill-white text-rose-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black text-zinc-950 tracking-tight">
              Join the ClipCart Clipper Roster
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto font-['Space_Grotesk'] font-medium">
              Start monetizing your short-form video editing skills with high-retention campaigns from top creators and brands in Bangladesh.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="neo-sticker bg-white text-zinc-950 rotate-[-1deg]">
                💰 ৳50 Minimum Payout Floor
              </span>
              <span className="neo-sticker bg-rose-600 text-white rotate-[1deg]">
                ⚡ 0% Fee on All Earnings & Cashouts
              </span>
              <span className="neo-sticker bg-emerald-100 text-emerald-900 rotate-[-1deg]">
                🛡️ ৳50 Anti-Bot Signup Fee
              </span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="neo-box-lg bg-white p-6 sm:p-10 space-y-8 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-100 border-2 border-rose-800 text-rose-900 font-bold">
                {error}
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-2">
                <h2 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 font-black">
                  01. Personal & Contact Information
                </h2>
                <span className="text-[10px] font-['JetBrains_Mono'] text-zinc-500 font-bold">Step 1 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Tanvir Hossain"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="tanvir@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+88017XXXXXXXX"
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white font-['JetBrains_Mono'] text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 focus:outline-none text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Creator Handles & Platforms */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-2">
                <h2 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 font-black">
                  02. Social Handles & Editing Experience
                </h2>
                <span className="text-[10px] font-['JetBrains_Mono'] text-zinc-500 font-bold">Step 2 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-['JetBrains_Mono']">
                <div className="space-y-1.5">
                  <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">TikTok Username</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={tiktokHandle}
                    onChange={(e) => setTiktokHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Instagram Username</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">YouTube Channel</label>
                  <input
                    type="text"
                    placeholder="@Channel"
                    value={youtubeHandle}
                    onChange={(e) => setYoutubeHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Preferred Publishing Platforms</label>
                <div className="flex gap-2 font-['JetBrains_Mono']">
                  {(['TIKTOK', 'INSTAGRAM', 'YOUTUBE'] as PlatformType[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-colors ${
                        preferredPlatforms.includes(p)
                          ? 'bg-rose-600 text-white border-zinc-950 shadow-[2px_2px_0px_#09090b]'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Editing Experience & Tools</label>
                <input
                  type="text"
                  placeholder="e.g. 2 years editing reels with Premiere Pro, CapCut, and After Effects"
                  value={editingExperience}
                  onChange={(e) => setEditingExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Portfolio / Sample Reel Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or https://instagram.com/..."
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white font-['JetBrains_Mono'] text-xs font-medium"
                />
              </div>
            </div>

            {/* Section 3: Payment Destination */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-2">
                <h2 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 font-black">
                  03. Payout Destination (0% Fee)
                </h2>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-['JetBrains_Mono'] font-bold">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Masked on Public Board</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Disbursement Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 focus:outline-none text-xs font-['JetBrains_Mono'] font-bold"
                  >
                    <option value="BKASH">bKash (Personal or Merchant)</option>
                    <option value="NAGAD">Nagad</option>
                    <option value="BANK">Bangladeshi Bank Account</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">
                    {paymentMethod === 'BANK' ? 'Bank Name, Branch & Account No.' : 'bKash / Nagad Mobile Number'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={paymentMethod === 'BANK' ? 'EBL, Dhanmondi Branch, Acc # 102...' : '017XXXXXXXX'}
                    value={paymentIdentifier}
                    onChange={(e) => setPaymentIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white font-['JetBrains_Mono'] text-xs font-medium"
                  />
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 font-['Space_Grotesk']">
                ✨ Minimum payout floor is only ৳50 BDT. 0% service fees deducted on all your withdrawals.
              </p>
            </div>

            {/* Section 4: One-time ৳50 Sign-up Verification Fee */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-2">
                <h2 className="text-xs font-['Unbounded'] uppercase tracking-wider text-rose-600 font-black">
                  04. ৳50 Verification Fee (Anti-Spam Bot Filter)
                </h2>
                <span className="neo-sticker bg-rose-100 text-rose-800 text-[10px]">
                  One-Time ৳50 Only
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border-2 border-zinc-950 space-y-3 font-['Space_Grotesk']">
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-zinc-950 block">Why is there a ৳50 signup fee?</span>
                  <p className="text-zinc-600 leading-relaxed">
                    To keep ClipCart 100% human and prevent automated bots from mass-claiming brand campaign budgets, every clipper pays a one-time ৳50 verification fee. You keep 100% of your clipping earnings afterwards with 0% cashout fees!
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-zinc-950 text-xs space-y-1 font-['JetBrains_Mono']">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-bold">bKash Send Money:</span>
                    <span className="font-black text-rose-600">017XXXXXXXX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-bold">Nagad Send Money:</span>
                    <span className="font-black text-orange-600">017XXXXXXXX</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-200">
                    <span>Reference / Counter:</span>
                    <span className="font-bold text-zinc-800">CLIP</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Fee Sent Via</label>
                    <select
                      value={signupPaymentMethod}
                      onChange={(e) => setSignupPaymentMethod(e.target.value as 'BKASH' | 'NAGAD')}
                      className="w-full px-3 py-2 rounded-xl bg-white border-2 border-zinc-950 text-zinc-950 focus:outline-none text-xs font-['JetBrains_Mono'] font-bold"
                    >
                      <option value="BKASH">bKash Send Money (৳50)</option>
                      <option value="NAGAD">Nagad Send Money (৳50)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">
                      Transaction ID (TrxID) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BK9X284L91"
                      value={signupTrxId}
                      onChange={(e) => setSignupTrxId(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link href="/login" className="text-xs text-zinc-500 hover:text-zinc-950 font-['Space_Grotesk'] font-medium">
                Already registered? <span className="text-rose-600 font-bold underline">Log In</span>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl font-['Unbounded'] font-black text-xs text-white bg-rose-600 hover:bg-rose-500 border-2 border-zinc-950 shadow-[3px_3px_0px_#09090b] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying TrxID...' : 'Complete Clipper Setup (Step 1/2)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

