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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import {
  CreditCard,
  Security,
  Info,
  ContentCopy,
  Download,
  CheckCircle,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import tokenizationService from '../../services/tokenizationService';

interface TokenGenerationForm {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  tokenType: string;
  purpose: string;
  domain: string;
}

const TokenGenerate: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  
  const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm<TokenGenerationForm>({
    defaultValues: {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cardholderName: '',
      tokenType: 'FPT',
      purpose: 'ECOMMERCE',
      domain: ''
    }
  });

  const steps = ['Card Details', 'Token Configuration', 'Review & Generate', 'Token Generated'];

  const tokenTypes = [
    { value: 'FPT', label: 'Format Preserving Token', description: 'Maintains card number format' },
    { value: 'RANDOM', label: 'Random Token', description: 'Completely random secure token' },
    { value: 'COF', label: 'Card-on-File', description: 'For recurring transactions' },
    { value: 'DOMAIN', label: 'Domain Restricted', description: 'Limited to specific domains' },
  ];

  const onSubmit = async (data: TokenGenerationForm) => {
    console.log('Form data received:', data); // Debug log
    
    // Clean card number by removing all non-digits
    const cleanCardNumber = data.cardNumber?.replace(/\D/g, '') || '';
    
    console.log('Cleaned card number:', cleanCardNumber); // Debug log
    
    // Skip validation - just send to API
    if (!cleanCardNumber) {
      toast.error('Please enter a card number');
      return;
    }
    
    try {
      // Call actual tokenization API
      const response = await tokenizationService.tokenize({
        cardNumber: cleanCardNumber, // Use cleaned number
        merchantId: 'MERCH001' // Using default merchant ID
      });
      
      if (response.success) {
        setGeneratedToken(response.tokenValue);
        setTokenDetails({
          token: response.tokenValue,
          maskedCard: response.maskedPan,
          type: data.tokenType,
          createdAt: new Date().toISOString(),
          expiresAt: response.expiresAt,
          status: response.status,
        });
        setActiveStep(3);
        toast.success('Token generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate token');
      }
    } catch (error) {
      console.error('Tokenization error:', error);
      toast.error('Failed to generate token. Please check your connection.');
    }
  };

  const handleNext = () => {
    // Just move to next step without validation
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setGeneratedToken('');
    setTokenDetails(null);
    reset();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard!');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="cardNumber"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Card number is required'
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Card Number"
                    fullWidth
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber?.message || 'Enter 13-19 digit card number'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCard />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="1234567812345678"
                    onChange={(e) => {
                      // Allow user to type naturally, we'll clean it when submitting
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={6}>
              <Controller
                name="expiryMonth"
                control={control}
                defaultValue=""
                rules={{}}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.expiryMonth}>
                    <InputLabel>Expiry Month</InputLabel>
                    <Select {...field} label="Expiry Month">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <MenuItem key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.expiryMonth && (
                      <FormHelperText>{errors.expiryMonth.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={6}>
              <Controller
                name="expiryYear"
                control={control}
                defaultValue=""
                rules={{}}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.expiryYear}>
                    <InputLabel>Expiry Year</InputLabel>
                    <Select {...field} label="Expiry Year">
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <MenuItem key={year} value={year.toString()}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.expiryYear && (
                      <FormHelperText>{errors.expiryYear.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="cardholderName"
                control={control}
                defaultValue=""
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cardholder Name"
                    fullWidth
                    error={!!errors.cardholderName}
                    helperText={errors.cardholderName?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="tokenType"
                control={control}
                defaultValue=""
                rules={{}}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.tokenType}>
                    <InputLabel>Token Type</InputLabel>
                    <Select {...field} label="Token Type">
                      {tokenTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box>
                            <Typography variant="body1">{type.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.tokenType && (
                      <FormHelperText>{errors.tokenType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="purpose"
                control={control}
                defaultValue=""
                rules={{}}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.purpose}>
                    <InputLabel>Purpose</InputLabel>
                    <Select {...field} label="Purpose">
                      <MenuItem value="ECOMMERCE">E-commerce Transaction</MenuItem>
                      <MenuItem value="RECURRING">Recurring Payment</MenuItem>
                      <MenuItem value="SUBSCRIPTION">Subscription</MenuItem>
                      <MenuItem value="CARD_ON_FILE">Card on File</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                    {errors.purpose && (
                      <FormHelperText>{errors.purpose.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="domain"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Domain Restriction (Optional)"
                    fullWidth
                    helperText="Leave empty for unrestricted access"
                    placeholder="example.com"
                  />
                )}
              />
            </Grid>
          </Grid>
        );
        
      case 2:
        const formValues = getValues();
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review the details before generating the token
            </Alert>
            
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Card Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Card Number</Typography>
                  <Typography variant="body1">
                    {formValues.cardNumber?.substring(0, 4) || '****'}****{formValues.cardNumber?.substring(formValues.cardNumber.length - 4) || '****'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Cardholder</Typography>
                  <Typography variant="body1">{formValues.cardholderName || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Token Type</Typography>
                  <Typography variant="body1">
                    {tokenTypes.find(t => t.value === formValues.tokenType)?.label || 'Not selected'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Purpose</Typography>
                  <Typography variant="body1">{formValues.purpose || 'Not selected'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );
        
      case 3:
        return (
          <Box textAlign="center">
            <CheckCircle color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Token Generated Successfully!
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your Secure Token
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <Typography variant="h6" fontFamily="monospace">
                  {generatedToken}
                </Typography>
                <Tooltip title="Copy to clipboard">
                  <IconButton size="small" onClick={() => copyToClipboard(generatedToken)}>
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
            
            {tokenDetails && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Masked Card</Typography>
                  <Typography variant="body1">{tokenDetails.maskedCard}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Token Type</Typography>
                  <Typography variant="body1">{tokenDetails.type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip label={tokenDetails.status} color="success" size="small" />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Expires</Typography>
                  <Typography variant="body1">
                    {new Date(tokenDetails.expiresAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{ mr: 2 }}
                onClick={() => toast.info('Download functionality will be implemented')}
              >
                Download Details
              </Button>
              <Button variant="contained" onClick={handleReset}>
                Generate Another Token
              </Button>
            </Box>
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
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}
            
            {activeStep < 3 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                
                <Box>
                  {activeStep === 2 ? (
                    <Button
                      variant="contained"
                      type="submit"
                      startIcon={<Security />}
                    >
                      Generate Token
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </form>
        </CardContent>
      </Card>
      
      <Alert severity="info" icon={<Info />} sx={{ mt: 2 }}>
        All card data is encrypted using AES-256 encryption and tokenized using PCI DSS compliant methods.
        Tokens are stored in our secure vault with restricted access.
      </Alert>
      </Box>
    </DashboardLayout>
  );
};

export default TokenGenerate;