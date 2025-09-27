import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  RadioGroup,
  Radio,
  Slider,
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Language,
  AccessTime,
  Save,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import DashboardLayout from '../layouts/DashboardLayout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Notification Settings
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    securityAlerts: true,
    systemUpdates: true,
    transactionAlerts: true,
    complianceReports: false,
  });

  // Security Settings
  const [security, setSecurity] = useState({
    sessionTimeout: '15',
    ipRestriction: true,
    deviceVerification: false,
    loginNotifications: true,
    apiRateLimiting: '1000',
    allowedIPs: '192.168.1.0/24',
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactView: false,
    showAnimations: true,
    fontSize: 'medium',
    colorScheme: 'blue',
  });

  // Regional Settings
  const [regional, setRegional] = useState({
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="settings tabs">
              <Tab icon={<Notifications />} label="Notifications" />
              <Tab icon={<Security />} label="Security" />
              <Tab icon={<Palette />} label="Appearance" />
              <Tab icon={<Language />} label="Regional" />
            </Tabs>
          </Box>

          <CardContent>
            {/* Notifications Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Communication Channels
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive updates via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="SMS Notifications"
                    secondary="Get text messages for critical alerts"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Browser notifications for real-time updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.push}
                      onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Notification Types
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Security Alerts"
                    secondary="Suspicious activities and security threats"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.securityAlerts}
                      onChange={(e) => setNotifications({ ...notifications, securityAlerts: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="System Updates"
                    secondary="Maintenance and system status updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.systemUpdates}
                      onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Transaction Alerts"
                    secondary="Token generation and usage notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.transactionAlerts}
                      onChange={(e) => setNotifications({ ...notifications, transactionAlerts: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Compliance Reports"
                    secondary="Regulatory compliance notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.complianceReports}
                      onChange={(e) => setNotifications({ ...notifications, complianceReports: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>

              <Alert severity="warning" sx={{ mb: 3 }}>
                Changing security settings may affect your account access. Please ensure you understand the implications.
              </Alert>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Session Timeout (minutes)</InputLabel>
                  <Select
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    label="Session Timeout (minutes)"
                  >
                    <MenuItem value="5">5 minutes</MenuItem>
                    <MenuItem value="15">15 minutes</MenuItem>
                    <MenuItem value="30">30 minutes</MenuItem>
                    <MenuItem value="60">1 hour</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <List>
                <ListItem>
                  <ListItemText
                    primary="IP Restriction"
                    secondary="Restrict access to specific IP addresses"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={security.ipRestriction}
                      onChange={(e) => setSecurity({ ...security, ipRestriction: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                {security.ipRestriction && (
                  <ListItem>
                    <TextField
                      fullWidth
                      label="Allowed IP Ranges (CIDR notation)"
                      value={security.allowedIPs}
                      onChange={(e) => setSecurity({ ...security, allowedIPs: e.target.value })}
                      helperText="Separate multiple ranges with comma"
                    />
                  </ListItem>
                )}

                <ListItem>
                  <ListItemText
                    primary="Device Verification"
                    secondary="Require verification for new devices"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={security.deviceVerification}
                      onChange={(e) => setSecurity({ ...security, deviceVerification: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Login Notifications"
                    secondary="Get notified of new login attempts"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={security.loginNotifications}
                      onChange={(e) => setSecurity({ ...security, loginNotifications: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="API Rate Limit (requests per hour)"
                  value={security.apiRateLimiting}
                  onChange={(e) => setSecurity({ ...security, apiRateLimiting: e.target.value })}
                  type="number"
                  helperText="Maximum API requests allowed per hour"
                />
              </Box>
            </TabPanel>

            {/* Appearance Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h6" gutterBottom>
                Appearance Settings
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Theme
                </Typography>
                <RadioGroup
                  value={appearance.theme}
                  onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                >
                  <FormControlLabel value="light" control={<Radio />} label="Light" />
                  <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                  <FormControlLabel value="auto" control={<Radio />} label="Auto (System)" />
                </RadioGroup>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Font Size</InputLabel>
                  <Select
                    value={appearance.fontSize}
                    onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
                    label="Font Size"
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Compact View"
                    secondary="Reduce spacing for more content"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={appearance.compactView}
                      onChange={(e) => setAppearance({ ...appearance, compactView: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Show Animations"
                    secondary="Enable UI animations and transitions"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={appearance.showAnimations}
                      onChange={(e) => setAppearance({ ...appearance, showAnimations: e.target.checked })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Color Scheme
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={appearance.colorScheme}
                    onChange={(e) => setAppearance({ ...appearance, colorScheme: e.target.value })}
                  >
                    <MenuItem value="blue">Blue (Default)</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                    <MenuItem value="purple">Purple</MenuItem>
                    <MenuItem value="orange">Orange</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </TabPanel>

            {/* Regional Tab */}
            <TabPanel value={activeTab} index={3}>
              <Typography variant="h6" gutterBottom>
                Regional Settings
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={regional.language}
                    onChange={(e) => setRegional({ ...regional, language: e.target.value })}
                    label="Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">Hindi</MenuItem>
                    <MenuItem value="mr">Marathi</MenuItem>
                    <MenuItem value="ta">Tamil</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={regional.timezone}
                    onChange={(e) => setRegional({ ...regional, timezone: e.target.value })}
                    label="Timezone"
                  >
                    <MenuItem value="Asia/Kolkata">India Standard Time (IST)</MenuItem>
                    <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                    <MenuItem value="Europe/London">Greenwich Mean Time (GMT)</MenuItem>
                    <MenuItem value="Asia/Dubai">Gulf Standard Time (GST)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={regional.dateFormat}
                    onChange={(e) => setRegional({ ...regional, dateFormat: e.target.value })}
                    label="Date Format"
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={regional.currency}
                    onChange={(e) => setRegional({ ...regional, currency: e.target.value })}
                    label="Currency"
                  >
                    <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
                    <MenuItem value="USD">US Dollar ($)</MenuItem>
                    <MenuItem value="EUR">Euro (€)</MenuItem>
                    <MenuItem value="GBP">British Pound (£)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </TabPanel>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
              >
                Save Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default Settings;