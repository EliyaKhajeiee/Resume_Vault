import { useState, useEffect } from 'react'
import { StripeService, type UserSubscription } from '@/services/stripeService'
import { useAuth } from './useAuth'

export const useSubscription = () => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchSubscription()
    } else {
      setSubscription(null)
      setLoading(false)
    }
  }, [user])

  const fetchSubscription = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    console.log('Fetching subscription for user:', user.id)
    const { data, error } = await StripeService.getUserSubscription(user.id)
    
    console.log('Subscription fetch result:', { data, error })
    
    if (error) {
      setError(error)
    } else {
      setSubscription(data)
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
    if (!subscription?.stripe_subscription_id) {
      throw new Error('No active subscription found')
    }

    const { success, error } = await StripeService.cancelSubscription(
      subscription.stripe_subscription_id,
      feedback
    )

    if (error) {
      throw new Error(error)
    }

    // Refresh subscription data after cancellation
    await fetchSubscription()

    return { success }
  }

  const hasActiveSubscription = subscription?.status === 'active' && 
    subscription && new Date(subscription.current_period_end) > new Date()

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
    await StripeService.recordResumeAccess(user.id, resumeId)
  }

  return {
    subscription,
    loading,
    error,
    hasActiveSubscription,
    createCheckoutSession,
    createPortalSession,
    cancelSubscription,
    canAccessResume,
    canDownloadResume,
    recordResumeAccess,
    refetch: fetchSubscription
  }
}