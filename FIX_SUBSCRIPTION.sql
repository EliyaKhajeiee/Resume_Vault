-- MANUAL SUBSCRIPTION FIX
-- Run this in Supabase SQL Editor to manually create your subscription

-- First, find your user ID (replace YOUR_EMAIL with your actual email)
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL_HERE';

-- After getting your user ID from above, manually create subscription record
-- Replace USER_ID_HERE with your actual user ID from the query above
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
  'USER_ID_HERE',  -- Replace with your user ID
  'STRIPE_CUSTOMER_ID',  -- We'll need to get this from Stripe
  'STRIPE_SUBSCRIPTION_ID',  -- We'll need to get this from Stripe
  'pro-monthly',
  'active',
  '2025-09-18T13:01:17Z',  -- From your payment date
  '2025-10-18T13:01:17Z',  -- One month later
  NOW(),
  NOW()
);

-- Verify the subscription was created
SELECT * FROM user_subscriptions WHERE user_id = 'USER_ID_HERE';