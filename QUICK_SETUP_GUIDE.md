# Quick Setup Guide - Resume Vault Payment System

## Step 1: Setup Database Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/zixhrdbcwidxicgqxygu
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `subscription_setup.sql` into the editor
4. Click **Run** to create the subscription tables

## Step 2: Create Stripe Product & Price

1. Go to your Stripe dashboard: https://dashboard.stripe.com/products
2. Make sure you're in **LIVE Mode** (toggle at top left) for production
3. Click **+ Add product**
4. Fill in:
   - **Name**: Resume Proof Pro
   - **Description**: Unlimited access to resume examples and downloads
5. Add a **Recurring price**:
   - **Price**: $29.99
   - **Billing period**: Monthly
   - **Currency**: USD
6. **Copy the Price ID** (starts with `price_`) - you'll need this next

## Step 3: Update Price ID in Code

1. Open the file: `src/services/stripeService.ts`
2. Find the line with `stripePriceId: 'price_pro_monthly'`
3. Replace `'price_pro_monthly'` with your actual Stripe Price ID from Step 2

## Step 4: Set Stripe Secrets in Supabase

1. Go to **Settings > Edge Functions** in your Supabase dashboard
2. Add these secrets:
   - **STRIPE_SECRET_KEY**: `sk_live_YOUR_LIVE_STRIPE_SECRET_KEY_HERE`
   - **STRIPE_WEBHOOK_SECRET**: (We'll get this in Step 6)

## Step 5: Deploy Edge Functions

Run these commands in your terminal:

```bash
# Install Supabase CLI (if you haven't already)
# You may need to install via different method on Windows

# Login to Supabase (you'll need to get an access token from dashboard)
npx supabase login

# Link your project
npx supabase link --project-ref zixhrdbcwidxicgqxygu

# Deploy the Edge Functions
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-portal-session  
npx supabase functions deploy stripe-webhook
```

## Step 6: Setup Stripe Webhook

1. In Stripe dashboard, go to **Developers > Webhooks**
2. Click **+ Add endpoint**
3. Set endpoint URL to: `https://zixhrdbcwidxicgqxygu.supabase.co/functions/v1/stripe-webhook`
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to Supabase secrets as **STRIPE_WEBHOOK_SECRET**

## Step 7: Test the Payment Flow

1. Restart your dev server: `npm run dev`
2. Go to `/pricing` page
3. Click "Subscribe now" on the Pro plan
4. Use REAL credit card details (you're in LIVE mode now!)
5. Any future expiry date and any 3-digit CVC
6. Complete the checkout

## ⚠️ LIVE MODE WARNING

**You are now in LIVE mode! Real charges will be processed.**
- Only use real credit cards
- Real money will be charged
- For testing, create a small amount product first

## What Should Happen

1. ✅ User clicks "Subscribe now"
2. ✅ Redirected to Stripe Checkout
3. ✅ Payment processed
4. ✅ Webhook creates subscription record in database
5. ✅ User redirected to success page
6. ✅ User can now access all resumes and downloads

## Troubleshooting

- **Can't deploy functions**: Make sure you're logged into Supabase CLI
- **Webhook not working**: Check the endpoint URL and signing secret
- **Price not found**: Make sure you updated the Price ID in the code
- **Database errors**: Make sure you ran the SQL setup script

Need help? The payment system is fully implemented and ready to test!