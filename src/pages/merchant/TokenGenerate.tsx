import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormControlLabel,
  Switch,
  InputAdornment,
  Chip,
} from '@mui/material';
import { CreditCard, Security } from '@mui/icons-material';
import { toast } from 'react-toastify';
import tokenizationService from '../../services/tokenizationService';
import { useMerchant } from '../../contexts/MerchantContext';

const TokenGenerate: React.FC = () => {
  const { merchants, selectedMerchantId, loading: loadingMerchants } = useMerchant();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Store form data in state instead of react-hook-form
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardholderName: '',
    algorithmType: 'SIMPLE',
    tokenType: 'FPT',
    purpose: 'ECOMMERCE',
    domain: '',
    merchantId: selectedMerchantId || '',
    customerId: '',
    customerEmail: '',
    customerPhone: '',
    transactionId: '',
    transactionAmount: '',
    transactionCurrency: 'INR',
    isCof: false,
    cofContractId: '',
    cofInitialTransactionId: ''
  });
  
  const [tokenResult, setTokenResult] = useState<any>(null);
  
  // Update merchantId when selectedMerchantId changes
  useEffect(() => {
    if (selectedMerchantId) {
      setFormData(prev => ({ ...prev, merchantId: selectedMerchantId }));
    }
  }, [selectedMerchantId]);

  const steps = ['Card Details', 'Algorithm & Configuration', 'Additional Details', 'Review & Generate', 'Token Generated'];

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
    
    if (!formData.merchantId) {
      toast.error('Please select a merchant');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        cardNumber: cleanCardNumber,
        merchantId: formData.merchantId,
        algorithmType: formData.algorithmType,
        customerId: formData.customerId || undefined,
        customerEmail: formData.customerEmail || undefined,
        customerPhone: formData.customerPhone || undefined,
        transactionId: formData.transactionId || undefined,
        transactionAmount: formData.transactionAmount ? parseFloat(formData.transactionAmount) : undefined,
        transactionCurrency: formData.transactionCurrency || 'INR',
        isCof: formData.isCof,
        cofContractId: formData.isCof ? formData.cofContractId : undefined,
        cofInitialTransactionId: formData.isCof ? formData.cofInitialTransactionId : undefined
      };
      
      // Call v2 API for enhanced tokenization
      const response = await tokenizationService.tokenizeV2(payload);
      
      console.log('API Response:', response);
      
      if (response.success) {
        setTokenResult(response);
        setActiveStep(4);
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
              <FormControl fullWidth disabled={loadingMerchants}>
                <InputLabel>Select Merchant</InputLabel>
                <Select
                  value={formData.merchantId}
                  onChange={(e) => handleFieldChange('merchantId', e.target.value)}
                  label="Select Merchant"
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
            </Grid>
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
              <FormControl fullWidth>
                <InputLabel>Tokenization Algorithm</InputLabel>
                <Select
                  value={formData.algorithmType}
                  onChange={(e) => handleFieldChange('algorithmType', e.target.value)}
                  label="Tokenization Algorithm"
                >
                  <MenuItem value="SIMPLE">
                    <Box>
                      <Typography variant="body1">Simple</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Random 16-digit numeric token
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="COF">
                    <Box>
                      <Typography variant="body1">Card-on-File (COF)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Deterministic token for recurring payments
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="FPE">
                    <Box>
                      <Typography variant="body1">Format Preserving Encryption (FPE)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Maintains card format and Luhn validity
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isCof}
                    onChange={(e) => handleFieldChange('isCof', e.target.checked.toString())}
                  />
                }
                label="Card-on-File (COF) Transaction"
              />
            </Grid>
            
            {formData.isCof && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="COF Contract ID"
                    value={formData.cofContractId}
                    onChange={(e) => handleFieldChange('cofContractId', e.target.value)}
                    required={formData.isCof}
                    helperText="Unique identifier for the COF agreement"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Initial Transaction ID"
                    value={formData.cofInitialTransactionId}
                    onChange={(e) => handleFieldChange('cofInitialTransactionId', e.target.value)}
                    required={formData.isCof}
                    helperText="ID of the first transaction in this COF series"
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Alert severity="info">
                {formData.algorithmType === 'SIMPLE' && 
                  "Simple algorithm generates a random 16-digit token for general use cases."}
                {formData.algorithmType === 'COF' && 
                  "COF algorithm generates deterministic tokens ideal for subscription and recurring payments."}
                {formData.algorithmType === 'FPE' && 
                  "FPE algorithm preserves the format of the original card number while maintaining security."}
              </Alert>
            </Grid>
          </Grid>
        );
        
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Customer Information (Optional)</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Customer ID"
                value={formData.customerId}
                onChange={(e) => handleFieldChange('customerId', e.target.value)}
                helperText="Your internal customer identifier"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Customer Email"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleFieldChange('customerEmail', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Customer Phone"
                value={formData.customerPhone}
                onChange={(e) => handleFieldChange('customerPhone', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Transaction Details (Optional)</Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Transaction ID"
                value={formData.transactionId}
                onChange={(e) => handleFieldChange('transactionId', e.target.value)}
                helperText="Reference to the original transaction"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Transaction Amount"
                type="number"
                value={formData.transactionAmount}
                onChange={(e) => handleFieldChange('transactionAmount', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.transactionCurrency}
                  onChange={(e) => handleFieldChange('transactionCurrency', e.target.value)}
                  label="Currency"
                >
                  <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="GBP">GBP - British Pound</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Review your information before generating the token
            </Alert>
            
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Card Information</Typography>
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Merchant</Typography>
                  <Typography variant="body1">
                    {merchants.find(m => m.merchantId === formData.merchantId)?.businessName || formData.merchantId || 'Not selected'}
                  </Typography>
                </Grid>
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
                  algorithmType: 'SIMPLE',
                  tokenType: 'FPT',
                  purpose: 'ECOMMERCE',
                  domain: '',
                  merchantId: merchants.length === 1 ? merchants[0].merchantId : '',
                  customerId: '',
                  customerEmail: '',
                  customerPhone: '',
                  transactionId: '',
                  transactionAmount: '',
                  transactionCurrency: 'INR',
                  isCof: false,
                  cofContractId: '',
                  cofInitialTransactionId: ''
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
          Generate Token
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
        
      </Box>
    </DashboardLayout>
  );
};

export default TokenGenerate;