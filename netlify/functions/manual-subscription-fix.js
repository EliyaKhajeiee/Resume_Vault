// Manual function to create subscription record from Stripe invoice ID
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
    'Access-Control-Allow-Headers': 'Content-Type',
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
    const { invoiceId, userEmail } = JSON.parse(event.body);

    if (!invoiceId || !userEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing invoiceId or userEmail' }),
      };
    }

    console.log('🔍 Retrieving invoice:', invoiceId);
    console.log('👤 For user email:', userEmail);

    // Get invoice details from Stripe
    const invoice = await stripe.invoices.retrieve(invoiceId);

    if (!invoice.subscription) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invoice is not for a subscription' }),
      };
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);

    console.log('📅 Subscription details:');
    console.log('  - ID:', subscription.id);
    console.log('  - Customer:', subscription.customer);
    console.log('  - Status:', subscription.status);
    console.log('  - Period start:', new Date(subscription.current_period_start * 1000));
    console.log('  - Period end:', new Date(subscription.current_period_end * 1000));

    // Find user in Supabase
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch users', details: userError.message }),
      };
    }

    const user = users.users.find(u => u.email === userEmail);

    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    console.log('👤 Found user:', user.id);

    // Create subscription record
    const subscriptionData = {
      user_id: user.id,
      stripe_customer_id: subscription.customer,
      stripe_subscription_id: subscription.id,
      plan_id: 'pro-monthly',
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Try to update existing subscription first
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update(subscriptionData)
      .eq('stripe_subscription_id', subscription.id);

    if (updateError) {
      // If update fails, try to insert new subscription
      const { error: insertError } = await supabase
        .from('user_subscriptions')
        .insert(subscriptionData);

      if (insertError) {
        console.error('❌ Failed to create subscription record:', insertError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: insertError.message }),
        };
      }

      console.log('✅ New subscription record created');
    } else {
      console.log('✅ Subscription record updated');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Subscription record created/updated successfully',
        subscription: {
          stripe_subscription_id: subscription.id,
          customer_id: subscription.customer,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000)
        }
      }),
    };

  } catch (error) {
    console.error('❌ Manual subscription fix error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
    };
  }
};