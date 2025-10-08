import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CreditCard as CardIcon,
  Security as SecurityIcon,
  Fingerprint as FingerprintIcon,
  Memory as QuantumIcon,
  CloudQueue as CloudIcon,
  Hub as HybridIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon,
  VisibilityOff as ViewOffIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import api from '../../services/api';

interface TokenizationMode {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
}

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

const UnifiedTokenization: React.FC = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenizationModes, setTokenizationModes] = useState<TokenizationMode[]>([]);
  const [selectedMode, setSelectedMode] = useState('STANDARD');
  const [cardNumber, setCardNumber] = useState('');
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [merchantId, setMerchantId] = useState('MERCH001');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [biometricData, setBiometricData] = useState({
    type: 'FINGERPRINT',
    template: '',
    confidence: 0.95
  });
  const [securityOptions, setSecurityOptions] = useState({
    quantumKeySize: 256,
    replicationRegions: ['us-east-1', 'eu-west-1'],
    enableAudit: true
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedModeInfo, setSelectedModeInfo] = useState<TokenizationMode | null>(null);

  useEffect(() => {
    fetchTokenizationModes();
  }, []);

  const fetchTokenizationModes = async () => {
    try {
      const response = await api.get('/unified-tokens/modes');
      const modes = Object.entries(response.data).map(([key, value]: [string, any]) => ({
        id: key,
        name: value.name,
        description: value.description,
        features: value.features,
        icon: getIconForMode(key),
        color: getColorForMode(key)
      }));
      setTokenizationModes(modes);
    } catch (error) {
      console.error('Failed to fetch tokenization modes:', error);
      // Fallback modes
      setTokenizationModes([
        {
          id: 'STANDARD',
          name: 'Standard Tokenization',
          description: 'PCI DSS compliant tokenization with fraud detection',
          features: ['16-digit numeric tokens', 'Card masking', 'Fraud detection', '3-year expiry'],
          icon: <SecurityIcon />,
          color: '#2196f3'
        },
        {
          id: 'BIOMETRIC',
          name: 'Biometric-Enhanced Tokenization',
          description: 'Tokenization with biometric authentication',
          features: ['Facial recognition', 'Fingerprint matching', 'Voice biometrics', 'Liveness detection'],
          icon: <FingerprintIcon />,
          color: '#4caf50'
        },
        {
          id: 'QUANTUM',
          name: 'Quantum-Resistant Tokenization',
          description: 'Post-quantum cryptographic protection',
          features: ['NIST Level 5 security', 'Quantum key rotation', 'Quantum-safe algorithms', 'Future-proof encryption'],
          icon: <QuantumIcon />,
          color: '#9c27b0'
        },
        {
          id: 'CLOUD_REPLICATED',
          name: 'Cloud-Replicated Tokenization',
          description: 'Multi-cloud distributed storage',
          features: ['AWS S3 replication', 'Azure Blob storage', 'GCP Cloud Storage', 'Automatic failover'],
          icon: <CloudIcon />,
          color: '#ff9800'
        },
        {
          id: 'HYBRID',
          name: 'Hybrid Multi-Mode Tokenization',
          description: 'Combines multiple security modes',
          features: ['Customizable security layers', 'Best-of-breed protection', 'Maximum security', 'Flexible configuration'],
          icon: <HybridIcon />,
          color: '#f44336'
        }
      ]);
    }
  };

  const getIconForMode = (mode: string) => {
    switch (mode) {
      case 'STANDARD': return <SecurityIcon />;
      case 'BIOMETRIC': return <FingerprintIcon />;
      case 'QUANTUM': return <QuantumIcon />;
      case 'CLOUD_REPLICATED': return <CloudIcon />;
      case 'HYBRID': return <HybridIcon />;
      default: return <SecurityIcon />;
    }
  };

  const getColorForMode = (mode: string) => {
    switch (mode) {
      case 'STANDARD': return '#2196f3';
      case 'BIOMETRIC': return '#4caf50';
      case 'QUANTUM': return '#9c27b0';
      case 'CLOUD_REPLICATED': return '#ff9800';
      case 'HYBRID': return '#f44336';
      default: return '#2196f3';
    }
  };

  const handleTokenize = async () => {
    if (!cardNumber || cardNumber.length < 13) {
      setError('Please enter a valid card number');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      let endpoint = '/unified-tokens/tokenize';
      let requestData: any = {
        cardNumber,
        merchantId,
        tokenizationMode: selectedMode
      };
      
      console.log('Sending tokenization request:', requestData);

      // Add mode-specific data
      if (selectedMode === 'BIOMETRIC') {
        requestData.biometricData = biometricData;
      } else if (selectedMode === 'HYBRID') {
        requestData.biometricData = biometricData;
        requestData.securityOptions = securityOptions;
        requestData.enabledModes = ['BIOMETRIC', 'QUANTUM', 'CLOUD_REPLICATED'];
      } else if (selectedMode === 'QUANTUM' || selectedMode === 'CLOUD_REPLICATED') {
        requestData.securityOptions = securityOptions;
      }

      const result = await api.post(endpoint, requestData, {
        headers: {
          'X-Merchant-ID': merchantId,
          'X-API-Key': 'test-api-key'
        }
      });

      setResponse(result.data);
      setCurrentTab(1); // Switch to response tab
    } catch (err: any) {
      setError(err.response?.data?.message || 'Tokenization failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleModeInfo = (mode: TokenizationMode) => {
    setSelectedModeInfo(mode);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 2, fontSize: 40 }} />
          Unified Tokenization Platform
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Advanced multi-mode tokenization with support for standard, biometric, quantum-resistant, 
          cloud-replicated, and hybrid security modes.
        </Typography>
      </Paper>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
          <Tab label="Create Token" />
          <Tab label="Token Response" disabled={!response} />
          <Tab label="Available Modes" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            {/* Mode Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Select Tokenization Mode</Typography>
              <Grid container spacing={2}>
                {tokenizationModes.map((mode) => (
                  <Grid item xs={12} md={6} lg={4} key={mode.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedMode === mode.id ? `2px solid ${mode.color}` : '1px solid #e0e0e0',
                        transition: 'all 0.3s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                      }}
                      onClick={() => setSelectedMode(mode.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ color: mode.color, mr: 2 }}>{mode.icon}</Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {mode.name}
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleModeInfo(mode); }}>
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {mode.description}
                        </Typography>
                        {selectedMode === mode.id && (
                          <Chip 
                            label="Selected" 
                            size="small" 
                            color="primary" 
                            sx={{ mt: 1 }} 
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Card Input */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Card Number"
                type={showCardNumber ? 'text' : 'password'}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                placeholder="Enter card number"
                InputProps={{
                  startAdornment: <CardIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: (
                    <IconButton onClick={() => setShowCardNumber(!showCardNumber)}>
                      {showCardNumber ? <ViewOffIcon /> : <ViewIcon />}
                    </IconButton>
                  )
                }}
                helperText="Test cards: 4532015112830366, 5425233430109903"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Merchant ID"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
              />
            </Grid>

            {/* Mode-specific options */}
            {selectedMode === 'BIOMETRIC' && (
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Biometric Options</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                          <InputLabel>Biometric Type</InputLabel>
                          <Select
                            value={biometricData.type}
                            onChange={(e) => setBiometricData({...biometricData, type: e.target.value})}
                          >
                            <MenuItem value="FINGERPRINT">Fingerprint</MenuItem>
                            <MenuItem value="FACIAL">Facial Recognition</MenuItem>
                            <MenuItem value="VOICE">Voice Pattern</MenuItem>
                            <MenuItem value="BEHAVIORAL">Behavioral</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          fullWidth
                          label="Biometric Template (Base64)"
                          value={biometricData.template}
                          onChange={(e) => setBiometricData({...biometricData, template: e.target.value})}
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}

            {(selectedMode === 'QUANTUM' || selectedMode === 'CLOUD_REPLICATED' || selectedMode === 'HYBRID') && (
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Advanced Security Options</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {selectedMode !== 'CLOUD_REPLICATED' && (
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Quantum Key Size"
                            value={securityOptions.quantumKeySize}
                            onChange={(e) => setSecurityOptions({
                              ...securityOptions, 
                              quantumKeySize: parseInt(e.target.value)
                            })}
                          />
                        </Grid>
                      )}
                      {selectedMode !== 'QUANTUM' && (
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth
                            label="Replication Regions (comma-separated)"
                            value={securityOptions.replicationRegions.join(', ')}
                            onChange={(e) => setSecurityOptions({
                              ...securityOptions,
                              replicationRegions: e.target.value.split(',').map(s => s.trim())
                            })}
                          />
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={securityOptions.enableAudit}
                              onChange={(e) => setSecurityOptions({
                                ...securityOptions,
                                enableAudit: e.target.checked
                              })}
                            />
                          }
                          label="Enable Advanced Audit Trail"
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                onClick={handleTokenize}
                disabled={loading}
                sx={{ 
                  background: `linear-gradient(45deg, ${getColorForMode(selectedMode)} 30%, ${getColorForMode(selectedMode)}99 90%)` 
                }}
              >
                {loading ? <CircularProgress size={24} /> : `Generate ${tokenizationModes.find(m => m.id === selectedMode)?.name || 'Token'}`}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {response && (
            <Box>
              <Alert severity={response.success ? "success" : "error"} sx={{ mb: 3 }}>
                {response.message}
              </Alert>

              {response.success && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>Token Details</Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Token Value" 
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', mr: 1 }}>
                                  {response.tokenValue}
                                </Typography>
                                <IconButton size="small" onClick={() => copyToClipboard(response.tokenValue)}>
                                  <CopyIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Masked PAN" secondary={response.maskedPan} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Status" secondary={
                            <Chip label={response.status} color="success" size="small" />
                          } />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Tokenization Mode" secondary={
                            <Chip 
                              label={response.tokenizationMode} 
                              size="small"
                              sx={{ backgroundColor: getColorForMode(response.tokenizationMode) + '20' }}
                            />
                          } />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Expires At" secondary={new Date(response.expiresAt).toLocaleString()} />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>

                  {response.metadata && Object.keys(response.metadata).length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Metadata</Typography>
                        <List>
                          {Object.entries(response.metadata).map(([key, value]) => (
                            <ListItem key={key}>
                              <ListItemText primary={key} secondary={String(value)} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            {tokenizationModes.map((mode) => (
              <Grid item xs={12} md={6} key={mode.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: mode.color, mr: 2 }}>{mode.icon}</Box>
                      <Typography variant="h6">{mode.name}</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>{mode.description}</Typography>
                    <Typography variant="subtitle2" gutterBottom>Key Features:</Typography>
                    <List dense>
                      {mode.features.map((feature, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckIcon fontSize="small" sx={{ color: mode.color }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Mode Info Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedModeInfo && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ color: selectedModeInfo.color, mr: 2 }}>{selectedModeInfo.icon}</Box>
                {selectedModeInfo.name}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography paragraph>{selectedModeInfo.description}</Typography>
              <Typography variant="subtitle2" gutterBottom>Features:</Typography>
              <List>
                {selectedModeInfo.features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon sx={{ color: selectedModeInfo.color }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default UnifiedTokenization;