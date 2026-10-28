'use client';

import React, { useState } from 'react';
import { Play, Youtube } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';

const VIDEO_ID = 'dpJJXWGXAWw';
const VIDEO_URL = `https://youtu.be/${VIDEO_ID}`;

// Homepage explainer video. Shows the thumbnail until clicked, so YouTube's player (and its trackers)
// only load for visitors who actually press play; the embed uses the privacy-enhanced nocookie domain.
export function ExplainerVideo() {
  const { lang } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const title = 'ক্লিপিং কী? Content Clipping কি এবং কিভাবে শুরু করবেন? (ClipCart.bd Full Tutorial)';

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="neo-box-lg bg-white dark:bg-[#14151a] p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-zinc-950 dark:border-zinc-700 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-['JetBrains_Mono'] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-zinc-950 dark:border-zinc-700">
              <Youtube className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ভিডিও গাইড' : 'VIDEO GUIDE'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-['Unbounded'] font-black text-zinc-950 dark:text-white">
              {lang === 'bn' ? 'ক্লিপিং কী? ভিডিওতে দেখে নিন' : 'What is clipping? Watch the walkthrough'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-['Space_Grotesk'] font-medium">
              {lang === 'bn'
                ? 'ক্লিপিং কীভাবে কাজ করে, ক্লিপার হিসেবে কীভাবে শুরু করবেন আর ClipCart-এ কীভাবে আয় করবেন — সব এক ভিডিওতে।'
                : 'How clipping works, how to start as a clipper, and how ClipCart pays out — all in one video.'}
            </p>
          </div>
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 self-start sm:self-center flex items-center gap-1.5 hover:bg-rose-600 transition-colors"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'YouTube-এ দেখুন' : 'Watch on YouTube'}</span>
          </a>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-950 shadow-[6px_6px_0px_#e11d48]">
          {playing ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 w-full h-full cursor-pointer"
              aria-label={lang === 'bn' ? 'ভিডিও চালু করুন' : 'Play video'}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                alt={title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Corner pill rather than a centered button: the thumbnail's face sits in the middle */}
              <span className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl bg-rose-600 border-[2.5px] border-zinc-950 shadow-[4px_4px_0px_#09090b] text-white font-['Unbounded'] font-black text-xs sm:text-sm group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[6px_6px_0px_#09090b] transition-all">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                <span>{lang === 'bn' ? 'ভিডিও দেখুন' : 'Play video'}</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
