// Manual subscription fix - run this in browser console
// This will add the subscription record that the webhook should have created

const fixSubscription = async () => {
  console.log('🔧 Fixing subscription manually...');

  // Get current user
  const { data: { user } } = await window.supabase.auth.getUser();

  if (!user) {
    console.log('❌ No user logged in');
    return;
  }

  console.log('👤 User ID:', user.id);
  console.log('📧 User email:', user.email);

  // Check if subscription already exists
  const { data: existing } = await window.supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', user.id);

  if (existing && existing.length > 0) {
    console.log('✅ Subscription already exists:', existing[0]);
    return;
  }

  // Create the subscription record
  // Note: You'll need to get the actual customer and subscription IDs from Stripe dashboard
  const subscriptionData = {
    user_id: user.id,
    stripe_customer_id: 'REPLACE_WITH_ACTUAL_CUSTOMER_ID', // Get from Stripe dashboard
    stripe_subscription_id: 'REPLACE_WITH_ACTUAL_SUBSCRIPTION_ID', // Get from Stripe dashboard
    plan_id: 'pro-monthly',
    status: 'active',
    current_period_start: new Date('2025-09-18T18:01:17Z').toISOString(),
    current_period_end: new Date('2025-10-18T18:01:17Z').toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log('📝 Creating subscription with data:', subscriptionData);

  const { data, error } = await window.supabase
    .from('user_subscriptions')
    .insert(subscriptionData);

  if (error) {
    console.error('❌ Error creating subscription:', error);
  } else {
    console.log('✅ Subscription created successfully!');
    console.log('🔄 Refresh the page to see the changes');
  }
};

console.log('🚀 Run fixSubscription() to manually add your subscription');
console.log('⚠️  First, you need to get your customer and subscription IDs from Stripe dashboard');
console.log('   Then update the REPLACE_WITH_ACTUAL_* values in the script');