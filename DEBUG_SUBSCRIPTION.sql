-- Debug subscription status
-- Run this in Supabase SQL Editor to check current state

-- 1. Check if user_subscriptions table has any records
SELECT COUNT(*) as total_subscriptions FROM user_subscriptions;

-- 2. Check all users and their emails
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- 3. Check if there are any subscription records
SELECT * FROM user_subscriptions ORDER BY created_at DESC;

-- 4. Check the structure of user_subscriptions table
\d user_subscriptions;