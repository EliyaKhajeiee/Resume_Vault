$env:SUPABASE_ACCESS_TOKEN = "sbp_7339d52a98830671ce4c2cf2cc229ec929ae5adf"

Write-Host "Running subscription tables SQL..."
npx supabase db remote commit --title "subscription_tables"

Write-Host "Done! Now manually run the SQL in Supabase dashboard."