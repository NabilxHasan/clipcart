import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageSquare, Phone, ArrowRight, ExternalLink } from 'lucide-react';
import { WhatsAppPendingBadge } from '../../../components/shared/WhatsAppPendingBadge';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'Contact ClipCart — Dhaka Operations Desk',
  description:
    'Connect directly with our Dhaka operations team for brand briefs, podcast distribution, or editor support. Official WhatsApp: +8801337142248.',
  alternates: {
    canonical: '/en/contact',
    languages: {
      'bn-BD': '/contact',
      'en-BD': '/en/contact',
      'x-default': '/contact',
    },
  },
  openGraph: {
    title: 'Contact ClipCart — Dhaka Operations Desk',
    description:
      'Direct WhatsApp hotline +8801337142248. Brand campaign allocation & clipper community.',
    url: '/en/contact',
    locale: 'en_US',
    type: 'website',
  },
};

export default function EnglishContactPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/en' },
          { name: 'Contact', url: '/en/contact' },
        ])}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Top Banner */}
        <div className="space-y-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">Get In Touch</span>
            <span className="neo-sticker bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-950 dark:border-rose-850 text-[10px]">
              Dhaka Operations Desk
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            Contact ClipCart
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium max-w-xl leading-relaxed">
            Whether you are a podcast host planning a 100k view distribution run or an editor with payout questions, connect directly with our team.
          </p>
        </div>

        {/* Grid of Contact Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          {/* 1. Brand WhatsApp Desk */}
          <div className="neo-box p-6 space-y-3.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] dark:hover:shadow-[5px_5px_0px_#000000] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-zinc-950 dark:border-zinc-700 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block font-mono font-bold text-[10px] uppercase">
                  BRAND CAMPAIGN INBOX
                </span>
                <span className="text-sm font-bold font-mono text-zinc-950 dark:text-white">
                  +880 1337-142248
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                Direct hotline for founders, creators, and brands to request custom campaign allocations.
              </p>
            </div>
            <a
              href="https://wa.me/8801337142248?text=Hello%20ClipCart%2C%20I%20want%20to%20discuss%20a%20campaign"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-btn-whatsapp w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Message on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 2. WhatsApp Creator Community */}
          <div className="neo-box p-6 space-y-3.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] dark:hover:shadow-[5px_5px_0px_#000000] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border-2 border-zinc-950 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block font-mono font-bold text-[10px] uppercase">
                  CREATOR COMMUNITY CHANNEL
                </span>
                <span className="text-sm font-bold font-['Space_Grotesk'] text-zinc-950 dark:text-white">
                  ClipCart Bangladesh Creators
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                Real-time Google Drive footage drops, sprint releases, and verified view audit updates.
              </p>
            </div>
            <a
              href="https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn bg-[#25D366] hover:bg-[#20b858] text-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Join WhatsApp Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 3. Direct Email */}
          <div className="neo-box p-6 space-y-3.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] dark:hover:shadow-[5px_5px_0px_#000000] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block font-mono font-bold text-[10px] uppercase">
                  SUPPORT & PARTNERSHIP EMAIL
                </span>
                <span className="text-sm font-bold font-mono text-zinc-950 dark:text-white">
                  team@clipcart.bd
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                Send formal RFPs, brand guidelines, and corporate distribution partnership queries.
              </p>
            </div>
            <a
              href="mailto:team@clipcart.bd"
              className="neo-btn neo-btn-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Email Operations Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 4. Physical Location */}
          <div className="neo-box p-6 space-y-3.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] dark:hover:shadow-[5px_5px_0px_#000000] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 flex items-center justify-center shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
                <WhatsAppPendingBadge />
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block font-mono font-bold text-[10px] uppercase">
                  REGISTERED OPERATING BASE
                </span>
                <span className="text-sm font-bold text-zinc-950 dark:text-white">
                  Dhaka, Bangladesh
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                Operations, compliance review, and manual financial ledger reconciliation conducted in Dhaka.
              </p>
            </div>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block">
                Standard Desk Hours: 10:00 AM – 10:00 PM (BST)
              </span>
            </div>
          </div>
        </div>

        {/* Brand Intake CTA */}
        <div className="neo-box-lg p-7 flex flex-col sm:flex-row items-center justify-between gap-5 bg-white dark:bg-[#14151a]">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-base font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">
              Need to launch a brand campaign?
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              Use our intake form to get a custom CPM rate and instant clipper allocation.
            </p>
          </div>
          <Link
            href="/client-request"
            className="neo-btn neo-btn-primary px-5 py-2.5 text-xs shrink-0"
          >
            Open Intake Form
          </Link>
        </div>
      </div>
    </>
  );
}
