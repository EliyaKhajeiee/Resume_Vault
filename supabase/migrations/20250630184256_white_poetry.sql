/*
  # Create resumes table with metadata

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `company` (text)
      - `role` (text)
      - `industry` (text)
      - `experience_level` (text)
      - `file_url` (text)
      - `description` (text)
      - `tags` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_featured` (boolean)
      - `view_count` (integer)

  2. Security
    - Enable RLS on `resumes` table
    - Add policy for public read access
    - Add policy for authenticated users to manage resumes
*/

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

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to resumes
CREATE POLICY "Allow public read access to resumes"
  ON resumes
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage resumes
CREATE POLICY "Allow authenticated users to manage resumes"
  ON resumes
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_resumes_company ON resumes (company);
CREATE INDEX IF NOT EXISTS idx_resumes_role ON resumes (role);
CREATE INDEX IF NOT EXISTS idx_resumes_industry ON resumes (industry);
CREATE INDEX IF NOT EXISTS idx_resumes_experience_level ON resumes (experience_level);
CREATE INDEX IF NOT EXISTS idx_resumes_is_featured ON resumes (is_featured);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_tags ON resumes USING GIN (tags);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_resumes_updated_at 
    BEFORE UPDATE ON resumes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();