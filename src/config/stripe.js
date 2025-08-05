import { loadStripe } from '@stripe/stripe-js';

// Only use publishable key in frontend - NEVER the secret key
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe with only the publishable key
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Stripe configuration - FRONTEND ONLY
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: STRIPE_PUBLISHABLE_KEY,
  // SECRET_KEY removed - should NEVER be in frontend
  CURRENCY: 'eur', // Euro for Ireland
  COUNTRY: 'IE', // Ireland
  
  // Payment method types
  PAYMENT_METHODS: [
    'card',
    'sepa_debit',
    'bancontact',
    'ideal'
  ],
  
  // Stripe Elements appearance
  APPEARANCE: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0f766e',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
};

// Helper function to format amount for display (frontend only)
export const formatAmount = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Remove createPaymentIntentOptions - this should be done on backend/webhook only

