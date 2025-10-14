import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import {
  Settings,
  Security,
  Notifications,
  Payment,
  Save
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MerchantSettings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    // General Settings
    businessName: 'Tech Solutions Pvt Ltd',
    displayName: 'Tech Solutions',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    
    // Security Settings
    twoFactorAuth: true,
    ipRestriction: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    apiRateLimit: '1000',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    webhookNotifications: true,
    dailyReports: true,
    transactionAlerts: true,
    securityAlerts: true,
    
    // Payment Settings
    settlementFrequency: 'daily',
    settlementAccount: '**** **** **** 1234',
    autoRefunds: false,
    partialRefunds: true,
    minimumTransaction: '10',
    maximumTransaction: '100000'
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Merchant Settings</Typography>
      
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="General" icon={<Settings />} iconPosition="start" />
            <Tab label="Security" icon={<Security />} iconPosition="start" />
            <Tab label="Notifications" icon={<Notifications />} iconPosition="start" />
            <Tab label="Payments" icon={<Payment />} iconPosition="start" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>General Settings</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={settings.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={settings.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  helperText="This name will be shown to customers"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    label="Timezone"
                    onChange={(e) => handleChange('timezone', e.target.value)}
                  >
                    <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={settings.dateFormat}
                    label="Date Format"
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Default Currency</InputLabel>
                  <Select
                    value={settings.currency}
                    label="Default Currency"
                    onChange={(e) => handleChange('currency', e.target.value)}
                  >
                    <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                    <MenuItem value="USD">USD - US Dollar</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Security Settings</Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              These settings help protect your merchant account from unauthorized access.
            </Alert>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  />
                }
                label="Enable Two-Factor Authentication"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.ipRestriction}
                    onChange={(e) => handleChange('ipRestriction', e.target.checked)}
                  />
                }
                label="Enable IP Address Restriction"
              />
            </FormGroup>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                  helperText="Automatically logout after inactivity"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password Expiry (days)"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => handleChange('passwordExpiry', e.target.value)}
                  helperText="Force password change after this period"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="API Rate Limit (requests/hour)"
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={(e) => handleChange('apiRateLimit', e.target.value)}
                  helperText="Maximum API calls allowed per hour"
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                  />
                }
                label="SMS Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.webhookNotifications}
                    onChange={(e) => handleChange('webhookNotifications', e.target.checked)}
                  />
                }
                label="Webhook Notifications"
              />
            </FormGroup>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" gutterBottom>Notification Types</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dailyReports}
                    onChange={(e) => handleChange('dailyReports', e.target.checked)}
                  />
                }
                label="Daily Transaction Reports"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.transactionAlerts}
                    onChange={(e) => handleChange('transactionAlerts', e.target.checked)}
                  />
                }
                label="Transaction Alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.securityAlerts}
                    onChange={(e) => handleChange('securityAlerts', e.target.checked)}
                  />
                }
                label="Security Alerts"
              />
            </FormGroup>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Payment Settings</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Settlement Frequency</InputLabel>
                  <Select
                    value={settings.settlementFrequency}
                    label="Settlement Frequency"
                    onChange={(e) => handleChange('settlementFrequency', e.target.value)}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Settlement Account"
                  value={settings.settlementAccount}
                  disabled
                  helperText="Contact support to change settlement account"
                />
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoRefunds}
                        onChange={(e) => handleChange('autoRefunds', e.target.checked)}
                      />
                    }
                    label="Enable Auto Refunds"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.partialRefunds}
                        onChange={(e) => handleChange('partialRefunds', e.target.checked)}
                      />
                    }
                    label="Allow Partial Refunds"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Transaction Amount"
                  type="number"
                  value={settings.minimumTransaction}
                  onChange={(e) => handleChange('minimumTransaction', e.target.value)}
                  InputProps={{ startAdornment: '₹' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Transaction Amount"
                  type="number"
                  value={settings.maximumTransaction}
                  onChange={(e) => handleChange('maximumTransaction', e.target.value)}
                  InputProps={{ startAdornment: '₹' }}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
              Save Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MerchantSettings;