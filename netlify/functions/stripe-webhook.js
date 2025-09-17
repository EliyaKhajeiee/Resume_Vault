// Import modules but don't initialize with environment variables yet
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Initialize Stripe and Supabase here, inside the handler where env vars are available
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
    console.log('🔑 Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('🔑 Supabase URL exists:', !!process.env.VITE_SUPABASE_URL);
    console.log('🔑 Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

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

    // Process checkout.session.completed (one-time purchases)
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      console.log('💳 Processing checkout session:', session.id);

      if (session.mode === 'payment') {
        // One-time purchase (resume pack)
        console.log('📦 Processing resume pack purchase');
        console.log('📧 Customer email:', session.customer_email);
        console.log('💰 Amount:', session.amount_total);

        // Find user by email - try multiple methods
        let user = null;

        console.log('🔍 Looking for user with email:', session.customer_email);
        console.log('🔑 Environment check:');
        console.log('  - SUPABASE_URL exists:', !!process.env.VITE_SUPABASE_URL);
        console.log('  - SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

        try {
          // Method 1: Try direct auth.users query
          const { data: userData, error: queryError } = await supabase
            .from('auth.users')
            .select('id, email')
            .eq('email', session.customer_email)
            .single();

          if (!queryError && userData) {
            user = userData;
            console.log('✅ Found user via direct query:', user.id);
          } else {
            console.log('⚠️ Direct query failed:', queryError?.message);

            // Method 2: Try admin listUsers as fallback
            const { data: users, error: listError } = await supabase.auth.admin.listUsers();
            if (listError) {
              console.error('❌ Admin API failed:', listError);
              return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                  error: 'User lookup failed',
                  details: `Direct query: ${queryError?.message}, Admin API: ${listError.message}`
                }),
              };
            }

            user = users.users.find(u => u.email === session.customer_email);
            console.log('🔍 Admin API found users count:', users.users.length);
            console.log('🔍 User found via admin API:', !!user);
          }
        } catch (error) {
          console.error('❌ Exception during user lookup:', error);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Database connection failed', details: error.message }),
          };
        }

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

    // Process invoice.payment_succeeded (monthly subscriptions)
    if (stripeEvent.type === 'invoice.payment_succeeded') {
      const invoice = stripeEvent.data.object;
      console.log('💰 Processing invoice payment:', invoice.id);

      // Only process subscription invoices (not one-time invoices)
      if (invoice.subscription) {
        console.log('📅 Processing subscription payment');
        console.log('📧 Customer email:', invoice.customer_email);
        console.log('💰 Amount:', invoice.amount_paid);

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

        const user = users.users.find(u => u.email === invoice.customer_email);

        if (!user) {
          console.error('❌ User not found:', invoice.customer_email);
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'User not found' }),
          };
        }

        console.log('👤 Found user:', user.id);

        // Create or update subscription record
        const subscriptionData = {
          user_id: user.id,
          stripe_customer_id: invoice.customer,
          stripe_subscription_id: invoice.subscription,
          status: 'active',
          current_period_start: new Date(invoice.period_start * 1000).toISOString(),
          current_period_end: new Date(invoice.period_end * 1000).toISOString(),
          plan_id: 'pro-monthly',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Try to update existing subscription first
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update(subscriptionData)
          .eq('stripe_subscription_id', invoice.subscription);

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
              body: JSON.stringify({ error: 'Database error' }),
            };
          }

          console.log('✅ New subscription record created');
        } else {
          console.log('✅ Subscription record updated');
        }
      }
    }

    // Process customer.subscription.deleted (subscription cancellations)
    if (stripeEvent.type === 'customer.subscription.deleted') {
      const subscription = stripeEvent.data.object;
      console.log('❌ Processing subscription deletion:', subscription.id);
      console.log('📧 Customer:', subscription.customer);

      // Update subscription status in database
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);

      if (updateError) {
        console.error('❌ Failed to update subscription status:', updateError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error during cancellation' }),
        };
      }

      console.log('✅ Subscription status updated to canceled');
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