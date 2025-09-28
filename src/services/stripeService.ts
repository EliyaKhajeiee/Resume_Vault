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
    stripePriceId: 'price_1S9CZkAdBHYS516EzVkWRfPj', // $9.99 one-time price ID
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
    stripePriceId: 'price_1S9CrwAdBHYS516Ed7j5YYaf', // $29.99 monthly price ID
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

// Simple cache to prevent excessive API calls
const cache = new Map()
const CACHE_TIME = 300000 // 5 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
    return cached.data
  }
  return null
}

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() })
}

const clearUserCache = (userId: string) => {
  cache.delete(`subscription_${userId}`)
  cache.delete(`purchase_${userId}`)
  console.log('🧹 Cleared cache for user:', userId)
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
      console.log('🔑 Creating portal session for customer:', customerId)

      const response = await fetch('/.netlify/functions/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/settings`
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Portal session error:', data)
        return { error: data.error || 'Failed to create portal session' }
      }

      console.log('✅ Portal session created successfully')

      if (data.isTestCustomer) {
        console.log('⚠️ Test customer - redirecting to support')
      }

      return { url: data.url }
    } catch (error) {
      console.error('Unexpected error creating portal session:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string, feedback?: {
    reason: string
    comments: string
    satisfaction: string
  }): Promise<{ success?: boolean; error?: string }> {
    try {
      console.log('🔗 StripeService.cancelSubscription called with:', subscriptionId)

      // Get current user session for auth token
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔗 Session exists:', !!session?.access_token)

      if (!session?.access_token) {
        return { error: 'Not authenticated' }
      }

      console.log('🔗 Making request to cancel-subscription function...')

      const response = await fetch('/.netlify/functions/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          subscriptionId,
          feedback
        })
      })

      console.log('🔗 Response status:', response.status)

      const data = await response.json()
      console.log('🔗 Response data:', data)

      if (!response.ok) {
        console.error('🔗 Cancellation error:', data)
        return { error: data.error || 'Failed to cancel subscription' }
      }

      // Clear cache after successful cancellation to force fresh data
      cache.clear()
      console.log('🔗 Cache cleared, cancellation successful')

      return { success: true }
    } catch (error) {
      console.error('🔗 Unexpected cancellation error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  /**
   * Clear cache for a user (useful after subscription changes)
   */
  static clearUserCache(userId: string): void {
    clearUserCache(userId)
  }

  /**
   * Get user's subscription
   */
  static async getUserSubscription(userId: string, forceRefresh: boolean = false): Promise<{ data: UserSubscription | null; error?: string }> {
    try {
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('❌ getUserSubscription error:', error)
        setCachedData(cacheKey, null)
        return { data: null, error: error.message }
      }

      const subscription = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null
      return { data: subscription }
    } catch (error) {
      console.error('❌ getUserSubscription unexpected error:', error)
      return { data: null, error: 'Unexpected error' }
    }
  }

  /**
   * Get user's one-time purchase
   */
  static async getUserPurchase(userId: string): Promise<{ data: UserPurchase | null; error?: string }> {
    const cacheKey = `purchase_${userId}`
    const cached = getCachedData(cacheKey)
    if (cached !== null) return { data: cached }

    try {
      // Get most recent purchase regardless of expiry to show in UI
      const { data: purchases, error } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('❌ getUserPurchase error:', error)
        setCachedData(cacheKey, null)
        return { data: null, error: error.message }
      }

      const result = purchases?.[0] || null
      setCachedData(cacheKey, result)
      return { data: result }
    } catch (error) {
      console.error('❌ getUserPurchase unexpected error:', error)
      return { data: null, error: 'Unexpected error' }
    }
  }

  /**
   * Check if user has active subscription (including cancelled but still in paid period)
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const { data } = await this.getUserSubscription(userId, true) // Force fresh data
    return !!data &&
      (data.status === 'active' || data.status === 'canceled') &&
      new Date(data.current_period_end) > new Date()
  }

  /**
   * Check if user has active purchase (with remaining resumes)
   */
  static async hasActivePurchase(userId: string): Promise<boolean> {
    try {
      console.log('🔍 Checking if user has active purchase:', userId)
      const { data, error } = await this.getUserPurchase(userId)

      if (error) {
        console.log('❌ Error checking purchase:', error)
        return false
      }

      const hasActive = !!data && data.resumes_remaining > 0 && new Date(data.expires_at) > new Date()
      console.log('🔍 Has active purchase result:', hasActive, data ? `(${data.resumes_remaining} resumes left)` : '(no purchase)')

      return hasActive
    } catch (error) {
      console.error('Error in hasActivePurchase:', error)
      return false
    }
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
      // Use upsert to avoid 409 conflicts
      await supabase
        .from('user_resume_access')
        .upsert({
          user_id: userId,
          resume_id: resumeId,
          accessed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,resume_id'
        })
      console.log('✅ Access recorded successfully')
    } catch (error) {
      console.error('❌ Error recording resume access:', error)
    }
  }

  /**
   * Process resume access - handles both free users and paid pack users
   */
  static async processResumeAccess(userId: string, resumeId: string): Promise<void> {
    try {
      // Check if user has active subscription (unlimited access)
      const hasSubscription = await this.hasActiveSubscription(userId)
      if (hasSubscription) {
        console.log('✅ User has subscription - no tracking needed')
        return
      }

      // Check if user has active purchase (5 resume pack)
      const hasPurchase = await this.hasActivePurchase(userId)
      if (hasPurchase) {
        console.log('📦 User has purchase pack - decrementing count')
        await this.decrementPurchaseCount(userId)
        return
      }

      // Free user - record access for limit tracking
      console.log('🆓 Free user - recording access')
      await this.recordResumeAccess(userId, resumeId)
    } catch (error) {
      console.error('Error processing resume access:', error)
    }
  }

  /**
   * Decrement resume count for purchased pack
   */
  static async decrementPurchaseCount(userId: string): Promise<void> {
    try {
      // Clear cache to get fresh data
      cache.delete(`purchase_${userId}`)

      const { data: purchase } = await this.getUserPurchase(userId)
      if (purchase && purchase.resumes_remaining > 0) {
        await supabase
          .from('user_purchases')
          .update({
            resumes_remaining: purchase.resumes_remaining - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', purchase.id)

        // Clear cache again after update
        cache.delete(`purchase_${userId}`)
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

      // For free users, check total access count (strict: 1 resume max, ever)
      let accessCount = 0;
      try {
        accessCount = await this.getUserResumeAccessCount(userId)
        console.log('📊 Current free access count:', accessCount)
      } catch (accessError) {
        console.log('⚠️ Could not check access count, allowing first access:', accessError)
        accessCount = 0;
      }

      if (accessCount >= 1) {
        console.log('❌ Free access limit reached - user has already accessed 1 resume')
        return { canAccess: false, reason: 'limit_reached' }
      }

      console.log('✅ Free access granted - first resume access')
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

  /**
   * Create test purchase for development/testing (gives 5 resume access for 30 days)
   */
  static async createTestPurchase(): Promise<{ success?: boolean; error?: string; purchase?: any }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-test-purchase', {
        body: {}
      })

      if (error) {
        console.error('Error creating test purchase:', error)
        return { error: 'Failed to create test purchase' }
      }

      return { success: true, purchase: data.purchase }
    } catch (error) {
      console.error('Unexpected error creating test purchase:', error)
      return { error: 'An unexpected error occurred' }
    }
  }
}