'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SubscriptionMode = 'free' | 'pro';

interface SubscriptionContextType {
  mode: SubscriptionMode;
  setMode: (mode: SubscriptionMode) => void;
  hasAIAccess: boolean;
  messagesUsed: number;
  messageLimit: number;
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

  // Free tier limits
  const messageLimit = 10; // Free users get 10 AI messages per session

  // Check URL parameters for mode on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const successParam = params.get('success');
    const newSubscriber = params.get('new');

    if (modeParam === 'pro' || modeParam === 'free') {
      setMode(modeParam as SubscriptionMode);

      // If this is a new pro subscriber from payment success, show PWA prompt
      if (modeParam === 'pro' && (successParam === 'true' || newSubscriber === 'true')) {
        // Store flag to show PWA prompt after mode is set
        sessionStorage.setItem('show-pwa-success', 'true');
      }
    }

    // Check for subscription status in localStorage (for persistent pro users)
    const savedMode = localStorage.getItem('subscription-mode');
    if (savedMode === 'pro') {
      setMode('pro');
    }
  }, []);

  // Save mode to localStorage when it changes
  useEffect(() => {
    if (mode === 'pro') {
      localStorage.setItem('subscription-mode', 'pro');
    } else {
      localStorage.removeItem('subscription-mode');
    }
  }, [mode]);

  const hasAIAccess = mode === 'pro' || messagesUsed < messageLimit;

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