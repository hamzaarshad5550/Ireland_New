# Dynamic Environment Configuration System

## Overview

The Spectrum IRE Booking application now features a dynamic environment-based configuration system that automatically determines the correct N8N webhook URLs and API endpoints based on the current runtime environment.

## How It Works

### Environment Detection

The system automatically detects the environment based on `window.location.origin`:

#### Local Environment
- `http://localhost:3000`
- `http://localhost:3001`
- `https://openappointmentapplication.netlify.app`

#### Production Environment (Default)
- All other URLs

### Automatic URL Configuration

Based on the detected environment, the system automatically configures:

#### Local Environment
- **N8N Webhook**: `https://local-n8n.vitonta.com/webhook/115d0f35-6f15-4b38-9697-a702343ceccd`
- **API Endpoint**: `https://ooh_web.vitonta.com/AppBooking/GetPatientInfoPreReqs`

#### Production Environment
- **N8N Webhook**: `https://demo-ooh-n8n.vitonta.com/webhook/115d0f35-6f15-4b38-9697-a702343ceccd`
- **API Endpoint**: `https://ooh_web.vitonta.com/AppBooking/GetPatientInfoPreReqs`

## Configuration Files

### `src/config/webhooks.js`

This is the centralized configuration file that handles all environment detection and URL management:

```javascript
// Environment detection
const detectEnvironment = () => {
  const origin = window.location.origin;
  const hostname = window.location.hostname;
  
  const isLocal = (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    origin === 'https://openappointmentapplication.netlify.app'
  );
  
  return isLocal ? 'local' : 'production';
};

// Dynamic configuration
export const WEBHOOK_CONFIG = createDynamicWebhookConfig();
```

### Key Features

1. **Automatic Detection**: No manual environment variable configuration needed
2. **Centralized Management**: All webhook URLs managed in one place
3. **Future Extensible**: Easy to add staging, dev, or preview environments
4. **Enhanced Logging**: Detailed logging for debugging and monitoring
5. **Fallback Support**: Defaults to production if environment detection fails

## Usage

### In Components

```javascript
import { WEBHOOK_CONFIG, makeWebhookRequest, createWebhookRequestBody } from './config/webhooks';

// Use the dynamic webhook URL
const response = await makeWebhookRequest(
  WEBHOOK_CONFIG.LOOKUPS_WEBHOOK, 
  requestBody
);
```

### Environment Information

```javascript
import { getEnvironmentInfo, logCurrentConfiguration } from './config/webhooks';

// Get current environment details
const envInfo = getEnvironmentInfo();
console.log('Current environment:', envInfo.current);
console.log('Webhook URL:', envInfo.webhookUrl);

// Log full configuration
logCurrentConfiguration();
```

## Migration from Previous System

### Before (Manual .env Configuration)
```env
REACT_APP_LOOKUPS_WEBHOOK=https://demo-ooh-n8n.vitonta.com/webhook/...
REACT_APP_TREATMENT_CENTRES_WEBHOOK=https://demo-ooh-n8n.vitonta.com/webhook/...
REACT_APP_PATIENT_REGISTRATION_WEBHOOK=https://local-n8n.vitonta.com/webhook/...
```

### After (Automatic Configuration)
- No environment variables needed for N8N endpoints
- Automatic detection based on URL
- Centralized configuration in `webhooks.js`

## Adding New Environments

To add a new environment (e.g., staging):

1. Update `ENVIRONMENT_CONFIG` in `webhooks.js`:

```javascript
const ENVIRONMENT_CONFIG = {
  local: { /* existing config */ },
  production: { /* existing config */ },
  staging: {
    N8N_BASE_URL: 'https://staging-n8n.vitonta.com',
    WEBHOOK_PATH: '/webhook/115d0f35-6f15-4b38-9697-a702343ceccd',
    API_BASE_URL: 'https://staging-ooh_web.vitonta.com'
  }
};
```

2. Update `detectEnvironment()` function to include staging detection logic.

## Benefits

1. **Simplified Deployment**: No need to manage environment-specific .env files
2. **Reduced Errors**: Eliminates manual URL configuration mistakes
3. **Better Debugging**: Enhanced logging shows which environment and URLs are being used
4. **Maintainability**: Single source of truth for all webhook configurations
5. **Scalability**: Easy to add new environments without code changes

## Debugging

The system provides comprehensive logging:

- Environment detection logs
- Webhook request/response logs
- Configuration details on app startup
- Error handling with environment context

Check the browser console for detailed logs when the application starts.
