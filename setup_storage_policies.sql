-- Supabase Storage Policies for Blog Images
-- Run this script in your Supabase SQL Editor after creating the 'blog-images' bucket

-- ============================================
-- STORAGE POLICIES FOR BLOG IMAGES BUCKET
-- ============================================

-- Policy 1: Allow public read access to all images in blog-images bucket
CREATE POLICY "Public Access - Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );

-- Policy 2: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING ( 
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
)
WITH CHECK ( 
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- ALTERNATIVE: PUBLIC BUCKET (NO AUTH REQUIRED)
-- ============================================
-- If you want to allow uploads without authentication (for testing),
-- uncomment the policies below and comment out the ones above

-- -- Allow anyone to read
-- CREATE POLICY "Public Access - Read"
-- ON storage.objects FOR SELECT
-- USING ( bucket_id = 'blog-images' );

-- -- Allow anyone to upload
-- CREATE POLICY "Public Access - Upload"
-- ON storage.objects FOR INSERT
-- WITH CHECK ( bucket_id = 'blog-images' );

-- -- Allow anyone to update
-- CREATE POLICY "Public Access - Update"
-- ON storage.objects FOR UPDATE
-- USING ( bucket_id = 'blog-images' )
-- WITH CHECK ( bucket_id = 'blog-images' );

-- -- Allow anyone to delete
-- CREATE POLICY "Public Access - Delete"
-- ON storage.objects FOR DELETE
-- USING ( bucket_id = 'blog-images' );

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if policies were created successfully
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- List all storage buckets
SELECT * FROM storage.buckets;

-- ============================================
-- NOTES
-- ============================================
-- 1. Make sure you've created the 'blog-images' bucket first in the Supabase Dashboard
-- 2. Set the bucket to 'Public' when creating it
-- 3. These policies allow authenticated users to upload, update, and delete images
-- 4. Anyone can view/read the images (public access)
-- 5. For production, consider adding file size limits and file type restrictions

