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

    const { userId, subscriptionId, customerId } = JSON.parse(event.body);

    console.log('🔧 Direct fix for user:', userId);

    // Check if subscription already exists
    const { data: existing } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing) {
      console.log('⚠️ Subscription already exists, updating it');

      const { data: updated, error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan_id: 'pro-monthly',
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Update failed', details: updateError.message }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Subscription updated', subscription: updated }),
      };
    }

    // Create new subscription
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const subscriptionData = {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan_id: 'pro-monthly',
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    const { data: newSub, error: insertError } = await supabase
      .from('user_subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (insertError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Insert failed', details: insertError.message }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Subscription created', subscription: newSub }),
    };

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal error', details: error.message }),
    };
  }
};
