'use client';

import React from 'react';
import { Bell, CheckCircle2, CreditCard, Sparkles, MessageSquare } from 'lucide-react';
import { mockStore } from '../../../lib/db/mock-store';

export default function ClipperNotificationsPage() {
  const notifications = mockStore.notifications;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Activity Feed
            </span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Live Ledger Alerts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Notifications & Alerts
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Real-time updates regarding submission approvals, view audits, and payout disbursements.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className="neo-box p-4.5 flex items-start gap-3.5 text-xs hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xs font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                  {notif.title}
                </h2>
                <span className="font-mono text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                {notif.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
