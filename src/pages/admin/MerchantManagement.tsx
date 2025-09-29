import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridPaginationModel,
} from '@mui/x-data-grid';
import {
  Add,
  Search,
  Edit,
  Delete,
  Block,
  CheckCircle,
  MoreVert,
  Business,
  Email,
  Phone,
  LocationOn,
  ContentCopy,
  Refresh,
  VpnKey,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import merchantService, { 
  MerchantSummary, 
  CreateMerchantRequest,
  UpdateMerchantRequest,
  MerchantResponse 
} from '../../services/merchantService';

interface MerchantRow extends MerchantSummary {
  id: string;
}

const MerchantManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [merchants, setMerchants] = useState<MerchantRow[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  
  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantResponse | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Form states
  const [formData, setFormData] = useState<CreateMerchantRequest>({
    businessName: '',
    email: '',
    phoneNumber: '',
    businessType: '',
    businessAddress: '',
    panNumber: '',
    gstNumber: '',
    webhookUrl: '',
  });

  // Fetch merchants
  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const response = await merchantService.getAllMerchants({
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      
      const merchantRows: MerchantRow[] = response.merchants.map((merchant) => ({
        ...merchant,
        id: merchant.merchantId,
      }));
      
      setMerchants(merchantRows);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error('Failed to fetch merchants');
    } finally {
      setLoading(false);
    }
  };

  // Fetch business types
  const fetchBusinessTypes = async () => {
    try {
      const types = await merchantService.getBusinessTypes();
      setBusinessTypes(types);
    } catch (error) {
      console.error('Failed to fetch business types');
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [paginationModel, statusFilter]);

  useEffect(() => {
    fetchBusinessTypes();
  }, []);

  const handleCreateMerchant = async () => {
    try {
      const response = await merchantService.createMerchant(formData);
      toast.success('Merchant created successfully!');
      setOpenCreateDialog(false);
      fetchMerchants();
      
      // Show API credentials
      if (response.apiCredentials?.apiKey) {
        showApiCredentialsDialog(response);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create merchant');
    }
  };

  const handleViewMerchant = async (merchantId: string) => {
    try {
      const response = await merchantService.getMerchant(merchantId);
      setSelectedMerchant(response);
      setOpenViewDialog(true);
    } catch (error) {
      toast.error('Failed to fetch merchant details');
    }
  };

  const handleUpdateStatus = async (merchantId: string, status: string) => {
    try {
      await merchantService.updateMerchant(merchantId, { status });
      toast.success(`Merchant ${status.toLowerCase()} successfully`);
      fetchMerchants();
    } catch (error) {
      toast.error('Failed to update merchant status');
    }
  };

  const handleRegenerateCredentials = async (merchantId: string) => {
    try {
      const response = await merchantService.regenerateCredentials(merchantId);
      toast.success('API credentials regenerated successfully');
      
      if (response.apiCredentials?.apiKey) {
        showApiCredentialsDialog(response);
      }
    } catch (error) {
      toast.error('Failed to regenerate credentials');
    }
  };

  const showApiCredentialsDialog = (merchant: MerchantResponse) => {
    // TODO: Implement a proper dialog to show and copy API credentials
    alert(`API Key: ${merchant.apiCredentials?.apiKey}\n\nPlease copy and save these credentials securely!`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.info(`${label} copied to clipboard`);
  };

  const columns: GridColDef[] = [
    {
      field: 'merchantId',
      headerName: 'Merchant ID',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center">
          <Typography variant="body2">{params.value}</Typography>
          <IconButton
            size="small"
            onClick={() => copyToClipboard(params.value, 'Merchant ID')}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      field: 'businessName',
      headerName: 'Business Name',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center">
          <Business sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'businessType',
      headerName: 'Type',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} size="small" variant="outlined" />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'ACTIVE'
              ? 'success'
              : params.value === 'SUSPENDED'
              ? 'warning'
              : 'error'
          }
          icon={
            params.value === 'ACTIVE' ? <CheckCircle /> : <Block />
          }
        />
      ),
    },
    {
      field: 'activeTokens',
      headerName: 'Active Tokens',
      width: 120,
      align: 'center',
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewMerchant(params.row.merchantId)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Status">
            <IconButton
              size="small"
              onClick={() => {
                const newStatus = params.row.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
                handleUpdateStatus(params.row.merchantId, newStatus);
              }}
            >
              {params.row.status === 'ACTIVE' ? <Block /> : <CheckCircle />}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      merchant.merchantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Merchant Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Add New Merchant
          </Button>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by ID, name, or email..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="ALL">All Status</MenuItem>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="SUSPENDED">Suspended</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchMerchants}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <Box style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredMerchants}
              columns={columns}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 25, 50]}
              rowCount={totalElements}
              paginationMode="server"
              disableRowSelectionOnClick
            />
          </Box>
        </Card>

        {/* Create Merchant Dialog */}
        <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Merchant</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Business Type</InputLabel>
                  <Select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    label="Business Type"
                  >
                    {businessTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Address"
                  multiline
                  rows={2}
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PAN Number"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  placeholder="ABCDE1234F"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GST Number"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  placeholder="22ABCDE1234F1Z5"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Webhook URL (Optional)"
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                  placeholder="https://example.com/webhook"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateMerchant}
              disabled={!formData.businessName || !formData.email || !formData.phoneNumber || !formData.businessType}
            >
              Create Merchant
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Merchant Dialog */}
        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Merchant Details</Typography>
              <Chip
                label={selectedMerchant?.status}
                color={
                  selectedMerchant?.status === 'ACTIVE'
                    ? 'success'
                    : selectedMerchant?.status === 'SUSPENDED'
                    ? 'warning'
                    : 'error'
                }
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedMerchant && (
              <>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                  <Tab label="Basic Info" />
                  <Tab label="API Credentials" />
                  <Tab label="Settings" />
                  <Tab label="Statistics" />
                </Tabs>

                {tabValue === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Merchant ID</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedMerchant.merchantId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Business Name</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedMerchant.businessName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Email</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedMerchant.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Phone</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedMerchant.phoneNumber || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption">Business Address</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedMerchant.businessAddress || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      API credentials are sensitive. Handle with care!
                    </Alert>
                    <Typography variant="caption">API Key Hint</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                      {selectedMerchant.apiCredentials?.apiKeyHint}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<VpnKey />}
                      onClick={() => handleRegenerateCredentials(selectedMerchant.merchantId)}
                      color="warning"
                    >
                      Regenerate API Credentials
                    </Button>
                  </Box>
                )}

                {tabValue === 2 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Allow Refunds</Typography>
                      <Typography variant="body1">
                        {selectedMerchant.settings.allowRefunds ? 'Yes' : 'No'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Token Expiry Days</Typography>
                      <Typography variant="body1">
                        {selectedMerchant.settings.tokenExpiryDays} days
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Max Tokens Per Card</Typography>
                      <Typography variant="body1">
                        {selectedMerchant.settings.maxTokensPerCard}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {tabValue === 3 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" align="center">
                            {selectedMerchant.stats.totalTokens}
                          </Typography>
                          <Typography variant="caption" align="center" display="block">
                            Total Tokens
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" align="center">
                            {selectedMerchant.stats.activeTokens}
                          </Typography>
                          <Typography variant="caption" align="center" display="block">
                            Active Tokens
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4" align="center">
                            {selectedMerchant.stats.tokensCreatedToday}
                          </Typography>
                          <Typography variant="caption" align="center" display="block">
                            Tokens Today
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default MerchantManagement;