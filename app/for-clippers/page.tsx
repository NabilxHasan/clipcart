import React from 'react';
import type { Metadata } from 'next';
import { ForClippersClient } from '../../components/for-clippers/ForClippersClient';
import { JsonLd } from '../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'ভিডিও এডিটিং করে আয় — ক্লিপার প্রোগ্রাম ও বিকাশ পেমেন্ট',
  description:
    'সেরা কনটেন্ট ক্লিপিং করে আয় করুন। ক্লিপারদের জন্য ০% ফি, সর্বনিম্ন ৳৫০ ক্যাশআউট সরাসরি বিকাশ অ্যাকাউন্টে। বাংলাদেশের প্রথম ক্লিপিং প্ল্যাটফর্ম।',
  alternates: {
    canonical: '/for-clippers',
    languages: {
      'bn-BD': '/for-clippers',
      'en-BD': '/en/for-clippers',
      'x-default': '/for-clippers',
    },
  },
  openGraph: {
    title: 'ভিডিও এডিটিং করে আয় — ক্লিপার প্রোগ্রাম | ClipCart BD',
    description:
      'ভিডিও কেটে রিলস ও শর্টস তৈরি করে আয় নিন সরাসরি বিকাশে। ০% প্ল্যাটফর্ম ফি, সর্বনিম্ন ৳৫০ ক্যাশআউট।',
    url: '/for-clippers',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function ForClippersPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'হোম', url: '/' },
          { name: 'ক্লিপারদের জন্য', url: '/for-clippers' },
        ])}
      />
      <ForClippersClient />
    </>
  );
}
