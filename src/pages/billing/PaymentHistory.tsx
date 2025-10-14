import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search,
  Download,
  Visibility,
  Payment,
  CheckCircle,
  Error,
  HourglassEmpty
} from '@mui/icons-material';

interface PaymentRecord {
  id: string;
  transactionId: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'failed' | 'pending' | 'refunded';
  invoiceNumber: string;
  description: string;
  reference?: string;
}

const PaymentHistory: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const payments: PaymentRecord[] = [
    {
      id: '1',
      transactionId: 'TXN-2024-001',
      date: '2024-01-20',
      amount: 2999,
      method: 'Credit Card',
      status: 'completed',
      invoiceNumber: 'INV-2024-001',
      description: 'Monthly subscription payment',
      reference: '**** **** **** 1234'
    },
    {
      id: '2',
      transactionId: 'TXN-2024-002',
      date: '2024-01-18',
      amount: 450,
      method: 'Bank Transfer',
      status: 'completed',
      invoiceNumber: 'INV-2024-002',
      description: 'API usage overage payment',
      reference: 'NEFT0234567890'
    },
    {
      id: '3',
      transactionId: 'TXN-2024-003',
      date: '2024-01-15',
      amount: 1500,
      method: 'UPI',
      status: 'failed',
      invoiceNumber: 'INV-2024-003',
      description: 'Token package payment',
      reference: 'Failed: Insufficient funds'
    },
    {
      id: '4',
      transactionId: 'TXN-2024-004',
      date: '2024-01-12',
      amount: 999,
      method: 'Digital Wallet',
      status: 'pending',
      invoiceNumber: 'INV-2024-004',
      description: 'Premium support payment',
      reference: 'Wallet ID: W123456789'
    },
    {
      id: '5',
      transactionId: 'TXN-2024-005',
      date: '2024-01-10',
      amount: 750,
      method: 'Credit Card',
      status: 'refunded',
      invoiceNumber: 'INV-2024-005',
      description: 'Refund for cancelled service',
      reference: '**** **** **** 5678'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'failed': return <Error />;
      case 'pending': return <HourglassEmpty />;
      case 'refunded': return <Payment />;
      default: return null;
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
  const totalFailed = payments.filter(p => p.status === 'failed').reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Payment History</Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Completed</Typography>
                  <Typography variant="h4">₹{totalPaid.toLocaleString()}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Successfully processed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HourglassEmpty sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4">₹{totalPending.toLocaleString()}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Awaiting confirmation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Error sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Failed</Typography>
                  <Typography variant="h4">₹{totalFailed.toLocaleString()}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Payment failures
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Refunded</Typography>
                  <Typography variant="h4">₹{totalRefunded.toLocaleString()}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Refund amounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Method</InputLabel>
                <Select
                  value={methodFilter}
                  label="Method"
                  onChange={(e) => setMethodFilter(e.target.value)}
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Digital Wallet">Digital Wallet</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                fullWidth
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader title="Payment Records" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {payment.transactionId}
                        </Typography>
                      </TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.invoiceNumber}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          ₹{payment.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(payment.status)}
                          label={payment.status.toUpperCase()}
                          color={getStatusColor(payment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {payment.reference}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPayments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentHistory;