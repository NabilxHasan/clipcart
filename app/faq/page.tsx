import React from 'react';
import type { Metadata } from 'next';
import { FAQClient } from '../../components/faq/FAQClient';
import { JsonLd } from '../../components/seo/JsonLd';
import { getFaqSchema, getBreadcrumbSchema } from '../../lib/seo/schema';
import { translations } from '../../lib/i18n/translations';

const fp = translations.bn.faqPage;

const faqs = [
  { q: fp.q1, a: fp.a1 },
  { q: fp.q2, a: fp.a2 },
  { q: fp.q3, a: fp.a3 },
  { q: fp.q4, a: fp.a4 },
  { q: fp.q5, a: fp.a5 },
  { q: fp.q6, a: fp.a6 },
];

export const metadata: Metadata = {
  title: 'সাধারণ জিজ্ঞাসা ও উত্তর (FAQ) — ক্লিপকার্ট নিয়মাবলী ও পেমেন্ট',
  description:
    'ক্লিপকার্ট ব্যবহারের নিয়মাবলী, ভিউ অডিট ও যাচাইকরণ পদ্ধতি, CPM আয় গণনা এবং বিকাশে সর্বনিম্ন ৳৫০ উত্তোলনের বিস্তারিত প্রশ্নোত্তর।',
  alternates: {
    canonical: '/faq',
    languages: {
      'bn-BD': '/faq',
      'en-BD': '/en/faq',
      'x-default': '/faq',
    },
  },
  openGraph: {
    title: 'সাধারণ জিজ্ঞাসা ও উত্তর (FAQ) — ClipCart BD',
    description:
      'ক্লিপিং নিয়মাবলী, ভিউ যাচাই, CPM হিসাব ও ক্যাশআউট সংক্রান্ত সকল প্রশ্নের উত্তর।',
    url: '/faq',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function FAQPage() {
  return (
    <>
      <JsonLd
        schema={[
          getFaqSchema(faqs),
          getBreadcrumbSchema([
            { name: 'হোম', url: '/' },
            { name: 'প্রশ্নোত্তর (FAQ)', url: '/faq' },
          ]),
        ]}
      />
      <FAQClient />
    </>
  );
}
