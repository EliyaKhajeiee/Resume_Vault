import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-08-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req) => {
  console.log('Webhook received:', req.method)
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
      },
    })
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method)
    return new Response('Method not allowed', { status: 405 })
  }

  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  console.log('Webhook secret exists:', !!webhookSecret)
  console.log('Signature exists:', !!signature)

  let event: Stripe.Event

  if (webhookSecret && signature) {
    // Try to verify signature if we have both
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('Webhook event constructed successfully with signature:', event.type)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      // For debugging, let's try to parse without signature
      try {
        event = JSON.parse(body)
        console.log('Parsed event without signature verification:', event.type)
      } catch (parseError) {
        console.error('Failed to parse body as JSON:', parseError)
        return new Response(`Invalid signature and unparseable body: ${error.message}`, { status: 400 })
      }
    }
  } else {
    // No signature verification - just parse the JSON (for debugging)
    try {
      event = JSON.parse(body)
      console.log('Parsed event without signature (missing secret or signature):', event.type)
    } catch (parseError) {
      console.error('Failed to parse body as JSON:', parseError)
      return new Response('Unable to parse webhook body', { status: 400 })
    }
  }

  try {
    console.log('Processing webhook event:', event.type)
    
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Handling checkout session completed event')
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        console.log('Handling subscription change event')
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        console.log('Handling subscription deletion event')
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        console.log('Payment succeeded - no action needed')
        break

      case 'invoice.payment_failed':
        console.log('Payment failed - no action needed')
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    console.log('Webhook processed successfully')
    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session:', session.id)
  console.log('Session metadata:', session.metadata)
  console.log('Session mode:', session.mode)

  // Only handle subscription checkouts
  if (session.mode !== 'subscription') {
    console.log('Skipping non-subscription checkout')
    return
  }

  const userId = session.subscription_data?.metadata?.userId || session.metadata?.userId
  if (!userId) {
    console.error('No userId found in checkout session metadata')
    return
  }

  console.log('User ID from checkout session:', userId)

  // Get the subscription from Stripe
  const subscriptionId = session.subscription as string
  if (!subscriptionId) {
    console.error('No subscription ID found in checkout session')
    return
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    console.log('Retrieved subscription from checkout:', subscription.id)

    // Process the subscription immediately
    await handleSubscriptionChange(subscription)
  } catch (error) {
    console.error('Error retrieving subscription from checkout:', error)
    throw error
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Processing subscription change:', subscription.id)
  console.log('Subscription metadata:', subscription.metadata)
  console.log('Subscription status:', subscription.status)
  
  const userId = subscription.metadata.userId
  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  console.log('User ID from metadata:', userId)

  // Get plan ID from the subscription
  const priceId = subscription.items.data[0]?.price.id
  console.log('Price ID:', priceId)
  
  let planId = 'pro-monthly' // Default plan

  // Map Stripe price IDs to our plan IDs
  const priceIdToPlanId: { [key: string]: string } = {
    'price_1RschKPMCgCvdUp8NBMoHXSI': 'pro-monthly',
    'price_1S58Q2AdBHYS516Elg0sC5Ak': 'pro-monthly', // $1 test price
    // Add more mappings as needed
  }

  if (priceId && priceIdToPlanId[priceId]) {
    planId = priceIdToPlanId[priceId]
  }

  console.log('Plan ID resolved to:', planId)

  const subscriptionData = {
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    plan_id: planId,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }

  console.log('Upserting subscription data:', subscriptionData)

  // Upsert subscription
  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'stripe_subscription_id'
    })
    .select()

  if (error) {
    console.error('Error upserting subscription:', error)
    throw error
  }

  console.log('Successfully upserted subscription:', data)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({ 
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating deleted subscription:', error)
    throw error
  }
}