-- COMPLETE DATABASE FIX - Run this in Supabase SQL Editor
-- This combines all your migrations with proper syntax

-- 1. Create all tables (from your migration files)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_resume_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resume_id)
);

CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  plan_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed')),
  resumes_remaining INTEGER NOT NULL DEFAULT 5,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on all tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resume_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- 3. Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view own resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Users can insert own resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Users can view own purchases" ON user_purchases;
DROP POLICY IF EXISTS "Service role can manage user subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage user resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Service role can manage user purchases" ON user_purchases;

-- 4. Create service role policies (FIXED SYNTAX - no IF NOT EXISTS)
CREATE POLICY "Service role can manage user subscriptions"
ON user_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage user resume access"
ON user_resume_access
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage user purchases"
ON user_purchases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Create user policies
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own resume access" ON user_resume_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume access" ON user_resume_access
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own purchases" ON user_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- 6. Create all indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_resume_access_user_id ON user_resume_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_resume_access_resume_id ON user_resume_access(resume_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_stripe_payment_intent ON user_purchases(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_status ON user_purchases(status);
CREATE INDEX IF NOT EXISTS idx_user_purchases_expires_at ON user_purchases(expires_at);

-- 7. Grant permissions to service_role
GRANT ALL ON user_subscriptions TO service_role;
GRANT ALL ON user_resume_access TO service_role;
GRANT ALL ON user_purchases TO service_role;

-- 8. Verify everything worked
SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_subscriptions', 'user_resume_access', 'user_purchases');

SELECT 'RLS enabled:' as status;
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_subscriptions', 'user_resume_access', 'user_purchases');

SELECT 'Policies created:' as status;
SELECT tablename, policyname FROM pg_policies
WHERE tablename IN ('user_subscriptions', 'user_resume_access', 'user_purchases')
ORDER BY tablename, policyname;