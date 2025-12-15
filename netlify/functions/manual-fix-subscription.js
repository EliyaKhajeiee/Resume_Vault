const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Parse the request
    const { email, subscriptionId, customerId } = JSON.parse(event.body);

    console.log('🔧 Manual fix requested for:', email);

    // Find user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch users', details: userError.message }),
      };
    }

    const user = users.users.find(u => u.email === email);
    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found', email }),
      };
    }

    console.log('✅ Found user:', user.id);

    // Check if subscription already exists
    const { data: existing } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (existing) {
      console.log('⚠️ Subscription already exists');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Subscription already exists',
          subscription: existing
        }),
      };
    }

    // Create subscription record
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const subscriptionData = {
      user_id: user.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan_id: 'pro-monthly',
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    console.log('📝 Creating subscription:', subscriptionData);

    const { data: newSub, error: insertError } = await supabase
      .from('user_subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Failed to create subscription:', insertError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create subscription', details: insertError.message }),
      };
    }

    console.log('✅ Subscription created successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Subscription created successfully',
        subscription: newSub
      }),
    };

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
