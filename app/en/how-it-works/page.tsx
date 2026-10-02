import React from 'react';
import type { Metadata } from 'next';
import { HowItWorksClient } from '../../../components/how-it-works/HowItWorksClient';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getHowToSchema, getBreadcrumbSchema } from '../../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'How ClipCart Works — 4-Step Short-Form Video Distribution',
  description:
    'From raw footage delivery to clipper edits, AI pre-filtering, human view audits, and direct bKash disbursements. Learn how ClipCart distributes content across Bangladesh.',
  alternates: {
    canonical: '/en/how-it-works',
    languages: {
      'bn-BD': '/how-it-works',
      'en-BD': '/en/how-it-works',
      'x-default': '/how-it-works',
    },
  },
  openGraph: {
    title: 'How ClipCart Works — 4-Step Distribution System',
    description:
      'Transform long-form conversations into viral vertical reels with verified bKash payouts.',
    url: '/en/how-it-works',
    locale: 'en_US',
    type: 'website',
  },
};

export default function EnglishHowItWorksPage() {
  return (
    <>
      <JsonLd
        schema={[
          getHowToSchema(),
          getBreadcrumbSchema([
            { name: 'Home', url: '/en' },
            { name: 'How It Works', url: '/en/how-it-works' },
          ]),
        ]}
      />
      <HowItWorksClient />
    </>
  );
}
