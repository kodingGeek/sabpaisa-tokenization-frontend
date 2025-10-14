import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Api,
  Storage,
  Speed,
  Download
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const UsageAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const usageData = [
    { date: '2024-01-01', tokens: 1200, apiCalls: 8500, storage: 2.1 },
    { date: '2024-01-02', tokens: 1350, apiCalls: 9200, storage: 2.3 },
    { date: '2024-01-03', tokens: 980, apiCalls: 7800, storage: 2.2 },
    { date: '2024-01-04', tokens: 1580, apiCalls: 11200, storage: 2.5 },
    { date: '2024-01-05', tokens: 1420, apiCalls: 10100, storage: 2.4 },
    { date: '2024-01-06', tokens: 1680, apiCalls: 12300, storage: 2.7 },
    { date: '2024-01-07', tokens: 1520, apiCalls: 10800, storage: 2.6 }
  ];

  const algorithmUsage = [
    { name: 'Simple', value: 45, color: '#8884d8' },
    { name: 'COF', value: 35, color: '#82ca9d' },
    { name: 'FPE', value: 20, color: '#ffc658' }
  ];

  const currentUsage = {
    tokens: {
      used: 32500,
      limit: 50000,
      percentage: 65
    },
    apiCalls: {
      used: 287000,
      limit: 500000,
      percentage: 57
    },
    storage: {
      used: 15.2,
      limit: 25,
      percentage: 61
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 60) return 'success';
    if (percentage < 80) return 'warning';
    return 'error';
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? 
      <TrendingUp sx={{ color: 'success.main' }} /> : 
      <TrendingDown sx={{ color: 'error.main' }} />;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Usage Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Current Usage Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Api sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">Tokens Used</Typography>
                  <Typography variant="h4">
                    {currentUsage.tokens.used.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    of {currentUsage.tokens.limit.toLocaleString()}
                  </Typography>
                </Box>
                {getTrendIcon('up')}
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={currentUsage.tokens.percentage} 
                color={getProgressColor(currentUsage.tokens.percentage)}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption">
                {currentUsage.tokens.percentage}% of monthly limit
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">API Calls</Typography>
                  <Typography variant="h4">
                    {currentUsage.apiCalls.used.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    of {currentUsage.apiCalls.limit.toLocaleString()}
                  </Typography>
                </Box>
                {getTrendIcon('up')}
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={currentUsage.apiCalls.percentage} 
                color={getProgressColor(currentUsage.apiCalls.percentage)}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption">
                {currentUsage.apiCalls.percentage}% of monthly limit
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Storage sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">Storage Used</Typography>
                  <Typography variant="h4">
                    {currentUsage.storage.used} GB
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    of {currentUsage.storage.limit} GB
                  </Typography>
                </Box>
                {getTrendIcon('up')}
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={currentUsage.storage.percentage} 
                color={getProgressColor(currentUsage.storage.percentage)}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption">
                {currentUsage.storage.percentage}% of storage limit
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Usage Trends */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Usage Trends" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="tokens" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Tokens"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="apiCalls" 
                    stackId="2" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="API Calls"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Algorithm Usage Distribution" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={algorithmUsage}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {algorithmUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {algorithmUsage.map((algo) => (
                  <Box key={algo.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        backgroundColor: algo.color, 
                        mr: 1,
                        borderRadius: '50%'
                      }} 
                    />
                    <Typography variant="caption">
                      {algo.name}: {algo.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader title="Detailed Metrics" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Average Response Time
                </Typography>
                <Typography variant="h6">145ms</Typography>
                <Chip label="-12ms from last month" color="success" size="small" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Success Rate
                </Typography>
                <Typography variant="h6">99.7%</Typography>
                <Chip label="+0.2% from last month" color="success" size="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Peak Usage Hour
                </Typography>
                <Typography variant="h6">2:00 PM - 3:00 PM</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Cost Analysis</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Month Cost
                </Typography>
                <Typography variant="h6">₹5,430</Typography>
                <Chip label="Within budget" color="success" size="small" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Projected Monthly Cost
                </Typography>
                <Typography variant="h6">₹8,200</Typography>
                <Chip label="15% over budget" color="warning" size="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Cost per Token
                </Typography>
                <Typography variant="h6">₹0.167</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UsageAnalytics;