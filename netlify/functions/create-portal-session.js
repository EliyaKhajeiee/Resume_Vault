const Stripe = require('stripe');

exports.handler = async (event, context) => {
  // Initialize Stripe with environment variable
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { customerId, returnUrl } = JSON.parse(event.body);

    console.log('🔑 Creating portal session for customer:', customerId);
    console.log('🔄 Return URL:', returnUrl);

    if (!customerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing customer ID' }),
      };
    }

    // Check if this is a test customer ID
    if (customerId.startsWith('cus_test_')) {
      console.log('⚠️ Test customer detected - redirecting to support page');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          url: `${returnUrl.split('/').slice(0, 3).join('/')}/contact?subject=subscription-management&message=I need help managing my subscription`,
          isTestCustomer: true
        }),
      };
    }

    // Create portal session for real customers
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    console.log('✅ Portal session created:', session.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (error) {
    console.error('❌ Error creating portal session:', error);

    // If customer doesn't exist, redirect to support
    if (error.code === 'resource_missing') {
      const baseUrl = event.headers.origin || 'https://resumeproof.com';
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          url: `${baseUrl}/contact?subject=subscription-management&message=I need help managing my subscription`,
          isTestCustomer: true
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create portal session' }),
    };
  }
};