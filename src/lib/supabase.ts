import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  description?: string
  tags: string[]
  created_at: string
  updated_at: string
  is_featured: boolean
  view_count: number
}