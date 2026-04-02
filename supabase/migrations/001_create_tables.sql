-- supabase/migrations/001_create_tables.sql

-- Sessions table: one per couple
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  due_date DATE,
  submitted_a BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_b BOOLEAN NOT NULL DEFAULT FALSE,
  token_a UUID NOT NULL DEFAULT gen_random_uuid(),
  token_b UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Submissions: each parent submits 10 girls + 10 boys names (max 20 rows per parent)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  parent_slot TEXT NOT NULL CHECK (parent_slot IN ('a', 'b')),
  gender TEXT NOT NULL CHECK (gender IN ('girl', 'boy')),
  name TEXT NOT NULL,
  rank INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 10),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, parent_slot, gender, rank)
);

-- Name database
CREATE TABLE names_db (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('girl', 'boy', 'neutral')),
  meaning TEXT NOT NULL DEFAULT '',
  origin TEXT NOT NULL DEFAULT ''
);

-- Popularity per country
CREATE TABLE name_popularity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_id UUID NOT NULL REFERENCES names_db(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  popularity_rank INTEGER NOT NULL,
  year INTEGER NOT NULL
);

-- Indexes for common queries
CREATE INDEX idx_submissions_session ON submissions(session_id);
CREATE INDEX idx_name_popularity_name ON name_popularity(name_id);
CREATE INDEX idx_name_popularity_country ON name_popularity(country_code);
