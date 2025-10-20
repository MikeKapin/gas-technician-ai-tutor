# Email Notification Setup - Gas Tech AI Tutor

This document explains how to set up the email notification system for Gas Tech AI Tutor Pro subscriptions.

## Overview

When customers subscribe to Gas Tech AI Tutor Pro via Stripe:
1. Stripe redirects them back to the app with Pro access automatically activated
2. Stripe sends a webhook to our Vercel serverless function
3. Our webhook handler sends a welcome email via Resend
4. Customer receives confirmation email with instructions

## Files Created

- `api/send-welcome-email.js` - Vercel serverless function that sends welcome email via Resend API
- `api/stripe-webhook.js` - Vercel serverless function that handles Stripe webhook events
- `netlify.toml` - Configuration file (optional, kept for compatibility)

## Setup Steps

### 1. Install Dependencies

```bash
cd C:\Users\m_kap\gas-technician-tutor
npm install stripe
```

### 2. Get Resend API Key

You should already have a Resend API key from Code Compass. If not:
1. Go to https://resend.com/api-keys
2. Create a new API key
3. Copy the key (starts with `re_`)

### 3. Get Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret Key** (starts with `sk_`)
3. Go to https://dashboard.stripe.com/webhooks
4. Click "Add endpoint"
5. Enter URL: `https://gas-technician-tutor.vercel.app/api/stripe-webhook`
6. Select event: `checkout.session.completed`
7. Copy the **Signing Secret** (starts with `whsec_`)

### 4. Configure Environment Variables in Vercel

```bash
vercel env add RESEND_API_KEY
# Paste your Resend API key

vercel env add STRIPE_SECRET_KEY
# Paste your Stripe secret key

vercel env add STRIPE_WEBHOOK_SECRET
# Paste your Stripe webhook signing secret
```

Or via Vercel Dashboard:
1. Go to https://vercel.com/mike-kapins-projects/gas-technician-tutor/settings/environment-variables
2. Add the three environment variables above
3. Make sure they're available for Production, Preview, and Development

### 5. Deploy

```bash
git add .
git commit -m "Add email notification system for Pro subscriptions"
git push
```

The deployment platform will automatically detect the Netlify functions and deploy them.

### 6. Test the Webhook

#### Option A: Use Stripe CLI for local testing
```bash
stripe listen --forward-to https://gas-technician-tutor.vercel.app/api/stripe-webhook
stripe trigger checkout.session.completed
```

#### Option B: Make a test purchase
1. Go to your Stripe payment link
2. Use test card: `4242 4242 4242 4242`, any future date, any CVC
3. Complete the purchase
4. Check your email

### 7. Verify Email Delivery

After a test purchase:
1. Check the email inbox for the customer email used
2. Verify the welcome email arrived
3. Check Vercel function logs for any errors:
   - Go to https://vercel.com/mike-kapins-projects/gas-technician-tutor/logs
   - Filter by function: `api/stripe-webhook` or `api/send-welcome-email`

## Email Template

The welcome email includes:
- Welcome message with customer's first name
- Explanation that Pro access is already active (no code needed)
- List of Pro features included
- Quick start guide
- Important note about browser storage
- Support contact information

## Troubleshooting

### Email not sending
1. Check Vercel function logs: https://vercel.com/mike-kapins-projects/gas-technician-tutor/logs
2. Verify RESEND_API_KEY is set correctly in Vercel environment variables
3. Check Resend dashboard for delivery logs: https://resend.com/emails

### Webhook not triggering
1. Check Vercel function logs for stripe-webhook
2. Verify webhook URL in Stripe dashboard is: `https://gas-technician-tutor.vercel.app/api/stripe-webhook`
3. Verify STRIPE_WEBHOOK_SECRET is set correctly in Vercel
4. Check Stripe dashboard webhook attempts: https://dashboard.stripe.com/webhooks

### Customer says they didn't receive email
1. Check spam/junk folder
2. Verify correct email was used in Stripe checkout
3. Check Resend dashboard for delivery status
4. Manually send welcome email using the API:
   ```bash
   curl -X POST https://gas-technician-tutor.vercel.app/api/send-welcome-email \
     -H "Content-Type: application/json" \
     -d '{"email":"customer@example.com","customerName":"John Doe"}'
   ```

## Current Customer Issue

For the customer who subscribed but didn't receive a code:

1. **They already have access** - When they completed Stripe checkout, they were redirected back with `?mode=pro&success=true`, which stored Pro access in their browser's localStorage
2. **They don't need a code** - Pro subscriptions use instant activation (no codes)
3. **They just need to return to the app** - Tell them to go back to https://gas-technician-tutor.vercel.app and their Pro status should be active
4. **Send manual welcome email** - You can manually send them a welcome email to explain this:
   ```bash
   curl -X POST https://gas-technician-tutor.vercel.app/api/send-welcome-email \
     -H "Content-Type: application/json" \
     -d '{"email":"their-email@example.com","customerName":"Their Name"}'
   ```

## Future Improvements

Consider adding:
- Email on subscription expiration (5 days before)
- Email on successful renewal
- Email with usage statistics
- Database to track all subscriptions (currently only stored in localStorage)
