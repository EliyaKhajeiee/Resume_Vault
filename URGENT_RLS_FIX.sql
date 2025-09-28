-- URGENT: Run this SQL in your Supabase SQL Editor to fix 406 errors
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- First, check if tables exist and have RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('user_subscriptions', 'user_resume_access', 'user_purchases');

-- Ensure RLS is enabled on all tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resume_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first
DROP POLICY IF EXISTS "Service role can manage user subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Enable authenticated users to view their own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;

DROP POLICY IF EXISTS "Service role can manage user resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Enable authenticated users to view their own resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Users can view own resume access" ON user_resume_access;

DROP POLICY IF EXISTS "Service role can manage user purchases" ON user_purchases;
DROP POLICY IF EXISTS "Enable authenticated users to view their own purchases" ON user_purchases;
DROP POLICY IF EXISTS "Users can view own purchases" ON user_purchases;

-- Create comprehensive policies for service role
CREATE POLICY "Service role full access user_subscriptions"
ON user_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access user_resume_access"
ON user_resume_access
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access user_purchases"
ON user_purchases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create policies for authenticated users to access their own data
CREATE POLICY "Users can access own subscriptions"
ON user_subscriptions
FOR ALL
TO authenticated
USING (auth.uid() = user_id::uuid)
WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can access own resume access"
ON user_resume_access
FOR ALL
TO authenticated
USING (auth.uid() = user_id::uuid)
WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can access own purchases"
ON user_purchases
FOR ALL
TO authenticated
USING (auth.uid() = user_id::uuid)
WITH CHECK (auth.uid() = user_id::uuid);

-- Grant necessary permissions to service_role
GRANT ALL ON user_subscriptions TO service_role;
GRANT ALL ON user_resume_access TO service_role;
GRANT ALL ON user_purchases TO service_role;

-- Grant usage on sequences if they exist
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Check that policies were created successfully
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('user_subscriptions', 'user_resume_access', 'user_purchases')
ORDER BY tablename, policyname;