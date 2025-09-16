import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import Stripe from 'https://esm.sh/stripe@14.9.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    console.log('🎯 Webhook received - processing payment')

    // Get request body
    const body = await req.text()
    let event: any

    try {
      event = JSON.parse(body)
      console.log('📦 Event type:', event.type)
      console.log('📦 Event ID:', event.id)
    } catch (parseError) {
      console.error('❌ Failed to parse webhook body')
      return new Response('Invalid JSON', {
        status: 400,
        headers: corsHeaders
      })
    }

    // Only process checkout.session.completed events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('💳 Processing checkout session:', session.id)
      console.log('💰 Amount:', session.amount_total)
      console.log('📧 Customer email:', session.customer_email)
      console.log('🔗 Mode:', session.mode)

      // Initialize Supabase with service role key (bypasses RLS)
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      if (session.mode === 'payment') {
        // This is a one-time purchase (resume pack)
        console.log('📦 Processing one-time purchase')

        // Find user by email
        const { data: user, error: userError } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', session.customer_email)
          .single()

        if (userError || !user) {
          console.error('❌ User not found:', session.customer_email)
          return new Response('User not found', {
            status: 400,
            headers: corsHeaders
          })
        }

        console.log('👤 Found user:', user.id)

        // Create purchase record
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

        const purchaseData = {
          user_id: user.id,
          stripe_payment_intent_id: session.payment_intent,
          plan_id: 'access-pack',
          amount: session.amount_total / 100, // Convert from cents
          status: 'succeeded',
          resumes_remaining: 5, // 5 resumes for $1.01 pack
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: insertError } = await supabase
          .from('user_purchases')
          .insert(purchaseData)

        if (insertError) {
          console.error('❌ Failed to create purchase record:', insertError)
          return new Response('Database error', {
            status: 500,
            headers: corsHeaders
          })
        }

        console.log('✅ Purchase record created successfully')
      }
    }

    console.log('✅ Webhook processed successfully')
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    })
  }
})