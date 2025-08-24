-- Reset resume access for all users (for testing purposes)
-- This will allow all users to view 1 resume again

-- Delete all resume access records
DELETE FROM user_resume_access;

-- Check if there are any user subscription records that might be interfering
SELECT 
  u.email,
  us.status as subscription_status,
  us.current_period_end,
  COUNT(ura.id) as resume_access_count
FROM auth.users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
LEFT JOIN user_resume_access ura ON u.id = ura.user_id
GROUP BY u.email, us.status, us.current_period_end
ORDER BY u.created_at DESC;

-- If you want to reset just specific emails, use this instead:
-- DELETE FROM user_resume_access 
-- WHERE user_id IN (
--   SELECT id FROM auth.users 
--   WHERE email IN ('your-test-email@example.com', 'another-test@example.com')
-- );