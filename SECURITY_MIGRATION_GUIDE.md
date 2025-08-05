# Google Maps API Security Migration Guide

## 🚨 Current Security Issue

The Google Maps API key is currently exposed in the frontend code, making it visible in:
- Browser developer console
- Network requests
- Source code inspection
- Client-side JavaScript bundles

**API Key Location:** `src/App.js` line 163
**Risk Level:** HIGH - API key can be extracted and misused

## 🔒 Secure Implementation Solution

### Step 1: Backend Proxy Setup

Create a backend service to proxy Google Maps API requests:

```javascript
// backend/server.js (Node.js/Express example)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Store API key securely in environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Reverse geocoding endpoint
app.post('/api/geocoding/reverse', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    // Validate input
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

// Forward geocoding endpoint
app.post('/api/geocoding/forward', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address required' });
    }
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=country:IE&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Forward geocoding error:', error);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

app.listen(3001, () => {
  console.log('Secure geocoding proxy running on port 3001');
});
```

### Step 2: Environment Configuration

Create `.env` file in backend:
```bash
GOOGLE_MAPS_API_KEY=AIzaSyBa1jwKjq4Q4yhO6uVYJHNFet_qEHaINUc
PORT=3001
```

Create `.env` file in frontend:
```bash
REACT_APP_BACKEND_URL=http://localhost:3001
```

### Step 3: Frontend Migration

Replace direct API calls in `src/App.js`:

#### Current Implementation (INSECURE):
```javascript
// Line 218-222: Current location reverse geocoding
const response = await fetch(
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
);

// Line 1912-1915: EirCode lookup
const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(sanitizedEircode)}&components=country:IE&key=${GOOGLE_MAPS_API_KEY}`;
```

#### Secure Implementation:
```javascript
// Import the secure service
import { reverseGeocode, forwardGeocode } from './services/geocodingService';

// Replace line 218-222:
const data = await reverseGeocode(latitude, longitude);

// Replace line 1912-1915:
const data = await forwardGeocode(sanitizedEircode);
```

### Step 4: Remove API Key from Frontend

1. Delete lines 163-164 in `src/App.js`:
```javascript
// DELETE THESE LINES:
const GOOGLE_MAPS_API_KEY = 'AIzaSyBa1jwKjq4Q4yhO6uVYJHNFet_qEHaINUc';
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?v=3.47&libraries=places&key=${GOOGLE_MAPS_API_KEY}`;
```

2. Update import statement:
```javascript
// ADD THIS LINE:
import { reverseGeocode, forwardGeocode, parseGeocodingResult } from './services/geocodingService';
```

## 🛡️ Security Benefits

✅ **API Key Protection**: Key never exposed to client-side code
✅ **Rate Limiting**: Backend can implement request throttling
✅ **Request Validation**: Server-side input validation and sanitization
✅ **Usage Monitoring**: Track and log API usage server-side
✅ **Access Control**: Implement authentication/authorization if needed
✅ **Error Handling**: Centralized error management and logging

## 📋 Migration Checklist

- [ ] Set up backend proxy server
- [ ] Configure environment variables
- [ ] Test backend endpoints with Postman/curl
- [ ] Update frontend to use geocoding service
- [ ] Remove API key from frontend code
- [ ] Test current location functionality
- [ ] Test EirCode lookup functionality
- [ ] Verify API key is not visible in browser console
- [ ] Deploy backend to production environment
- [ ] Update frontend environment variables for production

## 🧪 Testing Commands

Test backend endpoints:
```bash
# Test reverse geocoding
curl -X POST http://localhost:3001/api/geocoding/reverse \
  -H "Content-Type: application/json" \
  -d '{"latitude": 53.3498, "longitude": -6.2603}'

# Test forward geocoding
curl -X POST http://localhost:3001/api/geocoding/forward \
  -H "Content-Type: application/json" \
  -d '{"address": "D02 XY45"}'
```

## ⚠️ Important Notes

1. **Immediate Action Required**: The current implementation exposes the API key publicly
2. **Production Deployment**: Ensure backend is deployed before frontend migration
3. **API Key Rotation**: Consider rotating the Google Maps API key after migration
4. **CORS Configuration**: Ensure backend CORS settings allow frontend domain
5. **Error Handling**: Implement proper fallback mechanisms for API failures

## 📞 Support

If you need assistance with the migration:
1. Review the `src/services/geocodingService.js` file for implementation details
2. Test the backend proxy thoroughly before frontend migration
3. Monitor API usage and costs after implementation
