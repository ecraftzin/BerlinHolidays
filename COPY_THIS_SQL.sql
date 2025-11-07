-- ============================================
-- BERLIN HOLIDAYS BLOG - DATABASE SETUP
-- ============================================
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click "RUN"
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. BLOG CATEGORIES TABLE
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

-- Insert default categories
INSERT INTO blog_categories (name, slug, is_active) VALUES
  ('Travel', 'travel', true),
  ('Guide', 'guide', true),
  ('Travel Tips', 'travel-tips', true),
  ('Wildlife', 'wildlife', true),
  ('Adventure', 'adventure', true),
  ('Culture', 'culture', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT DEFAULT 'Admin',
  category TEXT,
  status TEXT DEFAULT 'draft',
  featured_image TEXT,
  views INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON blog_categories FOR SELECT USING (true);

-- Allow all operations for authenticated users (admins)
CREATE POLICY "Enable all for authenticated users" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON blog_categories FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 4. VERIFICATION
-- ============================================
-- Check categories were created
SELECT 'SUCCESS: Categories created' as status, COUNT(*) as count FROM blog_categories;

-- Check blog_posts table is ready
SELECT 'SUCCESS: Blog posts table ready' as status;

