# ⚡ QUICK FIX - Vercel Deployment Error

## 🔴 Error
```
Uncaught Error: Missing Supabase environment variables. 
Please check your .env file.
```

## ✅ Solution (2 Minutes)

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard → Your Project → Settings → Environment Variables

### 2. Add These Two Variables

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://egqexbjvccihrvcrrydi.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncWV4Ymp2Y2NpaHJ2Y3JyeWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDY5NTEsImV4cCI6MjA3Nzk4Mjk1MX0.28a-MZYmRNE4SPMrA6zPsF56VGbHvlHJhn-dSDUvxSA
Environments: ✓ Production ✓ Preview ✓ Development
```

### 3. Redeploy
Deployments → Latest Deployment → ⋯ → Redeploy

### 4. Done! ✅
Your app should now work.

---

## 📖 Detailed Guide
See `VERCEL_DEPLOYMENT_GUIDE.md` for complete instructions.

