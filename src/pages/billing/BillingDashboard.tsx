import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Receipt,
  CreditCard,
  Warning,
  Download
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BillingDashboard: React.FC = () => {
  const billingData = [
    { month: 'Jan', amount: 4500 },
    { month: 'Feb', amount: 5200 },
    { month: 'Mar', amount: 4800 },
    { month: 'Apr', amount: 6100 },
    { month: 'May', amount: 5500 },
    { month: 'Jun', amount: 6700 }
  ];

  const recentTransactions = [
    { id: 1, date: '2024-01-20', description: 'Monthly Subscription', amount: 2999, status: 'paid' },
    { id: 2, date: '2024-01-15', description: 'API Usage Overage', amount: 450, status: 'paid' },
    { id: 3, date: '2024-01-10', description: 'Additional Token Package', amount: 1500, status: 'pending' },
    { id: 4, date: '2024-01-05', description: 'Premium Support', amount: 999, status: 'paid' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Billing Dashboard</Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Current Balance
                  </Typography>
                  <Typography variant="h4">₹12,450</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due on Feb 1, 2024
                  </Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Monthly Spend
                  </Typography>
                  <Typography variant="h4">₹6,700</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'error.main', mr: 1 }} />
                    <Typography variant="caption" color="error.main">
                      +15% from last month
                    </Typography>
                  </Box>
                </Box>
                <Receipt sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Current Plan
                  </Typography>
                  <Typography variant="h6">Enterprise</Typography>
                  <Typography variant="caption" color="text.secondary">
                    ₹2,999/month
                  </Typography>
                </Box>
                <CreditCard sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Usage Limit
                  </Typography>
                  <Typography variant="h6">85%</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    color="warning"
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Billing Trend Chart */}
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Billing Trend" 
          subheader="Monthly billing overview for the last 6 months"
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={billingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader 
          title="Recent Transactions" 
          action={
            <Button startIcon={<Download />} size="small">
              Export
            </Button>
          }
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell align="right">₹{transaction.amount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status.toUpperCase()}
                        color={transaction.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BillingDashboard;