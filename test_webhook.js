// Test if webhook endpoint is reachable
// Run this in browser console

const testWebhook = async () => {
  console.log('🧪 Testing webhook endpoint...');

  try {
    const response = await fetch('/.netlify/functions/stripe-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'test_event',
        data: {
          object: {
            test: true
          }
        }
      })
    });

    const result = await response.text();
    console.log('📡 Webhook response:', response.status, result);

    if (response.ok) {
      console.log('✅ Webhook endpoint is reachable');
    } else {
      console.log('❌ Webhook endpoint has issues');
    }

  } catch (error) {
    console.error('❌ Webhook test failed:', error);
  }
};

testWebhook();