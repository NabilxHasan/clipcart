import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClipBDRepository } from '../../../../lib/db/repository';
import { CampaignDetailClient } from '../../../../components/campaigns/CampaignDetailClient';
import { JsonLd } from '../../../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../../../lib/seo/schema';

export async function generateStaticParams() {
  const campaigns = await ClipBDRepository.getActiveCampaigns();
  return campaigns.map((c) => ({ id: c.slug || c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = await ClipBDRepository.getCampaignBySlugOrId(id);

  if (!campaign) {
    return {
      title: 'Campaign Not Found',
      description: 'The requested campaign brief could not be located.',
    };
  }

  const slugOrId = campaign.slug || campaign.id;

  return {
    title: `${campaign.title} — Video Clipping Brief & Submission`,
    description: `Submit clips for ${campaign.clientName}'s ${campaign.title} campaign. Rate: ৳${campaign.cpmRate} CPM, Remaining Budget: ৳${campaign.remainingBudget.toLocaleString()} BDT.`,
    alternates: {
      canonical: `/en/campaigns/${slugOrId}`,
      languages: {
        'bn-BD': `/campaigns/${slugOrId}`,
        'en-BD': `/en/campaigns/${slugOrId}`,
        'x-default': `/campaigns/${slugOrId}`,
      },
    },
    openGraph: {
      title: `${campaign.title} — ClipCart BD`,
      description: campaign.description,
      url: `/en/campaigns/${slugOrId}`,
      locale: 'en_US',
      type: 'article',
    },
  };
}

export default async function EnglishCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await ClipBDRepository.getCampaignBySlugOrId(id);

  if (!campaign) {
    notFound();
  }

  const slugOrId = campaign.slug || campaign.id;

  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/en' },
          { name: 'Active Campaigns', url: '/en/campaigns' },
          { name: campaign.title, url: `/en/campaigns/${slugOrId}` },
        ])}
      />
      <CampaignDetailClient campaign={campaign} />
    </>
  );
}
