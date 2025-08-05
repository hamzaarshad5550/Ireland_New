/**
 * Geocoding Service - Secure Google Maps API Integration
 * 
 * This service provides a secure way to interact with Google Maps Geocoding API
 * by routing requests through a backend proxy to hide the API key from the frontend.
 * 
 * SECURITY IMPLEMENTATION NOTES:
 * =============================
 * 
 * 1. BACKEND PROXY REQUIRED:
 *    - Create a backend endpoint (e.g., /api/geocoding) that handles Google Maps API calls
 *    - Store the Google Maps API key securely on the server (environment variables)
 *    - Implement rate limiting and request validation on the backend
 * 
 * 2. FRONTEND CHANGES:
 *    - Replace direct Google Maps API calls with calls to your backend proxy
 *    - Remove the API key from frontend code entirely
 *    - Add proper error handling for backend communication
 * 
 * 3. BACKEND IMPLEMENTATION EXAMPLE (Node.js/Express):
 *    ```javascript
 *    // backend/routes/geocoding.js
 *    const express = require('express');
 *    const router = express.Router();
 *    
 *    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY; // From environment
 *    
 *    router.post('/reverse', async (req, res) => {
 *      try {
 *        const { latitude, longitude } = req.body;
 *        
 *        // Validate input
 *        if (!latitude || !longitude) {
 *          return res.status(400).json({ error: 'Latitude and longitude required' });
 *        }
 *        
 *        const response = await fetch(
 *          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
 *        );
 *        
 *        const data = await response.json();
 *        res.json(data);
 *      } catch (error) {
 *        res.status(500).json({ error: 'Geocoding failed' });
 *      }
 *    });
 *    
 *    router.post('/forward', async (req, res) => {
 *      try {
 *        const { address } = req.body;
 *        
 *        if (!address) {
 *          return res.status(400).json({ error: 'Address required' });
 *        }
 *        
 *        const response = await fetch(
 *          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=country:IE&key=${GOOGLE_MAPS_API_KEY}`
 *        );
 *        
 *        const data = await response.json();
 *        res.json(data);
 *      } catch (error) {
 *        res.status(500).json({ error: 'Geocoding failed' });
 *      }
 *    });
 *    
 *    module.exports = router;
 *    ```
 */

// Configuration for backend geocoding service
const GEOCODING_CONFIG = {
  BASE_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001',
  ENDPOINTS: {
    REVERSE_GEOCODING: '/api/geocoding/reverse',
    FORWARD_GEOCODING: '/api/geocoding/forward'
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

/**
 * Reverse Geocoding - Convert coordinates to address
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} - Geocoding response
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    console.log('🔒 Secure reverse geocoding request:', { latitude, longitude });
    
    const response = await fetch(`${GEOCODING_CONFIG.BASE_URL}${GEOCODING_CONFIG.ENDPOINTS.REVERSE_GEOCODING}`, {
      method: 'POST',
      headers: GEOCODING_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({ latitude, longitude })
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Secure reverse geocoding response received');
    return data;
    
  } catch (error) {
    console.error('❌ Secure reverse geocoding error:', error);
    throw error;
  }
};

/**
 * Forward Geocoding - Convert address to coordinates
 * @param {string} address - Address or EirCode to geocode
 * @returns {Promise<Object>} - Geocoding response
 */
export const forwardGeocode = async (address) => {
  try {
    console.log('🔒 Secure forward geocoding request:', { address });
    
    const response = await fetch(`${GEOCODING_CONFIG.BASE_URL}${GEOCODING_CONFIG.ENDPOINTS.FORWARD_GEOCODING}`, {
      method: 'POST',
      headers: GEOCODING_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({ address })
    });

    if (!response.ok) {
      throw new Error(`Forward geocoding failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Secure forward geocoding response received');
    return data;
    
  } catch (error) {
    console.error('❌ Secure forward geocoding error:', error);
    throw error;
  }
};

/**
 * Parse Google Maps geocoding response to extract address components
 * @param {Object} geocodingResult - Google Maps geocoding result
 * @returns {Object} - Parsed address components
 */
export const parseGeocodingResult = (geocodingResult) => {
  if (!geocodingResult || !geocodingResult.address_components) {
    return {};
  }

  const components = geocodingResult.address_components;
  const addressData = {
    building: '',
    street: '',
    area: '',
    city: '',
    country: 'Ireland',
    eircode: ''
  };

  components.forEach(component => {
    const types = component.types;
    
    if (types.includes('premise') || types.includes('subpremise')) {
      addressData.building = component.long_name;
    } else if (types.includes('route')) {
      addressData.street = component.long_name;
    } else if (types.includes('sublocality') || types.includes('neighborhood')) {
      addressData.area = component.long_name;
    } else if (types.includes('locality')) {
      addressData.city = component.long_name;
    } else if (types.includes('country')) {
      addressData.country = component.long_name;
    } else if (types.includes('postal_code')) {
      addressData.eircode = component.long_name;
    }
  });

  return addressData;
};

/**
 * MIGRATION INSTRUCTIONS:
 * ======================
 * 
 * To implement secure geocoding:
 * 
 * 1. Set up backend proxy endpoints as shown in the comments above
 * 2. Replace direct Google Maps API calls in App.js with these service functions:
 *    - Replace current location geocoding with: reverseGeocode(latitude, longitude)
 *    - Replace EirCode lookup with: forwardGeocode(eircode)
 * 3. Remove GOOGLE_MAPS_API_KEY from frontend code
 * 4. Set REACT_APP_BACKEND_URL environment variable
 * 5. Test the integration thoroughly
 * 
 * SECURITY BENEFITS:
 * ==================
 * - API key is never exposed in frontend code or browser console
 * - Backend can implement rate limiting and request validation
 * - API usage can be monitored and controlled server-side
 * - Reduces risk of API key theft and abuse
 */
