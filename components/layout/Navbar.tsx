'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PlaySquare, Shield, User, ArrowRight, MessageCircle, ChevronRight } from 'lucide-react';
import { WhatsAppPendingBadge } from '../shared/WhatsAppPendingBadge';
import { LanguageToggle } from '../shared/LanguageToggle';
import { ThemeToggle } from '../shared/ThemeToggle';
import { useLanguage } from '../../lib/i18n/context';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: '/campaigns', label: t.nav.campaigns },
    { href: '/how-it-works', label: t.nav.howItWorks },
    { href: '/for-clippers', label: t.nav.forClippers },
    { href: '/for-clients', label: t.nav.forBrands },
    { href: '/faq', label: t.nav.faq },
  ];

  // Official WhatsApp Business for Brands (+8801337142248)
  const whatsappBrandLaunchUrl = 'https://wa.me/8801337142248?text=' + encodeURIComponent(
    'Hi ClipCart, I am a brand/creator looking to launch a short-form video campaign in Bangladesh.'
  );

  return (
    <header className="sticky top-2 sm:top-3 z-50 px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto w-full">
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-[2.5px] border-zinc-950 dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0px_#09090b] dark:shadow-[4px_4px_0px_#000000] px-3 sm:px-4 py-2 transition-all">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* 1. Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2 group py-0.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-600 border-2 border-zinc-950 flex items-center justify-center text-white shadow-[2px_2px_0px_#09090b] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[3px_3px_0px_#09090b] transition-all shrink-0">
                <PlaySquare className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-rose-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Unbounded'] font-black text-sm sm:text-base tracking-tight text-zinc-950 dark:text-white leading-none">
                  Clip<span className="text-rose-600">Cart</span>
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase font-['JetBrains_Mono'] font-bold tracking-wider text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5">
                  {t.nav.agencyTag}
                </span>
              </div>
            </Link>
          </div>

          {/* 2. Desktop Navigation Links (shown on xl screens where plenty of space is available) */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] font-bold'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Desktop Actions (Always prioritizes Launch Campaign and Controls) */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Clipper Dashboard Button */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#09090b] transition-all whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="hidden lg:inline">{t.nav.dashboard}</span>
            </Link>

            {/* Brand Campaign Button -> WhatsApp Business direct redirect (Never overflows!) */}
            <a
              href={whatsappBrandLaunchUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Only admins create campaigns. Connect directly on WhatsApp Business to launch!"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 shadow-[2.5px_2.5px_0px_#09090b] dark:shadow-[2.5px_2.5px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#09090b] active:translate-x-[1px] active:translate-y-[1px] transition-all whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{t.nav.launchCampaign}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </a>

            {/* Hamburger trigger for medium screens (< xl) */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] text-zinc-900 dark:text-zinc-100 flex items-center justify-center active:scale-95 transition-all"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 h-4 text-rose-600" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* 4. Mobile Controls (< md) */}
          <div className="flex md:hidden items-center gap-1.5">
            <ThemeToggle />
            <LanguageToggle />

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] text-zinc-900 dark:text-zinc-100 flex items-center justify-center active:scale-95 transition-all"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 h-4 text-rose-600" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile & Tablet Drawer (< xl) */}
      {isOpen && (
        <div className="xl:hidden mt-2 border-[2.5px] border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl p-4 space-y-4 shadow-[6px_6px_0px_#09090b] dark:shadow-[6px_6px_0px_#000000] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Full-width Language Switcher in Drawer */}
          <div className="space-y-1">
            <span className="text-[11px] font-['JetBrains_Mono'] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
              {t.nav.selectLanguage}
            </span>
            <LanguageToggle variant="full" />
          </div>

          {/* WhatsApp Community Direct Link for Mobile */}
          <div className="pt-1">
            <a
              href="https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 rounded-xl bg-[#25D366] text-white border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] flex items-center justify-center gap-2 text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Join Clipper WhatsApp Community</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5 pt-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`w-full h-11 px-3.5 rounded-xl flex items-center justify-between text-sm font-bold border-2 transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                      : 'text-zinc-800 dark:text-zinc-200 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </Link>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="pt-2 border-t-2 border-zinc-950/10 dark:border-zinc-800 space-y-2">
            {/* Launch Campaign on WhatsApp */}
            <a
              href={whatsappBrandLaunchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full h-11 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-500 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.nav.launchCampaign} (WhatsApp)</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full h-11 rounded-xl text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-rose-600" />
              <span>{t.nav.clipperWorkspace}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

