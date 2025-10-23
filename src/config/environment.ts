// Environment configuration
export const env = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
  API_V2_BASE_URL: process.env.REACT_APP_API_V2_BASE_URL || process.env.REACT_APP_API_BASE_URL?.replace('/v1', '/v2') || '',
  
  // Environment
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  IS_PRODUCTION: process.env.REACT_APP_ENVIRONMENT === 'production',
  IS_STAGING: process.env.REACT_APP_ENVIRONMENT === 'staging',
  IS_DEVELOPMENT: process.env.REACT_APP_ENVIRONMENT === 'development',
  IS_LOCAL: process.env.REACT_APP_ENVIRONMENT === 'local',
  
  // Security
  RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY || '',
  SESSION_TIMEOUT: parseInt(process.env.REACT_APP_SESSION_TIMEOUT || '900000'), // 15 minutes default
  
  // Feature Flags
  ENABLE_BIOMETRIC: process.env.REACT_APP_ENABLE_BIOMETRIC === 'true',
  ENABLE_QUANTUM: process.env.REACT_APP_ENABLE_QUANTUM === 'true',
  ENABLE_MULTI_CLOUD: process.env.REACT_APP_ENABLE_MULTI_CLOUD === 'true',
  ENABLE_FRAUD_DETECTION: process.env.REACT_APP_ENABLE_FRAUD_DETECTION !== 'false', // Default true
  ENABLE_BULK_OPERATIONS: process.env.REACT_APP_ENABLE_BULK_OPERATIONS !== 'false', // Default true
  
  // Application Info
  APP_NAME: process.env.REACT_APP_NAME || 'SabPaisa Tokenization Platform',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Monitoring
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ANALYTICS_KEY: process.env.REACT_APP_ANALYTICS_KEY || '',
  
  // Debug
  DEBUG_MODE: process.env.REACT_APP_DEBUG === 'true',
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'error',
};

// Validate required environment variables
export const validateEnvironment = () => {
  const required = ['REACT_APP_API_BASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    if (env.IS_PRODUCTION) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
};

// Get environment-specific configuration
export const getEnvironmentConfig = () => {
  switch (env.ENVIRONMENT) {
    case 'production':
      return {
        apiTimeout: 30000,
        retryAttempts: 3,
        enableCaching: true,
        cacheTimeout: 300000, // 5 minutes
      };
    case 'staging':
      return {
        apiTimeout: 20000,
        retryAttempts: 2,
        enableCaching: true,
        cacheTimeout: 180000, // 3 minutes
      };
    case 'development':
      return {
        apiTimeout: 15000,
        retryAttempts: 1,
        enableCaching: false,
        cacheTimeout: 0,
      };
    case 'local':
    default:
      return {
        apiTimeout: 10000,
        retryAttempts: 0,
        enableCaching: false,
        cacheTimeout: 0,
      };
  }
};

export default env;