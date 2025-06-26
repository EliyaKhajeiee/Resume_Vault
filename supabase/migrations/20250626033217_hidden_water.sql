/*
  # Create email signups table

  1. New Tables
    - `email_signups`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `source` (text, default 'landing_page')
      - `status` (text, default 'active')

  2. Security
    - Enable RLS on `email_signups` table
    - Add policy for public insert access (for the landing page form)
    - Add policy for authenticated users to read data (for admin access)
*/

CREATE TABLE IF NOT EXISTS email_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  source text DEFAULT 'landing_page',
  status text DEFAULT 'active'
);

ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert emails (for the public landing page)
CREATE POLICY "Anyone can insert email signups"
  ON email_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all email signups (for admin access)
CREATE POLICY "Authenticated users can read email signups"
  ON email_signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_signups_email ON email_signups(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_email_signups_created_at ON email_signups(created_at DESC);