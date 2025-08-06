$env:SUPABASE_ACCESS_TOKEN = "sbp_7339d52a98830671ce4c2cf2cc229ec929ae5adf"

Write-Host "Setting Stripe webhook secret..."
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_RsREiuridq2nwx2XiJnnU2nO5xGREM5b

Write-Host "Webhook secret set successfully!"