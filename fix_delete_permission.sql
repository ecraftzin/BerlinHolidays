-- Fix Row Level Security policies for special_offers table
-- This allows admin to delete offers without authentication

-- OPTION 1: Disable RLS completely (easiest for development)
-- Uncomment the line below if you want to disable RLS
-- ALTER TABLE special_offers DISABLE ROW LEVEL SECURITY;

-- OPTION 2: Update RLS policies to allow anonymous access (recommended)
-- Drop existing policies
DROP POLICY IF EXISTS "Public can view active special offers" ON special_offers;
DROP POLICY IF EXISTS "Authenticated users have full access to special offers" ON special_offers;
DROP POLICY IF EXISTS "Allow all operations on special offers" ON special_offers;

-- Create policy for public read access to active offers (for website)
CREATE POLICY "Public can view active special offers"
  ON special_offers
  FOR SELECT
  USING (status = 'active');

-- Create policy to allow ALL operations for everyone (for admin panel)
-- This works because you're using the anon key without authentication
CREATE POLICY "Allow all operations on special offers"
  ON special_offers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify policies
SELECT 'RLS policies updated successfully!' as message;
SELECT 'Admin can now create, read, update, and delete offers' as status;

-- Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'special_offers';

