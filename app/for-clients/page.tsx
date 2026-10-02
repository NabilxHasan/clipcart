import React from 'react';
import type { Metadata } from 'next';
import { ForClientsClient } from '../../components/for-clients/ForClientsClient';
import { JsonLd } from '../../components/seo/JsonLd';
import { getServiceSchema, getBreadcrumbSchema } from '../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'শর্ট-ফর্ম ভিডিও মার্কেটিং ও কন্টেন্ট ডিস্ট্রিবিউশন',
  description:
    'ব্র্যান্ড ও পডকাস্টের জন্য পারফরম্যান্স ভিত্তিক শর্ট ভিডিও ডিস্ট্রিবিউশন। ৳১,০০০ মাইক্রো-ক্যাম্পেইন থেকে শুরু, শতভাগ অডিটেড ভিউ এবং কড়া ব্র্যান্ড সেফটি।',
  alternates: {
    canonical: '/for-clients',
    languages: {
      'bn-BD': '/for-clients',
      'en-BD': '/en/for-clients',
      'x-default': '/for-clients',
    },
  },
  openGraph: {
    title: 'ব্র্যান্ড ও পডকাস্টের অর্গানিক রিচ বাড়ান — ClipCart BD',
    description:
      'TikTok, Reels ও Shorts-এ ব্যাপক ভাইরাল ডিস্ট্রিবিউশন। নিশ্চিত CPM ভিউ ও সাশ্রয়ী প্যাকেজ।',
    url: '/for-clients',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function ForClientsPage() {
  return (
    <>
      <JsonLd
        schema={[
          getServiceSchema(),
          getBreadcrumbSchema([
            { name: 'হোম', url: '/' },
            { name: 'ব্র্যান্ডদের জন্য', url: '/for-clients' },
          ]),
        ]}
      />
      <ForClientsClient />
    </>
  );
}
