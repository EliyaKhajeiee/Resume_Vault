-- URGENT FIX: Remove problematic email preferences trigger
-- This is causing "Database error saving new user" during signup

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS create_user_email_preferences ON auth.users;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS create_default_email_preferences();

-- Drop the email_preferences table if it exists
DROP TABLE IF EXISTS email_preferences CASCADE;