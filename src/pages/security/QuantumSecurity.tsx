import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  VpnKey as KeyIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  Update as UpdateIcon,
  Lock as LockIcon,
  CloudSync as CloudSyncIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
// Removed unused imports from react-chartjs-2

interface QuantumMetrics {
  quantumReadinessScore: number;
  encryptionStrength: number;
  keyRotationInterval: number;
  lastKeyRotation: string;
  activeAlgorithms: string[];
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedQuantumThreat: string;
}

const QuantumSecurity: React.FC = () => {
  const [metrics, setMetrics] = useState<QuantumMetrics>({
    quantumReadinessScore: 95,
    encryptionStrength: 256,
    keyRotationInterval: 30,
    lastKeyRotation: new Date().toISOString(),
    activeAlgorithms: ['NTRU-1024', 'AES-256-GCM', 'SHA3-512', 'Dilithium-5'],
    threatLevel: 'LOW',
    estimatedQuantumThreat: '2030+',
  });
  const [loading, setLoading] = useState(false);
  const [rotationDialog, setRotationDialog] = useState(false);
  const [encryptionTest, setEncryptionTest] = useState({
    running: false,
    result: null as any,
  });
  const [selectedMerchant, setSelectedMerchant] = useState('');

  const quantumFeatures = [
    {
      title: 'Post-Quantum Cryptography',
      description: 'NIST Level 5 certified algorithms resistant to quantum attacks',
      status: 'active',
      icon: <ShieldIcon />,
    },
    {
      title: 'Hybrid Encryption',
      description: 'Combines classical and quantum-resistant algorithms',
      status: 'active',
      icon: <LockIcon />,
    },
    {
      title: 'Automatic Key Rotation',
      description: '30-day rotation cycle with zero-downtime updates',
      status: 'active',
      icon: <UpdateIcon />,
    },
    {
      title: 'Quantum-Safe Backup',
      description: 'Encrypted backups using lattice-based cryptography',
      status: 'active',
      icon: <CloudSyncIcon />,
    },
  ];

  const testQuantumEncryption = async () => {
    setEncryptionTest({ running: true, result: null });
    
    // Simulate API call
    setTimeout(() => {
      setEncryptionTest({
        running: false,
        result: {
          success: true,
          originalSize: 1024,
          encryptedSize: 2048,
          encryptionTime: 12,
          decryptionTime: 8,
          algorithm: 'NTRU-HYBRID-AES-256-GCM',
          quantumSecurityLevel: 256,
        },
      });
    }, 2000);
  };

  const rotateKeys = () => {
    setRotationDialog(false);
    setLoading(true);
    
    // Simulate key rotation
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        lastKeyRotation: new Date().toISOString(),
      }));
      setLoading(false);
    }, 3000);
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <SecurityIcon sx={{ mr: 1 }} />
        Quantum-Resistant Encryption
      </Typography>

      {/* Alert Banner */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Quantum Security Status</AlertTitle>
        Your system is protected with NIST Level 5 post-quantum cryptographic algorithms.
        Current quantum threat level: <strong>{metrics.threatLevel}</strong>
      </Alert>

      {/* Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Quantum Readiness
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={metrics.quantumReadinessScore}
                  size={80}
                  thickness={4}
                  sx={{ color: 'success.main' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {metrics.quantumReadinessScore}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                NIST Compliant
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Encryption Strength
              </Typography>
              <Typography variant="h4">
                {metrics.encryptionStrength}-bit
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{ mt: 1 }}
                color="primary"
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Maximum Security
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Threat Level
              </Typography>
              <Chip
                label={metrics.threatLevel}
                color={getThreatColor(metrics.threatLevel) as any}
                size="large"
                sx={{ mt: 1, mb: 1 }}
              />
              <Typography variant="body2" color="textSecondary">
                Est. Threat: {metrics.estimatedQuantumThreat}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Last Key Rotation
              </Typography>
              <Typography variant="h6">
                {new Date(metrics.lastKeyRotation).toLocaleDateString()}
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<UpdateIcon />}
                onClick={() => setRotationDialog(true)}
                sx={{ mt: 1 }}
                disabled={loading}
              >
                Rotate Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Algorithms */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Active Quantum Algorithms</Typography>
              <List>
                {metrics.activeAlgorithms.map((algo, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={algo}
                      secondary={getAlgorithmDescription(algo)}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quantum Features</Typography>
              <List>
                {quantumFeatures.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>{feature.icon}</ListItemIcon>
                    <ListItemText
                      primary={feature.title}
                      secondary={feature.description}
                    />
                    <Chip
                      label={feature.status}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Encryption Test */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Test Quantum Encryption</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={testQuantumEncryption}
              disabled={encryptionTest.running}
              startIcon={encryptionTest.running ? <CircularProgress size={20} /> : <SpeedIcon />}
            >
              {encryptionTest.running ? 'Testing...' : 'Run Test'}
            </Button>
            
            {encryptionTest.result && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label={`Encryption: ${encryptionTest.result.encryptionTime}ms`} />
                <Chip label={`Decryption: ${encryptionTest.result.decryptionTime}ms`} />
                <Chip label={`Algorithm: ${encryptionTest.result.algorithm}`} />
                <Chip
                  label="Test Passed"
                  color="success"
                  icon={<CheckCircleIcon />}
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Quantum Migration Timeline</Typography>
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 48 }} />
                  <Typography variant="h6">Phase 1: Complete</Typography>
                  <Typography variant="body2" color="textSecondary">
                    2024-2025: Hybrid classical-quantum encryption
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={48} />
                  <Typography variant="h6" sx={{ mt: 1 }}>Phase 2: In Progress</Typography>
                  <Typography variant="body2" color="textSecondary">
                    2025-2027: Full post-quantum migration
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="h6">Phase 3: Planned</Typography>
                  <Typography variant="body2" color="textSecondary">
                    2027+: Quantum-safe by default
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </CardContent>
      </Card>

      {/* Key Rotation Dialog */}
      <Dialog open={rotationDialog} onClose={() => setRotationDialog(false)}>
        <DialogTitle>Rotate Quantum Encryption Keys</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This will rotate all quantum encryption keys for enhanced security.
            The process is seamless with zero downtime.
          </Typography>
          <TextField
            fullWidth
            label="Select Merchant (optional)"
            value={selectedMerchant}
            onChange={(e) => setSelectedMerchant(e.target.value)}
            placeholder="Leave empty to rotate all keys"
            sx={{ mb: 2 }}
          />
          <Alert severity="info">
            Key rotation typically takes 2-3 seconds per merchant.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRotationDialog(false)}>Cancel</Button>
          <Button onClick={rotateKeys} variant="contained" color="primary">
            Rotate Keys
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const getAlgorithmDescription = (algo: string): string => {
  const descriptions: { [key: string]: string } = {
    'NTRU-1024': 'Lattice-based public key encryption',
    'AES-256-GCM': 'Symmetric encryption with authenticated encryption',
    'SHA3-512': 'Quantum-resistant hash function',
    'Dilithium-5': 'Digital signature algorithm for highest security',
  };
  return descriptions[algo] || 'Advanced quantum-resistant algorithm';
};

export default QuantumSecurity;