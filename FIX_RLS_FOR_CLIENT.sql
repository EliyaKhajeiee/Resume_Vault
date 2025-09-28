-- FIX RLS POLICIES FOR CLIENT-SIDE ACCESS
-- The issue: client uses anon key but policies only allow authenticated/service_role
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view own resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Users can insert own resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Users can view own purchases" ON user_purchases;

-- Create new policies that work with both authenticated AND anon (when user is logged in)
CREATE POLICY "Allow authenticated access to own subscriptions"
ON user_subscriptions
FOR ALL
TO authenticated, anon
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);

CREATE POLICY "Allow authenticated access to own purchases"
ON user_purchases
FOR ALL
TO authenticated, anon
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);

CREATE POLICY "Allow authenticated access to own resume access"
ON user_resume_access
FOR ALL
TO authenticated, anon
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);

-- Verify policies were created
SELECT tablename, policyname, roles FROM pg_policies
WHERE tablename IN ('user_subscriptions', 'user_purchases', 'user_resume_access')
ORDER BY tablename, policyname;