$env:SUPABASE_ACCESS_TOKEN = "YOUR_SUPABASE_ACCESS_TOKEN"
Write-Host "Setting webhook secret..."
npx supabase secrets set STRIPE_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
Write-Host "✅ Webhook secret set!"