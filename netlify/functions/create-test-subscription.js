const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'No authorization header' }),
      };
    }

    // Verify user session
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid session' }),
      };
    }

    console.log('🧪 Creating test subscription for user:', user.id);

    // Check if user already has a subscription
    const { data: existing } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (existing && existing.length > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Test subscription already exists',
          subscription: existing[0]
        }),
      };
    }

    // Create test subscription record
    const testSubscriptionData = {
      user_id: user.id,
      stripe_customer_id: 'cus_test_' + Date.now(),
      stripe_subscription_id: 'sub_test_' + Date.now(),
      plan_id: 'pro-monthly',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert(testSubscriptionData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating test subscription:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create test subscription', details: error.message }),
      };
    }

    console.log('✅ Test subscription created successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        subscription: data,
        message: 'Test subscription created successfully'
      }),
    };

  } catch (error) {
    console.error('❌ Test subscription creation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};