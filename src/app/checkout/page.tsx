'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // You can pass a specific price ID here if needed
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error('No client secret received:', data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating checkout session:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Setting up checkout...</h1>
          <p className="text-slate-300">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 p-3 rounded-full w-fit mx-auto mb-4">
            <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Checkout Error</h1>
          <p className="text-slate-300 mb-6">Unable to initialize checkout. Please try again.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to App</span>
          </button>
        </div>
      </div>
    );
  }

  const options = { clientSecret };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Gas-Tech Tudor</span>
          </button>

          <h1 className="text-3xl font-bold text-white mb-2">Upgrade to Gas-Tech Tudor Pro</h1>
          <p className="text-slate-300">
            Get unlimited AI tutoring, personalized explanations, and advanced study features
          </p>
        </div>

        {/* Features */}
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">What&apos;s included:</h2>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Unlimited AI-powered tutoring sessions</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Personalized explanations for G2 & G3 certification</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Complete CSA B149.1-25 & B149.2-25 training content</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Advanced study tools and practice scenarios</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Professional PWA app for offline access</span>
            </li>
          </ul>
        </div>

        {/* Stripe Checkout */}
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}