import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RK6DWDIKhJZqCb1vxBCt85qt8MR2q2DuL63r4f2CL19NdIsfQgm0vWQZN2EASr2wXXYoPuAwTV7tVbfsLCgztMv00OCrqXvFw';

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Stripe configuration
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: STRIPE_PUBLISHABLE_KEY,
  CURRENCY: 'eur', // Euro for Ireland
  COUNTRY: 'IE', // Ireland
  
  // Payment method types
  PAYMENT_METHODS: [
    'card',
    'sepa_debit',
    'bancontact',
    'ideal'
  ],
  
  // Appearance customization
  APPEARANCE: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0f766e', // Teal color to match theme
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    },
    rules: {
      '.Input': {
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '16px'
      },
      '.Input:focus': {
        borderColor: '#0f766e',
        boxShadow: '0 0 0 2px rgba(15, 118, 110, 0.1)'
      }
    }
  }
};

// Helper function to create payment intent options
export const createPaymentIntentOptions = (amount, description = 'Medical Consultation Booking') => {
  return {
    amount: Math.round(amount * 100), // Convert to cents
    currency: STRIPE_CONFIG.CURRENCY,
    description: description,
    metadata: {
      source: 'Spectrum IRE Booking System',
      timestamp: new Date().toISOString()
    }
  };
};

// Helper function to format amount for display
export const formatAmount = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
