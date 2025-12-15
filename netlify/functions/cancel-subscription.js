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
        // Get customer's subscriptions from Stripe (including trialing subscriptions)
        const subscriptions = await stripe.subscriptions.list({
          customer: userSubscription.stripe_customer_id,
          status: 'all', // Include all statuses: active, trialing, past_due, etc.
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
    // IMPORTANT: Use cancel_at_period_end to prevent future charges while keeping access until period end
    if (realSubscriptionId !== subscriptionId || !stripeError) {
      try {
        cancelledSubscription = await stripe.subscriptions.update(realSubscriptionId, {
          cancel_at_period_end: true
        });
        console.log('✅ Stripe cancellation scheduled (cancel_at_period_end) for:', realSubscriptionId);

        // Log the correct end date based on subscription status
        const endDate = cancelledSubscription.status === 'trialing' && cancelledSubscription.trial_end
          ? new Date(cancelledSubscription.trial_end * 1000)
          : cancelledSubscription.current_period_end
            ? new Date(cancelledSubscription.current_period_end * 1000)
            : null;

        if (endDate) {
          console.log('✅ Subscription will remain active until:', endDate.toISOString());
        } else {
          console.log('⚠️ Could not determine subscription end date');
        }

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

    // CRITICAL FIX: Only update database to 'canceled' if Stripe cancellation succeeded OR subscription not found
    // This prevents showing "canceled" in the app when Stripe is still active
    let shouldUpdateDatabase = false;
    let databaseStatus = userSubscription.status; // Keep current status by default

    if (!stripeError) {
      // Stripe cancellation succeeded
      shouldUpdateDatabase = true;
      databaseStatus = 'canceled';
      console.log('✅ Stripe cancellation successful - updating database to canceled');
    } else if (stripeError.includes('resource_missing') || stripeError.includes('No matching active subscription')) {
      // Subscription doesn't exist in Stripe - safe to mark as canceled
      shouldUpdateDatabase = true;
      databaseStatus = 'canceled';
      console.log('⚠️ Subscription not found in Stripe - marking database as canceled');
    } else {
      // Stripe cancellation failed for other reasons - do NOT update database
      console.error('❌ CRITICAL: Stripe cancellation failed, NOT updating database to prevent false cancellation');
      console.error('❌ Error was:', stripeError);
    }

    // Update database status only if safe to do so
    let updateError = null;
    if (shouldUpdateDatabase) {
      const { error: dbError } = await supabase
        .from('user_subscriptions')
        .update({
          status: databaseStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userSubscription.id);
      updateError = dbError;
    } else {
      console.log('⚠️ Skipping database update due to Stripe cancellation failure');
    }

    if (updateError) {
      console.error('Database update error:', updateError);
      // Continue anyway since Stripe cancellation succeeded
    } else if (shouldUpdateDatabase) {
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
    // CRITICAL: Only report success if Stripe cancellation succeeded
    const isFullSuccess = !updateError && !stripeError && shouldUpdateDatabase;
    const isStripeCancellationSuccess = !stripeError;

    // If Stripe cancellation failed for reasons other than "not found", return error
    if (!isStripeCancellationSuccess && !stripeError.includes('resource_missing') && !stripeError.includes('No matching active subscription')) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to cancel subscription in Stripe',
          message: `Stripe cancellation failed: ${stripeError}. Your subscription is still active. Please contact support or try again.`,
          details: stripeError
        }),
      };
    }

    return {
      statusCode: isFullSuccess ? 200 : 500,
      headers,
      body: JSON.stringify({
        success: isFullSuccess,
        message: isFullSuccess
          ? 'Subscription cancelled successfully in both Stripe and database'
          : stripeError && (stripeError.includes('resource_missing') || stripeError.includes('No matching active subscription'))
            ? 'Subscription not found in Stripe but marked as canceled in database'
            : 'Failed to cancel subscription',
        subscription: cancelledSubscription,
        warnings: stripeError && (stripeError.includes('resource_missing') || stripeError.includes('No matching active subscription')) ? [stripeError] : undefined,
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