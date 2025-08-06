import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  console.log('Test webhook received:', req.method)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))
  
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    })
  }

  try {
    const body = await req.text()
    console.log('Body received:', body.substring(0, 200) + '...')
    
    return new Response(JSON.stringify({ 
      status: 'success',
      method: req.method,
      timestamp: new Date().toISOString(),
      bodyLength: body.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      status: 'error',
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
})