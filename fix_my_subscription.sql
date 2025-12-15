-- Manual fix for subscription record
-- Subscription ID: sub_1SP5GbAdBHYS516EK7VCfYHg
-- Customer ID: cus_TLmqns269qrcAX
-- User ID: cc99e9ab-bf17-4d03-8c07-fbd5cafab3a3 (from the earlier one) OR the new one from evjiatekgtrpneqyzb@nespj.com

-- First, let's find your user ID from your email
SELECT id, email FROM auth.users WHERE email = 'evjiatekgtrpneqyzb@nespj.com';

-- Then insert the subscription record
INSERT INTO user_subscriptions (
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  plan_id,
  status,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_FROM_ABOVE', -- Replace with actual user ID
  'cus_TLmqns269qrcAX',
  'sub_1SP5GbAdBHYS516EK7VCfYHg',
  'pro-monthly',
  'active', -- Change to 'trialing' if it should be in trial
  '2025-11-02T09:40:40Z',
  '2025-12-02T09:40:40Z', -- 1 month from start
  NOW(),
  NOW()
);
