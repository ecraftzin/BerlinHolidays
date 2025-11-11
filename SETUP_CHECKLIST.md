# 📋 Pricing Plans Image Upload - Setup Checklist

## ✅ Complete Setup Checklist

Use this checklist to ensure everything is set up correctly.

---

## 📚 PHASE 1: Read Documentation (5 minutes)

- [ ] Read `README_IMAGE_UPLOAD.md` (overview)
- [ ] Read `QUICK_START_PRICING_IMAGES.md` (quick guide)
- [ ] Read `SUPABASE_SETUP_STEPS.md` (detailed steps)
- [ ] Understand the flow diagrams

---

## 🗄️ PHASE 2: Database Setup (2 minutes)

### Option A: Using Supabase Table Editor
- [ ] Open Supabase Dashboard (https://app.supabase.com)
- [ ] Navigate to Table Editor
- [ ] Click on `pricing_plans` table
- [ ] Click "+ Add Column" button
- [ ] Enter column name: `image_url`
- [ ] Select type: `text`
- [ ] Check "Nullable" checkbox
- [ ] Click "Save"
- [ ] Verify column appears in table

### Option B: Using SQL Editor
- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Click "+ New query"
- [ ] Paste: `ALTER TABLE pricing_plans ADD COLUMN image_url TEXT;`
- [ ] Click "Run" (or Ctrl+Enter)
- [ ] Verify success message
- [ ] Go to Table Editor to confirm column exists

---

## 📦 PHASE 3: Storage Bucket Setup (3 minutes)

### Create Bucket
- [ ] Open Supabase Dashboard
- [ ] Navigate to Storage
- [ ] Click "New bucket" button
- [ ] Enter name: `pricing-images`
- [ ] Check "Public bucket" checkbox ⚠️ IMPORTANT!
- [ ] (Optional) Set file size limit: 5242880
- [ ] (Optional) Set allowed MIME types: image/jpeg,image/jpg,image/png,image/webp,image/gif
- [ ] Click "Create bucket"
- [ ] Verify bucket appears in list
- [ ] Verify "Public" badge is shown

### Create Storage Policies
- [ ] Click on `pricing-images` bucket
- [ ] Click "Policies" tab

#### Policy 1: Public Read
- [ ] Click "New Policy"
- [ ] Click "For full customization"
- [ ] Name: `Public Access to Pricing Images`
- [ ] Allowed operation: SELECT
- [ ] Policy definition: `bucket_id = 'pricing-images'`
- [ ] Click "Review" → "Save policy"

#### Policy 2: Authenticated Upload
- [ ] Click "New Policy"
- [ ] Click "For full customization"
- [ ] Name: `Authenticated users can upload pricing images`
- [ ] Allowed operation: INSERT
- [ ] WITH CHECK: `bucket_id = 'pricing-images' AND auth.role() = 'authenticated'`
- [ ] Click "Review" → "Save policy"

#### Policy 3: Authenticated Update
- [ ] Click "New Policy"
- [ ] Click "For full customization"
- [ ] Name: `Authenticated users can update pricing images`
- [ ] Allowed operation: UPDATE
- [ ] USING: `bucket_id = 'pricing-images' AND auth.role() = 'authenticated'`
- [ ] Click "Review" → "Save policy"

#### Policy 4: Authenticated Delete
- [ ] Click "New Policy"
- [ ] Click "For full customization"
- [ ] Name: `Authenticated users can delete pricing images`
- [ ] Allowed operation: DELETE
- [ ] USING: `bucket_id = 'pricing-images' AND auth.role() = 'authenticated'`
- [ ] Click "Review" → "Save policy"

### Verify Policies
- [ ] Go to Storage → pricing-images → Policies tab
- [ ] Confirm 4 policies are listed
- [ ] All policies should be "Enabled"

---

## 🔍 PHASE 4: Verification (2 minutes)

### Database Verification
- [ ] Go to Table Editor → pricing_plans
- [ ] Scroll right to see all columns
- [ ] Confirm `image_url` column exists
- [ ] Column type should be `text`
- [ ] Column should be nullable

### Storage Verification
- [ ] Go to Storage
- [ ] Confirm `pricing-images` bucket exists
- [ ] Confirm bucket has "Public" badge
- [ ] Click on bucket → Policies tab
- [ ] Confirm 4 policies exist and are enabled

### SQL Verification (Optional)
- [ ] Go to SQL Editor
- [ ] Run this query:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pricing_plans' AND column_name = 'image_url';
```
- [ ] Should return 1 row with: image_url, text, YES

---

## 🧪 PHASE 5: Testing (5 minutes)

### Test 1: Upload New Image
- [ ] Open your application
- [ ] Navigate to Admin Dashboard → Pricing Plans
- [ ] Click "Add Pricing Plan"
- [ ] Fill in required fields:
  - [ ] Plan Name: "Test Package"
  - [ ] Duration: "2 Nights / 3 Days"
  - [ ] Includes: "Accommodation, Breakfast"
  - [ ] Price: "₹5000/person"
- [ ] Click on image upload area
- [ ] Select an image file (JPEG, PNG, WebP, or GIF)
- [ ] Verify image preview appears
- [ ] Click "Save & Publish"
- [ ] Wait for success message
- [ ] Verify image appears on pricing plan card

### Test 2: Verify in Database
- [ ] Go to Supabase → Table Editor → pricing_plans
- [ ] Find your test plan
- [ ] Check `image_url` column
- [ ] Should contain a URL like: `https://[project].supabase.co/storage/v1/object/public/pricing-images/plans/[filename].jpg`

### Test 3: Verify in Storage
- [ ] Go to Supabase → Storage → pricing-images
- [ ] Click on "plans" folder (should be created automatically)
- [ ] Verify your uploaded image file is there
- [ ] Click on the image to preview it

### Test 4: Edit Image
- [ ] In admin panel, click "Edit" on your test plan
- [ ] Verify existing image is shown
- [ ] Click X button to remove image
- [ ] Upload a different image
- [ ] Click "Save & Publish"
- [ ] Verify new image appears
- [ ] Go to Storage → pricing-images → plans
- [ ] Verify old image is deleted
- [ ] Verify new image is present

### Test 5: Remove Image
- [ ] Click "Edit" on a plan with an image
- [ ] Click X button to remove image
- [ ] Don't upload a new image
- [ ] Click "Save & Publish"
- [ ] Verify no image appears on card
- [ ] Check database - `image_url` should be empty/null

### Test 6: Frontend Display
- [ ] Open your website (frontend)
- [ ] Navigate to Pricing page
- [ ] Verify uploaded images display correctly
- [ ] Verify plans without images show default placeholders

### Test 7: File Validation
- [ ] Try uploading a file > 5MB
- [ ] Should show error: "Image size should be less than 5MB"
- [ ] Try uploading a non-image file (e.g., .pdf, .txt)
- [ ] Should show error: "Please upload a valid image file"

---

## 🎯 PHASE 6: Production Readiness

### Code Review
- [ ] Check `src/Pages/AdminDashboard/PricingPlans.jsx` for any console errors
- [ ] Check `src/Pages/InnerPage/Pricing.jsx` for any console errors
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Test on different screen sizes

### Performance Check
- [ ] Images load quickly
- [ ] No console errors
- [ ] Upload process is smooth
- [ ] Preview appears instantly

### Security Check
- [ ] Only authenticated users can upload
- [ ] Public can view images (required)
- [ ] File size is limited
- [ ] File types are restricted
- [ ] Storage policies are correct

---

## 📊 PHASE 7: Final Verification

### Functionality Checklist
- [ ] ✅ Can create new pricing plan with image
- [ ] ✅ Can edit existing pricing plan
- [ ] ✅ Can replace image on existing plan
- [ ] ✅ Can remove image from plan
- [ ] ✅ Image preview works
- [ ] ✅ File validation works
- [ ] ✅ Images display in admin dashboard
- [ ] ✅ Images display on frontend
- [ ] ✅ Images stored in Supabase Storage
- [ ] ✅ Image URLs saved in database
- [ ] ✅ Old images deleted when replaced
- [ ] ✅ Error messages display correctly
- [ ] ✅ Success messages display correctly
- [ ] ✅ Loading states work correctly

### Database Checklist
- [ ] ✅ `image_url` column exists
- [ ] ✅ Column is nullable
- [ ] ✅ Column type is TEXT
- [ ] ✅ Can store full URLs
- [ ] ✅ No errors when saving

### Storage Checklist
- [ ] ✅ `pricing-images` bucket exists
- [ ] ✅ Bucket is public
- [ ] ✅ 4 policies created
- [ ] ✅ All policies enabled
- [ ] ✅ Can upload files
- [ ] ✅ Can delete files
- [ ] ✅ Files are publicly accessible
- [ ] ✅ URLs are correct

---

## 🎉 SUCCESS CRITERIA

You can mark this feature as COMPLETE when:

1. **Database Setup** ✅
   - `image_url` column exists in `pricing_plans` table
   - Column is properly configured (TEXT, nullable)

2. **Storage Setup** ✅
   - `pricing-images` bucket exists and is public
   - All 4 storage policies are created and enabled

3. **Upload Works** ✅
   - Can select and upload images
   - Preview shows before saving
   - File validation works
   - Success message appears

4. **Display Works** ✅
   - Images show in admin dashboard
   - Images show on frontend pricing page
   - Fallback works when no image

5. **Management Works** ✅
   - Can edit and replace images
   - Can remove images
   - Old images are deleted when replaced

6. **No Errors** ✅
   - No console errors
   - No database errors
   - No storage errors
   - All features work smoothly

---

## 📞 If Something Doesn't Work

### Step 1: Check This Checklist
- Go through each item above
- Make sure everything is checked ✅

### Step 2: Review Documentation
- `PRICING_PLANS_IMAGE_SETUP_GUIDE.md` - Troubleshooting section
- `SUPABASE_SETUP_STEPS.md` - Common issues

### Step 3: Verify Setup
- Database column exists
- Storage bucket exists and is public
- All 4 policies are created
- You're logged in as admin

### Step 4: Check Browser Console
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Step 5: Check Supabase Logs
- Go to Supabase Dashboard
- Check logs for errors

---

## ✨ Congratulations!

If all items are checked ✅, your image upload feature is fully functional!

**Total Setup Time**: ~15 minutes
**Total Test Time**: ~5 minutes
**Total Time**: ~20 minutes

🎉 **You're done! Start uploading beautiful images to your pricing plans!** 🎉

