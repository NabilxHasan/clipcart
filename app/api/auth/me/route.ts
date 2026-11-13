import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { USER_COOKIE, getSessionUserId } from '@/lib/auth/user-session';

// The signed-in clipper's profile as the database has it right now. The browser keeps a copy of the profile
// from sign-up/login in localStorage; the dashboard calls this to pick up changes made since then (an admin
// approving, suspending or banning the account) without the clipper having to log out and back in.
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Your session has expired. Please log in again.', code: 'LOGIN_REQUIRED' },
      { status: 401, headers: NO_STORE }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, role, full_name, phone_whatsapp, country, status, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    // Database hiccup: tell the browser to keep what it has rather than signing the clipper out
    return NextResponse.json({ success: false, error: 'Could not load your account right now.' }, { status: 503, headers: NO_STORE });
  }

  if (!data) {
    // The account was deleted: end the session
    const res = NextResponse.json(
      { success: false, error: 'Account not found. Please log in again.', code: 'LOGIN_REQUIRED' },
      { status: 401, headers: NO_STORE }
    );
    res.cookies.set(USER_COOKIE, '', { path: '/', maxAge: 0 });
    return res;
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: data.id,
        email: data.email,
        role: data.role,
        fullName: data.full_name,
        phoneWhatsapp: data.phone_whatsapp ?? undefined,
        country: data.country || 'Bangladesh',
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    },
    { headers: NO_STORE }
  );
}
