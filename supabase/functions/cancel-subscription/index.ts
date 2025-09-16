import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import Stripe from 'https://esm.sh/stripe@14.9.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CancellationRequest {
  subscriptionId: string
  feedback?: {
    reason: string
    comments: string
    satisfaction: string
  }
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

    const { subscriptionId, feedback }: CancellationRequest = await req.json()

    if (!subscriptionId) {
      return new Response(
        JSON.stringify({ error: 'Subscription ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        },
      )
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Verify this subscription belongs to the user
    const { data: userSubscription, error: fetchError } = await supabaseClient
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('stripe_subscription_id', subscriptionId)
      .single()

    if (fetchError || !userSubscription) {
      return new Response(
        JSON.stringify({ error: 'Subscription not found or unauthorized' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        },
      )
    }

    // Cancel the subscription in Stripe
    const cancelledSubscription = await stripe.subscriptions.cancel(subscriptionId)

    // Update the subscription in our database
    const { error: updateError } = await supabaseClient
      .from('user_subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('id', userSubscription.id)

    if (updateError) {
      console.error('Error updating subscription in database:', updateError)
      // Continue anyway since Stripe cancellation succeeded
    }

    // Store cancellation feedback if provided
    if (feedback) {
      const { error: feedbackError } = await supabaseClient
        .from('cancellation_feedback')
        .insert({
          user_id: user.id,
          subscription_id: userSubscription.id,
          stripe_subscription_id: subscriptionId,
          reason: feedback.reason,
          satisfaction: feedback.satisfaction,
          comments: feedback.comments,
          created_at: new Date().toISOString()
        })

      if (feedbackError) {
        console.error('Error storing cancellation feedback:', feedbackError)
        // Don't fail the cancellation if feedback storage fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subscription cancelled successfully',
        subscription: cancelledSubscription
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    )

  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to cancel subscription',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    )
  }
})