-- ClipCart - approve_submission: its output columns (approved_amount, remaining_budget) share names with table
-- columns, so plain column references were ambiguous; resolve them to the columns.
CREATE OR REPLACE FUNCTION public.approve_submission(p_submission_id UUID, p_verified_views BIGINT, p_admin_note TEXT DEFAULT NULL)
RETURNS TABLE (earning_id UUID, approved_amount NUMERIC, remaining_budget NUMERIC)
LANGUAGE plpgsql SET search_path = public AS $$
#variable_conflict use_column
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

REVOKE ALL ON FUNCTION public.approve_submission(UUID, BIGINT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_submission(UUID, BIGINT, TEXT) TO service_role;
