import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  MenuItem,
  Box,
  Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

interface AddMerchantDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface MerchantFormData {
  businessName: string;
  email: string;
  phoneNumber: string;
  businessType: string;
  businessAddress: string;
  panNumber: string;
  gstNumber: string;
  webhookUrl: string;
  settings: {
    allowRefunds: boolean;
    allowPartialRefunds: boolean;
    tokenExpiryDays: number;
    maxTokensPerCard: number;
    notifyOnTokenCreation: boolean;
  };
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082/api/v1';

const businessTypes = [
  'E-Commerce',
  'Retail',
  'Healthcare',
  'Education',
  'Travel',
  'Food & Beverage',
  'Entertainment',
  'Utilities',
  'Financial Services',
  'Technology',
  'Other'
];

const AddMerchantDialog: React.FC<AddMerchantDialogProps> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MerchantFormData>({
    defaultValues: {
      businessName: '',
      email: '',
      phoneNumber: '',
      businessType: '',
      businessAddress: '',
      panNumber: '',
      gstNumber: '',
      webhookUrl: '',
      settings: {
        allowRefunds: true,
        allowPartialRefunds: false,
        tokenExpiryDays: 1095,
        maxTokensPerCard: 5,
        notifyOnTokenCreation: true
      }
    }
  });

  const onSubmit = async (data: MerchantFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/merchants`, data);
      
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          reset();
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error creating merchant:', err);
      setError(err.response?.data?.message || 'Failed to create merchant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add New Merchant</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Merchant created successfully!
              </Alert>
            )}

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Business Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="businessName"
                  control={control}
                  rules={{ 
                    required: 'Business name is required',
                    minLength: { value: 3, message: 'Minimum 3 characters' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Business Name"
                      error={!!errors.businessName}
                      helperText={errors.businessName?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="businessType"
                  control={control}
                  rules={{ required: 'Business type is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Business Type"
                      error={!!errors.businessType}
                      helperText={errors.businessType?.message}
                      required
                    >
                      {businessTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="businessAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Business Address"
                      multiline
                      rows={2}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^$|^[+]?[0-9]{10,15}$/,
                      message: 'Invalid phone number'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Compliance Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="panNumber"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^$|^[A-Z]{5}[0-9]{4}[A-Z]$/,
                      message: 'Invalid PAN format (e.g., ABCDE1234F)'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="PAN Number"
                      error={!!errors.panNumber}
                      helperText={errors.panNumber?.message}
                      placeholder="ABCDE1234F"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="gstNumber"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                      message: 'Invalid GST format'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="GST Number"
                      error={!!errors.gstNumber}
                      helperText={errors.gstNumber?.message}
                      placeholder="22ABCDE1234F1Z5"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="webhookUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Webhook URL"
                      placeholder="https://your-domain.com/webhook"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Settings
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="settings.allowRefunds"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Allow Refunds"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="settings.allowPartialRefunds"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Allow Partial Refunds"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="settings.notifyOnTokenCreation"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Notify on Token Creation"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="settings.tokenExpiryDays"
                  control={control}
                  rules={{ 
                    required: 'Token expiry days is required',
                    min: { value: 1, message: 'Minimum 1 day' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Token Expiry (Days)"
                      type="number"
                      error={!!errors.settings?.tokenExpiryDays}
                      helperText={errors.settings?.tokenExpiryDays?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="settings.maxTokensPerCard"
                  control={control}
                  rules={{ 
                    required: 'Max tokens per card is required',
                    min: { value: 1, message: 'Minimum 1' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Max Tokens per Card"
                      type="number"
                      error={!!errors.settings?.maxTokensPerCard}
                      helperText={errors.settings?.maxTokensPerCard?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Merchant'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMerchantDialog;