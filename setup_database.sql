-- Berlin Holidays Admin Dashboard - Database Setup Script
-- Run this script in your Supabase SQL Editor to create all required tables

-- Enable UUID extension if not already enabled
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

-- Insert default blog categories
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
  status TEXT DEFAULT 'draft', -- 'draft' or 'published'
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
-- 3. SEO SETTINGS TABLES
-- ============================================

-- Global SEO Settings
CREATE TABLE IF NOT EXISTS seo_global_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL,
  site_description TEXT,
  site_keywords TEXT,
  og_image TEXT,
  twitter_card TEXT DEFAULT 'summary_large_image',
  canonical_url TEXT,
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  google_analytics_id TEXT,
  google_tag_manager_id TEXT,
  facebook_pixel_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page-specific SEO Settings
CREATE TABLE IF NOT EXISTS seo_page_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT UNIQUE NOT NULL,
  page_title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_page_path ON seo_page_settings(page_path);

-- ============================================
-- 4. ROOM TYPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS room_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  size TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  amenities TEXT[], -- Array of amenities
  images TEXT[], -- Array of image URLs
  total_rooms INTEGER DEFAULT 0,
  available_rooms INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_room_types_slug ON room_types(slug);
CREATE INDEX IF NOT EXISTS idx_room_types_active ON room_types(is_active);

-- ============================================
-- 5. RATE PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rate_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2),
  min_stay INTEGER DEFAULT 1,
  max_stay INTEGER,
  valid_from DATE,
  valid_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_plans_active ON rate_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_rate_plans_dates ON rate_plans(valid_from, valid_to);

-- ============================================
-- 5. ROOM RATES CALENDAR TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS room_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
  rate_plan_id UUID REFERENCES rate_plans(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  base_rate DECIMAL(10, 2) NOT NULL,
  discounted_rate DECIMAL(10, 2),
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_type_id, date)
);

CREATE INDEX IF NOT EXISTS idx_room_rates_date ON room_rates(date);
CREATE INDEX IF NOT EXISTS idx_room_rates_room_type ON room_rates(room_type_id);

-- ============================================
-- 6. ROOM AVAILABILITY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS room_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_rooms INTEGER NOT NULL,
  available_rooms INTEGER NOT NULL,
  booked_rooms INTEGER DEFAULT 0,
  blocked_rooms INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available', -- 'available', 'limited', 'sold_out', 'blocked'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_type_id, date)
);

CREATE INDEX IF NOT EXISTS idx_room_availability_date ON room_availability(date);
CREATE INDEX IF NOT EXISTS idx_room_availability_room_type ON room_availability(room_type_id);
CREATE INDEX IF NOT EXISTS idx_room_availability_status ON room_availability(status);

-- ============================================
-- 7. PRICING PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2),
  valid_from DATE,
  valid_to DATE,
  min_stay INTEGER DEFAULT 1,
  max_stay INTEGER,
  applicable_days TEXT[], -- Array of days: ['monday', 'tuesday', etc.]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pricing_plans_active ON pricing_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_dates ON pricing_plans(valid_from, valid_to);

-- ============================================
-- 8. SPECIAL OFFERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS special_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2),
  valid_from DATE,
  valid_to DATE,
  room_type TEXT,
  terms_conditions TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'scheduled', 'expired', 'inactive'
  booking_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_special_offers_slug ON special_offers(slug);
CREATE INDEX IF NOT EXISTS idx_special_offers_status ON special_offers(status);
CREATE INDEX IF NOT EXISTS idx_special_offers_dates ON special_offers(valid_from, valid_to);

-- ============================================
-- 9. RESTAURANT CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS restaurant_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_restaurant_categories_slug ON restaurant_categories(slug);
CREATE INDEX IF NOT EXISTS idx_restaurant_categories_active ON restaurant_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurant_categories_order ON restaurant_categories(display_order);

-- ============================================
-- 10. RESTAURANT MENU ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS restaurant_menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES restaurant_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON restaurant_menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_slug ON restaurant_menu_items(slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON restaurant_menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON restaurant_menu_items(is_featured);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_global_updated_at BEFORE UPDATE ON seo_global_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_page_updated_at BEFORE UPDATE ON seo_page_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON room_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rate_plans_updated_at BEFORE UPDATE ON rate_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_rates_updated_at BEFORE UPDATE ON room_rates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_availability_updated_at BEFORE UPDATE ON room_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON pricing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_special_offers_updated_at BEFORE UPDATE ON special_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_categories_updated_at BEFORE UPDATE ON restaurant_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_menu_items_updated_at BEFORE UPDATE ON restaurant_menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- Insert default global SEO settings
INSERT INTO seo_global_settings (site_title, site_description, site_keywords)
VALUES (
  'Berlin Holidays - Luxury Resort in Wayanad',
  'Experience luxury and comfort at Berlin Holidays, your perfect getaway in the heart of Wayanad',
  'berlin holidays, wayanad resort, luxury hotel, kerala tourism'
)
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'All tables have been created with indexes and triggers.';
END $$;

