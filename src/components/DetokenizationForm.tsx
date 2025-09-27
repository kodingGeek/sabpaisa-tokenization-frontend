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
  InputAdornment
} from '@mui/material';
import {
  Key,
  CreditCard,
  Lock
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import tokenizationService, { DetokenizeRequest, TokenResponse } from '../services/tokenizationService';
import { toast } from 'react-toastify';

const DetokenizationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<DetokenizeRequest>();

  const onSubmit = async (data: DetokenizeRequest) => {
    setLoading(true);
    setTokenResponse(null);
    
    try {
      const response = await tokenizationService.detokenize(data);
      
      if (response.success) {
        setTokenResponse(response);
        toast.success('Token verified successfully!');
        reset();
      } else {
        toast.error(response.message || 'Detokenization failed');
      }
    } catch (error) {
      toast.error('Failed to detokenize. Please check your token and merchant ID.');
      console.error('Detokenization error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Lock sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Token Verification
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Verify and retrieve masked card information for a token
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Token"
                  placeholder="Enter 16-digit token"
                  {...register('token', {
                    required: 'Token is required',
                    pattern: {
                      value: /^[0-9]{16}$/,
                      message: 'Token must be exactly 16 digits'
                    }
                  })}
                  error={!!errors.token}
                  helperText={errors.token?.message || 'Enter the 16-digit token'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Key />
                      </InputAdornment>
                    ),
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
                  startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
                >
                  {loading ? 'Verifying...' : 'Verify Token'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {tokenResponse && (
            <>
              <Divider sx={{ my: 4 }} />
              
              <Alert severity="success" sx={{ mb: 3 }}>
                Token verified successfully!
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Masked Card Number
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                        {tokenResponse.maskedPan}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Token Status
                    </Typography>
                    <Chip
                      label={tokenResponse.status}
                      color={tokenResponse.status === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Token Value
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                      {tokenResponse.tokenValue}
                    </Typography>
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

export default DetokenizationForm;