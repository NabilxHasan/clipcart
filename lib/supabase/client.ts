import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zjjqafhtaurxpuukfeow.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_OOBhYCkJXk_To7pheMYgEg_njMyMPxr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
