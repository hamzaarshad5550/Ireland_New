import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyNoticeProps {
  title?: string;
  message?: string;
  emergencyNumber?: string;
  urgentNumber?: string;
  onClose?: () => void;
  className?: string;
}

const EmergencyNotice: React.FC<EmergencyNoticeProps> = ({
  title = "Emergency Notice",
  message = "If you are experiencing a medical emergency, please call",
  emergencyNumber = "999",
  urgentNumber = "0818 123 456",
  onClose,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    // Call onClose after animation completes
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300); // Match the exit animation duration
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-5 right-4 z-40 w-auto mx-2 sm:mx-0 animate-slide-up animate-delay-2 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 shadow-lg ${className}`}
        >
          <div className="flex items-start justify-between space-x-2 sm:space-x-3">
            <div className="flex-1 pr-1 sm:pr-2 text-center">
              <h3 className="font-semibold text-green-700 mb-1 sm:mb-2 text-xs sm:text-sm text-center">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 mb-1 text-center leading-tight">
                {message} <span className="font-bold text-red-600">{emergencyNumber}</span> immediately.
              </p>
              <p className="text-xs sm:text-sm text-gray-700 text-center leading-tight">
                If your reason for contacting us is urgent, please call{' '}
                <a
                  href={`tel:${urgentNumber}`}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {urgentNumber}
                </a>.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-blue-100 transition-colors duration-200 group flex-shrink-0"
              aria-label="Close emergency notice"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover:text-blue-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyNotice;
