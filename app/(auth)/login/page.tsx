'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlaySquare, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { mockStore } from '../../../lib/db/mock-store';
import { useLanguage } from '../../../lib/i18n/context';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your registered email or phone number.');
      setLoading(false);
      return;
    }

    // Lookup clipper
    const user = mockStore.profiles.find(
      p => (p.email?.toLowerCase() === identifier.trim().toLowerCase() || p.phoneWhatsapp?.includes(identifier.trim())) && p.role === 'CLIPPER'
    );

    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('clipcart_active_user', JSON.stringify(user));
      }
      router.push('/dashboard');
    } else {
      // Set active user session and route to dashboard
      if (typeof window !== 'undefined') {
        localStorage.setItem('clipcart_active_user', JSON.stringify({
          id: `usr-${Date.now().toString(36)}`,
          email: identifier.includes('@') ? identifier : `${identifier}@clipcart.bd`,
          fullName: 'ClipCart Creator',
          role: 'CLIPPER',
          phoneWhatsapp: identifier,
          createdAt: new Date().toISOString()
        }));
      }
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-600 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-white mx-auto shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]">
          <PlaySquare className="w-6 h-6 fill-white" />
        </div>
        <div className="space-y-1">
          <span className="neo-sticker bg-zinc-950 text-white dark:bg-zinc-800 dark:border-zinc-700 text-[10px]">
            {t.loginPage.badge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            {t.loginPage.title}
          </h1>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          {t.loginPage.subtitle}
        </p>
      </div>

      {error && (
        <div className="neo-box p-3.5 bg-rose-50 dark:bg-rose-950/40 border-rose-950 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="neo-box-lg p-6 sm:p-7 space-y-4 text-xs bg-white dark:bg-[#14151a] border-2 border-zinc-950 dark:border-zinc-700">
        <div className="space-y-1.5">
          <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">
            {t.loginPage.identifierLabel}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              required
              placeholder={t.loginPage.identifierPlaceholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-xs shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">
              {t.loginPage.passwordLabel}
            </label>
            <span className="text-[10px] text-zinc-500 font-mono">{t.loginPage.encrypted}</span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-['Unbounded'] font-bold text-xs uppercase text-white bg-rose-600 hover:bg-rose-500 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#09090b] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          <span>{loading ? t.loginPage.authenticating : t.loginPage.signInButton}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-3 border-t-2 border-zinc-950/10 dark:border-zinc-800 text-center text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          {t.loginPage.newEditor}{' '}
          <Link href="/register" className="text-rose-600 dark:text-rose-400 font-bold hover:underline">
            {t.loginPage.registerLink}
          </Link>
        </div>
      </form>
    </div>
  );
}
