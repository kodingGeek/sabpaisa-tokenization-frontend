import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import { styled } from '@mui/material/styles';
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
  TableSortLabel,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  FormHelperText,
  InputLabel,
  Select,
  Collapse,
  Alert,
  Checkbox,
  Avatar,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  ExpandMore,
  ExpandLess,
  Business,
  Token,
  MoreVert,
  CheckCircle,
  Warning,
  Error,
  Schedule,
  Download,
  Email,
  Phone,
  FilterList,
  ArrowUpward,
  ArrowDownward,
  Clear,
  Refresh
} from '@mui/icons-material';
import tokenizationService, { merchantService, Merchant, TokenListResponse, TokenInfo } from '../../services/tokenizationService';
import { MerchantResponse } from '../../services/merchantService';
import AddMerchantDialog from '../../components/merchant/AddMerchantDialog';
import ViewMerchantDialog from '../../components/merchant/ViewMerchantDialog';
import EditMerchantDialog from '../../components/merchant/EditMerchantDialog';

// Remove duplicate interface as it's imported from service

interface Token {
  tokenValue: string;
  maskedPan: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  algorithmType: string;
  cardBrand: string;
  createdAt: string;
  usageCount: number;
}

const RotatingIcon = styled(Refresh)(({ theme }) => ({
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  '&.rotating': {
    animation: 'spin 1s linear infinite',
  },
}));

const MerchantList: React.FC = () => {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [tokens, setTokens] = useState<{[merchantId: string]: TokenInfo[]}>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedMerchant, setExpandedMerchant] = useState<string | null>(null);
  const [merchantDialog, setMerchantDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [editingMerchant, setEditingMerchant] = useState<MerchantResponse | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<string>('businessName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [riskFilter, setRiskFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [dateFilter, setDateFilter] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
  const [refreshing, setRefreshing] = useState(false);
  const [bulkActions, setBulkActions] = useState(false);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);

  // No more mock data - using real API calls

  useEffect(() => {
    fetchMerchants();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!refreshing) {
        fetchMerchants();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await merchantService.getAllMerchants({
        page: page,
        size: rowsPerPage
      });
      setMerchants(response.merchants);
      
      // Use activeTokens from API or calculate if needed
      for (const merchant of response.merchants) {
        if (!merchant.activeTokens && !merchant.tokenCount) {
          const tokenResponse = await merchantService.getMerchantTokens(merchant.merchantId);
          merchant.tokenCount = tokenResponse.totalElements;
        }
      }
      
    } catch (error) {
      console.error('Error fetching merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchantTokens = async (merchantId: string) => {
    try {
      if (tokens[merchantId]) return; // Already loaded
      
      const response = await merchantService.getMerchantTokens(merchantId);
      setTokens(prev => ({ ...prev, [merchantId]: response.tokens }));
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  const handleExpandMerchant = (merchantId: string) => {
    if (expandedMerchant === merchantId) {
      setExpandedMerchant(null);
    } else {
      setExpandedMerchant(merchantId);
      fetchMerchantTokens(merchantId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'SUSPENDED': return 'error';
      case 'PENDING': return 'warning';
      case 'VERIFIED': return 'success';
      case 'REJECTED': return 'error';
      case 'REVOKED': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'VERIFIED': return <CheckCircle />;
      case 'SUSPENDED':
      case 'REJECTED':
      case 'REVOKED': return <Error />;
      case 'PENDING': return <Schedule />;
      case 'INACTIVE': return <Warning />;
      default: return null;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'VERY_HIGH': return 'error';
      default: return 'default';
    }
  };

  const filteredAndSortedMerchants = React.useMemo(() => {
    // First filter
    let filtered = merchants.filter(merchant => {
      const matchesSearch = merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           merchant.merchantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (merchant.email || merchant.contactEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;
      const matchesRisk = riskFilter === 'all' || merchant.riskRating === riskFilter;
      const matchesKyc = kycFilter === 'all' || merchant.kycStatus === kycFilter;
      return matchesSearch && matchesStatus && matchesRisk && matchesKyc;
    });

    // Then sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy as keyof Merchant];
      let bVal = b[sortBy as keyof Merchant];
      
      // Handle null/undefined values
      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';
      
      // Convert to lowercase for string comparison
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      // Sort based on direction
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return filtered;
  }, [merchants, searchTerm, statusFilter, riskFilter, kycFilter, sortBy, sortDirection]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRiskFilter('all');
    setKycFilter('all');
    setSortBy('businessName');
    setSortDirection('asc');
  };

  const handleExportMerchant = () => {
    if (!selectedMerchant) return;
    
    // Create CSV content
    const csvContent = [
      ['Merchant ID', 'Business Name', 'Email', 'Phone', 'Status', 'KYC Status', 'Risk Rating', 'Active Tokens'].join(','),
      [selectedMerchant.merchantId, selectedMerchant.businessName, selectedMerchant.email || selectedMerchant.contactEmail, selectedMerchant.contactPhone, selectedMerchant.status, selectedMerchant.kycStatus, selectedMerchant.riskRating, selectedMerchant.activeTokens || selectedMerchant.tokenCount || 0].join(','),
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchant_${selectedMerchant.merchantId}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Merchant data exported successfully!');
  };

  const handleExportAll = () => {
    // Create CSV content for all filtered merchants
    const headers = ['Merchant ID', 'Business Name', 'Email', 'Phone', 'Status', 'KYC Status', 'Risk Rating', 'Active Tokens'].join(',');
    const rows = filteredAndSortedMerchants.map(merchant => 
      [merchant.merchantId, merchant.businessName, merchant.email || merchant.contactEmail, merchant.contactPhone, merchant.status, merchant.kycStatus, merchant.riskRating, merchant.activeTokens || merchant.tokenCount || 0].join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchants_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filteredAndSortedMerchants.length} merchants successfully!`);
  };

  const handleSuspendMerchant = async () => {
    if (!selectedMerchant) return;
    
    if (window.confirm(`Are you sure you want to suspend ${selectedMerchant.businessName}?`)) {
      try {
        const updatePayload = {
          businessName: selectedMerchant.businessName,
          email: selectedMerchant.email || selectedMerchant.contactEmail || 'update@example.com',
          phoneNumber: selectedMerchant.contactPhone || '+919876543210',
          businessType: selectedMerchant.businessType || 'RETAIL',
          businessAddress: 'Not Specified',
          webhookUrl: '',
          status: 'SUSPENDED'
        };

        const response = await fetch(`/api/v1/merchants/${selectedMerchant.merchantId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });

        if (!response.ok) {
          throw new (globalThis.Error)('Failed to suspend merchant');
        }
        
        toast.success('Merchant suspended successfully!');
        fetchMerchants();
        handleMenuClose();
      } catch (error) {
        toast.error('Failed to suspend merchant');
        console.error('Error suspending merchant:', error);
      }
    }
  };

  const handleQuickStatusChange = async (merchant: Merchant, newStatus: string) => {
    if (window.confirm(`Change status of ${merchant.businessName} to ${newStatus}?`)) {
      try {
        const updatePayload = {
          businessName: merchant.businessName,
          email: merchant.email || merchant.contactEmail || 'update@example.com',
          phoneNumber: merchant.contactPhone || '+919876543210',
          businessType: merchant.businessType || 'RETAIL',
          businessAddress: 'Not Specified',
          webhookUrl: '',
          status: newStatus
        };

        console.log('Updating merchant with payload:', updatePayload);

        const response = await fetch(`/api/v1/merchants/${merchant.merchantId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          toast.error(`Failed to update: ${errorText}`);
          return;
        }

        const result = await response.json();
        console.log('Update successful:', result);
        
        toast.success(`Merchant status changed to ${newStatus}`);
        // Refresh the merchant list after a short delay
        setTimeout(() => fetchMerchants(), 500);
      } catch (error) {
        toast.error('Failed to update merchant status');
        console.error('Error updating merchant:', error);
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, merchant: Merchant) => {
    setAnchorEl(event.currentTarget);
    setSelectedMerchant(merchant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMerchant(null);
  };

  const handleEditMerchant = async (merchant: Merchant) => {
    try {
      const response = await fetch(`/api/v1/merchants/${merchant.merchantId}`);
      if (response.ok) {
        const fullMerchant = await response.json();
        setEditingMerchant(fullMerchant);
        setEditDialog(true);
      } else {
        toast.error('Failed to fetch merchant details');
      }
    } catch (error) {
      toast.error('Error fetching merchant details');
      console.error('Error:', error);
    }
  };

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Merchant Management</Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredAndSortedMerchants.length} of {merchants.length} merchants shown
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={() => {
              setRefreshing(true);
              fetchMerchants().then(() => setRefreshing(false));
            }} disabled={refreshing}>
              <RotatingIcon className={refreshing ? 'rotating' : ''} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setMerchantDialog(true)}
          >
            Add Merchant
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setStatusFilter('all')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Merchants</Typography>
                  <Typography variant="h4">{merchants.length}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Registered merchants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setStatusFilter('ACTIVE')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Active</Typography>
                  <Typography variant="h4">
                    {merchants.filter(m => m.status === 'ACTIVE').length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Active merchants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Token sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Tokens</Typography>
                  <Typography variant="h4">
                    {merchants.reduce((sum, m) => sum + (m.activeTokens || m.tokenCount || 0), 0)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Across all merchants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setKycFilter('PENDING')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Pending KYC</Typography>
                  <Typography variant="h4">
                    {merchants.filter(m => m.kycStatus === 'PENDING').length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search merchants..."
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
              <TextField
                select
                fullWidth
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="PENDING">Pending</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
              >
                Filters
              </Button>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportAll}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Merchants Table */}
      <Card>
        <CardHeader title="Merchant List" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {bulkActions && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedMerchants.length > 0 && selectedMerchants.length < filteredAndSortedMerchants.length}
                        checked={selectedMerchants.length === filteredAndSortedMerchants.length && filteredAndSortedMerchants.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMerchants(filteredAndSortedMerchants.map(m => m.merchantId));
                          } else {
                            setSelectedMerchants([]);
                          }
                        }}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'businessName'}
                      direction={sortBy === 'businessName' ? sortDirection : 'asc'}
                      onClick={() => handleSort('businessName')}
                    >
                      Merchant
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'status'}
                      direction={sortBy === 'status' ? sortDirection : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'kycStatus'}
                      direction={sortBy === 'kycStatus' ? sortDirection : 'asc'}
                      onClick={() => handleSort('kycStatus')}
                    >
                      KYC Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortBy === 'tokenCount'}
                      direction={sortBy === 'tokenCount' ? sortDirection : 'asc'}
                      onClick={() => handleSort('tokenCount')}
                    >
                      Tokens
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'riskRating'}
                      direction={sortBy === 'riskRating' ? sortDirection : 'asc'}
                      onClick={() => handleSort('riskRating')}
                    >
                      Risk Rating
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'lastActivity'}
                      direction={sortBy === 'lastActivity' ? sortDirection : 'asc'}
                      onClick={() => handleSort('lastActivity')}
                    >
                      Last Activity
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedMerchants
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((merchant) => (
                    <React.Fragment key={merchant.merchantId}>
                      <TableRow hover selected={selectedMerchants.includes(merchant.merchantId)}>
                        {bulkActions && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedMerchants.includes(merchant.merchantId)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMerchants([...selectedMerchants, merchant.merchantId]);
                                } else {
                                  setSelectedMerchants(selectedMerchants.filter(id => id !== merchant.merchantId));
                                }
                              }}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              {merchant.businessName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {merchant.businessName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {merchant.merchantId}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                {merchant.businessType}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Email sx={{ fontSize: 16, mr: 1, color: 'action.active' }} />
                              <Typography variant="caption">
                                {merchant.email || merchant.contactEmail}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Phone sx={{ fontSize: 16, mr: 1, color: 'action.active' }} />
                              <Typography variant="caption">
                                {merchant.contactPhone}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(merchant.status)}
                            label={merchant.status}
                            color={getStatusColor(merchant.status)}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (merchant.status === 'ACTIVE') {
                                handleQuickStatusChange(merchant, 'SUSPENDED');
                              } else if (merchant.status === 'SUSPENDED') {
                                handleQuickStatusChange(merchant, 'ACTIVE');
                              }
                            }}
                            sx={merchant.status !== 'PENDING' ? { cursor: 'pointer' } : {}}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(merchant.kycStatus)}
                            label={merchant.kycStatus}
                            color={getStatusColor(merchant.kycStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography variant="h6">{merchant.activeTokens || merchant.tokenCount || 0}</Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleExpandMerchant(merchant.merchantId)}
                              sx={{ ml: 1 }}
                            >
                              {expandedMerchant === merchant.merchantId ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={merchant.riskRating}
                            color={getRiskColor(merchant.riskRating)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{merchant.lastActivity}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => {
                                setSelectedMerchant(merchant);
                                setViewDialog(true);
                              }}>
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEditMerchant(merchant)}>
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <IconButton 
                              size="small"
                              onClick={(e) => handleMenuOpen(e, merchant)}
                            >
                              <MoreVert />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Tokens Table */}
                      <TableRow>
                        <TableCell colSpan={8} sx={{ py: 0 }}>
                          <Collapse in={expandedMerchant === merchant.merchantId} timeout="auto" unmountOnExit>
                            <Box sx={{ m: 2 }}>
                              <Typography variant="h6" gutterBottom>
                                Tokens for {merchant.businessName}
                              </Typography>
                              {tokens[merchant.merchantId] && tokens[merchant.merchantId].length > 0 ? (
                                <TableContainer component={Paper} variant="outlined">
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Token Value</TableCell>
                                        <TableCell>Masked PAN</TableCell>
                                        <TableCell>Algorithm</TableCell>
                                        <TableCell>Card Brand</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell align="right">Usage</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {tokens[merchant.merchantId].map((token, index) => (
                                        <TableRow key={index}>
                                          <TableCell sx={{ fontFamily: 'monospace' }}>
                                            {token.tokenValue}
                                          </TableCell>
                                          <TableCell sx={{ fontFamily: 'monospace' }}>
                                            {token.maskedPan}
                                          </TableCell>
                                          <TableCell>
                                            <Chip label={token.algorithmType} size="small" variant="outlined" />
                                          </TableCell>
                                          <TableCell>{token.cardBrand}</TableCell>
                                          <TableCell>
                                            <Chip
                                              label={token.status}
                                              color={getStatusColor(token.status)}
                                              size="small"
                                            />
                                          </TableCell>
                                          <TableCell>{token.createdAt}</TableCell>
                                          <TableCell align="right">{token.usageCount}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              ) : (
                                <Alert severity="info">
                                  No tokens found for this merchant.
                                </Alert>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAndSortedMerchants.length}
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
        <MenuItem onClick={() => {
          handleMenuClose();
          setViewDialog(true);
        }}>
          <Visibility sx={{ mr: 1 }} /> View Profile
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          if (selectedMerchant) {
            handleEditMerchant(selectedMerchant);
          }
        }}>
          <Edit sx={{ mr: 1 }} /> Edit Details
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          if (selectedMerchant) {
            navigate(`/tokens?merchantId=${selectedMerchant.merchantId}`);
          }
        }}>
          <Token sx={{ mr: 1 }} /> Manage Tokens
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          handleExportMerchant();
        }}>
          <Download sx={{ mr: 1 }} /> Export Data
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          handleSuspendMerchant();
        }} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} /> Suspend Account
        </MenuItem>
      </Menu>

      {/* Add Merchant Dialog */}
      <AddMerchantDialog
        open={merchantDialog}
        onClose={() => setMerchantDialog(false)}
        onSuccess={() => {
          setMerchantDialog(false);
          fetchMerchants();
          toast.success('Merchant created successfully!');
        }}
      />

      {/* View Merchant Dialog */}
      <ViewMerchantDialog
        open={viewDialog}
        onClose={() => {
          setViewDialog(false);
          setSelectedMerchant(null);
        }}
        merchant={selectedMerchant}
      />

      {/* Edit Merchant Dialog */}
      <EditMerchantDialog
        open={editDialog}
        onClose={() => {
          setEditDialog(false);
          setEditingMerchant(null);
        }}
        onSuccess={() => {
          setEditDialog(false);
          setEditingMerchant(null);
          fetchMerchants();
          toast.success('Merchant updated successfully!');
        }}
        merchant={editingMerchant}
      />

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Advanced Filters
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Risk Rating</InputLabel>
            <Select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              label="Risk Rating"
              size="small"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>KYC Status</InputLabel>
            <Select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              label="KYC Status"
              size="small"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="VERIFIED">Verified</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={clearFilters}
            startIcon={<Clear />}
          >
            Clear All Filters
          </Button>
        </Box>
      </Menu>
    </PageContainer>
  );
};

export default MerchantList;