import React, { useState } from 'react';
import LandingPage from './LandingPage';
import CareHQBooking from '../App'; // Import the main booking app

export default function AppRouter() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleOpenAppointment = () => {
    setCurrentPage('booking');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  if (currentPage === 'landing') {
    return <LandingPage onOpenAppointment={handleOpenAppointment} />;
  }

  if (currentPage === 'booking') {
    return (
      <div>
        {/* Back to Landing Button - HIDDEN */}
        {/* <div className="fixed top-4 left-4 z-50">
          <button
            onClick={handleBackToLanding}
            className="bg-white shadow-lg hover:shadow-xl px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:text-blue-600 transition-all duration-300 flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div> */}
        <CareHQBooking />
      </div>
    );
  }

  return null;
}
