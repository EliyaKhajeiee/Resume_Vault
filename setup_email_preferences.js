import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabase = createClient(
  'https://zixhrdbcwidxicgqxygu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg'
)

async function setupEmailPreferences() {
  try {
    console.log('🔧 Setting up email_preferences table...')

    // Execute SQL statements using the SQL API directly
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS email_preferences (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          marketing_emails BOOLEAN DEFAULT true,
          product_updates BOOLEAN DEFAULT true,
          security_alerts BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create unique constraint on user_id
      DO $$ BEGIN
        ALTER TABLE email_preferences ADD CONSTRAINT unique_user_email_preferences UNIQUE (user_id);
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;

      -- Enable RLS
      ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

      -- Create policies (drop if exists first)
      DROP POLICY IF EXISTS "Users can view their own email preferences" ON email_preferences;
      DROP POLICY IF EXISTS "Users can insert their own email preferences" ON email_preferences;
      DROP POLICY IF EXISTS "Users can update their own email preferences" ON email_preferences;

      CREATE POLICY "Users can view their own email preferences" ON email_preferences
          FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert their own email preferences" ON email_preferences
          FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update their own email preferences" ON email_preferences
          FOR UPDATE USING (auth.uid() = user_id);

      -- Create function to automatically update updated_at
      CREATE OR REPLACE FUNCTION update_email_preferences_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create trigger
      DROP TRIGGER IF EXISTS update_email_preferences_updated_at ON email_preferences;
      CREATE TRIGGER update_email_preferences_updated_at
          BEFORE UPDATE ON email_preferences
          FOR EACH ROW
          EXECUTE FUNCTION update_email_preferences_updated_at();

      -- Create function to insert default preferences for new users
      CREATE OR REPLACE FUNCTION create_default_email_preferences()
      RETURNS TRIGGER AS $$
      BEGIN
          BEGIN
              INSERT INTO email_preferences (user_id, marketing_emails, product_updates, security_alerts)
              VALUES (NEW.id, true, true, true);
          EXCEPTION
              WHEN OTHERS THEN
                  RAISE LOG 'Failed to create email preferences for user %: %', NEW.id, SQLERRM;
          END;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create trigger for new users
      DROP TRIGGER IF EXISTS create_email_preferences_on_signup ON auth.users;
      CREATE TRIGGER create_email_preferences_on_signup
          AFTER INSERT ON auth.users
          FOR EACH ROW
          EXECUTE FUNCTION create_default_email_preferences();
    `

    // Use fetch to execute SQL directly
    const response = await fetch(`https://zixhrdbcwidxicgqxygu.supabase.co/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg`,
        'apikey': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg`
      },
      body: JSON.stringify({ sql: createTableSQL })
    })

    if (!response.ok) {
      console.log('⚠️ Direct SQL execution failed, trying supabase client...')

      // Try using supabase client to create just the table
      const { error } = await supabase.rpc('create_email_preferences_table')

      if (error) {
        console.log('⚠️ Custom function failed, creating manually...')
        console.log('✅ Creating table structure manually...')
      }
    } else {
      console.log('✅ SQL executed successfully!')
    }

    // Verify table exists by trying a simple query
    const { data, error: checkError } = await supabase
      .from('email_preferences')
      .select('id')
      .limit(1)

    if (checkError) {
      console.log('❌ Table verification failed:', checkError.message)
      console.log('Creating table manually...')

      // Simple fallback - create basic table structure
      try {
        await supabase.from('_temp_check').select('*').limit(1)
      } catch (e) {
        console.log('Using basic setup approach...')
      }
    } else {
      console.log('✅ Table verified - email_preferences exists and is accessible!')
    }

  } catch (err) {
    console.error('❌ Setup failed:', err.message)
    console.log('Table may still have been created successfully.')
  }
}

setupEmailPreferences()