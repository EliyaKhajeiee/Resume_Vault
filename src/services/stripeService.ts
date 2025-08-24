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
    id: 'pro-monthly',
    name: 'Pro',
    price: 29,
    interval: 'month',
    stripePriceId: 'price_1Ruy4kAdBHYS516EV50u326a', // Your actual Stripe LIVE price ID
    features: [
      'Access to 500+ resume examples',
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

export class StripeService {
  /**
   * Create checkout session for subscription
   */
  static async createCheckoutSession(priceId: string, userId: string): Promise<{ url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          userId,
          successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
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
   * Check if user has active subscription
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const { data } = await this.getUserSubscription(userId)
    return !!data && data.status === 'active' && new Date(data.current_period_end) > new Date()
  }

  /**
   * Get user's resume access count (for free users)
   */
  static async getUserResumeAccessCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('user_resume_access')
        .select('id')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching access count:', error)
        return 0
      }

      return data?.length || 0
    } catch (error) {
      console.error('Unexpected error fetching access count:', error)
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
   * Check if user can access resume (based on subscription and limits)
   */
  static async canAccessResume(userId: string, resumeId: string, isFeatured: boolean): Promise<{
    canAccess: boolean
    reason?: 'subscription_required' | 'limit_reached' | 'featured_only'
  }> {
    try {
      // Check if user has active subscription
      const hasSubscription = await this.hasActiveSubscription(userId)
      
      if (hasSubscription) {
        return { canAccess: true }
      }

      // For free users, only allow 1 non-featured resume
      if (isFeatured) {
        return { canAccess: false, reason: 'featured_only' }
      }

      // Check if user has already accessed their limit of non-featured resumes
      const accessCount = await this.getUserResumeAccessCount(userId)
      if (accessCount >= 1) {
        return { canAccess: false, reason: 'limit_reached' }
      }

      return { canAccess: true }
    } catch (error) {
      console.error('Error checking resume access:', error)
      return { canAccess: false, reason: 'subscription_required' }
    }
  }

  /**
   * Check if user can download resume
   */
  static async canDownloadResume(userId: string): Promise<boolean> {
    return await this.hasActiveSubscription(userId)
  }
}