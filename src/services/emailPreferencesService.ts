import { supabase } from '@/lib/supabase';

export interface EmailPreferences {
  id?: string;
  user_id?: string;
  marketing_emails: boolean;
  product_updates: boolean;
  security_alerts: boolean;
  created_at?: string;
  updated_at?: string;
}

export class EmailPreferencesService {
  /**
   * Get user's email preferences
   */
  static async getEmailPreferences(): Promise<{ preferences: EmailPreferences | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { preferences: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No preferences found, create default ones
          return await this.createDefaultPreferences();
        }
        if (error.code === '42P01') {
          // Table doesn't exist, return default preferences without error
          console.log('Email preferences table not found, using defaults');
          return {
            preferences: {
              marketing_emails: true,
              product_updates: true,
              security_alerts: true
            }
          };
        }
        console.error('Error fetching email preferences:', error);
        return { preferences: null, error: error.message };
      }

      return { preferences: data };
    } catch (error) {
      console.error('Unexpected error fetching email preferences:', error);
      return { preferences: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Create default email preferences for user
   */
  static async createDefaultPreferences(): Promise<{ preferences: EmailPreferences | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { preferences: null, error: 'User not authenticated' };
      }

      const defaultPreferences = {
        user_id: user.id,
        marketing_emails: true,
        product_updates: true,
        security_alerts: true
      };

      const { data, error } = await supabase
        .from('email_preferences')
        .insert(defaultPreferences)
        .select()
        .single();

      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist, return default preferences without error
          console.log('Email preferences table not found during creation, using defaults');
          return {
            preferences: {
              marketing_emails: true,
              product_updates: true,
              security_alerts: true
            }
          };
        }
        console.error('Error creating default email preferences:', error);
        return { preferences: null, error: error.message };
      }

      return { preferences: data };
    } catch (error) {
      console.error('Unexpected error creating default email preferences:', error);
      return { preferences: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Update user's email preferences
   */
  static async updateEmailPreferences(preferences: Partial<EmailPreferences>): Promise<{ success: boolean; preferences?: EmailPreferences; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Remove user_id and other fields that shouldn't be updated
      const updateData = {
        marketing_emails: preferences.marketing_emails,
        product_updates: preferences.product_updates,
        security_alerts: preferences.security_alerts
      };

      const { data, error } = await supabase
        .from('email_preferences')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist, silently succeed with defaults
          console.log('Email preferences table not found during update, using defaults');
          return {
            success: true,
            preferences: {
              marketing_emails: updateData.marketing_emails ?? true,
              product_updates: updateData.product_updates ?? true,
              security_alerts: updateData.security_alerts ?? true
            }
          };
        }
        console.error('Error updating email preferences:', error);
        return { success: false, error: error.message };
      }

      return { success: true, preferences: data };
    } catch (error) {
      console.error('Unexpected error updating email preferences:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Unsubscribe from all marketing emails (keeps security alerts)
   */
  static async unsubscribeFromAll(): Promise<{ success: boolean; preferences?: EmailPreferences; error?: string }> {
    return await this.updateEmailPreferences({
      marketing_emails: false,
      product_updates: false,
      security_alerts: true // Always keep security alerts enabled
    });
  }

  /**
   * Subscribe to all emails
   */
  static async subscribeToAll(): Promise<{ success: boolean; preferences?: EmailPreferences; error?: string }> {
    return await this.updateEmailPreferences({
      marketing_emails: true,
      product_updates: true,
      security_alerts: true
    });
  }
}