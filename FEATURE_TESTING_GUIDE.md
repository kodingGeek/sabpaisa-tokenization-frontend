# Feature Testing Guide - SabPaisa Tokenization Platform

## Prerequisites
1. Application running at http://localhost:3000
2. Login with Super User credentials:
   - Email: `superuser@sabpaisa.com`
   - Password: `Super@123`

## Testing Each New Feature

### 1. Fraud Detection Dashboard (`/security/fraud-detection`)

**What to Test:**
- **Real-time Monitoring**: The dashboard auto-refreshes every 30 seconds
- **Risk Score Indicators**: Check the color-coded risk scores (green = low, yellow = medium, red = high)
- **Alert System**: View fraud alerts with details like velocity checks, geo-location anomalies
- **Charts**: Monitor transaction patterns and fraud trends

**Interactive Elements:**
1. Click on individual alerts to see details
2. Watch the risk score gauge change with mock data
3. Observe the transaction volume chart updating
4. Check the fraud indicators section

**Expected Behavior:**
- Risk scores should vary between 15-95
- Alerts should show different types (velocity, geo-location, device fingerprint)
- Charts should display realistic patterns
- Auto-refresh should update data every 30 seconds

### 2. Quantum Security Management (`/security/quantum-security`)

**What to Test:**
- **Quantum Readiness Score**: Should show 95% readiness
- **Algorithm Status**: View active quantum algorithms (NTRU, Kyber-1024, etc.)
- **Key Rotation**: Test the "Rotate Now" button
- **Encryption Test**: Use "Run Test" button to simulate quantum encryption

**Interactive Elements:**
1. Click "Run Test" button - should show loading state then success message
2. Click "Rotate Now" for key rotation - should update last rotation time
3. Check threat level indicator (should show "Low")
4. Review algorithm details in the table

**Expected Behavior:**
- Test encryption should complete in 2-3 seconds
- Key rotation should show immediate timestamp update
- All algorithms should show "Active" status
- Progress bars should reflect realistic values

### 3. Biometric Authentication (`/security/biometric-auth`)

**What to Test:**
- **Enrollment Wizard**: Complete the multi-step enrollment process
- **Biometric Capture**: Simulate capturing different biometric types
- **Progress Tracking**: Watch the stepper progress through enrollment
- **Authentication Test**: Test authentication after enrollment

**Interactive Elements:**
1. Start enrollment with:
   - User ID: `USER001`
   - Merchant ID: `MERCH001`
2. Click "Next" through each biometric type:
   - Face Recognition
   - Fingerprint
   - Voice Recognition
   - Behavioral Biometrics
   - Iris Scan
3. Complete enrollment and test authentication

**Expected Behavior:**
- Each step should have a 2-second simulated capture time
- Progress should advance through all 6 steps
- Completion should show success message
- "Test Authentication" should work after enrollment

### 4. Multi-Cloud Replication (`/admin/cloud-replication`)

**What to Test:**
- **Cloud Provider Status**: Check health of AWS, Azure, GCP
- **Token Distribution**: View pie chart showing token distribution
- **Sync Status**: Monitor real-time synchronization
- **Auto-Sync Toggle**: Test enabling/disabling auto-sync

**Interactive Elements:**
1. Click refresh button to force synchronization
2. Toggle auto-sync switch on/off
3. View detailed metrics for each cloud provider
4. Check the token distribution chart

**Expected Behavior:**
- All providers should show "healthy" status
- Latency should be realistic (20-50ms)
- Token counts should vary by provider
- Sync progress should complete in 3-5 seconds

## Testing Workflow

### Quick Test (5 minutes):
1. Login as super user
2. Navigate to each new feature page
3. Verify all UI elements load correctly
4. Test one interactive element per feature

### Comprehensive Test (15 minutes):
1. **Fraud Detection**:
   - Wait for 2 auto-refresh cycles
   - Note changes in risk scores
   - Verify different alert types appear
   
2. **Quantum Security**:
   - Run encryption test 3 times
   - Perform key rotation
   - Verify all metrics update
   
3. **Biometric Auth**:
   - Complete full enrollment
   - Test with different user IDs
   - Verify all biometric types work
   
4. **Cloud Replication**:
   - Force sync multiple times
   - Toggle auto-sync
   - Monitor latency changes

### Integration Test (20 minutes):
1. Generate tokens in Token Management
2. Check if fraud detection picks up patterns
3. Verify quantum encryption is applied
4. Monitor cloud replication of new tokens
5. Test biometric auth for token access

## Common Issues & Solutions

### UI Not Responding:
- Refresh the page (F5)
- Check browser console for errors
- Ensure you're logged in as super user

### Features Not Visible:
- Verify login email is exactly `superuser@sabpaisa.com`
- Clear browser cache
- Check the URL paths are correct

### Mock Data Not Updating:
- Mock data updates are randomized
- Wait for auto-refresh cycles
- Use interactive buttons to trigger updates

## Performance Testing

### What to Monitor:
- Page load times (should be < 2 seconds)
- Animation smoothness
- Memory usage in browser dev tools
- Network requests (all should return mock data)

### Expected Performance:
- Smooth animations and transitions
- No lag when switching between features
- Charts render without stuttering
- Auto-refresh doesn't freeze UI

## Accessibility Testing

### Keyboard Navigation:
- All buttons accessible via Tab key
- Forms navigable with keyboard
- Escape key closes dialogs

### Screen Reader:
- All elements have proper labels
- Status messages announced
- Form validation readable

## Mobile Responsiveness

Test on different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

All features should:
- Adapt to screen size
- Maintain functionality
- Show appropriate layouts

## Report Issues

When reporting issues, include:
1. Feature name and URL
2. Steps to reproduce
3. Expected vs actual behavior
4. Browser and version
5. Screenshot if possible