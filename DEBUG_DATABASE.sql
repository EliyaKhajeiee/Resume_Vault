-- DEBUG: Check database state and fix issues properly
-- Run this in Supabase SQL Editor to diagnose the problem

-- 1. Check if tables exist
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_subscriptions', 'user_resume_access', 'user_purchases');

-- 2. Check table structures
\d user_subscriptions;
\d user_resume_access;
\d user_purchases;

-- 3. Check current RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_subscriptions', 'user_resume_access', 'user_purchases');

-- 4. Check existing policies
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('user_subscriptions', 'user_resume_access', 'user_purchases')
ORDER BY tablename, policyname;

-- 5. Check if service_role exists and has permissions
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb
FROM pg_roles
WHERE rolname = 'service_role';

-- 6. Check table permissions for service_role
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE table_name IN ('user_subscriptions', 'user_resume_access', 'user_purchases')
AND grantee = 'service_role';