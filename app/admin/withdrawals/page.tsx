'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Check, X, ShieldCheck, Banknote, AlertCircle, Smartphone, Sparkles } from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { WithdrawalRequest } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';

export default function AdminWithdrawalsQueue() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState('REQUESTED');
  const [loading, setLoading] = useState(true);

  // Active Payout Action
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transactionReference, setTransactionReference] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const reviewerId = 'usr-admin-01';

  const loadData = async () => {
    const list = await ClipBDRepository.getWithdrawalRequests(filterStatus);
    setWithdrawals(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const handleMarkPaid = async (withdrawalId: string) => {
    if (!transactionReference.trim()) {
      alert('A valid Transaction Reference / TrxID is required before marking as PAID.');
      return;
    }

    setProcessing(true);
    setFeedback(null);

    try {
      await ClipBDRepository.markWithdrawalPaid({
        withdrawalId,
        reviewerId,
        transactionReference,
        adminNote,
      });

      setFeedback(`Withdrawal marked as PAID. TrxID: ${transactionReference}`);
      setSelectedId(null);
      setTransactionReference('');
      setAdminNote('');
      await loadData();
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (withdrawalId: string) => {
    const reason = prompt('Please enter a rejection reason (locked funds will be refunded to clipper):');
    if (!reason) return;

    setProcessing(true);
    setFeedback(null);

    try {
      await ClipBDRepository.rejectWithdrawal({
        withdrawalId,
        reviewerId,
        adminNote: reason,
      });

      setFeedback('Withdrawal rejected. Funds have been credited back to clipper available balance.');
      await loadData();
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Treasury Disbursal
            </span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-emerald-600" />
              bKash / Nagad Manual Payouts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Withdrawals & Disbursal Queue
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Verify payment identifier, send money via bKash/Nagad/Bank, and attach the official TrxID.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 font-mono text-xs shrink-0">
          {['REQUESTED', 'PAID', 'REJECTED', 'ALL'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold border-2 transition-all ${
                filterStatus === st
                  ? 'bg-rose-600 text-white border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-950 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold font-mono">
          {feedback}
        </div>
      )}

      {loading ? (
        <div className="neo-box p-12 text-center font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
          Loading payout queue...
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="neo-box p-12 text-center text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
          No withdrawals under this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map(w => {
            const isProcessing = selectedId === w.id;
            return (
              <div
                key={w.id}
                className="neo-box p-6 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 font-bold">
                      REQUEST ID: {w.id}
                    </span>
                    <h2 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                      {w.clipperName} <span className="font-mono text-xs font-normal text-zinc-500 dark:text-zinc-400">({w.clipperEmail})</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-lg">
                      ৳{w.amount.toLocaleString()}
                    </span>
                    <StatusBadge status={w.status} size="sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl border-2 border-zinc-950 dark:border-zinc-700">
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase font-bold">Payout Channel</span>
                    <span className="font-black text-zinc-950 dark:text-white text-sm">{w.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase font-bold">Target Account / Phone</span>
                    <span className="font-black text-rose-600 dark:text-rose-400 text-sm select-all">{w.paymentIdentifier}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase font-bold">Requested Timestamp</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold">{new Date(w.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {w.transactionReference && (
                  <div className="neo-box p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 font-mono text-emerald-950 dark:text-emerald-200 text-xs font-bold">
                    Verified Transaction TrxID: <strong className="select-all underline">{w.transactionReference}</strong>
                    {w.adminNote && <span className="text-zinc-600 dark:text-zinc-400 block font-sans font-normal mt-1">{w.adminNote}</span>}
                  </div>
                )}

                {w.status === 'REQUESTED' && (
                  <div className="pt-3 border-t-2 border-zinc-950 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                      Step 1: Open your merchant bKash/Nagad app and send <strong>৳{w.amount.toLocaleString()}</strong> to <strong>{w.paymentIdentifier}</strong>.
                    </div>

                    {!isProcessing ? (
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleReject(w.id)}
                          className="neo-btn bg-rose-100 hover:bg-rose-200 text-rose-950 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-200 border-rose-950 px-3.5 py-1.5 text-xs font-bold"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedId(w.id); setTransactionReference(''); }}
                          className="neo-btn bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold"
                        >
                          Mark as Paid
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          required
                          placeholder="Enter TrxID (e.g. BK928410291)"
                          value={transactionReference}
                          onChange={(e) => setTransactionReference(e.target.value)}
                          className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
                        />
                        <button
                          type="button"
                          disabled={processing}
                          onClick={() => handleMarkPaid(w.id)}
                          className="neo-btn bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold whitespace-nowrap"
                        >
                          Confirm Paid
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedId(null)}
                          className="neo-btn neo-btn-white px-3 py-2 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
