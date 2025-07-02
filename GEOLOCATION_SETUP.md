# Geolocation Setup Guide

## Current Location Feature

The application includes a "Current Location" button (📍) next to the Eircode input field that allows users to automatically populate their address using their device's GPS location.

## How it Works

1. **Click the Location Button**: Users click the map pin icon next to the Eircode field
2. **Permission Request**: Browser requests location permission from the user
3. **GPS Coordinates**: Device provides latitude and longitude coordinates
4. **Address Lookup**: Coordinates are converted to a readable address
5. **Auto-Fill**: Current Location fields are automatically populated

## Setup for Full Functionality

### Option 1: With Google Maps API (Recommended)

For precise address lookup, configure a Google Maps API key:

1. **Get API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the "Geocoding API"
   - Create credentials (API Key)

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
   
3. **Add API Key**:
   Edit `.env` file and replace `your_google_maps_api_key_here` with your actual API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key_here
   ```

4. **Restart Application**:
   ```bash
   npm start
   ```

### Option 2: Without API Key (Fallback Mode)

The application works without an API key but with limited functionality:
- GPS coordinates are detected
- Approximate location is shown
- Address fields are populated with generic location data

## Testing the Feature

1. **Open the application** in a modern browser
2. **Navigate to the booking form** (Tab 1)
3. **Click the map pin icon** next to the Eircode field
4. **Allow location access** when prompted by the browser
5. **Wait for loading** (spinner will show)
6. **Check Current Location fields** - they should auto-populate

## Troubleshooting

### Common Issues:

1. **"Location access denied"**
   - User denied permission
   - Check browser location settings
   - Try refreshing and allowing permission

2. **"Location unavailable"**
   - GPS/location services disabled on device
   - Poor GPS signal
   - Try moving to a location with better signal

3. **"Location request timed out"**
   - Slow GPS response
   - Try clicking the button again
   - Check internet connection

4. **"Address lookup failed"**
   - No Google Maps API key configured
   - API key invalid or quota exceeded
   - Will fallback to showing GPS coordinates

### Browser Compatibility:

- ✅ Chrome, Firefox, Safari, Edge (modern versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ❌ Internet Explorer (not supported)

### Security Notes:

- Location access only works on HTTPS or localhost
- Users must explicitly grant permission
- Location data is not stored or transmitted
- API key should be restricted to your domain in production

## Development Notes

The geolocation function includes:
- Comprehensive error handling
- Loading states and user feedback
- Fallback functionality without API key
- Console logging for debugging
- Timeout and accuracy settings optimized for web use
