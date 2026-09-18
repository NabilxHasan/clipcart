'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  CheckSquare, 
  CreditCard, 
  Inbox, 
  Users, 
  Banknote, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Activity
} from 'lucide-react';
import { ClipBDRepository } from '../../lib/db/repository';
import { AuditLog } from '../../lib/types/database';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<{
    activeCampaignsCount: number;
    pendingSubmissionsCount: number;
    pendingWithdrawalsCount: number;
    pendingClientRequestsCount: number;
    totalRegisteredClippers: number;
    totalActiveBudgets: number;
  } | null>(null);

  const [recentAudits, setRecentAudits] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const m = await ClipBDRepository.getAdminOverviewMetrics();
      const logs = await ClipBDRepository.getAuditLogs();
      setMetrics(m);
      setRecentAudits(logs.slice(0, 6));
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="neo-box p-12 text-center font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
        Loading operations metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Mission Control
            </span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              Live Ledger Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Operations Command Center
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Real-time control desk. Manage briefs, manual deposits, moderation, and payouts.
          </p>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono">
        <Link
          href="/admin/submissions"
          className="neo-box p-5 space-y-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold">Submissions Queue</span>
            <CheckSquare className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-['Unbounded'] block">
            {metrics.pendingSubmissionsCount}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans font-medium block">
            Requires view audit
          </span>
        </Link>

        <Link
          href="/admin/withdrawals"
          className="neo-box p-5 space-y-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold">Pending Cashouts</span>
            <CreditCard className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400 font-['Unbounded'] block">
            {metrics.pendingWithdrawalsCount}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans font-medium block">
            bKash/Nagad pending
          </span>
        </Link>

        <Link
          href="/admin/client-requests"
          className="neo-box p-5 space-y-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold">Brand Inquiries</span>
            <Inbox className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-['Unbounded'] block">
            {metrics.pendingClientRequestsCount}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans font-medium block">
            New campaign leads
          </span>
        </Link>

        <Link
          href="/admin/campaigns"
          className="neo-box p-5 space-y-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold">Active Sprints</span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-['Unbounded'] block">
            {metrics.activeCampaignsCount}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans font-medium block">
            Currently running
          </span>
        </Link>

        <div className="neo-box p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold">Active Budgets</span>
            <Banknote className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white font-['Unbounded'] block">
            ৳{metrics.totalActiveBudgets.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans font-medium block">
            Funded campaign pool
          </span>
        </div>

        <Link
          href="/admin/users"
          className="neo-box p-5 space-y-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_#000000] transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold">Registered Clippers</span>
            <Users className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </div>
          <span className="text-3xl font-black text-zinc-950 dark:text-white font-['Unbounded'] block">
            {metrics.totalRegisteredClippers}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans font-medium block">
            Vetted editors in DB
          </span>
        </Link>
      </div>

      {/* Recent Operational Audit Feed */}
      <div className="neo-box overflow-hidden">
        <div className="p-5 border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-[#181920] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span className="font-['Unbounded'] font-bold text-xs uppercase text-zinc-950 dark:text-white">
              Recent Operations & Financial Audit Feed
            </span>
          </div>
          <Link
            href="/admin/audit-log"
            className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>Full Audit Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Metadata Details</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#14151a] font-mono text-zinc-700 dark:text-zinc-300">
              {recentAudits.map(log => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors">
                  <td className="py-3 px-4 text-[11px] text-zinc-500 dark:text-zinc-400 font-bold whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-zinc-950 dark:text-white font-sans text-xs font-bold whitespace-nowrap">
                    {log.actorName}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {log.targetType} ({log.targetId})
                  </td>
                  <td className="py-3 px-4 text-[11px] text-zinc-600 dark:text-zinc-300 truncate max-w-xs font-sans">
                    <pre className="inline text-[10px] text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
                      {JSON.stringify(log.metadata)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
