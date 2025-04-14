"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import MainLayout from "../layout/MainLayout";
import { TIERS, getUserTier } from '@/lib/userTier';
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';
import PurchaseLink from './PurchaseLink';

const CheckIcon = ({ className }) => (
  <svg
    className={`h-5 w-5 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    data-slot="icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);

const CrossIcon = ({ className }) => (
  <svg
    className={`h-5 w-5 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    data-slot="icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg
    className="h-4 w-4 inline-block ml-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    data-slot="icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    />
  </svg>
);

const StarsIcon = () => (
  <svg
    className="h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    data-slot="icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    />
  </svg>
);

const pricingPlans = [
  {
    name: "Free",
    description: "Free. Always.",
    price: "0",
    period: "All year long",
    tier: TIERS.FREE,
    features: [
      { text: "10 Audio Messages a Month", included: true },
      { text: "Access to Chat Bot (With limits)", included: true },
      { text: "Access to Quiz Master (With limits)", included: true },
      { text: "Keep Chat History", included: false },
      { text: "Smallest Context Models", included: false },
    ],
    buttonText: "Current Plan",
    buttonStyle: "bg-gray-900 hover:bg-gray-800",
    isPopular: false,
  },
  {
    name: "Learner",
    description: "Enhanced visibility for your tool",
    price: "15",
    period: "per month",
    tier: TIERS.LEARNER,
    features: [
      { text: "50 Audio Messages a Month", included: true },
      { text: "Access to Chat Bot", included: true },
      { text: "Access to Quiz Master", included: true },
      { text: "Access to Lesson Planner", included: true },
      { text: "Weekly Chat History", included: true },
      { text: "Normal Context Models", included: true },
    ],
    productId: process.env.NEXT_PUBLIC_POLAR_LEARNER_PRODUCT_ID,
    buttonText: "Upgrade Now",
    buttonStyle: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700",
    isPopular: true,
  },
  {
    name: "Boosted Learner",
    description: "The best we provide",
    price: "50",
    period: "per month",
    tier: TIERS.BOOSTED_LEARNER,
    features: [
      { text: "Unlimited Audio Messages a Month", included: true },
      { text: "Access to Chat Bot", included: true },
      { text: "Access to Quiz Master", included: true },
      { text: "Access to Lesson Planner", included: true },
      { text: "Advanced Stats Page", included: true },
      { text: "Chat History Never Deleted", included: true },
      { text: "Highest Context Models", included: true },
      { text: "Suggest new features", included: true },
    ],
    productId: process.env.NEXT_PUBLIC_POLAR_BOOSTED_PRODUCT_ID,
    buttonText: "Upgrade Now",
    buttonStyle: "bg-gray-900 hover:bg-gray-800",
    isPopular: false,
  },
];

const UserUpgrade = () => {
  const { data: session } = useSession();
  const [currentTier, setCurrentTier] = useState(TIERS.FREE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Initialize Polar checkout once at the component level
    if (!initialized.current) {
      PolarEmbedCheckout.init();
      initialized.current = true;
    }

    return () => {
      // Cleanup function
      if (initialized.current) {
        try {
          const modal = document.querySelector('[data-polar-checkout-modal]');
          if (modal) {
            modal.remove();
          }
        } catch (error) {
          console.error('Error cleaning up Polar checkout:', error);
        }
      }
    };
  }, []);

  const loadTier = async () => {
    try {
      const response = await fetch('/api/user/tier');
      if (!response.ok) {
        throw new Error('Failed to fetch user tier');
      }
      const data = await response.json();
      setCurrentTier(data.tier);
    } catch (error) {
      console.error('Error loading user tier:', error);
      setCurrentTier(TIERS.FREE);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTier();
  }, []);

  const handleUpgrade = async (productId) => {
    try {
      // Extract the product ID from the URL if it's a full URL
      const productIdMatch = productId.match(/polar_cl_[A-Za-z0-9]+/);
      const extractedProductId = productIdMatch ? productIdMatch[0] : productId;

      const response = await fetch(`/api/polar/checkout?productId=${extractedProductId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      if (!data.url) {
        throw new Error('No checkout URL received');
      }

      setCheckoutUrl(data.url);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error.message || 'Failed to create checkout session. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid gap-8 mb-16 lg:grid-cols-3 p-4 md:p-8 mt-12">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className="relative">
            {plan.isPopular && (
              <div className="absolute left-0 right-0 flex justify-center -top-4">
                <span className="flex items-center gap-1 px-4 py-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-indigo-600 to-violet-600">
                  <StarsIcon /> Most Popular
                </span>
              </div>
            )}
            <div
              className={`flex flex-col justify-between h-full bg-white rounded-lg ${
                plan.isPopular
                  ? "border-2 border-indigo-400 shadow-lg"
                  : "border border-gray-200 shadow-sm"
              }`}
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="ml-2 text-gray-600">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {feature.included ? (
                        <CheckIcon
                          className={
                            plan.isPopular ? "text-green-500" : "text-gray-600"
                          }
                        />
                      ) : (
                        <CrossIcon className="text-red-500" />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 border-t border-gray-200 rounded-b-lg bg-gray-50">
                {plan.tier === currentTier ? (
                  <button
                    disabled
                    className="block w-full px-4 py-2 font-medium text-center text-white bg-gray-400 rounded-lg cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <PurchaseLink
                    href={plan.productId}
                    className={`block w-full px-4 py-2 font-medium text-center text-white transition-colors rounded-lg ${plan.buttonStyle}`}
                    theme="light"
                  >
                    {plan.buttonText}
                    <ArrowIcon />
                  </PurchaseLink>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </MainLayout>
  );
};

export default UserUpgrade;
