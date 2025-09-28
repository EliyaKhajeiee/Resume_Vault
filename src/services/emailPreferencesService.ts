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
  private static STORAGE_KEY = 'resumeproof_email_preferences';

  /**
   * Get default email preferences
   */
  private static getDefaultPreferences(): EmailPreferences {
    return {
      marketing_emails: true,
      product_updates: true,
      security_alerts: true
    };
  }

  /**
   * Get user's email preferences from localStorage
   */
  static async getEmailPreferences(): Promise<{ preferences: EmailPreferences | null; error?: string }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);

      if (stored) {
        const preferences = JSON.parse(stored);
        return { preferences };
      }

      // Return default preferences if none stored
      const defaultPrefs = this.getDefaultPreferences();
      this.saveToLocalStorage(defaultPrefs);
      return { preferences: defaultPrefs };
    } catch (error) {
      console.error('Error loading email preferences from localStorage:', error);
      // Return defaults if there's an error
      const defaultPrefs = this.getDefaultPreferences();
      return { preferences: defaultPrefs };
    }
  }

  /**
   * Save preferences to localStorage
   */
  private static saveToLocalStorage(preferences: EmailPreferences): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving email preferences to localStorage:', error);
    }
  }

  /**
   * Update user's email preferences in localStorage
   */
  static async updateEmailPreferences(preferences: Partial<EmailPreferences>): Promise<{ success: boolean; preferences?: EmailPreferences; error?: string }> {
    try {
      // Get current preferences
      const { preferences: currentPrefs } = await this.getEmailPreferences();

      // Merge with new preferences
      const updatedPreferences = {
        ...currentPrefs,
        marketing_emails: preferences.marketing_emails ?? currentPrefs?.marketing_emails ?? true,
        product_updates: preferences.product_updates ?? currentPrefs?.product_updates ?? true,
        security_alerts: preferences.security_alerts ?? currentPrefs?.security_alerts ?? true
      };

      // Save to localStorage
      this.saveToLocalStorage(updatedPreferences);

      return { success: true, preferences: updatedPreferences };
    } catch (error) {
      console.error('Error updating email preferences:', error);
      return { success: false, error: 'Failed to save preferences' };
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