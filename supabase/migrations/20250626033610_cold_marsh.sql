/*
  # Add missing columns to email_signups table

  1. Changes
    - Add `source` column to track where the email signup came from
    - Add `status` column to track the status of the email signup
  
  2. Security
    - Columns are added with appropriate defaults
    - Maintains existing RLS policies
*/

-- Add source column to track signup source
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'email_signups' AND column_name = 'source'
  ) THEN
    ALTER TABLE email_signups ADD COLUMN source text DEFAULT 'landing_page' NOT NULL;
  END IF;
END $$;

-- Add status column to track email status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'email_signups' AND column_name = 'status'
  ) THEN
    ALTER TABLE email_signups ADD COLUMN status text DEFAULT 'active' NOT NULL;
  END IF;
END $$;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_email_signups_source ON email_signups(source);
CREATE INDEX IF NOT EXISTS idx_email_signups_status ON email_signups(status);