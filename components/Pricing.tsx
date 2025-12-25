import React, { useState } from 'react';
import { Check, Coins, Zap } from 'lucide-react';
import { PLANS } from '../constants';
import { UserProfile } from '../types';
import { recordPayment } from '../services/firebase';

interface PricingProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
}

const Pricing: React.FC<PricingProps> = ({ user, onOpenAuth }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleBuy = async (plan: typeof PLANS[0]) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setProcessingId(plan.id);

    // Simulate UPI Payment Process
    // In a real app, this would open a Razorpay/Stripe checkout or a UPI deep link
    // Here we simulate network delay and auto-verify
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate bank processing
      
      // Record payment and add credits
      await recordPayment({
        userId: user.uid,
        planId: plan.id,
        amount: plan.price,
        creditsAdded: plan.credits,
        status: 'success',
        createdAt: Date.now()
      });

      alert(`Successfully added ${plan.credits} credits!`);
    } catch (error) {
      console.error(error);
      alert('Payment simulation failed.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Buy credits as you go. No hidden monthly subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-lg border p-8 flex flex-col transition-colors duration-300 ${plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50 scale-105 z-10' : 'border-slate-200 dark:border-slate-800'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-3 mr-3 px-3 py-1 bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">₹{plan.price}</span>
                  <span className="ml-2 text-slate-500 dark:text-slate-400 text-sm">/ one-time</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-6 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg w-fit">
                   <Coins size={20} />
                   {plan.credits} Credits
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                      <span className="text-slate-600 dark:text-slate-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleBuy(plan)}
                disabled={!!processingId}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {processingId === plan.id ? 'Processing UPI...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;