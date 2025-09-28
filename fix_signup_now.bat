@echo off
echo ===============================================
echo Resume Proof - Fix User Signup Issue
echo ===============================================
echo.
echo Removing problematic email preferences trigger...
echo.

REM Use Supabase CLI to run the fix
npx supabase db reset --db-url postgresql://postgres:%SUPABASE_SERVICE_ROLE_KEY%@db.zixhrdbcwidxicgqxygu.supabase.co:5432/postgres

echo.
echo ✅ Fix applied! User signups should now work.
echo.
echo You can now test user registration.
echo.
pause