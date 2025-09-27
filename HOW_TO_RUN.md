# How to Run the SabPaisa Tokenization Frontend

## Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher

## Installation Steps

### 1. Navigate to the frontend directory
```bash
cd sabpaisa-tokenization/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file (optional)
```bash
cp .env.example .env
```

### 4. Start the development server
```bash
npm start
```

The application will automatically open in your default browser at:
**http://localhost:3000**

## What You'll See

Since the backend is not yet connected, you'll see:

1. **Login Page** - A secure login form with:
   - Email and password fields
   - Security indicators
   - MFA support (UI only)
   - Account lockout warnings

2. **Security Features**:
   - After 2 failed login attempts, a CAPTCHA placeholder will appear
   - After 5 failed attempts, the account will be locked for 15 minutes
   - Session timeout warnings

## Testing the UI

### To bypass login and see different dashboards:

1. **Temporary Solution** (for UI viewing only):
   
   Open `src/components/auth/PrivateRoute.tsx` and temporarily modify line 17:
   ```typescript
   // Change this:
   if (!isAuthenticated) {
   
   // To this:
   if (false) {  // Temporarily bypass auth check
   ```

2. **Mock a user role** in `src/App.tsx`:
   
   Add this after the imports:
   ```typescript
   // Temporary mock user for UI testing
   const mockUser = {
     id: '1',
     email: 'test@sabpaisa.com',
     name: 'Test User',
     role: 'MERCHANT', // Change to SECURITY_OFFICER, COMPLIANCE_OFFICER, or SYSTEM_ADMIN
     permissions: ['*'],
     lastLogin: new Date().toISOString(),
     mfaEnabled: false
   };
   ```

3. **Set the mock user** in the Redux store by adding to `src/index.tsx`:
   ```typescript
   import { store } from './store/store';
   import { setCredentials } from './store/slices/authSlice';
   
   // Mock login for UI testing
   store.dispatch(setCredentials({
     user: mockUser,
     token: 'mock-token',
     refreshToken: 'mock-refresh',
     expiresIn: 3600
   }));
   ```

## Available Routes

Once you bypass authentication, you can access:

- `/dashboard` - Main dashboard
- `/merchant/tokens` - Token management (Merchant role)
- `/security` - Security dashboard (Security Officer role)
- `/compliance` - Compliance dashboard (Compliance Officer role)
- `/admin` - Admin console (System Admin role)

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Troubleshooting

### Port 3000 is already in use
```bash
# Kill the process using port 3000
npx kill-port 3000
# Or start on a different port
PORT=3001 npm start
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear build cache
rm -rf build
npm run build
```

## Security Notes

⚠️ **Important**: 
- The authentication bypass is ONLY for UI testing
- Remove all mock code before connecting to the backend
- Never deploy with authentication bypassed

## Next Steps

1. **Backend Integration**: Once the Spring Boot backend is ready, update the API endpoints in:
   - `src/services/api/auth.ts`
   - `.env` file with correct `REACT_APP_API_BASE_URL`

2. **Remove Mock Code**: Remove all temporary authentication bypasses

3. **Add ReCAPTCHA**: Install and configure `react-google-recaptcha`:
   ```bash
   npm install react-google-recaptcha @types/react-google-recaptcha
   ```

4. **Testing**: Add unit and integration tests for components

5. **Production Deployment**: Configure environment variables for production