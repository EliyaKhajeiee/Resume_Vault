# Resume Proof

A platform for accessing proven resume examples from successful candidates at top companies.

## Setup Instructions

### 1. Supabase Configuration

After setting up your Supabase project, you need to configure the following in your Supabase Dashboard:

#### Authentication Settings
1. Go to **Authentication > Settings**
2. Enable **"Enable email confirmations"**
3. Set **Site URL** to: `http://localhost:8080` (for development)
4. Add **Redirect URLs**:
   - `http://localhost:8080/auth/callback`
   - `http://localhost:8080/auth/reset-password`

#### Email Templates (Optional but Recommended)
1. Go to **Authentication > Email Templates**
2. Customize the **Confirm signup** template:
   ```html
   <h2>Welcome to Resume Proof!</h2>
   <p>Thanks for signing up! Click the link below to confirm your email address:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
   <p>If you didn't create an account with us, you can safely ignore this email.</p>
   <p>Best regards,<br>The Resume Proof Team</p>
   ```

#### Storage Setup
1. The storage bucket will be created automatically via migrations
2. If you encounter storage issues, check that the `resumes` bucket exists in **Storage**

### 2. Environment Variables

Make sure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Migrations

The migrations will set up:
- Database tables with proper RLS policies
- Storage bucket for resume files
- Authentication configuration

### 4. Development

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Features

- 🔐 **Authentication**: Email/password with email verification
- 📄 **Resume Database**: Browse and search proven resume examples
- 🔍 **Advanced Search**: Filter by company, role, industry, experience level
- 📁 **File Upload**: Upload resume files with multiple format support
- 👨‍💼 **Admin Panel**: Manage resumes and view analytics
- 📧 **Email Collection**: Landing page email signup

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database + Auth + Storage)
- **Routing**: React Router
- **State Management**: React Query + Custom Hooks
# Environment variables configured - Mon, Sep 15, 2025  6:36:15 PM
