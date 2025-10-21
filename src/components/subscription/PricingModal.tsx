'use client';

import React from 'react';
import { X, Check, Sparkles, Rocket, GraduationCap } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateStudent: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onActivateStudent }) => {
  const { mode } = useSubscription();

  if (!isOpen) return null;

  const handleUpgradeToPro = () => {
    // Redirect to Stripe payment
    window.location.href = 'https://buy.stripe.com/5kQeVefxX2VmbCS0tO7ok05';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all"
          aria-label="Close pricing modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-6 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Choose Your Access Level</h2>
          <p className="text-slate-300 text-lg">Select the plan that best fits your learning needs</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-8">
          {/* Free Tier */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Free Version</h3>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white">$0</div>
              <div className="text-slate-400 text-sm">Forever free</div>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">10 AI messages per session</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">CSA B149.1-25 G3 Units 1-12</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Basic AI chat assistance</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Study guides & summaries</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Practice questions</span>
              </li>
            </ul>
            {mode === 'free' && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center">
                <span className="text-blue-300 font-semibold text-sm">Current Plan</span>
              </div>
            )}
          </div>

          {/* Pro Tier - Featured */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400 rounded-xl p-6 flex flex-col relative transform md:scale-105 shadow-2xl">
            {/* Best Value Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-slate-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Best Value
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Rocket className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Pro Version</h3>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white">$9.99</div>
              <div className="text-blue-100 text-sm">per month</div>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">All CSA B149.1-25 Units (G3 + G2)</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">Unlimited AI conversations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">Advanced AI tutoring</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">Detailed explanations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">Code Compass integration</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">Practice exam generator</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">Priority support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">Certification exam prep</span>
              </li>
            </ul>
            {mode === 'pro' ? (
              <div className="bg-white/20 border border-white/30 rounded-lg p-3 text-center">
                <span className="text-white font-semibold text-sm">Current Plan</span>
              </div>
            ) : (
              <button
                onClick={handleUpgradeToPro}
                className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Upgrade to Pro
              </button>
            )}
          </div>

          {/* Student Tier */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <GraduationCap className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Student Access</h3>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white">Special</div>
              <div className="text-slate-400 text-sm">12-month access</div>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">All Pro features included</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">LARK Labs access code required</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Full 12-month access</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Perfect for students & apprentices</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Gas Tech programs</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Educational institution support</span>
              </li>
            </ul>
            {mode === 'student' ? (
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 text-center">
                <span className="text-purple-300 font-semibold text-sm">Current Plan</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onActivateStudent();
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Activate Access Code
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800/30 px-6 py-4 text-center">
          <p className="text-slate-400 text-sm">
            All plans include CSA B149.1-25 compliant training materials
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
