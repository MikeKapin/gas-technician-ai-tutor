/**
 * Stripe Webhook - Gas Tech AI Tutor (Vercel Serverless Function)
 * Handles Stripe checkout.session.completed events
 * Sends welcome email to new Pro subscribers
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Disable body parsing, need raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to get raw body
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const rawBody = await getRawBody(req);

  try {
    // Verify webhook signature
    let event;

    if (STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          sig,
          STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }
    } else {
      // If no webhook secret configured, parse body directly (not recommended for production)
      console.warn('WARNING: STRIPE_WEBHOOK_SECRET not configured - webhook signature not verified');
      event = JSON.parse(rawBody);
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      console.log('Checkout session completed:', {
        sessionId: session.id,
        customerEmail: session.customer_email,
        customerName: session.customer_details?.name
      });

      // Get customer email and name
      const customerEmail = session.customer_email || session.customer_details?.email;
      const customerName = session.customer_details?.name;

      if (!customerEmail) {
        console.error('No customer email found in session:', session.id);
        return res.status(400).json({ error: 'No customer email found' });
      }

      // Call send-welcome-email function
      try {
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'https://gas-technician-tutor.vercel.app';

        const emailResponse = await fetch(`${baseUrl}/api/send-welcome-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: customerEmail,
            customerName: customerName
          })
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          console.error('Failed to send welcome email:', emailResult);
          // Don't fail the webhook - email failure shouldn't block payment confirmation
        } else {
          console.log('Welcome email sent successfully:', emailResult);
        }

      } catch (emailError) {
        console.error('Error calling send-welcome-email:', emailError);
        // Don't fail the webhook - email failure shouldn't block payment confirmation
      }

      // Log subscription for tracking
      console.log('Pro subscription created:', {
        email: customerEmail,
        name: customerName,
        sessionId: session.id,
        timestamp: new Date().toISOString()
      });

      return res.status(200).json({
        received: true,
        message: 'Webhook processed successfully'
      });
    }

    // Handle other event types if needed
    console.log('Unhandled webhook event type:', event.type);

    return res.status(200).json({
      received: true,
      message: 'Event type not handled'
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
