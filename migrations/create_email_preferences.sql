-- Create email_preferences table
CREATE TABLE IF NOT EXISTS email_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    marketing_emails BOOLEAN DEFAULT true,
    product_updates BOOLEAN DEFAULT true,
    security_alerts BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on user_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_email_preferences') THEN
        ALTER TABLE email_preferences ADD CONSTRAINT unique_user_email_preferences UNIQUE (user_id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own email preferences" ON email_preferences;
DROP POLICY IF EXISTS "Users can insert their own email preferences" ON email_preferences;
DROP POLICY IF EXISTS "Users can update their own email preferences" ON email_preferences;

-- Create policies
CREATE POLICY "Users can view their own email preferences" ON email_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email preferences" ON email_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email preferences" ON email_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_email_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_email_preferences_updated_at ON email_preferences;
CREATE TRIGGER update_email_preferences_updated_at
    BEFORE UPDATE ON email_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_email_preferences_updated_at();

-- Create function to insert default preferences for new users
CREATE OR REPLACE FUNCTION create_default_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
    BEGIN
        INSERT INTO email_preferences (user_id, marketing_emails, product_updates, security_alerts)
        VALUES (NEW.id, true, true, true);
    EXCEPTION
        WHEN OTHERS THEN
            RAISE LOG 'Failed to create email preferences for user %: %', NEW.id, SQLERRM;
    END;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new users
DROP TRIGGER IF EXISTS create_email_preferences_on_signup ON auth.users;
CREATE TRIGGER create_email_preferences_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_email_preferences();