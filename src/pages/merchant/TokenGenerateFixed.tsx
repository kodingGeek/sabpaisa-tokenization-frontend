import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { CreditCard, Security } from '@mui/icons-material';
import { toast } from 'react-toastify';
import tokenizationService from '../../services/tokenizationService';

const TokenGenerateFixed: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Store form data in state instead of react-hook-form
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardholderName: '',
    tokenType: 'FPT',
    purpose: 'ECOMMERCE',
    domain: ''
  });
  
  const [tokenResult, setTokenResult] = useState<any>(null);

  const steps = ['Card Details', 'Token Configuration', 'Review & Generate', 'Token Generated'];

  const handleFieldChange = (field: string, value: string) => {
    console.log(`Field ${field} changed to:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log('Updated form data:', { ...formData, [field]: value });
  };

  const handleNext = () => {
    console.log('Moving to next step. Current form data:', formData);
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    console.log('Submitting form with data:', formData);
    
    const cleanCardNumber = formData.cardNumber.replace(/\D/g, '');
    console.log('Cleaned card number:', cleanCardNumber);
    
    if (!cleanCardNumber) {
      toast.error('Please enter a card number');
      return;
    }

    setLoading(true);
    try {
      const response = await tokenizationService.tokenize({
        cardNumber: cleanCardNumber,
        merchantId: 'MERCH001'
      });
      
      console.log('API Response:', response);
      
      if (response.success) {
        setTokenResult(response);
        setActiveStep(3);
        toast.success('Token generated successfully!');
      } else {
        toast.error(response.message || 'Tokenization failed');
      }
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                value={formData.cardNumber}
                onChange={(e) => handleFieldChange('cardNumber', e.target.value)}
                placeholder="Enter card number"
                InputProps={{
                  startAdornment: <CreditCard sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Month"
                value={formData.expiryMonth}
                onChange={(e) => handleFieldChange('expiryMonth', e.target.value)}
                placeholder="MM"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Year"
                value={formData.expiryYear}
                onChange={(e) => handleFieldChange('expiryYear', e.target.value)}
                placeholder="YYYY"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cardholder Name"
                value={formData.cardholderName}
                onChange={(e) => handleFieldChange('cardholderName', e.target.value)}
              />
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Token Type"
                value={formData.tokenType}
                onChange={(e) => handleFieldChange('tokenType', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose"
                value={formData.purpose}
                onChange={(e) => handleFieldChange('purpose', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Domain (Optional)"
                value={formData.domain}
                onChange={(e) => handleFieldChange('domain', e.target.value)}
              />
            </Grid>
          </Grid>
        );
        
      case 2:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Review your information before generating the token
            </Alert>
            
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Card Information</Typography>
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Card Number</Typography>
                  <Typography variant="body1">
                    {formData.cardNumber || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Cardholder</Typography>
                  <Typography variant="body1">
                    {formData.cardholderName || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Expiry</Typography>
                  <Typography variant="body1">
                    {formData.expiryMonth}/{formData.expiryYear}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Token Type</Typography>
                  <Typography variant="body1">{formData.tokenType}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
        
      case 3:
        return (
          <Box textAlign="center">
            <Typography variant="h5" gutterBottom>
              Token Generated Successfully!
            </Typography>
            {tokenResult && (
              <Box sx={{ mt: 3, p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Token</Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                      {tokenResult.tokenValue}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Masked Card</Typography>
                    <Typography variant="body1">{tokenResult.maskedPan}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Typography variant="body1">{tokenResult.status}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => {
                setActiveStep(0);
                setFormData({
                  cardNumber: '',
                  expiryMonth: '',
                  expiryYear: '',
                  cardholderName: '',
                  tokenType: 'FPT',
                  purpose: 'ECOMMERCE',
                  domain: ''
                });
                setTokenResult(null);
              }}
            >
              Generate Another Token
            </Button>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Generate Token (Fixed Version)
        </Typography>
        
        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {renderStepContent(activeStep)}
            
            {activeStep < 3 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                
                <Box>
                  {activeStep === 2 ? (
                    <Button
                      variant="contained"
                      startIcon={loading ? null : <Security />}
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? 'Generating...' : 'Generate Token'}
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          This is a fixed version using simple state management instead of react-hook-form.
          Check console for all logged values.
        </Alert>
      </Box>
    </DashboardLayout>
  );
};

export default TokenGenerateFixed;