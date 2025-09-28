import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zixhrdbcwidxicgqxygu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg'
)

const userId = '93f4bf8a-5e44-4734-9ad4-189c68875fb6'

async function extendSubscription() {
  try {
    console.log('🔧 Extending subscription for testing...')

    // Extend by 30 days
    const newPeriodEnd = new Date()
    newPeriodEnd.setDate(newPeriodEnd.getDate() + 30)

    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({
        current_period_end: newPeriodEnd.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()

    if (error) {
      console.error('❌ Error:', error)
      return
    }

    console.log('✅ Subscription extended!')
    console.log('New period end:', newPeriodEnd.toISOString())
    console.log('Updated subscription:', data)

  } catch (err) {
    console.error('❌ Error:', err)
  }
}

extendSubscription()