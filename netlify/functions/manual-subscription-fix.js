const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Create the missing subscription record for the specific user
    const subscriptionData = {
      user_id: '0402f7f0-06ab-4078-b6b6-3f428fdea6ef',
      stripe_customer_id: 'cus_QmGFQyoJ9oCsEo',
      stripe_subscription_id: 'sub_1QFqbgPMCgCvdUp8DHNz5ZcP',
      plan_id: 'pro-monthly',
      status: 'active',
      current_period_start: '2024-09-16T15:33:00Z',
      current_period_end: '2024-10-16T15:33:00Z',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating subscription record:', subscriptionData);

    const { data, error } = await supabase
      .from('user_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'stripe_subscription_id'
      })
      .select();

    if (error) {
      console.error('Error creating subscription:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create subscription', details: error.message }),
      };
    }

    console.log('Successfully created subscription:', data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};