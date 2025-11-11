-- ============================================
-- ADD IMAGE UPLOAD TO PRICING PLANS
-- ============================================
-- This script adds image upload functionality to the pricing_plans table
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Add image_url column to pricing_plans table
-- ============================================

ALTER TABLE pricing_plans 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN pricing_plans.image_url IS 'URL of the pricing plan image stored in Supabase Storage';

-- ============================================
-- STEP 2: Create Storage Bucket (if not exists)
-- ============================================
-- Note: This needs to be done via Supabase Dashboard > Storage
-- Bucket name: pricing-images
-- Public: Yes
-- File size limit: 5242880 (5MB)
-- Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp, image/gif

-- ============================================
-- STEP 3: Storage Policies for pricing-images bucket
-- ============================================

-- Policy 1: Allow public read access to images
CREATE POLICY IF NOT EXISTS "Public Access to Pricing Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pricing-images' );

-- Policy 2: Allow authenticated users to upload images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload pricing images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pricing-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated users to update images
CREATE POLICY IF NOT EXISTS "Authenticated users can update pricing images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pricing-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to delete images
CREATE POLICY IF NOT EXISTS "Authenticated users can delete pricing images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pricing-images' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- STEP 4: Verify the changes
-- ============================================

-- Check if the column was added successfully
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pricing_plans' AND column_name = 'image_url';

-- View current pricing plans structure
SELECT 
  id,
  name,
  duration,
  price,
  image_url,
  is_active,
  created_at
FROM pricing_plans
ORDER BY display_order;

-- ============================================
-- OPTIONAL: Sample data update (for testing)
-- ============================================

-- If you want to add a sample image URL to test
-- UPDATE pricing_plans
-- SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/pricing-images/plans/sample.jpg'
-- WHERE id = 'your-plan-id';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count plans with images
SELECT 
  COUNT(*) as total_plans,
  COUNT(image_url) as plans_with_images,
  COUNT(*) - COUNT(image_url) as plans_without_images
FROM pricing_plans;

-- List all plans and their image status
SELECT 
  id,
  name,
  CASE 
    WHEN image_url IS NOT NULL AND image_url != '' THEN 'Has Image'
    ELSE 'No Image'
  END as image_status,
  image_url
FROM pricing_plans
ORDER BY display_order;

-- ============================================
-- CLEANUP QUERIES (Use with caution!)
-- ============================================

-- Remove all images from pricing plans (does not delete files from storage)
-- UPDATE pricing_plans SET image_url = NULL;

-- Remove image from a specific plan
-- UPDATE pricing_plans SET image_url = NULL WHERE id = 'your-plan-id';

-- ============================================
-- NOTES
-- ============================================
-- 1. Make sure to create the 'pricing-images' bucket in Supabase Storage first
-- 2. Set the bucket to PUBLIC so images can be displayed
-- 3. The storage policies ensure only authenticated users can upload/modify images
-- 4. Images are stored in the path: pricing-images/plans/filename.ext
-- 5. The frontend automatically handles image upload, preview, and deletion
-- 6. Maximum file size is 5MB
-- 7. Supported formats: JPEG, PNG, WebP, GIF

