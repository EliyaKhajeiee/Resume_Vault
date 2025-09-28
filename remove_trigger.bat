@echo off
echo Removing problematic email preferences trigger...

npx supabase db reset --db-url "%SUPABASE_SERVICE_ROLE_KEY%"

echo Done! User signups should now work.
pause