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
    console.log('Starting cancellation process...');

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Parse request body
    const { subscriptionId, feedback } = JSON.parse(event.body);
    console.log('Subscription ID to cancel:', subscriptionId);

    if (!subscriptionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Subscription ID is required' }),
      };
    }

    // Get auth header
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authorization header required' }),
      };
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    console.log('User ID:', user.id);

    // Fetch subscription from database
    console.log('Fetching subscription from database...');
    const { data: userSubscription, error: fetchError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (fetchError || !userSubscription) {
      console.error('Subscription not found:', fetchError);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Subscription not found or unauthorized' }),
      };
    }

    console.log('Found subscription, finding real Stripe subscription ID...');

    let cancelledSubscription = null;
    let stripeError = null;
    let realSubscriptionId = subscriptionId;

    // If this is a generated ID, find the real Stripe subscription ID
    if (subscriptionId.startsWith('sub_from_invoice_') || subscriptionId.startsWith('sub_generated_')) {
      console.log('Generated subscription ID detected, finding real Stripe subscription...');

      try {
        // Get customer's subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
          customer: userSubscription.stripe_customer_id,
          status: 'active',
          limit: 10
        });

        if (subscriptions.data.length > 0) {
          // Find the subscription that matches our user's plan and timing
          const matchingSubscription = subscriptions.data.find(sub => {
            // Match by plan or creation time near our subscription
            const subCreated = new Date(sub.created * 1000);
            const ourCreated = new Date(userSubscription.created_at);
            const timeDiff = Math.abs(subCreated.getTime() - ourCreated.getTime());
            return timeDiff < 24 * 60 * 60 * 1000; // Within 24 hours
          });

          if (matchingSubscription) {
            realSubscriptionId = matchingSubscription.id;
            console.log('✅ Found real Stripe subscription ID:', realSubscriptionId);

            // Update our database with the real subscription ID for future use
            await supabase
              .from('user_subscriptions')
              .update({ stripe_subscription_id: realSubscriptionId })
              .eq('id', userSubscription.id);

            console.log('✅ Updated database with real subscription ID');
          } else {
            console.log('⚠️ No matching Stripe subscription found');
            stripeError = 'No matching active subscription found in Stripe';
          }
        } else {
          console.log('⚠️ No active subscriptions found for customer');
          stripeError = 'No active subscriptions found for customer';
        }
      } catch (error) {
        console.error('❌ Error fetching Stripe subscriptions:', error);
        stripeError = `Error fetching subscriptions: ${error.message}`;
      }
    }

    // Try to cancel the real subscription in Stripe
    if (realSubscriptionId !== subscriptionId || !stripeError) {
      try {
        cancelledSubscription = await stripe.subscriptions.cancel(realSubscriptionId);
        console.log('✅ Stripe cancellation successful for:', realSubscriptionId);
        stripeError = null; // Clear any previous errors
      } catch (error) {
        console.error('❌ Stripe cancellation failed:', error.message);
        stripeError = error.message;

        if (error.code === 'resource_missing') {
          console.log('Subscription not found in Stripe, will update database only');
        }
      }
    } else {
      console.log('❌ Could not find real subscription ID, will only update database');
    }

    // Update database status
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('id', userSubscription.id);

    if (updateError) {
      console.error('Database update error:', updateError);
      // Continue anyway since Stripe cancellation succeeded
    } else {
      console.log('Database update successful');
    }

    // Store feedback if provided
    if (feedback) {
      console.log('Storing cancellation feedback...');
      const { error: feedbackError } = await supabase
        .from('cancellation_feedback')
        .insert({
          user_id: user.id,
          subscription_id: userSubscription.id,
          stripe_subscription_id: subscriptionId,
          reason: feedback.reason,
          satisfaction: feedback.satisfaction,
          comments: feedback.comments,
          created_at: new Date().toISOString()
        });

      if (feedbackError) {
        console.error('Feedback storage error:', feedbackError);
      }
    }

    // Determine success status
    const isFullSuccess = !updateError && !stripeError;
    const isPartialSuccess = !updateError; // Database update succeeded

    return {
      statusCode: isPartialSuccess ? 200 : 500,
      headers,
      body: JSON.stringify({
        success: isPartialSuccess,
        message: isFullSuccess
          ? 'Subscription cancelled successfully in both Stripe and database'
          : isPartialSuccess
            ? `Subscription cancelled in database. ${stripeError ? `Stripe: ${stripeError}` : ''}`
            : 'Failed to cancel subscription',
        subscription: cancelledSubscription,
        warnings: stripeError ? [stripeError] : undefined,
        realSubscriptionId: realSubscriptionId !== subscriptionId ? realSubscriptionId : undefined
      }),
    };

  } catch (error) {
    console.error('Cancellation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to cancel subscription',
        details: error.message
      }),
    };
  }
};