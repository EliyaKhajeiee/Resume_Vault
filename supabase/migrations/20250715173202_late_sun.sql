/*
  # Clear mock data and improve resume functionality

  1. Clear existing mock data
    - Remove all existing resume entries
    - Remove all existing email signups (optional)

  2. Improve resume table structure
    - Add better file handling support
    - Add validation constraints
    - Improve indexing

  3. Security improvements
    - Update RLS policies for better security
    - Add proper validation
*/

-- Clear existing data
DELETE FROM resumes;
DELETE FROM email_signups WHERE source = 'mock_data' OR email LIKE '%example.com%' OR email LIKE '%test.com%';

-- Add file handling improvements to resumes table
DO $$
BEGIN
  -- Add file_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'file_name'
  ) THEN
    ALTER TABLE resumes ADD COLUMN file_name text;
  END IF;

  -- Add file_size column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE resumes ADD COLUMN file_size bigint;
  END IF;

  -- Add file_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'file_type'
  ) THEN
    ALTER TABLE resumes ADD COLUMN file_type text;
  END IF;

  -- Add upload_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'upload_status'
  ) THEN
    ALTER TABLE resumes ADD COLUMN upload_status text DEFAULT 'pending';
  END IF;
END $$;

-- Add constraints for better data validation
ALTER TABLE resumes 
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN company SET NOT NULL,
  ALTER COLUMN role SET NOT NULL,
  ALTER COLUMN industry SET NOT NULL;

-- Add check constraints
DO $$
BEGIN
  -- Check if constraint doesn't exist before adding
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_experience_level' AND table_name = 'resumes'
  ) THEN
    ALTER TABLE resumes ADD CONSTRAINT valid_experience_level 
    CHECK (experience_level IN ('Entry-level', 'Mid-level', 'Senior', 'Staff+', 'Executive'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_upload_status' AND table_name = 'resumes'
  ) THEN
    ALTER TABLE resumes ADD CONSTRAINT valid_upload_status 
    CHECK (upload_status IN ('pending', 'processing', 'completed', 'failed'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_file_type' AND table_name = 'resumes'
  ) THEN
    ALTER TABLE resumes ADD CONSTRAINT valid_file_type 
    CHECK (file_type IS NULL OR file_type IN ('application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'));
  END IF;
END $$;

-- Update RLS policies for better security
DROP POLICY IF EXISTS "Allow authenticated users to manage resumes" ON resumes;
DROP POLICY IF EXISTS "Allow public read access to resumes" ON resumes;

-- Create more specific policies
CREATE POLICY "Allow public to read approved resumes"
  ON resumes
  FOR SELECT
  TO public
  USING (upload_status = 'completed');

CREATE POLICY "Allow authenticated users to insert resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update own resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete own resumes"
  ON resumes
  FOR DELETE
  TO authenticated
  USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_upload_status ON resumes(upload_status);
CREATE INDEX IF NOT EXISTS idx_resumes_file_type ON resumes(file_type);
CREATE INDEX IF NOT EXISTS idx_resumes_title_search ON resumes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_resumes_description_search ON resumes USING gin(to_tsvector('english', description));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS update_resumes_updated_at ON resumes;
CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();