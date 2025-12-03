-- ============================================
-- Customer Authentication & Booking System
-- ============================================

-- 1. Create customer_profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  room_id UUID,
  room_name VARCHAR(255),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_rooms INTEGER DEFAULT 1,
  number_of_adults INTEGER DEFAULT 1,
  number_of_children INTEGER DEFAULT 0,
  total_guests INTEGER GENERATED ALWAYS AS (number_of_adults + number_of_children) STORED,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON customer_profiles(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in_date ON bookings(check_in_date);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for customer_profiles

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON customer_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON customer_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON customer_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Create RLS Policies for bookings

-- Allow users to view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to create their own bookings
CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own bookings (only pending status)
CREATE POLICY "Users can update own pending bookings"
  ON bookings
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- 7. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create triggers for updated_at
CREATE TRIGGER update_customer_profiles_updated_at
  BEFORE UPDATE ON customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Grant permissions (if needed)
-- These are typically handled by RLS policies, but included for completeness
GRANT SELECT, INSERT, UPDATE ON customer_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON bookings TO authenticated;

-- 10. Create a view for admin to see all bookings (optional)
CREATE OR REPLACE VIEW admin_bookings_view AS
SELECT 
  b.*,
  cp.name as customer_profile_name,
  cp.phone as customer_profile_phone,
  cp.address as customer_address
FROM bookings b
LEFT JOIN customer_profiles cp ON b.user_id = cp.user_id
ORDER BY b.created_at DESC;

-- Note: Run this SQL in your Supabase SQL Editor
-- After running, verify tables are created in the Table Editor

