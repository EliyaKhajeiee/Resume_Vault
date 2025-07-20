/*
  # Create Storage Bucket for Resume Files

  1. Storage Setup
    - Create 'resumes' bucket for file uploads
    - Set up proper RLS policies for file access
    - Configure bucket settings

  2. Security
    - Allow authenticated users to upload files
    - Allow public read access to files
    - Restrict file types and sizes
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload resume files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

-- Allow public read access to resume files
CREATE POLICY "Public can view resume files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'resumes');

-- Allow authenticated users to delete their uploaded files
CREATE POLICY "Authenticated users can delete resume files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');

-- Allow authenticated users to update file metadata
CREATE POLICY "Authenticated users can update resume files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');