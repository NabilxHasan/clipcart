import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClipBDRepository } from '../../../lib/db/repository';
import { CampaignDetailClient } from '../../../components/campaigns/CampaignDetailClient';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../../lib/seo/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = await ClipBDRepository.getCampaignBySlugOrId(id);

  if (!campaign) {
    return {
      title: 'ক্যাম্পেইন পাওয়া যায়নি',
      description: 'অনুসন্ধানকৃত ক্যাম্পেইন ব্রিফটি খুঁজে পাওয়া যায়নি।',
    };
  }

  const slugOrId = campaign.slug || campaign.id;

  return {
    title: `${campaign.title} — ক্লিপিং ব্রিফ ও সাবমিশন`,
    description: `${campaign.clientName}-এর ${campaign.title} ক্যাম্পেইনে ক্লিপ বানিয়ে আয় করুন। CPM রেট ৳${campaign.cpmRate}, বাজেট বাকি ৳${campaign.remainingBudget.toLocaleString()}।`,
    alternates: {
      canonical: `/campaigns/${slugOrId}`,
      languages: {
        'bn-BD': `/campaigns/${slugOrId}`,
        'en-BD': `/en/campaigns/${slugOrId}`,
        'x-default': `/campaigns/${slugOrId}`,
      },
    },
    openGraph: {
      title: `${campaign.title} — ClipCart BD`,
      description: campaign.description,
      url: `/campaigns/${slugOrId}`,
      locale: 'bn_BD',
      type: 'article',
    },
  };
}

export default async function CampaignDetailPage({
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
          { name: 'হোম', url: '/' },
          { name: 'চলমান ক্যাম্পেইন', url: '/campaigns' },
          { name: campaign.title, url: `/campaigns/${slugOrId}` },
        ])}
      />
      <CampaignDetailClient campaign={campaign} />
    </>
  );
}
