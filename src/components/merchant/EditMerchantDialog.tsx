import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Box,
  Chip,
  FormLabel,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { merchantService, Merchant } from '../../services/tokenizationService';
import { toast } from 'react-toastify';

interface EditMerchantDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  merchant: Merchant | null;
}

interface EditMerchantForm {
  businessName: string;
  email: string;
  contactPhone: string;
  businessType: string;
  website: string;
  gstNumber: string;
  panNumber: string;
  registrationNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  status: string;
  kycStatus: string;
  riskRating: string;
  settlementFrequency: string;
  webhookUrl: string;
  ipWhitelist: string;
  twoFactorEnabled: boolean;
  autoSettlement: boolean;
}

const EditMerchantDialog: React.FC<EditMerchantDialogProps> = ({ open, onClose, onSuccess, merchant }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditMerchantForm>();

  useEffect(() => {
    if (merchant && open) {
      reset({
        businessName: merchant.businessName || '',
        email: merchant.email || merchant.contactEmail || '',
        contactPhone: merchant.contactPhone || '',
        businessType: merchant.businessType || 'RETAIL',
        website: merchant.website || '',
        gstNumber: merchant.gstNumber || '',
        panNumber: merchant.panNumber || '',
        registrationNumber: merchant.registrationNumber || '',
        businessAddress: merchant.businessAddress || '',
        city: merchant.city || '',
        state: merchant.state || '',
        country: merchant.country || 'India',
        postalCode: merchant.postalCode || '',
        bankAccountNumber: merchant.bankAccountNumber || '',
        bankName: merchant.bankName || '',
        ifscCode: merchant.ifscCode || '',
        status: merchant.status || 'ACTIVE',
        kycStatus: merchant.kycStatus || 'PENDING',
        riskRating: merchant.riskRating || 'LOW',
        settlementFrequency: merchant.settlementFrequency || 'DAILY',
        webhookUrl: merchant.webhookUrl || '',
        ipWhitelist: merchant.ipWhitelist || '',
        twoFactorEnabled: merchant.twoFactorEnabled || false,
        autoSettlement: merchant.autoSettlement || false,
      });
    }
  }, [merchant, open, reset]);

  const onSubmit = async (data: EditMerchantForm) => {
    if (!merchant) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Map form data to API expected format
      const updatePayload = {
        businessName: data.businessName,
        email: data.email,
        phoneNumber: data.contactPhone, // Map contactPhone to phoneNumber
        businessType: data.businessType,
        businessAddress: data.businessAddress,
        webhookUrl: data.webhookUrl,
        status: data.status,
        settings: {
          allowRefunds: true,
          allowPartialRefunds: true,
          tokenExpiryDays: 90,
          maxTokensPerCard: 5,
          notifyOnTokenCreation: true
        }
      };

      const response = await fetch(`/api/v1/merchants/${merchant.merchantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update failed:', errorData);
        throw new Error('Failed to update merchant');
      }

      toast.success('Merchant updated successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update merchant. Please try again.');
      console.error('Error updating merchant:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!merchant) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Edit Merchant</Typography>
            <Chip 
              label={`ID: ${merchant.merchantId}`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="businessName"
                control={control}
                rules={{ required: 'Business name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Business Name"
                    fullWidth
                    error={!!errors.businessName}
                    helperText={errors.businessName?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Business Type</InputLabel>
                    <Select {...field} label="Business Type">
                      <MenuItem value="RETAIL">Retail</MenuItem>
                      <MenuItem value="ECOMMERCE">E-commerce</MenuItem>
                      <MenuItem value="SERVICES">Services</MenuItem>
                      <MenuItem value="HOSPITALITY">Hospitality</MenuItem>
                      <MenuItem value="EDUCATION">Education</MenuItem>
                      <MenuItem value="HEALTHCARE">Healthcare</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="contactPhone"
                control={control}
                rules={{ required: 'Contact phone is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Phone"
                    fullWidth
                    error={!!errors.contactPhone}
                    helperText={errors.contactPhone?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Website"
                    fullWidth
                    placeholder="https://example.com"
                  />
                )}
              />
            </Grid>
            
            {/* Status and Settings */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Status and Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="INACTIVE">Inactive</MenuItem>
                      <MenuItem value="SUSPENDED">Suspended</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="kycStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>KYC Status</InputLabel>
                    <Select {...field} label="KYC Status">
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="VERIFIED">Verified</MenuItem>
                      <MenuItem value="REJECTED">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="riskRating"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Risk Rating</InputLabel>
                    <Select {...field} label="Risk Rating">
                      <MenuItem value="LOW">Low</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* Security Settings */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Security Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="webhookUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Webhook URL"
                    fullWidth
                    placeholder="https://api.example.com/webhook"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="ipWhitelist"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="IP Whitelist"
                    fullWidth
                    placeholder="192.168.1.1, 10.0.0.0/24"
                    helperText="Comma-separated IP addresses or CIDR ranges"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="twoFactorEnabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Two-Factor Authentication"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="autoSettlement"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Auto Settlement"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update Merchant'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditMerchantDialog;