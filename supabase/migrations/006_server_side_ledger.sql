-- ClipCart - campaigns, submissions, earnings, wallet and withdrawals live in Supabase
-- Until now these lived in each browser's localStorage, so a payout recorded on the admin's browser never reached
-- clippers or visitors, and clips submitted on a clipper's phone never reached the admin. The app's API routes now
-- read and write these tables with the service role; money moves only inside the functions below (row locks, one
-- transaction each). Browsers keep no direct write access.

-- 1. Admin actions come from the admin desk (passcode session), which has no profiles row
ALTER TABLE public.submission_reviews ALTER COLUMN reviewer_id DROP NOT NULL;
ALTER TABLE public.payment_records ALTER COLUMN verified_by DROP NOT NULL;

-- 2. Campaign platforms on the campaign row (the app always reads them together)
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS platforms public.platform_type[] NOT NULL DEFAULT '{}';

-- 3. A PAID withdrawal must carry the bKash / bank TrxID
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_paid_withdrawal_has_trx_ref') THEN
    ALTER TABLE public.withdrawal_requests ADD CONSTRAINT check_paid_withdrawal_has_trx_ref
      CHECK (status <> 'PAID' OR (transaction_reference IS NOT NULL AND length(trim(transaction_reference)) >= 6));
  END IF;
END $$;

-- 4. Wallet balance from the immutable ledger
CREATE OR REPLACE FUNCTION public.wallet_balance(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT COALESCE(SUM(CASE
           WHEN type IN ('CREDIT_EARNING', 'ADJUSTMENT_CREDIT') THEN amount
           WHEN type IN ('DEBIT_WITHDRAWAL_LOCK', 'DEBIT_WITHDRAWAL_SETTLED', 'ADJUSTMENT_DEBIT') THEN -amount
           ELSE 0 END), 0)
  FROM wallet_transactions WHERE user_id = p_user_id;
$$;

-- 5. Approve a clip: earning + budget deduction + wallet credit + clipper totals, all or nothing.
--    The campaign row is locked, so two approvals can never spend the same budget.
CREATE OR REPLACE FUNCTION public.approve_submission(p_submission_id UUID, p_verified_views BIGINT, p_admin_note TEXT DEFAULT NULL)
RETURNS TABLE (earning_id UUID, approved_amount NUMERIC, remaining_budget NUMERIC)
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_sub submissions%ROWTYPE;
  v_camp campaigns%ROWTYPE;
  v_views BIGINT;
  v_gross NUMERIC(12,2);
  v_amount NUMERIC(12,2);
  v_earning UUID;
  v_balance NUMERIC(12,2);
BEGIN
  SELECT * INTO v_sub FROM submissions WHERE id = p_submission_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Submission not found.'; END IF;
  IF v_sub.status IN ('APPROVED', 'REJECTED') THEN
    RAISE EXCEPTION 'This submission was already reviewed (%).', v_sub.status;
  END IF;

  SELECT * INTO v_camp FROM campaigns WHERE id = v_sub.campaign_id FOR UPDATE;
  IF p_verified_views < v_camp.min_views THEN
    RAISE EXCEPTION 'Submission has % views, which is less than the campaign minimum of % views.', p_verified_views, v_camp.min_views;
  END IF;

  v_views := CASE WHEN v_camp.max_views IS NOT NULL THEN LEAST(p_verified_views, v_camp.max_views) ELSE p_verified_views END;
  v_gross := CASE WHEN v_camp.payout_type = 'CPM' THEN ROUND(v_views::NUMERIC / 1000 * v_camp.cpm_rate, 2) ELSE v_camp.fixed_reward END;
  v_amount := v_gross;
  IF v_camp.max_payout_per_clip > 0 AND v_amount > v_camp.max_payout_per_clip THEN v_amount := v_camp.max_payout_per_clip; END IF;
  IF v_amount > v_camp.remaining_budget THEN v_amount := v_camp.remaining_budget; END IF;
  IF v_amount <= 0 THEN RAISE EXCEPTION 'The campaign budget is used up; nothing left to pay for this clip.'; END IF;

  UPDATE campaigns SET remaining_budget = remaining_budget - v_amount, updated_at = NOW() WHERE id = v_camp.id;
  UPDATE submissions SET status = 'APPROVED', updated_at = NOW() WHERE id = v_sub.id;
  INSERT INTO submission_reviews (submission_id, decision, admin_note) VALUES (v_sub.id, 'APPROVED', p_admin_note);
  INSERT INTO clip_views (submission_id, views_count, notes) VALUES (v_sub.id, p_verified_views, p_admin_note);

  INSERT INTO earnings (clipper_id, campaign_id, submission_id, views, cpm, calculated_amount, approved_amount, status, approved_at)
  VALUES (v_sub.clipper_id, v_camp.id, v_sub.id, p_verified_views, v_camp.cpm_rate, v_gross, v_amount, 'APPROVED', NOW())
  RETURNING id INTO v_earning;

  PERFORM pg_advisory_xact_lock(hashtext('wallet:' || v_sub.clipper_id::text));
  v_balance := wallet_balance(v_sub.clipper_id);
  INSERT INTO wallet_transactions (user_id, type, amount, balance_after, reference_type, reference_id, description)
  VALUES (v_sub.clipper_id, 'CREDIT_EARNING', v_amount, v_balance + v_amount, 'EARNING', v_earning,
          format('Approved clip payout (%s verified views on %s)', p_verified_views, v_sub.platform));

  UPDATE clipper_profiles
  SET approved_views_total = approved_views_total + p_verified_views,
      approved_earnings_total = approved_earnings_total + v_amount,
      approved_clips_total = approved_clips_total + 1,
      updated_at = NOW()
  WHERE user_id = v_sub.clipper_id;

  RETURN QUERY SELECT v_earning, v_amount, v_camp.remaining_budget - v_amount;
END $$;

-- 6. Withdrawal request: balance check and fund lock in one transaction (per-user lock blocks double spends)
CREATE OR REPLACE FUNCTION public.request_withdrawal(p_user_id UUID, p_amount NUMERIC, p_payment_method public.payment_method_type, p_payment_identifier TEXT)
RETURNS UUID
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_status user_status;
  v_balance NUMERIC(12,2);
  v_id UUID;
BEGIN
  SELECT status INTO v_status FROM profiles WHERE id = p_user_id;
  IF v_status IS DISTINCT FROM 'APPROVED' THEN
    RAISE EXCEPTION 'Only verified clippers with an APPROVED account can request withdrawals.';
  END IF;
  IF p_amount < 50 THEN RAISE EXCEPTION 'Minimum withdrawal amount is ৳50.'; END IF;

  PERFORM pg_advisory_xact_lock(hashtext('wallet:' || p_user_id::text));
  v_balance := wallet_balance(p_user_id);
  IF p_amount > v_balance THEN
    RAISE EXCEPTION 'Insufficient available balance. You have ৳% available.', v_balance;
  END IF;

  INSERT INTO withdrawal_requests (user_id, amount, payment_method, payment_identifier, status)
  VALUES (p_user_id, p_amount, p_payment_method, p_payment_identifier, 'REQUESTED')
  RETURNING id INTO v_id;

  INSERT INTO wallet_transactions (user_id, type, amount, balance_after, reference_type, reference_id, description)
  VALUES (p_user_id, 'DEBIT_WITHDRAWAL_LOCK', p_amount, v_balance - p_amount, 'WITHDRAWAL_REQUEST', v_id,
          format('Withdrawal request locked for %s payout to ****%s', p_payment_method, right(p_payment_identifier, 4)));
  RETURN v_id;
END $$;

-- 7. Reject a withdrawal and return the locked funds exactly once
CREATE OR REPLACE FUNCTION public.reject_withdrawal(p_withdrawal_id UUID, p_admin_note TEXT)
RETURNS UUID
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_wd withdrawal_requests%ROWTYPE;
  v_balance NUMERIC(12,2);
BEGIN
  UPDATE withdrawal_requests
  SET status = 'REJECTED', admin_note = p_admin_note, reviewed_at = NOW(), updated_at = NOW()
  WHERE id = p_withdrawal_id AND status IN ('REQUESTED', 'UNDER_REVIEW')
  RETURNING * INTO v_wd;
  IF NOT FOUND THEN RAISE EXCEPTION 'Withdrawal not found or already settled; refund prevented.'; END IF;

  PERFORM pg_advisory_xact_lock(hashtext('wallet:' || v_wd.user_id::text));
  v_balance := wallet_balance(v_wd.user_id);
  INSERT INTO wallet_transactions (user_id, type, amount, balance_after, reference_type, reference_id, description)
  VALUES (v_wd.user_id, 'ADJUSTMENT_CREDIT', v_wd.amount, v_balance + v_wd.amount, 'WITHDRAWAL_REJECTED', v_wd.id,
          format('Reversal of locked funds for rejected withdrawal: %s', p_admin_note));
  RETURN v_wd.id;
END $$;

-- 8. Only the server (service role) may call these
REVOKE ALL ON FUNCTION public.wallet_balance(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.approve_submission(UUID, BIGINT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.request_withdrawal(UUID, NUMERIC, public.payment_method_type, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reject_withdrawal(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_balance(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.approve_submission(UUID, BIGINT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(UUID, NUMERIC, public.payment_method_type, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.reject_withdrawal(UUID, TEXT) TO service_role;

-- 9. Browsers write nothing directly: the old anon/auth.uid() write policies are dead weight (the app does not use
--    Supabase Auth) and "Anyone can submit a client request" let the publishable key spam the CRM table
DROP POLICY IF EXISTS "Anyone can submit a client request" ON public.client_requests;
DROP POLICY IF EXISTS "Clippers can insert submissions to active campaigns" ON public.submissions;
DROP POLICY IF EXISTS "Clippers can create withdrawal request" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Clippers can view and create own withdrawal requests" ON public.withdrawal_requests;

-- 10. Seed the live launch campaign (ends 26 Nov 2026 23:59 Dhaka) and the WhatsApp settings row
INSERT INTO public.campaigns (
  id, title, slug, client_name, description, category, status, total_budget, remaining_budget, payout_type, cpm_rate,
  fixed_reward, max_payout_per_clip, min_views, max_views, start_date, end_date, platforms, rules, restrictions,
  source_url, example_url
) VALUES (
  '3f6b1c2e-6d1a-4c7e-9b8a-1a2b3c4d5e01', 'ClipCart Launch Campaign', 'clip-cart-launch-campaign', 'ClipCart BD',
  'ClipCart প্ল্যাটফর্মের অফিসিয়াল লঞ্চ ক্যাম্পেইন! ClipCart কীভাবে কাজ করে, ক্লিপারদের ০% ফি এবং মাত্র ৳৫০ মিনিমাম বিকাশে ক্যাশআউট নিয়ে ক্রিয়েটিভ শর্টস, টিকটক ও রিলস তৈরি করে আয় করুন। প্রতি ১,০০০ ভিউয়ে নিশ্চিত ৳৫০ CPM!',
  'Tech & Creator Economy', 'ACTIVE', 1000, 1000, 'CPM', 50, 0, 500, 500, 20000,
  '2026-10-28T00:00:00+06:00', '2026-11-26T23:59:59+06:00', '{TIKTOK,INSTAGRAM,YOUTUBE,FACEBOOK}',
  '["ভিডিও অবশ্যই ৯:১৬ ভার্টিক্যাল ফরম্যাটে হতে হবে (২০-৫৮ সেকেন্ড)।", "অন-স্ক্রিন আকর্ষণীয় অ্যানিমেটেড বাংলা বা ইংরেজি ক্যাপশন থাকতে হবে।", "ক্যাপশনে @ClipCartBD ট্যাগ এবং #ClipCartBD হ্যাশট্যাগ ব্যবহার করতে হবে।", "ক্লিপারদের ০% ফি ও সরাসরি বিকাশে দ্রুত পেমেন্টের সুবিধা উল্লেখ করতে হবে।"]'::jsonb,
  '["কপিরাইটযুক্ত সাউন্ড বা অডিও ব্যবহার করা যাবে না যা প্ল্যাটফর্মে মিউট হয়।", "অপ্রাসঙ্গিক বা বিভ্রান্তিকর ক্লিকবেইট টাইটেল ব্যবহার করা যাবে না।"]'::jsonb,
  'https://drive.google.com/drive/folders/1sbIX8ZR-brKXhu8OXLnYIx7cSD2Z9EfH?usp=sharing',
  'https://www.instagram.com/clipcartbd/reel/DfCevivBc-6/'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.whatsapp_settings (id, community_name, community_invite_url, announcement_group_url, business_contact_number, campaign_template, is_enabled)
VALUES (1, 'ClipCart Bangladesh Creators', 'https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan', 'https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan',
        '+8801337142248', E'🔥 NEW CAMPAIGN ON CLIPCART: {{title}}\n💰 Budget: ৳{{budget}} | Rate: ৳{{cpm}}/1k views\n🎯 Platforms: {{platforms}}\n🔗 Join & Submit: {{url}}', TRUE)
ON CONFLICT (id) DO NOTHING;
