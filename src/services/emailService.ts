import { supabase } from '@/lib/supabase'
import type { EmailSignup } from '@/lib/supabase'

export class EmailService {
  /**
   * Save an email signup to the database
   */
  static async saveEmail(email: string, source: string = 'landing_page'): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('email_signups')
        .insert([
          {
            email: email.toLowerCase().trim(),
            source
          }
        ])
        .select()
        .single()

      if (error) {
        // Handle duplicate email error gracefully
        if (error.code === '23505') {
          return { success: false, error: 'Email already registered' }
        }
        console.error('Error saving email:', error)
        return { success: false, error: 'Failed to save email' }
      }

      console.log('Email saved successfully:', data)
      return { success: true }
    } catch (error) {
      console.error('Unexpected error saving email:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get all email signups (requires authentication)
   */
  static async getAllEmails(): Promise<{ data: EmailSignup[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('email_signups')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching emails:', error)
        return { data: null, error: 'Failed to fetch emails' }
      }

      return { data }
    } catch (error) {
      console.error('Unexpected error fetching emails:', error)
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get email signup count
   */
  static async getEmailCount(): Promise<{ count: number; error?: string }> {
    try {
      const { count, error } = await supabase
        .from('email_signups')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error getting email count:', error)
        return { count: 0, error: 'Failed to get email count' }
      }

      return { count: count || 0 }
    } catch (error) {
      console.error('Unexpected error getting email count:', error)
      return { count: 0, error: 'An unexpected error occurred' }
    }
  }
}