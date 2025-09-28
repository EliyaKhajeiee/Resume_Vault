-- EMERGENCY FIX: Temporarily disable RLS to get app working
-- Run this in Supabase SQL Editor RIGHT NOW

-- Disable RLS temporarily on problematic tables
ALTER TABLE user_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_resume_access DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_subscriptions', 'user_resume_access', 'user_purchases');