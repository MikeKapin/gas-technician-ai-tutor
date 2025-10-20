/**
 * Stripe Webhook - Gas Tech AI Tutor
 * Handles Stripe checkout.session.completed events
 * Sends welcome email to new Pro subscribers
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const sig = event.headers['stripe-signature'];

  try {
    // Verify webhook signature
    let stripeEvent;

    if (STRIPE_WEBHOOK_SECRET) {
      try {
        stripeEvent = stripe.webhooks.constructEvent(
          event.body,
          sig,
          STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
        };
      }
    } else {
      // If no webhook secret configured, parse body directly (not recommended for production)
      console.warn('WARNING: STRIPE_WEBHOOK_SECRET not configured - webhook signature not verified');
      stripeEvent = JSON.parse(event.body);
    }

    // Handle checkout.session.completed event
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;

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
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No customer email found' })
        };
      }

      // Call send-welcome-email function
      try {
        const emailResponse = await fetch(`${process.env.URL}/.netlify/functions/send-welcome-email`, {
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

      return {
        statusCode: 200,
        body: JSON.stringify({
          received: true,
          message: 'Webhook processed successfully'
        })
      };
    }

    // Handle other event types if needed
    console.log('Unhandled webhook event type:', stripeEvent.type);

    return {
      statusCode: 200,
      body: JSON.stringify({
        received: true,
        message: 'Event type not handled'
      })
    };

  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
