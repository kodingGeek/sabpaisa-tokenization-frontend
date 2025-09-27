import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Token,
  Security,
  Assessment,
  People,
  TrendingUp,
  Warning,
  CheckCircle,
  Speed,
  Storage,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { selectCurrentUser, selectUserRole } from '../store/slices/authSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import RecentTokens from '../components/dashboard/RecentTokens';
import SecurityAlerts from '../components/dashboard/SecurityAlerts';
import ComplianceStatus from '../components/dashboard/ComplianceStatus';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const userRole = useAppSelector(selectUserRole);
  
  const [stats, setStats] = useState({
    totalTokens: 0,
    activeTokens: 0,
    dailyOperations: 0,
    systemHealth: 0,
    securityScore: 0,
    complianceScore: 0,
    merchantCount: 0,
    apiLatency: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard stats
    setTimeout(() => {
      setStats({
        totalTokens: 1234567,
        activeTokens: 987654,
        dailyOperations: 45678,
        systemHealth: 99.97,
        securityScore: 98.5,
        complianceScore: 100,
        merchantCount: 234,
        apiLatency: 23,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getRoleBasedGreeting = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${currentUser?.name}`;
  };

  const getRoleBasedActions = () => {
    switch (userRole) {
      case 'MERCHANT':
        return [
          { label: 'Manage Tokens', icon: Token, path: '/merchant/tokens' },
          { label: 'View Audit Logs', icon: Assessment, path: '/merchant/audit' },
        ];
      case 'SECURITY_OFFICER':
        return [
          { label: 'Security Dashboard', icon: Security, path: '/security' },
          { label: 'Threat Analysis', icon: Warning, path: '/security/threats' },
        ];
      case 'COMPLIANCE_OFFICER':
        return [
          { label: 'Compliance Dashboard', icon: CheckCircle, path: '/compliance' },
          { label: 'Generate Reports', icon: Assessment, path: '/compliance/reports' },
        ];
      case 'SYSTEM_ADMIN':
        return [
          { label: 'System Management', icon: Storage, path: '/admin' },
          { label: 'User Management', icon: People, path: '/admin/users' },
        ];
      default:
        return [];
    }
  };

  return (
    <DashboardLayout>
      {loading && <LinearProgress />}
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            {getRoleBasedGreeting()}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {userRole === 'MERCHANT' && `Merchant ID: ${currentUser?.merchantId}`}
            {userRole === 'SECURITY_OFFICER' && 'Security Operations Center'}
            {userRole === 'COMPLIANCE_OFFICER' && 'Compliance Management'}
            {userRole === 'SYSTEM_ADMIN' && 'System Administration'}
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} mb={4}>
          {getRoleBasedActions().map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
                onClick={() => navigate(action.path)}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <action.icon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">{action.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats Grid */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tokens"
              value={stats.totalTokens.toLocaleString()}
              icon={<Token />}
              color="primary"
              trend={12.5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Daily Operations"
              value={stats.dailyOperations.toLocaleString()}
              icon={<TrendingUp />}
              color="success"
              trend={8.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="System Health"
              value={`${stats.systemHealth}%`}
              icon={<Speed />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Security Score"
              value={`${stats.securityScore}%`}
              icon={<Security />}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Grid container spacing={3}>
          {/* Activity Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Tokenization Activity (Last 7 Days)
              </Typography>
              <ActivityChart />
            </Paper>
          </Grid>

          {/* Compliance Status */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Compliance Status
              </Typography>
              <ComplianceStatus score={stats.complianceScore} />
            </Paper>
          </Grid>

          {/* Recent Tokens (for Merchants) */}
          {userRole === 'MERCHANT' && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Tokens
                </Typography>
                <RecentTokens />
              </Paper>
            </Grid>
          )}

          {/* Security Alerts (for Security Officers) */}
          {(userRole === 'SECURITY_OFFICER' || userRole === 'SYSTEM_ADMIN') && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Security Alerts
                </Typography>
                <SecurityAlerts />
              </Paper>
            </Grid>
          )}

          {/* System Status (for Admins) */}
          {userRole === 'SYSTEM_ADMIN' && (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>System Status:</strong> All services operational. 
                  Last backup: 2 hours ago. 
                  Next maintenance window: Sunday 2:00 AM IST.
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>

        {/* RBI Compliance Notice */}
        <Box mt={4} p={2} bgcolor="background.paper" borderRadius={1}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <CheckCircle color="success" />
            </Grid>
            <Grid item xs>
              <Typography variant="body2">
                <strong>RBI Compliance:</strong> All data is stored in Mumbai region (ap-south-1). 
                Real-time monitoring active. Last compliance report: Today, 10:00 AM.
              </Typography>
            </Grid>
            <Grid item>
              <Chip label="100% Compliant" color="success" size="small" />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;