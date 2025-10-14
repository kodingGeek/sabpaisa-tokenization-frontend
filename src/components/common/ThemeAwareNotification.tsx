import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  Box,
  Typography,
  IconButton,
  Chip,
  alpha
} from '@mui/material';
import {
  AutoAwesome as AutoIcon,
  Close as CloseIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  WbSunny as SunIcon,
  NightsStay as MoonIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useAdaptiveTheme } from '../../hooks/useAdaptiveTheme';

function SlideTransition(props: TransitionProps & { children: React.ReactElement }) {
  return <Slide {...props} direction="down" />;
}

interface NotificationData {
  id: string;
  type: 'theme-change' | 'recommendation' | 'security' | 'time-based';
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export const ThemeAwareNotification: React.FC = () => {
  const adaptiveTheme = useAdaptiveTheme();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [open, setOpen] = useState(false);
  
  // Monitor theme changes
  useEffect(() => {
    const previousTheme = localStorage.getItem('previousTheme');
    const currentThemeId = adaptiveTheme.themeName;
    
    if (previousTheme && previousTheme !== currentThemeId) {
      const notification: NotificationData = {
        id: `theme-${Date.now()}`,
        type: 'theme-change',
        title: 'Theme Updated',
        message: `Switched to ${currentThemeId} theme for optimal viewing`,
        severity: 'success',
        icon: <PaletteIcon />
      };
      
      setNotifications(prev => [...prev, notification]);
    }
    
    localStorage.setItem('previousTheme', currentThemeId);
  }, [adaptiveTheme.themeName]);
  
  // Monitor time-based suggestions
  useEffect(() => {
    const checkTimeBasedSuggestion = () => {
      const hour = new Date().getHours();
      let suggestion: NotificationData | null = null;
      
      if (hour === 6 && adaptiveTheme.themeMode === 'light') {
        suggestion = {
          id: `time-${Date.now()}`,
          type: 'time-based',
          title: 'Good Morning!',
          message: 'Switch to morning theme for a fresh start?',
          severity: 'info',
          icon: <SunIcon />,
          actions: [
            {
              label: 'Switch',
              onClick: () => adaptiveTheme.selectTheme('morning-fresh')
            }
          ]
        };
      } else if (hour === 20 && adaptiveTheme.themeMode === 'light') {
        suggestion = {
          id: `time-${Date.now()}`,
          type: 'time-based',
          title: 'Evening Time',
          message: 'Switch to dark mode to reduce eye strain?',
          severity: 'info',
          icon: <MoonIcon />,
          actions: [
            {
              label: 'Enable Dark Mode',
              onClick: () => adaptiveTheme.enableDarkMode()
            }
          ]
        };
      }
      
      if (suggestion) {
        setNotifications(prev => [...prev, suggestion]);
      }
    };
    
    // Check on mount and every hour
    checkTimeBasedSuggestion();
    const interval = setInterval(checkTimeBasedSuggestion, 3600000);
    
    return () => clearInterval(interval);
  }, [adaptiveTheme]);
  
  // Monitor security level changes
  useEffect(() => {
    const handleSecurityChange = (event: any) => {
      const { level } = event.detail;
      
      if (level === 'elevated' || level === 'critical') {
        const notification: NotificationData = {
          id: `security-${Date.now()}`,
          type: 'security',
          title: 'Security Alert',
          message: `Security level changed to ${level}. Theme adjusted for enhanced visibility.`,
          severity: level === 'critical' ? 'error' : 'warning',
          icon: <SecurityIcon />
        };
        
        setNotifications(prev => [...prev, notification]);
      }
    };
    
    window.addEventListener('securityLevelChanged', handleSecurityChange);
    return () => window.removeEventListener('securityLevelChanged', handleSecurityChange);
  }, []);
  
  // Monitor theme recommendations
  useEffect(() => {
    if (adaptiveTheme.shouldSuggestThemeChange && 
        adaptiveTheme.recommendedTheme && 
        adaptiveTheme.matchScore < 30) {
      const notification: NotificationData = {
        id: `recommendation-${Date.now()}`,
        type: 'recommendation',
        title: 'Theme Suggestion',
        message: `Your current activity suggests switching themes for better experience`,
        severity: 'info',
        icon: <AutoIcon />,
        actions: [
          {
            label: 'Switch Now',
            onClick: () => {
              adaptiveTheme.selectTheme(adaptiveTheme.recommendedTheme!);
              adaptiveTheme.enableAutoMode();
            }
          },
          {
            label: 'Enable Auto Mode',
            onClick: () => adaptiveTheme.enableAutoMode()
          }
        ]
      };
      
      setNotifications(prev => [...prev, notification]);
    }
  }, [adaptiveTheme.shouldSuggestThemeChange, adaptiveTheme.recommendedTheme, adaptiveTheme.matchScore]);
  
  // Process notification queue
  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      const [next, ...rest] = notifications;
      setCurrentNotification(next);
      setNotifications(rest);
      setOpen(true);
    }
  }, [notifications, currentNotification]);
  
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setCurrentNotification(null), 500);
  };
  
  if (!currentNotification) return null;
  
  return (
    <Snackbar
      open={open}
      autoHideDuration={
        currentNotification.type === 'recommendation' || 
        currentNotification.actions ? null : 6000
      }
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }}
    >
      <Alert
        severity={currentNotification.severity}
        icon={currentNotification.icon}
        onClose={handleClose}
        sx={{
          minWidth: 400,
          boxShadow: 4,
          '& .MuiAlert-icon': {
            fontSize: 28
          }
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>
          {currentNotification.title}
        </AlertTitle>
        <Typography variant="body2" sx={{ mb: currentNotification.actions ? 2 : 0 }}>
          {currentNotification.message}
        </Typography>
        
        {currentNotification.actions && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {currentNotification.actions.map((action, index) => (
              <Chip
                key={index}
                label={action.label}
                onClick={() => {
                  action.onClick();
                  handleClose();
                }}
                size="small"
                color="primary"
                variant={index === 0 ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        )}
        
        {currentNotification.type === 'time-based' && (
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={<TimeIcon />}
              label={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              size="small"
              variant="outlined"
            />
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};

// Hook for manual notifications
export const useThemeNotification = () => {
  const [manualNotification, setManualNotification] = useState<NotificationData | null>(null);
  
  const showNotification = (notification: Omit<NotificationData, 'id'>) => {
    setManualNotification({
      ...notification,
      id: `manual-${Date.now()}`
    });
  };
  
  return { showNotification, ThemeNotificationComponent: ThemeAwareNotification };
};

export default ThemeAwareNotification;