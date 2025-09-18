'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

function ReturnPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [customerEmail, setCustomerEmail] = useState<string>('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Check the Checkout Session status
    fetch(`/api/checkout?session_id=${sessionId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'complete') {
          setStatus('success');
          setCustomerEmail(data.customer_email || '');

          // Redirect to main app with Pro access after 3 seconds
          setTimeout(() => {
            router.push('/?mode=pro&success=true&new=true');
          }, 3000);
        } else {
          setStatus('error');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        setStatus('error');
      });
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Processing your payment...</h1>
          <p className="text-slate-300">Please wait while we confirm your subscription.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 p-3 rounded-full w-fit mx-auto mb-4">
            <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Error</h1>
          <p className="text-slate-300 mb-6">There was an issue processing your payment. Please try again.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Return to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-green-500/20 p-3 rounded-full w-fit mx-auto mb-6">
          <CheckCircle className="h-16 w-16 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Welcome to Gas-Tech Tudor Pro! 🎉</h1>

        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">Payment Successful</h2>
          {customerEmail && (
            <p className="text-slate-300 text-sm mb-3">Confirmation sent to: {customerEmail}</p>
          )}
          <p className="text-slate-400 text-sm">
            You now have unlimited access to AI tutoring, personalized explanations, and all Pro features.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-2">🚀 What&apos;s Next?</h3>
          <p className="text-blue-200 text-sm">
            You&apos;ll be redirected to install the Gas-Tech Tudor app for the best experience.
          </p>
        </div>

        <div className="text-slate-500 text-xs">
          Redirecting in a few seconds... or{' '}
          <button
            onClick={() => router.push('/?mode=pro&success=true&new=true')}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            click here
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <ReturnPageContent />
    </Suspense>
  );
}