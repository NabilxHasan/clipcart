import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LanguageProvider } from '../lib/i18n/context';
import { ThemeProvider } from '../lib/theme/context';
import { CuteDoodleBackground } from '../components/shared/CuteDoodleBackground';

export const metadata: Metadata = {
  title: 'ClipCart — Bangladesh Content Clipping & Distribution Marketplace',
  description: 'Connect long-form video creators, podcasters, and brands with skilled short-form video clippers in Bangladesh. Flexible campaigns from ৳1,000 for 3 days. Minimum payout ৳50 via bKash and Nagad.',
  keywords: ['ClipCart', 'content clipping', 'short-form video', 'Bangladesh creators', 'TikTok clipping', 'Reels distribution', 'YouTube Shorts', 'bKash creator payouts', 'FutureMakers'],
  openGraph: {
    title: 'ClipCart — Turn Great Content into Short-Form Distribution',
    description: 'Performance-driven clipping campaigns for Bangladeshi creators and brands. Flexible ৳1,000 campaigns, ৳50 min cash-out.',
    type: 'website',
    locale: 'en_BD',
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Hind+Siliguri:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative flex flex-col min-h-screen bg-[#fafafc] dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 selection:bg-rose-600 selection:text-white font-['Space_Grotesk'] antialiased transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <CuteDoodleBackground />
            <Navbar />
            <main className="flex-1 relative z-10">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
