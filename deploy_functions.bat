@echo off
set SUPABASE_ACCESS_TOKEN=YOUR_SUPABASE_ACCESS_TOKEN
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase secrets set STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-portal-session
npx supabase functions deploy stripe-webhook
echo Functions deployed successfully!
pause