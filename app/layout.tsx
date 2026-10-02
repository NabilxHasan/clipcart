import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Unbounded, JetBrains_Mono, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LanguageProvider } from '../lib/i18n/context';
import { ThemeProvider } from '../lib/theme/context';
import { CuteDoodleBackground } from '../components/shared/CuteDoodleBackground';
import { JsonLd } from '../components/seo/JsonLd';
import { getOrganizationSchema, getWebSiteSchema } from '../lib/seo/schema';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-unbounded',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clipcart.bd';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ClipCart — বাংলাদেশি কনটেন্ট ডিস্ট্রিবিউশন হাউস',
    template: '%s | ClipCart BD',
  },
  description:
    'লং-ফর্ম পডকাস্ট, ওয়েবিনার ও ব্র্যান্ড কনটেন্টকে ভাইরাল শর্ট-ফর্মে রূপান্তর করুন। ৳১,০০০ থেকে ক্যাম্পেইন, ক্লিপারদের জন্য সর্বনিম্ন ৳৫০ ক্যাশআউট সরাসরি বিকাশে।',
  keywords: [
    'ClipCart',
    'ClipCart BD',
    'ক্লিপকার্ট',
    'কনটেন্ট ক্লিপিং',
    'ভিডিও এডিটিং করে আয়',
    'শর্ট-ফর্ম ভিডিও মার্কেটিং',
    'TikTok clipping Bangladesh',
    'Reels distribution Dhaka',
    'YouTube Shorts clipping',
    'bKash creator payouts',
    'FutureMakers',
  ],
  authors: [{ name: 'ClipCart Team', url: SITE_URL }],
  creator: 'ClipCart',
  publisher: 'ClipCart',
  alternates: {
    canonical: '/',
    languages: {
      'bn-BD': '/',
      'en-BD': '/en',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'ClipCart — Turn Great Content into Short-Form Distribution',
    description:
      'Performance-driven clipping campaigns for Bangladeshi creators & brands. Flexible ৳1,000 campaigns, ৳50 min cash-out via bKash.',
    url: SITE_URL,
    siteName: 'ClipCart BD',
    locale: 'bn_BD',
    alternateLocale: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClipCart — Turn Great Content into Short-Form Distribution',
    description:
      'Performance-driven clipping campaigns for Bangladeshi creators & brands. Flexible ৳1,000 campaigns, ৳50 min cash-out via bKash.',
    creator: '@clipcartbd',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <JsonLd schema={[getOrganizationSchema(), getWebSiteSchema()]} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${unbounded.variable} ${jetbrainsMono.variable} ${hindSiliguri.variable} relative flex flex-col min-h-screen bg-[#fafafc] dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 selection:bg-rose-600 selection:text-white font-['Space_Grotesk'] antialiased transition-colors duration-200`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <CuteDoodleBackground />
            <Navbar />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
