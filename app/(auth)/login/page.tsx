'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlaySquare, ArrowRight, Shield, User, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('tanvir@creators.bd');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<'CLIPPER' | 'ADMIN' | 'MODERATOR'>('CLIPPER');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'CLIPPER') {
      router.push('/dashboard');
    } else {
      router.push('/admin');
    }
  };

  const switchDemo = (role: 'CLIPPER' | 'ADMIN' | 'MODERATOR', demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-600 border-2 border-zinc-950 flex items-center justify-center text-white mx-auto shadow-[3px_3px_0px_#09090b]">
          <PlaySquare className="w-6 h-6 fill-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 tracking-tight">
          Sign In to ClipCart
        </h1>
        <p className="text-xs text-zinc-600 font-medium">
          Access your clipper earnings ledger or administration queue.
        </p>
      </div>

      {/* Instant Demo Switcher for fast review */}
      <div className="neo-box p-4 space-y-3 text-xs">
        <span className="neo-sticker bg-zinc-950 text-white text-[10px]">
          ⚡ Quick Demo Account Selector
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => switchDemo('CLIPPER', 'tanvir@creators.bd')}
            className={`p-2.5 rounded-xl border-2 border-zinc-950 text-left flex flex-col justify-between transition-all ${
              selectedRole === 'CLIPPER'
                ? 'bg-rose-600 text-white shadow-[2px_2px_0px_#09090b]'
                : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <span className="font-['Unbounded'] font-bold text-[11px]">Clipper</span>
            <span className={`text-[10px] truncate font-mono ${selectedRole === 'CLIPPER' ? 'text-rose-100' : 'text-zinc-500'}`}>Tanvir</span>
          </button>
          <button
            type="button"
            onClick={() => switchDemo('ADMIN', 'admin@clipcart.com')}
            className={`p-2.5 rounded-xl border-2 border-zinc-950 text-left flex flex-col justify-between transition-all ${
              selectedRole === 'ADMIN'
                ? 'bg-zinc-950 text-white shadow-[2px_2px_0px_#09090b]'
                : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <span className="font-['Unbounded'] font-bold text-[11px]">Admin</span>
            <span className={`text-[10px] truncate font-mono ${selectedRole === 'ADMIN' ? 'text-zinc-300' : 'text-zinc-500'}`}>Operations</span>
          </button>
          <button
            type="button"
            onClick={() => switchDemo('MODERATOR', 'moderator@clipcart.com')}
            className={`p-2.5 rounded-xl border-2 border-zinc-950 text-left flex flex-col justify-between transition-all ${
              selectedRole === 'MODERATOR'
                ? 'bg-rose-600 text-white shadow-[2px_2px_0px_#09090b]'
                : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <span className="font-['Unbounded'] font-bold text-[11px]">Moderator</span>
            <span className={`text-[10px] truncate font-mono ${selectedRole === 'MODERATOR' ? 'text-rose-100' : 'text-zinc-500'}`}>Audit Desk</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="neo-box-lg p-6 space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-zinc-800 font-bold font-mono text-[11px] block uppercase">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-xs shadow-[2px_2px_0px_#09090b]"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-zinc-800 font-bold font-mono text-[11px] block uppercase">Password</label>
            <span className="text-[10px] text-zinc-500 font-mono">Managed via Auth</span>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-950 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs shadow-[2px_2px_0px_#09090b]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-['Unbounded'] font-bold text-xs uppercase text-white bg-rose-600 hover:bg-rose-700 border-2 border-zinc-950 shadow-[3px_3px_0px_#09090b] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#09090b] transition-all flex items-center justify-center gap-2 mt-2"
        >
          <span>Sign In as {selectedRole}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 text-center text-xs text-zinc-600 font-medium">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="text-rose-600 font-bold hover:underline">
            Register as a Clipper
          </Link>
        </div>
      </form>
    </div>
  );
}
