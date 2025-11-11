# Quick Start: Add Images to Pricing Plans

## 🚀 3-Step Setup Process

### Step 1: Add Database Column (2 minutes)

**Option A: Supabase Dashboard**
1. Go to https://app.supabase.com
2. Open your project → **Table Editor** → `pricing_plans`
3. Click **"+ Add Column"**
4. Settings:
   - Name: `image_url`
   - Type: `text`
   - Nullable: ✓ Yes
5. Click **Save**

**Option B: SQL Editor**
1. Go to https://app.supabase.com
2. Open your project → **SQL Editor**
3. Copy and paste this:
   ```sql
   ALTER TABLE pricing_plans ADD COLUMN image_url TEXT;
   ```
4. Click **Run**

---

### Step 2: Create Storage Bucket (3 minutes)

1. In Supabase Dashboard → **Storage**
2. Click **"New bucket"**
3. Settings:
   - Name: `pricing-images`
   - Public: ✓ Yes (checked)
4. Click **Create bucket**

5. Click on `pricing-images` bucket → **Policies** tab
6. Click **"New Policy"** → **"For full customization"**
7. Copy and paste ALL 4 policies from the file `add_image_to_pricing_plans.sql`
8. Click **Save** for each policy

---

### Step 3: Test It! (1 minute)

1. Open your admin dashboard
2. Go to **Pricing Plans**
3. Click **"Add Pricing Plan"**
4. Fill in the form
5. Click on the **image upload area**
6. Select an image (JPEG, PNG, WebP, or GIF, max 5MB)
7. Click **"Save & Publish"**
8. ✅ Done! Your image should appear on the pricing plan card

---

## 📋 Complete SQL Script

Just copy this entire block and run it in Supabase SQL Editor:

```sql
-- Add image_url column
ALTER TABLE pricing_plans ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Storage policies (run AFTER creating the bucket)
CREATE POLICY IF NOT EXISTS "Public Access to Pricing Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pricing-images' );

CREATE POLICY IF NOT EXISTS "Authenticated users can upload pricing images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pricing-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated users can update pricing images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pricing-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated users can delete pricing images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pricing-images' 
  AND auth.role() = 'authenticated'
);
```

---

## ✅ Verification Checklist

- [ ] `image_url` column exists in `pricing_plans` table
- [ ] `pricing-images` storage bucket created
- [ ] Storage bucket is set to **Public**
- [ ] All 4 storage policies are created
- [ ] Can upload image in admin panel
- [ ] Image appears in pricing plan card
- [ ] Image appears on frontend pricing page

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to upload image" | Make sure storage bucket exists and is public |
| "Column image_url does not exist" | Run Step 1 SQL command |
| Image doesn't display | Check if bucket is set to Public |
| Can't upload (auth error) | Make sure you're logged in as admin |

---

## 📁 Files Modified

✅ `src/Pages/AdminDashboard/PricingPlans.jsx` - Image upload form
✅ `src/Pages/InnerPage/Pricing.jsx` - Display images on frontend
✅ `src/services/pricingService.js` - Already supports image_url
✅ `src/services/storageService.js` - Handles uploads

---

## 💡 Quick Tips

- **Max file size**: 5MB
- **Supported formats**: JPEG, PNG, WebP, GIF
- **Recommended size**: 800x600px
- **Storage location**: `pricing-images/plans/`
- **Fallback**: If no image uploaded, shows default placeholder

---

## 📞 Need Help?

Check the detailed guide: `PRICING_PLANS_IMAGE_SETUP_GUIDE.md`

