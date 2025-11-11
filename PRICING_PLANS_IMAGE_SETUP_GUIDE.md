# Pricing Plans Image Upload - Complete Setup Guide

## 📋 Overview

This guide will help you add image upload functionality to your Pricing Plans admin panel. Since your database is not connected yet, I'll provide step-by-step instructions for manual database setup.

---

## ✅ What Has Been Completed

### 1. **Frontend Code Updated** ✓
- Added image upload field to the pricing plan form
- Added image preview functionality
- Added image validation (file type and size)
- Added image removal functionality
- Updated the pricing plan cards to display images
- Integrated with Supabase Storage service

### 2. **Features Added** ✓
- **Image Upload**: Drag & drop or click to upload
- **Image Preview**: See the image before saving
- **Image Validation**: Only JPEG, PNG, WebP, GIF allowed (max 5MB)
- **Image Display**: Shows uploaded images in the pricing plan cards
- **Image Management**: Can remove and replace images
- **Loading States**: Shows "Uploading..." during image upload

---

## 🗄️ Database Setup (MANUAL STEPS)

### Step 1: Add `image_url` Column to `pricing_plans` Table

You need to add a new column to store the image URL in your database.

#### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your Berlin Holidays project
   - Click **Table Editor** in the left sidebar

2. **Find the `pricing_plans` Table**
   - Click on the `pricing_plans` table

3. **Add New Column**
   - Click the **"+"** button or **"Add Column"** button
   - Fill in the following details:
     - **Name**: `image_url`
     - **Type**: `text`
     - **Default value**: Leave empty
     - **Is Nullable**: ✓ (checked)
     - **Is Unique**: ☐ (unchecked)
     - **Is Primary Key**: ☐ (unchecked)
   - Click **Save**

#### Option B: Using SQL Editor

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your Berlin Holidays project
   - Click **SQL Editor** in the left sidebar

2. **Run This SQL Command**
   ```sql
   -- Add image_url column to pricing_plans table
   ALTER TABLE pricing_plans 
   ADD COLUMN image_url TEXT;
   ```

3. **Click "Run"** (or press Ctrl+Enter)

4. **Verify the Column Was Added**
   - Go to **Table Editor** → **pricing_plans**
   - You should see the new `image_url` column

---

### Step 2: Create Storage Bucket for Pricing Images

You need to create a storage bucket to store the pricing plan images.

#### Using Supabase Dashboard

1. **Open Storage Section**
   - In Supabase Dashboard, click **Storage** in the left sidebar

2. **Create New Bucket**
   - Click **"New bucket"** button
   - Fill in the details:
     - **Name**: `pricing-images`
     - **Public bucket**: ✓ (checked) - This allows images to be publicly accessible
     - **File size limit**: 5242880 (5MB in bytes)
     - **Allowed MIME types**: 
       ```
       image/jpeg
       image/jpg
       image/png
       image/webp
       image/gif
       ```
   - Click **Create bucket**

3. **Set Bucket Policies** (Important for Security)
   - Click on the `pricing-images` bucket
   - Click **Policies** tab
   - Click **New Policy**
   
   **Policy 1: Allow Public Read Access**
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'pricing-images' );
   ```
   
   **Policy 2: Allow Authenticated Users to Upload**
   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'pricing-images' 
     AND auth.role() = 'authenticated'
   );
   ```
   
   **Policy 3: Allow Authenticated Users to Update**
   ```sql
   CREATE POLICY "Authenticated users can update"
   ON storage.objects FOR UPDATE
   USING (
     bucket_id = 'pricing-images' 
     AND auth.role() = 'authenticated'
   );
   ```
   
   **Policy 4: Allow Authenticated Users to Delete**
   ```sql
   CREATE POLICY "Authenticated users can delete"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'pricing-images' 
     AND auth.role() = 'authenticated'
   );
   ```

---

### Step 3: Verify Database Schema

After completing the above steps, your `pricing_plans` table should have these columns:

| Column Name    | Type      | Nullable | Default           |
|----------------|-----------|----------|-------------------|
| id             | UUID      | No       | uuid_generate_v4()|
| name           | TEXT      | No       | -                 |
| duration       | TEXT      | No       | -                 |
| includes       | TEXT      | No       | -                 |
| price          | TEXT      | No       | -                 |
| **image_url**  | **TEXT**  | **Yes**  | **NULL**          |
| is_active      | BOOLEAN   | Yes      | true              |
| display_order  | INTEGER   | Yes      | 0                 |
| created_at     | TIMESTAMP | Yes      | NOW()             |
| updated_at     | TIMESTAMP | Yes      | NOW()             |

---

## 🧪 Testing the Feature

### Step 1: Test Image Upload

1. **Open Admin Dashboard**
   - Navigate to the Pricing Plans section
   - Click **"Add Pricing Plan"** button

2. **Fill in the Form**
   - Enter Plan Name (e.g., "Weekend Package")
   - Enter Duration (e.g., "2 Nights / 3 Days")
   - Enter Includes (e.g., "Accommodation, Breakfast")
   - Enter Price (e.g., "₹6000/person")

3. **Upload an Image**
   - Click on the image upload area
   - Select an image file (JPEG, PNG, WebP, or GIF)
   - You should see a preview of the image
   - The image should be less than 5MB

4. **Save the Plan**
   - Click **"Save & Publish"** or **"Save as Draft"**
   - Wait for the upload to complete
   - You should see a success message

5. **Verify the Image**
   - The pricing plan card should now display the uploaded image
   - The image should be stored in Supabase Storage

### Step 2: Test Image Update

1. **Edit an Existing Plan**
   - Click the **"Edit"** button on a pricing plan
   - You should see the current image (if any)

2. **Replace the Image**
   - Click the **X** button to remove the current image
   - Upload a new image
   - Click **"Save & Publish"**

3. **Verify the Update**
   - The old image should be deleted from storage
   - The new image should be displayed

### Step 3: Test Image Removal

1. **Edit a Plan with an Image**
   - Click **"Edit"** on a plan that has an image
   - Click the **X** button to remove the image
   - Click **"Save & Publish"**

2. **Verify Removal**
   - The plan should no longer display an image
   - The `image_url` field should be empty in the database

---

## 🔍 Troubleshooting

### Issue 1: "Failed to upload image"

**Possible Causes:**
- Storage bucket doesn't exist
- Storage bucket policies are not set correctly
- File size exceeds 5MB
- Invalid file type

**Solutions:**
1. Verify the `pricing-images` bucket exists in Supabase Storage
2. Check that all 4 storage policies are created (see Step 2)
3. Ensure the image is less than 5MB
4. Use only JPEG, PNG, WebP, or GIF formats

### Issue 2: Image doesn't display after upload

**Possible Causes:**
- Bucket is not public
- Image URL is incorrect
- CORS issues

**Solutions:**
1. Make sure the bucket is set to **Public**
2. Check the `image_url` in the database (should be a full URL)
3. Verify storage policies allow public read access

### Issue 3: "Column 'image_url' does not exist"

**Cause:**
- The database column hasn't been added yet

**Solution:**
1. Follow Step 1 to add the `image_url` column
2. Refresh your application

### Issue 4: Can't upload images (authentication error)

**Cause:**
- User is not authenticated
- Storage policies are too restrictive

**Solution:**
1. Make sure you're logged in to the admin panel
2. Verify the storage policies allow authenticated users to upload

---

## 📊 Database Query Examples

### View all pricing plans with images
```sql
SELECT id, name, duration, price, image_url, is_active
FROM pricing_plans
ORDER BY display_order;
```

### Find plans without images
```sql
SELECT id, name, duration, price
FROM pricing_plans
WHERE image_url IS NULL OR image_url = '';
```

### Update image URL manually (if needed)
```sql
UPDATE pricing_plans
SET image_url = 'https://your-supabase-url.supabase.co/storage/v1/object/public/pricing-images/plans/image.jpg'
WHERE id = 'your-plan-id';
```

### Delete all images from a plan
```sql
UPDATE pricing_plans
SET image_url = NULL
WHERE id = 'your-plan-id';
```

---

## 🎨 Frontend Features Summary

### Image Upload Component
- **Location**: Pricing Plans form modal
- **Accepts**: JPEG, PNG, WebP, GIF
- **Max Size**: 5MB
- **Preview**: Yes, shows preview before upload
- **Validation**: Client-side validation for type and size

### Image Display
- **Location**: Pricing plan cards in admin dashboard
- **Size**: 192px height (h-48), full width
- **Fallback**: No image shown if `image_url` is empty

### Image Management
- **Upload**: Click to select file
- **Preview**: Shows preview immediately after selection
- **Remove**: Click X button to remove image
- **Replace**: Remove old image and upload new one

---

## 📝 Next Steps

1. ✅ **Complete Database Setup** (Follow Steps 1-2 above)
2. ✅ **Test Image Upload** (Follow Testing section)
3. ✅ **Verify Storage Bucket** (Check Supabase Storage)
4. ✅ **Test on Frontend** (Upload, edit, delete images)
5. ✅ **Update Existing Plans** (Add images to existing pricing plans)

---

## 🔗 Related Files Modified

- `src/Pages/AdminDashboard/PricingPlans.jsx` - Main component with image upload
- `src/services/pricingService.js` - Already supports `image_url` field
- `src/services/storageService.js` - Handles image uploads to Supabase Storage

---

## 💡 Tips

1. **Image Optimization**: Consider compressing images before upload to reduce file size
2. **Image Dimensions**: Recommended size is 800x600px or similar aspect ratio
3. **File Naming**: The system automatically generates unique filenames
4. **Storage Location**: Images are stored in `pricing-images/plans/` folder
5. **Public Access**: Images are publicly accessible via URL (required for display)

---

## ✨ Summary

You now have a complete image upload system for pricing plans! The frontend code is ready, and you just need to:

1. Add the `image_url` column to the database
2. Create the `pricing-images` storage bucket
3. Set up storage policies for security
4. Test the upload functionality

Once these steps are complete, you'll be able to upload, display, and manage images for all your pricing plans!

