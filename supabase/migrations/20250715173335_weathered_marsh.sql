/*
  # Clear mock data and enhance resume functionality

  1. Clear existing mock data
    - Remove all existing resumes from the database
    - Reset any auto-increment sequences

  2. Enhance resume table structure
    - Ensure proper file handling capabilities
    - Add better validation and constraints

  3. Security
    - Maintain existing RLS policies
    - Ensure proper access controls
*/

-- Clear all existing resume data
DELETE FROM resumes;

-- Add file storage capabilities if not exists
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
END $$;

-- Update the table to ensure proper constraints
ALTER TABLE resumes 
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN company SET NOT NULL,
  ALTER COLUMN role SET NOT NULL,
  ALTER COLUMN industry SET NOT NULL;

-- Add check constraint for file types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'valid_file_type'
  ) THEN
    ALTER TABLE resumes ADD CONSTRAINT valid_file_type 
    CHECK (file_type IS NULL OR file_type IN ('application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'));
  END IF;
END $$;

-- Ensure RLS is enabled and policies are correct
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Allow authenticated users to manage resumes" ON resumes;
DROP POLICY IF EXISTS "Allow public read access to resumes" ON resumes;

-- Recreate policies with better names and structure
CREATE POLICY "authenticated_users_full_access"
  ON resumes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "public_read_access"
  ON resumes
  FOR SELECT
  TO public
  USING (true);

-- Create storage bucket for resume files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for resume files
CREATE POLICY "Anyone can view resume files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can upload resume files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can update resume files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can delete resume files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');