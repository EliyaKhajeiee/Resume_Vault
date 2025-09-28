const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const userId = '7e8441d2-2b54-4f48-ac4a-8f7548863d2a'; // Your user ID

    console.log('🔍 Debugging subscription for user:', userId);

    // Get all subscriptions for the user
    const { data: subscriptions, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (subError) {
      console.error('Subscription query error:', subError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: subError.message }),
      };
    }

    // Get purchases too
    const { data: purchases, error: purchaseError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (purchaseError) {
      console.error('Purchase query error:', purchaseError);
    }

    const currentTime = new Date().toISOString();
    const latest = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null;

    const analysis = {
      currentTime,
      userId,
      totalSubscriptions: subscriptions?.length || 0,
      totalPurchases: purchases?.length || 0,
      latestSubscription: latest,
      hasActiveSubscription: latest &&
        (latest.status === 'active' || latest.status === 'canceled') &&
        new Date(latest.current_period_end) > new Date(),
      periodEndDate: latest?.current_period_end,
      isPeriodActive: latest ? new Date(latest.current_period_end) > new Date() : false,
      allSubscriptions: subscriptions,
      allPurchases: purchases
    };

    console.log('🔍 Subscription analysis:', JSON.stringify(analysis, null, 2));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysis, null, 2),
    };

  } catch (error) {
    console.error('Debug error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};