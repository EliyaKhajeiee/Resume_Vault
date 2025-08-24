# Production Deployment Script for Resume Vault
# IMPORTANT: Make sure you have your LIVE Stripe keys ready!

Write-Host "🚀 PRODUCTION DEPLOYMENT FOR RESUME VAULT" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Check if user has live keys ready
Write-Host "⚠️  BEFORE RUNNING:" -ForegroundColor Yellow
Write-Host "1. Have your LIVE Stripe Publishable Key (pk_live_...)" -ForegroundColor Yellow
Write-Host "2. Have your LIVE Stripe Secret Key (sk_live_...)" -ForegroundColor Yellow
Write-Host "3. Have your LIVE Stripe Price ID for Pro plan" -ForegroundColor Yellow
Write-Host "4. Have created webhook in LIVE mode and have webhook secret" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Do you have all live Stripe keys ready? (y/N)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "❌ Please get your live Stripe keys first, then run this script again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Setting up environment variables..." -ForegroundColor Blue

# Get live keys from user
$LIVE_PK = Read-Host "Enter your LIVE Stripe Publishable Key (pk_live_...)"
$LIVE_SK = Read-Host "Enter your LIVE Stripe Secret Key (sk_live_...)" 
$LIVE_WEBHOOK = Read-Host "Enter your LIVE Stripe Webhook Secret (whsec_...)"
$LIVE_PRICE_ID = Read-Host "Enter your LIVE Stripe Price ID (price_...)"

Write-Host ""
Write-Host "🔄 Updating configuration files..." -ForegroundColor Blue

# Update .env file with live keys
$envContent = @"
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (LIVE KEYS)
VITE_STRIPE_PUBLISHABLE_KEY=$LIVE_PK

# Stripe Secret Keys (for Supabase Edge Functions) - SET THESE IN SUPABASE SECRETS
# STRIPE_SECRET_KEY=$LIVE_SK
# STRIPE_WEBHOOK_SECRET=$LIVE_WEBHOOK
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8
Write-Host "✅ Updated .env with live publishable key" -ForegroundColor Green

# Update stripe service with live price ID
(Get-Content "src\services\stripeService.ts") -replace "price_LIVE_YOUR_LIVE_PRICE_ID_HERE", $LIVE_PRICE_ID | Set-Content "src\services\stripeService.ts"
Write-Host "✅ Updated stripeService.ts with live price ID" -ForegroundColor Green

Write-Host ""
Write-Host "🔐 Setting Supabase secrets..." -ForegroundColor Blue

# Set Supabase secrets with live keys
Write-Host "Setting STRIPE_SECRET_KEY..."
npx supabase secrets set "STRIPE_SECRET_KEY=$LIVE_SK"

Write-Host "Setting STRIPE_WEBHOOK_SECRET..."  
npx supabase secrets set "STRIPE_WEBHOOK_SECRET=$LIVE_WEBHOOK"

Write-Host ""
Write-Host "🚀 Deploying Edge Functions..." -ForegroundColor Blue

# Deploy all Edge Functions
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-portal-session
npx supabase functions deploy stripe-webhook

Write-Host ""
Write-Host "🏗️  Building for production..." -ForegroundColor Blue
npm run build

Write-Host ""
Write-Host "✅ PRODUCTION DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Test a subscription on your live site" -ForegroundColor White
Write-Host "2. Verify webhook is receiving events in Stripe dashboard" -ForegroundColor White
Write-Host "3. Check Supabase database for subscription records" -ForegroundColor White
Write-Host "4. Monitor for any errors in Edge Function logs" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your app is now running with LIVE Stripe!" -ForegroundColor Green