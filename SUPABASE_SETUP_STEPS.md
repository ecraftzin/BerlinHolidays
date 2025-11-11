# Supabase Setup Steps - Visual Guide

## 🎯 Complete This in 5 Minutes!

Follow these exact steps in your Supabase dashboard.

---

## 📍 STEP 1: Add Database Column (2 minutes)

### Method 1: Using Table Editor (Easiest)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Login to your account
   - Select your **Berlin Holidays** project

2. **Navigate to Table Editor**
   ```
   Left Sidebar → Click "Table Editor" icon (looks like a table)
   ```

3. **Find pricing_plans Table**
   ```
   In the table list → Click "pricing_plans"
   ```

4. **Add New Column**
   ```
   Click the green "+ Add Column" button (top right)
   ```

5. **Fill in Column Details**
   ```
   Name:           image_url
   Type:           text
   Default Value:  [leave empty]
   
   Checkboxes:
   ☐ Primary Key
   ☑ Nullable (CHECK THIS!)
   ☐ Unique
   ☐ Is Identity
   ☐ Is Array
   ```

6. **Save**
   ```
   Click "Save" button
   ```

7. **Verify**
   ```
   You should now see "image_url" column in the pricing_plans table
   ```

---

### Method 2: Using SQL Editor (Alternative)

1. **Open SQL Editor**
   ```
   Left Sidebar → Click "SQL Editor" icon
   ```

2. **Create New Query**
   ```
   Click "+ New query" button
   ```

3. **Paste This SQL**
   ```sql
   ALTER TABLE pricing_plans 
   ADD COLUMN image_url TEXT;
   ```

4. **Run Query**
   ```
   Click "Run" button (or press Ctrl+Enter)
   ```

5. **Check Result**
   ```
   Should show: "Success. No rows returned"
   ```

---

## 📍 STEP 2: Create Storage Bucket (3 minutes)

### Part A: Create the Bucket

1. **Open Storage**
   ```
   Left Sidebar → Click "Storage" icon (looks like a folder)
   ```

2. **Create New Bucket**
   ```
   Click "New bucket" button (green button, top right)
   ```

3. **Configure Bucket**
   ```
   Name:        pricing-images
   Public:      ✓ (MUST BE CHECKED!)
   
   File size limit:     5242880
   Allowed MIME types:  image/jpeg,image/jpg,image/png,image/webp,image/gif
   ```

4. **Create Bucket**
   ```
   Click "Create bucket" button
   ```

---

### Part B: Set Up Storage Policies

1. **Open Bucket Policies**
   ```
   Click on "pricing-images" bucket
   → Click "Policies" tab (top of page)
   ```

2. **Add Policy 1: Public Read**
   ```
   Click "New Policy" button
   → Click "For full customization"
   
   Policy name: Public Access to Pricing Images
   
   Allowed operation: SELECT
   
   Policy definition:
   ```
   ```sql
   bucket_id = 'pricing-images'
   ```
   ```
   Click "Review" → Click "Save policy"
   ```

3. **Add Policy 2: Authenticated Upload**
   ```
   Click "New Policy" button
   → Click "For full customization"
   
   Policy name: Authenticated users can upload pricing images
   
   Allowed operation: INSERT
   
   WITH CHECK expression:
   ```
   ```sql
   bucket_id = 'pricing-images' AND auth.role() = 'authenticated'
   ```
   ```
   Click "Review" → Click "Save policy"
   ```

4. **Add Policy 3: Authenticated Update**
   ```
   Click "New Policy" button
   → Click "For full customization"
   
   Policy name: Authenticated users can update pricing images
   
   Allowed operation: UPDATE
   
   USING expression:
   ```
   ```sql
   bucket_id = 'pricing-images' AND auth.role() = 'authenticated'
   ```
   ```
   Click "Review" → Click "Save policy"
   ```

5. **Add Policy 4: Authenticated Delete**
   ```
   Click "New Policy" button
   → Click "For full customization"
   
   Policy name: Authenticated users can delete pricing images
   
   Allowed operation: DELETE
   
   USING expression:
   ```
   ```sql
   bucket_id = 'pricing-images' AND auth.role() = 'authenticated'
   ```
   ```
   Click "Review" → Click "Save policy"
   ```

---

## ✅ STEP 3: Verify Everything Works

### Check 1: Verify Column Exists

1. **Go to Table Editor**
   ```
   Left Sidebar → Table Editor → pricing_plans
   ```

2. **Look for image_url Column**
   ```
   Scroll right in the table view
   You should see: id, name, duration, includes, price, image_url, is_active...
   ```

---

### Check 2: Verify Storage Bucket

1. **Go to Storage**
   ```
   Left Sidebar → Storage
   ```

2. **Check Bucket Exists**
   ```
   You should see "pricing-images" in the bucket list
   ```

3. **Check Bucket is Public**
   ```
   Click on "pricing-images"
   Look for "Public" badge or indicator
   ```

4. **Check Policies**
   ```
   Click "Policies" tab
   You should see 4 policies:
   ✓ Public Access to Pricing Images
   ✓ Authenticated users can upload pricing images
   ✓ Authenticated users can update pricing images
   ✓ Authenticated users can delete pricing images
   ```

---

## 🧪 STEP 4: Test the Feature

1. **Open Your Application**
   ```
   Go to your admin dashboard
   Navigate to Pricing Plans section
   ```

2. **Create New Pricing Plan**
   ```
   Click "Add Pricing Plan" button
   Fill in:
   - Plan Name: Test Package
   - Duration: 2 Nights / 3 Days
   - Includes: Accommodation, Breakfast
   - Price: ₹5000/person
   ```

3. **Upload Image**
   ```
   Click on the image upload area
   Select an image file (JPEG, PNG, WebP, or GIF)
   Max size: 5MB
   ```

4. **Verify Preview**
   ```
   You should see the image preview immediately
   ```

5. **Save Plan**
   ```
   Click "Save & Publish"
   Wait for success message
   ```

6. **Check Result**
   ```
   The pricing plan card should now show your uploaded image
   ```

7. **Verify in Database**
   ```
   Go to Supabase → Table Editor → pricing_plans
   Find your test plan
   Check the image_url column - should have a URL like:
   https://[your-project].supabase.co/storage/v1/object/public/pricing-images/plans/[filename].jpg
   ```

8. **Verify in Storage**
   ```
   Go to Supabase → Storage → pricing-images
   You should see a "plans" folder
   Click on it - you should see your uploaded image
   ```

---

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ `image_url` column appears in `pricing_plans` table
- ✅ `pricing-images` bucket exists and is marked as Public
- ✅ 4 storage policies are active
- ✅ Can upload image in admin panel without errors
- ✅ Image preview shows immediately after selection
- ✅ "Save & Publish" completes successfully
- ✅ Image appears on pricing plan card in admin
- ✅ Image appears on frontend pricing page
- ✅ Image URL is saved in database
- ✅ Image file is visible in Supabase Storage

---

## 🚨 Common Issues & Solutions

### Issue: "Column image_url does not exist"
**Solution:** Complete STEP 1 above

### Issue: "Failed to upload image"
**Solutions:**
- Make sure bucket exists (STEP 2 Part A)
- Make sure bucket is PUBLIC
- Make sure policies are created (STEP 2 Part B)
- Make sure you're logged in as admin

### Issue: "Storage bucket not found"
**Solution:** Complete STEP 2 Part A above

### Issue: "Permission denied"
**Solutions:**
- Make sure all 4 policies are created (STEP 2 Part B)
- Make sure you're authenticated/logged in
- Check policy definitions match exactly

### Issue: Image doesn't display
**Solutions:**
- Make sure bucket is set to PUBLIC
- Check image_url in database has valid URL
- Check browser console for errors

---

## 📞 Need More Help?

- **Detailed Guide**: See `PRICING_PLANS_IMAGE_SETUP_GUIDE.md`
- **Quick Reference**: See `QUICK_START_PRICING_IMAGES.md`
- **SQL Script**: See `add_image_to_pricing_plans.sql`
- **Changes Summary**: See `PRICING_PLANS_CHANGES_SUMMARY.md`

---

## ⏱️ Time Estimate

- **STEP 1** (Add Column): 2 minutes
- **STEP 2** (Create Bucket + Policies): 3 minutes
- **STEP 3** (Verify): 1 minute
- **STEP 4** (Test): 2 minutes

**Total Time: ~8 minutes**

---

## 🎯 Quick Checklist

Before you start:
- [ ] I have access to Supabase dashboard
- [ ] I know which project is Berlin Holidays
- [ ] I'm ready to follow the steps

After completion:
- [ ] Column added to database
- [ ] Storage bucket created
- [ ] Bucket is set to Public
- [ ] All 4 policies created
- [ ] Tested image upload
- [ ] Image displays correctly

---

**You're all set! Follow these steps and you'll have image uploads working in minutes! 🚀**

