/*
  # Remove Mock Data

  1. Clean Up
    - Remove all existing resume entries
    - Reset sequences if needed
    - Keep table structure intact
*/

-- Remove all existing resume data
DELETE FROM resumes;

-- Reset view counts and other counters if needed
-- (The auto-increment will continue from where it left off, which is fine)