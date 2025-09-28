import { useState, useEffect } from 'react'
import { AuthService } from '@/services/authService'
import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    AuthService.getCurrentUser().then(({ user }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    return await AuthService.signUp(email, password)
  }

  const signIn = async (email: string, password: string) => {
    return await AuthService.signIn(email, password)
  }

  const signOut = async () => {
    return await AuthService.signOut()
  }

  const resetPassword = async (email: string) => {
    return await AuthService.resetPassword(email)
  }

  const updatePassword = async (password: string) => {
    return await AuthService.updatePassword(password)
  }

  const resendConfirmation = async (email: string) => {
    return await AuthService.resendConfirmation(email)
  }

  const signInWithGoogle = async () => {
    return await AuthService.signInWithGoogle()
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
    signInWithGoogle,
    isAuthenticated: !!user,
    isEmailConfirmed: !!user?.email_confirmed_at
  }
}