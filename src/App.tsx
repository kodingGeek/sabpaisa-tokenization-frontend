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

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MerchantPortal = lazy(() => import('./pages/MerchantPortal'));
const SecurityDashboard = lazy(() => import('./pages/SecurityDashboard'));
const ComplianceDashboard = lazy(() => import('./pages/ComplianceDashboard'));
const AdminConsole = lazy(() => import('./pages/AdminConsole'));
const TokenManagement = lazy(() => import('./pages/TokenManagement'));
const AuditTrails = lazy(() => import('./pages/AuditTrails'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Merchant pages
const TokenGenerate = lazy(() => import('./pages/merchant/TokenGenerate'));
const ActiveTokens = lazy(() => import('./pages/merchant/ActiveTokens'));
const TokenHistory = lazy(() => import('./pages/merchant/TokenHistory'));

// Security pages
const ThreatMonitor = lazy(() => import('./pages/security/ThreatMonitor'));
const IncidentResponse = lazy(() => import('./pages/security/IncidentResponse'));
const SecurityAnalytics = lazy(() => import('./pages/security/SecurityAnalytics'));
const FraudDetection = lazy(() => import('./pages/security/FraudDetection'));
const QuantumSecurity = lazy(() => import('./pages/security/QuantumSecurity'));
const BiometricAuth = lazy(() => import('./pages/security/BiometricAuth'));

// Compliance pages
const RBIReports = lazy(() => import('./pages/compliance/RBIReports'));
const PCIDSSStatus = lazy(() => import('./pages/compliance/PCIDSSStatus'));
const ComplianceAudit = lazy(() => import('./pages/compliance/ComplianceAudit'));

// Admin pages
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const MerchantManagement = lazy(() => import('./pages/admin/MerchantManagement'));
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
              <SecurityHeaders />
              <SessionTimeout />
              <Router>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/integration-test" element={<IntegrationTest />} />
                    <Route path="/simple-tokenize" element={<SimpleTokenize />} />
                    
                    {/* Merchant Portal Routes */}
                    <Route path="/merchant">
                      <Route index element={<MerchantPortal />} />
                      <Route path="management" element={<MerchantManagement />} />
                      <Route path="tokens" element={<TokenManagement />} />
                      <Route path="tokens/generate" element={<TokenGenerate />} />
                      <Route path="tokens/active" element={<ActiveTokens />} />
                      <Route path="tokens/history" element={<TokenHistory />} />
                      <Route path="audit" element={<AuditTrails />} />
                    </Route>
                    
                    {/* Security Officer Routes */}
                    <Route path="/security" element={<PrivateRoute requiredRole="SECURITY_OFFICER" />}>
                      <Route index element={<SecurityDashboard />} />
                      <Route path="threats" element={<ThreatMonitor />} />
                      <Route path="incidents" element={<IncidentResponse />} />
                      <Route path="analytics" element={<SecurityAnalytics />} />
                      <Route path="fraud-detection" element={<FraudDetection />} />
                      <Route path="quantum-security" element={<QuantumSecurity />} />
                      <Route path="biometric-auth" element={<BiometricAuth />} />
                    </Route>
                    
                    {/* Compliance Team Routes */}
                    <Route path="/compliance" element={<PrivateRoute requiredRole="COMPLIANCE_OFFICER" />}>
                      <Route index element={<ComplianceDashboard />} />
                      <Route path="rbi" element={<RBIReports />} />
                      <Route path="pci" element={<PCIDSSStatus />} />
                      <Route path="audit" element={<ComplianceAudit />} />
                    </Route>
                    
                    {/* System Admin Routes */}
                    <Route path="/admin" element={<PrivateRoute requiredRole="SYSTEM_ADMIN" />}>
                      <Route index element={<AdminConsole />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="merchants" element={<MerchantManagement />} />
                      <Route path="config" element={<SystemConfig />} />
                      <Route path="infrastructure" element={<Infrastructure />} />
                      <Route path="cloud-replication" element={<CloudReplication />} />
                    </Route>
                  </Route>
                  
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
            </SecurityProvider>
          </ErrorBoundary>
        </AppThemeProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;// Force refresh Tue Sep 23 11:55:28 UTC 2025