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

    console.log('Found subscription, cancelling in Stripe...');

    // Cancel in Stripe
    const cancelledSubscription = await stripe.subscriptions.cancel(subscriptionId);
    console.log('Stripe cancellation successful');

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Subscription cancelled successfully',
        subscription: cancelledSubscription
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