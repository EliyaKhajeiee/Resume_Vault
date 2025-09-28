# Resume Proof - Supabase Email Template Updater
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Resume Proof - Supabase Email Template Updater" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if required environment variables exist
$accessToken = $env:SUPABASE_ACCESS_TOKEN
$projectRef = $env:PROJECT_REF

if (-not $accessToken) {
    Write-Host "❌ SUPABASE_ACCESS_TOKEN not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your Supabase access token:" -ForegroundColor Yellow
    Write-Host "1. Go to https://supabase.com/dashboard/account/tokens" -ForegroundColor White
    Write-Host "2. Create a new token or copy existing one" -ForegroundColor White
    Write-Host "3. Run: `$env:SUPABASE_ACCESS_TOKEN='your_token_here'" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not $projectRef) {
    Write-Host "❌ PROJECT_REF not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your project reference:" -ForegroundColor Yellow
    Write-Host "1. Go to your Supabase project dashboard" -ForegroundColor White
    Write-Host "2. Copy the project reference from URL (e.g., abcdefghijklmnop)" -ForegroundColor White
    Write-Host "3. Run: `$env:PROJECT_REF='your_project_ref_here'" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Environment variables found" -ForegroundColor Green
Write-Host "📋 Project Reference: $projectRef" -ForegroundColor White
Write-Host "🔑 Access Token: $($accessToken.Substring(0, 10))..." -ForegroundColor White
Write-Host ""

# Read the email templates JSON
Write-Host "📁 Reading email templates from supabase-email-templates.json..." -ForegroundColor Blue
try {
    $templatesJson = Get-Content -Path "supabase-email-templates.json" -Raw
    Write-Host "✅ Templates file loaded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to read supabase-email-templates.json" -ForegroundColor Red
    Write-Host "Make sure the file exists in the current directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "📥 Getting current email templates..." -ForegroundColor Blue

# Get current templates
$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type" = "application/json"
}

try {
    $currentTemplates = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/$projectRef/config/auth" -Method GET -Headers $headers
    $currentTemplates | ConvertTo-Json -Depth 10 | Out-File -FilePath "current-templates-backup.json"
    Write-Host "✅ Current templates saved to current-templates-backup.json" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to fetch current templates: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🔄 Updating email templates with Resume Proof branding..." -ForegroundColor Blue

# Update templates
try {
    $response = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/$projectRef/config/auth" -Method PATCH -Headers $headers -Body $templatesJson
    Write-Host "✅ Email templates updated successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to update email templates: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "📧 Updated templates:" -ForegroundColor Cyan
Write-Host "  • Welcome/Confirmation Email" -ForegroundColor White
Write-Host "  • Magic Link Email" -ForegroundColor White
Write-Host "  • Password Reset Email" -ForegroundColor White
Write-Host "  • Email Change Confirmation" -ForegroundColor White
Write-Host "  • User Invitation Email" -ForegroundColor White

Write-Host ""
Write-Host "🎯 All emails now feature Resume Proof branding with:" -ForegroundColor Green
Write-Host "  • Professional gradient design" -ForegroundColor White
Write-Host "  • Resume Proof logo and messaging" -ForegroundColor White
Write-Host "  • Compelling copy focused on career success" -ForegroundColor White
Write-Host "  • Clear call-to-action buttons" -ForegroundColor White
Write-Host "  • Security notices and helpful information" -ForegroundColor White

Write-Host ""
Write-Host "🧪 Test your email templates by:" -ForegroundColor Yellow
Write-Host "  1. Signing up a new user" -ForegroundColor White
Write-Host "  2. Requesting a password reset" -ForegroundColor White
Write-Host "  3. Checking the new branded emails" -ForegroundColor White

Write-Host ""
Read-Host "Press Enter to exit"