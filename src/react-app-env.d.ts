/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly REACT_APP_API_BASE_URL: string;
    readonly REACT_APP_RECAPTCHA_SITE_KEY: string;
    readonly REACT_APP_SESSION_TIMEOUT: string;
    readonly REACT_APP_ENVIRONMENT: string;
  }
}