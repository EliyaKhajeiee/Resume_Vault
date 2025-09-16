-- Create a test purchase for a user
-- Replace 'your-user-id-here' with the actual user ID you want to test with

-- First, let's see what users exist (uncomment to run)
-- SELECT id, email FROM auth.users LIMIT 5;

-- Create a test purchase record for the $1.01 resume pack
INSERT INTO user_purchases (
    user_id,
    stripe_payment_intent_id,
    plan_id,
    amount,
    status,
    resumes_remaining,
    expires_at,
    created_at,
    updated_at
) VALUES (
    'your-user-id-here', -- Replace with actual user ID
    'pi_test_' || gen_random_uuid()::text, -- Fake payment intent ID for testing
    'access-pack',
    1.01,
    'succeeded',
    5, -- 5 resumes available
    NOW() + INTERVAL '30 days', -- Expires in 30 days
    NOW(),
    NOW()
);

-- Verify the purchase was created
SELECT * FROM user_purchases WHERE user_id = 'your-user-id-here';