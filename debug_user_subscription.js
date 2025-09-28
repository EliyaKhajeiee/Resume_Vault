// Debug script to check current user's subscription
// Run this in browser console on your site

console.log('🔍 Debugging user subscription...');

// Get current user
const getCurrentUser = async () => {
  const { data: { user } } = await window.supabase.auth.getUser();
  console.log('👤 Current user:', user?.id, user?.email);
  return user;
};

// Check subscription directly in database
const checkSubscription = async (userId) => {
  console.log('🔍 Checking subscription for user:', userId);

  const { data: subs, error: subError } = await window.supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId);

  console.log('📋 Subscription query result:', { data: subs, error: subError });

  const { data: purchases, error: purchaseError } = await window.supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId);

  console.log('📦 Purchase query result:', { data: purchases, error: purchaseError });
};

// Run debug
getCurrentUser().then(user => {
  if (user) {
    checkSubscription(user.id);
  } else {
    console.log('❌ No user logged in');
  }
});