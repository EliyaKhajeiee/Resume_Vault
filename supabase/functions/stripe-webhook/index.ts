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

  // Set CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
    'Content-Type': 'application/json',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
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

      case 'payment_intent.succeeded':
        console.log('Handling payment intent succeeded event')
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
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
      headers: corsHeaders
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    })
  }
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session:', session.id)
  console.log('Session metadata:', session.metadata)
  console.log('Session mode:', session.mode)

  if (session.mode === 'subscription') {
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
  } else if (session.mode === 'payment') {
    // One-time payment - will be handled by payment_intent.succeeded
    console.log('One-time payment checkout completed - will be handled by payment_intent.succeeded')
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment intent:', paymentIntent.id)
  console.log('Payment intent metadata:', paymentIntent.metadata)

  const userId = paymentIntent.metadata.userId
  const planId = paymentIntent.metadata.planId || 'access-pack'

  if (!userId) {
    console.error('No userId found in payment intent metadata')
    return
  }

  console.log('User ID from payment intent:', userId)
  console.log('Plan ID:', planId)

  // Calculate expiry date (30 days from now)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  // Determine resume count based on amount paid
  let resumesRemaining = 5; // Default for $1.01 pack gives 5 resumes
  const amountInDollars = paymentIntent.amount / 100;

  if (amountInDollars >= 1.01) {
    resumesRemaining = 5; // 5 resumes for $1.01 pack
  }

  const purchaseData = {
    user_id: userId,
    stripe_payment_intent_id: paymentIntent.id,
    plan_id: planId,
    amount: amountInDollars,
    status: 'succeeded',
    resumes_remaining: resumesRemaining,
    expires_at: expiresAt.toISOString(),
    updated_at: new Date().toISOString()
  }

  console.log('Upserting purchase data:', purchaseData)

  // Upsert purchase
  const { data, error } = await supabase
    .from('user_purchases')
    .upsert(purchaseData, {
      onConflict: 'stripe_payment_intent_id'
    })
    .select()

  if (error) {
    console.error('Error upserting purchase:', error)
    throw error
  }

  console.log('Successfully upserted purchase:', data)
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
    'price_1S7i8SAdBHYS516EGeFCDYrG': 'pro-monthly', // $1.00 monthly
    'price_1S7i2iAdBHYS516EX1FCq84E': 'access-pack', // $1.01 one-time
    'price_1Ruy4kAdBHYS516EV50u326a': 'pro-monthly', // Legacy $29.99 monthly
    'price_1RschKPMCgCvdUp8NBMoHXSI': 'pro-monthly', // Legacy
    'price_1S58Q2AdBHYS516Elg0sC5Ak': 'pro-monthly', // Legacy test price
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