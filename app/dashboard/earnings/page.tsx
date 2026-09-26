'use client';

import React, { useState, useEffect } from 'react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { WalletTransaction } from '../../../lib/types/database';
import { useRouter } from 'next/navigation';
import { getActiveUser } from '../../../lib/auth/session';
import { useLanguage } from '../../../lib/i18n/context';

export default function ClipperEarningsPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [financials, setFinancials] = useState<{
    availableBalance: number;
    totalApprovedEarnings: number;
    transactions: WalletTransaction[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getActiveUser();
    if (!user) {
      router.push('/login');
      return;
    }

    async function load() {
      const data = await ClipBDRepository.getClipperFinancials(user!.id);
      setFinancials({
        availableBalance: data.availableBalance,
        totalApprovedEarnings: data.totalApprovedEarnings,
        transactions: data.transactions,
      });
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading || !financials) {
    return <div className="neo-box p-12 text-center text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">{t.dashboardEarnings.loading}</div>;
  }

  const txTypeLabels: Record<'en' | 'bn', Record<string, string>> = {
    en: {
      CREDIT_EARNING: 'CREDIT EARNING',
      DEBIT_WITHDRAWAL_LOCK: 'WITHDRAWAL LOCK',
      DEBIT_WITHDRAWAL_SETTLED: 'WITHDRAWAL PAID',
      ADJUSTMENT_CREDIT: 'ADJUSTMENT CREDIT',
      ADJUSTMENT_DEBIT: 'ADJUSTMENT DEBIT',
    },
    bn: {
      CREDIT_EARNING: 'ক্লিপিং আয় জমা',
      DEBIT_WITHDRAWAL_LOCK: 'উত্তোলন লক',
      DEBIT_WITHDRAWAL_SETTLED: 'উত্তোলন পরিশোধিত',
      ADJUSTMENT_CREDIT: 'সমন্বয় জমা',
      ADJUSTMENT_DEBIT: 'সমন্বয় ডেবিট',
    },
  };

  return (
    <div className="space-y-6">
      <div className="neo-box-lg p-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="neo-sticker bg-zinc-950 text-white text-[10px]">{t.dashboardEarnings.tagAudited}</span>
          <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px]">{t.dashboardEarnings.tagDoubleEntry}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
          {t.dashboardEarnings.title}
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          {t.dashboardEarnings.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold block">{t.dashboardEarnings.totalApproved}</span>
          <span className="text-3xl font-black text-zinc-950 dark:text-white font-['Unbounded'] bn-amount">
            ৳{financials.totalApprovedEarnings.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
          </span>
        </div>
        <div className="neo-box p-5 space-y-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#09090b] transition-all">
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold block">{t.dashboardEarnings.currentNet}</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-['Unbounded'] bn-amount">
            ৳{financials.availableBalance.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
          </span>
        </div>
      </div>

      <div className="neo-box p-6 space-y-4">
        <h2 className="text-lg font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">{t.dashboardEarnings.historyTitle}</h2>
        {financials.transactions.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">{t.dashboardEarnings.noTransactions}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-zinc-950 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="pb-3 font-bold">{t.dashboardEarnings.thTimestamp}</th>
                  <th className="pb-3 font-bold">{t.dashboardEarnings.thType}</th>
                  <th className="pb-3 font-bold">{t.dashboardEarnings.thDescription}</th>
                  <th className="pb-3 text-right font-bold">{t.dashboardEarnings.thAmount}</th>
                  <th className="pb-3 text-right font-bold">{t.dashboardEarnings.thBalanceAfter}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-zinc-800 dark:text-zinc-200 font-medium">
                {financials.transactions.map(tx => {
                  const isCredit = tx.type === 'CREDIT_EARNING' || tx.type === 'ADJUSTMENT_CREDIT';
                  return (
                    <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="py-3.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                        {new Date(tx.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                      </td>
                      <td className="py-3.5 text-[10px]">
                        <span className={`px-2.5 py-1 rounded-md border font-bold ${
                          isCredit
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                            : 'bg-rose-100 text-rose-950 border-rose-950 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700'
                        }`}>
                          {txTypeLabels[lang]?.[tx.type] || tx.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 font-sans text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                        {tx.description}
                      </td>
                      <td className={`py-3.5 text-right font-black text-sm bn-amount ${
                        isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {isCredit ? `+৳${tx.amount.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}` : `-৳${tx.amount.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}`}
                      </td>
                      <td className="py-3.5 text-right font-bold text-zinc-950 dark:text-zinc-300 bn-amount">
                        ৳{tx.balanceAfter.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
