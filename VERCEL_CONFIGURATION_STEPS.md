# Vercel Configuration Steps - Gas Tech AI Tutor

## Status: Stripe Dependency Installed ✅

The Stripe npm package has been successfully installed and the code has been pushed to GitHub.

## Configuration Steps (Do These Now)

### Step 1: Get Resend API Key

**Browser tab opened:** https://resend.com/api-keys

1. Sign in to Resend
2. Find your existing API key OR create a new one
3. Copy the key (starts with `re_`)
4. Keep this tab open

### Step 2: Get Stripe Secret Key

**Browser tab opened:** https://dashboard.stripe.com/apikeys

1. Sign in to Stripe
2. Find your **Secret key** in the "Standard keys" section
3. Click "Reveal test key" or "Reveal live key" (use live key for production)
4. Copy the key (starts with `sk_test_` or `sk_live_`)
5. Keep this tab open

### Step 3: Configure Stripe Webhook

**Browser tab opened:** https://dashboard.stripe.com/webhooks

1. Click "+ Add endpoint" button
2. Enter endpoint URL: `https://gas-technician-tutor.vercel.app/api/stripe-webhook`
3. Click "Select events"
4. Search for and check: `checkout.session.completed`
5. Click "Add events"
6. Click "Add endpoint"
7. Click on the newly created endpoint
8. Find "Signing secret" and click "Reveal"
9. Copy the signing secret (starts with `whsec_`)
10. Keep this tab open

### Step 4: Add Environment Variables to Vercel

**Browser tab opened:** https://vercel.com/mike-kapins-projects/gas-technician-tutor/settings/environment-variables

Add these THREE environment variables:

#### Variable 1: RESEND_API_KEY
- **Key:** `RESEND_API_KEY`
- **Value:** Paste your Resend API key from Step 1
- **Environments:** Check all (Production, Preview, Development)
- Click "Save"

#### Variable 2: STRIPE_SECRET_KEY
- **Key:** `STRIPE_SECRET_KEY`
- **Value:** Paste your Stripe secret key from Step 2
- **Environments:** Check all (Production, Preview, Development)
- Click "Save"

#### Variable 3: STRIPE_WEBHOOK_SECRET
- **Key:** `STRIPE_WEBHOOK_SECRET`
- **Value:** Paste your Stripe webhook signing secret from Step 3
- **Environments:** Check all (Production, Preview, Development)
- Click "Save"

### Step 5: Redeploy to Apply Environment Variables

After adding all three environment variables:

1. Go to the Deployments tab: https://vercel.com/mike-kapins-projects/gas-technician-tutor/deployments
2. Click on the most recent deployment
3. Click the "..." menu (three dots) in the top right
4. Click "Redeploy"
5. Confirm the redeployment

This will rebuild the project with the new environment variables.

### Step 6: Test the Email System

After redeployment completes (2-3 minutes):

#### Option A: Test with Stripe CLI (if you have it installed)
```bash
stripe listen --forward-to https://gas-technician-tutor.vercel.app/api/stripe-webhook
stripe trigger checkout.session.completed
```

#### Option B: Make a test purchase
1. Go to your Stripe payment link (the one customers use)
2. Use test card: `4242 4242 4242 4242`
3. Expiry: Any future date
4. CVC: Any 3 digits
5. Complete the purchase
6. Check the email you used for the welcome message

#### Option C: Manually test the email function
```bash
curl -X POST https://gas-technician-tutor.vercel.app/api/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","customerName":"Test User"}'
```

### Step 7: Verify Everything Works

1. Check Vercel function logs: https://vercel.com/mike-kapins-projects/gas-technician-tutor/logs
2. Check Resend email logs: https://resend.com/emails
3. Check Stripe webhook logs: https://dashboard.stripe.com/webhooks (click on your endpoint)

## For Your Current Customer

Your customer who subscribed but didn't receive an email:

1. **They already have Pro access** - It's stored in their browser when they completed payment
2. **Tell them to:**
   - Go to https://gas-technician-tutor.vercel.app
   - They should see "AI Tutor Pro" status at the top
   - If they don't see it, they may have cleared browser data or are using a different device

3. **Manually send them a welcome email:**
   ```bash
   curl -X POST https://gas-technician-tutor.vercel.app/api/send-welcome-email \
     -H "Content-Type: application/json" \
     -d '{"email":"customer-email@example.com","customerName":"Customer Name"}'
   ```

## Troubleshooting

### Webhook not firing
- Verify webhook URL is exactly: `https://gas-technician-tutor.vercel.app/api/stripe-webhook`
- Make sure `checkout.session.completed` event is selected
- Check webhook attempts in Stripe dashboard

### Email not sending
- Check Resend dashboard for delivery status
- Verify RESEND_API_KEY is correct in Vercel
- Check Vercel function logs for errors

### Environment variables not working
- Make sure you clicked "Save" for each variable
- Verify all three checkboxes (Production, Preview, Development) are checked
- Redeploy after adding variables

## Files Created

- `api/send-welcome-email.js` - Sends welcome email
- `api/stripe-webhook.js` - Handles Stripe webhook
- `package.json` - Updated with Stripe dependency (already pushed to GitHub)

## Next Deployment

The next time you push code to GitHub, Vercel will automatically deploy with the environment variables you configured. The webhook and email functions are ready to go!
