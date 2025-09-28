import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zixhrdbcwidxicgqxygu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGhyZGJjd2lkeGljZ3F4eWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MDc5MjEsImV4cCI6MjA2NjQ4MzkyMX0.bjQIJn-0Kkgc3aDeYYuJLsEnYs1xFsIAJiRl2oDfySg'
)

const userId = '93f4bf8a-5e44-4734-9ad4-189c68875fb6'

async function debugSubscriptionStatus() {
  console.log('🔍 Debugging subscription status for user:', userId)

  const { data: subscriptions, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log('📊 Found subscriptions:', subscriptions.length)

  subscriptions.forEach((sub, index) => {
    console.log(`\n--- Subscription ${index + 1} ---`)
    console.log('ID:', sub.id)
    console.log('Stripe Subscription ID:', sub.stripe_subscription_id)
    console.log('Status:', sub.status)
    console.log('Plan ID:', sub.plan_id)
    console.log('Current Period End:', sub.current_period_end)
    console.log('Created At:', sub.created_at)
    console.log('Updated At:', sub.updated_at)

    const isActive = (sub.status === 'active' || sub.status === 'canceled') &&
      new Date(sub.current_period_end) > new Date()
    console.log('Should be active:', isActive)
    console.log('Period end vs now:', new Date(sub.current_period_end), '>', new Date())
  })
}

debugSubscriptionStatus()