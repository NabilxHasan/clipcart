'use client';

import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { getActiveUser } from '../../lib/auth/session';
import { useLanguage } from '../../lib/i18n/context';

// Clipper changes their password (e.g. right after an admin reset). The current password is checked
// on the server; nothing is stored in the browser.
export function ChangePasswordCard() {
  const { lang } = useLanguage();
  const bn = lang === 'bn';
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    if (next.trim().length < 6) {
      setResult({ ok: false, msg: bn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'New password must be at least 6 characters.' });
      return;
    }
    if (next !== confirm) {
      setResult({ ok: false, msg: bn ? 'নতুন পাসওয়ার্ড দুটো মিলছে না।' : 'The new passwords do not match.' });
      return;
    }
    const user = getActiveUser();
    if (!user) {
      setResult({ ok: false, msg: bn ? 'আবার লগইন করুন।' : 'Please log in again.' });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: user.email, currentPassword: current, newPassword: next }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setCurrent('');
        setNext('');
        setConfirm('');
        setResult({ ok: true, msg: bn ? 'পাসওয়ার্ড পরিবর্তন হয়েছে।' : 'Password changed.' });
      } else {
        setResult({ ok: false, msg: data?.error || (bn ? 'পাসওয়ার্ড পরিবর্তন করা যায়নি।' : 'Could not change the password.') });
      }
    } catch {
      setResult({ ok: false, msg: bn ? 'নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন।' : 'Network error, please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]";

  return (
    <form onSubmit={submit} className="neo-box p-6 sm:p-8 space-y-5 text-xs">
      <div className="flex items-center gap-2 border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
        <KeyRound className="w-4 h-4 text-rose-600" />
        <h2 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white uppercase">
          {bn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change password'}
        </h2>
      </div>

      {result && (
        <div className={`neo-box p-3 text-xs font-bold flex items-center gap-2 ${result.ok ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'}`}>
          {result.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{result.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">{bn ? 'বর্তমান পাসওয়ার্ড' : 'Current password'}</label>
          <input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={input} />
        </div>
        <div className="space-y-1.5">
          <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">{bn ? 'নতুন পাসওয়ার্ড' : 'New password'}</label>
          <input type="password" required minLength={6} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={input} />
        </div>
        <div className="space-y-1.5">
          <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">{bn ? 'নতুন পাসওয়ার্ড আবার' : 'Confirm new password'}</label>
          <input type="password" required minLength={6} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={busy} className="neo-btn neo-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-50">
          <KeyRound className="w-4 h-4" />
          <span>{busy ? (bn ? 'সেভ হচ্ছে…' : 'Saving…') : (bn ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change password')}</span>
        </button>
      </div>
    </form>
  );
}
