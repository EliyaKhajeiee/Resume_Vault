# Stripe Webhook Setup

## Create Webhook in Stripe Dashboard

1. **Go to Stripe Webhooks**: https://dashboard.stripe.com/webhooks (LIVE MODE - make sure you're not in test mode!)

2. **Click "Add endpoint"**

3. **Set Endpoint URL**:
   ```
   https://zixhrdbcwidxicgqxygu.supabase.co/functions/v1/stripe-webhook
   ```

4. **Select Events** (click "Select events"):
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. **Click "Add endpoint"**

6. **Copy the Signing Secret**:
   - After creating the webhook, click on it
   - Click "Reveal" next to "Signing secret"
   - Copy the secret (starts with `whsec_`)
   - Give me this secret so I can add it to Supabase

## What This Does

The webhook will automatically:
- Create subscription records when users subscribe
- Update subscription status when payments succeed/fail
- Handle cancellations and updates
- Keep your database in sync with Stripe

Once you give me the webhook secret, I'll add it to Supabase and we can test the full payment flow!