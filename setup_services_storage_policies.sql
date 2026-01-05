-- Supabase Storage Policies for Services Images
-- Run this script in your Supabase SQL Editor to fix the RLS policy error

-- ============================================
-- STORAGE POLICIES FOR SERVICES-IMAGES BUCKET
-- ============================================

-- Policy 1: Allow public read access to all images in services-images bucket
CREATE POLICY "Public Access - Read Services Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'services-images' );

-- Policy 2: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload services images"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'services-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update services images"
ON storage.objects FOR UPDATE
USING ( 
  bucket_id = 'services-images' 
  AND auth.role() = 'authenticated'
)
WITH CHECK ( 
  bucket_id = 'services-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete services images"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'services-images' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the policies were created successfully:
-- SELECT policyname, cmd FROM pg_policies 
-- WHERE tablename = 'objects' 
-- AND schemaname = 'storage' 
-- AND (policyname LIKE '%services%' OR qual LIKE '%services-images%');

-- ============================================
-- NOTES
-- ============================================
-- 1. The 'services-images' bucket already exists in your Supabase project
-- 2. These policies allow authenticated users to upload, update, and delete images
-- 3. Anyone can view/read the images (public access)
-- 4. Make sure you're logged in as an admin when uploading images

