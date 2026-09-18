'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, Calculator, Sparkles, ExternalLink } from 'lucide-react';
import { ClipBDRepository } from '../../lib/db/repository';
import { PlatformType } from '../../lib/types/database';

export default function ClientRequestPage() {
  const [name, setName] = useState('');
  const [companyCreator, setCompanyCreator] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [campaignObjective, setCampaignObjective] = useState('');
  const [platforms, setPlatforms] = useState<PlatformType[]>(['TIKTOK', 'INSTAGRAM', 'YOUTUBE']);
  
  // Flexible BD Budgets
  const [budgetTier, setBudgetTier] = useState<'1000' | '2500' | '5000' | 'custom'>('1000');
  const [customBudget, setCustomBudget] = useState<number>(3000);
  const [duration, setDuration] = useState('3 days');
  const [contentType, setContentType] = useState('Video Podcast / Interview');
  const [sourceUrl, setSourceUrl] = useState('');
  const [requirements, setRequirements] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeBudget = budgetTier === '1000' ? 1000 : budgetTier === '2500' ? 2500 : budgetTier === '5000' ? 5000 : customBudget;
  const platformFee = Math.round(activeBudget * 0.10); // 10% platform fee
  const totalCost = activeBudget + platformFee;
  const targetCpm = budgetTier === '1000' ? 50 : budgetTier === '2500' ? 60 : 75;
  const estViews = Math.round((activeBudget / targetCpm) * 1000);

  const togglePlatform = (p: PlatformType) => {
    if (platforms.includes(p)) {
      if (platforms.length > 1) setPlatforms(platforms.filter(item => item !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const generateWhatsAppUrl = () => {
    const message = `*NEW BRAND CAMPAIGN BRIEF — CLIPCART BD*
👤 *Client Name:* ${name || 'Prospective Brand'}
🏢 *Brand / Creator:* ${companyCreator || 'Not Specified'}
📱 *WhatsApp:* ${whatsappNumber || 'Not Specified'}
📧 *Email:* ${email || 'Not Specified'}
💰 *Clipper Budget:* ৳${activeBudget.toLocaleString()} BDT
🛡️ *10% Service Fee:* ৳${platformFee.toLocaleString()} BDT
💳 *Total Campaign:* ৳${totalCost.toLocaleString()} BDT
⏱️ *Duration:* ${duration}
🎯 *Target CPM:* ৳${targetCpm}/1K views (Est. ~${estViews.toLocaleString()} views)
📺 *Platforms:* ${platforms.join(', ')}
🎬 *Content Type:* ${contentType}
🔗 *Source Footage Link:* ${sourceUrl || 'Will provide on chat'}
📝 *Objective:* ${campaignObjective || 'Distribute high-retention short clips across Bangladesh'}
⚠️ *Rules / Guidelines:* ${requirements || 'None specified'}

Hi ClipCart Team! I want to launch this campaign. Please confirm review and admin launch.`;

    return 'https://wa.me/8801337142248?text=' + encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await ClipBDRepository.createClientRequest({
        name,
        companyCreator,
        whatsappNumber,
        email,
        campaignObjective,
        platforms,
        estimatedBudget: Number(activeBudget),
        duration,
        contentType,
        sourceUrl: sourceUrl || undefined,
        requirements: requirements || undefined,
      });

      setSubmitted(true);
      // Open WhatsApp Business in new tab
      if (typeof window !== 'undefined') {
        window.open(generateWhatsAppUrl(), '_blank');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b-2 border-zinc-950 pb-6">
        <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] font-bold text-zinc-500 uppercase">
          <span>Brands & Creators</span>
          <span>/</span>
          <span className="text-rose-600">WhatsApp Concierge</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black text-zinc-950 tracking-tight">
          Launch a Content Campaign
        </h1>
        <p className="text-sm text-zinc-700 max-w-2xl leading-relaxed font-['Space_Grotesk'] font-medium">
          In ClipCart, campaigns are published directly by our admin team to ensure 100% brand safety, human-audited view counts, and high-retention editing briefs.
        </p>

        {/* Notice Banner */}
        <div className="p-4 rounded-xl bg-rose-50 border-2 border-zinc-950 shadow-[3px_3px_0px_#09090b] flex items-start gap-3 text-xs font-['Space_Grotesk']">
          <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-['Unbounded'] font-bold text-zinc-950 block">
              Direct Admin Launch via WhatsApp Business
            </span>
            <p className="text-zinc-600">
              Fill out your parameters below to auto-generate your campaign brief, then tap the button to connect directly with the ClipCart leadership team on WhatsApp. Flexible micro-budgets start at just ৳1,000 for 3 days!
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="neo-box-lg bg-white p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-zinc-950 text-emerald-600 flex items-center justify-center mx-auto shadow-[3px_3px_0px_#09090b]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-['JetBrains_Mono'] font-bold text-emerald-700 uppercase tracking-widest block">
              Brief Generated Successfully
            </span>
            <h2 className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-zinc-950">
              Ready to Launch on WhatsApp!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto font-['Space_Grotesk']">
              Thank you, <span className="font-bold text-zinc-950">{name}</span>! Your campaign brief for <span className="font-bold text-zinc-950">{companyCreator}</span> has been saved in our system.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border-2 border-zinc-950 max-w-lg mx-auto text-left text-xs font-['Space_Grotesk'] space-y-2.5 shadow-[2px_2px_0px_#09090b]">
            <div className="flex justify-between border-b border-zinc-200 pb-1.5 font-['JetBrains_Mono']">
              <span className="text-zinc-500 font-bold">Campaign Budget:</span>
              <span className="font-black text-zinc-950">৳{activeBudget.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-1.5 font-['JetBrains_Mono']">
              <span className="text-zinc-500 font-bold">10% Platform Fee:</span>
              <span className="font-black text-rose-600">৳{platformFee.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-1.5 font-['JetBrains_Mono']">
              <span className="text-zinc-500 font-bold">Duration:</span>
              <span className="font-bold text-zinc-950">{duration}</span>
            </div>
            <div className="flex justify-between font-['JetBrains_Mono']">
              <span className="text-zinc-500 font-bold">Target Reach:</span>
              <span className="font-bold text-emerald-700">~{estViews.toLocaleString()} Verified Views</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-['Unbounded'] font-black text-xs text-white bg-[#25D366] hover:bg-[#20bd5a] border-2 border-zinc-950 shadow-[4px_4px_0px_#09090b] flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Open WhatsApp Business Chat →</span>
            </a>
            <Link
              href="/campaigns"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-['Unbounded'] font-bold text-xs text-zinc-900 bg-white hover:bg-zinc-50 border-2 border-zinc-950 shadow-[3px_3px_0px_#09090b] text-center"
            >
              Browse Live Campaigns
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="neo-box-lg bg-white p-6 sm:p-10 space-y-8 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-100 border-2 border-rose-800 text-rose-900 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Section 1: Contact Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-2">
              <h3 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 font-black">
                01. Brand & Contact Information
              </h3>
              <span className="text-[10px] font-['JetBrains_Mono'] text-zinc-500 font-bold">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Mahmud"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Company / Brand / Podcast Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Tech Podcast"
                  value={companyCreator}
                  onChange={(e) => setCompanyCreator(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">WhatsApp Contact Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+88017XXXXXXXX"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white font-['JetBrains_Mono'] text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="asif@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Flexible Budget Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-2">
              <h3 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 font-black">
                02. Campaign Budget & Duration
              </h3>
              <span className="text-[10px] font-['JetBrains_Mono'] text-zinc-500 font-bold">10% Platform Fee</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => { setBudgetTier('1000'); setDuration('3 days'); }}
                className={`p-3 rounded-xl border-2 border-zinc-950 text-left transition-all ${
                  budgetTier === '1000'
                    ? 'bg-rose-600 text-white shadow-[3px_3px_0px_#09090b]'
                    : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100 shadow-[1.5px_1.5px_0px_#09090b]'
                }`}
              >
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold block opacity-90">Micro-Sprint</span>
                <span className="text-base font-['Unbounded'] font-black block">৳1,000</span>
                <span className="text-[11px] font-medium opacity-90">3 Days (৳50 CPM)</span>
              </button>

              <button
                type="button"
                onClick={() => { setBudgetTier('2500'); setDuration('5 days'); }}
                className={`p-3 rounded-xl border-2 border-zinc-950 text-left transition-all ${
                  budgetTier === '2500'
                    ? 'bg-rose-600 text-white shadow-[3px_3px_0px_#09090b]'
                    : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100 shadow-[1.5px_1.5px_0px_#09090b]'
                }`}
              >
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold block opacity-90">Growth Run</span>
                <span className="text-base font-['Unbounded'] font-black block">৳2,500</span>
                <span className="text-[11px] font-medium opacity-90">5 Days (৳60 CPM)</span>
              </button>

              <button
                type="button"
                onClick={() => { setBudgetTier('5000'); setDuration('7 days'); }}
                className={`p-3 rounded-xl border-2 border-zinc-950 text-left transition-all ${
                  budgetTier === '5000'
                    ? 'bg-rose-600 text-white shadow-[3px_3px_0px_#09090b]'
                    : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100 shadow-[1.5px_1.5px_0px_#09090b]'
                }`}
              >
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold block opacity-90">Viral Surge</span>
                <span className="text-base font-['Unbounded'] font-black block">৳5,000</span>
                <span className="text-[11px] font-medium opacity-90">7 Days (৳75 CPM)</span>
              </button>

              <button
                type="button"
                onClick={() => setBudgetTier('custom')}
                className={`p-3 rounded-xl border-2 border-zinc-950 text-left transition-all ${
                  budgetTier === 'custom'
                    ? 'bg-rose-600 text-white shadow-[3px_3px_0px_#09090b]'
                    : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100 shadow-[1.5px_1.5px_0px_#09090b]'
                }`}
              >
                <span className="text-[10px] font-['JetBrains_Mono'] uppercase font-bold block opacity-90">Custom Budget</span>
                <span className="text-base font-['Unbounded'] font-black block">Flexible</span>
                <span className="text-[11px] font-medium opacity-90">Tailored</span>
              </button>
            </div>

            {budgetTier === 'custom' && (
              <div className="p-4 rounded-xl bg-zinc-50 border-2 border-zinc-950 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-800 font-bold block font-['JetBrains_Mono']">
                      Custom Budget (৳ BDT): ৳{customBudget.toLocaleString()}
                    </label>
                    <input
                      type="number"
                      min={1000}
                      step={500}
                      value={customBudget}
                      onChange={(e) => setCustomBudget(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white border-2 border-zinc-950 text-zinc-950 font-['JetBrains_Mono']"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-800 font-bold block font-['JetBrains_Mono']">
                      Campaign Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10 days"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border-2 border-zinc-950 text-zinc-950 font-['JetBrains_Mono']"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Fee calculation box */}
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-['Space_Grotesk']">
              <div>
                <span className="font-bold text-zinc-950 block">Investment Breakdown:</span>
                <span className="text-zinc-600 text-[11px]">
                  Clipper Prize Pool: ৳{activeBudget.toLocaleString()} + 10% ClipCart Service Fee: ৳{platformFee.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-['JetBrains_Mono'] font-bold text-zinc-500 uppercase block">Total Cost</span>
                <span className="text-lg font-['Unbounded'] font-black text-rose-600">৳{totalCost.toLocaleString()} BDT</span>
              </div>
            </div>
          </div>

          {/* Section 3: Campaign Content & Footage */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-2">
              <h3 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 font-black">
                03. Content Brief & Footage
              </h3>
              <span className="text-[10px] font-['JetBrains_Mono'] text-zinc-500 font-bold">Step 3 of 3</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Campaign Objective & Core Message</label>
              <textarea
                rows={3}
                required
                placeholder="What is the main goal? e.g. Distribute our 3 latest podcast episodes to reach university students and young entrepreneurs in Dhaka."
                value={campaignObjective}
                onChange={(e) => setCampaignObjective(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Target Platforms</label>
                <div className="flex gap-2 font-['JetBrains_Mono']">
                  {(['TIKTOK', 'INSTAGRAM', 'YOUTUBE'] as PlatformType[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-colors ${
                        platforms.includes(p)
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
                <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Content Type</label>
                <input
                  type="text"
                  placeholder="e.g. Video Podcast / Keynote / Webinar"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">
                Source Footage URL (Google Drive / YouTube Link)
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white font-['JetBrains_Mono'] text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-800 font-bold block font-['Space_Grotesk']">Specific Brand Guidelines / Exclusions</label>
              <textarea
                rows={2}
                placeholder="Any prohibited topics, required hashtags, or brand safety rules."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:bg-white text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-[11px] text-zinc-600 font-['JetBrains_Mono'] font-medium">
              🔒 No automated credit card billing. All campaigns are reviewed by ClipCart admins.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl font-['Unbounded'] font-black text-xs text-white bg-rose-600 hover:bg-rose-500 border-2 border-zinc-950 shadow-[3px_3px_0px_#09090b] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{submitting ? 'Preparing WhatsApp Brief...' : 'Launch on WhatsApp Business →'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

