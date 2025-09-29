import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  AlertTitle,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Paper,
  CircularProgress,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  Face as FaceIcon,
  Mic as MicIcon,
  Mouse as MouseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Security as SecurityIcon,
  VpnKey as KeyIcon,
  PhotoCamera as PhotoCameraIcon,
  TouchApp as TouchIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

interface BiometricModality {
  type: 'facial' | 'fingerprint' | 'voice' | 'behavioral';
  name: string;
  icon: React.ReactNode;
  enrolled: boolean;
  quality: number;
  lastUsed?: string;
}

const BiometricAuth: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState({
    userId: '',
    merchantId: '',
  });
  const [modalities, setModalities] = useState<BiometricModality[]>([
    {
      type: 'facial',
      name: 'Facial Recognition',
      icon: <FaceIcon />,
      enrolled: false,
      quality: 0,
    },
    {
      type: 'fingerprint',
      name: 'Fingerprint',
      icon: <FingerprintIcon />,
      enrolled: false,
      quality: 0,
    },
    {
      type: 'voice',
      name: 'Voice Recognition',
      icon: <MicIcon />,
      enrolled: false,
      quality: 0,
    },
    {
      type: 'behavioral',
      name: 'Behavioral Biometrics',
      icon: <MouseIcon />,
      enrolled: false,
      quality: 0,
    },
  ]);
  const [scanning, setScanning] = useState<string | null>(null);
  const [authDialog, setAuthDialog] = useState(false);
  const [authResult, setAuthResult] = useState<any>(null);
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const steps = [
    'User Information',
    'Select Biometric Modalities',
    'Capture Biometric Data',
    'Verification & Completion',
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const startBiometricCapture = async (type: string) => {
    setScanning(type);
    
    // Simulate biometric capture
    setTimeout(() => {
      setModalities(prev => prev.map(m => 
        m.type === type 
          ? { ...m, enrolled: true, quality: 85 + Math.random() * 15 }
          : m
      ));
      setScanning(null);
    }, 3000);
  };

  const performBiometricAuth = () => {
    setAuthDialog(false);
    // Simulate authentication
    setTimeout(() => {
      setAuthResult({
        success: true,
        confidence: 0.95,
        modalities: ['facial', 'fingerprint'],
        timestamp: new Date().toISOString(),
      });
    }, 2000);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'success';
    if (quality >= 70) return 'warning';
    return 'error';
  };

  const getSecurityLevel = () => {
    const enrolledCount = modalities.filter(m => m.enrolled).length;
    if (enrolledCount >= 3) return { level: 'VERY HIGH', color: 'success' };
    if (enrolledCount === 2) return { level: 'HIGH', color: 'primary' };
    if (enrolledCount === 1) return { level: 'MEDIUM', color: 'warning' };
    return { level: 'LOW', color: 'error' };
  };

  const security = getSecurityLevel();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <FingerprintIcon sx={{ mr: 1 }} />
        Biometric Tokenization
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Enhanced Security with Biometrics</AlertTitle>
        Protect your tokens with multi-modal biometric authentication. Combine facial recognition,
        fingerprints, voice, and behavioral patterns for maximum security.
      </Alert>

      <Grid container spacing={3}>
        {/* Enrollment Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Biometric Enrollment</Typography>
              
              <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                  <StepLabel>
                    {steps[0]}
                  </StepLabel>
                  <StepContent>
                    <TextField
                      fullWidth
                      label="User ID"
                      value={enrollmentData.userId}
                      onChange={(e) => setEnrollmentData({ ...enrollmentData, userId: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Merchant ID"
                      value={enrollmentData.merchantId}
                      onChange={(e) => setEnrollmentData({ ...enrollmentData, merchantId: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={!enrollmentData.userId || !enrollmentData.merchantId}
                      >
                        Continue
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                <Step>
                  <StepLabel>{steps[1]}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Select the biometric modalities you want to use for authentication.
                    </Typography>
                    <List>
                      {modalities.map((modality) => (
                        <ListItem key={modality.type}>
                          <ListItemIcon>{modality.icon}</ListItemIcon>
                          <ListItemText
                            primary={modality.name}
                            secondary={`Security boost: ${modality.type === 'facial' ? '+30%' : modality.type === 'fingerprint' ? '+35%' : modality.type === 'voice' ? '+20%' : '+15%'}`}
                          />
                          <Switch
                            edge="end"
                            checked={modality.enrolled}
                            disabled
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                      <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                <Step>
                  <StepLabel>{steps[2]}</StepLabel>
                  <StepContent>
                    <Grid container spacing={2}>
                      {modalities.map((modality) => (
                        <Grid item xs={12} sm={6} key={modality.type}>
                          <Card
                            sx={{
                              border: modality.enrolled ? '2px solid' : '1px solid',
                              borderColor: modality.enrolled ? 'success.main' : 'divider',
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                {modality.icon}
                                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                  {modality.name}
                                </Typography>
                              </Box>
                              {modality.enrolled ? (
                                <>
                                  <CheckCircleIcon color="success" sx={{ fontSize: 48 }} />
                                  <Typography variant="body2" color="success.main">
                                    Enrolled
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={modality.quality}
                                    color={getQualityColor(modality.quality) as any}
                                    sx={{ mt: 1 }}
                                  />
                                  <Typography variant="caption">
                                    Quality: {modality.quality.toFixed(0)}%
                                  </Typography>
                                </>
                              ) : (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => startBiometricCapture(modality.type)}
                                  disabled={scanning !== null}
                                  startIcon={scanning === modality.type ? <CircularProgress size={16} /> : modality.icon}
                                >
                                  {scanning === modality.type ? 'Scanning...' : 'Start Capture'}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={!modalities.some(m => m.enrolled)}
                      >
                        Continue
                      </Button>
                      <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                <Step>
                  <StepLabel>{steps[3]}</StepLabel>
                  <StepContent>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <AlertTitle>Enrollment Successful!</AlertTitle>
                      Your biometric data has been securely enrolled. You can now use biometric
                      authentication for tokenization.
                    </Alert>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" gutterBottom>Enrollment Summary</Typography>
                      <List dense>
                        {modalities.filter(m => m.enrolled).map((modality) => (
                          <ListItem key={modality.type}>
                            <ListItemIcon>{modality.icon}</ListItemIcon>
                            <ListItemText
                              primary={modality.name}
                              secondary={`Quality: ${modality.quality.toFixed(0)}%`}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Security Level: <Chip label={security.level} color={security.color as any} size="small" />
                      </Typography>
                    </Paper>
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setEnrollmentComplete(true)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Complete Enrollment
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Security Status</Typography>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: security.color + '.main',
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" color={security.color + '.main'}>
                  {security.level}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {modalities.filter(m => m.enrolled).length} of {modalities.length} modalities enrolled
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(modalities.filter(m => m.enrolled).length / modalities.length) * 100}
                sx={{ mb: 2 }}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Test Authentication</Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FingerprintIcon />}
                onClick={() => setAuthDialog(true)}
                disabled={!modalities.some(m => m.enrolled)}
              >
                Authenticate Now
              </Button>
              {authResult && (
                <Alert severity={authResult.success ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {authResult.success ? 'Authentication successful!' : 'Authentication failed'}
                  <Typography variant="caption" display="block">
                    Confidence: {(authResult.confidence * 100).toFixed(1)}%
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Benefits</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Enhanced Security"
                    secondary="Multi-factor biometric protection"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Liveness Detection"
                    secondary="Anti-spoofing measures"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Adaptive Learning"
                    secondary="Improves accuracy over time"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="FIDO Compliant"
                    secondary="Industry standard protocols"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Authentication Dialog */}
      <Dialog open={authDialog} onClose={() => setAuthDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Biometric Authentication</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide your biometric data to authenticate.
          </Typography>
          <List>
            {modalities.filter(m => m.enrolled).map((modality) => (
              <ListItem key={modality.type}>
                <ListItemIcon>{modality.icon}</ListItemIcon>
                <ListItemText primary={modality.name} secondary="Ready for authentication" />
                <CheckCircleIcon color="success" />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthDialog(false)}>Cancel</Button>
          <Button onClick={performBiometricAuth} variant="contained" startIcon={<FingerprintIcon />}>
            Authenticate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BiometricAuth;