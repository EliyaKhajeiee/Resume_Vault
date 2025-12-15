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
      const supportedEvents = ['checkout.session.completed', 'invoice.payment_succeeded', 'invoice_payment.paid', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'];
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

        // Find user - prioritize userId from metadata, then fall back to email
        console.log('🔍 Looking for user...');
        console.log('📧 Invoice email:', invoice.customer_email);
        console.log('🆔 Metadata userId:', invoice.lines?.data?.[0]?.metadata?.userId);

        let user = null;

        try {
          // Fetch all users
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

          // Method 1: Try to find by userId from metadata FIRST (most reliable)
          if (invoice.lines?.data?.[0]?.metadata?.userId) {
            const userId = invoice.lines.data[0].metadata.userId;
            console.log('🔍 Trying to find user by metadata userId:', userId);
            user = users.users.find(u => u.id === userId);
            if (user) {
              console.log('✅ Found user by metadata userId:', user.id);
              console.log('✅ User email:', user.email);
            }
          }

          // Method 2: If not found by userId, try email as fallback
          if (!user) {
            console.log('🔍 Trying to find user by email:', invoice.customer_email);
            user = users.users.find(u => u.email === invoice.customer_email);
            if (user) {
              console.log('✅ Found user by email');
            }
          }

          if (!user) {
            console.error('❌ User not found by userId or email');
            console.log('🆔 Searched userId:', invoice.lines?.data?.[0]?.metadata?.userId);
            console.log('📧 Searched email:', invoice.customer_email);
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({
                error: 'User not found',
                userId: invoice.lines?.data?.[0]?.metadata?.userId,
                email: invoice.customer_email,
                hint: 'User may have signed up with a different email (OAuth?) than the Stripe customer email'
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

        // Fetch the subscription from Stripe to get the actual status (trialing, active, etc.)
        let actualStatus = 'active'; // Default fallback
        try {
          console.log('🔍 Fetching subscription from Stripe to get actual status...');
          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
          actualStatus = stripeSubscription.status;
          console.log('✅ Got actual subscription status from Stripe:', actualStatus);

          // If trialing, update period dates to use trial dates
          if (actualStatus === 'trialing' && stripeSubscription.trial_end) {
            const trialStart = stripeSubscription.trial_start || stripeSubscription.start_date || stripeSubscription.created;
            periodStart = new Date(trialStart * 1000);
            periodEnd = new Date(stripeSubscription.trial_end * 1000);
            console.log('✅ Updated to use trial period:', periodStart.toISOString(), '-', periodEnd.toISOString());
          }
        } catch (error) {
          console.error('⚠️ Failed to fetch subscription from Stripe:', error.message);
          console.log('⚠️ Falling back to "active" status');
        }

        // Create or update subscription record
        const subscriptionData = {
          user_id: user.id,
          stripe_customer_id: invoice.customer,
          stripe_subscription_id: subscriptionId,
          status: actualStatus, // Use actual status from Stripe (trialing, active, etc.)
          current_period_start: periodStart.toISOString(),
          current_period_end: periodEnd.toISOString(),
          plan_id: planId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('📝 Creating subscription with status:', actualStatus);

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

    // Process customer.subscription.created (new subscriptions including trials)
    if (stripeEvent.type === 'customer.subscription.created') {
      const subscription = stripeEvent.data.object;
      console.log('🆕 Processing new subscription:', subscription.id);
      console.log('📧 Customer:', subscription.customer);
      console.log('🎁 Trial end:', subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : 'No trial');

      // Find user - prioritize userId from metadata, then fall back to email
      console.log('🔍 Looking for user...');
      console.log('🆔 Metadata userId:', subscription.metadata?.userId);

      let user = null;
      let customerEmail = null;

      try {
        // Get customer email from Stripe
        const customer = await stripe.customers.retrieve(subscription.customer);
        customerEmail = customer.email;
        console.log('📧 Customer email:', customerEmail);
      } catch (error) {
        console.error('❌ Failed to retrieve customer:', error);
      }

      try {
        // Fetch all users
        const { data: users, error: userError } = await supabase.auth.admin.listUsers();
        if (userError) {
          console.error('❌ Error fetching users:', userError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Database error', details: userError.message }),
          };
        }

        // Method 1: Try to find by userId from metadata FIRST (most reliable)
        if (subscription.metadata?.userId) {
          const userId = subscription.metadata.userId;
          console.log('🔍 Trying to find user by metadata userId:', userId);
          user = users.users.find(u => u.id === userId);
          if (user) {
            console.log('✅ Found user by metadata userId:', user.id);
          }
        }

        // Method 2: If not found by userId, try email as fallback
        if (!user && customerEmail) {
          console.log('🔍 Trying to find user by email:', customerEmail);
          user = users.users.find(u => u.email === customerEmail);
          if (user) {
            console.log('✅ Found user by email');
          }
        }

        if (!user) {
          console.error('❌ User not found by userId or email');
          console.log('🆔 Searched userId:', subscription.metadata?.userId);
          console.log('📧 Searched email:', customerEmail);
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              error: 'User not found',
              userId: subscription.metadata?.userId,
              email: customerEmail,
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

      // Calculate period dates - handle both trialing and active subscriptions
      console.log('📅 Subscription details:', {
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        trial_start: subscription.trial_start,
        trial_end: subscription.trial_end,
        start_date: subscription.start_date
      });

      // For trialing subscriptions, use trial_start/trial_end
      // For active subscriptions, use current_period_start/current_period_end
      let periodStartTimestamp;
      let periodEndTimestamp;

      if (subscription.status === 'trialing') {
        // Use trial dates for trialing subscriptions
        periodStartTimestamp = subscription.trial_start || subscription.start_date || subscription.created;
        periodEndTimestamp = subscription.trial_end;

        if (!periodEndTimestamp) {
          console.error('❌ Trialing subscription missing trial_end');
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Trialing subscription missing trial_end' }),
          };
        }

        console.log('✅ Using trial period - start:', periodStartTimestamp, 'end:', periodEndTimestamp);
      } else {
        // Use current period dates for active/other subscriptions
        periodStartTimestamp = subscription.current_period_start;
        periodEndTimestamp = subscription.current_period_end;

        if (!periodStartTimestamp || !periodEndTimestamp) {
          console.error('❌ Active subscription missing current_period dates');
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Active subscription missing current_period dates' }),
          };
        }

        console.log('✅ Using current period - start:', periodStartTimestamp, 'end:', periodEndTimestamp);
      }

      // Convert to Date objects
      const periodStart = new Date(periodStartTimestamp * 1000);
      const periodEnd = new Date(periodEndTimestamp * 1000);

      // Validate dates
      if (isNaN(periodStart.getTime())) {
        console.error('❌ Invalid period start timestamp:', periodStartTimestamp);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid period start timestamp' }),
        };
      }

      if (isNaN(periodEnd.getTime())) {
        console.error('❌ Invalid period end timestamp:', periodEndTimestamp);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid period end timestamp' }),
        };
      }

      console.log('✅ Period dates calculated:', {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString()
      });

      // Get plan ID from subscription metadata or default to pro-monthly
      const planId = subscription.metadata?.planId || 'pro-monthly';

      // Create subscription record
      const subscriptionData = {
        user_id: user.id,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        status: subscription.status, // Will be 'trialing' if in trial period
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        plan_id: planId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Creating subscription record for trial/new subscription');
      console.log('📊 Status:', subscription.status);

      const { error: insertError } = await supabase
        .from('user_subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'stripe_subscription_id',
          ignoreDuplicates: false
        });

      if (insertError) {
        console.error('❌ Failed to create subscription record:', insertError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error', details: insertError.message }),
        };
      }

      console.log('✅ Subscription record created successfully');
    }

    // Process customer.subscription.updated (subscription changes including cancellations)
    if (stripeEvent.type === 'customer.subscription.updated') {
      const subscription = stripeEvent.data.object;
      console.log('🔄 Processing subscription update:', subscription.id);
      console.log('📧 Customer:', subscription.customer);
      console.log('📊 Status:', subscription.status);
      console.log('⏰ Cancel at period end:', subscription.cancel_at_period_end);

      // Calculate correct period dates based on subscription status
      let periodStartTimestamp;
      let periodEndTimestamp;

      if (subscription.status === 'trialing') {
        // For trialing subscriptions, use trial dates
        periodStartTimestamp = subscription.trial_start || subscription.start_date || subscription.created;
        periodEndTimestamp = subscription.trial_end;
        console.log('✅ Trialing subscription - using trial_end:', periodEndTimestamp);
      } else {
        // For active/other subscriptions, use current period dates
        periodStartTimestamp = subscription.current_period_start;
        periodEndTimestamp = subscription.current_period_end;
        console.log('✅ Active subscription - using current_period_end:', periodEndTimestamp);
      }

      // Determine database status
      let dbStatus = subscription.status;
      if (subscription.cancel_at_period_end) {
        dbStatus = 'canceled';
        console.log('❌ Subscription is set to cancel at period end - marking as canceled');
      }

      // Convert to Date objects
      const periodStart = periodStartTimestamp ? new Date(periodStartTimestamp * 1000) : null;
      const periodEnd = periodEndTimestamp ? new Date(periodEndTimestamp * 1000) : null;

      // Update subscription in database with correct dates and status
      const updateData = {
        status: dbStatus,
        updated_at: new Date().toISOString()
      };

      // Only update dates if we have valid values
      if (periodStart && !isNaN(periodStart.getTime())) {
        updateData.current_period_start = periodStart.toISOString();
      }
      if (periodEnd && !isNaN(periodEnd.getTime())) {
        updateData.current_period_end = periodEnd.toISOString();
      }

      console.log('📝 Updating subscription with data:', updateData);

      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update(updateData)
        .eq('stripe_subscription_id', subscription.id);

      if (updateError) {
        console.error('❌ Failed to update subscription:', updateError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database error during subscription update' }),
        };
      }

      console.log('✅ Subscription updated successfully');
    }

    // Process customer.subscription.deleted (subscription actually deleted/ended)
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