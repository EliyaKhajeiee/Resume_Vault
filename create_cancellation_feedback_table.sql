-- Create cancellation_feedback table to store subscription cancellation reasons
CREATE TABLE IF NOT EXISTS cancellation_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    comments TEXT,
    satisfaction TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on subscription_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_cancellation_feedback_subscription_id
ON cancellation_feedback(subscription_id);

-- Add RLS policy to allow users to read their own feedback (optional)
ALTER TABLE cancellation_feedback ENABLE ROW LEVEL SECURITY;

-- Allow service role to read/write all data
CREATE POLICY IF NOT EXISTS "Service role can manage cancellation feedback"
ON cancellation_feedback
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);