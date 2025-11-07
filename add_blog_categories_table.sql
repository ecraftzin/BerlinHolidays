-- Add Blog Categories Table
-- Run this script in your Supabase SQL Editor if you already have the database set up
-- This adds the blog_categories table and populates it with default categories

-- ============================================
-- BLOG CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_active ON blog_categories(is_active);

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, is_active) VALUES
  ('Travel', 'travel', true),
  ('Guide', 'guide', true),
  ('Travel Tips', 'travel-tips', true),
  ('Wildlife', 'wildlife', true),
  ('Adventure', 'adventure', true),
  ('Culture', 'culture', true)
ON CONFLICT (name) DO NOTHING;

-- Verify the table was created
SELECT * FROM blog_categories ORDER BY name;

