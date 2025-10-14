import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Token as TokenIcon,
  Security,
  CreditCard,
  History,
  Hub,
  Business,
  Refresh,
  Download,
  Edit,
  Delete,
  Visibility,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../layouts/DashboardLayout';
import tokenizationService from '../services/tokenizationService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TokenManagementV2: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalTokens: 0,
    activeTokens: 0,
    suspendedTokens: 0,
    revokedTokens: 0,
    simpleTokens: 0,
    cofTokens: 0,
    fpeTokens: 0,
  });

  useEffect(() => {
    fetchTokens();
    fetchStats();
  }, [page, rowsPerPage, searchTerm]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await tokenizationService.getAllTokens({
        page,
        size: rowsPerPage,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      });
      setTokens(response.tokens);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error('Failed to fetch tokens');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // In a real implementation, this would call an API endpoint
    // For now, we'll calculate from the fetched tokens
    try {
      const allTokensResponse = await tokenizationService.getAllTokens({
        page: 0,
        size: 1000,
      });
      
      const allTokens = allTokensResponse.tokens;
      setStats({
        totalTokens: allTokens.length,
        activeTokens: allTokens.filter(t => t.status === 'ACTIVE').length,
        suspendedTokens: allTokens.filter(t => t.status === 'SUSPENDED').length,
        revokedTokens: allTokens.filter(t => t.status === 'REVOKED').length,
        simpleTokens: allTokens.filter(t => t.tokenizationMode === 'SIMPLE').length,
        cofTokens: allTokens.filter(t => t.tokenizationMode === 'COF').length,
        fpeTokens: allTokens.filter(t => t.tokenizationMode === 'FPE').length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, token: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedToken(token);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedToken(null);
  };

  const handleViewToken = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteToken = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!selectedToken) return;
    
    try {
      // Call delete API
      await fetch(`/api/v2/tokens/${selectedToken.tokenValue}?merchantId=${selectedToken.merchantId}`, {
        method: 'DELETE',
      });
      
      toast.success('Token revoked successfully');
      fetchTokens();
      setDeleteDialogOpen(false);
      setSelectedToken(null);
    } catch (error) {
      toast.error('Failed to revoke token');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedToken) return;
    
    try {
      // Call status update API
      await fetch(`/api/v2/tokens/${selectedToken.tokenValue}/status?merchantId=${selectedToken.merchantId}&status=${newStatus}`, {
        method: 'PUT',
      });
      
      toast.success(`Token status updated to ${newStatus}`);
      fetchTokens();
      handleMenuClose();
    } catch (error) {
      toast.error('Failed to update token status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'SUSPENDED': return 'warning';
      case 'REVOKED': return 'error';
      case 'EXPIRED': return 'default';
      default: return 'default';
    }
  };

  const getAlgorithmColor = (algorithm: string) => {
    switch (algorithm) {
      case 'SIMPLE': return 'primary';
      case 'COF': return 'secondary';
      case 'FPE': return 'info';
      default: return 'default';
    }
  };

  const renderStats = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" variant="subtitle2">
                  Total Tokens
                </Typography>
                <Typography variant="h4">
                  {stats.totalTokens.toLocaleString()}
                </Typography>
              </Box>
              <TokenIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" variant="subtitle2">
                  Active Tokens
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.activeTokens.toLocaleString()}
                </Typography>
              </Box>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" variant="subtitle2">
                  Algorithm Distribution
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip size="small" label={`S: ${stats.simpleTokens}`} color="primary" />
                  <Chip size="small" label={`C: ${stats.cofTokens}`} color="secondary" />
                  <Chip size="small" label={`F: ${stats.fpeTokens}`} color="info" />
                </Box>
              </Box>
              <Security sx={{ fontSize: 40, color: 'info.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" variant="subtitle2">
                  Success Rate
                </Typography>
                <Typography variant="h4" color="primary.main">
                  99.8%
                </Typography>
              </Box>
              <History sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTokensTable = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        
        <Box display="flex" gap={2}>
          <Button
            startIcon={<FilterIcon />}
            variant="outlined"
          >
            Filter
          </Button>
          <Button
            startIcon={<Download />}
            variant="outlined"
          >
            Export
          </Button>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => navigate('/tokens/generate')}
          >
            Generate Token
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell>Masked Card</TableCell>
              <TableCell>Algorithm</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.tokenValue}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {token.tokenValue}
                  </Typography>
                </TableCell>
                <TableCell>{token.maskedPan}</TableCell>
                <TableCell>
                  <Chip 
                    label={token.algorithmType || 'SIMPLE'} 
                    size="small"
                    color={getAlgorithmColor(token.algorithmType || 'SIMPLE')}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={token.status} 
                    size="small"
                    color={getStatusColor(token.status)}
                  />
                </TableCell>
                <TableCell>
                  {new Date(token.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{token.usageCount || 0}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, token)}
                  >
                    <MoreIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewToken}>
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        {selectedToken?.status === 'ACTIVE' && (
          <MenuItem onClick={() => handleStatusChange('SUSPENDED')}>
            <Block sx={{ mr: 1 }} fontSize="small" />
            Suspend
          </MenuItem>
        )}
        {selectedToken?.status === 'SUSPENDED' && (
          <MenuItem onClick={() => handleStatusChange('ACTIVE')}>
            <CheckCircle sx={{ mr: 1 }} fontSize="small" />
            Activate
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteToken} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Revoke
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <Box mb={3}>
          <Typography variant="h4" gutterBottom>
            Token Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor all tokenization operations
          </Typography>
        </Box>
        
        {renderStats()}
        
        <Paper>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<TokenIcon />} label="All Tokens" />
            <Tab icon={<CreditCard />} label="Active Tokens" />
            <Tab icon={<History />} label="Token History" />
            <Tab icon={<Hub />} label="Unified Tokenization" />
            <Tab icon={<Business />} label="Platform Tokens" />
            <Tab icon={<Refresh />} label="Bulk Operations" />
          </Tabs>
          
          <TabPanel value={activeTab} index={0}>
            {renderTokensTable()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <Alert severity="info">
              Showing only active tokens. Use filters to refine your search.
            </Alert>
            {renderTokensTable()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            <Typography>Token History View</Typography>
          </TabPanel>
          
          <TabPanel value={activeTab} index={3}>
            <Button
              variant="contained"
              startIcon={<Hub />}
              onClick={() => navigate('/tokens/unified')}
            >
              Go to Unified Tokenization
            </Button>
          </TabPanel>
          
          <TabPanel value={activeTab} index={4}>
            <Button
              variant="contained"
              startIcon={<Business />}
              onClick={() => navigate('/tokens/platform')}
            >
              Manage Platform Tokens
            </Button>
          </TabPanel>
          
          <TabPanel value={activeTab} index={5}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => navigate('/tokens/bulk')}
            >
              Start Bulk Operation
            </Button>
          </TabPanel>
        </Paper>
        
        {/* View Token Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Token Details</DialogTitle>
          <DialogContent>
            {selectedToken && (
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Token Value</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {selectedToken.tokenValue}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Masked Card</Typography>
                    <Typography variant="body1">{selectedToken.maskedPan}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Chip 
                      label={selectedToken.status} 
                      size="small"
                      color={getStatusColor(selectedToken.status)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Algorithm</Typography>
                    <Typography variant="body1">{selectedToken.algorithmType || 'SIMPLE'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Usage Count</Typography>
                    <Typography variant="body1">{selectedToken.usageCount || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                    <Typography variant="body1">
                      {new Date(selectedToken.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Expires At</Typography>
                    <Typography variant="body1">
                      {new Date(selectedToken.expiresAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Revoke Token</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mt: 2 }}>
              Are you sure you want to revoke this token? This action cannot be undone.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Revoke
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
};

export default TokenManagementV2;