# 🚀 Vercel Deployment Guide - Berlin Holidays

## 🔴 Current Issue: Missing Environment Variables

**Error:** `Uncaught Error: Missing Supabase environment variables. Please check your .env file.`

**Cause:** Environment variables from `.env` are not automatically deployed to Vercel (`.env` is gitignored).

**Solution:** Add environment variables manually to Vercel.

---

## ✅ Quick Fix (5 Minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your **Berlin Holidays** project

### Step 2: Add Environment Variables
1. Click **"Settings"** tab
2. Click **"Environment Variables"** in the left sidebar
3. Add these two variables:

#### Variable 1: VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://egqexbjvccihrvcrrydi.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development
```
Click **"Save"**

#### Variable 2: VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncWV4Ymp2Y2NpaHJ2Y3JyeWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDY5NTEsImV4cCI6MjA3Nzk4Mjk1MX0.28a-MZYmRNE4SPMrA6zPsF56VGbHvlHJhn-dSDUvxSA
Environments: ✓ Production ✓ Preview ✓ Development
```
Click **"Save"**

### Step 3: Redeploy
**Option A - Trigger Redeploy:**
1. Go to **"Deployments"** tab
2. Click **three dots (...)** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

**Option B - Push New Commit:**
```bash
git add .
git commit -m "Add vercel.json configuration"
git push
```
Vercel will automatically redeploy.

### Step 4: Verify
1. Visit your Vercel app URL
2. Check if the app loads without errors
3. Open browser console (F12) - should see no Supabase errors

---

## 📸 Visual Guide

### Where to Add Environment Variables

```
Vercel Dashboard
├── Your Project (Berlin Holidays)
│   ├── Settings ← Click here
│   │   ├── Environment Variables ← Click here
│   │   │   ├── Add Variable
│   │   │   │   ├── Name: VITE_SUPABASE_URL
│   │   │   │   ├── Value: https://egqexbjvccihrvcrrydi.supabase.co
│   │   │   │   └── Environments: All ✓
│   │   │   └── Add Variable
│   │   │       ├── Name: VITE_SUPABASE_ANON_KEY
│   │   │       ├── Value: eyJhbGci...
│   │   │       └── Environments: All ✓
```

---

## 🔧 Alternative: Using Vercel CLI

If you prefer command line:

### Install Vercel CLI
```bash
npm i -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Link Your Project
```bash
vercel link
```

### Add Environment Variables
```bash
# Add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_URL

# When prompted:
# - Paste: https://egqexbjvccihrvcrrydi.supabase.co
# - Select: Production, Preview, Development (use space to select, enter to confirm)

# Add VITE_SUPABASE_ANON_KEY
vercel env add VITE_SUPABASE_ANON_KEY

# When prompted:
# - Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncWV4Ymp2Y2NpaHJ2Y3JyeWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDY5NTEsImV4cCI6MjA3Nzk4Mjk1MX0.28a-MZYmRNE4SPMrA6zPsF56VGbHvlHJhn-dSDUvxSA
# - Select: Production, Preview, Development
```

### Deploy
```bash
vercel --prod
```

---

## 📋 Checklist

Before deployment, ensure:

- [ ] Environment variables added to Vercel
- [ ] Both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- [ ] Variables are enabled for Production, Preview, and Development
- [ ] Redeployed after adding variables
- [ ] App loads without errors
- [ ] Supabase connection works (check admin login)

---

## 🔍 How to Verify Environment Variables

### In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. You should see:
   - `VITE_SUPABASE_URL` (Production, Preview, Development)
   - `VITE_SUPABASE_ANON_KEY` (Production, Preview, Development)

### In Deployed App:
1. Open your Vercel app URL
2. Open browser console (F12)
3. Type: `import.meta.env.VITE_SUPABASE_URL`
4. Should show: `https://egqexbjvccihrvcrrydi.supabase.co`

---

## ⚠️ Common Issues

### Issue 1: Still showing error after adding variables
**Solution:** You must redeploy after adding environment variables. Variables are only applied to new deployments.

### Issue 2: Variables not showing in app
**Solution:** 
- Check variable names are EXACTLY: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Vite requires `VITE_` prefix for environment variables
- Redeploy after fixing

### Issue 3: App works locally but not on Vercel
**Solution:**
- Local uses `.env` file
- Vercel uses environment variables from dashboard
- Make sure both have the same values

### Issue 4: "Invalid API key" error
**Solution:**
- Check that you copied the full anon key (it's very long)
- No extra spaces before/after the key
- Get fresh key from Supabase if needed

---

## 🔐 Security Notes

### ✅ Safe to Expose (Public)
- `VITE_SUPABASE_URL` - Public URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key (safe for client-side)

### ❌ Never Expose (Keep Secret)
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key (never use in frontend)
- Database passwords
- API secrets

**Note:** The anon key in this guide is safe to use in frontend code. It has Row Level Security (RLS) protection.

---

## 🎯 Best Practices

### 1. Use Environment Variables for All Secrets
Never hardcode:
- API keys
- Database URLs
- Service credentials

### 2. Keep .env in .gitignore
```gitignore
# Environment variables
.env
.env.local
.env.production
```

### 3. Use .env.example for Documentation
```env
# .env.example
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### 4. Set Variables in All Environments
- Production (live site)
- Preview (PR previews)
- Development (dev deployments)

---

## 🔄 Deployment Workflow

### For Future Deployments:

1. **Make code changes locally**
2. **Test locally** with `.env` file
3. **Commit and push** to GitHub
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
4. **Vercel auto-deploys** (if connected to GitHub)
5. **Verify deployment** on Vercel URL

### If Adding New Environment Variables:

1. **Add to `.env` locally**
2. **Add to `.env.example`** (without actual values)
3. **Add to Vercel Dashboard** (with actual values)
4. **Redeploy** to apply changes
5. **Update this guide** if needed

---

## 📞 Support

### If You Still Have Issues:

1. **Check Vercel Logs:**
   - Go to Deployments → Click on deployment → View Function Logs
   - Look for specific error messages

2. **Check Supabase Status:**
   - Visit: https://status.supabase.com/
   - Ensure Supabase is operational

3. **Verify Supabase Credentials:**
   - Go to: https://app.supabase.com/project/egqexbjvccihrvcrrydi/settings/api
   - Copy fresh URL and anon key
   - Update in Vercel

4. **Test Locally First:**
   ```bash
   npm run dev
   ```
   - If it works locally, issue is with Vercel environment variables
   - If it fails locally, issue is with code or local .env

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Vercel build completes without errors
✅ App loads on Vercel URL
✅ No console errors about Supabase
✅ Admin login works
✅ Room data loads from Supabase
✅ Images display correctly

---

## 📚 Additional Resources

- **Vercel Environment Variables Docs:** https://vercel.com/docs/environment-variables
- **Vite Environment Variables Docs:** https://vitejs.dev/guide/env-and-mode.html
- **Supabase JavaScript Client Docs:** https://supabase.com/docs/reference/javascript/introduction

---

**Last Updated:** November 8, 2025
**Project:** Berlin Holidays
**Deployment Platform:** Vercel
**Framework:** React + Vite
**Database:** Supabase

