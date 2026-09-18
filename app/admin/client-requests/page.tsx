'use client';

import React, { useState, useEffect } from 'react';
import { Inbox, MessageSquare, Phone, Mail, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { ClientRequest, ClientRequestStatus } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';

export default function AdminClientRequestsPage() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const actorId = 'usr-admin-01';

  const loadData = async () => {
    const list = await ClipBDRepository.getClientRequests();
    setRequests(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ClientRequestStatus) => {
    try {
      await ClipBDRepository.updateClientRequestStatus(id, newStatus, undefined, actorId);
      setFeedback(`Status updated to ${newStatus}`);
      await loadData();
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Brand CRM
            </span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              WhatsApp Direct Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Brand Inquiries & Leads
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Client acquisition CRM pipeline. Connect with founders and creators on WhatsApp to finalize campaign terms.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold font-mono">
          {feedback}
        </div>
      )}

      {loading ? (
        <div className="neo-box p-12 text-center font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
          Loading client requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="neo-box p-12 text-center text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
          No client inquiries received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => {
            const cleanPhone = req.whatsappNumber.replace(/[^0-9]/g, '');
            const waUrl = cleanPhone
              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hi ${req.name}, this is ClipCart regarding your campaign request for "${req.companyCreator}".`
                )}`
              : null;

            return (
              <div
                key={req.id}
                className="neo-box p-6 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 font-bold">
                      LEAD ID: {req.id}
                    </span>
                    <h2 className="text-base font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                      {req.name} — <span className="text-rose-600 dark:text-rose-400">{req.companyCreator}</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                      Est. ৳{req.estimatedBudget.toLocaleString()}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono bg-zinc-50 dark:bg-zinc-800/60 p-3.5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                    <span className="font-bold text-zinc-950 dark:text-white select-all">{req.whatsappNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                    <span className="font-bold text-zinc-950 dark:text-white truncate">{req.email}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold">Duration: </span>
                    <span className="text-zinc-950 dark:text-white font-black">{req.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
                    <span className="text-zinc-950 dark:text-white font-mono uppercase text-[10px] font-bold block mb-1">
                      Campaign Objective:
                    </span>
                    <p className="bg-zinc-100 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700">
                      {req.campaignObjective}
                    </p>
                  </div>

                  {req.sourceUrl && (
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400 font-bold">Source Link:</span>
                      <a
                        href={req.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-600 dark:text-rose-400 font-bold hover:underline inline-flex items-center gap-1 truncate max-w-sm"
                      >
                        <span>{req.sourceUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}

                  {req.requirements && (
                    <p className="text-zinc-500 dark:text-zinc-400 italic">
                      Special requirements: {req.requirements}
                    </p>
                  )}
                </div>

                {/* Pipeline Controls */}
                <div className="pt-3 border-t-2 border-zinc-950 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold">Move Pipeline Stage:</span>
                    <select
                      value={req.status}
                      onChange={(e) => handleUpdateStatus(req.id, e.target.value as ClientRequestStatus)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="NEGOTIATING">NEGOTIATING</option>
                      <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white border-2 border-zinc-950 shadow-[2px_2px_0px_#09090b] transition-all"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
