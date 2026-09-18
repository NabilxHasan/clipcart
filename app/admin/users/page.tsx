'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, Check, Ban, Clock, Sparkles } from 'lucide-react';
import { mockStore } from '../../../lib/db/mock-store';
import { Profile, UserRole, UserStatus } from '../../../lib/types/database';
import { StatusBadge } from '../../../components/shared/StatusBadge';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = () => {
    setProfiles([...mockStore.profiles]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = (userId: string, role: UserRole) => {
    const p = mockStore.profiles.find(user => user.id === userId);
    if (p) {
      p.role = role;
      setFeedback(`Updated role for ${p.fullName} to ${role}`);
      loadData();
    }
  };

  const handleStatusChange = (userId: string, status: UserStatus) => {
    const p = mockStore.profiles.find(user => user.id === userId);
    if (p) {
      p.status = status;
      setFeedback(`Updated status for ${p.fullName} to ${status}`);
      loadData();
    }
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
              PostgreSQL RBAC
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            User & Clipper Directory
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Server-enforced RBAC. Manage roles (Super Admin, Moderator, Clipper) and account compliance statuses.
          </p>
        </div>
      </div>

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
            ৳50 Sign-Up Fee Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b-2.5 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase font-bold">
              <tr>
                <th className="py-3 px-4">User & Contact</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#14151a]">
              {profiles.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-zinc-950 dark:text-white font-['Space_Grotesk'] text-sm">{p.fullName}</div>
                    <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 font-bold">{p.email}</div>
                    {p.phoneWhatsapp && (
                      <div className="font-mono text-[10px] text-zinc-600 dark:text-zinc-300 select-all font-bold">{p.phoneWhatsapp}</div>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
