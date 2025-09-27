import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Save,
  Refresh,
  Edit,
  Security,
  Api,
  Storage,
  Speed,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const SystemConfig: React.FC = () => {
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  
  const [config, setConfig] = useState({
    // API Configuration
    apiRateLimit: '1000',
    apiTimeout: '30',
    maxRequestSize: '10',
    
    // Security Configuration
    sessionTimeout: '15',
    maxLoginAttempts: '5',
    passwordExpiry: '90',
    mfaRequired: true,
    ipWhitelisting: true,
    
    // Token Configuration
    tokenExpiry: '365',
    tokenFormat: 'FPT',
    maxTokensPerCard: '10',
    
    // System Configuration
    maintenanceMode: false,
    debugMode: false,
    auditRetention: '90',
    backupFrequency: 'DAILY',
  });

  const handleSave = (section: string) => {
    toast.success(`${section} configuration saved successfully!`);
    setEditMode({ ...editMode, [section]: false });
  };

  const handleReset = () => {
    toast.info('Configuration reset to defaults');
  };

  return (
    <DashboardLayout>
      <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">System Configuration</Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
        >
          Reset to Defaults
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* API Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Api />
                  <Typography variant="h6">API Configuration</Typography>
                </Box>
                <IconButton
                  onClick={() => setEditMode({ ...editMode, api: !editMode.api })}
                >
                  <Edit />
                </IconButton>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Rate Limit"
                    secondary="Requests per hour per API key"
                  />
                  <ListItemSecondaryAction>
                    {editMode.api ? (
                      <TextField
                        size="small"
                        value={config.apiRateLimit}
                        onChange={(e) => setConfig({ ...config, apiRateLimit: e.target.value })}
                        type="number"
                      />
                    ) : (
                      <Typography>{config.apiRateLimit} req/hour</Typography>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Request Timeout"
                    secondary="Maximum time for API requests"
                  />
                  <ListItemSecondaryAction>
                    {editMode.api ? (
                      <TextField
                        size="small"
                        value={config.apiTimeout}
                        onChange={(e) => setConfig({ ...config, apiTimeout: e.target.value })}
                        type="number"
                      />
                    ) : (
                      <Typography>{config.apiTimeout} seconds</Typography>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Max Request Size"
                    secondary="Maximum payload size"
                  />
                  <ListItemSecondaryAction>
                    {editMode.api ? (
                      <TextField
                        size="small"
                        value={config.maxRequestSize}
                        onChange={(e) => setConfig({ ...config, maxRequestSize: e.target.value })}
                        type="number"
                      />
                    ) : (
                      <Typography>{config.maxRequestSize} MB</Typography>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              {editMode.api && (
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => handleSave('API')}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Security Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Security />
                  <Typography variant="h6">Security Configuration</Typography>
                </Box>
                <IconButton
                  onClick={() => setEditMode({ ...editMode, security: !editMode.security })}
                >
                  <Edit />
                </IconButton>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Session Timeout"
                    secondary="Auto-logout after inactivity"
                  />
                  <ListItemSecondaryAction>
                    {editMode.security ? (
                      <TextField
                        size="small"
                        value={config.sessionTimeout}
                        onChange={(e) => setConfig({ ...config, sessionTimeout: e.target.value })}
                        type="number"
                      />
                    ) : (
                      <Typography>{config.sessionTimeout} minutes</Typography>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Max Login Attempts"
                    secondary="Before account lockout"
                  />
                  <ListItemSecondaryAction>
                    {editMode.security ? (
                      <TextField
                        size="small"
                        value={config.maxLoginAttempts}
                        onChange={(e) => setConfig({ ...config, maxLoginAttempts: e.target.value })}
                        type="number"
                      />
                    ) : (
                      <Typography>{config.maxLoginAttempts} attempts</Typography>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="MFA Required"
                    secondary="Enforce two-factor authentication"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={config.mfaRequired}
                      onChange={(e) => setConfig({ ...config, mfaRequired: e.target.checked })}
                      disabled={!editMode.security}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="IP Whitelisting"
                    secondary="Restrict access by IP"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={config.ipWhitelisting}
                      onChange={(e) => setConfig({ ...config, ipWhitelisting: e.target.checked })}
                      disabled={!editMode.security}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              {editMode.security && (
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => handleSave('Security')}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Token Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Storage />
                  <Typography variant="h6">Token Configuration</Typography>
                </Box>
                <IconButton
                  onClick={() => setEditMode({ ...editMode, token: !editMode.token })}
                >
                  <Edit />
                </IconButton>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Token Expiry"
                    secondary="Default token lifetime"
                  />
                  <ListItemSecondaryAction>
                    {editMode.token ? (
                      <TextField
                        size="small"
                        value={config.tokenExpiry}
                        onChange={(e) => setConfig({ ...config, tokenExpiry: e.target.value })}
                        type="number"
                      />
                    ) : (
                      <Typography>{config.tokenExpiry} days</Typography>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Default Format"
                    secondary="Token generation algorithm"
                  />
                  <ListItemSecondaryAction>
                    {editMode.token ? (
                      <FormControl size="small">
                        <Select
                          value={config.tokenFormat}
                          onChange={(e) => setConfig({ ...config, tokenFormat: e.target.value })}
                        >
                          <MenuItem value="FPT">Format Preserving</MenuItem>
                          <MenuItem value="RANDOM">Random</MenuItem>
                          <MenuItem value="COF">Card on File</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip label={config.tokenFormat} size="small" />
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              {editMode.token && (
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => handleSave('Token')}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Speed />
                  <Typography variant="h6">System Configuration</Typography>
                </Box>
                <IconButton
                  onClick={() => setEditMode({ ...editMode, system: !editMode.system })}
                >
                  <Edit />
                </IconButton>
              </Box>
              
              <Alert severity="warning" sx={{ mb: 2 }}>
                Changing system settings may affect platform availability
              </Alert>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Maintenance Mode"
                    secondary="Disable all API access"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={config.maintenanceMode}
                      onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                      disabled={!editMode.system}
                      color="error"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Debug Mode"
                    secondary="Enable verbose logging"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={config.debugMode}
                      onChange={(e) => setConfig({ ...config, debugMode: e.target.checked })}
                      disabled={!editMode.system}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Backup Frequency"
                    secondary="Automated backup schedule"
                  />
                  <ListItemSecondaryAction>
                    {editMode.system ? (
                      <FormControl size="small">
                        <Select
                          value={config.backupFrequency}
                          onChange={(e) => setConfig({ ...config, backupFrequency: e.target.value })}
                        >
                          <MenuItem value="HOURLY">Hourly</MenuItem>
                          <MenuItem value="DAILY">Daily</MenuItem>
                          <MenuItem value="WEEKLY">Weekly</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip label={config.backupFrequency} size="small" />
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              {editMode.system && (
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => handleSave('System')}
                    color="error"
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default SystemConfig;