// Test script to diagnose webhook failures
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    console.log('🧪 Testing webhook configuration...');

    // Test 1: Check environment variables
    const checks = {
      stripe_key: !!process.env.STRIPE_SECRET_KEY,
      supabase_url: !!process.env.VITE_SUPABASE_URL,
      service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    };

    console.log('✅ Environment variables:', checks);

    // Test 2: Try to initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe initialized');

    // Test 3: Try to initialize Supabase
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
    console.log('✅ Supabase initialized');

    // Test 4: Try to query database
    const { data: testData, error: testError } = await supabase
      .from('user_subscriptions')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      console.error('❌ Database query failed:', testError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Database connection failed',
          details: testError.message,
          checks
        })
      };
    }

    console.log('✅ Database connection successful');

    // Test 5: Try to list users (this is what fails in webhook)
    try {
      const { data: users, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) {
        console.error('❌ listUsers failed:', userError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: 'listUsers failed',
            details: userError.message,
            checks
          })
        };
      }
      console.log('✅ listUsers successful, found', users.users.length, 'users');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'All webhook prerequisites are working',
          userCount: users.users.length,
          checks
        })
      };
    } catch (error) {
      console.error('❌ listUsers exception:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'listUsers exception',
          details: error.message,
          stack: error.stack,
          checks
        })
      };
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Test failed',
        details: error.message,
        stack: error.stack
      })
    };
  }
};
