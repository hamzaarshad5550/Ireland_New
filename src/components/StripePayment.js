import React, { useState, useRef, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { WEBHOOK_CONFIG, makeWebhookRequest } from '../config/webhooks';

const StripePayment = ({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError, 
  isProcessing, 
  setIsProcessing,
  bookingData,
  timeRemaining,
  isTimerActive,
  startTimer,
  formatTime,
  showTimer
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  // Check if timer expired
  const isTimerExpired = timeRemaining <= 0 && showTimer;

  // Start timer when user first interacts with card field
  const handleCardFocus = () => {
    if (!isTimerActive && !isTimerExpired) {
      startTimer();
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    
    // Start timer on first input
    if (!isTimerActive && !isTimerExpired) {
      startTimer();
    }
    
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: 'system-ui, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
        iconColor: '#0f766e',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || isTimerExpired) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${bookingData.firstName} ${bookingData.lastName}`,
          email: bookingData.email,
          phone: bookingData.phone,
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Simulate payment success for now
      // In production, you would create a payment intent on your backend
      console.log('Payment method created:', paymentMethod);
      
      onPaymentSuccess({
        paymentMethod,
        amount,
        currency: 'eur'
      });

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      onPaymentError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      {isTimerExpired && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">Payment session expired. Please choose another time slot.</span>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-4">
        <CreditCard className="h-5 w-5 text-teal-600" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
        <Lock className="h-4 w-4 text-gray-400" />
      </div>

      <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-teal-800">Consultation Fee:</span>
          <span className="text-lg font-bold text-teal-900">{formatAmount(amount)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className={`p-3 border rounded-lg ${isTimerExpired 
            ? 'border-red-300 bg-red-50 opacity-50' 
            : 'border-gray-300 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500'}`}>
            <CardElement 
              options={cardElementOptions}
              onChange={handleCardChange}
              onFocus={handleCardFocus}
              disabled={isTimerExpired}
            />
          </div>
          {/* {isTimerExpired && (
            <p className="mt-1 text-sm text-red-600">
              Payment time expired. Please refresh to try again.
            </p>
          )} */}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-1">Payment Failed</h4>
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  If you continue to experience issues, please try a different payment method or contact your bank.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || !cardComplete || isProcessing || isTimerExpired}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
            !stripe || !cardComplete || isProcessing || isTimerExpired
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing Payment...</span>
            </>
          ) : isTimerExpired ? (
            <>
              <Lock className="h-4 w-4" />
              <span>Session Expired</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>Pay {formatAmount(amount)}</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
        <Lock className="h-3 w-3" />
        <span>Secured by Stripe • Your payment information is encrypted</span>
      </div>
    </div>
  );
};

export default StripePayment;







































