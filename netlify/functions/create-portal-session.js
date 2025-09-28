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
    let customerId, returnUrl;

    try {
      const parsed = JSON.parse(event.body);
      customerId = parsed.customerId;
      returnUrl = parsed.returnUrl;
    } catch (parseError) {
      console.error('❌ Error parsing request body:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body' }),
      };
    }

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

    // For now, redirect all users to contact page for billing management
    console.log('🔄 Redirecting to contact page for billing management');
    const baseUrl = event.headers.origin || 'https://resumeproof.com';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: `${baseUrl}/contact?subject=subscription-management&message=I need help managing my subscription`,
        isRedirect: true
      }),
    };

  } catch (error) {
    console.error('❌ Error creating portal session:', error);
    console.error('❌ Error details:', {
      code: error.code,
      type: error.type,
      message: error.message
    });

    // If customer doesn't exist, redirect to support
    if (error.code === 'resource_missing') {
      console.log('⚠️ Customer not found in Stripe - redirecting to support');
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
      body: JSON.stringify({
        error: 'Failed to create portal session',
        details: error.message
      }),
    };
  }
};