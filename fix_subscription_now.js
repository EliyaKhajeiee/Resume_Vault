// Run this in your browser console to directly create the subscription
// We have all the data from the webhook event

const createSubscriptionNow = async () => {
  console.log('🔧 Creating subscription directly...');

  const { data: { user } } = await window.supabase.auth.getUser();

  if (!user) {
    console.log('❌ No user logged in');
    return;
  }

  console.log('👤 User ID:', user.id);
  console.log('📧 User email:', user.email);

  // First check if subscription already exists
  const { data: existing, error: checkError } = await window.supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', user.id);

  console.log('🔍 Existing subscriptions:', existing, 'Error:', checkError);

  if (existing && existing.length > 0) {
    console.log('✅ Subscription already exists!', existing[0]);
    return;
  }

  // Create the subscription with the exact data from your webhook
  const subscriptionData = {
    user_id: user.id,
    stripe_customer_id: 'cus_T4w04ZwHZ4VnV4',
    stripe_subscription_id: 'sub_1S8m8QAdBHYS516EVxXXKNWG',
    plan_id: 'pro-monthly',
    status: 'active',
    current_period_start: new Date('2025-09-18T18:00:46Z').toISOString(),
    current_period_end: new Date('2025-10-18T18:00:46Z').toISOString(), // 30 days later
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log('📝 Creating subscription with data:', subscriptionData);

  const { data, error } = await window.supabase
    .from('user_subscriptions')
    .insert(subscriptionData)
    .select();

  if (error) {
    console.error('❌ Error creating subscription:', error);
    console.log('🔍 Full error details:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Subscription created successfully!', data);
    console.log('🔄 Refresh the page to see changes');

    // Force refresh the subscription data
    window.location.reload();
  }
};

console.log('🚀 Run createSubscriptionNow() to create your subscription');
createSubscriptionNow();