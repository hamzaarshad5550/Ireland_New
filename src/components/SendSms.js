import React, { useState } from 'react';
import axios from 'axios';

// Phone number validation for international format
const validatePhoneNumber = (phone) => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check if it starts with + and has 10-15 digits
  const phoneRegex = /^\+[1-9]\d{9,14}$/;
  return phoneRegex.test(cleaned);
};

// Character counter component
const CharacterCounter = ({ current, max, className = "" }) => {
  const isNearLimit = current > max * 0.8;
  const isOverLimit = current > max;
  
  return (
    <div className={`text-xs ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'} ${className}`}>
      {current}/{max} characters
    </div>
  );
};

export default function SendSms({
  currentTheme = 'blue',
  onSuccess,
  onError,
  className = "",
  apiEndpoint = 'https://your-backend.com/api/sms'
}) {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Simple theme configuration
  const getThemeClasses = (themeName) => {
    const themeMap = {
      blue: {
        primaryBg: 'bg-blue-600',
        primaryText: 'text-white',
        primarySolid: 'bg-blue-600',
        primaryHover: 'hover:bg-blue-700'
      },
      orange: {
        primaryBg: 'bg-orange-600',
        primaryText: 'text-white',
        primarySolid: 'bg-orange-600',
        primaryHover: 'hover:bg-orange-700'
      },
      emerald: {
        primaryBg: 'bg-emerald-600',
        primaryText: 'text-white',
        primarySolid: 'bg-emerald-600',
        primaryHover: 'hover:bg-emerald-700'
      },
      purple: {
        primaryBg: 'bg-purple-600',
        primaryText: 'text-white',
        primarySolid: 'bg-purple-600',
        primaryHover: 'hover:bg-purple-700'
      },
      teal: {
        primaryBg: 'bg-teal-600',
        primaryText: 'text-white',
        primarySolid: 'bg-teal-600',
        primaryHover: 'hover:bg-teal-700'
      }
    };
    return themeMap[themeName] || themeMap.blue;
  };

  const theme = getThemeClasses(currentTheme);
  const MAX_MESSAGE_LENGTH = 160; // Standard SMS length

  // Get theme focus color for consistent styling
  const getThemeFocusColor = () => {
    const colorMap = {
      blue: 'blue',
      orange: 'orange',
      emerald: 'emerald',
      purple: 'purple',
      pink: 'pink',
      indigo: 'indigo',
      teal: 'teal',
      red: 'red'
    };
    return colorMap[currentTheme] || 'blue';
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!to.trim()) {
      newErrors.to = 'Phone number is required';
    } else if (!validatePhoneNumber(to)) {
      newErrors.to = 'Please enter a valid international phone number (e.g., +353871234567)';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle phone number input formatting
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Auto-add + if user starts typing a number
    if (value.length === 1 && /^\d$/.test(value)) {
      value = '+' + value;
    }
    
    setTo(value);
    
    // Clear error when user starts typing
    if (errors.to) {
      setErrors(prev => ({ ...prev, to: '' }));
    }
  };

  // Handle message input
  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Clear error when user starts typing
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: '' }));
    }
  };

  // Send SMS
  const sendSms = async () => {
    // Clear previous messages
    setSuccessMessage('');
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(apiEndpoint, {
        to: to.trim(),
        message: message.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      const successMsg = `SMS sent successfully! ${response.data.sid ? `SID: ${response.data.sid}` : ''}`;
      setSuccessMessage(successMsg);
      
      // Clear form on success
      setTo('');
      setMessage('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }

    } catch (err) {
      console.error('SMS sending error:', err);
      
      let errorMessage = 'Failed to send SMS. Please try again.';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setErrors({ general: errorMessage });
      
      // Call error callback if provided
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendSms();
  };

  return (
    <div className={`w-full max-w-md mx-auto shadow-lg bg-white rounded-lg overflow-hidden ${className}`}>
      <div className={`${theme.primaryBg} ${theme.primaryText} p-4`}>
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Send SMS</span>
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number Input */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+353871234567"
              value={to}
              onChange={handlePhoneChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 rounded-md border bg-white placeholder:text-gray-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-${getThemeFocusColor()}-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.to ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.to && (
              <p className="text-red-600 text-xs mt-1">{errors.to}</p>
            )}
            <p className="text-xs text-gray-500">Include country code (e.g., +353 for Ireland)</p>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <CharacterCounter current={message.length} max={MAX_MESSAGE_LENGTH} />
            </div>
            <textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={handleMessageChange}
              disabled={isLoading}
              rows={4}
              className={`w-full px-3 py-2 rounded-md border bg-white placeholder:text-gray-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-${getThemeFocusColor()}-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.message && (
              <p className="text-red-600 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !to.trim() || !message.trim()}
            className={`w-full ${theme.primarySolid} ${theme.primaryHover} text-white py-2 px-4 rounded-md font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send SMS</span>
              </>
            )}
          </button>
        </form>

        {/* Info Text */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Standard SMS rates may apply. Message delivery depends on carrier availability.
        </div>
      </div>
    </div>
  );
}
