import React from 'react';
import type { Metadata } from 'next';
import { HowItWorksClient } from '../../components/how-it-works/HowItWorksClient';
import { JsonLd } from '../../components/seo/JsonLd';
import { getHowToSchema, getBreadcrumbSchema } from '../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'ClipCart যেভাবে কাজ করে — ৪ ধাপের ডিস্ট্রিবিউশন সিস্টেম',
  description:
    'ব্র্যান্ডের মূল ভিডিও প্রদান থেকে শুরু করে ক্লিপারদের রিলস তৈরি, AI প্রি-ফিল্টার, হিউম্যান ভিউ অডিট এবং সরাসরি বিকাশে পেমেন্ট পাওয়ার ৪টি সহজ ধাপ।',
  alternates: {
    canonical: '/how-it-works',
    languages: {
      'bn-BD': '/how-it-works',
      'en-BD': '/en/how-it-works',
      'x-default': '/how-it-works',
    },
  },
  openGraph: {
    title: 'ClipCart যেভাবে কাজ করে — ৪ ধাপের ডিস্ট্রিবিউশন সিস্টেম',
    description:
      'লং-ফর্ম ভিডিও থেকে ভাইরাল শর্টস ও নিশ্চিত বিকাশ ক্যাশআউট। জানুন পুরো প্রক্রিয়া।',
    url: '/how-it-works',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        schema={[
          getHowToSchema(),
          getBreadcrumbSchema([
            { name: 'হোম', url: '/' },
            { name: 'কীভাবে চলে', url: '/how-it-works' },
          ]),
        ]}
      />
      <HowItWorksClient />
    </>
  );
}
