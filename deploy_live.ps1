Write-Host "🚀 DEPLOYING LIVE STRIPE CONFIGURATION" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

$env:SUPABASE_ACCESS_TOKEN = "YOUR_SUPABASE_ACCESS_TOKEN"

Write-Host "Setting live Stripe secret key..." -ForegroundColor Blue
npx supabase secrets set STRIPE_SECRET_KEY=YOUR_LIVE_STRIPE_SECRET_KEY

Write-Host "Deploying Edge Functions..." -ForegroundColor Blue
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-portal-session  
npx supabase functions deploy stripe-webhook

Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "Your app is now using LIVE Stripe!" -ForegroundColor Green