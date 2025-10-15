import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Tooltip,
  Avatar,
  AvatarGroup,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Cloud as CloudIcon,
  CloudSync as CloudSyncIcon,
  CloudOff as CloudOffIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { Doughnut, Bar } from 'react-chartjs-2';

interface CloudProvider {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  tokenCount: number;
  latency: number;
  successRate: number;
  region: string;
  lastSync: string;
  icon: string;
}

interface ReplicationTask {
  id: string;
  tokenId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  providers: string[];
  startTime: string;
  duration?: number;
  error?: string;
}

const CloudReplication: React.FC = () => {
  const [providers, setProviders] = useState<CloudProvider[]>([
    {
      id: 'aws',
      name: 'AWS S3',
      status: 'healthy',
      tokenCount: 4523,
      latency: 45,
      successRate: 99.8,
      region: 'us-east-1',
      lastSync: new Date().toISOString(),
      icon: '☁️',
    },
    {
      id: 'azure',
      name: 'Azure Blob',
      status: 'healthy',
      tokenCount: 4523,
      latency: 52,
      successRate: 99.5,
      region: 'eastus',
      lastSync: new Date().toISOString(),
      icon: '☁️',
    },
    {
      id: 'gcp',
      name: 'Google Cloud',
      status: 'degraded',
      tokenCount: 4521,
      latency: 78,
      successRate: 98.2,
      region: 'us-central1',
      lastSync: new Date(Date.now() - 300000).toISOString(),
      icon: '☁️',
    },
  ]);

  const [replicationTasks, setReplicationTasks] = useState<ReplicationTask[]>([
    {
      id: 'REP-001',
      tokenId: 'TOK-123456',
      status: 'completed',
      providers: ['aws', 'azure', 'gcp'],
      startTime: new Date(Date.now() - 3600000).toISOString(),
      duration: 230,
    },
    {
      id: 'REP-002',
      tokenId: 'TOK-789012',
      status: 'in_progress',
      providers: ['aws', 'azure'],
      startTime: new Date().toISOString(),
    },
  ]);

  const [syncDialog, setSyncDialog] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'degraded':
        return 'warning';
      case 'down':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon color="success" />;
      case 'degraded':
        return <WarningIcon color="warning" />;
      case 'down':
        return <ErrorIcon color="error" />;
      default:
        return <CloudIcon />;
    }
  };

  const handleSync = () => {
    setSyncDialog(false);
    setLoading(true);
    // Simulate sync
    setTimeout(() => {
      setProviders(prev => prev.map(p => ({
        ...p,
        lastSync: new Date().toISOString(),
        status: 'healthy',
      })));
      setLoading(false);
    }, 3000);
  };

  const healthyProviders = providers.filter(p => p.status === 'healthy').length;
  const totalTokens = providers.reduce((sum, p) => sum + p.tokenCount, 0) / providers.length;

  const doughnutData = {
    labels: providers.map(p => p.name),
    datasets: [
      {
        data: providers.map(p => p.tokenCount),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      },
    ],
  };

  const barData = {
    labels: providers.map(p => p.name),
    datasets: [
      {
        label: 'Latency (ms)',
        data: providers.map(p => p.latency),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <CloudSyncIcon sx={{ mr: 1 }} />
        Multi-Cloud Token Replication
      </Typography>

      {/* Status Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                System Health
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4">
                  {healthyProviders}/{providers.length}
                </Typography>
                {healthyProviders === providers.length ? (
                  <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                ) : (
                  <WarningIcon color="warning" sx={{ ml: 1 }} />
                )}
              </Box>
              <Typography variant="body2" color="textSecondary">
                Healthy providers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Tokens
              </Typography>
              <Typography variant="h4">
                {Math.floor(totalTokens).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Replicated across clouds
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Latency
              </Typography>
              <Typography variant="h4">
                {Math.floor(providers.reduce((sum, p) => sum + p.latency, 0) / providers.length)}ms
              </Typography>
              <LinearProgress
                variant="determinate"
                value={70}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Auto-Sync
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoSync}
                        onChange={(e) => setAutoSync(e.target.checked)}
                      />
                    }
                    label={autoSync ? 'Enabled' : 'Disabled'}
                  />
                </Box>
                <IconButton onClick={() => setSyncDialog(true)} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cloud Providers */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Cloud Providers</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Provider</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Tokens</TableCell>
                      <TableCell>Latency</TableCell>
                      <TableCell>Success Rate</TableCell>
                      <TableCell>Last Sync</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {providers.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                              {provider.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{provider.name}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                {provider.region}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(provider.status)}
                            label={provider.status}
                            color={getStatusColor(provider.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{provider.tokenCount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {provider.latency}ms
                            <LinearProgress
                              variant="determinate"
                              value={Math.min((100 - provider.latency), 100)}
                              sx={{ ml: 1, width: 50 }}
                              color={provider.latency < 50 ? 'success' : provider.latency < 100 ? 'warning' : 'error'}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color={provider.successRate > 99 ? 'success.main' : 'warning.main'}
                          >
                            {provider.successRate}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {new Date(provider.lastSync).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => setSelectedProvider(provider)}>
                            <TimelineIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Token Distribution</Typography>
              <Box sx={{ height: 200 }}>
                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Latency Comparison</Typography>
              <Box sx={{ height: 200 }}>
                <Bar
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Replications */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Replication Tasks</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task ID</TableCell>
                  <TableCell>Token ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Providers</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {replicationTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {task.tokenId}
                        <IconButton size="small">
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        color={
                          task.status === 'completed'
                            ? 'success'
                            : task.status === 'failed'
                            ? 'error'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                        {task.providers.map((p) => (
                          <Avatar key={p} sx={{ width: 24, height: 24, fontSize: 10 }}>
                            {p.toUpperCase().slice(0, 1)}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </TableCell>
                    <TableCell>
                      {task.duration ? `${task.duration}ms` : 'In Progress'}
                    </TableCell>
                    <TableCell>
                      {task.status === 'failed' && (
                        <Tooltip title="Retry">
                          <IconButton size="small">
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Sync Dialog */}
      <Dialog open={syncDialog} onClose={() => setSyncDialog(false)}>
        <DialogTitle>Force Cloud Synchronization</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Synchronization Details</AlertTitle>
            This will force all cloud providers to synchronize their token inventories.
            Missing tokens will be replicated automatically.
          </Alert>
          <List>
            {providers.map((provider) => (
              <ListItem key={provider.id}>
                <ListItemIcon>
                  <CloudIcon />
                </ListItemIcon>
                <ListItemText
                  primary={provider.name}
                  secondary={`${provider.tokenCount} tokens, ${provider.region}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSyncDialog(false)}>Cancel</Button>
          <Button onClick={handleSync} variant="contained" startIcon={<CloudSyncIcon />}>
            Start Synchronization
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CloudReplication;