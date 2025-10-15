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
  CreditCard,
  Security,
  AttachMoney,
  Edit,
  Save,
  Cancel,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Shield,
  Fingerprint,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';
import merchantService, { MerchantResponse } from '../../services/merchantService';

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
  const [merchantData, setMerchantData] = useState<MerchantResponse>({
    merchantId: '',
    businessName: '',
    email: '',
    phoneNumber: '',
    businessType: '',
    businessAddress: '',
    panNumber: '',
    gstNumber: '',
    status: 'ACTIVE',
    webhookUrl: '',
    settings: {
      allowRefunds: true,
      allowPartialRefunds: false,
      tokenExpiryDays: 1095,
      maxTokensPerCard: 5,
      notifyOnTokenCreation: true,
    },
    stats: {
      totalTokens: 0,
      activeTokens: 0,
      totalTransactions: 0,
      tokensCreatedToday: 0,
    },
    createdAt: '',
    updatedAt: '',
  });

  const [originalData, setOriginalData] = useState<MerchantResponse | null>(null);

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
    if (originalData) {
      setMerchantData(originalData);
    }
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

  const handleFieldChange = (field: keyof MerchantResponse, value: any) => {
    setMerchantData((prev) => ({
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
        <TextField
          fullWidth
          label="Webhook URL"
          value={merchantData.webhookUrl || ''}
          onChange={(e) => handleFieldChange('webhookUrl', e.target.value)}
          disabled={!editMode}
          placeholder="https://example.com/webhook"
        />
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
    </Grid>
  );

  const renderSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Token Settings</Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography>Allow Refunds:</Typography>
          <Switch
            checked={merchantData.settings.allowRefunds}
            onChange={(e) => {
              setMerchantData(prev => ({
                ...prev,
                settings: { ...prev.settings, allowRefunds: e.target.checked }
              }));
            }}
            disabled={!editMode}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography>Allow Partial Refunds:</Typography>
          <Switch
            checked={merchantData.settings.allowPartialRefunds}
            onChange={(e) => {
              setMerchantData(prev => ({
                ...prev,
                settings: { ...prev.settings, allowPartialRefunds: e.target.checked }
              }));
            }}
            disabled={!editMode}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Token Expiry Days"
          type="number"
          value={merchantData.settings.tokenExpiryDays}
          onChange={(e) => {
            setMerchantData(prev => ({
              ...prev,
              settings: { ...prev.settings, tokenExpiryDays: parseInt(e.target.value) || 0 }
            }));
          }}
          disabled={!editMode}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Max Tokens Per Card"
          type="number"
          value={merchantData.settings.maxTokensPerCard}
          onChange={(e) => {
            setMerchantData(prev => ({
              ...prev,
              settings: { ...prev.settings, maxTokensPerCard: parseInt(e.target.value) || 0 }
            }));
          }}
          disabled={!editMode}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography>Notify on Token Creation:</Typography>
          <Switch
            checked={merchantData.settings.notifyOnTokenCreation}
            onChange={(e) => {
              setMerchantData(prev => ({
                ...prev,
                settings: { ...prev.settings, notifyOnTokenCreation: e.target.checked }
              }));
            }}
            disabled={!editMode}
          />
        </Box>
      </Grid>
    </Grid>
  );

  const renderApiCredentials = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          API credentials are sensitive information. Handle with care!
        </Alert>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>API Key</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              API Key Hint:
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              {merchantData.apiCredentials?.apiKeyHint || 'Not generated'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Status Information</Typography>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2">Account Status:</Typography>
                <Chip 
                  label={merchantData.status} 
                  color={getStatusColor(merchantData.status)}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(merchantData.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Updated: {new Date(merchantData.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderStatistics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              Total Tokens
            </Typography>
            <Typography variant="h4">
              {merchantData.stats.totalTokens?.toLocaleString() || '0'}
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
              {merchantData.stats.activeTokens?.toLocaleString() || '0'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              Total Transactions
            </Typography>
            <Typography variant="h4">
              {merchantData.stats.totalTransactions?.toLocaleString() || '0'}
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
              {merchantData.stats.tokensCreatedToday?.toLocaleString() || '0'}
            </Typography>
          </CardContent>
        </Card>
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
            <Tab label="Settings" />
            <Tab label="API & Status" />
            <Tab label="Statistics" />
          </Tabs>
          
          <TabPanel value={activeTab} index={0}>
            {renderBasicInfo()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            {renderSettings()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            {renderApiCredentials()}
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