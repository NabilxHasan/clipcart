-- ClipCart - Lock down personal data and stop storing plain-text passwords
-- ClipCart signs users in through its own server API (not Supabase Auth) and reads these tables only on the
-- server with the service role, so browsers (anon / authenticated keys) need no direct access to profile rows.

-- 1. Remove the public read policies that exposed emails, WhatsApp numbers, bKash numbers, TrxIDs
--    and the editing_experience JSON of every approved clipper to anyone holding the publishable key
DROP POLICY IF EXISTS "Public can view basic clipper profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view approved clipper stats" ON public.clipper_profiles;
REVOKE SELECT ON public.public_clipper_leaderboard FROM anon, authenticated;

-- 2. Password hashes in their own table: RLS on, no policies, no grants = service role only
CREATE TABLE IF NOT EXISTS public.user_credentials (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_credentials FROM anon, authenticated;

-- 3. Hash the plain-text passwords older builds packed into clipper_profiles.editing_experience ("pw"),
--    then strip them. bcrypt ($2a$) hashes are verified by bcryptjs in lib/auth/server-store.ts.
INSERT INTO public.user_credentials (user_id, password_hash)
SELECT cp.user_id, extensions.crypt(cp.editing_experience::jsonb ->> 'pw', extensions.gen_salt('bf', 10))
FROM public.clipper_profiles cp
WHERE cp.editing_experience LIKE '{%'
  AND COALESCE(cp.editing_experience::jsonb ->> 'pw', '') <> ''
ON CONFLICT (user_id) DO NOTHING;

UPDATE public.clipper_profiles
SET editing_experience = (editing_experience::jsonb - 'pw')::text
WHERE editing_experience LIKE '{%'
  AND editing_experience::jsonb ? 'pw';
