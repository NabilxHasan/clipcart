import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Launch a Brand Campaign | ClipCart BD',
  description:
    'Tell ClipCart about your brand campaign. Micro-campaigns start at ৳1,000 for 3 days at ৳50 per 1,000 verified views, plus a 10% platform fee.',
  alternates: { canonical: '/client-request' },
};

export default function ClientRequestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
