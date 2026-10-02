import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, ArrowRight } from 'lucide-react';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'Privacy Policy — User Data Protection & Financial Security',
  description:
    'ClipCart BD Privacy Policy. Learn how we collect, handle, and protect user profile information, video submission links, and bKash payout details with strict transparency.',
  alternates: {
    canonical: '/en/privacy',
    languages: {
      'bn-BD': '/privacy',
      'en-BD': '/en/privacy',
      'x-default': '/privacy',
    },
  },
  openGraph: {
    title: 'Privacy Policy — ClipCart BD',
    description:
      'Our commitment to user data privacy, secure creator disbursements, and transparent view auditing in Bangladesh.',
    url: '/en/privacy',
    locale: 'en_US',
    type: 'website',
  },
};

export default function PrivacyEnPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/en' },
          { name: 'Privacy Policy', url: '/en/privacy' },
        ])}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b-2 border-zinc-950 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Legal &amp; Trust
            </span>
            <span className="neo-sticker bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-950 dark:border-emerald-850 text-[10px]">
              Last Updated: October 2026
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
            ClipCart values the trust and privacy of all registered clippers, clients, and visitors. This policy outlines how your data is collected, stored, processed, and safeguarded.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
          {/* Section 1 */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">1. Information We Collect</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Account Credentials:</strong> Full name, active mobile number, valid email address, and encrypted passwords collected upon onboarding.
              </li>
              <li>
                <strong>Video Submissions:</strong> Publicly accessible post URLs (TikTok, Instagram Reels, YouTube Shorts), captions, and audit telemetry.
              </li>
              <li>
                <strong>Disbursement Data:</strong> Designated bKash personal wallet numbers for manual cashout disbursement and associated TrxID logs.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">2. How We Use Information</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your data is strictly utilized to operate and improve marketplace functionality:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>To authenticate user sessions and prevent spam or duplicate account registrations.</li>
              <li>To evaluate submitted video URLs for campaign guideline compliance and originality.</li>
              <li>To compute performance metrics and calculate CPM earnings.</li>
              <li>To disburse approved wallet earnings via bKash and maintain auditable financial ledgers.</li>
              <li>To detect and disqualify artificial bot manipulation or click-farm activity.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">3. Financial Security &amp; Wallet Privacy</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              ClipCart never requests, accesses, or stores your personal bKash PIN, OTP, or confidential banking credentials. All payouts are disbursed manually by authenticated admins directly to your designated wallet number. Once paid, the verified bKash TrxID is permanently attached to your withdrawal record.
            </p>
          </div>

          {/* Section 4 */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Eye className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">4. User Rights &amp; Data Deletion</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              You retain the right to inspect, correct, or request the deletion of your personal account information at any time. For inquiries or data removal requests, reach out directly to our operations desk.
            </p>
          </div>
        </div>

        {/* Contact Desk */}
        <div className="neo-box-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-['Unbounded'] font-bold text-sm text-zinc-950 dark:text-white">
              Questions regarding our privacy practices?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Our Dhaka operations team is available to assist you.
            </p>
          </div>
          <Link href="/en/contact" className="neo-btn neo-btn-primary px-4 py-2 text-xs shrink-0 flex items-center gap-1.5">
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
