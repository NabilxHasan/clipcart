import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found | ClipCart BD',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="neo-box max-w-md w-full p-8 text-center space-y-4 bg-white dark:bg-[#14151a]">
        <p className="font-['Unbounded'] text-5xl font-black text-rose-600">404</p>
        <h1 className="font-['Unbounded'] text-xl font-bold text-zinc-950 dark:text-white">
          এই পেজটি পাওয়া যায়নি
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The page you were looking for doesn&apos;t exist or was moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/" className="neo-btn px-4 py-2 text-sm font-bold">
            হোমপেজ / Home
          </Link>
          <Link href="/campaigns" className="neo-btn px-4 py-2 text-sm font-bold">
            ক্যাম্পেইন / Campaigns
          </Link>
        </div>
      </div>
    </main>
  );
}
