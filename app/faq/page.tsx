'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';

export default function FAQPage() {
  const { t } = useLanguage();
  const fp = t.faqPage;

  const faqs = [
    { q: fp.q1, a: fp.a1 },
    { q: fp.q2, a: fp.a2 },
    { q: fp.q3, a: fp.a3 },
    { q: fp.q4, a: fp.a4 },
    { q: fp.q5, a: fp.a5 },
    { q: fp.q6, a: fp.a6 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 pb-4">
        <div className="flex items-center gap-2">
          <span className="neo-sticker bg-zinc-900 text-white">
            {fp.tag}
          </span>
          <span className="neo-sticker bg-rose-100 text-rose-900 border-rose-950">
            Rules & Payouts
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
          {fp.title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
          {fp.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="neo-box p-6 space-y-2.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] dark:hover:shadow-[5px_5px_0px_#000000] transition-all">
            <h2 className="text-base font-['Unbounded'] font-bold text-zinc-950 dark:text-white flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{faq.q}</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7 font-medium">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="neo-box p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{fp.stillQuestions}</span>
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="neo-btn neo-btn-primary px-5 py-2.5 text-xs"
          >
            <span>{fp.contactLink}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn neo-btn-whatsapp px-4 py-2.5 text-xs"
          >
            <span>Ask in WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
