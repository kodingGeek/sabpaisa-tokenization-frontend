import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Business,
  Email,
  Phone,
  LocationOn,
  CreditCard,
  Receipt,
  Link,
  Security,
  CheckCircle,
  AccessTime,
  Token,
} from '@mui/icons-material';
import { Merchant } from '../../services/tokenizationService';

interface ViewMerchantDialogProps {
  open: boolean;
  onClose: () => void;
  merchant: Merchant | null;
}

const ViewMerchantDialog: React.FC<ViewMerchantDialogProps> = ({ open, onClose, merchant }) => {
  if (!merchant) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'SUSPENDED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const getKYCStatusColor = (status?: string) => {
    switch (status) {
      case 'VERIFIED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Merchant Details</Typography>
          <Box>
            <Chip 
              label={merchant.status} 
              color={getStatusColor(merchant.status)} 
              size="small" 
              sx={{ mr: 1 }}
            />
            <Chip 
              label={`KYC: ${merchant.kycStatus || 'PENDING'}`} 
              color={getKYCStatusColor(merchant.kycStatus)} 
              size="small" 
            />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Basic Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Business /></ListItemIcon>
                <ListItemText 
                  primary="Business Name" 
                  secondary={merchant.businessName}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CreditCard /></ListItemIcon>
                <ListItemText 
                  primary="Merchant ID" 
                  secondary={merchant.merchantId}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Business /></ListItemIcon>
                <ListItemText 
                  primary="Business Type" 
                  secondary={merchant.businessType || 'Not specified'}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Email /></ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={merchant.email}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Phone /></ListItemIcon>
                <ListItemText 
                  primary="Phone" 
                  secondary={merchant.contactPhone || 'Not provided'}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Security & Compliance */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Security & Compliance
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Risk Rating
                  </Typography>
                  <Chip 
                    label={merchant.riskRating || 'LOW'} 
                    color={getRiskColor(merchant.riskRating)} 
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Tokens
                  </Typography>
                  <Typography variant="h6">
                    {merchant.activeTokens || merchant.tokenCount || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Timestamps */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Activity Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body2">
                      {merchant.createdAt ? new Date(merchant.createdAt).toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Activity
                    </Typography>
                    <Typography variant="body2">
                      {merchant.lastActivity || 'Recently'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewMerchantDialog;