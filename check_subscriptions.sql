-- Check all subscriptions, especially trials
SELECT
  id,
  user_id,
  stripe_subscription_id,
  stripe_customer_id,
  plan_id,
  status,
  current_period_start,
  current_period_end,
  created_at
FROM user_subscriptions
ORDER BY created_at DESC
LIMIT 20;

-- Check for trial subscriptions specifically
SELECT
  COUNT(*) as trial_count
FROM user_subscriptions
WHERE status = 'trialing';
