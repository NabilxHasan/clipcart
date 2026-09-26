'use client';

import React from 'react';
import { useLanguage } from '../../lib/i18n/context';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  label?: string;
}

const statusLabels: Record<'en' | 'bn', Record<string, string>> = {
  en: {
    ACTIVE: 'ACTIVE',
    APPROVED: 'APPROVED',
    PAID: 'PAID',
    COMPLETED: 'COMPLETED',
    PENDING_PAYMENT: 'PENDING PAYMENT',
    PENDING_HUMAN_REVIEW: 'PENDING REVIEW',
    PENDING_AI_REVIEW: 'AI SCREENING',
    PENDING: 'PENDING',
    REQUESTED: 'REQUESTED',
    UNDER_REVIEW: 'UNDER REVIEW',
    PROCESSING: 'PROCESSING',
    SCHEDULED: 'SCHEDULED',
    CONTACTED: 'CONTACTED',
    NEGOTIATING: 'NEGOTIATING',
    NEW: 'NEW',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
    FLAGGED: 'FLAGGED',
    SUSPENDED: 'SUSPENDED',
    BANNED: 'BANNED',
  },
  bn: {
    ACTIVE: 'সক্রিয়',
    APPROVED: 'অনুমোদিত',
    PAID: 'পরিশোধিত',
    COMPLETED: 'সম্পন্ন',
    PENDING_PAYMENT: 'পেমেন্ট প্রক্রিয়াধীন',
    PENDING_HUMAN_REVIEW: 'যাচাই চলছে',
    PENDING_AI_REVIEW: 'AI স্ক্রিনিং',
    PENDING: 'অপেক্ষমাণ',
    REQUESTED: 'রিকোয়েস্টেড',
    UNDER_REVIEW: 'যাচাই চলছে',
    PROCESSING: 'প্রক্রিয়াধীন',
    SCHEDULED: 'নির্ধারিত',
    CONTACTED: 'যোগাযোগ করা হয়েছে',
    NEGOTIATING: 'আলোচনাধীন',
    NEW: 'নতুন',
    REJECTED: 'বাতিল',
    CANCELLED: 'বাতিল',
    FLAGGED: 'সন্দেহজনক',
    SUSPENDED: 'স্থগিত',
    BANNED: 'ব্যানড',
  },
};

export function StatusBadge({ status, size = 'md', label: customLabel }: StatusBadgeProps) {
  let lang: 'en' | 'bn' = 'bn';
  try {
    const langContext = useLanguage();
    if (langContext?.lang) {
      lang = langContext.lang;
    }
  } catch {
    // Default to bn
  }

  const norm = status.toUpperCase();

  let colors = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-950 dark:border-zinc-700';
  let dotColor = 'bg-zinc-600 dark:bg-zinc-400';
  const label = customLabel || statusLabels[lang]?.[norm] || status.replace(/_/g, ' ');

  // Success / Active / Approved / Paid
  if (['ACTIVE', 'APPROVED', 'PAID', 'COMPLETED'].includes(norm)) {
    colors = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border-zinc-950 dark:border-zinc-700';
    dotColor = 'bg-emerald-600 dark:bg-emerald-400';
  }
  // Pending / Review / Negotiating / Scheduled
  else if (['PENDING_PAYMENT', 'PENDING_HUMAN_REVIEW', 'PENDING_AI_REVIEW', 'REQUESTED', 'UNDER_REVIEW', 'PROCESSING', 'SCHEDULED', 'CONTACTED', 'NEGOTIATING', 'NEW'].includes(norm)) {
    colors = 'bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border-zinc-950 dark:border-zinc-700';
    dotColor = 'bg-amber-600 dark:bg-amber-400';
  }
  // Danger / Rejected / Flagged / Cancelled
  else if (['REJECTED', 'CANCELLED', 'FLAGGED', 'SUSPENDED', 'BANNED'].includes(norm)) {
    colors = 'bg-rose-100 dark:bg-rose-950/60 text-rose-950 dark:text-rose-300 border-zinc-950 dark:border-zinc-700';
    dotColor = 'bg-rose-600 dark:bg-rose-400';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-bold rounded-full border-2 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] ${colors} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
