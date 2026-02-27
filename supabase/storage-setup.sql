-- ============================================================
-- Supabase Storage: bucket for blog post cover images
-- Run this in the Supabase SQL editor after schema.sql
-- ============================================================

-- Create the bucket (public so images are accessible without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880,  -- 5 MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view images (public bucket)
CREATE POLICY "Public can view post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

-- Authenticated users can upload images
CREATE POLICY "Authenticated users can upload post images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

-- Authenticated users can update/replace images
CREATE POLICY "Authenticated users can update post images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'post-images' AND auth.role() = 'authenticated');

-- Authenticated users can delete images
CREATE POLICY "Authenticated users can delete post images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'post-images' AND auth.role() = 'authenticated');

-- ============================================================
-- Migration: add cover_image column to posts table
-- (skip if you already ran schema.sql with this column)
-- ============================================================

ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image TEXT;
