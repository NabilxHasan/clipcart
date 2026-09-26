'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';

interface Props {
  className?: string;
  inviteUrl?: string;
  isConfigured?: boolean;
  communityName?: string;
}

export function WhatsAppPendingBadge({ 
  className = '', 
  inviteUrl = 'https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan',
  isConfigured,
  communityName
}: Props) {
  const { t } = useLanguage();

  return (
    <a
      href={inviteUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={t.dashboardLayout.whatsappTooltip}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-[#25D366] text-white border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_#09090b] dark:shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#09090b] transition-all shrink-0 ${className}`}
    >
      <MessageSquare className="w-3.5 h-3.5 fill-white" />
      <span>{t.dashboardLayout.whatsappCommunity}</span>
    </a>
  );
}
