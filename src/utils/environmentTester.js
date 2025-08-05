// Environment Configuration Tester
// This utility helps test and verify the dynamic environment configuration system

import { 
  WEBHOOK_CONFIG, 
  getEnvironmentInfo, 
  logCurrentConfiguration, 
  setEnvironmentOverride 
} from '../config/webhooks';

/**
 * Test the current environment configuration
 */
export const testCurrentEnvironment = () => {
  console.group('🧪 Environment Configuration Test');
  
  // Log current configuration
  logCurrentConfiguration();
  
  // Get environment info
  const envInfo = getEnvironmentInfo();
  console.log('📊 Environment Info:', envInfo);
  
  // Test webhook URLs
  console.log('🔗 Webhook URLs:');
  console.log('  - Lookups:', WEBHOOK_CONFIG.LOOKUPS_WEBHOOK);
  console.log('  - Treatment Centres:', WEBHOOK_CONFIG.TREATMENT_CENTRES_WEBHOOK);
  console.log('  - Patient Registration:', WEBHOOK_CONFIG.PATIENT_REGISTRATION_WEBHOOK);
  console.log('  - Patient Info API:', WEBHOOK_CONFIG.PATIENT_INFO_API);
  
  console.groupEnd();
  
  return envInfo;
};

/**
 * Test environment switching (for development/testing purposes)
 */
export const testEnvironmentSwitching = () => {
  console.group('🔄 Environment Switching Test');
  
  // Test switching to production
  console.log('Testing switch to production...');
  const prodResult = setEnvironmentOverride('production');
  console.log('Production switch result:', prodResult);
  if (prodResult) {
    console.log('Production webhook URL:', WEBHOOK_CONFIG.LOOKUPS_WEBHOOK);
  }
  
  // Test switching to local
  console.log('Testing switch to local...');
  const localResult = setEnvironmentOverride('local');
  console.log('Local switch result:', localResult);
  if (localResult) {
    console.log('Local webhook URL:', WEBHOOK_CONFIG.LOOKUPS_WEBHOOK);
  }
  
  // Test invalid environment
  console.log('Testing invalid environment...');
  const invalidResult = setEnvironmentOverride('invalid');
  console.log('Invalid environment result:', invalidResult);
  
  console.groupEnd();
};

/**
 * Verify environment detection logic
 */
export const verifyEnvironmentDetection = () => {
  console.group('🎯 Environment Detection Verification');
  
  const currentOrigin = window.location.origin;
  const currentHostname = window.location.hostname;
  
  console.log('Current origin:', currentOrigin);
  console.log('Current hostname:', currentHostname);
  
  // Check if current environment matches expected
  const envInfo = getEnvironmentInfo();
  const expectedEnvironment = (
    currentHostname === 'localhost' ||
    currentHostname === '127.0.0.1' ||
    currentOrigin === 'https://openappointmentapplication.netlify.app'
  ) ? 'local' : 'production';
  
  console.log('Expected environment:', expectedEnvironment);
  console.log('Detected environment:', envInfo.current);
  console.log('Detection correct:', expectedEnvironment === envInfo.current);
  
  console.groupEnd();
  
  return {
    expected: expectedEnvironment,
    detected: envInfo.current,
    correct: expectedEnvironment === envInfo.current
  };
};

/**
 * Run all tests
 */
export const runAllEnvironmentTests = () => {
  console.group('🚀 Complete Environment Configuration Test Suite');
  
  const currentTest = testCurrentEnvironment();
  const detectionTest = verifyEnvironmentDetection();
  testEnvironmentSwitching();
  
  console.log('📋 Test Summary:');
  console.log('  - Current Environment:', currentTest.current);
  console.log('  - Detection Accuracy:', detectionTest.correct ? '✅ Correct' : '❌ Incorrect');
  console.log('  - Webhook URL:', currentTest.webhookUrl);
  console.log('  - API URL:', currentTest.apiUrl);
  
  console.groupEnd();
  
  return {
    currentEnvironment: currentTest,
    detectionAccuracy: detectionTest,
    testsPassed: detectionTest.correct
  };
};

// Make functions available globally for browser console testing
if (typeof window !== 'undefined') {
  window.environmentTester = {
    testCurrentEnvironment,
    testEnvironmentSwitching,
    verifyEnvironmentDetection,
    runAllEnvironmentTests
  };
  
  console.log('🔧 Environment Tester loaded! Use window.environmentTester.runAllEnvironmentTests() to test.');
}
