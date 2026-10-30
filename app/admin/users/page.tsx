'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle2, KeyRound, Copy, MessageCircle, X } from 'lucide-react';
import { mockStore } from '../../../lib/db/mock-store';
import { ClipperProfile, Profile, UserRole, UserStatus } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { isFoundingTrxId } from '../../../lib/founding';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [clipperProfiles, setClipperProfiles] = useState<ClipperProfile[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);
  const [resetInfo, setResetInfo] = useState<{ name: string; email: string; phone: string | null; tempPassword: string } | null>(null);

  const loadData = async () => {
    let allProfiles = [...mockStore.profiles];

    try {
      // Authorized by the signed admin session cookie (same-origin, sent automatically)
      const res = await fetch('/api/auth/users', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.profiles)) {
        for (const sp of data.profiles) {
          const idx = mockStore.profiles.findIndex(p => p.id === sp.id || p.email.toLowerCase() === sp.email.toLowerCase());
          if (idx >= 0) {
            mockStore.profiles[idx] = { ...mockStore.profiles[idx], ...sp };
          } else {
            mockStore.profiles.push(sp);
          }
        }
        if (Array.isArray(data.clipperProfiles)) {
          setClipperProfiles(data.clipperProfiles);
          for (const scp of data.clipperProfiles) {
            const cpIdx = mockStore.clipperProfiles.findIndex(cp => cp.userId === scp.userId);
            if (cpIdx >= 0) {
              mockStore.clipperProfiles[cpIdx] = { ...mockStore.clipperProfiles[cpIdx], ...scp };
            } else {
              mockStore.clipperProfiles.push(scp);
            }
          }
        }
        mockStore.saveToStorage();
        allProfiles = [...mockStore.profiles];
      }
    } catch {
      // Local fallback
    }

    setProfiles(allProfiles);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = (userId: string, role: UserRole) => {
    const p = mockStore.profiles.find(user => user.id === userId);
    if (p) {
      p.role = role;
      p.updatedAt = new Date().toISOString();
      mockStore.saveToStorage();
      setFeedback(`Updated role for ${p.fullName} to ${role}`);
      loadData();
    }
  };

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    const p = mockStore.profiles.find(user => user.id === userId);
    if (p) {
      p.status = status;
      p.updatedAt = new Date().toISOString();
      mockStore.saveToStorage();
      setFeedback(`Updated status for ${p.fullName} to ${status}`);
      setProfiles([...mockStore.profiles]);

      // If this user is currently the active session in this browser, update active user too
      if (typeof window !== 'undefined') {
        try {
          const rawActive = localStorage.getItem('clipcart_active_user');
          if (rawActive) {
            const active = JSON.parse(rawActive);
            if (active.id === userId || active.email?.toLowerCase() === p.email.toLowerCase()) {
              active.status = status;
              localStorage.setItem('clipcart_active_user', JSON.stringify(active));
            }
          }
        } catch {
          // Ignore
        }
      }

      try {
        await fetch('/api/auth/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, status }),
        });
      } catch (err) {
        console.warn('Could not sync status change to backend:', err);
      }
    }
  };

  const handleQuickApprove = (userId: string) => {
    handleStatusChange(userId, 'APPROVED');
  };

  // Admin-assisted reset: verify the clipper on WhatsApp first, then send them this one-time password
  const handleResetPassword = async (p: Profile) => {
    if (!window.confirm(`Reset the password for ${p.fullName} (${p.email})?
Their old password stops working immediately.`)) return;
    setResetting(p.id);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: p.id }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setResetInfo({ name: p.fullName, email: data.email, phone: data.phoneWhatsapp, tempPassword: data.tempPassword });
      } else {
        setFeedback(data?.error || 'Password reset failed.');
      }
    } catch {
      setFeedback('Password reset failed: network error.');
    } finally {
      setResetting(null);
    }
  };

  const whatsappResetLink = (info: NonNullable<typeof resetInfo>) => {
    const digits = (info.phone || '').replace(/\D/g, '').replace(/^0/, '880');
    const text = `Hi ${info.name}, your ClipCart password has been reset.

Email: ${info.email}
Temporary password: ${info.tempPassword}

Log in at https://clipcart.bd/login and change it from your Profile page.`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Access Control
            </span>
            <span className="neo-sticker bg-rose-100 text-rose-950 border-rose-950 text-[10px] flex items-center gap-1">
              <Shield className="w-3 h-3 text-rose-600" />
              Staff Verification Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            User & Clipper Directory
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Verify ৳50 bKash sign-up transactions and manage account compliance statuses.
          </p>
        </div>
      </div>

      {resetInfo && (
        <div className="neo-box p-5 bg-amber-50 dark:bg-amber-950/30 border-amber-950 dark:border-amber-700 space-y-3 text-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 font-['Unbounded'] font-bold text-sm text-zinc-950 dark:text-white">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Temporary password for {resetInfo.name}</span>
            </div>
            <button type="button" onClick={() => setResetInfo(null)} className="p-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900 cursor-pointer" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 font-medium">
            Shown only once. Send it to {resetInfo.email} privately; they should change it from their Profile page after logging in.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 font-mono text-base font-black tracking-wider select-all">
              {resetInfo.tempPassword}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(resetInfo.tempPassword)}
              className="px-3 py-2 rounded-lg bg-zinc-950 text-white font-mono font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
            {resetInfo.phone && (
              <a
                href={whatsappResetLink(resetInfo)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[11px] flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Send on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      {feedback && (
        <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold font-mono">
          {feedback}
        </div>
      )}

      <div className="neo-box overflow-hidden">
        <div className="p-5 border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-[#181920] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-600" />
            <span className="font-['Unbounded'] font-bold text-xs uppercase text-zinc-950 dark:text-white">
              Registered Accounts ({profiles.length})
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
            Approve new clippers: ৳50 bKash TrxID or free founding spot
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase font-bold">
              <tr>
                <th className="py-3 px-4">User & Contact</th>
                <th className="py-3 px-4">Sign-up (৳50 TrxID / Founding)</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#14151a]">
              {profiles.map(p => {
                const clipperData = clipperProfiles.find(cp => cp.userId === p.id) ?? mockStore.clipperProfiles.find(cp => cp.userId === p.id);
                const isPending = p.status === 'PENDING';
                const isFounding = isFoundingTrxId(clipperData?.signupTrxId);

                return (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-zinc-950 dark:text-white font-['Space_Grotesk'] text-sm">{p.fullName}</div>
                      <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 font-bold">{p.email}</div>
                      {p.phoneWhatsapp && (
                        <div className="font-mono text-[10px] text-zinc-600 dark:text-zinc-300 select-all font-bold">{p.phoneWhatsapp}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isFounding ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-900 dark:border-emerald-800 font-mono text-[11px] font-bold text-emerald-900 dark:text-emerald-200">
                          <span>FREE · Founding spot</span>
                        </div>
                      ) : clipperData?.signupTrxId ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-950 dark:border-rose-800 font-mono text-[11px] font-bold text-rose-900 dark:text-rose-200">
                          <span>TrxID:</span>
                          <span className="font-black text-rose-600 dark:text-rose-400 select-all">{clipperData.signupTrxId}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={p.role}
                        onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                        className="px-2.5 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
                      >
                        <option value="CLIPPER">CLIPPER</option>
                        <option value="CLIENT">CLIENT</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="SUPPORT">SUPPORT</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500 dark:text-zinc-400 font-bold whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => handleQuickApprove(p.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-['Unbounded'] font-bold text-[10px] uppercase border border-zinc-950 shadow-[2px_2px_0px_#09090b] flex items-center gap-1 cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isFounding ? 'Approve' : 'Verify ৳50'}</span>
                          </button>
                        )}
                        {p.role !== 'SUPER_ADMIN' && p.role !== 'ADMIN' && (
                          <button
                            type="button"
                            onClick={() => handleResetPassword(p)}
                            disabled={resetting === p.id}
                            title="Generate a one-time temporary password"
                            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono font-bold text-[10px] uppercase border-2 border-zinc-950 dark:border-zinc-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                            <span>{resetting === p.id ? 'Resetting…' : 'Reset password'}</span>
                          </button>
                        )}
                        <select
                          value={p.status}
                          onChange={(e) => handleStatusChange(p.id, e.target.value as UserStatus)}
                          className="px-2.5 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono font-bold text-xs focus:outline-none"
                        >
                          <option value="APPROVED">APPROVED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                          <option value="BANNED">BANNED</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
