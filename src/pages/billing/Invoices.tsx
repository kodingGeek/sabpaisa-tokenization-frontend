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
  Button,
  TextField,
  InputAdornment,
  Grid,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search,
  Download,
  Visibility,
  MoreVert,
  Receipt,
  Payment,
  Email
} from '@mui/icons-material';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  description: string;
}

const Invoices: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      amount: 2999,
      status: 'paid',
      description: 'Monthly subscription - January 2024'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      date: '2024-01-20',
      dueDate: '2024-02-19',
      amount: 450,
      status: 'pending',
      description: 'API usage overage charges'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      date: '2024-01-10',
      dueDate: '2024-01-25',
      amount: 1500,
      status: 'overdue',
      description: 'Additional token package'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      date: '2024-01-05',
      dueDate: '2024-02-04',
      amount: 999,
      status: 'draft',
      description: 'Premium support package'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2023-045',
      date: '2023-12-15',
      dueDate: '2024-01-14',
      amount: 2999,
      status: 'paid',
      description: 'Monthly subscription - December 2023'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, invoiceId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoiceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Invoices</Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Invoices</Typography>
                  <Typography variant="h4">{invoices.length}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                All time invoices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Paid</Typography>
                  <Typography variant="h4">₹{paidAmount.toLocaleString()}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Total paid amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4">₹{pendingAmount.toLocaleString()}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Outstanding amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Value</Typography>
                  <Typography variant="h4">₹{totalAmount.toLocaleString()}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Total invoice value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search invoices..."
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
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                fullWidth
              >
                Export All
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader title="Invoice List" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {invoice.invoiceNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          ₹{invoice.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={invoice.status.toUpperCase()}
                          color={getStatusColor(invoice.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small">
                            <Download />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={(e) => handleMenuOpen(e, invoice.id)}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredInvoices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Email sx={{ mr: 1 }} /> Send Invoice
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Download sx={{ mr: 1 }} /> Download PDF
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Payment sx={{ mr: 1 }} /> Mark as Paid
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Invoices;