import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import api, { bulkApi, mockApi } from '../../services/api';

interface BulkRequest {
  requestId: string;
  status: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  startTime: string;
  endTime?: string;
  results?: RetokenizationResult[];
}

interface RetokenizationResult {
  oldTokenId: number;
  oldTokenValue: string;
  newTokenId?: number;
  newTokenValue?: string;
  cardLast4: string;
  success: boolean;
  message: string;
}

const BulkRetokenization: React.FC = () => {
  const { t } = useTranslation();
  
  const [criteria, setCriteria] = useState('EXPIRED');
  const [daysBeforeExpiry, setDaysBeforeExpiry] = useState('30');
  const [platformId, setPlatformId] = useState('');
  const [tokenIds, setTokenIds] = useState('');
  const [dateRange, setDateRange] = useState<{start: Dayjs | null, end: Dayjs | null}>({
    start: null,
    end: null
  });
  const [newExpiryMonths, setNewExpiryMonths] = useState('12');
  const [sendNotification, setSendNotification] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentRequest, setCurrentRequest] = useState<BulkRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const requestData: any = {
        selectionCriteria: criteria,
        newExpiryMonths: parseInt(newExpiryMonths),
        sendNotification
      };
      
      switch (criteria) {
        case 'EXPIRING_SOON':
          requestData.daysBeforeExpiry = parseInt(daysBeforeExpiry);
          break;
        case 'SPECIFIC_PLATFORM':
          requestData.platformId = parseInt(platformId);
          break;
        case 'SPECIFIC_TOKENS':
          requestData.tokenIds = tokenIds.split(',').map(id => parseInt(id.trim()));
          break;
        case 'DATE_RANGE':
          requestData.startDate = dateRange.start?.toISOString();
          requestData.endDate = dateRange.end?.toISOString();
          break;
      }
      
      const response = await api.post('/tokens/bulk/retokenize', requestData);
      setCurrentRequest(response.data);
      
      // Poll for status updates
      pollStatus(response.data.requestId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start bulk retokenization');
    } finally {
      setLoading(false);
    }
  };
  
  const pollStatus = async (requestId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/tokens/bulk/status/${requestId}`);
        setCurrentRequest(response.data);
        
        if (response.data.status === 'COMPLETED' || response.data.status === 'FAILED') {
          clearInterval(interval);
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds
  };
  
  const downloadReport = () => {
    if (!currentRequest) return;
    
    const csv = [
      ['Old Token ID', 'Old Token', 'New Token ID', 'New Token', 'Card Last 4', 'Status', 'Message'],
      ...(currentRequest.results || []).map(r => [
        r.oldTokenId,
        r.oldTokenValue,
        r.newTokenId || '',
        r.newTokenValue || '',
        r.cardLast4,
        r.success ? 'Success' : 'Failed',
        r.message
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retokenization-report-${currentRequest.requestId}.csv`;
    a.click();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <RefreshIcon sx={{ mr: 2 }} />
        {t('Bulk Retokenization')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('Selection Criteria')}
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup value={criteria} onChange={(e) => setCriteria(e.target.value)}>
                <FormControlLabel 
                  value="EXPIRED" 
                  control={<Radio />} 
                  label={t('All Expired Tokens')} 
                />
                <FormControlLabel 
                  value="EXPIRING_SOON" 
                  control={<Radio />} 
                  label={t('Tokens Expiring Soon')} 
                />
                <FormControlLabel 
                  value="SPECIFIC_PLATFORM" 
                  control={<Radio />} 
                  label={t('Tokens for Specific Platform')} 
                />
                <FormControlLabel 
                  value="SPECIFIC_TOKENS" 
                  control={<Radio />} 
                  label={t('Specific Token IDs')} 
                />
                <FormControlLabel 
                  value="DATE_RANGE" 
                  control={<Radio />} 
                  label={t('Tokens Expiring in Date Range')} 
                />
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ mt: 3 }}>
              {criteria === 'EXPIRING_SOON' && (
                <TextField
                  fullWidth
                  label={t('Days Before Expiry')}
                  value={daysBeforeExpiry}
                  onChange={(e) => setDaysBeforeExpiry(e.target.value)}
                  type="number"
                  inputProps={{ min: 1, max: 90 }}
                />
              )}
              
              {criteria === 'SPECIFIC_PLATFORM' && (
                <TextField
                  fullWidth
                  label={t('Platform ID')}
                  value={platformId}
                  onChange={(e) => setPlatformId(e.target.value)}
                  type="number"
                />
              )}
              
              {criteria === 'SPECIFIC_TOKENS' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('Token IDs (comma separated)')}
                  value={tokenIds}
                  onChange={(e) => setTokenIds(e.target.value)}
                  helperText="e.g., 123, 456, 789"
                />
              )}
              
              {criteria === 'DATE_RANGE' && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <DatePicker
                      label={t('Start Date')}
                      value={dateRange.start}
                      onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                    <DatePicker
                      label={t('End Date')}
                      value={dateRange.end}
                      onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Box>
                </LocalizationProvider>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('New Token Configuration')}
            </Typography>
            
            <TextField
              fullWidth
              label={t('New Token Expiry (months)')}
              value={newExpiryMonths}
              onChange={(e) => setNewExpiryMonths(e.target.value)}
              type="number"
              inputProps={{ min: 1, max: 60 }}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                />
              }
              label={t('Send notification to customers')}
            />
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={<RefreshIcon />}
              >
                {loading ? t('Processing...') : t('Start Bulk Retokenization')}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {currentRequest && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {t('Current Request Status')}
            </Typography>
            
            <Box>
              <IconButton onClick={() => setDetailsOpen(true)}>
                <ViewIcon />
              </IconButton>
              <IconButton onClick={downloadReport} disabled={currentRequest.status !== 'COMPLETED'}>
                <DownloadIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" color="text.secondary">
                {t('Request ID')}
              </Typography>
              <Typography variant="body1">
                {currentRequest.requestId}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" color="text.secondary">
                {t('Status')}
              </Typography>
              <Chip
                icon={
                  currentRequest.status === 'COMPLETED' ? <SuccessIcon /> :
                  currentRequest.status === 'FAILED' ? <ErrorIcon /> :
                  <PendingIcon />
                }
                label={currentRequest.status}
                color={
                  currentRequest.status === 'COMPLETED' ? 'success' :
                  currentRequest.status === 'FAILED' ? 'error' :
                  'warning'
                }
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" color="text.secondary">
                {t('Progress')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={currentRequest.totalProcessed > 0 ? 
                    (currentRequest.successCount + currentRequest.failureCount) / currentRequest.totalProcessed * 100 : 0
                  }
                  sx={{ flexGrow: 1 }}
                />
                <Typography variant="caption">
                  {currentRequest.successCount + currentRequest.failureCount}/{currentRequest.totalProcessed}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" color="text.secondary">
                {t('Success Rate')}
              </Typography>
              <Typography variant="h6" color={currentRequest.failureCount > 0 ? 'warning.main' : 'success.main'}>
                {currentRequest.totalProcessed > 0 ?
                  Math.round(currentRequest.successCount / currentRequest.totalProcessed * 100) : 0
                }%
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t('Retokenization Details')}</DialogTitle>
        <DialogContent>
          {currentRequest?.results && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('Old Token')}</TableCell>
                    <TableCell>{t('New Token')}</TableCell>
                    <TableCell>{t('Card Last 4')}</TableCell>
                    <TableCell>{t('Status')}</TableCell>
                    <TableCell>{t('Message')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRequest.results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.oldTokenValue}</TableCell>
                      <TableCell>{result.newTokenValue || '-'}</TableCell>
                      <TableCell>{result.cardLast4}</TableCell>
                      <TableCell>
                        <Chip
                          label={result.success ? 'Success' : 'Failed'}
                          color={result.success ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{result.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>{t('Close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkRetokenization;