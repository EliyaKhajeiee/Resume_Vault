-- Manually grant the user their paid $1.01 resume pack access
-- Customer: eliyakhajeiextra@gmail.com
-- Payment: $1.01 for 5 resumes, 30 days

-- First, find the user ID for eliyakhajeiextra@gmail.com
-- SELECT id FROM auth.users WHERE email = 'eliyakhajeiextra@gmail.com';

-- Then insert the purchase record (replace USER_ID_HERE with actual ID)
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
    -- Replace this with the actual user ID from the query above
    (SELECT id FROM auth.users WHERE email = 'eliyakhajeiextra@gmail.com'),
    'pi_3S7nPrAdBHYS516E0KsiOeAU', -- The actual payment intent from Stripe
    'access-pack',
    1.01,
    'succeeded',
    5, -- 5 resumes available
    NOW() + INTERVAL '30 days', -- Expires in 30 days
    NOW(),
    NOW()
);

-- Verify the purchase was created
SELECT
    up.*,
    u.email
FROM user_purchases up
JOIN auth.users u ON u.id = up.user_id
WHERE u.email = 'eliyakhajeiextra@gmail.com'
ORDER BY up.created_at DESC;