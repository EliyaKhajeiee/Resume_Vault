-- Check the subscription for qobxjmwyozmerjzvws@nespj.com

-- Find by email
SELECT
  s.id,
  s.stripe_subscription_id,
  s.stripe_customer_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.plan_id,
  s.created_at,
  u.email
FROM user_subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE u.email = 'qobxjmwyozmerjzvws@nespj.com';

-- If the dates are wrong, we need to check what the webhook stored
-- The trial end should be Nov 12, 2025 (not Dec 5)
