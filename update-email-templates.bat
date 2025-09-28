@echo off
echo ===============================================
echo Resume Proof - Supabase Email Template Updater
echo ===============================================
echo.

REM Check if required environment variables exist
if "%SUPABASE_ACCESS_TOKEN%"=="" (
    echo ❌ SUPABASE_ACCESS_TOKEN not found!
    echo.
    echo Please set your Supabase access token:
    echo 1. Go to https://supabase.com/dashboard/account/tokens
    echo 2. Create a new token or copy existing one
    echo 3. Run: set SUPABASE_ACCESS_TOKEN=your_token_here
    echo.
    pause
    exit /b 1
)

if "%PROJECT_REF%"=="" (
    echo ❌ PROJECT_REF not found!
    echo.
    echo Please set your project reference:
    echo 1. Go to your Supabase project dashboard
    echo 2. Copy the project reference from URL (e.g., abcdefghijklmnop)
    echo 3. Run: set PROJECT_REF=your_project_ref_here
    echo.
    pause
    exit /b 1
)

echo ✅ Environment variables found
echo 📋 Project Reference: %PROJECT_REF%
echo 🔑 Access Token: %SUPABASE_ACCESS_TOKEN:~0,10%...
echo.

echo 📥 Getting current email templates...
curl -X GET "https://api.supabase.com/v1/projects/%PROJECT_REF%/config/auth" ^
  -H "Authorization: Bearer %SUPABASE_ACCESS_TOKEN%" ^
  -o current-templates.json

if errorlevel 1 (
    echo ❌ Failed to fetch current templates
    pause
    exit /b 1
)

echo ✅ Current templates saved to current-templates.json
echo.

echo 🔄 Updating email templates with Resume Proof branding...

curl -X PATCH "https://api.supabase.com/v1/projects/%PROJECT_REF%/config/auth" ^
  -H "Authorization: Bearer %SUPABASE_ACCESS_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d @supabase-email-templates.json

if errorlevel 1 (
    echo ❌ Failed to update email templates
    pause
    exit /b 1
)

echo.
echo ✅ Email templates updated successfully!
echo.
echo 📧 Updated templates:
echo   • Welcome/Confirmation Email
echo   • Magic Link Email
echo   • Password Reset Email
echo   • Email Change Confirmation
echo   • User Invitation Email
echo.
echo 🎯 All emails now feature Resume Proof branding with:
echo   • Professional gradient design
echo   • Resume Proof logo and messaging
echo   • Compelling copy focused on career success
echo   • Clear call-to-action buttons
echo   • Security notices and helpful information
echo.
echo 🧪 Test your email templates by:
echo   1. Signing up a new user
echo   2. Requesting a password reset
echo   3. Checking the new branded emails
echo.
pause