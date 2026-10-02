// Structured Data (JSON-LD) Generators for ClipCart (Schema.org compliant)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clipcart.bd';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'ClipCart',
    alternateName: ['ClipCart BD', 'ক্লিপকার্ট', 'ClipCart Bangladesh'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon`,
      width: 512,
      height: 512,
    },
    description:
      'Bangladesh-first content clipping marketplace & performance distribution house. Connects podcasters, brands, and creators with vetted video editors for organic short-form reach.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+8801337142248',
      contactType: 'customer service',
      areaServed: 'BD',
      availableLanguage: ['Bengali', 'English'],
    },
    sameAs: [
      'https://www.facebook.com/clipcartbd1',
      'https://www.instagram.com/clipcartbd',
      'https://www.youtube.com/@clipcartbd',
      'https://wa.me/8801337142248',
    ],
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'ClipCart',
    alternateName: 'ClipCart BD',
    inLanguage: ['bn-BD', 'en-BD'],
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

export function getFaqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/for-clients#service`,
    name: 'Short-Form Video Clipping & Distribution',
    serviceType: 'Social Media Video Marketing',
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'ClipCart Campaign Packages',
      itemListElement: [
        {
          '@type': 'Offer',
          name: '৳1,000 Micro-Campaign (3 Days)',
          price: '1000',
          priceCurrency: 'BDT',
          description: 'Micro-campaign for podcasts & founders. 3-day distribution with ৳50 CPM rate.',
        },
        {
          '@type': 'Offer',
          name: '৳2,500 Growth Campaign (5 Days)',
          price: '2500',
          priceCurrency: 'BDT',
          description: '5-day multi-platform short video campaign with ৳60 CPM rate.',
        },
        {
          '@type': 'Offer',
          name: '৳5,000 Scale Campaign (7 Days)',
          price: '5000',
          priceCurrency: 'BDT',
          description: '7-day heavy distribution campaign across TikTok, Reels & Shorts with ৳75 CPM rate.',
        },
      ],
    },
  };
}

export function getHowToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How Content Clipping & Distribution Works on ClipCart',
    description:
      '4-step performance distribution model turning long-form videos into viral short clips with verified bKash payouts.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Brand Provides Footage & Budget',
        text: 'Client selects campaign tier (from ৳1,000), provides Google Drive link to raw interviews or podcasts.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Clippers Cut Hooks & Publish',
        text: 'Vetted video editors cut high-retention vertical clips and post them across TikTok, Instagram Reels, and YouTube Shorts.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'AI Check & Human Moderation Audit',
        text: 'Submissions are verified by AI for duplicates and rules, then audited by a human moderator for genuine organic view count.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Balance Credit & bKash Payout',
        text: 'Earned CPM fees are credited to the clipper balance ledger and withdrawn directly via bKash (min ৳50, 0% fee).',
      },
    ],
  };
}
