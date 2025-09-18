'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SubscriptionMode = 'free' | 'pro';

interface SubscriptionContextType {
  mode: SubscriptionMode;
  setMode: (mode: SubscriptionMode) => void;
  hasAIAccess: boolean;
  messagesUsed: number;
  messageLimit: number;
  daysRemaining: number;
  isExpiringSoon: boolean;
  incrementMessageCount: () => void;
  resetMessageCount: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [mode, setMode] = useState<SubscriptionMode>('free');
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);

  // Free tier limits
  const messageLimit = 10; // Free users get 10 AI messages per session
  const proAccessDays = 30; // Pro access lasts 30 days

  // Helper function to calculate days remaining
  const calculateDaysRemaining = (purchaseDate: string): number => {
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const diffTime = purchase.getTime() + (proAccessDays * 24 * 60 * 60 * 1000) - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Check URL parameters and Pro access status on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const successParam = params.get('success');
    const newSubscriber = params.get('new');

    // Handle new Pro purchase
    if (modeParam === 'pro' && (successParam === 'true' || newSubscriber === 'true')) {
      const now = new Date().toISOString();
      localStorage.setItem('pro-purchase-date', now);
      setMode('pro');
      setDaysRemaining(proAccessDays);

      // Store flag to show PWA prompt after mode is set
      sessionStorage.setItem('show-pwa-success', 'true');

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check existing Pro access
      const purchaseDate = localStorage.getItem('pro-purchase-date');
      if (purchaseDate) {
        const remaining = calculateDaysRemaining(purchaseDate);
        setDaysRemaining(remaining);

        if (remaining > 0) {
          setMode('pro');
        } else {
          // Pro access expired - clean up
          localStorage.removeItem('pro-purchase-date');
          setMode('free');
        }
      } else {
        setMode('free');
      }
    }
  }, []);

  const hasAIAccess = mode === 'pro' || messagesUsed < messageLimit;
  const isExpiringSoon = mode === 'pro' && daysRemaining > 0 && daysRemaining <= 5;

  const incrementMessageCount = () => {
    if (mode === 'free') {
      setMessagesUsed(prev => prev + 1);
    }
  };

  const resetMessageCount = () => {
    setMessagesUsed(0);
  };

  const value = {
    mode,
    setMode,
    hasAIAccess,
    messagesUsed,
    messageLimit,
    daysRemaining,
    isExpiringSoon,
    incrementMessageCount,
    resetMessageCount
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}