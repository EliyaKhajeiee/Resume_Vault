-- This script helps identify and fix subscriptions that are marked as 'canceled'
-- in the database but might still be active in Stripe
--
-- IMPORTANT: After running this query, you need to manually verify each subscription
-- in Stripe dashboard and either:
-- 1. Cancel it in Stripe if user wanted to cancel
-- 2. Update database to 'active' if user should still have access

-- Step 1: Find all subscriptions marked as canceled in database
SELECT
  id,
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  plan_id,
  status,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
FROM user_subscriptions
WHERE status = 'canceled'
  AND current_period_end > NOW() -- Still within paid period
ORDER BY updated_at DESC;

-- Step 2: After manually verifying in Stripe, use these queries to fix:

-- If subscription IS actually canceled in Stripe (cancel_at_period_end = true):
-- No action needed - status is correct

-- If subscription is STILL ACTIVE in Stripe and should be canceled:
-- Go to Stripe dashboard and cancel it manually, or use the Stripe CLI:
-- stripe subscriptions update sub_xxx --cancel-at-period-end=true

-- If subscription is STILL ACTIVE in Stripe and should stay active:
-- UPDATE user_subscriptions
-- SET status = 'active', updated_at = NOW()
-- WHERE stripe_subscription_id = 'sub_xxx';

-- Step 3: Find subscriptions with generated IDs (these are problematic)
SELECT
  id,
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  plan_id,
  status,
  current_period_start,
  current_period_end
FROM user_subscriptions
WHERE stripe_subscription_id LIKE 'sub_generated_%'
   OR stripe_subscription_id LIKE 'sub_from_invoice_%'
ORDER BY created_at DESC;

-- For these, you need to:
-- 1. Get the customer ID from the row
-- 2. Find the real subscription ID in Stripe dashboard
-- 3. Update the database:
-- UPDATE user_subscriptions
-- SET stripe_subscription_id = 'real_sub_id_from_stripe'
-- WHERE id = 'uuid_from_above_query';
