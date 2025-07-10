/*
  # Update resumes table and add sample data

  1. Table Updates
    - Ensure resumes table exists with all required columns
    - Add any missing columns if needed
    - Update existing policies if needed

  2. Sample Data
    - Insert sample resumes for testing
    - Include proper metadata and tags

  3. Functions
    - Create increment_view_count function for analytics
*/

-- Ensure the resumes table exists (it should from previous migration)
-- Add any missing columns that might not exist
DO $$
BEGIN
  -- Check if file_url column exists, add if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE resumes ADD COLUMN file_url text;
  END IF;

  -- Check if description column exists, add if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'description'
  ) THEN
    ALTER TABLE resumes ADD COLUMN description text;
  END IF;

  -- Check if tags column exists, add if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'tags'
  ) THEN
    ALTER TABLE resumes ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  -- Check if is_featured column exists, add if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE resumes ADD COLUMN is_featured boolean DEFAULT false;
  END IF;

  -- Check if view_count column exists, add if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE resumes ADD COLUMN view_count integer DEFAULT 0;
  END IF;
END $$;

-- Create additional indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_resumes_tags ON resumes USING GIN (tags);

-- Function to increment view count (replace if exists)
CREATE OR REPLACE FUNCTION increment_view_count(resume_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE resumes 
  SET view_count = view_count + 1 
  WHERE id = resume_id;
END;
$$ LANGUAGE plpgsql;

-- Clear existing sample data and insert fresh sample data
DELETE FROM resumes WHERE company IN ('Google', 'Meta', 'Netflix', 'Apple', 'Microsoft', 'Amazon', 'Tesla', 'McKinsey & Company', 'Goldman Sachs', 'Stripe', 'Airbnb', 'Uber');

-- Insert sample data
INSERT INTO resumes (title, company, role, industry, experience_level, description, tags, is_featured, view_count) VALUES
  ('Senior Software Engineer Resume - Google', 'Google', 'Software Engineer', 'Technology', 'Senior', 'Proven resume that landed a senior SWE role at Google. Highlights distributed systems experience and leadership skills.', ARRAY['python', 'java', 'distributed-systems', 'leadership'], true, 1247),
  
  ('Product Manager Resume - Meta', 'Meta', 'Product Manager', 'Technology', 'Mid-level', 'Successful PM resume for Meta focusing on user growth and data-driven decision making.', ARRAY['product-strategy', 'analytics', 'user-growth', 'sql'], true, 1156),
  
  ('Data Scientist Resume - Netflix', 'Netflix', 'Data Scientist', 'Technology', 'Mid-level', 'Data science resume that secured a role at Netflix. Emphasizes machine learning and recommendation systems.', ARRAY['machine-learning', 'python', 'sql', 'recommendation-systems'], false, 892),
  
  ('Software Engineer Resume - Apple', 'Apple', 'Software Engineer', 'Technology', 'Mid-level', 'iOS focused software engineer resume for Apple. Highlights mobile development and Swift expertise.', ARRAY['swift', 'ios', 'mobile-development', 'objective-c'], true, 1034),
  
  ('Engineering Manager Resume - Microsoft', 'Microsoft', 'Engineering Manager', 'Technology', 'Senior', 'Engineering leadership resume for Microsoft Azure team. Shows progression from IC to management.', ARRAY['leadership', 'azure', 'team-management', 'cloud'], false, 743),
  
  ('Data Engineer Resume - Amazon', 'Amazon', 'Data Engineer', 'Technology', 'Mid-level', 'Big data focused resume for Amazon. Emphasizes AWS services and large-scale data processing.', ARRAY['aws', 'spark', 'kafka', 'big-data'], false, 658),
  
  ('ML Engineer Resume - Tesla', 'Tesla', 'ML Engineer', 'Automotive', 'Senior', 'Machine learning engineer resume for Tesla Autopilot team. Focuses on computer vision and autonomous systems.', ARRAY['computer-vision', 'pytorch', 'autonomous-systems', 'python'], true, 987),
  
  ('Consultant Resume - McKinsey', 'McKinsey & Company', 'Management Consultant', 'Consulting', 'Mid-level', 'Strategy consulting resume for McKinsey. Highlights case study experience and client impact.', ARRAY['strategy', 'case-studies', 'client-management', 'analytics'], false, 823),
  
  ('Investment Banking Resume - Goldman Sachs', 'Goldman Sachs', 'Investment Banking Analyst', 'Finance', 'Entry-level', 'IB analyst resume for Goldman Sachs. Shows strong financial modeling and deal experience.', ARRAY['financial-modeling', 'valuation', 'excel', 'powerpoint'], false, 567),
  
  ('TPM Resume - Stripe', 'Stripe', 'Technical Program Manager', 'Technology', 'Senior', 'Technical program manager resume for Stripe payments infrastructure. Shows cross-functional leadership.', ARRAY['program-management', 'payments', 'cross-functional', 'agile'], false, 445),
  
  ('Product Designer Resume - Airbnb', 'Airbnb', 'Product Designer', 'Technology', 'Mid-level', 'UX/UI design resume for Airbnb. Emphasizes user research and design systems experience.', ARRAY['ux-design', 'user-research', 'figma', 'design-systems'], false, 612),
  
  ('DevOps Engineer Resume - Uber', 'Uber', 'DevOps Engineer', 'Technology', 'Mid-level', 'Site reliability and DevOps resume for Uber. Focuses on infrastructure automation and monitoring.', ARRAY['kubernetes', 'terraform', 'monitoring', 'ci-cd'], false, 389);