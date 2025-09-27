import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Security,
  Warning,
  CheckCircle,
  Error,
  Download,
  FilterList,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const SecurityAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [category, setCategory] = useState('all');

  // Mock data
  const threatTrends = [
    { date: '2024-01-17', threats: 45, blocked: 42, mitigated: 38 },
    { date: '2024-01-18', threats: 52, blocked: 48, mitigated: 45 },
    { date: '2024-01-19', threats: 38, blocked: 35, mitigated: 32 },
    { date: '2024-01-20', threats: 65, blocked: 60, mitigated: 55 },
    { date: '2024-01-21', threats: 58, blocked: 54, mitigated: 50 },
    { date: '2024-01-22', threats: 72, blocked: 68, mitigated: 65 },
    { date: '2024-01-23', threats: 48, blocked: 45, mitigated: 42 },
  ];

  const threatCategories = [
    { name: 'Brute Force', value: 35, color: '#f44336' },
    { name: 'SQL Injection', value: 25, color: '#ff9800' },
    { name: 'XSS Attempts', value: 20, color: '#ffc107' },
    { name: 'API Abuse', value: 15, color: '#4caf50' },
    { name: 'Other', value: 5, color: '#2196f3' },
  ];

  const geoDistribution = [
    { country: 'India', attacks: 145, blocked: 138 },
    { country: 'China', attacks: 89, blocked: 87 },
    { country: 'Russia', attacks: 76, blocked: 75 },
    { country: 'USA', attacks: 23, blocked: 20 },
    { country: 'Others', attacks: 45, blocked: 42 },
  ];

  const riskScores = [
    { subject: 'Authentication', score: 85, fullMark: 100 },
    { subject: 'Data Protection', score: 92, fullMark: 100 },
    { subject: 'Network Security', score: 78, fullMark: 100 },
    { subject: 'Access Control', score: 88, fullMark: 100 },
    { subject: 'Encryption', score: 95, fullMark: 100 },
    { subject: 'Monitoring', score: 82, fullMark: 100 },
  ];

  const topThreats = [
    { id: 1, ip: '192.168.1.100', type: 'Brute Force', attempts: 127, status: 'blocked', risk: 'high' },
    { id: 2, ip: '10.0.0.50', type: 'SQL Injection', attempts: 89, status: 'blocked', risk: 'critical' },
    { id: 3, ip: '172.16.0.25', type: 'XSS', attempts: 56, status: 'monitoring', risk: 'medium' },
    { id: 4, ip: '192.168.2.75', type: 'API Abuse', attempts: 45, status: 'blocked', risk: 'high' },
    { id: 5, ip: '10.1.1.100', type: 'Port Scan', attempts: 34, status: 'blocked', risk: 'low' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'blocked': return <CheckCircle color="success" />;
      case 'monitoring': return <Warning color="warning" />;
      case 'active': return <Error color="error" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Security Analytics</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="Time Range">
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="authentication">Authentication</MenuItem>
              <MenuItem value="api">API Security</MenuItem>
              <MenuItem value="data">Data Security</MenuItem>
            </Select>
          </FormControl>
          <IconButton>
            <Download />
          </IconButton>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Threats Detected</Typography>
              <Typography variant="h4">1,234</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp color="error" fontSize="small" />
                <Typography variant="body2" color="error" sx={{ ml: 1 }}>
                  +23% from last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Threats Blocked</Typography>
              <Typography variant="h4">1,156</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography variant="h6" color="success.main">93.7%</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  Block rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Active Incidents</Typography>
              <Typography variant="h4">8</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingDown color="success" fontSize="small" />
                <Typography variant="body2" color="success" sx={{ ml: 1 }}>
                  -15% from yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Security Score</Typography>
              <Typography variant="h4">87/100</Typography>
              <LinearProgress variant="determinate" value={87} sx={{ mt: 2 }} color="success" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Threat Trends */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Threat Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={threatTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="threats" stroke="#f44336" name="Detected" />
                  <Line type="monotone" dataKey="blocked" stroke="#ff9800" name="Blocked" />
                  <Line type="monotone" dataKey="mitigated" stroke="#4caf50" name="Mitigated" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Threat Categories */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Threat Categories</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={threatCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {threatCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Geographic Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Geographic Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={geoDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="attacks" fill="#f44336" name="Attacks" />
                  <Bar dataKey="blocked" fill="#4caf50" name="Blocked" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Assessment */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Risk Assessment</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={riskScores}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Security Score" dataKey="score" stroke="#2196f3" fill="#2196f3" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Threat Sources */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Threat Sources</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Threat Type</TableCell>
                      <TableCell align="center">Attempts</TableCell>
                      <TableCell align="center">Risk Level</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topThreats.map((threat) => (
                      <TableRow key={threat.id}>
                        <TableCell>{threat.ip}</TableCell>
                        <TableCell>{threat.type}</TableCell>
                        <TableCell align="center">{threat.attempts}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={threat.risk.toUpperCase()} 
                            size="small" 
                            color={getRiskColor(threat.risk)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            {getStatusIcon(threat.status)}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {threat.status}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <FilterList />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default SecurityAnalytics;