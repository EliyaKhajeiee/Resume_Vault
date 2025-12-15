-- Fix the trial subscription to show correct end date
-- sub_1SPWJxAdBHYS516Eu7eaFIh9
-- Should end on November 10, 2025 (7 days from November 3)

UPDATE user_subscriptions
SET
  status = 'trialing',
  current_period_end = '2025-11-10T22:33:51.000Z',
  updated_at = NOW()
WHERE stripe_subscription_id = 'sub_1SPWJxAdBHYS516Eu7eaFIh9';
