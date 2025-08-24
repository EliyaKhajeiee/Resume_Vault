$env:SUPABASE_ACCESS_TOKEN = "sbp_7339d52a98830671ce4c2cf2cc229ec929ae5adf"

Write-Host "Resetting user resume access records..." -ForegroundColor Blue

# Run a simple delete query to clear all resume access records
$query = "DELETE FROM user_resume_access;"

# You'll need to run this manually in your Supabase SQL Editor
Write-Host "Please run this SQL query in your Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host $query -ForegroundColor Green

Write-Host "Or go to: https://supabase.com/dashboard/project/zixhrdbcwidxicgqxygu/sql" -ForegroundColor Cyan

Write-Host "This will reset all users to 0 resume views, allowing them to try the free tier again." -ForegroundColor Blue