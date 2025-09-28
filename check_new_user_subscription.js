import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zixhrdbcwidxicgqxygu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwNzkyMSwiZXhwIjoyMDY2NDgzOTIxfQ.nF0E7b2D-1Jngt11S8PNecjYNKzWdhm0F2Zf54ZMasg'
)

const userId = '8fd41e71-3275-4e9a-8bb3-379869ca05b1' // New user from logs

async function checkUserSubscription() {
  try {
    console.log('🔍 Checking subscription for user:', userId)

    const { data: subscriptions, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error:', error)
      return
    }

    console.log(`📊 Found ${subscriptions.length} subscription(s)`)

    subscriptions.forEach((sub, index) => {
      console.log(`\n--- Subscription ${index + 1} ---`)
      console.log('ID:', sub.id)
      console.log('Stripe Subscription ID:', sub.stripe_subscription_id)
      console.log('Stripe Customer ID:', sub.stripe_customer_id)
      console.log('Status:', sub.status)
      console.log('Plan ID:', sub.plan_id)
      console.log('Current Period Start:', sub.current_period_start)
      console.log('Current Period End:', sub.current_period_end)
      console.log('Created At:', sub.created_at)
      console.log('Updated At:', sub.updated_at)

      const now = new Date()
      const periodEnd = new Date(sub.current_period_end)
      const isActive = (sub.status === 'active' || sub.status === 'canceled') &&
        periodEnd > now

      console.log('Current time:', now.toISOString())
      console.log('Period ends:', periodEnd.toISOString())
      console.log('Should be active:', isActive)
      console.log('Days remaining:', Math.ceil((periodEnd - now) / (1000 * 60 * 60 * 24)))
    })

    // Also check if webhook is handling the subscription correctly
    console.log('\n🔍 Checking Stripe webhook data...')
    console.log('Expected new price ID should be: price_1S9CrwAdBHYS516Ed7j5YYaf')

  } catch (err) {
    console.error('❌ Error:', err)
  }
}

checkUserSubscription()