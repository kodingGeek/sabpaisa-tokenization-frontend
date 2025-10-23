# Frontend Multi-Environment Configuration Guide

## Overview

The SabPaisa Tokenization Frontend supports multiple environments with dedicated configuration files:
- **local** - Local development connecting to local backend
- **development** - AWS development environment
- **staging** - Pre-production testing environment
- **production** - Live production environment

## Environment Files

### File Structure
```
frontend/
├── .env                    # Default/fallback configuration
├── .env.local             # Local development
├── .env.development       # Development environment
├── .env.staging          # Staging environment
├── .env.production       # Production environment
└── .env.example          # Template with all possible variables
```

### Environment Loading Priority

React Scripts loads environment files in this order:
1. `.env.[NODE_ENV].local` (e.g., `.env.production.local`)
2. `.env.[NODE_ENV]` (e.g., `.env.production`)
3. `.env.local` (ignored in production)
4. `.env`

## Environment Profiles

### 1. Local Development (`.env.local`)
- **Backend**: `http://localhost:8082`
- **Purpose**: Development with local backend
- **Features**:
  - All debug tools enabled
  - Mock ReCAPTCHA for easier testing
  - Redux DevTools enabled
  - Source maps generated
  - Hot reload enabled

**To run locally:**
```bash
npm run start:local
# or
npm run build:local
```

### 2. Development Environment (`.env.development`)
- **Backend**: AWS ALB endpoint (dev)
- **Purpose**: Integration testing
- **Features**:
  - Real services integration
  - Sentry error tracking
  - Analytics enabled
  - Debug mode on
  - Source maps enabled

**To run for development:**
```bash
npm run start:dev
# or
npm run build:dev
```

### 3. Staging Environment (`.env.staging`)
- **Backend**: AWS ALB endpoint (stage)
- **Purpose**: Pre-production testing
- **Features**:
  - Production-like configuration
  - All features enabled
  - Performance monitoring
  - Test mode indicators
  - No source maps

**To run for staging:**
```bash
npm run start:stage
# or
npm run build:stage
```

### 4. Production Environment (`.env.production`)
- **Backend**: Production ALB/Domain
- **Purpose**: Live production
- **Features**:
  - Optimized build
  - Strict security
  - Minimal logging
  - All debugging disabled
  - CSP enforced

**To run for production:**
```bash
npm run build:prod
```

## Key Environment Variables

### API Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | `https://api.sabpaisa.com/v1` |
| `REACT_APP_API_TIMEOUT` | API request timeout (ms) | `30000` |
| `REACT_APP_WEBSOCKET_URL` | WebSocket endpoint | `wss://api.sabpaisa.com/ws` |

### Security Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_RECAPTCHA_SITE_KEY` | Google ReCAPTCHA site key | Required in prod |
| `REACT_APP_SESSION_TIMEOUT` | Session timeout (ms) | `900000` |
| `REACT_APP_MFA_TIMEOUT` | MFA code timeout (ms) | `300000` |

### Feature Flags
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_ENABLE_MFA` | Multi-factor authentication | `true` |
| `REACT_APP_ENABLE_BIOMETRIC` | Biometric authentication | `true` |
| `REACT_APP_ENABLE_BULK_OPERATIONS` | Bulk token operations | `true` |
| `REACT_APP_ENABLE_FRAUD_DETECTION` | Fraud detection features | `true` |

### Monitoring
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_SENTRY_DSN` | Sentry error tracking | Production |
| `REACT_APP_ANALYTICS_ID` | Google Analytics ID | Production |
| `REACT_APP_LOG_LEVEL` | Logging level | No |

## Build Scripts

### Development Scripts
```bash
# Start development server with specific environment
npm run start:local    # Local development
npm run start:dev      # Development environment
npm run start:stage    # Staging environment
npm run start:prod     # Production environment (testing only)

# Build for specific environment
npm run build:local    # Build with local config
npm run build:dev      # Build for development
npm run build:stage    # Build for staging
npm run build:prod     # Build for production
```

### Utility Scripts
```bash
# Code quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting

# Testing
npm test              # Run tests in watch mode
npm run test:ci       # Run tests for CI/CD

# Analysis
npm run analyze       # Analyze bundle size
npm run env:check     # Verify environment setup
npm run serve:build   # Serve production build locally
```

## Docker Configuration

### Building for Different Environments

```bash
# Local
docker build \
  --build-arg NODE_ENV=development \
  --build-arg REACT_APP_API_BASE_URL=http://localhost:8082/api/v1 \
  -t sabpaisa/frontend:local .

# Development
docker build \
  --build-arg NODE_ENV=development \
  --build-arg REACT_APP_API_BASE_URL=https://dev-api.sabpaisa.com/v1 \
  -t sabpaisa/frontend:dev .

# Staging
docker build \
  --build-arg NODE_ENV=production \
  --build-arg REACT_APP_API_BASE_URL=https://stage-api.sabpaisa.com/v1 \
  -t sabpaisa/frontend:stage .

# Production
docker build \
  --build-arg NODE_ENV=production \
  --build-arg REACT_APP_API_BASE_URL=https://api.sabpaisa.com/v1 \
  -t sabpaisa/frontend:prod .
```

## CI/CD Integration

The GitHub Actions pipelines automatically handle environment-specific builds:

```yaml
# Example: Building for production
- name: Build Frontend
  env:
    REACT_APP_API_BASE_URL: ${{ secrets.PROD_API_URL }}
    RECAPTCHA_SITE_KEY_PROD: ${{ secrets.RECAPTCHA_SITE_KEY }}
    SENTRY_DSN_PROD: ${{ secrets.SENTRY_DSN }}
  run: |
    npm ci
    npm run build:prod
```

## Environment Variable Validation

Create a script to validate required environment variables:

```javascript
// scripts/check-env.js
const requiredEnvVars = {
  production: [
    'REACT_APP_API_BASE_URL',
    'REACT_APP_RECAPTCHA_SITE_KEY',
    'REACT_APP_SENTRY_DSN',
    'REACT_APP_ANALYTICS_ID'
  ],
  staging: [
    'REACT_APP_API_BASE_URL',
    'REACT_APP_RECAPTCHA_SITE_KEY'
  ],
  development: [
    'REACT_APP_API_BASE_URL'
  ]
};

// Check and report missing variables
```

Run validation:
```bash
npm run env:check
```

## Security Best Practices

1. **Never commit sensitive values** in environment files
2. **Use environment variables** in CI/CD for secrets
3. **Different API keys** per environment
4. **Validate environment** before build
5. **CSP headers** in production
6. **Disable debug tools** in production

## Common Issues and Solutions

### Environment Variables Not Loading
```bash
# Clear cache and rebuild
rm -rf node_modules/.cache
npm run build:[environment]
```

### Wrong API Endpoint
```bash
# Verify loaded configuration
console.log('API URL:', process.env.REACT_APP_API_BASE_URL);
```

### Build Failing
```bash
# Check for TypeScript errors
npm run lint
# Install dependencies
npm ci
```

## Local Development Tips

1. **Use `.env.local`** for personal overrides (git-ignored)
2. **Mock external services** when needed
3. **Enable all features** for testing
4. **Use debug tools** liberally

## Production Deployment Checklist

- [ ] All environment variables set in CI/CD
- [ ] Source maps disabled (`GENERATE_SOURCEMAP=false`)
- [ ] Debug tools disabled
- [ ] API endpoints verified
- [ ] Security headers configured
- [ ] Analytics and monitoring enabled
- [ ] Error boundaries configured
- [ ] CSP policy active

## Environment-Specific Features

### Local Only
- Redux DevTools
- Debug logging
- Mock services
- Extended timeouts

### Development/Staging
- Sentry error tracking
- Performance monitoring
- Test banners
- Extended logging

### Production Only
- Strict CSP
- Minimal logging
- Optimized builds
- Security headers
- Rate limiting