const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Parse request body
    const { priceId, userId, planId, mode, successUrl, cancelUrl } = JSON.parse(event.body);

    if (!priceId || !userId || !mode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Get user email from Supabase auth
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user?.user?.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User not found or email missing' }),
      };
    }

    // Create checkout session configuration
    const sessionConfig = {
      customer_email: user.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode, // 'subscription' or 'payment'
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    // Add metadata based on mode
    if (mode === 'subscription') {
      sessionConfig.subscription_data = {
        trial_period_days: 7, // 7-day free trial before first charge
        metadata: {
          userId: userId,
          planId: planId || 'pro-monthly',
        },
      };
    } else if (mode === 'payment') {
      sessionConfig.payment_intent_data = {
        metadata: {
          userId: userId,
          planId: planId || 'access-pack',
        },
      };
    }

    console.log('Creating checkout session with config:', JSON.stringify(sessionConfig, null, 2));

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('✅ Checkout session created:', session.id);
    console.log('✅ Trial period days:', sessionConfig.subscription_data?.trial_period_days);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
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
