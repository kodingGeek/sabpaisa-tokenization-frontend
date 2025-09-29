import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

interface FraudAlert {
  id: string;
  timestamp: string;
  tokenId: string;
  merchantId: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  fraudIndicators: string[];
  location: string;
  amount: number;
  action: 'ALLOWED' | 'BLOCKED' | 'REVIEW';
}

const FraudDetection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [statistics, setStatistics] = useState({
    totalTransactions: 0,
    blockedTransactions: 0,
    flaggedForReview: 0,
    averageRiskScore: 0,
  });
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Simulated data - in production, this would come from the API
  useEffect(() => {
    loadFraudData();
    const interval = setInterval(loadFraudData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadFraudData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAlerts([
        {
          id: 'FRAUD-001',
          timestamp: new Date().toISOString(),
          tokenId: 'TOK-789456',
          merchantId: 'MERCH001',
          riskScore: 85,
          riskLevel: 'HIGH',
          fraudIndicators: ['Velocity Check Failed', 'Unusual Location', 'Device Mismatch'],
          location: 'Russia',
          amount: 15000,
          action: 'BLOCKED',
        },
        {
          id: 'FRAUD-002',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          tokenId: 'TOK-456123',
          merchantId: 'MERCH002',
          riskScore: 65,
          riskLevel: 'MEDIUM',
          fraudIndicators: ['Multiple Cards Same Device', 'Rapid Transactions'],
          location: 'India',
          amount: 5000,
          action: 'REVIEW',
        },
        {
          id: 'FRAUD-003',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          tokenId: 'TOK-321789',
          merchantId: 'MERCH001',
          riskScore: 25,
          riskLevel: 'LOW',
          fraudIndicators: [],
          location: 'USA',
          amount: 2500,
          action: 'ALLOWED',
        },
      ]);
      setStatistics({
        totalTransactions: 1250,
        blockedTransactions: 23,
        flaggedForReview: 45,
        averageRiskScore: 32.5,
      });
      setLoading(false);
    }, 1000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HIGH':
        return 'error';
      case 'CRITICAL':
        return 'error';
      default:
        return 'default';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'ALLOWED':
        return <CheckCircleIcon color="success" />;
      case 'BLOCKED':
        return <ErrorIcon color="error" />;
      case 'REVIEW':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon />;
    }
  };

  const chartData = {
    labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
    datasets: [
      {
        label: 'Risk Score Trend',
        data: [20, 25, 30, 45, 35, 32],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
    datasets: [
      {
        data: [65, 20, 12, 3],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(244, 67, 54, 0.8)',
          'rgba(156, 39, 176, 0.8)',
        ],
      },
    ],
  };

  const handleViewDetails = (alert: FraudAlert) => {
    setSelectedAlert(alert);
    setDetailsOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <SecurityIcon sx={{ mr: 1 }} />
        Real-Time Fraud Detection
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h4">
                {statistics.totalTransactions.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Blocked
              </Typography>
              <Typography variant="h4" color="error">
                {statistics.blockedTransactions}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {((statistics.blockedTransactions / statistics.totalTransactions) * 100).toFixed(2)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Under Review
              </Typography>
              <Typography variant="h4" color="warning.main">
                {statistics.flaggedForReview}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Requires manual review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Risk Score
              </Typography>
              <Typography variant="h4">
                {statistics.averageRiskScore.toFixed(1)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={statistics.averageRiskScore}
                sx={{ mt: 1 }}
                color={statistics.averageRiskScore > 50 ? 'error' : 'success'}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Risk Score Trend</Typography>
                <IconButton onClick={loadFraudData} size="small">
                  <RefreshIcon />
                </IconButton>
              </Box>
              <Box sx={{ height: 300 }}>
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Risk Distribution</Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fraud Alerts Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Fraud Alerts</Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Token ID</TableCell>
                    <TableCell>Merchant</TableCell>
                    <TableCell>Risk Score</TableCell>
                    <TableCell>Risk Level</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        {new Date(alert.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{alert.tokenId}</TableCell>
                      <TableCell>{alert.merchantId}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {alert.riskScore}
                          <LinearProgress
                            variant="determinate"
                            value={alert.riskScore}
                            sx={{ ml: 1, width: 60 }}
                            color={alert.riskScore > 70 ? 'error' : alert.riskScore > 40 ? 'warning' : 'success'}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={alert.riskLevel}
                          color={getRiskColor(alert.riskLevel) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {alert.location}
                        </Box>
                      </TableCell>
                      <TableCell>₹{alert.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Tooltip title={alert.action}>
                          {getActionIcon(alert.action)}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => handleViewDetails(alert)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Fraud Alert Details - {selectedAlert?.id}
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Token ID</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedAlert.tokenId}</Typography>
                
                <Typography variant="subtitle2" color="textSecondary">Risk Score</Typography>
                <Typography variant="h4" sx={{ mb: 2 }}>{selectedAlert.riskScore}</Typography>
                
                <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedAlert.location}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Merchant ID</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedAlert.merchantId}</Typography>
                
                <Typography variant="subtitle2" color="textSecondary">Amount</Typography>
                <Typography variant="h4" sx={{ mb: 2 }}>₹{selectedAlert.amount.toLocaleString()}</Typography>
                
                <Typography variant="subtitle2" color="textSecondary">Action Taken</Typography>
                <Chip
                  label={selectedAlert.action}
                  color={selectedAlert.action === 'BLOCKED' ? 'error' : selectedAlert.action === 'REVIEW' ? 'warning' : 'success'}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>Fraud Indicators</Typography>
                <Box>
                  {selectedAlert.fraudIndicators.map((indicator, index) => (
                    <Chip
                      key={index}
                      label={indicator}
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FraudDetection;