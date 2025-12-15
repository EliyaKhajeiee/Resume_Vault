const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { subscriptionId } = JSON.parse(event.body);

    // Update to trialing status with November 10 end date
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'trialing',
        current_period_end: '2025-11-10T22:33:51.000Z',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId)
      .select()
      .single();

    if (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Update failed', details: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Trial date fixed',
        subscription: data
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal error', details: error.message }),
    };
  }
};
