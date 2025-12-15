SELECT
  s.id,
  s.user_id,
  s.stripe_subscription_id,
  s.status,
  s.trial_start,
  s.trial_end,
  s.current_period_start,
  s.current_period_end,
  s.created_at,
  au.email
FROM subscriptions s
JOIN auth.users au ON s.user_id = au.id
WHERE au.email = 'mbvkyerpcpbmcxfpoe@nespf.com'
ORDER BY s.created_at DESC
LIMIT 1;
