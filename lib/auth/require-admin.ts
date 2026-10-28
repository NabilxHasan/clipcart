import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminSessionToken } from './admin-session';

// Server components & route handlers: true only for a valid signed admin session cookie.
export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
