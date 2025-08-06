$env:SUPABASE_ACCESS_TOKEN = "sbp_7339d52a98830671ce4c2cf2cc229ec929ae5adf"

Write-Host "Deploying stripe-webhook function with debug mode..."
npx supabase functions deploy stripe-webhook

Write-Host "Function redeployed successfully!"