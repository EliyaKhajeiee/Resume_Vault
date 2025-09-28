import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zixhrdbcwidxicgqxygu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg'
)

// Both user IDs from the logs
const userIds = [
  '7e8441d2-2b54-4f48-ac4a-8f7548863d2a', // New user from logs
  '93f4bf8a-5e44-4734-9ad4-189c68875fb6'  // Previous user
]

async function checkSubscriptions() {
  try {
    console.log('🔍 Checking subscriptions for both users...')

    for (const userId of userIds) {
      console.log(`\n--- User: ${userId} ---`)

      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error:', error)
        continue
      }

      console.log(`📊 Found ${subscriptions.length} subscription(s)`)

      subscriptions.forEach((sub, index) => {
        console.log(`\n  Subscription ${index + 1}:`)
        console.log(`  - ID: ${sub.id}`)
        console.log(`  - Stripe ID: ${sub.stripe_subscription_id}`)
        console.log(`  - Status: ${sub.status}`)
        console.log(`  - Plan: ${sub.plan_id}`)
        console.log(`  - Period End: ${sub.current_period_end}`)
        console.log(`  - Created: ${sub.created_at}`)

        const isActive = (sub.status === 'active' || sub.status === 'canceled') &&
          new Date(sub.current_period_end) > new Date()
        console.log(`  - Should be active: ${isActive}`)
      })
    }

  } catch (err) {
    console.error('❌ Error:', err)
  }
}

checkSubscriptions()