-- Check the latest trial signup
-- Email: mbvkyerpcpbmcxfpoe@nespf.com

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
WHERE u.email = 'mbvkyerpcpbmcxfpoe@nespf.com';
