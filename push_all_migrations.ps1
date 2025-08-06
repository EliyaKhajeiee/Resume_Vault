$env:SUPABASE_ACCESS_TOKEN = "sbp_7339d52a98830671ce4c2cf2cc229ec929ae5adf"

Write-Host "Running all database migrations..."
npx supabase db push --include-all

Write-Host "All migrations completed!"