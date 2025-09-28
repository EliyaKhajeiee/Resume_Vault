-- Fix permissions for user_subscriptions table
-- Run this in Supabase SQL Editor

-- Grant permissions to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE, DELETE ON user_subscriptions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_subscriptions TO service_role;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Check current permissions
SELECT
    schemaname,
    tablename,
    grantor,
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'user_subscriptions';

-- Check if RLS is really disabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_subscriptions';