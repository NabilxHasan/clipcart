'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { WhatsAppPendingBadge } from '../../components/shared/WhatsAppPendingBadge';
import { getActiveUser } from '../../lib/auth/session';
import { Profile } from '../../lib/types/database';
import { useLanguage } from '../../lib/i18n/context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  useEffect(() => {
    const user = getActiveUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [pathname]);

  const navItems = [
    { name: t.dashboardNav.overview, href: '/dashboard', icon: LayoutDashboard },
    { name: t.dashboardNav.campaigns, href: '/dashboard/campaigns', icon: Flame },
    { name: t.dashboardNav.submissions, href: '/dashboard/submissions', icon: Video },
    { name: t.dashboardNav.earnings, href: '/dashboard/earnings', icon: Banknote },
    { name: t.dashboardNav.withdrawals, href: '/dashboard/withdrawals', icon: CreditCard },
    { name: t.dashboardNav.leaderboard, href: '/dashboard/leaderboard', icon: Trophy },
    { name: t.dashboardNav.profile, href: '/dashboard/profile', icon: User },
    { name: t.dashboardNav.notifications, href: '/dashboard/notifications', icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-5">
          <div className="neo-box p-4 space-y-3">
            <div className="flex items-center justify-between">
              {currentUser?.status === 'APPROVED' ? (
                <span className="neo-sticker bg-emerald-600 text-white text-[9px] px-2 py-0.5">
                  {t.dashboardLayout.verifiedClipper}
                </span>
              ) : (
                <span className="neo-sticker bg-amber-500 text-zinc-950 font-bold text-[9px] px-2 py-0.5">
                  <span className="bn-amount">{t.dashboardLayout.underReview}</span>
                </span>
              )}
              <span 
                className={`w-2.5 h-2.5 rounded-full border border-zinc-950 dark:border-zinc-700 ${
                  currentUser?.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`} 
                title={currentUser?.status === 'APPROVED' ? t.dashboardLayout.activeAccountTooltip : t.dashboardLayout.underReviewTooltip} 
              />
            </div>
            <div className="border-t-2 border-zinc-950 dark:border-zinc-700 pt-2.5">
              <h2 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white truncate">
                {currentUser?.fullName || t.dashboardLayout.defaultCreator}
              </h2>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-bold truncate block">
                {currentUser?.email || (currentUser?.phoneWhatsapp ? currentUser.phoneWhatsapp : '@creator')}
              </span>
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
          {currentUser?.status === 'PENDING' && (
            <div className="neo-box p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-950 dark:border-amber-700 text-amber-950 dark:text-amber-200 flex items-start gap-3 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000]">
              <span className="text-base leading-none mt-0.5">⏳</span>
              <div className="space-y-1 text-xs">
                <span className="font-['Unbounded'] font-bold block bn-amount">
                  {t.dashboardLayout.underReviewBannerTitle}
                </span>
                <p className="font-medium text-amber-900 dark:text-amber-300 leading-relaxed">
                  {t.dashboardLayout.underReviewBannerDesc}
                </p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
