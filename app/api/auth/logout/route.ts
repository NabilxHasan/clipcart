import { NextResponse } from 'next/server';
import { USER_COOKIE } from '@/lib/auth/user-session';

// Ends the clipper session (the httpOnly cookie can only be cleared by the server)
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(USER_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
