-- CLIPBD Database Migration 001: Initial Schema
-- Production PostgreSQL Architecture

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'CLIENT', 'CLIPPER');
CREATE TYPE user_status AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED', 'BANNED');
CREATE TYPE campaign_status AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
CREATE TYPE payout_type AS ENUM ('CPM', 'FIXED');
CREATE TYPE platform_type AS ENUM ('TIKTOK', 'INSTAGRAM', 'YOUTUBE');
CREATE TYPE submission_status AS ENUM ('PENDING_AI_REVIEW', 'PENDING_HUMAN_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED', 'WITHDRAWN');
CREATE TYPE review_decision AS ENUM ('APPROVED', 'REJECTED', 'REQUEST_CHANGES');
CREATE TYPE payment_method_type AS ENUM ('BKASH', 'NAGAD', 'BANK', 'CASH', 'OTHER');
CREATE TYPE withdrawal_status AS ENUM ('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'PROCESSING', 'PAID', 'REJECTED', 'CANCELLED');
CREATE TYPE transaction_type AS ENUM ('CREDIT_EARNING', 'DEBIT_WITHDRAWAL_LOCK', 'DEBIT_WITHDRAWAL_SETTLED', 'ADJUSTMENT_CREDIT', 'ADJUSTMENT_DEBIT');
CREATE TYPE client_request_status AS ENUM ('NEW', 'CONTACTED', 'NEGOTIATING', 'PAYMENT_PENDING', 'ACTIVE', 'COMPLETED', 'REJECTED');
CREATE TYPE notification_type AS ENUM ('NEW_CAMPAIGN', 'SUBMISSION_APPROVED', 'SUBMISSION_REJECTED', 'EARNINGS_UPDATED', 'WITHDRAWAL_REQUESTED', 'WITHDRAWAL_PAID', 'CAMPAIGN_ENDING', 'SYSTEM_ANNOUNCEMENT');

-- 2. USERS & PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'CLIPPER',
    full_name TEXT NOT NULL,
    phone_whatsapp TEXT,
    country TEXT NOT NULL DEFAULT 'Bangladesh',
    status user_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clipper_profiles (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    tiktok_handle TEXT,
    instagram_handle TEXT,
    youtube_handle TEXT,
    preferred_platforms platform_type[] DEFAULT '{}',
    editing_experience TEXT,
    portfolio_url TEXT,
    payment_method payment_method_type NOT NULL DEFAULT 'BKASH',
    payment_identifier TEXT, -- Stored securely, strictly masked in public queries
    approved_views_total BIGINT NOT NULL DEFAULT 0,
    approved_earnings_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    approved_clips_total INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status campaign_status NOT NULL DEFAULT 'DRAFT',
    total_budget NUMERIC(12,2) NOT NULL CHECK (total_budget >= 0),
    remaining_budget NUMERIC(12,2) NOT NULL CHECK (remaining_budget >= 0),
    payout_type payout_type NOT NULL DEFAULT 'CPM',
    cpm_rate NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (cpm_rate >= 0),
    fixed_reward NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (fixed_reward >= 0),
    max_payout_per_clip NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (max_payout_per_clip >= 0),
    min_views INT NOT NULL DEFAULT 0 CHECK (min_views >= 0),
    max_views INT CHECK (max_views IS NULL OR max_views >= min_views),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL CHECK (end_date > start_date),
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    restrictions JSONB NOT NULL DEFAULT '[]'::jsonb,
    source_url TEXT NOT NULL, -- External storage link (e.g. Google Drive); never store raw heavy videos in DB
    example_url TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    UNIQUE(campaign_id, platform)
);

-- 4. SUBMISSIONS & MODERATION
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
    clipper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    platform platform_type NOT NULL,
    post_url TEXT NOT NULL,
    caption TEXT,
    notes TEXT,
    status submission_status NOT NULL DEFAULT 'PENDING_AI_REVIEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_post_url_per_campaign UNIQUE(campaign_id, post_url)
);

CREATE TABLE IF NOT EXISTS submission_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE REFERENCES submissions(id) ON DELETE CASCADE,
    compliance_score INT NOT NULL CHECK (compliance_score BETWEEN 0 AND 100),
    duplicate_probability INT NOT NULL CHECK (duplicate_probability BETWEEN 0 AND 100),
    suspicion_score INT NOT NULL CHECK (suspicion_score BETWEEN 0 AND 100),
    rule_violations JSONB NOT NULL DEFAULT '[]'::jsonb,
    reasoning_summary TEXT,
    recommended_queue TEXT NOT NULL DEFAULT 'HUMAN_REVIEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submission_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    decision review_decision NOT NULL,
    rejection_reason TEXT,
    admin_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clip_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    views_count BIGINT NOT NULL CHECK (views_count >= 0),
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT
);

-- 5. EARNINGS & FINANCIAL LEDGER
CREATE TABLE IF NOT EXISTS earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clipper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
    submission_id UUID NOT NULL UNIQUE REFERENCES submissions(id) ON DELETE RESTRICT,
    views BIGINT NOT NULL DEFAULT 0,
    cpm NUMERIC(10,2) NOT NULL DEFAULT 0,
    calculated_amount NUMERIC(12,2) NOT NULL CHECK (calculated_amount >= 0),
    approved_amount NUMERIC(12,2) NOT NULL CHECK (approved_amount >= 0),
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

-- Auditable Immutable Double-Entry Ledger
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    type transaction_type NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(12,2) NOT NULL CHECK (balance_after >= 0),
    reference_type TEXT NOT NULL,
    reference_id UUID,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_method payment_method_type NOT NULL,
    payment_identifier TEXT NOT NULL,
    status withdrawal_status NOT NULL DEFAULT 'REQUESTED',
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    transaction_reference TEXT, -- MANDATORY when status = 'PAID'
    admin_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CLIENT CAMPAIGN PAYMENTS
CREATE TABLE IF NOT EXISTS payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_method payment_method_type NOT NULL,
    transaction_reference TEXT NOT NULL,
    verified_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    admin_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CLIENT REQUEST PIPELINE (CRM)
CREATE TABLE IF NOT EXISTS client_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company_creator TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT NOT NULL,
    campaign_objective TEXT NOT NULL,
    platforms platform_type[] DEFAULT '{}',
    estimated_budget NUMERIC(12,2) NOT NULL CHECK (estimated_budget >= 0),
    duration TEXT NOT NULL,
    content_type TEXT NOT NULL,
    source_url TEXT,
    requirements TEXT,
    status client_request_status NOT NULL DEFAULT 'NEW',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. WHATSAPP CONFIGURATION & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS whatsapp_settings (
    id INT PRIMARY KEY DEFAULT 1,
    community_name TEXT,
    community_invite_url TEXT,
    announcement_group_url TEXT,
    business_contact_number TEXT,
    campaign_template TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_submissions_campaign_status ON submissions(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_clipper ON submissions(clipper_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON wallet_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);
