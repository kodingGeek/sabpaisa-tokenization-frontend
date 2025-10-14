import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  Security,
  Fingerprint,
  CreditCard,
  TrendingUp,
  CheckCircle
} from '@mui/icons-material';
import { useAdaptiveTheme, useThemeColors } from '../hooks/useAdaptiveTheme';

/**
 * Example: Adaptive Tokenization Dashboard
 * This component demonstrates how the theme adapts to different contexts
 */
export const AdaptiveTokenizationDashboard: React.FC = () => {
  const theme = useTheme();
  const adaptiveTheme = useAdaptiveTheme();
  const themeColors = useThemeColors();
  
  // Mock data
  const stats = {
    totalTokens: 15243,
    activeTokens: 14891,
    successRate: 99.8,
    fraudsPrevented: 352
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with adaptive gradient */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4,
          background: themeColors.gradient || 
            `linear-gradient(135deg, ${alpha(themeColors.primary, 0.1)} 0%, ${alpha(themeColors.secondary, 0.1)} 100%)`
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Tokenization Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time tokenization metrics and insights
            </Typography>
          </Box>
          
          {/* Theme indicator */}
          <Box sx={{ textAlign: 'right' }}>
            <Chip 
              label={`${adaptiveTheme.themeName}`}
              size="small"
              color="primary"
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" display="block" color="text.secondary">
              Match Score: {adaptiveTheme.matchScore}%
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Adaptive alerts based on security level */}
      {adaptiveTheme.isSecurityElevated && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          className="security-indicator"
        >
          Security level is elevated. Enhanced monitoring is active.
        </Alert>
      )}
      
      {/* Stats Cards with theme-aware styling */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.success.main, 0.1)
                : theme.palette.background.paper,
              borderTop: `4px solid ${theme.palette.success.main}`
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Tokens
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalTokens.toLocaleString()}
                  </Typography>
                </Box>
                <CreditCard sx={{ fontSize: 40, color: theme.palette.success.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.info.main, 0.1)
                : theme.palette.background.paper,
              borderTop: `4px solid ${theme.palette.info.main}`
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Tokens
                  </Typography>
                  <Typography variant="h4">
                    {stats.activeTokens.toLocaleString()}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: theme.palette.info.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.primary.main, 0.1)
                : theme.palette.background.paper,
              borderTop: `4px solid ${theme.palette.primary.main}`
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h4">
                    {stats.successRate}%
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.warning.main, 0.1)
                : theme.palette.background.paper,
              borderTop: `4px solid ${theme.palette.warning.main}`,
              // Add pulsing animation for security-critical themes
              ...(adaptiveTheme.isSecurityElevated && {
                animation: 'pulse 2s infinite'
              })
            }}
            className={adaptiveTheme.isSecurityElevated ? 'security-critical' : ''}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Frauds Prevented
                  </Typography>
                  <Typography variant="h4">
                    {stats.fraudsPrevented}
                  </Typography>
                </Box>
                <Security sx={{ fontSize: 40, color: theme.palette.warning.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Action buttons with theme-aware styling */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            startIcon={<CreditCard />}
            sx={{
              // Dynamic gradient based on theme
              background: `linear-gradient(45deg, ${themeColors.primary} 30%, ${themeColors.secondary} 90%)`,
              boxShadow: `0 3px 5px 2px ${alpha(themeColors.primary, 0.3)}`
            }}
          >
            Generate Token
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<Fingerprint />}
            sx={{
              borderColor: themeColors.accent || themeColors.secondary,
              color: themeColors.accent || themeColors.secondary,
              '&:hover': {
                borderColor: themeColors.accent || themeColors.secondary,
                background: alpha(themeColors.accent || themeColors.secondary, 0.1)
              }
            }}
          >
            Biometric Token
          </Button>
          
          <Button 
            variant="text"
            onClick={() => adaptiveTheme.toggleThemeMode()}
          >
            {adaptiveTheme.isAutoMode ? 'Disable' : 'Enable'} Auto Theme
          </Button>
        </Box>
      </Paper>
      
      {/* Theme recommendations */}
      {adaptiveTheme.shouldSuggestThemeChange && (
        <Alert 
          severity="info" 
          sx={{ mt: 3 }}
          action={
            <Button 
              size="small" 
              onClick={() => adaptiveTheme.selectTheme(adaptiveTheme.recommendedTheme!)}
            >
              Switch
            </Button>
          }
        >
          Based on your current activity, we recommend switching to the {adaptiveTheme.recommendedTheme} theme
        </Alert>
      )}
    </Container>
  );
};

/**
 * Example: Theme-Aware Security Monitor
 * Automatically switches to high-visibility themes during security events
 */
export const AdaptiveSecurityMonitor: React.FC = () => {
  const theme = useTheme();
  const adaptiveTheme = useAdaptiveTheme();
  const [threatLevel, setThreatLevel] = React.useState<'low' | 'medium' | 'high'>('low');
  
  // Simulate threat detection
  React.useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.9) {
        setThreatLevel('high');
        // In a real app, this would trigger the security level change
        // adaptiveTheme.setSecurityLevel('critical');
      } else if (random > 0.7) {
        setThreatLevel('medium');
      } else {
        setThreatLevel('low');
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getThreatColor = () => {
    switch (threatLevel) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      default: return theme.palette.success.main;
    }
  };
  
  return (
    <Card 
      sx={{ 
        border: `2px solid ${getThreatColor()}`,
        background: alpha(getThreatColor(), 0.05),
        ...(threatLevel === 'high' && {
          animation: 'alert-pulse 1s infinite'
        })
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security sx={{ color: getThreatColor() }} />
          Security Monitor
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Current Threat Level
          </Typography>
          <Typography variant="h4" sx={{ color: getThreatColor(), textTransform: 'uppercase' }}>
            {threatLevel}
          </Typography>
        </Box>
        
        {threatLevel === 'high' && adaptiveTheme.themeMode !== 'dark' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            High threat detected. Consider enabling high contrast mode for better visibility.
            <Button 
              size="small" 
              onClick={() => adaptiveTheme.enableHighContrast()}
              sx={{ ml: 1 }}
            >
              Enable
            </Button>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Example: Accessibility-Aware Component
 * Adapts based on user's accessibility preferences
 */
export const AdaptiveAccessibilityExample: React.FC = () => {
  const theme = useTheme();
  const adaptiveTheme = useAdaptiveTheme();
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{
          // Larger text for low-vision mode
          fontSize: adaptiveTheme.isHighContrast ? '1.5rem' : '1.25rem',
          fontWeight: adaptiveTheme.isHighContrast ? 700 : 600
        }}
      >
        Accessibility Features
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              // Enhanced borders for high contrast
              border: adaptiveTheme.isHighContrast 
                ? `3px solid ${theme.palette.text.primary}`
                : `1px solid ${theme.palette.divider}`
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Text Scaling
              </Typography>
              <Typography variant="body2">
                {adaptiveTheme.isHighContrast 
                  ? 'High contrast mode is active with enhanced text visibility'
                  : 'Standard text rendering is active'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
            <Button 
              variant="contained"
              onClick={() => adaptiveTheme.enableHighContrast()}
              disabled={adaptiveTheme.isHighContrast}
              sx={{
                // Extra padding for easier clicking
                py: adaptiveTheme.isHighContrast ? 2 : 1
              }}
            >
              Enable High Contrast
            </Button>
            <Button 
              variant="outlined"
              onClick={() => adaptiveTheme.disableHighContrast()}
              disabled={!adaptiveTheme.isHighContrast}
            >
              Disable High Contrast
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdaptiveTokenizationDashboard;