@echo off
echo ===============================================
echo Resume Proof - Email Preferences Table Setup
echo ===============================================
echo.

REM Check if SUPABASE_DB_URL environment variable exists
if "%SUPABASE_DB_URL%"=="" (
    echo ❌ SUPABASE_DB_URL not found!
    echo.
    echo Please set your Supabase database URL:
    echo 1. Go to your Supabase project dashboard
    echo 2. Go to Settings -^> Database
    echo 3. Copy the connection string under "Connection string"
    echo 4. Run: set SUPABASE_DB_URL=your_connection_string_here
    echo.
    echo Example: set SUPABASE_DB_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
    echo.
    pause
    exit /b 1
)

echo ✅ Database URL found
echo 📋 Connecting to: %SUPABASE_DB_URL:~0,30%...
echo.

echo 🔧 Creating email_preferences table and policies...
psql "%SUPABASE_DB_URL%" -f CREATE_EMAIL_PREFERENCES_TABLE.sql

if errorlevel 1 (
    echo ❌ Failed to create email preferences table
    echo.
    echo Make sure you have psql installed and your database URL is correct.
    echo You can also run the SQL manually in your Supabase SQL editor.
    pause
    exit /b 1
)

echo.
echo ✅ Email preferences table created successfully!
echo.
echo 📧 Created:
echo   • email_preferences table
echo   • Row Level Security policies
echo   • Automatic triggers for timestamps
echo   • Default preferences for new users
echo.
echo 🎯 Your email preferences feature is now ready!
echo Users can now manage their email subscriptions in the Settings page.
echo.
pause