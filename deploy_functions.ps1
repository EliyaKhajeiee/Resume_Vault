$env:SUPABASE_ACCESS_TOKEN = "YOUR_SUPABASE_ACCESS_TOKEN"

Write-Host "Setting Stripe secret key..."
npx supabase secrets set STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY

Write-Host "Deploying Edge Functions..."
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-portal-session
npx supabase functions deploy stripe-webhook

Write-Host "Functions deployed successfully!"