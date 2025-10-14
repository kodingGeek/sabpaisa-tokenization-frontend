import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  Avatar,
  Tab,
  Tabs,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  Business,
  Email,
  Phone,
  LocationOn,
  AccountBalance,
  CreditCard,
  VerifiedUser,
  Security,
  AttachMoney,
  Edit,
  Save,
  Cancel,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Fingerprint,
  CloudSync,
  Shield,
  Refresh,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';
import merchantService from '../../services/merchantService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MerchantProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [merchantData, setMerchantData] = useState<any>({
    merchantId: '',
    businessName: '',
    email: '',
    phoneNumber: '',
    businessType: '',
    businessAddress: '',
    panNumber: '',
    gstNumber: '',
    status: 'ACTIVE',
    registrationNumber: '',
    incorporationDate: '',
    businessCategory: '',
    mccCode: '',
    websiteUrl: '',
    countryCode: 'IN',
    stateCode: '',
    city: '',
    postalCode: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    bankAccountNumber: '',
    bankName: '',
    bankIfscCode: '',
    bankBranch: '',
    accountHolderName: '',
    settlementCurrency: 'INR',
    annualRevenue: '',
    monthlyTransactionVolume: '',
    averageTransactionValue: '',
    expectedMonthlyTokens: '',
    riskRating: 'MEDIUM',
    kycStatus: 'VERIFIED',
    complianceStatus: 'COMPLIANT',
    pciDssCompliant: true,
    pciDssLevel: 'LEVEL_4',
    apiRateLimit: 1000,
    biometricTokenizationEnabled: false,
    quantumEncryptionEnabled: false,
    platformTokenizationEnabled: true,
    bulkOperationsEnabled: true,
    twoFactorEnabled: true,
    smsNotificationsEnabled: true,
    emailNotificationsEnabled: true,
    webhookNotificationsEnabled: true,
    billingCycle: 'MONTHLY',
    creditLimit: '',
    currentBalance: '0',
    paymentMethod: 'BANK_TRANSFER',
    totalTokensCreated: 0,
    activeTokensCount: 0,
    tokensCreatedToday: 0,
    tokensCreatedThisMonth: 0,
  });

  const [originalData, setOriginalData] = useState<any>({});

  useEffect(() => {
    fetchMerchantProfile();
  }, []);

  const fetchMerchantProfile = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch the logged-in merchant's data
      // For now, we'll use a mock merchantId
      const response = await merchantService.getMerchantById('MERCH001');
      setMerchantData(response);
      setOriginalData(response);
    } catch (error) {
      toast.error('Failed to load merchant profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setMerchantData(originalData);
    setEditMode(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Call update API
      await merchantService.updateMerchant(merchantData.merchantId, merchantData);
      setOriginalData(merchantData);
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setMerchantData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'SUSPENDED': return 'warning';
      case 'INACTIVE': return 'error';
      case 'BLOCKED': return 'error';
      case 'PENDING': return 'info';
      default: return 'default';
    }
  };

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container>
          <LinearProgress />
          <Typography sx={{ mt: 2 }}>Loading merchant profile...</Typography>
        </Container>
      </DashboardLayout>
    );
  }

  const renderBasicInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Merchant ID"
          value={merchantData.merchantId}
          disabled
          InputProps={{
            startAdornment: <InputAdornment position="start"><Fingerprint /></InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Business Name"
          value={merchantData.businessName}
          onChange={(e) => handleFieldChange('businessName', e.target.value)}
          disabled={!editMode}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Business /></InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={merchantData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          disabled={!editMode}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Email /></InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Phone Number"
          value={merchantData.phoneNumber}
          onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
          disabled={!editMode}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Phone /></InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth disabled={!editMode}>
          <InputLabel>Business Type</InputLabel>
          <Select
            value={merchantData.businessType || ''}
            onChange={(e) => handleFieldChange('businessType', e.target.value)}
            label="Business Type"
          >
            <MenuItem value="RETAIL">Retail</MenuItem>
            <MenuItem value="E_COMMERCE">E-Commerce</MenuItem>
            <MenuItem value="SAAS">SaaS</MenuItem>
            <MenuItem value="FINANCIAL_SERVICES">Financial Services</MenuItem>
            <MenuItem value="HEALTHCARE">Healthcare</MenuItem>
            <MenuItem value="EDUCATION">Education</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth disabled={!editMode}>
          <InputLabel>Business Category</InputLabel>
          <Select
            value={merchantData.businessCategory || ''}
            onChange={(e) => handleFieldChange('businessCategory', e.target.value)}
            label="Business Category"
          >
            <MenuItem value="B2B">B2B</MenuItem>
            <MenuItem value="B2C">B2C</MenuItem>
            <MenuItem value="B2B2C">B2B2C</MenuItem>
            <MenuItem value="C2C">C2C</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Business Address"
          value={merchantData.businessAddress}
          onChange={(e) => handleFieldChange('businessAddress', e.target.value)}
          disabled={!editMode}
          InputProps={{
            startAdornment: <InputAdornment position="start"><LocationOn /></InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="City"
          value={merchantData.city}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="State Code"
          value={merchantData.stateCode}
          onChange={(e) => handleFieldChange('stateCode', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Postal Code"
          value={merchantData.postalCode}
          onChange={(e) => handleFieldChange('postalCode', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="PAN Number"
          value={merchantData.panNumber}
          onChange={(e) => handleFieldChange('panNumber', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="GST Number"
          value={merchantData.gstNumber}
          onChange={(e) => handleFieldChange('gstNumber', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Registration Number"
          value={merchantData.registrationNumber}
          onChange={(e) => handleFieldChange('registrationNumber', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Website URL"
          value={merchantData.websiteUrl}
          onChange={(e) => handleFieldChange('websiteUrl', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
    </Grid>
  );

  const renderBankingInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Bank Name"
          value={merchantData.bankName}
          onChange={(e) => handleFieldChange('bankName', e.target.value)}
          disabled={!editMode}
          InputProps={{
            startAdornment: <InputAdornment position="start"><AccountBalance /></InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Account Number"
          type={editMode ? 'text' : 'password'}
          value={merchantData.bankAccountNumber}
          onChange={(e) => handleFieldChange('bankAccountNumber', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="IFSC Code"
          value={merchantData.bankIfscCode}
          onChange={(e) => handleFieldChange('bankIfscCode', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Branch Name"
          value={merchantData.bankBranch}
          onChange={(e) => handleFieldChange('bankBranch', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Account Holder Name"
          value={merchantData.accountHolderName}
          onChange={(e) => handleFieldChange('accountHolderName', e.target.value)}
          disabled={!editMode}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth disabled={!editMode}>
          <InputLabel>Settlement Currency</InputLabel>
          <Select
            value={merchantData.settlementCurrency}
            onChange={(e) => handleFieldChange('settlementCurrency', e.target.value)}
            label="Settlement Currency"
          >
            <MenuItem value="INR">INR - Indian Rupee</MenuItem>
            <MenuItem value="USD">USD - US Dollar</MenuItem>
            <MenuItem value="EUR">EUR - Euro</MenuItem>
            <MenuItem value="GBP">GBP - British Pound</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>Business Metrics</Typography>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Annual Revenue"
          type="number"
          value={merchantData.annualRevenue}
          onChange={(e) => handleFieldChange('annualRevenue', e.target.value)}
          disabled={!editMode}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Monthly Transaction Volume"
          type="number"
          value={merchantData.monthlyTransactionVolume}
          onChange={(e) => handleFieldChange('monthlyTransactionVolume', e.target.value)}
          disabled={!editMode}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Average Transaction Value"
          type="number"
          value={merchantData.averageTransactionValue}
          onChange={(e) => handleFieldChange('averageTransactionValue', e.target.value)}
          disabled={!editMode}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
      </Grid>
    </Grid>
  );

  const renderCompliance = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">KYC Status</Typography>
              <VerifiedUser color="primary" />
            </Box>
            <Chip
              label={merchantData.kycStatus}
              color={getKYCStatusColor(merchantData.kycStatus)}
              sx={{ mb: 2 }}
            />
            {merchantData.kycVerifiedAt && (
              <Typography variant="body2" color="text.secondary">
                Verified on: {new Date(merchantData.kycVerifiedAt).toLocaleDateString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">PCI DSS Compliance</Typography>
              <Security color="primary" />
            </Box>
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Status:</Typography>
                <Chip
                  label={merchantData.pciDssCompliant ? 'Compliant' : 'Non-Compliant'}
                  color={merchantData.pciDssCompliant ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Level:</Typography>
                <Chip label={merchantData.pciDssLevel} size="small" />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Risk Assessment</Typography>
              <Shield color="primary" />
            </Box>
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Rating:</Typography>
                <Chip
                  label={merchantData.riskRating}
                  color={merchantData.riskRating === 'LOW' ? 'success' : merchantData.riskRating === 'HIGH' ? 'error' : 'warning'}
                  size="small"
                />
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Score:</Typography>
                <Typography variant="body2">{merchantData.riskScore || 'N/A'}/100</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Security Features
        </Typography>
        <Paper sx={{ p: 2 }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Two-Factor Authentication"
                secondary="Enhance security with 2FA"
              />
              <Switch
                checked={merchantData.twoFactorEnabled}
                onChange={(e) => handleFieldChange('twoFactorEnabled', e.target.checked)}
                disabled={!editMode}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Fingerprint />
              </ListItemIcon>
              <ListItemText
                primary="Biometric Tokenization"
                secondary="Enable biometric-based token generation"
              />
              <Switch
                checked={merchantData.biometricTokenizationEnabled}
                onChange={(e) => handleFieldChange('biometricTokenizationEnabled', e.target.checked)}
                disabled={!editMode}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Shield />
              </ListItemIcon>
              <ListItemText
                primary="Quantum Encryption"
                secondary="Next-generation quantum-resistant encryption"
              />
              <Switch
                checked={merchantData.quantumEncryptionEnabled}
                onChange={(e) => handleFieldChange('quantumEncryptionEnabled', e.target.checked)}
                disabled={!editMode}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CloudSync />
              </ListItemIcon>
              <ListItemText
                primary="Platform Tokenization"
                secondary="Enable cross-platform token sharing"
              />
              <Switch
                checked={merchantData.platformTokenizationEnabled}
                onChange={(e) => handleFieldChange('platformTokenizationEnabled', e.target.checked)}
                disabled={!editMode}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Refresh />
              </ListItemIcon>
              <ListItemText
                primary="Bulk Operations"
                secondary="Enable bulk tokenization and retokenization"
              />
              <Switch
                checked={merchantData.bulkOperationsEnabled}
                onChange={(e) => handleFieldChange('bulkOperationsEnabled', e.target.checked)}
                disabled={!editMode}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderStatistics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              Total Tokens Created
            </Typography>
            <Typography variant="h4">
              {merchantData.totalTokensCreated?.toLocaleString() || '0'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              Active Tokens
            </Typography>
            <Typography variant="h4" color="success.main">
              {merchantData.activeTokensCount?.toLocaleString() || '0'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              Tokens Today
            </Typography>
            <Typography variant="h4">
              {merchantData.tokensCreatedToday?.toLocaleString() || '0'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              This Month
            </Typography>
            <Typography variant="h4">
              {merchantData.tokensCreatedThisMonth?.toLocaleString() || '0'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          API Usage & Limits
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  API Rate Limit
                </Typography>
                <Box display="flex" alignItems="baseline" gap={1}>
                  <Typography variant="h5">{merchantData.apiRateLimit}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    requests per hour
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last API Call
                </Typography>
                <Typography variant="body1">
                  {merchantData.lastApiCallAt 
                    ? new Date(merchantData.lastApiCallAt).toLocaleString()
                    : 'No API calls yet'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
              {merchantData.businessName?.charAt(0) || 'M'}
            </Avatar>
            <Box>
              <Typography variant="h4">{merchantData.businessName}</Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip 
                  label={merchantData.status} 
                  color={getStatusColor(merchantData.status)}
                  size="small"
                />
                <Chip 
                  label={merchantData.businessType} 
                  size="small"
                  variant="outlined"
                />
                {merchantData.merchantId && (
                  <Chip 
                    label={`ID: ${merchantData.merchantId}`} 
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>
          
          <Box>
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  sx={{ mr: 1 }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>
        
        <Paper>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Basic Information" />
            <Tab label="Banking & Billing" />
            <Tab label="Compliance & Security" />
            <Tab label="Statistics & Usage" />
          </Tabs>
          
          <TabPanel value={activeTab} index={0}>
            {renderBasicInfo()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            {renderBankingInfo()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            {renderCompliance()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={3}>
            {renderStatistics()}
          </TabPanel>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default MerchantProfile;