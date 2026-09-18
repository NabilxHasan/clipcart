'use client';

import React, { useState, useEffect } from 'react';
import { Banknote, ShieldCheck, Plus, AlertCircle, CheckCircle2, Lock, ArrowDownRight } from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { WithdrawalRequest, PaymentMethod } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';

export default function ClipperWithdrawalsPage() {
  const [financials, setFinancials] = useState<{
    availableBalance: number;
    withdrawals: WithdrawalRequest[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [amount, setAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BKASH');
  const [paymentIdentifier, setPaymentIdentifier] = useState('01911223344');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentUserId = 'usr-clipper-01';

  const loadData = async () => {
    const fin = await ClipBDRepository.getClipperFinancials(currentUserId);
    setFinancials({
      availableBalance: fin.availableBalance,
      withdrawals: fin.withdrawals,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    if (paymentMethod === 'NAGAD') {
      setError('Nagad is currently not available. Please select bKash or Bank Account.');
      setSubmitting(false);
      return;
    }

    try {
      await ClipBDRepository.requestWithdrawal({
        userId: currentUserId,
        amount: Number(amount),
        paymentMethod,
        paymentIdentifier,
      });

      setSuccessMsg(`Withdrawal request of ৳${amount} submitted! Funds have been locked in your ledger.`);
      setShowModal(false);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !financials) {
    return <div className="neo-box p-12 text-center text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">Loading withdrawals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white text-[10px]">Direct Payouts</span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px]">0% Clipper Fee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Withdrawals & Cashout
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Fast disbursements processed directly to your bKash, Nagad, or Bank account.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowModal(true); setError(null); }}
          disabled={financials.availableBalance < 50}
          className="neo-btn neo-btn-primary px-5 py-2.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Request Payout</span>
        </button>
      </div>

      {successMsg && (
        <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-zinc-950 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2.5 shadow-[2px_2px_0px_#09090b]">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Available Balance Box */}
      <div className="neo-box p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5 font-mono">
          <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400 font-bold block">Available For Cashout</span>
          <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-['Unbounded']">৳{financials.availableBalance.toLocaleString()}</span>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 block font-sans font-medium">
            Minimum withdrawal: ৳50 BDT • 0% service fee for clippers • Timeline: 24–48 hours
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/80 p-3.5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 max-w-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[11px] leading-relaxed">Balance is derived from verified ledger credits minus locked withdrawals. 0% fee deducted.</span>
        </div>
      </div>

      {/* Modal / Withdrawal Form */}
      {showModal && (
        <div className="neo-box-lg p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
            <div>
              <h2 className="text-base font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">New Withdrawal Request</h2>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Funds are immediately locked from available balance to prevent double-spending.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-bold"
            >
              ✕ Cancel
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border-2 border-zinc-950 dark:border-rose-800 text-rose-950 dark:text-rose-300 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleWithdrawalRequest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">Withdrawal Amount (৳ BDT)</label>
                <input
                  type="number"
                  min={50}
                  max={financials.availableBalance}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[2px_2px_0px_#09090b]"
                />
                <span className="text-[10px] text-zinc-500 font-mono block">
                  Min: ৳50 • Max: ৳{financials.availableBalance.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">Disbursement Channel</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-white font-mono font-bold text-xs focus:outline-none shadow-[2px_2px_0px_#09090b]"
                >
                  <option value="BKASH">bKash</option>
                  <option value="NAGAD" disabled>Nagad (Currently Not Available)</option>
                  <option value="BANK">Bank Account</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">
                  {paymentMethod === 'BANK' ? 'Bank Account Details' : 'Mobile Number'}
                </label>
                <input
                  type="text"
                  required
                  value={paymentIdentifier}
                  onChange={(e) => setPaymentIdentifier(e.target.value)}
                  placeholder={paymentMethod === 'BANK' ? 'Bank, Branch, Account No.' : '019XXXXXXXX'}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[2px_2px_0px_#09090b]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="neo-btn neo-btn-white px-4 py-2 text-xs"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="neo-btn neo-btn-primary px-5 py-2 text-xs"
              >
                {submitting ? 'Locking Ledger...' : 'Confirm & Request Payout'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Ledger Table */}
      <div className="neo-box p-6 space-y-4">
        <h2 className="text-lg font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">Withdrawal History & TrxID Audit</h2>
        {financials.withdrawals.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            No withdrawal requests made yet. Minimum cashout is ৳50.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-zinc-950 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Channel</th>
                  <th className="pb-3 font-bold">Destination</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Transaction Ref / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium">
                {financials.withdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="py-3.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                      {new Date(w.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 font-mono font-black text-zinc-950 dark:text-white text-sm">
                      ৳{w.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-950 dark:border-zinc-700 font-bold">
                        {w.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                      {w.paymentIdentifier.length > 6
                        ? w.paymentIdentifier.slice(-4).padStart(w.paymentIdentifier.length, '*')
                        : w.paymentIdentifier}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={w.status} size="sm" />
                    </td>
                    <td className="py-3.5 text-xs">
                      {w.transactionReference ? (
                        <span className="font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-950 dark:border-emerald-800">
                          TrxID: {w.transactionReference}
                        </span>
                      ) : (
                        <span className="text-zinc-500 font-mono text-[11px]">{w.adminNote || 'Processing'}</span>
                      )}
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
