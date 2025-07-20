import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export class AuthService {
  /**
   * Sign up with email and password
   */
  static async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Sign up error:', error)
        return { success: false, error: error.message }
      }

      if (data.user && !data.user.email_confirmed_at) {
        return { 
          success: true, 
          user: data.user,
          error: 'Please check your email and click the confirmation link to complete your registration.'
        }
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Unexpected sign up error:', error)
      return { success: false, error: 'An unexpected error occurred during sign up' }
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      return { success: false, error: 'An unexpected error occurred during sign in' }
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Sign out error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      return { success: false, error: 'An unexpected error occurred during sign out' }
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<{ user: User | null; error?: string }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        console.error('Get user error:', error)
        return { user: null, error: error.message }
      }

      return { user }
    } catch (error) {
      console.error('Unexpected get user error:', error)
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        console.error('Reset password error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected reset password error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Update password
   */
  static async updatePassword(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) {
        console.error('Update password error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected update password error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Resend email confirmation
   */
  static async resendConfirmation(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Resend confirmation error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected resend confirmation error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  }
}