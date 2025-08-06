# Get Supabase Service Role Key

## Where to find it:

1. **Go to your Supabase dashboard**: https://supabase.com/dashboard/project/zixhrdbcwidxicgqxygu
2. **Go to Settings > API**
3. **Find "service_role" key** (not the anon key)
4. **Copy the service_role key**

It will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (much longer than anon key)

## Why we need it:
The Edge Function needs the service_role key to:
- Access user data from auth.users table
- Create subscription records
- Perform admin operations

**Please get this key and give it to me so I can add it to the Edge Function secrets.**