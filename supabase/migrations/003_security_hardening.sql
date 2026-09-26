-- CLIPBD Migration 003: Comprehensive Security Hardening & Atomic Ledger Functions

-- 1. PROFILES: Insert policy for new registered users (enforces role='CLIPPER' and status='PENDING')
CREATE POLICY "Users can insert own profile on registration" ON profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id 
        AND role = 'CLIPPER' 
        AND status = 'PENDING'
    );

-- 2. CLIPPER PROFILES: Insert policy for clippers
CREATE POLICY "Clippers can insert own profile" ON clipper_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. CAMPAIGN PLATFORMS: Missing policies
CREATE POLICY "Public can view campaign platforms" ON campaign_platforms
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage campaign platforms" ON campaign_platforms
    FOR ALL USING (public.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN'));

-- 4. CLIP VIEWS: Missing policies
CREATE POLICY "Clippers can view views on own clips" ON clip_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM submissions s 
            WHERE s.id = clip_views.submission_id 
              AND s.clipper_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view and manage clip views" ON clip_views
    FOR ALL USING (public.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR'));

-- 5. PAYMENT RECORDS: Missing policies
CREATE POLICY "Admins can view and manage payment records" ON payment_records
    FOR ALL USING (public.get_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN'));

-- 6. AUDIT LOGS: Staff insert policy
CREATE POLICY "Staff can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (auth.uid() = actor_id);

-- 7. WITHDRAWAL REQUESTS: Enforce non-empty TrxID at DB constraint level when PAID
ALTER TABLE withdrawal_requests 
ADD CONSTRAINT check_paid_withdrawal_has_trx_ref 
CHECK (status != 'PAID' OR (transaction_reference IS NOT NULL AND length(trim(transaction_reference)) >= 6));

-- 8. ATOMIC WITHDRAWAL FUNCTION (Single Transaction with Row Locking)
-- Prevents race conditions and double-spending across concurrent requests
CREATE OR REPLACE FUNCTION request_withdrawal_atomic(
    p_user_id UUID,
    p_amount NUMERIC(12,2),
    p_payment_method payment_method_type,
    p_payment_identifier TEXT
)
RETURNS UUID AS $$
DECLARE
    v_balance NUMERIC(12,2);
    v_user_status user_status;
    v_withdrawal_id UUID;
    v_tx_id UUID;
BEGIN
    -- Verify user status
    SELECT status INTO v_user_status FROM profiles WHERE id = p_user_id FOR UPDATE;
    IF v_user_status IS NULL THEN
        RAISE EXCEPTION 'User profile not found.';
    END IF;
    IF v_user_status != 'APPROVED' THEN
        RAISE EXCEPTION 'Only verified clippers with an APPROVED account can request withdrawals.';
    END IF;

    -- Validate amount
    IF p_amount < 50 THEN
        RAISE EXCEPTION 'Minimum withdrawal amount is ৳50.';
    END IF;

    -- Calculate current balance from ledger with row lock
    SELECT COALESCE(
        SUM(CASE 
            WHEN type IN ('CREDIT_EARNING', 'ADJUSTMENT_CREDIT') THEN amount 
            WHEN type IN ('DEBIT_WITHDRAWAL_LOCK', 'DEBIT_WITHDRAWAL_SETTLED', 'ADJUSTMENT_DEBIT') THEN -amount 
            ELSE 0 
        END), 0
    ) INTO v_balance
    FROM wallet_transactions
    WHERE user_id = p_user_id;

    IF p_amount > v_balance THEN
        RAISE EXCEPTION 'Insufficient available balance. Available: ৳%', v_balance;
    END IF;

    -- Create withdrawal request
    INSERT INTO withdrawal_requests (
        user_id, amount, payment_method, payment_identifier, status
    ) VALUES (
        p_user_id, p_amount, p_payment_method, p_payment_identifier, 'REQUESTED'
    ) RETURNING id INTO v_withdrawal_id;

    -- Lock funds in ledger inside the same atomic transaction
    INSERT INTO wallet_transactions (
        user_id, type, amount, balance_after, reference_type, reference_id, description
    ) VALUES (
        p_user_id,
        'DEBIT_WITHDRAWAL_LOCK',
        p_amount,
        v_balance - p_amount,
        'WITHDRAWAL_REQUEST',
        v_withdrawal_id,
        'Locked for withdrawal payout'
    ) RETURNING id INTO v_tx_id;

    RETURN v_withdrawal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. ATOMIC SUBMISSION REVIEW & PAYOUT FUNCTION
-- Ensures campaign remaining budget cannot go below 0 under concurrent approvals
CREATE OR REPLACE FUNCTION approve_submission_payout_atomic(
    p_submission_id UUID,
    p_reviewer_id UUID,
    p_verified_views BIGINT,
    p_admin_note TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_submission RECORD;
    v_campaign RECORD;
    v_payout_amount NUMERIC(12,2);
    v_earning_id UUID;
    v_current_balance NUMERIC(12,2);
BEGIN
    -- Lock submission row
    SELECT * INTO v_submission FROM submissions WHERE id = p_submission_id FOR UPDATE;
    IF v_submission IS NULL THEN
        RAISE EXCEPTION 'Submission not found.';
    END IF;
    IF v_submission.status = 'APPROVED' THEN
        RAISE EXCEPTION 'Submission is already approved.';
    END IF;

    -- Lock campaign row to prevent budget race condition
    SELECT * INTO v_campaign FROM campaigns WHERE id = v_submission.campaign_id FOR UPDATE;
    IF v_campaign IS NULL THEN
        RAISE EXCEPTION 'Campaign not found.';
    END IF;

    -- Check minimum views requirement
    IF p_verified_views < v_campaign.min_views THEN
        RAISE EXCEPTION 'Verified views (%) below campaign minimum (%)', p_verified_views, v_campaign.min_views;
    END IF;

    -- Calculate payout
    IF v_campaign.payout_type = 'CPM' THEN
        v_payout_amount := ROUND(((p_verified_views::NUMERIC / 1000.0) * v_campaign.cpm_rate), 2);
    ELSE
        v_payout_amount := v_campaign.fixed_reward;
    END IF;

    -- Enforce per-clip cap
    IF v_campaign.max_payout_per_clip > 0 AND v_payout_amount > v_campaign.max_payout_per_clip THEN
        v_payout_amount := v_campaign.max_payout_per_clip;
    END IF;

    -- Enforce remaining budget cap (cannot go negative)
    IF v_payout_amount > v_campaign.remaining_budget THEN
        v_payout_amount := v_campaign.remaining_budget;
    END IF;

    IF v_payout_amount <= 0 THEN
        RAISE EXCEPTION 'Approved payout amount must be greater than 0.';
    END IF;

    -- Deduct remaining budget
    UPDATE campaigns 
    SET remaining_budget = remaining_budget - v_payout_amount,
        status = CASE WHEN remaining_budget - v_payout_amount <= 0 THEN 'COMPLETED'::campaign_status ELSE status END,
        updated_at = NOW()
    WHERE id = v_campaign.id;

    -- Update submission status
    UPDATE submissions 
    SET status = 'APPROVED', updated_at = NOW() 
    WHERE id = p_submission_id;

    -- Record review
    INSERT INTO submission_reviews (
        submission_id, reviewer_id, decision, admin_note
    ) VALUES (
        p_submission_id, p_reviewer_id, 'APPROVED', p_admin_note
    );

    -- Record earning
    INSERT INTO earnings (
        clipper_id, campaign_id, submission_id, views, cpm, calculated_amount, approved_amount, status, approved_at
    ) VALUES (
        v_submission.clipper_id, v_campaign.id, p_submission_id, p_verified_views, v_campaign.cpm_rate, v_payout_amount, v_payout_amount, 'APPROVED', NOW()
    ) RETURNING id INTO v_earning_id;

    -- Calculate current balance for balance_after record
    SELECT COALESCE(
        SUM(CASE 
            WHEN type IN ('CREDIT_EARNING', 'ADJUSTMENT_CREDIT') THEN amount 
            WHEN type IN ('DEBIT_WITHDRAWAL_LOCK', 'DEBIT_WITHDRAWAL_SETTLED', 'ADJUSTMENT_DEBIT') THEN -amount 
            ELSE 0 
        END), 0
    ) INTO v_current_balance
    FROM wallet_transactions
    WHERE user_id = v_submission.clipper_id;

    -- Credit clipper wallet ledger
    INSERT INTO wallet_transactions (
        user_id, type, amount, balance_after, reference_type, reference_id, description
    ) VALUES (
        v_submission.clipper_id,
        'CREDIT_EARNING',
        v_payout_amount,
        v_current_balance + v_payout_amount,
        'EARNING',
        v_earning_id,
        format('Approved clip earnings: %s verified views on %s', p_verified_views, v_submission.platform)
    );

    RETURN v_earning_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
