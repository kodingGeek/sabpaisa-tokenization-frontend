# SabPaisa Tokenization Platform - Frontend

## Overview

React 18 TypeScript Progressive Web Application (PWA) with security-focused design for the SabPaisa Tokenization Platform.

## Features

### Security Features
- JWT RS256 authentication with automatic key rotation
- Multi-factor authentication (MFA) support
- Session timeout management
- Content Security Policy (CSP) enforcement
- Secure password handling
- CAPTCHA integration for failed login attempts
- Account lockout after multiple failed attempts
- No sensitive data in browser storage

### User Interfaces
1. **Merchant Portal**
   - Token generation and management
   - Usage analytics
   - Audit trail access
   - API credential management

2. **Security Officer Dashboard**
   - Real-time threat monitoring
   - Incident response management
   - Security analytics
   - Behavioral analysis

3. **Compliance Team Interface**
   - RBI compliance monitoring
   - PCI DSS status tracking
   - Audit trail verification
   - Regulatory report generation

4. **System Administrator Console**
   - User management
   - System configuration
   - Infrastructure monitoring
   - Performance analytics

### Technical Features
- Progressive Web App (PWA) with offline capabilities
- Service Worker for caching and background sync
- Redux Toolkit for state management
- RTK Query for API integration
- Material-UI component library
- React Router for navigation
- React Hook Form for form management
- TypeScript for type safety

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

Create a `.env` file with the following variables:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_key
REACT_APP_SESSION_TIMEOUT=900000
REACT_APP_ENVIRONMENT=development
```

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── auth/          # Authentication components
│   ├── common/        # Common UI components
│   ├── dashboard/     # Dashboard components
│   └── security/      # Security components
├── hooks/             # Custom React hooks
├── layouts/           # Page layouts
├── pages/             # Page components
├── services/          # API services
├── store/             # Redux store
│   ├── api/          # RTK Query APIs
│   └── slices/       # Redux slices
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Security Considerations

1. **Content Security Policy**: Strict CSP headers prevent XSS attacks
2. **HTTPS Only**: All API communication over HTTPS
3. **Token Storage**: JWT tokens stored in sessionStorage, not localStorage
4. **Auto Logout**: Session timeout after 15 minutes of inactivity
5. **Input Validation**: All forms have client-side validation
6. **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.

## PWA Features

- Installable on desktop and mobile
- Offline capability for critical features
- Background sync for data synchronization
- Push notifications support (when implemented)
- App-like experience with fast loading

## Development

```bash
# Start development server
npm start

# Run linter
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Production Build

```bash
# Create production build
npm run build

# Analyze bundle size
npm run analyze

# Serve production build locally
npm install -g serve
serve -s build
```

## Deployment

The frontend can be deployed to:
- AWS S3 + CloudFront
- AWS Amplify
- Any static hosting service

Ensure the following environment variables are set for production:
- `REACT_APP_API_BASE_URL`: Production API URL
- `REACT_APP_RECAPTCHA_SITE_KEY`: Production reCAPTCHA key
- `REACT_APP_ENVIRONMENT`: 'production'

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## Compliance

- WCAG 2.1 Level AA accessibility compliance
- PCI DSS compliant UI practices
- RBI data localization indicators
- Audit trail visualization