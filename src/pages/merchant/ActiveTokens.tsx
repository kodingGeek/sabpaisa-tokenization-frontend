import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridPaginationModel,
} from '@mui/x-data-grid';
import {
  Search,
  MoreVert,
  Block,
  Edit,
  Delete,
  ContentCopy,
  Refresh,
  FilterList,
  Download,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import tokenizationService, { TokenInfo } from '../../services/tokenizationService';
import { useMerchant } from '../../contexts/MerchantContext';

interface TokenRow extends TokenInfo {
  id: string;
}

const ActiveTokens: React.FC = () => {
  const { merchants, selectedMerchantId, selectMerchant, loading: loadingMerchants } = useMerchant();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedToken, setSelectedToken] = useState<TokenRow | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // Fetch tokens from API
  const fetchTokens = async () => {
    if (!selectedMerchantId) return;
    
    setLoading(true);
    try {
      const response = await tokenizationService.getAllTokens({
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        merchantId: selectedMerchantId
      });
      
      const tokenRows: TokenRow[] = response.tokens.map((token, index) => ({
        ...token,
        id: `${token.tokenValue}_${index}`
      }));
      
      setTokens(tokenRows);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMerchantId) {
      fetchTokens();
    }
  }, [paginationModel, selectedMerchantId]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, token: TokenRow) => {
    setAnchorEl(event.currentTarget);
    setSelectedToken(token);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    setOpenDialog(action);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog('');
    setSelectedToken(null);
  };

  const handleSuspendToken = () => {
    toast.success(`Token ${selectedToken?.tokenValue} suspended successfully`);
    handleCloseDialog();
  };

  const handleDeleteToken = () => {
    toast.success(`Token ${selectedToken?.tokenValue} deleted successfully`);
    handleCloseDialog();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info('Token copied to clipboard!');
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} performed on ${selectedRows.length} tokens`);
    setSelectedRows([]);
  };

  const handleRefresh = () => {
    toast.info('Refreshing token list...');
    fetchTokens();
  };

  const columns: GridColDef[] = [
    {
      field: 'tokenValue',
      headerName: 'Token',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {params.value}
          </Typography>
          <Tooltip title="Copy token">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(params.value);
              }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: 'maskedPan',
      headerName: 'Masked Card',
      width: 130,
    },
    {
      field: 'merchantId',
      headerName: 'Merchant ID',
      width: 120,
    },
    {
      field: 'merchantName',
      headerName: 'Merchant',
      width: 150,
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
            params.value === 'ACTIVE' ? 'success' :
            params.value === 'SUSPENDED' ? 'warning' : 'error'
          }
        />
      ),
    },
    {
      field: 'usageCount',
      headerName: 'Usage',
      width: 80,
      align: 'center',
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'expiresAt',
      headerName: 'Expires',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row)}
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = 
      token.tokenValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.maskedPan.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || token.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Active Tokens</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            sx={{ mr: 1 }}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => toast.info('Export functionality will be implemented')}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel>Select Merchant</InputLabel>
              <Select
                value={selectedMerchantId}
                onChange={(e) => selectMerchant(e.target.value)}
                label="Select Merchant"
                disabled={loadingMerchants}
              >
                {loadingMerchants && <MenuItem value=""><CircularProgress size={20} /></MenuItem>}
                {!loadingMerchants && merchants.length === 0 && (
                  <MenuItem value="" disabled>No active merchants available</MenuItem>
                )}
                {merchants.map((merchant: any) => (
                  <MenuItem key={merchant.merchantId} value={merchant.merchantId}>
                    {merchant.businessName} ({merchant.merchantId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              placeholder="Search by token or card number..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1 }}
              disabled={!selectedMerchantId}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="ALL">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                <MenuItem value="EXPIRED">Expired</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title="More filters">
              <IconButton>
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>

          {selectedRows.length > 0 && (
            <Box mt={2} display="flex" gap={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Block />}
                onClick={() => handleBulkAction('Suspend')}
              >
                Suspend Selected ({selectedRows.length})
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => handleBulkAction('Delete')}
              >
                Delete Selected ({selectedRows.length})
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <Box style={{ height: 600, width: '100%' }}>
          {!selectedMerchantId ? (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <Alert severity="info" sx={{ maxWidth: 400 }}>
                <Typography variant="body1">
                  Please select a merchant to view their active tokens
                </Typography>
              </Alert>
            </Box>
          ) : (
            <DataGrid
              rows={filteredTokens}
              columns={columns}
              loading={loading}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(selection) => setSelectedRows(selection as string[])}
              rowSelectionModel={selectedRows}
              slots={{
                toolbar: GridToolbar,
              }}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 25, 50]}
              rowCount={totalElements}
              paginationMode="server"
            />
          )}
        </Box>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('edit')}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleAction('suspend')}>
          <Block fontSize="small" sx={{ mr: 1 }} /> Suspend
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Suspend Dialog */}
      <Dialog open={openDialog === 'suspend'} onClose={handleCloseDialog}>
        <DialogTitle>Suspend Token</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Are you sure you want to suspend token: <strong>{selectedToken?.tokenValue}</strong>?
            This will prevent any further transactions using this token.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSuspendToken} color="warning" variant="contained">
            Suspend Token
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDialog === 'delete'} onClose={handleCloseDialog}>
        <DialogTitle>Delete Token</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mt: 2 }}>
            Are you sure you want to permanently delete token: <strong>{selectedToken?.tokenValue}</strong>?
            This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteToken} color="error" variant="contained">
            Delete Token
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default ActiveTokens;