import React from 'react';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const norm = status.toUpperCase();

  let colors = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-950 dark:border-zinc-700';
  let dotColor = 'bg-zinc-600 dark:bg-zinc-400';
  const label = status.replace(/_/g, ' ');

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
