#!/bin/bash

echo "🔧 Berlin Holidays - Vercel Environment Variables Fix"
echo "=================================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

echo "🔐 Please login to Vercel..."
vercel login

echo ""
echo "🔗 Linking to your project..."
vercel link

echo ""
echo "📝 Adding VITE_SUPABASE_URL..."
echo "When prompted, paste: https://egqexbjvccihrvcrrydi.supabase.co"
echo "Then select: Production, Preview, Development (use space to select)"
vercel env add VITE_SUPABASE_URL production preview development

echo ""
echo "📝 Adding VITE_SUPABASE_ANON_KEY..."
echo "When prompted, paste the anon key"
echo "Then select: Production, Preview, Development"
vercel env add VITE_SUPABASE_ANON_KEY production preview development

echo ""
echo "🚀 Deploying to production..."
vercel --prod

echo ""
echo "✅ Done! Your app should now work."
echo "Visit your Vercel URL to verify."

