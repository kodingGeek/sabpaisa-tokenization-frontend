import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Cloud,
  Storage,
  Security,
  Speed,
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Timeline,
  Memory,
  DataUsage,
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
} from 'recharts';

const Infrastructure: React.FC = () => {
  // Mock data
  const cpuData = [
    { time: '00:00', usage: 45 },
    { time: '04:00', usage: 38 },
    { time: '08:00', usage: 62 },
    { time: '12:00', usage: 78 },
    { time: '16:00', usage: 71 },
    { time: '20:00', usage: 55 },
    { time: '24:00', usage: 42 },
  ];

  const memoryData = [
    { time: '00:00', usage: 68 },
    { time: '04:00', usage: 65 },
    { time: '08:00', usage: 72 },
    { time: '12:00', usage: 85 },
    { time: '16:00', usage: 82 },
    { time: '20:00', usage: 75 },
    { time: '24:00', usage: 70 },
  ];

  const services = [
    { name: 'Token Service', status: 'HEALTHY', uptime: '99.99%', responseTime: '28ms' },
    { name: 'Auth Service', status: 'HEALTHY', uptime: '99.95%', responseTime: '45ms' },
    { name: 'Vault Database', status: 'HEALTHY', uptime: '100%', responseTime: '12ms' },
    { name: 'Cache Layer', status: 'WARNING', uptime: '98.5%', responseTime: '120ms' },
    { name: 'API Gateway', status: 'HEALTHY', uptime: '99.98%', responseTime: '35ms' },
  ];

  const awsResources = [
    { service: 'EC2', instances: 12, region: 'ap-south-1', cost: '$2,450' },
    { service: 'RDS', instances: 3, region: 'ap-south-1', cost: '$1,200' },
    { service: 'S3', instances: 5, region: 'ap-south-1', cost: '$340' },
    { service: 'CloudFront', instances: 2, region: 'Global', cost: '$180' },
    { service: 'Lambda', instances: 8, region: 'ap-south-1', cost: '$95' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'success';
      case 'WARNING': return 'warning';
      case 'CRITICAL': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY': return <CheckCircle color="success" />;
      case 'WARNING': return <Warning color="warning" />;
      case 'CRITICAL': return <Error color="error" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Infrastructure Monitoring</Typography>
        <Button variant="outlined" startIcon={<Refresh />}>
          Refresh
        </Button>
      </Box>

      {/* System Health Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    System Health
                  </Typography>
                  <Typography variant="h4">98.5%</Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 48 }} />
              </Box>
              <LinearProgress
                variant="determinate"
                value={98.5}
                color="success"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Instances
                  </Typography>
                  <Typography variant="h4">28</Typography>
                </Box>
                <Cloud sx={{ fontSize: 48, color: 'primary.main' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Across 3 availability zones
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
                    Avg Response Time
                  </Typography>
                  <Typography variant="h4">42ms</Typography>
                </Box>
                <Speed sx={{ fontSize: 48, color: 'success.main' }} />
              </Box>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                -15% from last week
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
                    Monthly Cost
                  </Typography>
                  <Typography variant="h4">$4,265</Typography>
                </Box>
                <DataUsage sx={{ fontSize: 48, color: 'warning.main' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Within budget
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Resource Utilization */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                CPU Usage (24h)
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={cpuData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="usage" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Memory Usage (24h)
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={memoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Status
              </Typography>
              <List>
                {services.map((service, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getStatusIcon(service.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={service.name}
                      secondary={`Uptime: ${service.uptime} • Response: ${service.responseTime}`}
                    />
                    <Chip
                      label={service.status}
                      size="small"
                      color={getStatusColor(service.status)}
                    />
                  </ListItem>
                ))}
              </List>
              
              {services.some(s => s.status === 'WARNING') && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Cache layer experiencing higher than normal response times
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* AWS Resources */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AWS Resources
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell align="center">Instances</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell align="right">Cost/Month</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {awsResources.map((resource) => (
                      <TableRow key={resource.service}>
                        <TableCell>{resource.service}</TableCell>
                        <TableCell align="center">{resource.instances}</TableCell>
                        <TableCell>{resource.region}</TableCell>
                        <TableCell align="right">{resource.cost}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3}>
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>$4,265</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Events */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Infrastructure Events
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Timeline />
                  </ListItemIcon>
                  <ListItemText
                    primary="Auto-scaling triggered for Token Service"
                    secondary="2 hours ago - Added 2 instances due to increased load"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security patch applied to all EC2 instances"
                    secondary="6 hours ago - Completed successfully with zero downtime"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Storage />
                  </ListItemIcon>
                  <ListItemText
                    primary="Database backup completed"
                    secondary="12 hours ago - Full backup stored in S3"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Infrastructure;