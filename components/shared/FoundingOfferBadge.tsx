'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';
import { FoundingOffer } from '../../lib/founding';

// Links to sign-up while free founding spots are left; renders nothing once the offer closes.
export function FoundingOfferBadge() {
  const { t, lang } = useLanguage();
  const [offer, setOffer] = useState<FoundingOffer | null>(null);

  useEffect(() => {
    fetch('/api/founding-offer', { cache: 'no-store' })
      .then(r => r.json())
      .then((o: FoundingOffer) => setOffer(o))
      .catch(() => setOffer(null));
  }, []);

  if (!offer?.open) return null;
  const fmt = (n: number) => (lang === 'bn' ? n.toLocaleString('bn-BD') : String(n));

  return (
    <div className="flex justify-center">
      <Link
        href="/register"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold bg-emerald-500 text-zinc-950 border-2 border-zinc-950 shadow-[3px_3px_0px_#09090b] dark:shadow-[3px_3px_0px_#000000] hover:-translate-y-0.5 transition-transform"
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>
          {t.registerPage.foundingHomeBadge
            .replace('{limit}', fmt(offer.limit))
            .replace('{n}', fmt(offer.spotsLeft))}
        </span>
      </Link>
    </div>
  );
}
