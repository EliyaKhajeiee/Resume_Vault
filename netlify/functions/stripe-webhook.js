const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
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
    console.log('🎯 Netlify webhook received');

    // Parse the event
    let stripeEvent;
    try {
      stripeEvent = JSON.parse(event.body);
      console.log('📦 Event type:', stripeEvent.type);
    } catch (err) {
      console.error('❌ Invalid JSON');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON' }),
      };
    }

    // Process checkout.session.completed
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      console.log('💳 Processing checkout session:', session.id);

      if (session.mode === 'payment') {
        // One-time purchase (resume pack)
        console.log('📦 Processing resume pack purchase');
        console.log('📧 Customer email:', session.customer_email);
        console.log('💰 Amount:', session.amount_total);

        // Find user by email
        const { data: users, error: userError } = await supabase.auth.admin.listUsers();

        if (userError) {
          console.error('❌ Error fetching users:', userError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Database error' }),
          };
        }

        const user = users.users.find(u => u.email === session.customer_email);

        if (!user) {
          console.error('❌ User not found:', session.customer_email);
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'User not found' }),
          };
        }

        console.log('👤 Found user:', user.id);

        // Create purchase record
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

        const purchaseData = {
          user_id: user.id,
          stripe_payment_intent_id: session.payment_intent,
          plan_id: 'access-pack',
          amount: session.amount_total / 100, // Convert from cents
          status: 'succeeded',
          resumes_remaining: 5, // 5 resumes for $1.01 pack
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('user_purchases')
          .insert(purchaseData);

        if (insertError) {
          console.error('❌ Failed to create purchase record:', insertError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Database error' }),
          };
        }

        console.log('✅ Purchase record created successfully');
      }
    }

    console.log('✅ Webhook processed successfully');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('❌ Webhook error:', error);
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