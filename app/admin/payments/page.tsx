'use client';

import React from 'react';
import { Banknote, ShieldCheck, Sparkles } from 'lucide-react';
import { mockStore } from '../../../lib/db/mock-store';

export default function AdminPaymentsPage() {
  const payments = mockStore.paymentRecords;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Financial Audit
            </span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Pre-Funded Escrow
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Client Campaign Deposits
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Auditable records of bank wire and merchant deposits received from brands before campaign activation.
          </p>
        </div>
      </div>

      <div className="neo-box overflow-hidden">
        <div className="p-5 border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-[#181920] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-600" />
            <span className="font-['Unbounded'] font-bold text-xs uppercase text-zinc-950 dark:text-white">
              Verified Deposits ({payments.length})
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
            Immutable Double-Entry Trace
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Campaign ID</th>
                <th className="py-3 px-4 font-mono">Amount</th>
                <th className="py-3 px-4 font-mono">Channel</th>
                <th className="py-3 px-4 font-mono">Transaction Reference</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#14151a] font-mono">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors">
                  <td className="py-3 px-4 text-[11px] text-zinc-500 dark:text-zinc-400 font-bold whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-zinc-950 dark:text-white font-bold whitespace-nowrap">
                    {p.campaignId}
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                    ৳{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-zinc-700 dark:text-zinc-300 font-bold whitespace-nowrap">
                    {p.paymentMethod}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-zinc-950 dark:text-white select-all font-bold whitespace-nowrap">
                    {p.transactionReference}
                  </td>
                  <td className="py-3 px-4 font-sans text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    {p.adminNote || 'Verified deposit'}
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
