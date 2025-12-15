const { createClient } = require('@supabase/supabase-js');
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
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { subscriptionId } = JSON.parse(event.body);

    console.log('🔄 Syncing subscription from Stripe:', subscriptionId);

    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log('✅ Retrieved from Stripe');
    console.log('   Status:', subscription.status);
    console.log('   Trial end:', subscription.trial_end);
    console.log('   Current period end:', subscription.current_period_end);

    // Validate timestamps
    console.log('Raw timestamps:');
    console.log('  trial_end:', subscription.trial_end);
    console.log('  current_period_start:', subscription.current_period_start);
    console.log('  current_period_end:', subscription.current_period_end);

    // Determine correct period dates based on status
    let periodStart, periodEnd;

    if (subscription.status === 'trialing') {
      // For trialing subscriptions, use trial_start and trial_end
      const trialStartTimestamp = subscription.trial_start || subscription.start_date || subscription.created;
      const trialEndTimestamp = subscription.trial_end;

      if (!trialStartTimestamp || isNaN(trialStartTimestamp)) {
        throw new Error(`Invalid trial_start timestamp: ${trialStartTimestamp}`);
      }
      if (!trialEndTimestamp || isNaN(trialEndTimestamp)) {
        throw new Error(`Invalid trial_end timestamp: ${trialEndTimestamp}`);
      }

      periodStart = new Date(trialStartTimestamp * 1000);
      periodEnd = new Date(trialEndTimestamp * 1000);

      if (isNaN(periodStart.getTime())) {
        throw new Error(`Failed to create Date from trial_start: ${trialStartTimestamp}`);
      }
      if (isNaN(periodEnd.getTime())) {
        throw new Error(`Failed to create Date from trial_end: ${trialEndTimestamp}`);
      }

      console.log('✅ Using trial period:', periodStart.toISOString(), '-', periodEnd.toISOString());
    } else {
      // For active/other subscriptions, use current_period dates
      const periodStartTimestamp = subscription.current_period_start;
      const periodEndTimestamp = subscription.current_period_end;

      if (!periodStartTimestamp || isNaN(periodStartTimestamp)) {
        throw new Error(`Invalid current_period_start timestamp: ${periodStartTimestamp}`);
      }
      if (!periodEndTimestamp || isNaN(periodEndTimestamp)) {
        throw new Error(`Invalid current_period_end timestamp: ${periodEndTimestamp}`);
      }

      periodStart = new Date(periodStartTimestamp * 1000);
      periodEnd = new Date(periodEndTimestamp * 1000);

      if (isNaN(periodStart.getTime())) {
        throw new Error(`Failed to create Date from current_period_start: ${periodStartTimestamp}`);
      }
      if (isNaN(periodEnd.getTime())) {
        throw new Error(`Failed to create Date from current_period_end: ${periodEndTimestamp}`);
      }

      console.log('✅ Using current period:', periodStart.toISOString(), '-', periodEnd.toISOString());
    }

    // Get userId from metadata
    const userId = subscription.metadata?.userId;
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No userId in subscription metadata' }),
      };
    }

    // Update database
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId)
      .select()
      .single();

    if (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Update failed', details: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Subscription synced successfully',
        subscription: data,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
      }),
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
