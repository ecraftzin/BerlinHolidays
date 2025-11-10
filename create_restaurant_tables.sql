-- Create Restaurant Menu Tables for Berlin Holidays

-- =============================================
-- 1. MENU CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for menu_categories
CREATE INDEX IF NOT EXISTS idx_menu_categories_active ON menu_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_menu_categories_display_order ON menu_categories(display_order);

-- =============================================
-- 2. MENU ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL, -- Denormalized for easier querying
  image_url TEXT,
  is_veg BOOLEAN DEFAULT true,
  spice_level INTEGER DEFAULT 0, -- 0=None, 1=Mild, 2=Medium, 3=Hot
  is_available BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for menu_items
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_name ON menu_items(category_name);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON menu_items(is_active);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_veg ON menu_items(is_veg);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON menu_items(display_order);

-- =============================================
-- 3. AUTO-UPDATE TRIGGERS
-- =============================================

-- Trigger for menu_categories updated_at
CREATE OR REPLACE FUNCTION update_menu_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_menu_categories_updated_at ON menu_categories;
CREATE TRIGGER trigger_update_menu_categories_updated_at
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_categories_updated_at();

-- Trigger for menu_items updated_at
CREATE OR REPLACE FUNCTION update_menu_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_menu_items_updated_at ON menu_items;
CREATE TRIGGER trigger_update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_items_updated_at();

-- =============================================
-- 4. DISABLE ROW LEVEL SECURITY (for testing)
-- =============================================
ALTER TABLE menu_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. INSERT DEFAULT CATEGORIES
-- =============================================
INSERT INTO menu_categories (name, description, display_order, is_active) VALUES
  ('Breakfast', 'Morning delights and traditional Kerala breakfast items', 1, true),
  ('Lunch', 'Hearty lunch options featuring local and international cuisine', 2, true),
  ('Dinner', 'Evening dining with specialty dishes and grills', 3, true),
  ('Beverages', 'Refreshing drinks, teas, and specialty beverages', 4, true),
  ('Desserts', 'Sweet treats and traditional desserts', 5, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- 6. VERIFICATION
-- =============================================
SELECT 'Restaurant menu tables created successfully!' AS status;
SELECT 'Categories inserted: ' || COUNT(*)::TEXT AS categories_count FROM menu_categories;

