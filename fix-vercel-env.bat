@echo off
echo ========================================
echo Berlin Holidays - Vercel Env Fix
echo ========================================
echo.

echo Step 1: Installing Vercel CLI...
call npm i -g vercel

echo.
echo Step 2: Login to Vercel...
call vercel login

echo.
echo Step 3: Link your project...
call vercel link

echo.
echo Step 4: List current environment variables...
call vercel env ls

echo.
echo ========================================
echo MANUAL STEPS REQUIRED:
echo ========================================
echo.
echo Copy and run these commands ONE BY ONE:
echo.
echo 1. Add VITE_SUPABASE_URL:
echo    vercel env add VITE_SUPABASE_URL
echo    Paste: https://egqexbjvccihrvcrrydi.supabase.co
echo    Select: Production, Preview, Development
echo.
echo 2. Add VITE_SUPABASE_ANON_KEY:
echo    vercel env add VITE_SUPABASE_ANON_KEY
echo    Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncWV4Ymp2Y2NpaHJ2Y3JyeWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDY5NTEsImV4cCI6MjA3Nzk4Mjk1MX0.28a-MZYmRNE4SPMrA6zPsF56VGbHvlHJhn-dSDUvxSA
echo    Select: Production, Preview, Development
echo.
echo 3. Deploy:
echo    vercel --prod
echo.
echo ========================================
pause

