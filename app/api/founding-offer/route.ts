import { NextResponse } from 'next/server';
import { getFoundingOffer } from '@/lib/founding-server';

export const dynamic = 'force-dynamic';

// Public: only says whether the free founding spots are still open and how many are left.
export async function GET() {
  const offer = await getFoundingOffer();
  return NextResponse.json(offer, { headers: { 'Cache-Control': 'no-store' } });
}
