-- ========================================================
-- i18n Migration: Add English translation columns
-- Run this in your Supabase SQL editor
-- ========================================================

-- ── POSTS table: English translation columns ──────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS title_en       TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en     TEXT,
  ADD COLUMN IF NOT EXISTS content_en     JSONB,
  ADD COLUMN IF NOT EXISTS category_en    TEXT,
  ADD COLUMN IF NOT EXISTS read_time_en   TEXT;

-- ── PROJECTS table: English translation columns ───────────
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS title_en       TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en     TEXT,
  ADD COLUMN IF NOT EXISTS content_en     JSONB,
  ADD COLUMN IF NOT EXISTS category_en    TEXT,
  ADD COLUMN IF NOT EXISTS services_en    TEXT,
  ADD COLUMN IF NOT EXISTS client_en      TEXT,
  ADD COLUMN IF NOT EXISTS duration_en    TEXT;

-- ── Comments explaining the fields ────────────────────────
COMMENT ON COLUMN posts.title_en       IS 'Post title in English (falls back to title if null)';
COMMENT ON COLUMN posts.excerpt_en     IS 'Post excerpt in English (falls back to excerpt if null)';
COMMENT ON COLUMN posts.content_en     IS 'Full post content in English (JSONB, same structure as content)';
COMMENT ON COLUMN posts.category_en    IS 'Post category in English (falls back to category if null)';
COMMENT ON COLUMN posts.read_time_en   IS 'Read time label in English (e.g., "5 min read")';

COMMENT ON COLUMN projects.title_en    IS 'Project title in English (falls back to title if null)';
COMMENT ON COLUMN projects.excerpt_en  IS 'Project excerpt in English (falls back to excerpt if null)';
COMMENT ON COLUMN projects.content_en  IS 'Full project content in English (JSONB, same structure as content)';
COMMENT ON COLUMN projects.category_en IS 'Project category in English (falls back to category if null)';
COMMENT ON COLUMN projects.services_en IS 'Services label in English (falls back to services if null)';
COMMENT ON COLUMN projects.client_en   IS 'Client name in English (falls back to client if null)';
COMMENT ON COLUMN projects.duration_en IS 'Duration label in English (e.g., "3 months")';
