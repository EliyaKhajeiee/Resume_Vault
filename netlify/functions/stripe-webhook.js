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
    console.log('📦 Raw event body length:', event.body?.length);

    // Parse the event
    let stripeEvent;
    try {
      stripeEvent = JSON.parse(event.body);
      console.log('📦 Event type:', stripeEvent.type);
      console.log('📦 Event ID:', stripeEvent.id);
      console.log('📦 Event data object type:', stripeEvent.data?.object?.object);

      // Log all supported event types we handle
      const supportedEvents = ['checkout.session.completed', 'invoice.payment_succeeded', 'invoice_payment.paid', 'customer.subscription.deleted'];
      console.log('🔍 Is supported event?', supportedEvents.includes(stripeEvent.type));

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
      console.log('🛤️ Entering checkout.session.completed path');
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
          resumes_remaining: 5, // 5 resumes for $9.99 pack
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

    // Process invoice.payment_succeeded OR invoice_payment.paid (monthly subscriptions)
    if (stripeEvent.type === 'invoice.payment_succeeded' || stripeEvent.type === 'invoice_payment.paid') {
      console.log('🛤️ Entering invoice payment processing path');
      console.log('📋 Event type:', stripeEvent.type);
      let invoice;
      let subscriptionId;

      if (stripeEvent.type === 'invoice_payment.paid') {
        // For invoice_payment.paid events, we need to fetch the invoice details
        const payment = stripeEvent.data.object;
        console.log('💰 Processing invoice_payment.paid:', payment.id);
        console.log('💰 Payment object:', JSON.stringify(payment, null, 2));

        try {
          console.log('🔍 Retrieving invoice:', payment.invoice);
          invoice = await stripe.invoices.retrieve(payment.invoice);
          subscriptionId = invoice.subscription;
          console.log('✅ Retrieved invoice successfully. Subscription ID:', subscriptionId);
        } catch (error) {
          console.error('❌ Failed to retrieve invoice:', error);
          console.error('❌ Error details:', error.message);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to retrieve invoice details', details: error.message }),
          };
        }
      } else {
        // For invoice.payment_succeeded, use the invoice directly
        invoice = stripeEvent.data.object;
        subscriptionId = invoice.subscription;
      }

      console.log('💰 Processing invoice payment:', invoice.id);

      console.log('🔍 Subscription ID from invoice:', subscriptionId);

      // Check if this is a subscription invoice by billing_reason or metadata
      const isSubscriptionInvoice = subscriptionId ||
        invoice.billing_reason === 'subscription_create' ||
        invoice.lines?.data?.[0]?.metadata?.planId === 'pro-monthly';

      console.log('🔍 Is subscription invoice?', isSubscriptionInvoice);
      console.log('🔍 Billing reason:', invoice.billing_reason);
      console.log('🔍 Line item metadata:', invoice.lines?.data?.[0]?.metadata);

      // Process subscription invoices (with or without subscription ID)
      if (isSubscriptionInvoice) {
        console.log('✅ Processing subscription payment (subscription creation)');
        console.log('📅 Processing subscription payment');
        console.log('📧 Customer email:', invoice.customer_email);
        console.log('💰 Amount:', invoice.amount_paid);

        // If no subscription ID, try to get it from line item metadata or fetch from Stripe
        if (!subscriptionId) {
          // Check if subscription ID is in metadata
          const metadata = invoice.lines?.data?.[0]?.metadata;
          if (metadata?.subscriptionId) {
            subscriptionId = metadata.subscriptionId;
            console.log('✅ Found subscription ID in metadata:', subscriptionId);
          } else {
            // Try to fetch subscription from Stripe using customer ID
            console.log('🔄 Fetching subscription from Stripe for customer:', invoice.customer);
            try {
              const subscriptions = await stripe.subscriptions.list({
                customer: invoice.customer,
                limit: 1
              });

              if (subscriptions.data.length > 0) {
                subscriptionId = subscriptions.data[0].id;
                console.log('✅ Found subscription ID from Stripe:', subscriptionId);
              } else {
                console.log('⚠️ No subscription found for customer, using generated ID');
                subscriptionId = `sub_generated_${Date.now()}`;
              }
            } catch (error) {
              console.error('❌ Error fetching subscription from Stripe:', error);
              subscriptionId = `sub_generated_${Date.now()}`;
            }
          }
        }

        // Find user by email
        console.log('🔍 Looking for user with email:', invoice.customer_email);

        let user = null;

        // Try multiple methods to find the user
        try {
          // Method 1: Try to find user by email from Supabase auth
          const { data: users, error: userError } = await supabase.auth.admin.listUsers();

          if (userError) {
            console.error('❌ Error fetching users:', userError);
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ error: 'Database error', details: userError.message }),
            };
          }

          console.log('👥 Total users found:', users.users.length);
          console.log('📧 Looking for email:', invoice.customer_email);
          console.log('📧 Available emails:', users.users.map(u => u.email));

          user = users.users.find(u => u.email === invoice.customer_email);

          // Method 2: If not found by email, try to find by user_id from metadata
          if (!user && invoice.lines?.data?.[0]?.metadata?.userId) {
            const userId = invoice.lines.data[0].metadata.userId;
            console.log('🔍 Trying to find user by metadata userId:', userId);
            user = users.users.find(u => u.id === userId);
            if (user) {
              console.log('✅ Found user by metadata userId instead of email');
            }
          }

          if (!user) {
            console.error('❌ User not found by email or metadata');
            console.log('📧 Searched email:', invoice.customer_email);
            console.log('🆔 Searched userId:', invoice.lines?.data?.[0]?.metadata?.userId);
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({
                error: 'User not found',
                email: invoice.customer_email,
                userId: invoice.lines?.data?.[0]?.metadata?.userId,
                availableEmails: users.users.map(u => ({ id: u.id, email: u.email }))
              }),
            };
          }
        } catch (error) {
          console.error('❌ Exception during user lookup:', error);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'User lookup failed', details: error.message }),
          };
        }

        console.log('👤 Found user:', user.id);
        console.log('📧 User email matches:', user.email === invoice.customer_email);

        // Calculate correct period dates
        const periodStart = new Date(invoice.period_start * 1000);
        let periodEnd = new Date(invoice.period_end * 1000);

        // Fix for when Stripe sets period_start = period_end (happens on first invoice sometimes)
        if (periodStart.getTime() === periodEnd.getTime()) {
          console.log('⚠️ Period start equals period end, calculating correct period end (+1 month)');
          periodEnd = new Date(periodStart);
          periodEnd.setMonth(periodEnd.getMonth() + 1);
          console.log('✅ Corrected period end:', periodEnd.toISOString());
        }

        // Determine plan ID from price ID (if available in line items)
        let planId = 'pro-monthly'; // Default
        const priceMapping = {
          'price_1S9CrwAdBHYS516Ed7j5YYaf': 'pro-monthly', // $29.99 monthly
          'price_1S9CZkAdBHYS516EzVkWRfPj': 'access-pack', // $9.99 one-time
          'price_1Ruy4kAdBHYS516EV50u326a': 'pro-monthly', // Old $29.99 monthly
          'price_1S7i8SAdBHYS516EGeFCDYrG': 'pro-monthly', // Old $1.00 monthly
          'price_1S7i2iAdBHYS516EX1FCq84E': 'access-pack'  // Old $1.01 one-time
        };

        if (invoice.lines && invoice.lines.data && invoice.lines.data.length > 0) {
          const lineItem = invoice.lines.data[0];
          if (lineItem.price && lineItem.price.id) {
            const mappedPlan = priceMapping[lineItem.price.id];
            if (mappedPlan) {
              planId = mappedPlan;
              console.log('✅ Mapped price ID', lineItem.price.id, 'to plan:', planId);
            } else {
              console.log('⚠️ Unknown price ID:', lineItem.price.id, 'using default plan');
            }
          }
        }

        // Create or update subscription record
        const subscriptionData = {
          user_id: user.id,
          stripe_customer_id: invoice.customer,
          stripe_subscription_id: subscriptionId,
          status: 'active', // Force active status for successful payments
          current_period_start: periodStart.toISOString(),
          current_period_end: periodEnd.toISOString(),
          plan_id: planId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('📝 Creating subscription with ACTIVE status for successful payment');

        console.log('📝 Subscription data to insert/update:', JSON.stringify(subscriptionData, null, 2));
        console.log('🔧 About to attempt database upsert...');

        try {
          console.log('🔗 Testing Supabase connection...');

          // First test if we can connect to Supabase at all
          const { data: testData, error: testError } = await supabase
            .from('user_subscriptions')
            .select('count', { count: 'exact', head: true });

          console.log('🧪 Connection test result:', { testData, testError });

          if (testError) {
            console.error('❌ Cannot connect to Supabase:', testError);
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({
                error: 'Database connection failed',
                details: testError.message,
                subscription_data: subscriptionData
              }),
            };
          }

          console.log('✅ Supabase connection successful, proceeding with upsert...');

          // Use upsert to handle both insert and update cases
          const { data: upsertData, error: upsertError } = await supabase
            .from('user_subscriptions')
            .upsert(subscriptionData, {
              onConflict: 'stripe_subscription_id',
              ignoreDuplicates: false
            })
            .select();

          console.log('📊 Upsert result:', { data: upsertData, error: upsertError });

          if (upsertError) {
            console.error('❌ Failed to upsert subscription record:', upsertError);
            console.error('❌ Full error details:', JSON.stringify(upsertError, null, 2));
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({
                error: 'Database upsert error',
                details: upsertError.message,
                code: upsertError.code,
                subscription_data: subscriptionData
              }),
            };
          }

          if (!upsertData || upsertData.length === 0) {
            console.error('❌ Upsert succeeded but no data returned');
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({
                error: 'Upsert returned no data',
                subscription_data: subscriptionData
              }),
            };
          }

          console.log('✅ Subscription record upserted successfully:', JSON.stringify(upsertData, null, 2));
          console.log('🎉 Database operation completed successfully');

        } catch (dbError) {
          console.error('❌ Database exception:', dbError);
          console.error('❌ Exception stack:', dbError.stack);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
              error: 'Database exception',
              details: dbError.message,
              stack: dbError.stack,
              subscription_data: subscriptionData
            }),
          };
        }
      } else {
        console.log('❌ No subscription ID found - skipping subscription processing');
        console.log('📋 Invoice details:', {
          id: invoice.id,
          subscription: invoice.subscription,
          customer: invoice.customer,
          customer_email: invoice.customer_email
        });
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

    console.log('✅ Webhook processed successfully - reached end of function');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        received: true,
        event_type: stripeEvent?.type,
        processed_sections: 'completed'
      }),
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