import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import PrivateRoute from './components/auth/PrivateRoute';
import SecurityProvider from './components/security/SecurityProvider';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import SessionTimeout from './components/security/SessionTimeout';
import SecurityHeaders from './components/security/SecurityHeaders';
import { themes, createCustomTheme } from './themes/themes';
import './i18n/i18n'; // Initialize i18n
import { AppThemeProvider } from './contexts/ThemeContext';
import { MerchantProvider } from './contexts/MerchantContext';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const DashboardLayoutWrapper = lazy(() => import('./components/common/DashboardLayoutWrapper'));

// Merchant Management pages
const MerchantPortal = lazy(() => import('./pages/MerchantPortal'));
const MerchantList = lazy(() => import('./pages/merchant/MerchantList'));
const MerchantProfile = lazy(() => import('./pages/merchant/MerchantProfile'));
// const APIConfiguration = lazy(() => import('./pages/merchant/APIConfiguration'));
const PlatformManagement = lazy(() => import('./pages/platforms/PlatformManagement'));
const KYCVerification = lazy(() => import('./pages/merchant/KYCVerification'));
const MerchantSettings = lazy(() => import('./pages/merchant/MerchantSettings'));

// Token Management pages
const TokenManagement = lazy(() => import('./pages/TokenManagementV2'));
const TokenGenerate = lazy(() => import('./pages/merchant/TokenGenerate'));
const ActiveTokens = lazy(() => import('./pages/merchant/ActiveTokens'));
const TokenHistory = lazy(() => import('./pages/merchant/TokenHistory'));
const UnifiedTokenization = lazy(() => import('./pages/tokenization/UnifiedTokenization'));
const PlatformTokenization = lazy(() => import('./pages/tokenization/PlatformTokenization'));
const BulkOperations = lazy(() => import('./pages/tokenization/BulkRetokenization'));
const CardTokenView = lazy(() => import('./pages/tokenization/CardTokenView'));

// Security pages
const SecurityDashboard = lazy(() => import('./pages/SecurityDashboard'));
const ThreatMonitor = lazy(() => import('./pages/security/ThreatMonitor'));
const FraudDetection = lazy(() => import('./pages/security/FraudDetection'));
const BiometricAuth = lazy(() => import('./pages/security/BiometricAuth'));
const QuantumSecurity = lazy(() => import('./pages/security/QuantumSecurity'));
const IncidentResponse = lazy(() => import('./pages/security/IncidentResponse'));

// Compliance pages
const ComplianceDashboard = lazy(() => import('./pages/ComplianceDashboard'));
const PCIDSSStatus = lazy(() => import('./pages/compliance/PCIDSSStatus'));
const RBIReports = lazy(() => import('./pages/compliance/RBIReports'));
const RegulatoryUpdates = lazy(() => import('./pages/compliance/RegulatoryUpdates'));
const Certifications = lazy(() => import('./pages/compliance/Certifications'));

// Audit pages
const AuditDashboard = lazy(() => import('./pages/audit/AuditDashboard'));
const AuditTrails = lazy(() => import('./pages/AuditTrails'));
const ActivityLogs = lazy(() => import('./pages/audit/ActivityLogs'));
const AuditReports = lazy(() => import('./pages/audit/AuditReports'));
const ScheduledAudits = lazy(() => import('./pages/audit/ScheduledAudits'));

// Billing pages
const BillingDashboard = lazy(() => import('./pages/billing/BillingDashboard'));
const Invoices = lazy(() => import('./pages/billing/Invoices'));
const PaymentHistory = lazy(() => import('./pages/billing/PaymentHistory'));
const PricingPlans = lazy(() => import('./pages/billing/PricingPlans'));
const UsageAnalytics = lazy(() => import('./pages/billing/UsageAnalytics'));

// Admin pages
const AdminConsole = lazy(() => import('./pages/AdminConsole'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const SystemConfig = lazy(() => import('./pages/admin/SystemConfig'));
const Infrastructure = lazy(() => import('./pages/admin/Infrastructure'));
const CloudReplication = lazy(() => import('./pages/admin/CloudReplication'));

// Common pages
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const IntegrationTest = lazy(() => import('./pages/IntegrationTest'));
const SimpleTokenize = lazy(() => import('./pages/SimpleTokenize'));

const App: React.FC = () => {
  // Load saved theme from localStorage or use default
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return localStorage.getItem('selectedTheme') || 'default-light';
  });

  const currentThemeConfig = themes.find(t => t.id === currentThemeId) || themes[0];
  const theme = createCustomTheme(currentThemeConfig);

  const handleThemeChange = (themeId: string) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('selectedTheme', themeId);
  };
  // Security: Disable right-click in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };
      
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  // Security: Clear clipboard on sensitive pages (disabled to avoid permission errors)
  useEffect(() => {
    // Clipboard clearing disabled due to browser security restrictions
    // This would require user interaction to work properly
    // const clearClipboard = async () => {
    //   try {
    //     if (navigator.clipboard && document.hasFocus()) {
    //       await navigator.clipboard.writeText('');
    //     }
    //   } catch (err) {
    //     // Silently fail
    //   }
    // };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppThemeProvider currentTheme={currentThemeId} onThemeChange={handleThemeChange}>
          <ErrorBoundary>
            <SecurityProvider>
              <MerchantProvider>
                <SecurityHeaders />
                <SessionTimeout />
                <Router>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected Routes with Layout */}
                  <Route element={<PrivateRoute />}>
                    <Route element={<DashboardLayoutWrapper />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/integration-test" element={<IntegrationTest />} />
                      <Route path="/simple-tokenize" element={<SimpleTokenize />} />
                    
                    {/* Merchant Management Routes */}
                    <Route path="/merchants">
                      <Route index element={<MerchantList />} />
                      <Route path="portal" element={<MerchantPortal />} />
                      <Route path="profile" element={<MerchantProfile />} />
                      {/* <Route path="api-config" element={<APIConfiguration />} /> */}
                      <Route path="platforms" element={<PlatformManagement />} />
                      <Route path="kyc" element={<KYCVerification />} />
                      <Route path="settings" element={<MerchantSettings />} />
                    </Route>
                    
                    {/* Token Management Routes */}
                    <Route path="/tokens">
                      <Route index element={<TokenManagement />} />
                      <Route path="generate" element={<TokenGenerate />} />
                      <Route path="active" element={<ActiveTokens />} />
                      <Route path="history" element={<TokenHistory />} />
                      <Route path="unified" element={<UnifiedTokenization />} />
                      <Route path="platform" element={<PlatformTokenization />} />
                      <Route path="bulk" element={<BulkOperations />} />
                      <Route path="card-view" element={<CardTokenView />} />
                    </Route>
                    
                    {/* Security Routes */}
                    <Route path="/security">
                      <Route index element={<SecurityDashboard />} />
                      <Route path="dashboard" element={<SecurityDashboard />} />
                      <Route path="threats" element={<ThreatMonitor />} />
                      <Route path="fraud" element={<FraudDetection />} />
                      <Route path="biometric" element={<BiometricAuth />} />
                      <Route path="quantum" element={<QuantumSecurity />} />
                      <Route path="incidents" element={<IncidentResponse />} />
                    </Route>
                    
                    {/* Compliance Routes */}
                    <Route path="/compliance">
                      <Route index element={<ComplianceDashboard />} />
                      <Route path="dashboard" element={<ComplianceDashboard />} />
                      <Route path="pci-dss" element={<PCIDSSStatus />} />
                      <Route path="rbi" element={<RBIReports />} />
                      <Route path="regulations" element={<RegulatoryUpdates />} />
                      <Route path="certifications" element={<Certifications />} />
                    </Route>
                    
                    {/* Audit Routes */}
                    <Route path="/audit">
                      <Route index element={<AuditDashboard />} />
                      <Route path="dashboard" element={<AuditDashboard />} />
                      <Route path="trails" element={<AuditTrails />} />
                      <Route path="logs" element={<ActivityLogs />} />
                      <Route path="reports" element={<AuditReports />} />
                      <Route path="scheduled" element={<ScheduledAudits />} />
                    </Route>
                    
                    {/* Billing Routes */}
                    <Route path="/billings">
                      <Route index element={<BillingDashboard />} />
                      <Route path="dashboard" element={<BillingDashboard />} />
                      <Route path="invoices" element={<Invoices />} />
                      <Route path="payments" element={<PaymentHistory />} />
                      <Route path="plans" element={<PricingPlans />} />
                      <Route path="usage" element={<UsageAnalytics />} />
                    </Route>
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<PrivateRoute requiredRole="SYSTEM_ADMIN" />}>
                      <Route index element={<AdminConsole />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="config" element={<SystemConfig />} />
                      <Route path="infrastructure" element={<Infrastructure />} />
                      <Route path="cloud-replication" element={<CloudReplication />} />
                    </Route>
                    </Route> {/* End DashboardLayoutWrapper */}
                  </Route> {/* End PrivateRoute */}
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>
              </Router>
              
              {/* Toast Notifications */}
              <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              />
              </MerchantProvider>
            </SecurityProvider>
          </ErrorBoundary>
        </AppThemeProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;// Force refresh Tue Sep 23 11:55:28 UTC 2025