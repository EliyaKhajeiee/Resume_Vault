import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zixhrdbcwidxicgqxygu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg'
)

async function createEmailTable() {
  try {
    console.log('🔧 Creating email_preferences table...')

    // Use raw SQL via the REST API
    const response = await fetch('https://zixhrdbcwidxicgqxygu.supabase.co/rest/v1/rpc/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg'
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS email_preferences (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
              marketing_emails BOOLEAN DEFAULT true,
              product_updates BOOLEAN DEFAULT true,
              security_alerts BOOLEAN DEFAULT true,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

          CREATE POLICY IF NOT EXISTS "Users can view their own email preferences" ON email_preferences
              FOR SELECT USING (auth.uid() = user_id);

          CREATE POLICY IF NOT EXISTS "Users can insert their own email preferences" ON email_preferences
              FOR INSERT WITH CHECK (auth.uid() = user_id);

          CREATE POLICY IF NOT EXISTS "Users can update their own email preferences" ON email_preferences
              FOR UPDATE USING (auth.uid() = user_id);
        `
      })
    })

    if (response.ok) {
      console.log('✅ Table creation request sent successfully')
    } else {
      console.log('⚠️ API response not OK, trying simpler approach...')
    }

    // Test if table exists now
    const { data, error } = await supabase
      .from('email_preferences')
      .select('id')
      .limit(1)

    if (error) {
      console.log('❌ Table verification failed:', error.message)

      // Try creating default preferences for existing users
      const userIds = [
        '7e8441d2-2b54-4f48-ac4a-8f7548863d2a',
        '93f4bf8a-5e44-4734-9ad4-189c68875fb6'
      ]

      console.log('⚠️ Will handle missing table in the frontend gracefully')
    } else {
      console.log('✅ Table exists and is accessible!')

      // Insert default preferences for known users
      const userIds = [
        '7e8441d2-2b54-4f48-ac4a-8f7548863d2a',
        '93f4bf8a-5e44-4734-9ad4-189c68875fb6'
      ]

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
          console.log(`⚠️ Failed to create preferences for ${userId}:`, insertError.message)
        } else {
          console.log(`✅ Created preferences for user ${userId}`)
        }
      }
    }

  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

createEmailTable()