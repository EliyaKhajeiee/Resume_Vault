# 🔧 Enable Google OAuth in Supabase - Resume Proof

## Quick Fix Steps:

### 1. **Enable Google Provider in Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your Resume Proof project
3. Click **"Authentication"** in the left sidebar
4. Click **"Providers"** tab
5. Find **"Google"** in the list
6. Toggle it to **"Enabled"**
7. Click **"Save"**

### 2. **Set Up Redirect URLs**
In the same Authentication settings:
1. Go to **"URL Configuration"** section
2. Add these **Site URLs**:
   - `https://resumeproof.com`
   - `http://localhost:5173` (for development)

3. Add these **Redirect URLs**:
   - `https://resumeproof.com/auth/callback`
   - `http://localhost:5173/auth/callback`

### 3. **Google Cloud Console Setup (Recommended for Production)**

#### Step 1: Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Search for "Google+ API" and enable it
4. Go to **"APIs & Services"** → **"Credentials"**
5. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**

#### Step 2: Configure OAuth Client
1. Set **Application type** to **"Web application"**
2. Set **Name** to "Resume Proof"
3. Add **Authorized JavaScript origins**:
   - `https://resumeproof.com`
   - `http://localhost:5173`
4. Add **Authorized redirect URIs**:
   - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual project reference

#### Step 3: Get Credentials
1. Copy the **Client ID** and **Client Secret**
2. Go back to your Supabase dashboard
3. In Google provider settings, paste:
   - **Client ID** in the "Client ID" field
   - **Client Secret** in the "Client Secret" field
4. Click **"Save"**

## 🚀 Quick Test Option:

For immediate testing, just enabling Google in Supabase (Step 1) will use Supabase's development OAuth credentials. This is fine for testing but has limitations for production.

## ✅ Verification:

After enabling:
1. Go to https://resumeproof.com
2. Click "Sign In"
3. Click "Continue with Google"
4. Should redirect to Google OAuth instead of showing error

## 🔍 Find Your Supabase Project Reference:

Your project reference is in your Supabase dashboard URL:
`https://supabase.com/dashboard/project/YOUR_PROJECT_REF_HERE`

Example: If your URL is `https://supabase.com/dashboard/project/abcdefghijklmnop`
Then your project ref is: `abcdefghijklmnop`

The redirect URI would be: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`