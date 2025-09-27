# SabPaisa Tokenization Platform - Test Login Credentials

## Available Test Accounts

### 1. Merchant Account
- **Email**: `merchant@sabpaisa.com`
- **Password**: `Merchant@123`
- **Role**: MERCHANT
- **Access**: Merchant portal, tokenization features, transaction history

### 2. System Administrator
- **Email**: `admin@sabpaisa.com`
- **Password**: `Admin@123`
- **Role**: SYSTEM_ADMIN
- **Access**: Full system administration, user management, configuration

### 3. Security Officer
- **Email**: `security@sabpaisa.com`
- **Password**: `Security@123`
- **Role**: SECURITY_OFFICER
- **Access**: Security monitoring, audit logs, threat management

### 4. Compliance Officer
- **Email**: `compliance@sabpaisa.com`
- **Password**: `Compliance@123`
- **Role**: COMPLIANCE_OFFICER
- **Access**: Compliance reports, PCI DSS monitoring, regulatory features

## Important Notes

1. These are **mock credentials** for frontend testing only
2. The actual backend authentication is not yet implemented
3. All features requiring backend API calls will show errors
4. Session timeout is set to 15 minutes (900000ms)
5. MFA (Multi-Factor Authentication) is disabled for test accounts

## How to Use

1. Navigate to http://localhost:3000
2. Enter one of the email/password combinations above
3. Click "Sign In"
4. You'll be redirected to the appropriate dashboard based on the role

## Security Features Demonstrated

- Secure password requirements (uppercase, lowercase, number, special char)
- Session management with automatic timeout
- Role-based access control (RBAC)
- Account lockout after failed attempts (not active in mock mode)
- CAPTCHA placeholder (requires Google reCAPTCHA key to activate)