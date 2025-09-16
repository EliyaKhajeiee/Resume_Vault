-- Create cancellation_feedback table to store user feedback when they cancel subscriptions
CREATE TABLE IF NOT EXISTS cancellation_feedback (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription_id uuid REFERENCES user_subscriptions(id) ON DELETE SET NULL,
    stripe_subscription_id text NOT NULL,
    reason text NOT NULL,
    satisfaction text,
    comments text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE cancellation_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own feedback
CREATE POLICY "Users can insert their own cancellation feedback" ON cancellation_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own feedback (for admin purposes)
CREATE POLICY "Users can view their own cancellation feedback" ON cancellation_feedback
    FOR SELECT USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_cancellation_feedback_user_id ON cancellation_feedback(user_id);
CREATE INDEX idx_cancellation_feedback_created_at ON cancellation_feedback(created_at);
CREATE INDEX idx_cancellation_feedback_reason ON cancellation_feedback(reason);