import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  Badge,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Security,
  Warning,
  Error,
  CheckCircle,
  Shield,
  BugReport,
  Block,
  Refresh,
  MoreVert,
  TrendingUp,
  TrendingDown,
  LocalFireDepartment,
  Info,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface ThreatData {
  id: string;
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
  timestamp: string;
  status: 'ACTIVE' | 'MITIGATED' | 'INVESTIGATING';
  description: string;
  affectedTokens: number;
}

const ThreatMonitor: React.FC = () => {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [loading, setLoading] = useState(false);
  const [threatScore, setThreatScore] = useState(72);

  // Mock data
  useEffect(() => {
    const mockThreats: ThreatData[] = [
      {
        id: '1',
        type: 'BRUTE_FORCE',
        severity: 'HIGH',
        source: '192.168.1.100',
        timestamp: new Date().toISOString(),
        status: 'ACTIVE',
        description: 'Multiple failed login attempts detected from IP',
        affectedTokens: 0,
      },
      {
        id: '2',
        type: 'UNUSUAL_ACTIVITY',
        severity: 'MEDIUM',
        source: 'Token: tok_1234567890',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'INVESTIGATING',
        description: 'Token used from multiple geographic locations',
        affectedTokens: 1,
      },
      {
        id: '3',
        type: 'DATA_EXFILTRATION',
        severity: 'HIGH',
        source: 'API Endpoint',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'MITIGATED',
        description: 'Unusual data access pattern detected',
        affectedTokens: 15,
      },
    ];
    setThreats(mockThreats);
  }, []);

  const threatsByType = [
    { name: 'Brute Force', value: 23, color: '#f44336' },
    { name: 'Data Breach', value: 12, color: '#ff9800' },
    { name: 'Unusual Activity', value: 45, color: '#ffc107' },
    { name: 'API Abuse', value: 20, color: '#2196f3' },
  ];

  const threatTrend = [
    { day: 'Mon', threats: 12 },
    { day: 'Tue', threats: 15 },
    { day: 'Wed', threats: 8 },
    { day: 'Thu', threats: 22 },
    { day: 'Fri', threats: 18 },
    { day: 'Sat', threats: 10 },
    { day: 'Sun', threats: 5 },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Error color="error" />;
      case 'INVESTIGATING':
        return <Warning color="warning" />;
      case 'MITIGATED':
        return <CheckCircle color="success" />;
      default:
        return <Info />;
    }
  };

  const getThreatScoreColor = (score: number) => {
    if (score >= 80) return '#f44336';
    if (score >= 60) return '#ff9800';
    if (score >= 40) return '#ffc107';
    return '#4caf50';
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setThreatScore(Math.floor(Math.random() * 30) + 60);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Threat Monitor</Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Threat Score Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${getThreatScoreColor(threatScore)} 0%, ${getThreatScoreColor(threatScore)}40 100%)` }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <Shield sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h2" fontWeight="bold">
                {threatScore}
              </Typography>
              <Typography variant="h6">Threat Score</Typography>
              <Typography variant="body2">
                {threatScore >= 80 ? 'Critical' : threatScore >= 60 ? 'High' : threatScore >= 40 ? 'Medium' : 'Low'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Threats
                  </Typography>
                  <Typography variant="h4">
                    {threats.filter(t => t.status === 'ACTIVE').length}
                  </Typography>
                </Box>
                <Error color="error" sx={{ fontSize: 48 }} />
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp color="error" fontSize="small" />
                <Typography variant="body2" color="error" sx={{ ml: 1 }}>
                  +12% from last hour
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Blocked Attempts
                  </Typography>
                  <Typography variant="h4">247</Typography>
                </Box>
                <Block color="success" sx={{ fontSize: 48 }} />
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingDown color="success" fontSize="small" />
                <Typography variant="body2" color="success" sx={{ ml: 1 }}>
                  -8% from yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Affected Tokens
                  </Typography>
                  <Typography variant="h4">16</Typography>
                </Box>
                <LocalFireDepartment color="warning" sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Requiring immediate attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Threats */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Threats
              </Typography>
              <List>
                {threats.map((threat, index) => (
                  <React.Fragment key={threat.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemIcon>
                        {getStatusIcon(threat.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">{threat.description}</Typography>
                            <Chip 
                              label={threat.severity} 
                              size="small" 
                              color={getSeverityColor(threat.severity)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Source: {threat.source} | Type: {threat.type} | 
                              Time: {new Date(threat.timestamp).toLocaleString()}
                            </Typography>
                            {threat.affectedTokens > 0 && (
                              <Typography variant="body2" color="error">
                                {threat.affectedTokens} tokens affected
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end">
                          <MoreVert />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Threats by Type
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={threatsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {threatsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                7-Day Trend
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={threatTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="threats" fill="#ff5722" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Security Recommendations */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Security Recommendations
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Alert severity="error">
                <AlertTitle>Immediate Action Required</AlertTitle>
                Enable rate limiting on authentication endpoints to prevent brute force attacks.
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert severity="warning">
                <AlertTitle>Review Required</AlertTitle>
                Update WAF rules to block suspicious IP ranges detected in recent attacks.
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert severity="info">
                <AlertTitle>Best Practice</AlertTitle>
                Schedule regular security audits and penetration testing quarterly.
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      </Box>
    </DashboardLayout>
  );
};

export default ThreatMonitor;