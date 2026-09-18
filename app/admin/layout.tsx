'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  Flame, 
  CheckSquare, 
  CreditCard, 
  Users, 
  Inbox, 
  Settings, 
  FileText, 
  Banknote,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { WhatsAppPendingBadge } from '../../components/shared/WhatsAppPendingBadge';
import { AdminAuthGate } from '../../components/admin/AdminAuthGate';

const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: Shield },
  { name: 'Campaigns', href: '/admin/campaigns', icon: Flame },
  { name: 'Submissions Desk', href: '/admin/submissions', icon: CheckSquare },
  { name: 'Withdrawal Queue', href: '/admin/withdrawals', icon: CreditCard },
  { name: 'Client Inquiries', href: '/admin/client-requests', icon: Inbox },
  { name: 'Campaign Deposits', href: '/admin/payments', icon: Banknote },
  { name: 'User Directory', href: '/admin/users', icon: Users },
  { name: 'Settings & WhatsApp', href: '/admin/settings', icon: Settings },
  { name: 'Audit Trail', href: '/admin/audit-log', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleLockDesk = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('clipcart_admin_auth');
      window.location.reload();
    }
  };

  return (
    <AdminAuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Staff Notice & WhatsApp Alert */}
        <div className="neo-box p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse border border-zinc-950 dark:border-zinc-700" />
            <span className="font-mono text-zinc-950 dark:text-zinc-100 font-black uppercase tracking-wider">STAFF OPERATIONS DESK</span>
            <span className="text-zinc-400 dark:text-zinc-600">|</span>
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Manual campaign creation, payment & view audit validation mode</span>
          </div>
          <div className="flex items-center gap-3">
            <WhatsAppPendingBadge />
            <Link
              href="/dashboard"
              className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 underline"
            >
              Switch to Clipper View
            </Link>
            <button
              type="button"
              onClick={handleLockDesk}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-950 dark:border-zinc-600 font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Lock and sign out of admin operations desk"
            >
              <LogOut className="w-3 h-3 text-rose-600" />
              <span>Lock Desk</span>
            </button>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-5">
          <div className="neo-box p-4 space-y-2.5">
            <span className="neo-sticker bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-950 dark:border-rose-800 text-[9px] px-2 py-0.5">Admin Security</span>
            <h2 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">ClipCart Ops</h2>
            <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-950 dark:bg-zinc-800 text-white font-mono font-bold text-[10px] border border-zinc-800 dark:border-zinc-700">
              SUPER_ADMIN
            </span>
          </div>

          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scroll-y">
            {adminNav.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-['Space_Grotesk'] font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-zinc-950 dark:bg-rose-600 text-white border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-850 border-2 border-transparent hover:border-zinc-950 dark:hover:border-zinc-700 hover:shadow-[2px_2px_0px_#09090b] dark:hover:shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-4 space-y-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
    </AdminAuthGate>
  );
}
