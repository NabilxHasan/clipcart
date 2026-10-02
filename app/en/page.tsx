import React from 'react';
import type { Metadata } from 'next';
import { ClipBDRepository } from '../../lib/db/repository';
import { HomeClient } from '../../components/home/HomeClient';

export const metadata: Metadata = {
  title: 'ClipCart — Bangladesh Content Clipping & Distribution Marketplace',
  description:
    'Turn long-form podcasts, interviews, and brand videos into viral vertical clips on TikTok, Reels, and YouTube Shorts. Verified CPM payouts with ৳50 min cashout via bKash.',
  alternates: {
    canonical: '/en',
    languages: {
      'bn-BD': '/',
      'en-BD': '/en',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'ClipCart — Turn Great Content into Short-Form Distribution',
    description:
      'Performance-driven clipping campaigns for Bangladeshi creators & brands. Flexible ৳1,000 campaigns, ৳50 min cashout via bKash.',
    url: '/en',
    locale: 'en_US',
    type: 'website',
  },
};

export default async function EnglishHomePage() {
  const activeCampaigns = await ClipBDRepository.getActiveCampaigns();

  return <HomeClient activeCampaigns={activeCampaigns} />;
}
