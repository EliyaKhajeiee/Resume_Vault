// Test script to manually create subscription if webhook failed
// Run this in browser console after logging in

const createSubscriptionManually = async () => {
  console.log('🔧 Manually creating subscription...');

  const { data: { user } } = await window.supabase.auth.getUser();

  if (!user) {
    console.log('❌ No user logged in');
    return;
  }

  console.log('👤 Current user:', user.id, user.email);

  // Create subscription record with data from the webhook event
  const subscriptionData = {
    user_id: user.id,
    stripe_customer_id: 'cus_RHJqwNJkJ3B8wX', // You'll need to get this from Stripe
    stripe_subscription_id: 'sub_1S8m8RAdBHYS516EiBBDGvxl', // You'll need to get this from Stripe
    plan_id: 'pro-monthly',
    status: 'active',
    current_period_start: new Date('2025-09-18T18:01:17Z').toISOString(),
    current_period_end: new Date('2025-10-18T18:01:17Z').toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await window.supabase
    .from('user_subscriptions')
    .insert(subscriptionData);

  if (error) {
    console.error('❌ Error creating subscription:', error);
  } else {
    console.log('✅ Subscription created successfully:', data);
  }
};

createSubscriptionManually();