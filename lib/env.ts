// Environment Variable Startup Validator

export function validateEnvironment(): void {
  const isProduction = process.env.NODE_ENV === 'production';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminKey = process.env.ADMIN_MASTER_KEY;

  if (isProduction) {
    if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
      throw new Error(
        'FATAL: NEXT_PUBLIC_SUPABASE_URL is missing or invalid in production. Must be a valid HTTPS URL.'
      );
    }

    if (!supabaseAnonKey || supabaseAnonKey.trim().length < 10) {
      throw new Error(
        'FATAL: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid in production.'
      );
    }

    if (!adminKey || adminKey.length < 8) {
      throw new Error(
        'FATAL: ADMIN_MASTER_KEY is missing or too short in production. Must be at least 8 characters.'
      );
    }
  }
}

// Automatically validate on module import
validateEnvironment();
