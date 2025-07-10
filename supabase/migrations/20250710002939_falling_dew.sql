/*
  # Create resumes table for real resume data

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `company` (text, required)
      - `role` (text, required)
      - `industry` (text, required)
      - `experience_level` (text, default 'Mid-level')
      - `file_url` (text, optional - for PDF/document storage)
      - `description` (text, optional)
      - `tags` (text array, default empty)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_featured` (boolean, default false)
      - `view_count` (integer, default 0)

  2. Security
    - Enable RLS on `resumes` table
    - Add policy for public read access
    - Add policy for authenticated users to manage resumes

  3. Functions
    - Function to increment view count
    - Trigger to update updated_at timestamp
*/

-- Create the resumes table if it doesn't exist
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  industry text NOT NULL,
  experience_level text NOT NULL DEFAULT 'Mid-level',
  file_url text,
  description text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to resumes
CREATE POLICY "Allow public read access to resumes"
  ON resumes
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage resumes (for admin)
CREATE POLICY "Allow authenticated users to manage resumes"
  ON resumes
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_company ON resumes (company);
CREATE INDEX IF NOT EXISTS idx_resumes_role ON resumes (role);
CREATE INDEX IF NOT EXISTS idx_resumes_industry ON resumes (industry);
CREATE INDEX IF NOT EXISTS idx_resumes_experience_level ON resumes (experience_level);
CREATE INDEX IF NOT EXISTS idx_resumes_is_featured ON resumes (is_featured);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_tags ON resumes USING GIN (tags);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_resumes_updated_at ON resumes;
CREATE TRIGGER update_resumes_updated_at 
    BEFORE UPDATE ON resumes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(resume_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE resumes 
  SET view_count = view_count + 1 
  WHERE id = resume_id;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data to get started
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
  
  ('DevOps Engineer Resume - Uber', 'Uber', 'DevOps Engineer', 'Technology', 'Mid-level', 'Site reliability and DevOps resume for Uber. Focuses on infrastructure automation and monitoring.', ARRAY['kubernetes', 'terraform', 'monitoring', 'ci-cd'], false, 389)

ON CONFLICT (id) DO NOTHING;