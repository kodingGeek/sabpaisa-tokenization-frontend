# Super User Guide - SabPaisa Tokenization Platform

## Super User Credentials

**Email:** `superuser@sabpaisa.com`  
**Password:** `Super@123`  
**Role:** SYSTEM_ADMIN (with access to all features)

## What Makes Super User Special?

The Super User account has been specifically created to:
- Access ALL features across all user roles
- View all menu items regardless of role restrictions
- Test the complete platform functionality in one session
- Navigate between Merchant, Security, Compliance, and Admin features seamlessly

## How to Test All Features

### 1. Login
1. Go to http://localhost:3003
2. Enter super user credentials
3. Click "Sign In"

### 2. Available Features

Once logged in, you'll see ALL menu items in the sidebar:

#### **Token Management** (Merchant Features)
- Generate Token
- Active Tokens
- Token History

#### **Security Center** (Security Officer Features)
- Threat Monitor
- Incident Response
- Security Analytics
- **Fraud Detection** ✨ NEW
- **Quantum Security** ✨ NEW
- **Biometric Auth** ✨ NEW

#### **Compliance** (Compliance Officer Features)
- RBI Reports
- PCI DSS Status
- Audit Trails

#### **Administration** (System Admin Features)
- User Management
- Merchant Management
- System Config
- Infrastructure
- **Cloud Replication** ✨ NEW

### 3. Testing the New Features

#### **Fraud Detection** (`/security/fraud-detection`)
- View real-time fraud monitoring dashboard
- Check risk scores and fraud alerts
- View detailed fraud indicators
- Data auto-refreshes every 30 seconds

#### **Quantum Security** (`/security/quantum-security`)
- Check quantum readiness score (95%)
- View active quantum algorithms
- Test encryption with "Run Test" button
- Rotate encryption keys with "Rotate Now"

#### **Biometric Auth** (`/security/biometric-auth`)
- Complete the enrollment wizard:
  - User ID: `USER001`
  - Merchant ID: `MERCH001`
- Capture multiple biometric types
- Test authentication after enrollment

#### **Cloud Replication** (`/admin/cloud-replication`)
- Monitor multi-cloud health status
- View token distribution across AWS, Azure, GCP
- Force synchronization with refresh button
- Toggle auto-sync on/off

### 4. Quick Navigation Links

After login, you can directly access:
- Dashboard: http://localhost:3003/dashboard
- Fraud Detection: http://localhost:3003/security/fraud-detection
- Quantum Security: http://localhost:3003/security/quantum-security
- Biometric Auth: http://localhost:3003/security/biometric-auth
- Cloud Replication: http://localhost:3003/admin/cloud-replication
- Token Generation: http://localhost:3003/merchant/tokens/generate
- Merchant Management: http://localhost:3003/admin/merchants

### 5. Features Demonstration

All features work with:
- **Mock Data**: Simulated data for demonstration
- **Interactive UI**: Buttons, forms, and charts are functional
- **Real-time Updates**: Some features auto-refresh
- **Responsive Design**: Works on desktop and mobile

### 6. Important Notes

- This is a UI demonstration with mock data
- Backend API calls will show errors (expected behavior)
- All charts and visualizations use simulated data
- Session timeout is set to 15 minutes
- The super user bypasses all role restrictions

### 7. Testing Workflow

1. **Start with Dashboard** - Get overview of system
2. **Check Security Features** - Test fraud detection and quantum security
3. **Try Biometric Enrollment** - Complete the wizard
4. **Monitor Cloud Replication** - Check multi-cloud status
5. **Generate Test Tokens** - Use merchant features
6. **Review Compliance** - Check audit trails

## Troubleshooting

If you can't see all menu items:
1. Make sure you're logged in as superuser@sabpaisa.com
2. Refresh the page (F5)
3. Clear browser cache and login again

## Benefits of Super User Account

1. **Complete Platform Overview** - See everything in one session
2. **Cross-Role Testing** - Test role transitions without logging out
3. **Feature Integration** - Understand how features connect
4. **Demo Ready** - Perfect for stakeholder presentations
5. **Development Testing** - Quickly test all UI components

Enjoy exploring the complete SabPaisa Tokenization Platform!