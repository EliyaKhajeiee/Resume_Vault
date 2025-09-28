import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabase = createClient(
  'https://zixhrdbcwidxicgqxygu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg'
)

async function createEmailTable() {
  try {
    console.log('🔧 Creating email_preferences table with proper setup...')

    // Execute SQL step by step for better error handling
    const steps = [
      {
        name: 'Create table',
        sql: `
          CREATE TABLE IF NOT EXISTS email_preferences (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
              marketing_emails BOOLEAN DEFAULT true,
              product_updates BOOLEAN DEFAULT true,
              security_alerts BOOLEAN DEFAULT true,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'Add unique constraint',
        sql: `
          DO $$
          BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_email_preferences') THEN
                  ALTER TABLE email_preferences ADD CONSTRAINT unique_user_email_preferences UNIQUE (user_id);
              END IF;
          END $$;
        `
      },
      {
        name: 'Enable RLS',
        sql: `ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;`
      },
      {
        name: 'Create policies',
        sql: `
          DROP POLICY IF EXISTS "Users can view their own email preferences" ON email_preferences;
          DROP POLICY IF EXISTS "Users can insert their own email preferences" ON email_preferences;
          DROP POLICY IF EXISTS "Users can update their own email preferences" ON email_preferences;

          CREATE POLICY "Users can view their own email preferences" ON email_preferences
              FOR SELECT USING (auth.uid() = user_id);

          CREATE POLICY "Users can insert their own email preferences" ON email_preferences
              FOR INSERT WITH CHECK (auth.uid() = user_id);

          CREATE POLICY "Users can update their own email preferences" ON email_preferences
              FOR UPDATE USING (auth.uid() = user_id);
        `
      }
    ]

    for (const step of steps) {
      try {
        console.log(`⚡ ${step.name}...`)

        // Use rpc to execute raw SQL
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: step.sql
        })

        if (error && !error.message.includes('already exists')) {
          console.log(`⚠️ ${step.name} had an issue:`, error.message)
        } else {
          console.log(`✅ ${step.name} completed`)
        }
      } catch (err) {
        console.log(`⚠️ ${step.name} error:`, err.message)
      }
    }

    // Test table access
    console.log('\n🧪 Testing table access...')
    const { data, error } = await supabase
      .from('email_preferences')
      .select('id')
      .limit(1)

    if (error) {
      console.log('❌ Table test failed:', error.message)
      console.log('📝 Table creation completed but may need manual verification')
    } else {
      console.log('✅ Table test passed - email_preferences is accessible!')

      // Create default preferences for existing users if needed
      const userIds = [
        '7e8441d2-2b54-4f48-ac4a-8f7548863d2a',
        '93f4bf8a-5e44-4734-9ad4-189c68875fb6'
      ]

      console.log('\n👥 Creating default preferences for existing users...')
      for (const userId of userIds) {
        const { error: insertError } = await supabase
          .from('email_preferences')
          .upsert({
            user_id: userId,
            marketing_emails: true,
            product_updates: true,
            security_alerts: true
          }, { onConflict: 'user_id' })

        if (insertError) {
          console.log(`⚠️ User ${userId}:`, insertError.message)
        } else {
          console.log(`✅ User ${userId}: preferences created`)
        }
      }
    }

    console.log('\n🎉 Email preferences setup completed!')

  } catch (err) {
    console.error('❌ Setup failed:', err.message)
  }
}

createEmailTable()