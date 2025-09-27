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
  Grid,
} from '@mui/material';
import { CreditCard } from '@mui/icons-material';
import tokenizationService from '../services/tokenizationService';
import { toast } from 'react-toastify';
import DashboardLayout from '../layouts/DashboardLayout';

const SimpleTokenize: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await tokenizationService.tokenize({
        cardNumber: cardNumber.replace(/\s/g, ''), // Remove spaces
        merchantId: 'MERCH001'
      });

      if (response.success) {
        setResult(response);
        toast.success('Token generated successfully!');
        setCardNumber('');
      } else {
        setError(response.message || 'Tokenization failed');
        toast.error(response.message || 'Tokenization failed');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to tokenize card';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Simple Tokenization Test
        </Typography>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Enter card number (e.g., 4111111111111111)"
                    InputProps={{
                      startAdornment: <CreditCard sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    helperText="No validation - enter any card number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || !cardNumber.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : <CreditCard />}
                  >
                    {loading ? 'Processing...' : 'Tokenize Card'}
                  </Button>
                </Grid>
              </Grid>
            </form>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            {result && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Tokenization Successful!
                </Alert>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Token Value
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {result.tokenValue}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Masked Card
                    </Typography>
                    <Typography variant="body1">
                      {result.maskedPan}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1">
                      {result.status}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Test Cards:</strong><br />
                • 4111111111111111 (Visa)<br />
                • 5555555555554444 (Mastercard)<br />
                • 3530111333300000 (JCB)<br />
                • 378282246310005 (Amex)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default SimpleTokenize;