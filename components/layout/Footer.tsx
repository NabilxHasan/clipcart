'use client';

import React from 'react';
import Link from 'next/link';
import { PlaySquare, ShieldCheck, Banknote, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { WhatsAppPendingBadge } from '../shared/WhatsAppPendingBadge';
import { useLanguage } from '../../lib/i18n/context';

export function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="border-t-[2.5px] border-zinc-950 dark:border-zinc-800 bg-white dark:bg-[#0c0d10] text-zinc-800 dark:text-zinc-200 mt-20 transition-colors">
      {/* Top running sticker ribbon */}
      <div className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-rose-50 dark:bg-rose-950/40 py-3 overflow-hidden">
        <div className="flex items-center gap-8 whitespace-nowrap animate-[fmMarquee_28s_linear_infinite] font-['Unbounded'] font-bold text-xs uppercase tracking-wider text-zinc-950 dark:text-zinc-200">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-600 rounded-full border border-zinc-950 dark:border-zinc-700" />
            {lang === 'bn' ? 'বাংলাদেশি কনটেন্ট ডিস্ট্রিবিউশন প্ল্যাটফর্ম' : 'BANGLADESH CONTENT DISTRIBUTION HOUSE'}
          </span>
          <span className="text-rose-600">✦</span>
          <span>{lang === 'bn' ? '৳ ১,০০০ মাইক্রো-ক্যাম্পেইন (৩ দিন)' : '৳1,000 MICRO-CAMPAIGNS (3 DAYS)'}</span>
          <span className="text-rose-600">✦</span>
          <span>{lang === 'bn' ? '৳ ৫০ সর্বনিম্ন ক্যাশ-আউট (০% ফি)' : '৳50 MINIMUM PAYOUT (0% CLIPPER FEE)'}</span>
          <span className="text-rose-600">✦</span>
          <span>{lang === 'bn' ? '১০% প্ল্যাটফর্ম কিউরেশন ফি' : '10% PLATFORM CURATION FEE'}</span>
          <span className="text-rose-600">✦</span>
          <span>{lang === 'bn' ? 'শতভাগ মানুষের দ্বারা ভিউ যাচাই' : 'HUMAN-AUDITED REAL VIEWS'}</span>
          <span className="text-rose-600">✦</span>
          <span>{lang === 'bn' ? 'অফিসিয়াল হোয়াটসঅ্যাপ কমিউনিটি' : 'OFFICIAL WHATSAPP COMMUNITY'}</span>
          <span className="text-rose-600">✦</span>
          <span>{lang === 'bn' ? '৳ ১,০০০ মাইক্রো-ক্যাম্পেইন (৩ দিন)' : '৳1,000 MICRO-CAMPAIGNS (3 DAYS)'}</span>
          <span className="text-rose-600">✦</span>
          <span>{lang === 'bn' ? '৳ ৫০ সর্বনিম্ন ক্যাশ-আউট (০% ফি)' : '৳50 MINIMUM PAYOUT (0% CLIPPER FEE)'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-white shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] shrink-0">
                <PlaySquare className="w-4 h-4 fill-white text-rose-600" />
              </div>
              <span className="font-['Unbounded'] font-black text-xl tracking-tight text-zinc-950 dark:text-white">
                Clip<span className="text-rose-600">Cart</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed font-['Space_Grotesk']">
              {t.footer.about}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <WhatsAppPendingBadge />
              <a
                href="https://wa.me/8801337142248?text=Hi%20ClipCart%2C%20I%20want%20to%20launch%20a%20campaign"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all shrink-0"
              >
                <span>Brand WhatsApp Desk</span>
                <ArrowRight className="w-3 h-3" />
              </a>
              <a
                href="https://www.facebook.com/clipcartbd1"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow ClipCart on Facebook"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#1877F2] text-white border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all shrink-0"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/clipcartbd"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow ClipCart on Instagram"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all shrink-0"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.youtube.com/@clipcartbd"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow ClipCart on YouTube"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FF0000] text-white border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all shrink-0"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div className="space-y-3">
            <h4 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              {t.footer.marketplaceTitle}
            </h4>
            <ul className="space-y-2 text-xs font-semibold font-['Space_Grotesk'] text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/campaigns" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  {t.footer.activeCampaigns}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  {t.footer.howWorks}
                </Link>
              </li>
              <li>
                <Link href="/for-clippers" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  {t.footer.clipperProgram}
                </Link>
              </li>
              <li>
                <Link href="/for-clients" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  {t.footer.brandIntake}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  {t.footer.faqLink}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operations & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-['Unbounded'] uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              {t.footer.safetyTitle}
            </h4>
            <ul className="space-y-2.5 text-xs font-['Space_Grotesk']">
              <li className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                <div className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-zinc-950 dark:border-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <span>{t.footer.ledgerPoint}</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                <div className="w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950/60 border border-zinc-950 dark:border-rose-800 flex items-center justify-center shrink-0">
                  <Banknote className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
                </div>
                <span>৳50 Min Cashout • bKash</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                <div className="w-5 h-5 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-zinc-950 dark:border-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                </div>
                <span>{t.footer.moderationPoint}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-zinc-950/10 dark:border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-400 text-center sm:text-left font-['Space_Grotesk']">
          <p>© {new Date().getFullYear()} ClipCart Ltd. {t.footer.rights}</p>
          <p className="font-['JetBrains_Mono'] text-zinc-500 dark:text-zinc-400 font-medium">
            {t.footer.zeroBotsNotice}
          </p>
        </div>
      </div>
    </footer>
  );
}

