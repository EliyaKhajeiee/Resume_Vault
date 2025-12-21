-- Create user_interview_access table to track which industries users have accessed
CREATE TABLE IF NOT EXISTS user_interview_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  question_id UUID NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, question_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_interview_access_user_id ON user_interview_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interview_access_role ON user_interview_access(role);
CREATE INDEX IF NOT EXISTS idx_user_interview_access_user_role ON user_interview_access(user_id, role);

-- Enable Row Level Security
ALTER TABLE user_interview_access ENABLE ROW LEVEL SECURITY;

-- Users can only see their own access records
CREATE POLICY "Users can view their own interview access"
  ON user_interview_access FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own access records
CREATE POLICY "Users can insert their own interview access"
  ON user_interview_access FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users (admins) can see all access records
CREATE POLICY "Admins can view all interview access"
  ON user_interview_access FOR SELECT
  TO authenticated
  USING (true);
