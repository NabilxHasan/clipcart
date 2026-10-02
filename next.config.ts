import type { NextConfig } from "next";

// Environment Variable Startup Validator
if (process.env.NODE_ENV === 'production') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
    console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL should be a valid HTTPS URL.');
  }
  if (!supabaseAnonKey || supabaseAnonKey.trim().length < 10) {
    console.warn('Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid.');
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
