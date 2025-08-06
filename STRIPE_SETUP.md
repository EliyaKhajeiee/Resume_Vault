# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for your Resume Vault application.

## 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete your account setup and verification

## 2. Get Stripe Keys

### Test Mode (Development)
1. In your Stripe dashboard, make sure you're in **Test mode** (toggle in the top-left)
2. Go to **Developers > API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### Live Mode (Production)
1. Switch to **Live mode** in Stripe dashboard
2. Copy your **Live Publishable key** (starts with `pk_live_`)
3. Copy your **Live Secret key** (starts with `sk_live_`)

## 3. Create Products and Prices

1. Go to **Products** in your Stripe dashboard
2. Click **+ Add product**
3. Create a product for "Resume Proof Pro":
   - Name: "Resume Proof Pro"
   - Description: "Unlimited access to resume examples and downloads"
4. Add a price:
   - Price: $29.00
   - Billing period: Monthly
   - Copy the **Price ID** (starts with `price_`)

## 4. Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Stripe keys:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 5. Update Stripe Service

1. Open `src/services/stripeService.ts`
2. Update the `stripePriceId` in the `SUBSCRIPTION_PLANS` array with your actual Stripe Price ID:

```typescript
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'pro-monthly',
    name: 'Pro',
    price: 29,
    interval: 'month',
    stripePriceId: 'price_your_actual_price_id', // Replace this
    features: [...]
  }
]
```

## 6. Deploy Supabase Edge Functions

1. Install Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Set Stripe secrets in Supabase:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

5. Deploy the Edge Functions:
   ```bash
   supabase functions deploy create-checkout-session
   supabase functions deploy create-portal-session
   supabase functions deploy stripe-webhook
   ```

## 7. Set Up Webhook

1. In your Stripe dashboard, go to **Developers > Webhooks**
2. Click **+ Add endpoint**
3. Set the endpoint URL to: `https://your-project-ref.supabase.co/functions/v1/stripe-webhook`
4. Select the following events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)
6. Add it to your Supabase secrets:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## 8. Run Database Migrations

Apply the subscription tables migration:

```bash
supabase db push
```

## 9. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `/pricing` and try subscribing with a test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

3. Check that the subscription appears in your Stripe dashboard and in the Supabase database

## 10. Going Live

When ready for production:

1. Switch your Stripe dashboard to **Live mode**
2. Update your environment variables with live keys
3. Update the webhook endpoint to your production URL
4. Deploy your application

## Troubleshooting

- **"No such price"**: Make sure you're using the correct Price ID from Stripe
- **Webhook not working**: Check that the webhook secret matches and the endpoint URL is correct
- **Database errors**: Make sure you've run the migration with `supabase db push`
- **CORS errors**: Ensure your domain is added to Supabase settings

## Support

If you need help with Stripe integration, check:
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)