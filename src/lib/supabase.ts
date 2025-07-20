import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface EmailSignup {
  id: string
  email: string
  created_at: string
  source: string
  status: string
}

export interface Resume {
  id: string
  title: string
  company: string
  role: string
  industry: string
  experience_level: string
  file_url?: string
  file_name?: string
  file_size?: number
  file_type?: string
  description?: string
  tags: string[]
  created_at: string
  updated_at: string
  is_featured: boolean
  view_count: number
}

export interface User {
  id: string
  email: string
  email_confirmed_at?: string
  created_at: string
  updated_at: string
}