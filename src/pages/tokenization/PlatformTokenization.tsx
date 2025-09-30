import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  CreditCard as CardIcon,
  Business as PlatformIcon,
  Schedule as ClockIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { api } from '../../services/api';

interface Platform {
  id: number;
  platformCode: string;
  platformName: string;
  description: string;
  iconUrl?: string;
}

interface TokenType {
  typeCode: string;
  typeName: string;
  description: string;
  defaultExpiryDays: number;
  maxTokensPerCard: number;
}

const PlatformTokenization: React.FC = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [tokenTypes, setTokenTypes] = useState<TokenType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    platformId: '',
    tokenTypeCode: '',
    customerEmail: '',
    customerPhone: '',
    customerId: '',
    enableNotifications: true,
    daysBeforeExpiryNotification: 30,
    customExpiryMonths: ''
  });

  useEffect(() => {
    fetchPlatforms();
    fetchTokenTypes();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await api.get('/platform-tokens/platforms');
      setPlatforms(response.data);
    } catch (err) {
      setError('Failed to fetch platforms');
    }
  };

  const fetchTokenTypes = async () => {
    try {
      const response = await api.get('/platform-tokens/token-types');
      setTokenTypes(response.data);
    } catch (err) {
      setError('Failed to fetch token types');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      enableNotifications: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/platform-tokens/tokenize', {
        ...formData,
        platformId: parseInt(formData.platformId),
        daysBeforeExpiryNotification: parseInt(formData.daysBeforeExpiryNotification.toString()),
        customExpiryMonths: formData.customExpiryMonths ? parseInt(formData.customExpiryMonths) : null
      });

      setSuccess(`Token created successfully! Token ID: ${response.data.tokenId}`);
      
      // Reset form
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        platformId: '',
        tokenTypeCode: '',
        customerEmail: '',
        customerPhone: '',
        customerId: '',
        enableNotifications: true,
        daysBeforeExpiryNotification: 30,
        customExpiryMonths: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create token');
    } finally {
      setLoading(false);
    }
  };

  const selectedTokenType = tokenTypes.find(t => t.typeCode === formData.tokenTypeCode);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <CardIcon sx={{ mr: 2 }} />
        {t('Platform-Based Tokenization')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Card Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('Card Number')}
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    inputProps={{ maxLength: 19 }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('Expiry Date')}
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('CVV')}
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    type="password"
                    required
                    inputProps={{ maxLength: 4 }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Platform & Token Configuration
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('Select Platform')}</InputLabel>
                    <Select
                      value={formData.platformId}
                      onChange={handleSelectChange('platformId')}
                      label={t('Select Platform')}
                    >
                      {platforms.map(platform => (
                        <MenuItem key={platform.id} value={platform.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PlatformIcon sx={{ mr: 1, fontSize: 20 }} />
                            {platform.platformName}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('Token Type')}</InputLabel>
                    <Select
                      value={formData.tokenTypeCode}
                      onChange={handleSelectChange('tokenTypeCode')}
                      label={t('Token Type')}
                    >
                      {tokenTypes.map(type => (
                        <MenuItem key={type.typeCode} value={type.typeCode}>
                          <Box>
                            <Typography variant="body2">{type.typeName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('Custom Expiry (months)')}
                    name="customExpiryMonths"
                    value={formData.customExpiryMonths}
                    onChange={handleInputChange}
                    type="number"
                    helperText={selectedTokenType ? 
                      `Default: ${Math.floor(selectedTokenType.defaultExpiryDays / 30)} months` : 
                      'Leave empty for default'
                    }
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('Customer Email')}
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    type="email"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('Customer Phone')}
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="+919999999999"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('Customer ID')}
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.enableNotifications}
                        onChange={handleSwitchChange}
                      />
                    }
                    label={t('Enable Expiry Notifications')}
                  />
                </Grid>

                {formData.enableNotifications && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('Days Before Expiry Notification')}
                      name="daysBeforeExpiryNotification"
                      value={formData.daysBeforeExpiryNotification}
                      onChange={handleInputChange}
                      type="number"
                      inputProps={{ min: 7, max: 90 }}
                    />
                  </Grid>
                )}
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CardIcon />}
                >
                  {loading ? t('Creating...') : t('Create Platform Token')}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <NotificationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {t('Token Features')}
              </Typography>
              
              {selectedTokenType && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedTokenType.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip
                      icon={<ClockIcon />}
                      label={`Default Expiry: ${selectedTokenType.defaultExpiryDays} days`}
                      size="small"
                    />
                    <Chip
                      icon={<CardIcon />}
                      label={`Max Tokens per Card: ${selectedTokenType.maxTokensPerCard}`}
                      size="small"
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('Security Features')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  • AES-256-GCM encryption for all data
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Platform-isolated tokens
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Automatic expiry management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Real-time fraud detection
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlatformTokenization;