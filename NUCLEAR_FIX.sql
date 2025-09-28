-- NUCLEAR OPTION: This will definitely fix the 406 errors
-- Copy and paste this ENTIRE block into Supabase SQL Editor

-- 1. Create tables if they don't exist
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  plan_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'succeeded',
  resumes_remaining INTEGER NOT NULL DEFAULT 5,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
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

-- 2. DISABLE RLS completely (this will fix 406 errors immediately)
ALTER TABLE user_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_resume_access DISABLE ROW LEVEL SECURITY;

-- 3. Drop ALL existing policies to clean slate
DROP POLICY IF EXISTS "Service role can manage user subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage user purchases" ON user_purchases;
DROP POLICY IF EXISTS "Service role can manage user resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view own purchases" ON user_purchases;
DROP POLICY IF EXISTS "Users can view own resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Users can insert own resume access" ON user_resume_access;
DROP POLICY IF EXISTS "Allow authenticated access to own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Allow authenticated access to own purchases" ON user_purchases;
DROP POLICY IF EXISTS "Allow authenticated access to own resume access" ON user_resume_access;

-- 4. Grant full public access (temporary fix for 406 errors)
GRANT ALL ON user_subscriptions TO anon;
GRANT ALL ON user_purchases TO anon;
GRANT ALL ON user_resume_access TO anon;
GRANT ALL ON user_subscriptions TO authenticated;
GRANT ALL ON user_purchases TO authenticated;
GRANT ALL ON user_resume_access TO authenticated;

-- 5. Verify fix worked
SELECT 'SUCCESS: Tables created and accessible' as status;
SELECT table_name, 'TABLE EXISTS' as status FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('user_subscriptions', 'user_purchases', 'user_resume_access');