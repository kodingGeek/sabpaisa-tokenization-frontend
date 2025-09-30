import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  CreditCard as CardIcon,
  Business as PlatformIcon,
  Schedule as ClockIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

interface CardToken {
  tokenId: number;
  tokenValue: string;
  platformName: string;
  tokenType: string;
  expiryDate: string;
  isActive: boolean;
}

const CardTokenView: React.FC = () => {
  const { t } = useTranslation();
  const [cardHash, setCardHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokens, setTokens] = useState<CardToken[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedToken, setSelectedToken] = useState<CardToken | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'refresh' | 'delete'>('refresh');

  const handleSearch = async () => {
    if (!cardHash.trim()) {
      setError('Please enter a card hash');
      return;
    }

    setLoading(true);
    setError('');
    setTokens([]);
    setSearched(false);

    try {
      const response = await api.get(`/platform-tokens/card/${cardHash}`);
      setTokens(response.data);
      setSearched(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tokens');
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenAction = (token: CardToken, action: 'refresh' | 'delete') => {
    setSelectedToken(token);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedToken) return;

    try {
      if (actionType === 'refresh') {
        await api.post(`/platform-tokens/${selectedToken.tokenId}/refresh`);
        setError('');
        handleSearch(); // Refresh the list
      } else if (actionType === 'delete') {
        await api.delete(`/platform-tokens/${selectedToken.tokenId}`);
        setError('');
        handleSearch(); // Refresh the list
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed');
    }

    setActionDialogOpen(false);
    setSelectedToken(null);
  };

  const getTokenTypeColor = (type: string) => {
    switch (type) {
      case 'COF': return 'primary';
      case 'FPT': return 'secondary';
      case 'OTT': return 'warning';
      case 'GUEST': return 'info';
      case 'SUBSCRIPTION': return 'success';
      default: return 'default';
    }
  };

  const formatExpiryDate = (date: string) => {
    const expiryDate = new Date(date);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      formatted: expiryDate.toLocaleDateString(),
      daysUntilExpiry,
      isExpiringSoon: daysUntilExpiry <= 30 && daysUntilExpiry > 0,
      isExpired: daysUntilExpiry < 0
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <CardIcon sx={{ mr: 2 }} />
        {t('Card Token View')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('Search Tokens by Card')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            label={t('Card Hash')}
            value={cardHash}
            onChange={(e) => setCardHash(e.target.value)}
            placeholder="Enter card hash to search tokens"
            helperText="Card hash is a unique identifier for a card across platforms"
          />
          
          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            sx={{ minWidth: 150 }}
          >
            {loading ? t('Searching...') : t('Search')}
          </Button>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {searched && tokens.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('No tokens found for this card')}
        </Alert>
      )}

      {tokens.length > 0 && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {t('Total Tokens')}
                  </Typography>
                  <Typography variant="h4">
                    {tokens.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {t('Active Tokens')}
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {tokens.filter(t => t.isActive).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {t('Platforms')}
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {new Set(tokens.map(t => t.platformName)).size}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {t('Expiring Soon')}
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {tokens.filter(t => {
                      const expiry = formatExpiryDate(t.expiryDate);
                      return expiry.isExpiringSoon && !expiry.isExpired;
                    }).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Token Value')}</TableCell>
                  <TableCell>{t('Platform')}</TableCell>
                  <TableCell>{t('Token Type')}</TableCell>
                  <TableCell>{t('Expiry Date')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
                  <TableCell align="center">{t('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens.map((token) => {
                  const expiry = formatExpiryDate(token.expiryDate);
                  
                  return (
                    <TableRow key={token.tokenId}>
                      <TableCell>{token.tokenValue}</TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PlatformIcon sx={{ mr: 1, fontSize: 20 }} />
                          {token.platformName}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={token.tokenType}
                          size="small"
                          color={getTokenTypeColor(token.tokenType) as any}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {expiry.formatted}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={
                              expiry.isExpired ? 'error' :
                              expiry.isExpiringSoon ? 'warning.main' :
                              'text.secondary'
                            }
                          >
                            {expiry.isExpired ? 
                              `Expired ${Math.abs(expiry.daysUntilExpiry)} days ago` :
                              `${expiry.daysUntilExpiry} days remaining`
                            }
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          icon={token.isActive ? <ActiveIcon /> : <InactiveIcon />}
                          label={token.isActive ? 'Active' : 'Inactive'}
                          color={token.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        <Tooltip title={t('Refresh Token')}>
                          <IconButton
                            size="small"
                            onClick={() => handleTokenAction(token, 'refresh')}
                            disabled={!token.isActive}
                          >
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={t('Delete Token')}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleTokenAction(token, 'delete')}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>
          {actionType === 'refresh' ? t('Refresh Token') : t('Delete Token')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === 'refresh' ? 
              t('Are you sure you want to refresh this token? A new token will be generated.') :
              t('Are you sure you want to delete this token? This action cannot be undone.')
            }
          </Typography>
          {selectedToken && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>{t('Platform')}:</strong> {selectedToken.platformName}
              </Typography>
              <Typography variant="body2">
                <strong>{t('Token')}:</strong> {selectedToken.tokenValue}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>
            {t('Cancel')}
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            color={actionType === 'delete' ? 'error' : 'primary'}
          >
            {t('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CardTokenView;