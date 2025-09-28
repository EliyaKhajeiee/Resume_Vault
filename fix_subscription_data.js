import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zixhrdbcwidxicgqxygu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg'
)

const userId = '8fd41e71-3275-4e9a-8bb3-379869ca05b1'

async function fixSubscriptionData() {
  try {
    console.log('🔧 Fixing subscription data for user:', userId)

    // Get current subscription
    const { data: subscription, error: getError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (getError) {
      console.error('❌ Error getting subscription:', getError)
      return
    }

    console.log('📋 Current subscription data:')
    console.log('- Period Start:', subscription.current_period_start)
    console.log('- Period End:', subscription.current_period_end)
    console.log('- Status:', subscription.status)

    // Calculate correct period end (1 month from start)
    const periodStart = new Date(subscription.current_period_start)
    const correctPeriodEnd = new Date(periodStart)
    correctPeriodEnd.setMonth(correctPeriodEnd.getMonth() + 1)

    console.log('\n🔨 Updating to correct values:')
    console.log('- Correct Period End:', correctPeriodEnd.toISOString())
    console.log('- Status: active')

    // Update the subscription
    const { data: updatedData, error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        current_period_end: correctPeriodEnd.toISOString(),
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()

    if (updateError) {
      console.error('❌ Error updating subscription:', updateError)
      return
    }

    console.log('✅ Subscription updated successfully!')
    console.log('📋 New subscription data:')
    console.log(updatedData[0])

    // Verify the fix
    const now = new Date()
    const isActive = correctPeriodEnd > now
    const daysRemaining = Math.ceil((correctPeriodEnd - now) / (1000 * 60 * 60 * 24))

    console.log('\n✅ Verification:')
    console.log('- Is Active:', isActive)
    console.log('- Days Remaining:', daysRemaining)
    console.log('- Should have access until:', correctPeriodEnd.toLocaleDateString())

  } catch (err) {
    console.error('❌ Error:', err)
  }
}

fixSubscriptionData()