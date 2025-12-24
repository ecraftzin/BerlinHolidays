# 🔧 FIX: Services Images Upload Error - RLS Policy Issue

## ❌ Error You're Seeing
```
Error uploading image: StorageApiError: new row violates row-level security policy
{
    "statusCode": "403",
    "error": "Unauthorized",
    "message": "new row violates row-level security policy"
}
```

## 🎯 Problem
The `services-images` bucket exists but has **NO Row Level Security (RLS) policies** configured, which prevents authenticated users from uploading images.

## ✅ Solution - Apply RLS Policies

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **Berlin Holidays**
3. Click **SQL Editor** in the left sidebar (icon looks like `</>`)
4. Click **New Query** button

### Step 2: Copy and Run This SQL Script

Copy the entire SQL script below and paste it into the SQL Editor:

```sql
-- ============================================
-- FIX: Services Images Storage RLS Policies
-- ============================================

-- Policy 1: Allow public read access to all images
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

-- Policy 3: Allow authenticated users to update images
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
```

### Step 3: Execute the Script

1. Click the **RUN** button (or press `Ctrl + Enter` / `Cmd + Enter`)
2. You should see: **Success. No rows returned**

### Step 4: Verify Policies Were Created

Run this verification query in the SQL Editor:

```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage' 
AND policyname LIKE '%services%';
```

You should see 4 policies:
- ✅ Public Access - Read Services Images (SELECT)
- ✅ Authenticated users can upload services images (INSERT)
- ✅ Authenticated users can update services images (UPDATE)
- ✅ Authenticated users can delete services images (DELETE)

### Step 5: Test Image Upload

1. Go back to your application
2. Navigate to **Admin Dashboard → Services Management**
3. Click **Add Service**
4. Try uploading an image
5. ✅ It should work now!

## 🔍 What These Policies Do

- **SELECT Policy**: Allows anyone (public) to view/read images
- **INSERT Policy**: Allows authenticated admin users to upload new images
- **UPDATE Policy**: Allows authenticated admin users to modify images
- **DELETE Policy**: Allows authenticated admin users to delete images

## 📝 Important Notes

1. Make sure you're **logged in as admin** when uploading images
2. The bucket `services-images` is already created and set to public
3. These policies are secure - only authenticated users can upload/modify
4. Public users can only view the images, not upload them

## 🆘 Still Having Issues?

If you still get the error after running the SQL:

1. **Log out and log back in** to your admin dashboard
2. **Clear browser cache** (Ctrl + Shift + Delete)
3. **Check if you're authenticated**: Open browser console and run:
   ```javascript
   supabase.auth.getSession().then(console.log)
   ```
   You should see a valid session with a user object

4. **Verify the bucket exists**: In Supabase Dashboard → Storage, you should see `services-images` bucket with a green "Public" badge

