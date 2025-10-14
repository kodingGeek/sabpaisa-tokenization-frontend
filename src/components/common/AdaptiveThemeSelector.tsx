import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Paper,
  Divider,
  LinearProgress,
  Alert,
  Zoom,
  Fade,
  alpha,
  useTheme
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AutoAwesome as AutoIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Accessibility as AccessibilityIcon,
  Schedule as TimeIcon,
  Psychology as SmartIcon,
  Check as CheckIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAdaptiveTheme } from '../../contexts/AdaptiveThemeContext';
import { AdaptiveThemeConfig } from '../../themes/adaptiveThemes';

interface ThemePreviewCardProps {
  theme: AdaptiveThemeConfig;
  isSelected: boolean;
  isSuggested: boolean;
  onClick: () => void;
}

const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({ 
  theme, 
  isSelected, 
  isSuggested,
  onClick 
}) => {
  const muiTheme = useTheme();
  
  return (
    <Zoom in timeout={300}>
      <Card
        sx={{
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s ease',
          border: isSelected ? `2px solid ${muiTheme.palette.primary.main}` : '1px solid transparent',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                width: '100%',
                height: 80,
                borderRadius: 1,
                background: theme.background?.gradient || 
                  `linear-gradient(135deg, ${theme.background?.default || '#f5f5f5'} 0%, ${theme.background?.paper || '#ffffff'} 100%)`,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: theme.primary[500] || theme.primary.main
                  }}
                />
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: theme.secondary[500] || theme.secondary.main
                  }}
                />
                {theme.accent && (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: theme.accent[500] || theme.accent.main
                    }}
                  />
                )}
              </Box>
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold">
              {theme.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {theme.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {theme.mode === 'dark' ? (
                <Chip size="small" icon={<DarkModeIcon />} label="Dark" />
              ) : (
                <Chip size="small" icon={<LightModeIcon />} label="Light" />
              )}
              
              {isSuggested && (
                <Chip 
                  size="small" 
                  icon={<AutoIcon />} 
                  label="Suggested" 
                  color="primary"
                />
              )}
            </Box>
            
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <CheckIcon fontSize="small" />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

const AdaptiveThemeSelector: React.FC = () => {
  const adaptiveTheme = useAdaptiveTheme();
  const muiTheme = useTheme();
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const getTimeIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 21) return '🌆';
    return '🌙';
  };
  
  return (
    <>
      <Tooltip title="Theme Settings">
        <IconButton onClick={handleOpen} sx={{ ml: 1 }}>
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PaletteIcon />
            <Typography variant="h6">Adaptive Theme Settings</Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {/* Theme Mode Toggle */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Theme Mode
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={adaptiveTheme.themeMode === 'auto'}
                    onChange={(e) => adaptiveTheme.setThemeMode(e.target.checked ? 'auto' : 'manual')}
                  />
                }
                label={adaptiveTheme.themeMode === 'auto' ? 'Automatic' : 'Manual'}
              />
            </Box>
            
            {adaptiveTheme.themeMode === 'auto' && (
              <Fade in>
                <Box>
                  <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                    Theme automatically adapts based on time of day, your role, and current activity
                  </Alert>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Current Context
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        size="small" 
                        icon={<TimeIcon />} 
                        label={`${getTimeIcon()} ${adaptiveTheme.timeContext}`}
                      />
                      {adaptiveTheme.userRole && (
                        <Chip size="small" label={adaptiveTheme.userRole} />
                      )}
                      {adaptiveTheme.activityContext.map((activity, idx) => (
                        <Chip key={idx} size="small" label={activity} />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Theme Match Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={adaptiveTheme.themeScore} 
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {adaptiveTheme.themeScore}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            )}
          </Paper>
          
          {/* Current Theme */}
          <Paper sx={{ p: 3, mb: 3, background: alpha(muiTheme.palette.primary.main, 0.05) }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Current Theme
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  background: adaptiveTheme.currentTheme.background?.gradient ||
                    `linear-gradient(135deg, ${adaptiveTheme.currentTheme.primary[500]} 0%, ${adaptiveTheme.currentTheme.secondary[500]} 100%)`
                }}
              />
              <Box>
                <Typography variant="h6">{adaptiveTheme.currentTheme.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {adaptiveTheme.currentTheme.description}
                </Typography>
              </Box>
            </Box>
          </Paper>
          
          {/* Suggested Themes */}
          {adaptiveTheme.suggestedThemes.length > 0 && adaptiveTheme.themeMode === 'auto' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Suggested Themes
              </Typography>
              <Grid container spacing={2}>
                {adaptiveTheme.suggestedThemes.map((theme) => (
                  <Grid item xs={12} sm={6} md={4} key={theme.id}>
                    <ThemePreviewCard
                      theme={theme}
                      isSelected={adaptiveTheme.currentTheme.id === theme.id}
                      isSuggested={true}
                      onClick={() => adaptiveTheme.setManualTheme(theme.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {/* All Themes */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              All Themes
            </Typography>
            <Grid container spacing={2}>
              {adaptiveTheme.availableThemes.map((theme) => (
                <Grid item xs={12} sm={6} md={4} key={theme.id}>
                  <ThemePreviewCard
                    theme={theme}
                    isSelected={adaptiveTheme.currentTheme.id === theme.id}
                    isSuggested={adaptiveTheme.suggestedThemes.some(t => t.id === theme.id)}
                    onClick={() => adaptiveTheme.setManualTheme(theme.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* Advanced Settings */}
          <Divider sx={{ my: 3 }} />
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            startIcon={<SettingsIcon />}
            sx={{ mb: 2 }}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </Button>
          
          {showAdvanced && (
            <Fade in>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Security Level</InputLabel>
                    <Select
                      value={adaptiveTheme.securityLevel}
                      onChange={(e) => adaptiveTheme.setSecurityLevel(e.target.value as any)}
                      startAdornment={<SecurityIcon sx={{ ml: 1, mr: 0.5 }} />}
                    >
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="elevated">Elevated</MenuItem>
                      <MenuItem value="critical">Critical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Accessibility Mode</InputLabel>
                    <Select
                      value={adaptiveTheme.accessibilityMode}
                      onChange={(e) => adaptiveTheme.setAccessibilityMode(e.target.value as any)}
                      startAdornment={<AccessibilityIcon sx={{ ml: 1, mr: 0.5 }} />}
                    >
                      <MenuItem value="standard">Standard</MenuItem>
                      <MenuItem value="high-contrast">High Contrast</MenuItem>
                      <MenuItem value="low-vision">Low Vision Support</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {adaptiveTheme.securityLevel !== 'normal' && (
                  <Grid item xs={12}>
                    <Alert severity="warning">
                      Security level is set to {adaptiveTheme.securityLevel}. Theme will adapt to show enhanced security indicators.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Fade>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdaptiveThemeSelector;