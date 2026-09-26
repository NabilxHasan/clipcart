'use client';

import React from 'react';

export function CuteDoodleBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-300"
    >
      {/* 1. Geometric Cross/Plus Micro-Texture Grid - High visibility across entire canvas */}
      <div className="absolute inset-0 bg-cute-grid opacity-100" />

      {/* 2. Top-Left: Cute Scissors Cutting Along Dashed Line */}
      <div className="absolute top-16 left-3 sm:left-10 opacity-75 dark:opacity-50 transform -rotate-12 hover:rotate-0 transition-transform">
        <svg width="150" height="95" viewBox="0 0 150 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900 dark:text-rose-300">
          {/* Dashed cutting path */}
          <path d="M 5 65 Q 45 40 85 55 T 145 30" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" fill="none" opacity="0.8" />
          {/* Scissors Doodle */}
          <g transform="translate(90, 26) rotate(-25)">
            <circle cx="10" cy="12" r="6.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <circle cx="10" cy="28" r="6.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <line x1="15" y1="14" x2="40" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="15" y1="26" x2="40" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="24" cy="20" r="2.5" fill="#e11d48" />
          </g>
          {/* Cute text label */}
          <text x="8" y="86" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.9">
            ✂️ snip!
          </text>
        </svg>
      </div>

      {/* 3. Top-Right: Smiling Star Sticker Doodle */}
      <div className="absolute top-20 right-4 sm:right-14 opacity-80 dark:opacity-60 transform rotate-12">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900 dark:text-amber-300">
          {/* 4-point chunky star */}
          <path 
            d="M40 5 C40 25 48 33 70 40 C48 47 40 55 40 75 C40 55 32 47 10 40 C32 33 40 25 40 5 Z" 
            fill="#ffe4e6" 
            className="dark:fill-rose-950/80"
            stroke="currentColor" 
            strokeWidth="2.5" 
          />
          {/* Cute face eyes */}
          <circle cx="35" cy="37" r="2.5" fill="currentColor" />
          <circle cx="45" cy="37" r="2.5" fill="currentColor" />
          {/* Cute smile */}
          <path d="M36 44 Q40 48 44 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Rosy cheek dots */}
          <circle cx="31" cy="42" r="2" fill="#f43f5e" />
          <circle cx="49" cy="42" r="2" fill="#f43f5e" />
        </svg>
      </div>

      {/* 4. Mid-Left: Playful Sparkle Star Cluster */}
      <div className="absolute top-[38%] left-2 sm:left-6 opacity-75 dark:opacity-50 hidden sm:block">
        <svg width="70" height="100" viewBox="0 0 70 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-rose-600 dark:text-rose-400">
          {/* Main sparkle */}
          <path d="M30 6 Q30 26 50 26 Q30 26 30 46 Q30 26 10 26 Q30 26 30 6 Z" fill="currentColor" />
          {/* Mini secondary sparkle */}
          <path d="M52 56 Q52 66 62 66 Q52 66 52 76 Q52 66 42 66 Q52 66 52 56 Z" fill="currentColor" opacity="0.85" />
          {/* Mini dot sparkles */}
          <circle cx="18" cy="72" r="2.5" fill="currentColor" />
          <circle cx="56" cy="20" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* 5. Mid-Right: Cute Squiggle Wave & Lightning Bolt */}
      <div className="absolute top-[48%] right-2 sm:right-8 opacity-75 dark:opacity-50 hidden sm:block">
        <svg width="90" height="120" viewBox="0 0 90 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900 dark:text-rose-400">
          {/* Cute squiggly waves */}
          <path d="M10 20 Q 25 5, 40 20 T 75 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M15 32 Q 30 17, 45 32 T 80 32" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Mini lightning bolt */}
          <path d="M45 55 L28 82 L40 82 L32 108 L58 78 L45 78 Z" fill="#fbbf24" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>

      {/* 6. Lower-Left: Retro Play Badge / Video Cam Sticker */}
      <div className="absolute bottom-[28%] left-3 sm:left-8 opacity-75 dark:opacity-50 hidden lg:block">
        <svg width="90" height="75" viewBox="0 0 90 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900 dark:text-zinc-200">
          <rect x="8" y="10" width="55" height="42" rx="8" fill="#ffffff" className="dark:fill-zinc-900" stroke="currentColor" strokeWidth="2.5" />
          <polygon points="63,22 80,14 80,48 63,40" fill="#e11d48" stroke="currentColor" strokeWidth="2" />
          <circle cx="35" cy="31" r="7" fill="#e11d48" />
          <polygon points="33,28 39,31 33,34" fill="#ffffff" />
        </svg>
      </div>

      {/* 7. Bottom-Left: Cute Director Clapperboard Doodle */}
      <div className="absolute bottom-16 left-4 sm:left-12 opacity-75 dark:opacity-50 hidden md:block">
        <svg width="95" height="85" viewBox="0 0 95 85" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900 dark:text-zinc-300">
          {/* Board base */}
          <rect x="10" y="30" width="70" height="44" rx="6" fill="#f4f4f5" className="dark:fill-zinc-800" stroke="currentColor" strokeWidth="2.5" />
          {/* Top hinged bar */}
          <g transform="rotate(-8 10 27)">
            <rect x="8" y="10" width="72" height="17" rx="4" fill="#ffffff" className="dark:fill-zinc-900" stroke="currentColor" strokeWidth="2.5" />
            <path d="M22 10 L14 27 M36 10 L28 27 M50 10 L42 27 M64 10 L56 27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* Play triangle inside clapper */}
          <polygon points="42,44 42,60 55,52" fill="#e11d48" />
        </svg>
      </div>

      {/* 8. Bottom-Right: Cute "100% VIRAL" Speech Bubble Stamp */}
      <div className="absolute bottom-14 right-4 sm:right-12 opacity-85 dark:opacity-65 transform -rotate-6 hidden sm:block pointer-events-none select-none">
        <svg width="150" height="80" viewBox="0 0 150 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900 dark:text-white">
          {/* Speech bubble */}
          <rect x="6" y="6" width="138" height="48" rx="14" fill="#ffe4e6" className="dark:fill-rose-950/80" stroke="currentColor" strokeWidth="2.5" />
          <polygon points="36,54 52,54 26,72" fill="#ffe4e6" className="dark:fill-rose-950/80" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Cover inner seam between bubble and tail */}
          <path d="M37 54 L51 54" stroke="#ffe4e6" className="dark:stroke-rose-950" strokeWidth="3" />
          <text 
            x="75" 
            y="30" 
            textAnchor="middle" 
            dominantBaseline="central" 
            fontFamily="Unbounded, sans-serif" 
            fontSize="10" 
            fontWeight="900" 
            fill="#e11d48"
            letterSpacing="0.02em"
          >
            ★ 100% VIRAL!
          </text>
        </svg>
      </div>
    </div>
  );
}
