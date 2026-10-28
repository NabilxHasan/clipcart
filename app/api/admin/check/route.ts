import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/auth/require-admin';

export async function GET() {
  try {
    if (await hasAdminSession()) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
