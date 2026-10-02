import React from 'react';
import type { Metadata } from 'next';
import { ForClippersClient } from '../../../components/for-clippers/ForClippersClient';
import { JsonLd } from '../../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'Monetize Video Editing Skills in Bangladesh — Clipper Program',
  description:
    'Turn video editing skills into income. 0% clipper fee, minimum ৳50 cashout directly to bKash. Cut raw podcast clips and get paid per 1,000 verified views.',
  alternates: {
    canonical: '/en/for-clippers',
    languages: {
      'bn-BD': '/for-clippers',
      'en-BD': '/en/for-clippers',
      'x-default': '/for-clippers',
    },
  },
  openGraph: {
    title: 'Clipper Program — Monetize Video Editing Skills | ClipCart BD',
    description:
      'Cut viral clips for top Bangladeshi podcasts & brands. 0% fee on earnings, ৳50 min cashout via bKash.',
    url: '/en/for-clippers',
    locale: 'en_US',
    type: 'website',
  },
};

export default function EnglishForClippersPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/en' },
          { name: 'For Clippers', url: '/en/for-clippers' },
        ])}
      />
      <ForClippersClient />
    </>
  );
}
