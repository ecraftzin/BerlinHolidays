# ✅ Blog Management Setup Checklist

Use this checklist to fix your blog management issues step by step.

## 📋 Pre-Setup Checklist

- [ ] I have access to Supabase Dashboard (https://app.supabase.com)
- [ ] I know my Supabase project URL: `https://egqexbjvccihrvcrrydi.supabase.co`
- [ ] My `.env` file has correct Supabase credentials
- [ ] My development server is running (`npm run dev`)

---

## 🗄️ Part 1: Database Tables Setup

### Step 1: Access Supabase SQL Editor
- [ ] Opened https://app.supabase.com
- [ ] Signed in to my account
- [ ] Selected Berlin Holidays project
- [ ] Clicked "SQL Editor" in left sidebar
- [ ] Clicked "New query" button

### Step 2: Run Database Setup Script
- [ ] Opened `setup_database.sql` file in my code editor
- [ ] Selected ALL content (Ctrl+A or Cmd+A)
- [ ] Copied content (Ctrl+C or Cmd+C)
- [ ] Pasted into Supabase SQL Editor
- [ ] Clicked "Run" button (or pressed Ctrl+Enter)
- [ ] Saw "Success. No rows returned" message

### Step 3: Verify Tables Created
- [ ] Clicked "Table Editor" in left sidebar
- [ ] Can see `blog_categories` table
- [ ] Can see `blog_posts` table
- [ ] Clicked on `blog_categories` table
- [ ] See 6 default categories (Travel, Guide, Travel Tips, Wildlife, Adventure, Culture)

---

## 📁 Part 2: Storage Bucket Setup

### Step 1: Create Storage Bucket
- [ ] In Supabase Dashboard, clicked "Storage" in left sidebar
- [ ] Clicked "Create a new bucket" button
- [ ] Entered bucket name: `blog-images`
- [ ] Checked "Public bucket" checkbox ✅ **IMPORTANT!**
- [ ] Clicked "Create bucket" button
- [ ] See `blog-images` bucket in the list

### Step 2: Set Storage Policies (Option A - Simple)
- [ ] Clicked on `blog-images` bucket
- [ ] Clicked "Configuration" tab
- [ ] Verified "Public" is set to ON/True
- [ ] Clicked "Policies" tab
- [ ] Clicked "New Policy" button
- [ ] Selected "Get started quickly" → "Allow public read access"
- [ ] Clicked "Use this template"
- [ ] Clicked "Review" then "Save policy"

### Step 3: Add Upload Policy
- [ ] Still in Policies tab
- [ ] Clicked "New Policy" button
- [ ] Selected "For full customization"
- [ ] Pasted the INSERT policy from `setup_storage_policies.sql`
- [ ] Clicked "Review" then "Save policy"
- [ ] See at least 2 policies listed

---

## 🧪 Part 3: Testing

### Test 1: Check for Errors
- [ ] Opened browser console (F12)
- [ ] Refreshed the admin dashboard page
- [ ] No more "Could not find table" errors ✅
- [ ] Console shows successful data fetching

### Test 2: Category Management
- [ ] Navigated to Blog Management page
- [ ] Clicked "Manage Categories" button
- [ ] Modal opens without errors
- [ ] See 6 default categories listed
- [ ] Tried adding a new category (e.g., "Food")
- [ ] New category appears in the list
- [ ] Closed and reopened modal - category still there

### Test 3: Blog Post Creation
- [ ] Clicked "Create New Post" button
- [ ] Modal opens without errors
- [ ] Category dropdown shows all categories
- [ ] Filled in Title: "Test Blog Post"
- [ ] Selected a category from dropdown
- [ ] Filled in Excerpt: "This is a test"
- [ ] Filled in Content: "This is test content"

### Test 4: Image Upload
- [ ] Clicked "Upload" button in Featured Image section
- [ ] Selected an image file (JPG/PNG)
- [ ] Saw "Uploading..." text on button
- [ ] Saw "Image uploaded successfully!" message
- [ ] Image URL appeared in the text field
- [ ] Image preview appeared below the field

### Test 5: Save Blog Post
- [ ] Clicked "Save & Publish" button
- [ ] Saw "Blog post published successfully!" message
- [ ] Modal closed automatically
- [ ] New blog post appears in the list
- [ ] Post shows correct title, category, and status

### Test 6: Edit Blog Post
- [ ] Clicked "Edit" button on the test post
- [ ] Modal opens with all data filled in
- [ ] Image preview shows the uploaded image
- [ ] Changed the title
- [ ] Clicked "Save & Publish"
- [ ] Changes saved successfully

### Test 7: Verify in Database
- [ ] Went to Supabase Dashboard
- [ ] Clicked "Table Editor"
- [ ] Clicked "blog_posts" table
- [ ] See the test post in the table
- [ ] All fields have correct data
- [ ] `featured_image` field has the Supabase Storage URL

---

## 🎉 Success Criteria

All of these should be TRUE:

- ✅ No console errors about missing tables
- ✅ Can view categories in "Manage Categories"
- ✅ Can add new categories
- ✅ Can create new blog posts
- ✅ Can upload images using the Upload button
- ✅ Image preview shows after upload
- ✅ Can save posts as Draft or Published
- ✅ Can edit existing posts
- ✅ Can delete posts
- ✅ All data persists after page refresh

---

## ❌ Troubleshooting

### If you checked a box but it didn't work:

**Database table errors:**
1. Go back to SQL Editor
2. Run this query to check tables:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('blog_posts', 'blog_categories');
   ```
3. Should return 2 rows
4. If not, re-run `setup_database.sql`

**Storage/Upload errors:**
1. Go to Storage → blog-images
2. Check "Public" is ON
3. Check Policies tab has at least 2 policies
4. Try uploading a smaller image (< 1MB)
5. Check browser console for specific error

**Categories not showing:**
1. Go to Table Editor → blog_categories
2. Should see 6 rows
3. If empty, run this in SQL Editor:
   ```sql
   INSERT INTO blog_categories (name, slug, is_active) VALUES
     ('Travel', 'travel', true),
     ('Guide', 'guide', true),
     ('Travel Tips', 'travel-tips', true),
     ('Wildlife', 'wildlife', true),
     ('Adventure', 'adventure', true),
     ('Culture', 'culture', true)
   ON CONFLICT (name) DO NOTHING;
   ```

**Can't save posts:**
1. Check all required fields are filled (Title, Category, Content)
2. Open browser console (F12) to see error details
3. Verify `.env` has correct Supabase credentials
4. Try refreshing the page

---

## 📊 Final Verification

Run this query in Supabase SQL Editor to verify everything:

```sql
-- Check tables exist
SELECT 'blog_posts' as table_name, COUNT(*) as row_count FROM blog_posts
UNION ALL
SELECT 'blog_categories', COUNT(*) FROM blog_categories;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE name = 'blog-images';

-- Check storage policies
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

Expected results:
- blog_posts: 0 or more rows (depending on how many you created)
- blog_categories: 6 or more rows
- storage.buckets: 1 row (blog-images)
- pg_policies: 2 or more rows

---

## ✨ You're Done!

If all checkboxes are checked, your blog management is fully functional! 🎊

You can now:
- ✅ Manage blog categories
- ✅ Create and edit blog posts
- ✅ Upload featured images
- ✅ Publish or save as draft
- ✅ Delete posts
- ✅ All changes persist in database

**Next Steps:**
1. Create your first real blog post
2. Add custom categories for your content
3. Upload high-quality featured images
4. Publish posts to your website

---

**Need help?** Check `QUICK_FIX_BLOG_ISSUES.md` for detailed troubleshooting.

