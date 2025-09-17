-- Add service role policies for user_subscriptions table
CREATE POLICY IF NOT EXISTS "Service role can manage user subscriptions"
ON user_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add service role policies for user_resume_access table
CREATE POLICY IF NOT EXISTS "Service role can manage user resume access"
ON user_resume_access
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add service role policies for user_purchases table
CREATE POLICY IF NOT EXISTS "Service role can manage user purchases"
ON user_purchases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);