import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixSignupIssue() {
  console.log('🔧 Fixing user signup issue...')

  try {
    // Drop the problematic trigger and function
    const { error } = await supabase.rpc('sql', {
      query: `
        -- Drop the trigger if it exists
        DROP TRIGGER IF EXISTS create_user_email_preferences ON auth.users;

        -- Drop the function if it exists
        DROP FUNCTION IF EXISTS create_default_email_preferences();

        -- Drop the table if it exists
        DROP TABLE IF EXISTS email_preferences CASCADE;
      `
    })

    if (error) {
      console.error('❌ Error:', error)
    } else {
      console.log('✅ Fixed! User signups should now work.')
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

fixSignupIssue()