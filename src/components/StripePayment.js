import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const StripePayment = ({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError, 
  isProcessing, 
  setIsProcessing,
  bookingData 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
        billing_details: {
          name: bookingData.fullName || `${bookingData.firstName} ${bookingData.lastName}`,
          email: bookingData.email,
          phone: bookingData.phoneNumber,
        },
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setIsProcessing(false);
        onPaymentError(paymentMethodError.message);
        return;
      }

      // In a real implementation, you would send the payment method to your backend
      // to create a payment intent and confirm the payment
      
      // For demo purposes, we'll simulate a successful payment
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentSuccess({
          paymentMethodId: paymentMethod.id,
          amount: amount,
          currency: 'eur'
        });
      }, 2000);

    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
      onPaymentError(err.message);
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
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
    hidePostalCode: false,
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
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
          <div className="p-3 border border-gray-300 rounded-lg focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
            <CardElement 
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || !cardComplete || isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
            !stripe || !cardComplete || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing Payment...</span>
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
