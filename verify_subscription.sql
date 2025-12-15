-- Verify the subscription was created successfully by the webhook

-- Check for the specific subscription
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

-- Check all trialing subscriptions
SELECT
  COUNT(*) as total_trialing,
  array_agg(stripe_subscription_id) as subscription_ids
FROM user_subscriptions
WHERE status = 'trialing';

-- Check all subscriptions for this email (need to join with auth.users)
-- This will show if the subscription exists in database
SELECT
  s.id,
  s.stripe_subscription_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  u.email
FROM user_subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE u.email = 'vvkvwoxarocklobssj@nespj.com';
