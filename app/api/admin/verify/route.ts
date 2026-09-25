import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const passcode = body?.passcode?.trim();

    const expectedPasscode = process.env.ADMIN_MASTER_KEY || 'ClipCart@Admin2026!';

    if (passcode && passcode === expectedPasscode) {
      const cookieStore = await cookies();
      cookieStore.set('clipcart_admin_token', 'clipcart_admin_authorized_v1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid Master Security Key' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process authentication request' },
      { status: 500 }
    );
  }
}
