import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '@/lib/supabase'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'access-pack',
    name: 'Resume Access Pack',
    price: 9.99,
    interval: 'one-time' as any,
    stripePriceId: 'price_1S7i2iAdBHYS516EX1FCq84E', // $9.99 one-time price ID
    features: [
      'Access to 5 premium resumes',
      'Download in PDF format',
      'Basic search and filters',
      '30-day access period'
    ]
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: 29.99,
    interval: 'month',
    stripePriceId: 'price_1Ruy4kAdBHYS516EV50u326a', // $29.99 monthly price ID
    features: [
      'Unlimited resume access',
      'Advanced search and filters',
      'AI-powered insights',
      'Download in multiple formats',
      'Priority support',
      'Resume review checklist',
      'Industry-specific templates'
    ]
  }
]

export interface UserSubscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan_id: string
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
}

export interface UserPurchase {
  id: string
  user_id: string
  stripe_payment_intent_id: string
  plan_id: string
  amount: number
  status: 'succeeded' | 'pending' | 'failed'
  resumes_remaining: number
  expires_at: string
  created_at: string
  updated_at: string
}

export class StripeService {
  /**
   * Create checkout session for subscription or one-time payment
   */
  static async createCheckoutSession(priceId: string, userId: string, planId: string): Promise<{ url?: string; error?: string }> {
    try {
      // Determine if this is a one-time purchase or subscription
      const plan = SUBSCRIPTION_PLANS.find(p => p.stripePriceId === priceId)
      const isOneTime = plan?.interval === 'one-time'

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          userId,
          planId,
          mode: isOneTime ? 'payment' : 'subscription',
          successUrl: `${window.location.origin}/${isOneTime ? 'purchase' : 'subscription'}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`
        }
      })

      if (error) {
        console.error('Error creating checkout session:', error)
        return { error: 'Failed to create checkout session' }
      }

      return { url: data.url }
    } catch (error) {
      console.error('Unexpected error creating checkout session:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  /**
   * Create customer portal session
   */
  static async createPortalSession(customerId: string): Promise<{ url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          customerId,
          returnUrl: `${window.location.origin}/subscription`
        }
      })

      if (error) {
        console.error('Error creating portal session:', error)
        return { error: 'Failed to create portal session' }
      }

      return { url: data.url }
    } catch (error) {
      console.error('Unexpected error creating portal session:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get user's subscription
   */
  static async getUserSubscription(userId: string): Promise<{ data: UserSubscription | null; error?: string }> {
    try {
      console.log('Querying subscriptions for user_id:', userId)
      
      // First, let's check all subscriptions for this user (for debugging)
      const { data: allSubs, error: allError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
      
      console.log('All subscriptions for user:', allSubs)
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      console.log('Active subscription query result:', { data, error })

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching subscription:', error)
        return { data: null, error: 'Failed to fetch subscription' }
      }

      return { data: data || null }
    } catch (error) {
      console.error('Unexpected error fetching subscription:', error)
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get user's one-time purchase
   */
  static async getUserPurchase(userId: string): Promise<{ data: UserPurchase | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'succeeded')
        .gt('expires_at', new Date().toISOString())
        .gt('resumes_remaining', 0)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching purchase:', error)
        return { data: null, error: 'Failed to fetch purchase' }
      }

      return { data: data || null }
    } catch (error) {
      console.error('Unexpected error fetching purchase:', error)
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const { data } = await this.getUserSubscription(userId)
    return !!data && data.status === 'active' && new Date(data.current_period_end) > new Date()
  }

  /**
   * Check if user has active purchase (with remaining resumes)
   */
  static async hasActivePurchase(userId: string): Promise<boolean> {
    const { data } = await this.getUserPurchase(userId)
    return !!data && data.resumes_remaining > 0 && new Date(data.expires_at) > new Date()
  }

  /**
   * Get user's resume access count (for free users)
   */
  static async getUserResumeAccessCount(userId: string): Promise<number> {
    try {
      console.log('📊 Fetching access count for user:', userId)
      
      const { data, error } = await supabase
        .from('user_resume_access')
        .select('id')
        .eq('user_id', userId)

      if (error) {
        console.error('❌ Database error fetching access count:', error)
        // Return 0 for new users if table doesn't exist or has permission issues
        return 0
      }

      const count = data?.length || 0
      console.log('✅ Access count retrieved:', count)
      return count
    } catch (error) {
      console.error('❌ Unexpected error fetching access count:', error)
      // For new users or permission issues, assume 0 accesses
      return 0
    }
  }

  /**
   * Record resume access for free users
   */
  static async recordResumeAccess(userId: string, resumeId: string): Promise<void> {
    try {
      await supabase
        .from('user_resume_access')
        .insert({
          user_id: userId,
          resume_id: resumeId,
          accessed_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error recording resume access:', error)
    }
  }

  /**
   * Decrement resume count for purchased pack
   */
  static async decrementPurchaseCount(userId: string): Promise<void> {
    try {
      const { data: purchase } = await this.getUserPurchase(userId)
      if (purchase && purchase.resumes_remaining > 0) {
        await supabase
          .from('user_purchases')
          .update({
            resumes_remaining: purchase.resumes_remaining - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', purchase.id)
      }
    } catch (error) {
      console.error('Error decrementing purchase count:', error)
    }
  }

  /**
   * Check if user can access resume (subscription, purchase, or free limit)
   */
  static async canAccessResume(userId: string, resumeId: string, isFeatured: boolean): Promise<{
    canAccess: boolean
    reason?: 'subscription_required' | 'limit_reached' | 'featured_only'
  }> {
    try {
      console.log('🔍 Checking resume access for user:', userId, 'resume:', resumeId, 'featured:', isFeatured)

      // Check if user has active subscription
      let hasSubscription = false;
      try {
        hasSubscription = await this.hasActiveSubscription(userId)
        console.log('📋 Has active subscription:', hasSubscription)
      } catch (subError) {
        console.log('⚠️ Could not check subscription:', subError)
        hasSubscription = false;
      }

      if (hasSubscription) {
        console.log('✅ User has unlimited subscription - access granted')
        return { canAccess: true }
      }

      // Check if user has active purchase (5 resume pack)
      let hasPurchase = false;
      try {
        hasPurchase = await this.hasActivePurchase(userId)
        console.log('📋 Has active purchase:', hasPurchase)
      } catch (purchaseError) {
        console.log('⚠️ Could not check purchase:', purchaseError)
        hasPurchase = false;
      }

      if (hasPurchase) {
        console.log('✅ User has paid access pack - access granted')
        return { canAccess: true }
      }

      // For free users, allow 1 resume access
      let accessCount = 0;
      try {
        accessCount = await this.getUserResumeAccessCount(userId)
        console.log('📊 Current free access count:', accessCount)
      } catch (accessError) {
        console.log('⚠️ Could not check access count, allowing first access:', accessError)
        accessCount = 0;
      }

      if (accessCount >= 1) {
        console.log('❌ Free access limit reached (1/1 used)')
        return { canAccess: false, reason: 'limit_reached' }
      }

      console.log('✅ Free access granted (0/1 used)')
      return { canAccess: true }
    } catch (error) {
      console.error('❌ Error checking resume access:', error)
      console.log('🔓 Allowing access due to error (treating as new user)')
      return { canAccess: true }
    }
  }

  /**
   * Check if user can download resume
   */
  static async canDownloadResume(userId: string): Promise<boolean> {
    return await this.hasActiveSubscription(userId)
  }
}