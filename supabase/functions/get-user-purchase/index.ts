import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response('Missing authorization header', {
        status: 401,
        headers: corsHeaders
      })
    }

    // Initialize Supabase with service role (bypasses RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT
    const jwt = authHeader.replace('Bearer ', '')
    const { data: user, error: userError } = await supabase.auth.getUser(jwt)

    if (userError || !user.user) {
      return new Response('Invalid token', {
        status: 401,
        headers: corsHeaders
      })
    }

    console.log('Getting purchase for user:', user.user.id)

    // Get user's active purchase
    const { data: purchase, error } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('status', 'succeeded')
      .gt('expires_at', new Date().toISOString())
      .gt('resumes_remaining', 0)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching purchase:', error)
      return new Response(JSON.stringify({
        data: null,
        error: 'Failed to fetch purchase'
      }), {
        status: 500,
        headers: corsHeaders
      })
    }

    console.log('Purchase found:', !!purchase)

    return new Response(JSON.stringify({
      data: purchase || null,
      error: null
    }), {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({
      data: null,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: corsHeaders
    })
  }
})