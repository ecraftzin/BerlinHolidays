-- Create special_offers table for Berlin Holidays
-- Run this SQL in your Supabase SQL Editor
--
-- IMPORTANT: This only creates the EMPTY table structure
-- After running this, you will add offers through the ADMIN PANEL
-- NO sample data will be inserted - table will be empty and ready for admin use

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the special_offers table
CREATE TABLE IF NOT EXISTS special_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT DEFAULT 'percentage', -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2),
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  room_type TEXT DEFAULT 'All Rooms',
  room_type_id UUID,
  status TEXT DEFAULT 'active', -- 'active', 'scheduled', 'expired', 'inactive'
  terms_conditions TEXT,
  featured_image TEXT,
  min_stay INTEGER DEFAULT 1,
  max_bookings INTEGER,
  current_bookings INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_special_offers_slug ON special_offers(slug);
CREATE INDEX IF NOT EXISTS idx_special_offers_status ON special_offers(status);
CREATE INDEX IF NOT EXISTS idx_special_offers_dates ON special_offers(valid_from, valid_to);
CREATE INDEX IF NOT EXISTS idx_special_offers_featured ON special_offers(is_featured);
CREATE INDEX IF NOT EXISTS idx_special_offers_display_order ON special_offers(display_order);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_special_offers_updated_at ON special_offers;
CREATE TRIGGER update_special_offers_updated_at
  BEFORE UPDATE ON special_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active offers
DROP POLICY IF EXISTS "Public can view active special offers" ON special_offers;
CREATE POLICY "Public can view active special offers" 
  ON special_offers
  FOR SELECT 
  USING (status = 'active');

-- Create policy for authenticated users (admin) to have full access
DROP POLICY IF EXISTS "Authenticated users have full access to special offers" ON special_offers;
CREATE POLICY "Authenticated users have full access to special offers"
  ON special_offers
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Verify table was created
SELECT 'special_offers table created successfully!' as message;
SELECT 'Table is empty - ready for admin to add offers through admin panel!' as status;

