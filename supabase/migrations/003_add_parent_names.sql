-- Add parent name columns and gender mode to sessions
ALTER TABLE sessions
  ADD COLUMN name_a TEXT NOT NULL DEFAULT 'Parent A',
  ADD COLUMN name_b TEXT NOT NULL DEFAULT 'Parent B',
  ADD COLUMN gender_mode TEXT NOT NULL DEFAULT 'both';
