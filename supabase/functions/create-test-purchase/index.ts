import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get the user from the Authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        },
      )
    }

    // Check if user already has a purchase
    const { data: existingPurchase } = await supabaseClient
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existingPurchase) {
      // Update existing purchase to give them 5 fresh resumes
      const { error: updateError } = await supabaseClient
        .from('user_purchases')
        .update({
          resumes_remaining: 5,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPurchase.id)

      if (updateError) {
        throw updateError
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Existing purchase updated with 5 fresh resumes (30 days)',
          purchase: {
            ...existingPurchase,
            resumes_remaining: 5,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        },
      )
    }

    // Create new test purchase
    const testPurchase = {
      user_id: user.id,
      stripe_payment_intent_id: `pi_test_${crypto.randomUUID()}`,
      plan_id: 'access-pack',
      amount: 1.01,
      status: 'succeeded',
      resumes_remaining: 5,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: purchase, error } = await supabaseClient
      .from('user_purchases')
      .insert(testPurchase)
      .select()
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test purchase created successfully! You now have 5 resume access for 30 days.',
        purchase
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    )

  } catch (error) {
    console.error('Error creating test purchase:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to create test purchase',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    )
  }
})