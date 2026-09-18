'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Flame, 
  Video, 
  Banknote, 
  CreditCard, 
  Trophy, 
  User, 
  Bell, 
  ArrowLeft 
} from 'lucide-react';
import { WhatsAppPendingBadge } from '../../components/shared/WhatsAppPendingBadge';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Flame },
  { name: 'My Submissions', href: '/dashboard/submissions', icon: Video },
  { name: 'Earnings Ledger', href: '/dashboard/earnings', icon: Banknote },
  { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: CreditCard },
  { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
  { name: 'Profile & Payouts', href: '/dashboard/profile', icon: User },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-5">
          <div className="neo-box p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[9px] px-2 py-0.5">Clipper Pro</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-zinc-950 dark:border-zinc-700" title="Active Account" />
            </div>
            <div className="border-t-2 border-zinc-950 dark:border-zinc-700 pt-2.5">
              <h2 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">Tanvir Hossain</h2>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-bold">@tanvir.edits</span>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scroll-y">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-['Space_Grotesk'] font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white border-2 border-zinc-950 dark:border-zinc-700 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-850 border-2 border-transparent hover:border-zinc-950 dark:hover:border-zinc-700 hover:shadow-[2px_2px_0px_#09090b] dark:hover:shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block pt-3 border-t-2 border-zinc-950 dark:border-zinc-700">
            <WhatsAppPendingBadge />
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="lg:col-span-4 space-y-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
