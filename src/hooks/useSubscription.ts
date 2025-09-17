import { useState, useEffect } from 'react'
import { StripeService, type UserSubscription, type UserPurchase } from '@/services/stripeService'
import { useAuth } from './useAuth'

export const useSubscription = () => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [purchase, setPurchase] = useState<UserPurchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  useEffect(() => {
    if (user) {
      fetchSubscription()
    } else {
      setSubscription(null)
      setPurchase(null)
      setLoading(false)
    }
  }, [user])

  const fetchSubscription = async (force: boolean = false) => {
    if (!user || loading) return

    setLoading(true)
    setError(null)

    try {
      const [subscriptionResult, purchaseResult] = await Promise.all([
        StripeService.getUserSubscription(user.id),
        StripeService.getUserPurchase(user.id)
      ])

      setSubscription(subscriptionResult.data)
      setPurchase(purchaseResult.data)
    } catch (err) {
      setError('Network error')
    }

    setLoading(false)
  }

  const createCheckoutSession = async (priceId: string) => {
    if (!user) {
      throw new Error('User must be authenticated')
    }

    const { url, error } = await StripeService.createCheckoutSession(priceId, user.id)
    
    if (error) {
      throw new Error(error)
    }

    if (url) {
      window.location.href = url
    }
  }

  const createPortalSession = async () => {
    if (!subscription?.stripe_customer_id) {
      throw new Error('No active subscription found')
    }

    const { url, error } = await StripeService.createPortalSession(subscription.stripe_customer_id)

    if (error) {
      throw new Error(error)
    }

    if (url) {
      window.location.href = url
    }
  }

  const cancelSubscription = async (feedback?: {
    reason: string
    comments: string
    satisfaction: string
  }) => {
    console.log('🔍 Cancel function called with subscription:', subscription)
    console.log('🔍 Subscription ID:', subscription?.stripe_subscription_id)

    if (!subscription?.stripe_subscription_id) {
      throw new Error('No active subscription found')
    }

    console.log('🔍 Calling StripeService.cancelSubscription with ID:', subscription.stripe_subscription_id)

    const { success, error } = await StripeService.cancelSubscription(
      subscription.stripe_subscription_id,
      feedback
    )

    console.log('🔍 StripeService response:', { success, error })

    if (error) {
      throw new Error(error)
    }

    // Refresh subscription data after cancellation
    await fetchSubscription(true) // Force refresh

    return { success }
  }

  const hasActiveSubscription = subscription?.status === 'active' &&
    subscription && new Date(subscription.current_period_end) > new Date()

  const hasActivePurchase = purchase &&
    purchase.resumes_remaining > 0 &&
    new Date(purchase.expires_at) > new Date()

  const canAccessResume = async (resumeId: string, isFeatured: boolean) => {
    if (!user) return { canAccess: false, reason: 'authentication_required' as const }
    return await StripeService.canAccessResume(user.id, resumeId, isFeatured)
  }

  const canDownloadResume = async () => {
    if (!user) return false
    return await StripeService.canDownloadResume(user.id)
  }

  const recordResumeAccess = async (resumeId: string) => {
    if (!user) return
    await StripeService.processResumeAccess(user.id, resumeId)
  }

  return {
    subscription,
    purchase,
    loading,
    error,
    hasActiveSubscription,
    hasActivePurchase,
    createCheckoutSession,
    createPortalSession,
    cancelSubscription,
    canAccessResume,
    canDownloadResume,
    recordResumeAccess,
    refetch: () => fetchSubscription(true),
  }
}