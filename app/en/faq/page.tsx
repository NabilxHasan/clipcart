import React from 'react';
import type { Metadata } from 'next';
import { FAQClient } from '../../../components/faq/FAQClient';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getFaqSchema, getBreadcrumbSchema } from '../../../lib/seo/schema';
import { translations } from '../../../lib/i18n/translations';

const fp = translations.en.faqPage;

const faqs = [
  { q: fp.q1, a: fp.a1 },
  { q: fp.q2, a: fp.a2 },
  { q: fp.q3, a: fp.a3 },
  { q: fp.q4, a: fp.a4 },
  { q: fp.q5, a: fp.a5 },
  { q: fp.q6, a: fp.a6 },
];

export const metadata: Metadata = {
  title: 'Rules & Payouts FAQ',
  description:
    'Frequently asked questions regarding CPM earnings calculations, view audit verification, ৳50 minimum cashout via bKash, and platform guidelines.',
  alternates: {
    canonical: '/en/faq',
    languages: {
      'bn-BD': '/faq',
      'en-BD': '/en/faq',
      'x-default': '/faq',
    },
  },
  openGraph: {
    title: 'ClipCart Rules & Verification FAQ',
    description:
      'Everything you need to know about view audits, CPM rates, bKash payouts, and submission standards.',
    url: '/en/faq',
    locale: 'en_US',
    type: 'website',
  },
};

export default function EnglishFAQPage() {
  return (
    <>
      <JsonLd
        schema={[
          getFaqSchema(faqs),
          getBreadcrumbSchema([
            { name: 'Home', url: '/en' },
            { name: 'FAQ', url: '/en/faq' },
          ]),
        ]}
      />
      <FAQClient />
    </>
  );
}
