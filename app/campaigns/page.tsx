import React from 'react';
import type { Metadata } from 'next';
import { ClipBDRepository } from '../../lib/db/repository';
import { CampaignsClient } from '../../components/campaigns/CampaignsClient';
import { JsonLd } from '../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'চলমান ক্লিপিং ক্যাম্পেইন',
  description:
    'বাংলাদেশে শীর্ষ পডকাস্ট ও ব্র্যান্ডের শর্ট-ফর্ম ক্লিপিং ক্যাম্পেইনে অংশ নিন। ভিউ প্রতি নিশ্চিত CPM আয় ও সর্বনিম্ন ৳৫০ সরাসরি বিকাশে ক্যাশআউট।',
  alternates: {
    canonical: '/campaigns',
    languages: {
      'bn-BD': '/campaigns',
      'en-BD': '/en/campaigns',
      'x-default': '/campaigns',
    },
  },
  openGraph: {
    title: 'চলমান ক্লিপিং ক্যাম্পেইন — ClipCart BD',
    description:
      'ভিডিও এডিটরদের জন্য লাইভ ক্লিপিং ব্রিফ। রিলস ও শর্টস তৈরি করে আয় করুন প্রতি ১,০০০ ভিউয়ে।',
    url: '/campaigns',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default async function CampaignsPage() {
  const campaigns = await ClipBDRepository.getCampaigns('ALL');

  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'হোম', url: '/' },
          { name: 'চলমান ক্যাম্পেইন', url: '/campaigns' },
        ])}
      />
      <CampaignsClient initialCampaigns={campaigns} />
    </>
  );
}
