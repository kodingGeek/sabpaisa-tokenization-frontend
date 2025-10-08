import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Receipt as InvoiceIcon,
  CloudDownload as DownloadIcon,
  MoreVert as MoreIcon,
  CreditCard as CardIcon,
  Storage as StorageIcon,
  SwapHoriz as TransactionIcon,
  Business as PlatformIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTranslation } from 'react-i18next';
import api, { billingApi, mockApi } from '../../services/api';

interface BillingDashboard {
  currentMonthUsage: {
    totalTokensCreated: number;
    totalActiveTokens: number;
    totalTransactions: number;
    platformBreakdown: Record<string, number>;
  };
  estimatedCharges: {
    tokenCreationCharges: number;
    storageCharges: number;
    transactionCharges: number;
    platformCharges: number;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
  };
  historicalBilling: BillingRecord[];
  usageTrends: {
    monthlyUsages: MonthlyUsage[];
    tokenCreationGrowthRate: number;
    transactionGrowthRate: number;
  };
}

interface BillingRecord {
  id: number;
  billingMonth: string;
  totalAmount: number;
  status: string;
  dueDate: string;
  invoiceNumber?: string;
}

interface MonthlyUsage {
  month: string;
  tokensCreated: number;
  transactions: number;
  activeTokens: number;
}

const TokenMonetization: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState<BillingDashboard | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/billing/dashboard');
      setDashboard(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch billing dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, billing: BillingRecord) => {
    setAnchorEl(event.currentTarget);
    setSelectedBilling(billing);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBilling(null);
  };

  const generateInvoice = async () => {
    if (!selectedBilling) return;
    
    try {
      await api.post(`/billing/generate-invoice/${selectedBilling.id}`);
      // Handle invoice generation success
      handleMenuClose();
    } catch (err) {
      console.error('Failed to generate invoice', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>{t('Loading billing dashboard...')}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!dashboard) {
    return null;
  }

  const platformData = Object.entries(dashboard.currentMonthUsage.platformBreakdown).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <MoneyIcon sx={{ mr: 2 }} />
        {t('Token Monetization Dashboard')}
      </Typography>

      {/* Current Month Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {t('Tokens Created')}
                  </Typography>
                  <Typography variant="h4">
                    {dashboard.currentMonthUsage.totalTokensCreated.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('This month')}
                  </Typography>
                </Box>
                <CardIcon sx={{ fontSize: 40, color: 'primary.light' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {t('Active Tokens')}
                  </Typography>
                  <Typography variant="h4">
                    {dashboard.currentMonthUsage.totalActiveTokens.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('Currently stored')}
                  </Typography>
                </Box>
                <StorageIcon sx={{ fontSize: 40, color: 'success.light' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {t('Transactions')}
                  </Typography>
                  <Typography variant="h4">
                    {dashboard.currentMonthUsage.totalTransactions.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('This month')}
                  </Typography>
                </Box>
                <TransactionIcon sx={{ fontSize: 40, color: 'warning.light' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {t('Estimated Bill')}
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(dashboard.estimatedCharges.totalAmount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('Current month')}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, color: 'error.light' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
          <Tab label={t('Current Charges')} />
          <Tab label={t('Usage Trends')} />
          <Tab label={t('Billing History')} />
          <Tab label={t('Platform Breakdown')} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('Current Month Charges Breakdown')}
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>{t('Token Creation Charges')}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(dashboard.estimatedCharges.tokenCreationCharges)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('Storage Charges')}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(dashboard.estimatedCharges.storageCharges)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('Transaction Charges')}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(dashboard.estimatedCharges.transactionCharges)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('Platform Charges')}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(dashboard.estimatedCharges.platformCharges)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>{t('Subtotal')}</strong></TableCell>
                      <TableCell align="right">
                        <strong>{formatCurrency(dashboard.estimatedCharges.subtotal)}</strong>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('Tax (18% GST)')}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(dashboard.estimatedCharges.taxAmount)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Typography variant="h6">{t('Total')}</Typography></TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary">
                          {formatCurrency(dashboard.estimatedCharges.totalAmount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('Billing Information')}
                </Typography>
                <Typography variant="body2" paragraph>
                  {t('Free Tier')}: 1,000 tokens/month
                </Typography>
                <Typography variant="body2" paragraph>
                  {t('Billing Cycle')}: Monthly
                </Typography>
                <Typography variant="body2" paragraph>
                  {t('Payment Terms')}: Net 30
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DownloadIcon />}
                  sx={{ mt: 2 }}
                >
                  {t('Download Price List')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('Usage Trends')}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Chip
              icon={<TrendingIcon />}
              label={`Token Growth: ${dashboard.usageTrends.tokenCreationGrowthRate.toFixed(1)}%`}
              color={dashboard.usageTrends.tokenCreationGrowthRate > 0 ? 'success' : 'error'}
            />
            <Chip
              icon={<TrendingIcon />}
              label={`Transaction Growth: ${dashboard.usageTrends.transactionGrowthRate.toFixed(1)}%`}
              color={dashboard.usageTrends.transactionGrowthRate > 0 ? 'success' : 'error'}
            />
          </Box>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboard.usageTrends.monthlyUsages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tokensCreated" stroke="#8884d8" name={t('Tokens Created')} />
              <Line type="monotone" dataKey="transactions" stroke="#82ca9d" name={t('Transactions')} />
              <Line type="monotone" dataKey="activeTokens" stroke="#ffc658" name={t('Active Tokens')} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {selectedTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('Billing History')}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Billing Month')}</TableCell>
                  <TableCell>{t('Invoice Number')}</TableCell>
                  <TableCell>{t('Amount')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
                  <TableCell>{t('Due Date')}</TableCell>
                  <TableCell>{t('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboard.historicalBilling.map((billing) => (
                  <TableRow key={billing.id}>
                    <TableCell>{billing.billingMonth}</TableCell>
                    <TableCell>{billing.invoiceNumber || '-'}</TableCell>
                    <TableCell>{formatCurrency(billing.totalAmount)}</TableCell>
                    <TableCell>
                      <Chip
                        label={billing.status}
                        size="small"
                        color={
                          billing.status === 'PAID' ? 'success' :
                          billing.status === 'PENDING' ? 'warning' :
                          'error'
                        }
                      />
                    </TableCell>
                    <TableCell>{billing.dueDate}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, billing)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={generateInvoice}>
              <InvoiceIcon sx={{ mr: 1 }} />
              {t('Download Invoice')}
            </MenuItem>
          </Menu>
        </Paper>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('Platform Distribution')}
              </Typography>
              
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('Platform Usage Details')}
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('Platform')}</TableCell>
                      <TableCell align="right">{t('Tokens')}</TableCell>
                      <TableCell align="right">{t('Percentage')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {platformData.map((platform, index) => {
                      const total = platformData.reduce((sum, p) => sum + p.value, 0);
                      const percentage = (platform.value / total * 100).toFixed(1);
                      
                      return (
                        <TableRow key={platform.name}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PlatformIcon sx={{ mr: 1, color: COLORS[index % COLORS.length] }} />
                              {platform.name}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{platform.value.toLocaleString()}</TableCell>
                          <TableCell align="right">{percentage}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TokenMonetization;