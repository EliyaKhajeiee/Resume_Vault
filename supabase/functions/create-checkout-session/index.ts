import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-08-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { priceId, userId, planId, mode, successUrl, cancelUrl } = await req.json()

    if (!priceId || !userId || !mode) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }}
      )
    }

    // Get user email from Supabase auth
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId)
    
    if (userError || !user?.user?.email) {
      return new Response(
        JSON.stringify({ error: 'User not found or email missing' }),
        { status: 400, headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }}
      )
    }

    // Create checkout session configuration
    const sessionConfig: any = {
      customer_email: user.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode, // 'subscription' or 'payment'
      success_url: successUrl,
      cancel_url: cancelUrl,
    }

    // Add metadata based on mode
    if (mode === 'subscription') {
      sessionConfig.subscription_data = {
        trial_period_days: 7, // 7-day free trial before first charge
        metadata: {
          userId: userId,
          planId: planId || 'pro-monthly',
        },
      }
    } else if (mode === 'payment') {
      sessionConfig.payment_intent_data = {
        metadata: {
          userId: userId,
          planId: planId || 'access-pack',
        },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})