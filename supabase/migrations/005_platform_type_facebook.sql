-- ClipCart - allow FACEBOOK as a clipper platform
-- The sign-up form offers (and pre-selects) Facebook, but platform_type only had TIKTOK/INSTAGRAM/YOUTUBE,
-- so every clipper_profiles insert that included FACEBOOK failed and the clipper's TrxID, bKash number
-- and handles were never saved.
ALTER TYPE public.platform_type ADD VALUE IF NOT EXISTS 'FACEBOOK';
