import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  CreditCard,
  Security,
  ContentCopy,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import tokenizationService, { TokenizeRequest, TokenResponse } from '../services/tokenizationService';
import { toast } from 'react-toastify';

const TokenizationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(null);
  const [showFullCard, setShowFullCard] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TokenizeRequest>();

  const onSubmit = async (data: TokenizeRequest) => {
    setLoading(true);
    setTokenResponse(null);
    
    try {
      const response = await tokenizationService.tokenize(data);
      
      if (response.success) {
        setTokenResponse(response);
        toast.success('Card tokenized successfully!');
        reset();
      } else {
        toast.error(response.message || 'Tokenization failed');
      }
    } catch (error) {
      toast.error('Failed to tokenize card. Please try again.');
      console.error('Tokenization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.info(`${label} copied to clipboard`);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Security sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Card Tokenization
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Securely tokenize payment cards for safe storage and processing
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  placeholder="4111 1111 1111 1111"
                  {...register('cardNumber', {
                    required: 'Card number is required',
                    pattern: {
                      value: /^[0-9\s]{13,19}$/,
                      message: 'Invalid card number format'
                    }
                  })}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber?.message || 'Enter 13-19 digit card number'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowFullCard(!showFullCard)}
                          edge="end"
                          size="small"
                        >
                          {showFullCard ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    type: showFullCard ? 'text' : 'password'
                  }}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    e.target.value = formatted;
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Merchant ID"
                  placeholder="MERCH001"
                  {...register('merchantId', {
                    required: 'Merchant ID is required'
                  })}
                  error={!!errors.merchantId}
                  helperText={errors.merchantId?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Security />}
                >
                  {loading ? 'Tokenizing...' : 'Tokenize Card'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {tokenResponse && (
            <>
              <Divider sx={{ my: 4 }} />
              
              <Alert severity="success" sx={{ mb: 3 }}>
                Card successfully tokenized! Store the token securely.
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Token Value
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="h6" sx={{ fontFamily: 'monospace', mr: 2 }}>
                        {tokenResponse.tokenValue}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(tokenResponse.tokenValue, 'Token')}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Masked Card
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontFamily: 'monospace' }}>
                      {tokenResponse.maskedPan}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={tokenResponse.status}
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Expires At
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {new Date(tokenResponse.expiresAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TokenizationForm;