# Berlin Holidays Admin Dashboard - Database Schema

This document outlines the Supabase database tables required for all admin dashboard sections.

## 📋 Table of Contents
1. [Blog Posts](#blog-posts)
2. [SEO Settings](#seo-settings)
3. [Room Types](#room-types)
4. [Rate Plans](#rate-plans)
5. [Rates Calendar](#rates-calendar)
6. [Room Availability](#room-availability)
7. [Pricing Plans](#pricing-plans)
8. [Special Offers](#special-offers)
9. [Restaurant Categories](#restaurant-categories)
10. [Restaurant Menu Items](#restaurant-menu-items)

---

## 1. Blog Posts

```sql
CREATE TABLE blog_posts (
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

-- Index for faster queries
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
```

---

## 2. SEO Settings

```sql
-- Global SEO Settings
CREATE TABLE seo_global_settings (
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
CREATE TABLE seo_page_settings (
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
  status TEXT DEFAULT 'draft', -- 'draft' or 'published'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_seo_page_path ON seo_page_settings(page_path);
```

---

## 3. Room Types

```sql
CREATE TABLE room_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  size TEXT, -- e.g., "450 sq ft"
  base_price DECIMAL(10, 2) NOT NULL,
  amenities TEXT[], -- Array of amenities
  images TEXT[], -- Array of image URLs
  total_rooms INTEGER DEFAULT 0,
  available_rooms INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_room_types_active ON room_types(is_active);
CREATE INDEX idx_room_types_slug ON room_types(slug);
```

---

## 4. Rate Plans

```sql
CREATE TABLE rate_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  plan_type TEXT, -- 'standard', 'package', 'seasonal'
  discount_type TEXT, -- 'percentage', 'fixed'
  discount_value DECIMAL(10, 2),
  min_stay INTEGER DEFAULT 1,
  max_stay INTEGER,
  advance_booking_days INTEGER,
  is_refundable BOOLEAN DEFAULT true,
  cancellation_policy TEXT,
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_to DATE,
  applicable_days TEXT[], -- ['monday', 'tuesday', etc.]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rate_plans_active ON rate_plans(is_active);
CREATE INDEX idx_rate_plans_dates ON rate_plans(valid_from, valid_to);
```

---

## 5. Rates Calendar

```sql
CREATE TABLE room_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
  rate_plan_id UUID REFERENCES rate_plans(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  base_rate DECIMAL(10, 2) NOT NULL,
  discounted_rate DECIMAL(10, 2),
  min_stay INTEGER DEFAULT 1,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_type_id, date)
);

CREATE INDEX idx_room_rates_date ON room_rates(date);
CREATE INDEX idx_room_rates_room_type ON room_rates(room_type_id);
```

---

## 6. Room Availability

```sql
CREATE TABLE room_availability (
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

CREATE INDEX idx_room_availability_date ON room_availability(date);
CREATE INDEX idx_room_availability_room_type ON room_availability(room_type_id);
CREATE INDEX idx_room_availability_status ON room_availability(status);
```

---

## 7. Pricing Plans

```sql
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  min_stay INTEGER DEFAULT 1,
  max_stay INTEGER,
  applicable_room_types TEXT[], -- Array of room type IDs or 'all'
  conditions JSONB, -- Additional conditions
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pricing_plans_active ON pricing_plans(is_active);
CREATE INDEX idx_pricing_plans_dates ON pricing_plans(valid_from, valid_to);
```

---

## 8. Special Offers

```sql
CREATE TABLE special_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2),
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  room_type TEXT, -- 'All Rooms' or specific room type
  room_type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'scheduled', -- 'active', 'scheduled', 'expired', 'inactive'
  terms_conditions TEXT,
  featured_image TEXT,
  min_stay INTEGER DEFAULT 1,
  max_bookings INTEGER, -- Limit number of bookings
  current_bookings INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_special_offers_status ON special_offers(status);
CREATE INDEX idx_special_offers_dates ON special_offers(valid_from, valid_to);
CREATE INDEX idx_special_offers_slug ON special_offers(slug);
```

---

## 9. Restaurant Categories

```sql
CREATE TABLE restaurant_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  icon TEXT, -- Icon name or URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_restaurant_categories_active ON restaurant_categories(is_active);
CREATE INDEX idx_restaurant_categories_order ON restaurant_categories(display_order);
```

---

## 10. Restaurant Menu Items

```sql
CREATE TABLE restaurant_menu_items (
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
  allergens TEXT[], -- Array of allergens
  ingredients TEXT[],
  preparation_time INTEGER, -- in minutes
  calories INTEGER,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_menu_items_category ON restaurant_menu_items(category_id);
CREATE INDEX idx_menu_items_available ON restaurant_menu_items(is_available);
CREATE INDEX idx_menu_items_featured ON restaurant_menu_items(is_featured);
```

---

## 🔐 Row Level Security (RLS) Policies

After creating the tables, enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_menu_items ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view active room types" ON room_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active special offers" ON special_offers
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active menu items" ON restaurant_menu_items
  FOR SELECT USING (is_available = true);

-- Admin full access (you'll need to set up authentication)
-- Replace with your admin role/user check
CREATE POLICY "Admins have full access" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 📝 Notes

1. **UUID Generation**: Make sure the `uuid-ossp` extension is enabled in your Supabase project:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

2. **Timestamps**: All tables include `created_at` and `updated_at` timestamps for audit trails.

3. **Indexes**: Indexes are created on frequently queried columns for better performance.

4. **Foreign Keys**: Relationships are established using foreign keys with appropriate cascade rules.

5. **Arrays**: PostgreSQL arrays are used for storing multiple values (amenities, images, etc.).

6. **JSONB**: Used for flexible data storage where structure may vary.

---

## 🚀 Quick Setup Script

Run this in your Supabase SQL Editor to create all tables at once. See the individual sections above for the complete SQL statements.

