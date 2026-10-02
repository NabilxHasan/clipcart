import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Scale, ShieldAlert, ArrowRight } from 'lucide-react';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'Terms of Service — Creator Guidelines & Platform Rules',
  description:
    'ClipCart BD Terms of Service. Review clipper guidelines, ৳50 bKash cashout rules, anti-fraud standards, and brand campaign terms for short-form video distribution.',
  alternates: {
    canonical: '/en/terms',
    languages: {
      'bn-BD': '/terms',
      'en-BD': '/en/terms',
      'x-default': '/terms',
    },
  },
  openGraph: {
    title: 'Terms of Service — ClipCart BD',
    description:
      'Platform terms, clipper integrity guidelines, and campaign rules for ClipCart Bangladesh.',
    url: '/en/terms',
    locale: 'en_US',
    type: 'website',
  },
};

export default function TermsEnPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/en' },
          { name: 'Terms of Service', url: '/en/terms' },
        ])}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b-2 border-zinc-950 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Platform Terms
            </span>
            <span className="neo-sticker bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-950 dark:border-amber-850 text-[10px]">
              Effective: October 2026
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
            These terms govern your access to and participation in the ClipCart marketplace. By accessing our services, creating an account, or submitting clips, you agree to these provisions.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
          {/* Section 1: Overview */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <Scale className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">1. Platform Nature &amp; Role</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              ClipCart operates as a performance-based short-form video distribution marketplace. We connect content owners and brands with independent freelance video editors (clippers). Clippers operate as independent contractors and earn view-based CPM compensation for verified, audited organic reach.
            </p>
          </div>

          {/* Section 2: Clipper Obligations & Anti-Fraud */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">2. Clipper Standards &amp; View Integrity</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Original Editing:</strong> Clippers must extract high-retention hooks from the provided Google Drive source master and implement original vertical formatting, pacing, and kinetic subtitles.
              </li>
              <li>
                <strong>Zero Tolerance for Bot Views:</strong> Purchasing views, deploying automated click scripts, or participating in fake view exchanges is strictly prohibited. Submissions with suspicious metrics will be permanently rejected, and offending clipper accounts terminated without refund.
              </li>
              <li>
                <strong>Live URLs Only:</strong> Only publicly accessible, non-private TikTok, Instagram Reels, and YouTube Shorts URLs are eligible for audit.
              </li>
            </ul>
          </div>

          {/* Section 3: ৳50 Signup Verification Fee */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">3. One-Time ৳50 Signup Commitment Fee</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              To safeguard campaign budgets against automated bot registrations and spam accounts, a one-time ৳50 BDT verification fee via bKash is required during onboarding. ClipCart deducts 0% fee from subsequent clipper earnings—all verified view revenue belongs 100% to the editor.
            </p>
          </div>

          {/* Section 4: Brand Client Terms */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Scale className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">4. Brand Client Provisions</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Campaign Parameters:</strong> Micro-campaigns start from ৳1,000 for a 3-day sprint duration. A 10% platform curation and moderation fee applies to brand campaign budgets.
              </li>
              <li>
                <strong>Budget Consumption:</strong> Campaign budgets are consumed dynamically based on verified clipper views until exhausted or the timeframe concludes.
              </li>
            </ul>
          </div>

          {/* Section 5: Payouts */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">5. Payouts &amp; Cashouts</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              The minimum withdrawal threshold is ৳50 BDT. Once requested, withdrawals are manually audited by ClipCart moderators and disbursed to the clipper’s verified personal bKash wallet within 24 to 72 hours, complete with an official TrxID reference.
            </p>
          </div>

          {/* Section 6: Prohibited Content */}
          <div className="neo-box p-6 space-y-3 bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">6. Prohibited Content</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              The following content types are strictly prohibited and result in immediate clip rejection:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>Hate speech, harassment, or politically defamatory fabrications.</li>
              <li>Sexually explicit, violent, or dangerous imagery.</li>
              <li>Deliberately deceptive clickbait that misrepresents the source material.</li>
            </ul>
          </div>

          {/* Section 7: Jurisdiction */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-bold text-sm">
              <Scale className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">7. Governing Law</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              These terms are governed by and construed in accordance with the laws of the People’s Republic of Bangladesh. Any legal disputes shall be subject to the exclusive jurisdiction of the competent courts of Dhaka.
            </p>
          </div>
        </div>

        {/* Contact Desk */}
        <div className="neo-box-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-['Unbounded'] font-bold text-sm text-zinc-950 dark:text-white">
              Questions regarding these terms?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Reach out to our operations desk on WhatsApp.
            </p>
          </div>
          <Link href="/en/contact" className="neo-btn neo-btn-primary px-4 py-2 text-xs shrink-0 flex items-center gap-1.5">
            <span>Contact Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
