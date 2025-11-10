-- Update Pricing Plans Table for Berlin Holidays
-- This script updates the pricing_plans table to match the new structure
-- Run this in your Supabase SQL Editor

-- Drop the existing pricing_plans table if it exists (WARNING: This will delete all data)
-- If you want to keep existing data, comment out the DROP TABLE line
DROP TABLE IF EXISTS pricing_plans CASCADE;

-- Create the updated pricing_plans table with new fields
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  includes TEXT NOT NULL,
  price TEXT NOT NULL, -- Changed to TEXT to allow formats like "₹6000/person"
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pricing_plans_active ON pricing_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_display_order ON pricing_plans(display_order);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_pricing_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pricing_plans_updated_at
  BEFORE UPDATE ON pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_pricing_plans_updated_at();

-- Insert some sample data (optional - you can remove this if you don't want sample data)
-- INSERT INTO pricing_plans (name, duration, includes, price, is_active, display_order) VALUES
-- ('Weekend Getaway', '2 Nights / 3 Days', 'Accommodation, Breakfast, Airport Transfer', '₹15000/couple', true, 1),
-- ('Family Package', '3 Nights / 4 Days', 'Accommodation, All Meals, Sightseeing', '₹25000/family', true, 2),
-- ('Luxury Retreat', '5 Nights / 6 Days', 'Deluxe Room, All Meals, Spa, Activities', '₹45000/couple', true, 3);

-- Verify the table was created
SELECT 'Pricing plans table updated successfully!' AS status;

