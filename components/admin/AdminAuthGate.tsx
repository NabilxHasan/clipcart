'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

const DEFAULT_MASTER_PASS = 'ClipCart@Admin2026!';

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if session is already active
    if (typeof window !== 'undefined') {
      const activeSession = sessionStorage.getItem('clipcart_admin_auth');
      setIsAuthenticated(activeSession === 'true');
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setLoading(true);
    setError(null);

    // Get configured passcode from localStorage or default
    const currentPasscode = (typeof window !== 'undefined' && localStorage.getItem('clipcart_master_passcode')) || DEFAULT_MASTER_PASS;

    if (passcode.trim() === currentPasscode) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('clipcart_admin_auth', 'true');
      }
      setIsAuthenticated(true);
      setError(null);
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setCooldown(30);
        setError('Security Lock: 3 failed attempts. Please wait 30 seconds.');
      } else {
        setError(`Invalid Master Key. ${3 - newAttempts} attempt(s) remaining.`);
      }
    }
    setLoading(false);
  };

  // While checking initial session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-zinc-500">
        Verifying security credentials...
      </div>
    );
  }

  // If locked, render Master Passcode Security Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-[4px_4px_0px_#e11d48]">
            <Shield className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="neo-sticker bg-rose-600 text-white text-[10px]">
              Restricted Operations Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
              Staff Authorization
            </h1>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            This administration console is restricted to the platform owner and authorized directors.
          </p>
        </div>

        {error && (
          <div className="neo-box p-3.5 bg-rose-50 dark:bg-rose-950/40 border-rose-950 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUnlock} className="neo-box-lg p-6 sm:p-7 space-y-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[11px] block uppercase">
                Master Security Passcode
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Owner Access Only</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                required
                disabled={cooldown > 0}
                placeholder="Enter Master Security Key..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-xs shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full py-3.5 rounded-xl font-['Unbounded'] font-bold text-xs uppercase text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-rose-600 dark:hover:bg-rose-500 border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#e11d48] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#e11d48] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{cooldown > 0 ? `Locked (${cooldown}s)` : 'Unlock Operations Desk'}</span>
          </button>

          <div className="pt-3 border-t-2 border-zinc-950/10 dark:border-zinc-800 text-center text-xs text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium underline">
              Return to Public Site →
            </Link>
          </div>
        </form>
      </div>
    );
  }

  // Authenticated state
  return <>{children}</>;
}
