import React from 'react';
import type { Metadata } from 'next';
import { ClipBDRepository } from '../../../lib/db/repository';
import { CampaignsClient } from '../../../components/campaigns/CampaignsClient';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'Active Content Clipping Campaigns',
  description:
    'Browse active short-form video clipping briefs in Bangladesh. Cut viral clips for top creators and brands, earning verified CPM payouts with ৳50 min cashout via bKash.',
  alternates: {
    canonical: '/en/campaigns',
    languages: {
      'bn-BD': '/campaigns',
      'en-BD': '/en/campaigns',
      'x-default': '/campaigns',
    },
  },
  openGraph: {
    title: 'Active Clipping Campaigns — ClipCart BD',
    description:
      'Video editor opportunities. Submit short reels & TikToks for live Bangladeshi campaigns and earn per 1,000 verified views.',
    url: '/en/campaigns',
    locale: 'en_US',
    type: 'website',
  },
};

export default async function EnglishCampaignsPage() {
  const campaigns = await ClipBDRepository.getCampaigns('ALL');

  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/en' },
          { name: 'Active Campaigns', url: '/en/campaigns' },
        ])}
      />
      <CampaignsClient initialCampaigns={campaigns} />
    </>
  );
}
