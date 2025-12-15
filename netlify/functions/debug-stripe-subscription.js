const Stripe = require('stripe');

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
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { subscriptionId } = JSON.parse(event.body);

    console.log('🔍 Fetching subscription from Stripe:', subscriptionId);

    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        subscription: subscription
      }, null, 2),
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
