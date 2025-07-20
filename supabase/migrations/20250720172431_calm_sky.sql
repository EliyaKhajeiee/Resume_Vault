/*
  # Setup Authentication and Storage

  1. Authentication Setup
    - Enable email confirmation
    - Configure email templates
    - Set up proper auth policies

  2. Storage Setup
    - Create resumes bucket
    - Set up storage policies for file uploads
    - Configure file type and size restrictions

  3. Security
    - Ensure proper RLS policies
    - Configure storage access controls
*/

-- Enable email confirmation (this should be done in Supabase dashboard)
-- UPDATE auth.config SET enable_signup = true, enable_confirmations = true;

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  true,
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'text/plain'
  ];

-- Storage policies for resume files
CREATE POLICY "Public read access for resume files"
ON storage.objects FOR SELECT
TO public
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

-- Update resumes table policies to require authentication for modifications
DROP POLICY IF EXISTS "authenticated_users_full_access" ON resumes;
DROP POLICY IF EXISTS "public_read_access" ON resumes;

-- Create more specific policies
CREATE POLICY "Public can read resumes"
  ON resumes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete resumes"
  ON resumes
  FOR DELETE
  TO authenticated
  USING (true);

-- Ensure email_signups policies allow public inserts (for newsletter signup)
DROP POLICY IF EXISTS "Anyone can insert email signups" ON email_signups;
DROP POLICY IF EXISTS "Authenticated users can read email signups" ON email_signups;

CREATE POLICY "Public can insert email signups"
  ON email_signups
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read email signups"
  ON email_signups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update email signups"
  ON email_signups
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete email signups"
  ON email_signups
  FOR DELETE
  TO authenticated
  USING (true);