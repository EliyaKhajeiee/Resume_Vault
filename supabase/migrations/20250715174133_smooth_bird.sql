/*
  # Setup Storage Bucket for Resume Files

  1. Storage Setup
    - Create 'resumes' bucket for file uploads
    - Set up proper policies for public access
    - Configure allowed file types and size limits

  2. Security
    - Allow public read access to resume files
    - Allow authenticated users to upload files
    - Restrict file types to documents only
*/

-- Create the resumes bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

-- Policy to allow public read access to resume files
CREATE POLICY "Public read access for resume files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

-- Policy to allow authenticated users to upload resume files
CREATE POLICY "Authenticated users can upload resume files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

-- Policy to allow authenticated users to update resume files
CREATE POLICY "Authenticated users can update resume files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');

-- Policy to allow authenticated users to delete resume files
CREATE POLICY "Authenticated users can delete resume files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');