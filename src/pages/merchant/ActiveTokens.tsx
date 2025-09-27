import React, { useState } from 'react';
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
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
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

interface Token {
  id: string;
  token: string;
  maskedCard: string;
  type: string;
  purpose: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
  usageCount: number;
  merchant: string;
}

const ActiveTokens: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Mock data
  const mockTokens: Token[] = [
    {
      id: '1',
      token: 'tok_1234567890abcdef',
      maskedCard: '4111****1111',
      type: 'FPT',
      purpose: 'ECOMMERCE',
      status: 'ACTIVE',
      createdAt: '2024-01-15T10:00:00Z',
      expiresAt: '2025-01-15T10:00:00Z',
      lastUsed: '2024-01-20T15:30:00Z',
      usageCount: 45,
      merchant: 'MERCH001',
    },
    {
      id: '2',
      token: 'tok_2345678901bcdefg',
      maskedCard: '5200****5678',
      type: 'COF',
      purpose: 'RECURRING',
      status: 'ACTIVE',
      createdAt: '2024-01-10T09:00:00Z',
      expiresAt: '2025-01-10T09:00:00Z',
      lastUsed: '2024-01-22T10:15:00Z',
      usageCount: 120,
      merchant: 'MERCH001',
    },
    {
      id: '3',
      token: 'tok_3456789012cdefgh',
      maskedCard: '4532****9876',
      type: 'RANDOM',
      purpose: 'SUBSCRIPTION',
      status: 'SUSPENDED',
      createdAt: '2024-01-05T14:30:00Z',
      expiresAt: '2025-01-05T14:30:00Z',
      lastUsed: '2024-01-18T12:00:00Z',
      usageCount: 78,
      merchant: 'MERCH001',
    },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, token: Token) => {
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
    toast.success(`Token ${selectedToken?.token} suspended successfully`);
    handleCloseDialog();
  };

  const handleDeleteToken = () => {
    toast.success(`Token ${selectedToken?.token} deleted successfully`);
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

  const columns: GridColDef[] = [
    {
      field: 'token',
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
      field: 'maskedCard',
      headerName: 'Masked Card',
      width: 130,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} size="small" variant="outlined" />
      ),
    },
    {
      field: 'purpose',
      headerName: 'Purpose',
      width: 120,
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
      field: 'lastUsed',
      headerName: 'Last Used',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
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

  const filteredTokens = mockTokens.filter(token => {
    const matchesSearch = 
      token.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.maskedCard.includes(searchTerm);
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
            onClick={() => toast.info('Refreshing token list...')}
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
            <TextField
              placeholder="Search by token or card number..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1 }}
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
          <DataGrid
            rows={filteredTokens}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(selection) => setSelectedRows(selection as string[])}
            rowSelectionModel={selectedRows}
            slots={{
              toolbar: GridToolbar,
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
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
            Are you sure you want to suspend token: <strong>{selectedToken?.token}</strong>?
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
            Are you sure you want to permanently delete token: <strong>{selectedToken?.token}</strong>?
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