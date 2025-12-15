-- Fix the trialing subscription that was incorrectly marked as canceled
-- This subscription should be status 'trialing', not 'canceled'

-- First, let's check what we have for this user
SELECT
  id,
  user_id,
  stripe_subscription_id,
  stripe_customer_id,
  plan_id,
  status,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
FROM user_subscriptions
WHERE stripe_subscription_id = 'sub_1SQJraAdBHYS516EKAxD5ezM'
   OR stripe_customer_id = 'cus_TN3zlC7FAqEfaR'
   OR user_id = '31e32998-3e58-469e-9d52-044174fde02d';

-- If the subscription exists but has wrong status, update it:
UPDATE user_subscriptions
SET
  status = 'trialing',
  updated_at = NOW()
WHERE stripe_subscription_id = 'sub_1SQJraAdBHYS516EKAxD5ezM'
  AND status != 'trialing';

-- Verify the fix:
SELECT
  id,
  user_id,
  stripe_subscription_id,
  status,
  current_period_end,
  CASE
    WHEN current_period_end > NOW() THEN 'Still in trial period'
    ELSE 'Trial ended'
  END as trial_status
FROM user_subscriptions
WHERE stripe_subscription_id = 'sub_1SQJraAdBHYS516EKAxD5ezM';
