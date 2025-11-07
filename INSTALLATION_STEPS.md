# 🔧 Installation Steps - Berlin Holidays Admin Database Integration

Follow these steps to complete the setup of your admin dashboard database integration.

## 📦 Step 1: Install Supabase Package

The Berlin folder needs the Supabase JavaScript client library.

### Navigate to Berlin folder:
```bash
cd Berlin
```

### Install Supabase:
```bash
npm install @supabase/supabase-js
```

This will add `@supabase/supabase-js` to your `package.json` dependencies.

---

## 🔑 Step 2: Set Up Environment Variables

### Create `.env` file in the Berlin folder:

```bash
# In Berlin folder
touch .env
```

### Add your Supabase credentials to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Get your credentials:
1. Go to https://app.supabase.com
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### Create `.env.example` for reference:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Update `.gitignore`:

Make sure `.env` is in your `.gitignore` file:

```gitignore
# Environment variables
.env
.env.local
.env.production
```

---

## 🗄️ Step 3: Create Supabase Client Configuration

### Create the config folder:
```bash
mkdir -p Berlin/src/config
```

### Create `Berlin/src/config/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('blog_posts').select('*').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.log('Supabase connection established successfully!');
      return true;
    }
    console.log('Supabase connection established successfully!');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

export default supabase;
```

---

## 🗃️ Step 4: Create Database Tables

### Go to Supabase Dashboard:
1. Open https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Run the setup script:
1. Open the file `setup_database.sql` from this project
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** button (or press Ctrl+Enter)

### Verify tables were created:
1. Click **Table Editor** in the left sidebar
2. You should see all these tables:
   - blog_posts
   - seo_global_settings
   - seo_page_settings
   - room_types
   - rate_plans
   - room_rates
   - room_availability
   - pricing_plans
   - special_offers
   - restaurant_categories
   - restaurant_menu_items

---

## 📂 Step 5: Copy Service Files

The service files are already created in `src/services/`. You need to copy them to the Berlin folder:

### Option 1: Manual Copy
Copy the entire `src/services/` folder to `Berlin/src/services/`

### Option 2: Command Line
```bash
# From project root
cp -r src/services Berlin/src/
```

### Verify the files:
```
Berlin/src/services/
├── availabilityService.js
├── blogService.js
├── dashboardService.js
├── index.js
├── pricingService.js
├── ratePlansService.js
├── restaurantService.js
├── roomService.js
├── seoService.js
└── specialOffersService.js
```

---

## 🚀 Step 6: Start the Development Server

### Navigate to Berlin folder:
```bash
cd Berlin
```

### Install all dependencies (if not already done):
```bash
npm install
```

### Start the dev server:
```bash
npm run dev
```

The server should start at `http://localhost:5173` (or another port if 5173 is busy).

---

## ✅ Step 7: Test the Integration

### Open the Admin Dashboard:
1. Navigate to `http://localhost:5173`
2. Go to the Admin Dashboard
3. Click on **Blog Management**

### Test CRUD Operations:

#### Create a Blog Post:
1. Click "Create New Post" button
2. Fill in:
   - Title: "Test Blog Post"
   - Category: "Travel"
   - Content: "This is a test post to verify database integration."
3. Click "Save & Publish"
4. You should see a success message
5. The post should appear in the list

#### Verify in Supabase:
1. Go to Supabase Dashboard → Table Editor
2. Click on `blog_posts` table
3. You should see your test post

#### Edit the Post:
1. Click the edit icon on your test post
2. Change the title to "Updated Test Post"
3. Click "Save & Publish"
4. Verify the change appears

#### Delete the Post:
1. Click the delete icon
2. Confirm deletion
3. Post should be removed from the list

---

## 🔍 Step 8: Verify Everything Works

### Check Browser Console:
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for any errors (there should be none)
4. You should see successful API calls to Supabase

### Check Network Tab:
1. In Developer Tools, go to Network tab
2. Filter by "Fetch/XHR"
3. You should see requests to your Supabase URL
4. Status should be 200 (success)

### Check Supabase Logs:
1. Go to Supabase Dashboard
2. Click **Logs** → **API Logs**
3. You should see your recent API calls

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution:** 
- Check that `.env` file exists in Berlin folder
- Verify the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after creating `.env`

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
cd Berlin
npm install @supabase/supabase-js
```

### Issue: "relation 'blog_posts' does not exist"
**Solution:**
- Run the `setup_database.sql` script in Supabase SQL Editor
- Verify tables were created in Table Editor

### Issue: "Failed to fetch" or network errors
**Solution:**
- Check your internet connection
- Verify Supabase URL is correct in `.env`
- Check if Supabase project is active (not paused)

### Issue: Service files not found
**Solution:**
- Verify `Berlin/src/services/` folder exists
- Copy service files from `src/services/` to `Berlin/src/services/`

### Issue: Import errors in BlogManagement
**Solution:**
- Check that the import path is correct: `import { ... } from "../../services"`
- Verify `Berlin/src/services/index.js` exists and exports all services

---

## 📋 Installation Checklist

Use this checklist to track your progress:

- [ ] Installed `@supabase/supabase-js` in Berlin folder
- [ ] Created `.env` file with Supabase credentials
- [ ] Created `.env.example` file
- [ ] Updated `.gitignore` to exclude `.env`
- [ ] Created `Berlin/src/config/supabaseClient.js`
- [ ] Ran `setup_database.sql` in Supabase SQL Editor
- [ ] Verified all 11 tables were created
- [ ] Copied service files to `Berlin/src/services/`
- [ ] Started development server successfully
- [ ] Tested BlogManagement component
- [ ] Created a test blog post
- [ ] Verified post in Supabase Table Editor
- [ ] Edited the test post
- [ ] Deleted the test post
- [ ] No errors in browser console
- [ ] API calls visible in Network tab

---

## 🎯 Next Steps After Installation

Once installation is complete and BlogManagement is working:

1. **Update remaining components** following `ADMIN_INTEGRATION_GUIDE.md`
2. **Test each component** using `TESTING_CHECKLIST.md`
3. **Add authentication** (optional, for production)
4. **Enable RLS policies** (optional, for production)
5. **Deploy to production**

---

## 📚 Reference Files

- **QUICK_START_GUIDE.md** - Quick start instructions
- **ADMIN_INTEGRATION_GUIDE.md** - Detailed integration patterns
- **ADMIN_DATABASE_SCHEMA.md** - Database schema documentation
- **TESTING_CHECKLIST.md** - Complete testing checklist
- **IMPLEMENTATION_SUMMARY.md** - Overview of what's been done

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review the browser console for errors
3. Check Supabase API logs
4. Verify all files are in the correct locations
5. Ensure all dependencies are installed

---

**Good luck with the installation! 🚀**

Once you complete these steps, your Berlin Holidays Admin Dashboard will be fully connected to the Supabase database!

