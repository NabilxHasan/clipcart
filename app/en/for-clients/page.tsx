import React from 'react';
import type { Metadata } from 'next';
import { ForClientsClient } from '../../../components/for-clients/ForClientsClient';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getServiceSchema, getBreadcrumbSchema } from '../../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'Short-Form Video Marketing & Distribution in Bangladesh',
  description:
    'Guaranteed organic reach across TikTok, Reels, and Shorts for brands, founders, and podcasters. Performance-based CPM pricing starting at ৳1,000 for 3 days.',
  alternates: {
    canonical: '/en/for-clients',
    languages: {
      'bn-BD': '/for-clients',
      'en-BD': '/en/for-clients',
      'x-default': '/for-clients',
    },
  },
  openGraph: {
    title: 'Brand Video Distribution & Marketing — ClipCart BD',
    description:
      'Distribute your best hooks across dozens of creators. Pay only for verified organic reach. ৳1,000 micro-campaigns.',
    url: '/en/for-clients',
    locale: 'en_US',
    type: 'website',
  },
};

export default function EnglishForClientsPage() {
  return (
    <>
      <JsonLd
        schema={[
          getServiceSchema(),
          getBreadcrumbSchema([
            { name: 'Home', url: '/en' },
            { name: 'For Brands', url: '/en/for-clients' },
          ]),
        ]}
      />
      <ForClientsClient />
    </>
  );
}
