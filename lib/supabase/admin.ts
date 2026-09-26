import { createClient } from '@supabase/supabase-js';

// Defense-in-depth: Prevent bundling or executing in browser/client
if (typeof window !== 'undefined') {
  throw new Error('Security Violation: supabaseAdmin must only be used in server environments.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zjjqafhtaurxpuukfeow.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey && process.env.NODE_ENV === 'production') {
  // Warn on server boot if service role key is absent in production
  console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations requiring service privileges may fail.');
}

const effectiveKey = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_OOBhYCkJXk_To7pheMYgEg_njMyMPxr';

export const supabaseAdmin = createClient(supabaseUrl, effectiveKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
