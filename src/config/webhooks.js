// Centralized webhook configuration
export const WEBHOOK_CONFIG = {
  // N8N Webhook URLs
  LOOKUPS_WEBHOOK: 'https://local-n8n.vitonta.com/webhook/115d0f35-6f15-4b38-9697-a702343ceccd',
  
  // Webhook types
  WORKFLOW_TYPES: {
    LOOKUPS: 'lookups',
    BOOKING: 'booking',
    PATIENT_DATA: 'patient_data'
  },
  
  // Default headers for webhook requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 10000
};

// Helper function to create webhook request body
export const createWebhookRequestBody = (workflowType, additionalData = {}) => {
  return {
    workflowtype: workflowType,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    source: 'Spectrum IRE Booking System',
    ...additionalData
  };
};

// Helper function to make webhook requests
export const makeWebhookRequest = async (url, body, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...WEBHOOK_CONFIG.DEFAULT_HEADERS,
        ...options.headers
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      ...options
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
