import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PlaySquare, ShieldCheck, Banknote, Users, Sparkles, ArrowRight } from 'lucide-react';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'About ClipCart — Bangladesh Short-Form Video Distribution Marketplace',
  description:
    'Learn about ClipCart BD, Bangladesh’s premier content clipping and performance distribution house. Connecting brands, podcasters, and vetted video editors with verified view payouts.',
  alternates: {
    canonical: '/en/about',
    languages: {
      'bn-BD': '/about',
      'en-BD': '/en/about',
      'x-default': '/about',
    },
  },
  openGraph: {
    title: 'About ClipCart BD — Performance Video Distribution',
    description:
      'Empowering the Bangladeshi creator economy through decentralized video clipping, verified CPM earnings, and direct bKash payouts.',
    url: '/en/about',
    locale: 'en_US',
    type: 'website',
  },
};

export default function AboutEnPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/en' },
          { name: 'About Us', url: '/en/about' },
        ])}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Mission &amp; Overview
            </span>
            <span className="neo-sticker bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-950 dark:border-rose-850 text-[10px]">
              Dhaka, Bangladesh
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-tight">
            Turning Long-Form Content into <span className="text-rose-600">Viral Distribution</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed max-w-3xl">
            ClipCart is Bangladesh’s first performance-driven content distribution house and creator clipping marketplace. We bridge leading podcast hosts, startup founders, and consumer brands with hundreds of vetted video editors across the country to deliver organic, authentic short-form reach.
          </p>
        </div>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase">
              The Challenge We Solve
            </span>
            <h2 className="text-xl font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
              Valuable Content Trapped in Long YouTube Links
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Founders and podcasters in Bangladesh invest immense resources into producing high-value 60-minute interviews. Yet, attention has shifted irreversibly to vertical video on TikTok, Reels, and Shorts. Meanwhile, thousands of talented video editors nationwide lack accessible platforms to monetize their craft without complex international payment gateways.
            </p>
          </div>

          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
              The ClipCart Engine
            </span>
            <h2 className="text-xl font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
              Decentralized Clipping with Guaranteed Reach
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Brands submit master footage and a flexible campaign budget (starting from ৳1,000 for 3 days on a CPM model). Our registered community of clippers extracts the highest-retention hooks, applies kinetic typography, and publishes across vertical channels. Brands gain verified viral impressions, and editors earn predictable view-based payouts.
            </p>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="space-y-6">
          <div className="border-b-2 border-zinc-950 dark:border-zinc-800 pb-3">
            <h2 className="text-2xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">
              Our 3 Operational Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <div className="neo-box p-5 space-y-3 bg-white dark:bg-[#14151a]">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-rose-600">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                Financial Accessibility &amp; 0% Fee
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                No international banking barriers. Clippers can request payouts starting at just ৳50 BDT directly to their personal bKash accounts. ClipCart deducts 0% commission from clipper earnings.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="neo-box p-5 space-y-3 bg-white dark:bg-[#14151a]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                Human-Audited Real Views
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                Zero tolerance for bot fraud or manipulated view counts. Every submission passes automated link validation, duplicate checks, and human verification before funds are credited.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="neo-box p-5 space-y-3 bg-white dark:bg-[#14151a]">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                Brand Safety &amp; Integrity
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                Clear guidelines safeguard brand reputation. Misleading edits, hate speech, or clickbait violations are strictly disqualified. Creative liberty is paired with authentic storytelling.
              </p>
            </div>
          </div>
        </div>

        {/* Operations */}
        <div className="neo-box-lg p-6 sm:p-8 space-y-4 bg-zinc-50 dark:bg-zinc-900/50">
          <h2 className="text-xl font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
            Dhaka Operations Desk
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
            <p>
              ClipCart is operated by a dedicated team based in Dhaka, Bangladesh. We handle campaign brief preparation, high-speed Google Drive footage hosting, clipper performance tracking, and verified financial disbursements.
            </p>
            <p>
              To maintain absolute transparency, all transactions are recorded in an immutable ledger. Every withdrawal is accompanied by an auditable bKash Transaction ID (TrxID).
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="neo-box-lg p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-[#14151a]">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">
              Ready to collaborate?
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              Join as a video editor or launch a targeted clipping sprint for your brand.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/register" className="neo-btn neo-btn-primary px-5 py-2.5 text-xs">
              Join as a Clipper
            </Link>
            <a
              href="https://wa.me/8801337142248?text=Hello%20ClipCart%2C%20I%20want%20to%20learn%20more%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-btn-whatsapp px-5 py-2.5 text-xs flex items-center gap-1.5"
            >
              <span>WhatsApp Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
