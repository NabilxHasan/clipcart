import React from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Phone, ArrowRight, ExternalLink } from 'lucide-react';
import { WhatsAppPendingBadge } from '../../components/shared/WhatsAppPendingBadge';

export default function ContactPage() {
  return (
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

        {/* 3. Facebook Page */}
        <div className="neo-box p-6 space-y-3.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] dark:hover:shadow-[5px_5px_0px_#000000] transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1877F2]/15 border-2 border-zinc-950 dark:border-zinc-700 text-[#1877F2] flex items-center justify-center shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block font-mono font-bold text-[10px] uppercase">
                OFFICIAL FACEBOOK PAGE
              </span>
              <span className="text-sm font-bold font-mono text-zinc-950 dark:text-white">
                @clipcartbd1
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Official updates, clipper leaderboards, platform milestones, and FutureMaker journey news.
            </p>
          </div>
          <a
            href="https://www.facebook.com/clipcartbd1"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn bg-[#1877F2] hover:bg-[#166fe5] text-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <span>Follow on Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4. Instagram Profile */}
        <div className="neo-box p-6 space-y-3.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] dark:hover:shadow-[5px_5px_0px_#000000] transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#833ab4]/20 via-[#fd1d1d]/20 to-[#fcb045]/20 border-2 border-zinc-950 dark:border-zinc-700 text-[#fd1d1d] flex items-center justify-center shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block font-mono font-bold text-[10px] uppercase">
                INSTAGRAM
              </span>
              <span className="text-sm font-bold font-mono text-zinc-950 dark:text-white">
                @clipcartbd
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Showcases of viral clips, editor tips, and behind-the-scenes creator distribution stories.
            </p>
          </div>
          <a
            href="https://www.instagram.com/clipcartbd"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <span>Follow on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 5. Official YouTube Channel */}
        <div className="neo-box p-6 space-y-3.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#09090b] dark:hover:shadow-[5px_5px_0px_#000000] transition-all flex flex-col justify-between sm:col-span-2">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 border-2 border-zinc-950 dark:border-zinc-700 text-[#FF0000] flex items-center justify-center shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block font-mono font-bold text-[10px] uppercase">
                OFFICIAL YOUTUBE CHANNEL
              </span>
              <span className="text-sm font-bold font-mono text-zinc-950 dark:text-white">
                @clipcartbd
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Official YouTube video releases, clipping masterclasses, creator interviews, and featured short-form showcases.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@clipcartbd"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn bg-[#FF0000] hover:bg-[#e60000] text-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <span>Subscribe on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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
  );
}
