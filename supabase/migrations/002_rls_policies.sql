-- CLIPBD Database Migration 002: Row Level Security (RLS) Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clipper_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE clip_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helpers: Check user role from profiles
CREATE OR REPLACE FUNCTION auth.get_user_role(user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. PROFILES POLICIES
CREATE POLICY "Public can view basic clipper profiles" ON profiles
    FOR SELECT USING (role = 'CLIPPER' AND status = 'APPROVED');

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT'));

CREATE POLICY "Users can update own profile fields" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND role = (SELECT p.role FROM profiles p WHERE p.id = auth.uid())
        AND status = (SELECT p.status FROM profiles p WHERE p.id = auth.uid())
    );

CREATE POLICY "Super admin can update any profile" ON profiles
    FOR ALL USING (auth.get_user_role(auth.uid()) = 'SUPER_ADMIN');

-- 2. CLIPPER PROFILES POLICIES
-- Clippers can only view their own private profile (including bKash payment details)
CREATE POLICY "Clippers can view own private details" ON clipper_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Clippers can update own profile" ON clipper_profiles
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage clipper profiles" ON clipper_profiles
    FOR ALL USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN'));

-- SECURE LEADERBOARD VIEW: Exposes only sanitized public metrics, strictly omitting payment identifiers
CREATE OR REPLACE VIEW public_clipper_leaderboard AS
SELECT 
    p.id as user_id,
    p.full_name,
    cp.tiktok_handle,
    cp.instagram_handle,
    cp.youtube_handle,
    cp.preferred_platforms,
    cp.approved_views_total,
    cp.approved_earnings_total,
    cp.approved_clips_total
FROM clipper_profiles cp
JOIN profiles p ON p.id = cp.user_id
WHERE p.status = 'APPROVED';

GRANT SELECT ON public_clipper_leaderboard TO anon, authenticated;

-- 3. CAMPAIGNS POLICIES
CREATE POLICY "Public can view active campaigns" ON campaigns
    FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Staff can view all campaigns" ON campaigns
    FOR SELECT USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT'));

CREATE POLICY "Admins can insert and update campaigns" ON campaigns
    FOR ALL USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN'));

-- 4. SUBMISSIONS POLICIES
CREATE POLICY "Clippers can view own submissions" ON submissions
    FOR SELECT USING (auth.uid() = clipper_id);

CREATE POLICY "Clippers can insert submissions to active campaigns" ON submissions
    FOR INSERT WITH CHECK (
        auth.uid() = clipper_id AND
        EXISTS (SELECT 1 FROM campaigns WHERE id = campaign_id AND status = 'ACTIVE')
    );

CREATE POLICY "Moderators can view and update all submissions" ON submissions
    FOR ALL USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR'));

-- 5. SUBMISSION FLAGS & REVIEWS
CREATE POLICY "Staff can view and manage submission flags" ON submission_flags
    FOR ALL USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR'));

CREATE POLICY "Staff can manage reviews" ON submission_reviews
    FOR ALL USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR'));

CREATE POLICY "Clippers can view reviews of own submissions" ON submission_reviews
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM submissions WHERE id = submission_id AND clipper_id = auth.uid())
    );

-- 6. EARNINGS & TRANSACTIONS
CREATE POLICY "Clippers can view own earnings" ON earnings
    FOR SELECT USING (auth.uid() = clipper_id);

CREATE POLICY "Staff can view all earnings" ON earnings
    FOR SELECT USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN'));

CREATE POLICY "Clippers can view own wallet transactions" ON wallet_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallet transactions" ON wallet_transactions
    FOR SELECT USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN'));

-- 7. WITHDRAWAL REQUESTS
CREATE POLICY "Clippers can view and create own withdrawal requests" ON withdrawal_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Clippers can create withdrawal request" ON withdrawal_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'REQUESTED');

CREATE POLICY "Admins can manage withdrawal requests" ON withdrawal_requests
    FOR ALL USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN'));

-- 8. CLIENT REQUESTS (CRM)
CREATE POLICY "Anyone can submit a client request" ON client_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view and manage client requests" ON client_requests
    FOR ALL USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'SUPPORT'));

-- 9. WHATSAPP SETTINGS
CREATE POLICY "Public can view enabled WhatsApp settings" ON whatsapp_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage WhatsApp settings" ON whatsapp_settings
    FOR ALL USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN'));

-- 10. NOTIFICATIONS
CREATE POLICY "Users can view and update own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- 11. AUDIT LOGS
CREATE POLICY "Only admins can view audit logs" ON audit_logs
    FOR SELECT USING (auth.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN'));
