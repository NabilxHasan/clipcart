'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Shield, Search, Sparkles, Activity } from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { AuditLog } from '../../../lib/types/database';

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const data = await ClipBDRepository.getAuditLogs();
      setLogs(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.targetType.toLowerCase().includes(search.toLowerCase()) ||
    (l.actorName && l.actorName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Compliance Engine
            </span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              Immutable Operations Trace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            System Compliance & Audit Trail
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Immutable log of all administrative interventions, ledger locks, view approvals, and payment verifications.
          </p>
        </div>

        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
          <input
            type="text"
            placeholder="Filter audit actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
          />
        </div>
      </div>

      <div className="neo-box overflow-hidden">
        <div className="p-5 border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-[#181920] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-600" />
            <span className="font-['Unbounded'] font-bold text-xs uppercase text-zinc-950 dark:text-white">
              Audit Entries ({filtered.length})
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
            Chronological Order
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
            Loading audit trail...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
            No matching audit records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase font-bold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Target Reference</th>
                  <th className="py-3 px-4">Metadata Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#14151a] font-mono text-zinc-700 dark:text-zinc-300">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors">
                    <td className="py-3.5 px-4 text-[11px] text-zinc-500 dark:text-zinc-400 font-bold whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs text-zinc-950 dark:text-white font-bold whitespace-nowrap">
                      {l.actorName || 'System'}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 dark:text-rose-400 font-bold text-[11px] whitespace-nowrap">
                      {l.action}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                      {l.targetType}: {l.targetId}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-zinc-700 dark:text-zinc-300 max-w-sm truncate">
                      <pre className="inline text-[10px] text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700">
                        {JSON.stringify(l.metadata)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
