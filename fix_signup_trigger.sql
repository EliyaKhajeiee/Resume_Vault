-- Fix user signup issue by removing problematic email preferences trigger
-- This prevents the "Database error saving new user" issue

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS create_user_email_preferences ON auth.users;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS create_default_email_preferences();

-- Drop the email_preferences table if it exists (it was causing the issue)
DROP TABLE IF EXISTS email_preferences CASCADE;

-- Remove any existing policies
DROP POLICY IF EXISTS "Users can view their own email preferences" ON email_preferences;
DROP POLICY IF EXISTS "Users can insert their own email preferences" ON email_preferences;
DROP POLICY IF EXISTS "Users can update their own email preferences" ON email_preferences;