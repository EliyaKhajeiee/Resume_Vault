$env:SUPABASE_ACCESS_TOKEN = "sbp_7339d52a98830671ce4c2cf2cc229ec929ae5adf"

Write-Host "Setting Supabase Service Role Key..."
npx supabase secrets set SUPABASE_URL=https://zixhrdbcwidxicgqxygu.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.SJqFTp7fWlDcqy_CJQzfKb5EbO9A4XgXi_n4FKq2YuI

Write-Host "Redeploying create-checkout-session function..."
npx supabase functions deploy create-checkout-session

Write-Host "Function updated successfully!"