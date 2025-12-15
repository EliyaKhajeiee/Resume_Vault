-- Fix the current trial subscription that has wrong dates
-- Email: qobxjmwyozmerjzvws@nespj.com
-- Should be: Status "trialing", ends Nov 12 (not Dec 5)

-- First, check what we have
SELECT
  s.stripe_subscription_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  u.email
FROM user_subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE u.email = 'qobxjmwyozmerjzvws@nespj.com';

-- Fix the subscription to have correct trial dates
-- Trial should end on Nov 12, 2025 at 7:27 PM (1763004472 timestamp)
UPDATE user_subscriptions
SET
  status = 'trialing',
  current_period_end = '2025-11-12 19:27:52+00',  -- Nov 12, 2025 7:27 PM UTC
  updated_at = NOW()
FROM auth.users u
WHERE user_subscriptions.user_id = u.id
  AND u.email = 'qobxjmwyozmerjzvws@nespj.com';

-- Verify the fix
SELECT
  s.stripe_subscription_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  u.email,
  CASE
    WHEN s.current_period_end > NOW() THEN 'Trial still active'
    ELSE 'Trial ended'
  END as trial_status
FROM user_subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE u.email = 'qobxjmwyozmerjzvws@nespj.com';
