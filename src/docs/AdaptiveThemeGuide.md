# Adaptive Theme System Integration Guide

## Overview
The Adaptive Theme System automatically adjusts the UI theme based on multiple contextual factors including time of day, user role, current activity, security level, and accessibility needs.

## Features

### 1. Context-Aware Theme Selection
- **Time-based**: Morning, afternoon, evening, and night themes
- **Role-based**: Specific themes for Security Officers, Compliance Officers, System Admins, and Merchants
- **Activity-based**: Optimized themes for tokenization, analytics, fraud detection, etc.
- **Security-based**: Enhanced visibility themes for elevated or critical security states
- **Accessibility-based**: High contrast and low vision support

### 2. Automatic vs Manual Modes
- **Auto Mode**: Themes change automatically based on context
- **Manual Mode**: Users can select and lock a specific theme
- **Smart Suggestions**: System recommends themes based on current activity

## Integration Steps

### 1. Update App.tsx
Replace the existing theme implementation with the adaptive theme system:

```typescript
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdaptiveThemeWrapper from './components/common/AdaptiveThemeWrapper';
import ThemeAwareNotification from './components/common/ThemeAwareNotification';
// ... other imports

const App: React.FC = () => {
  // Get user role from authentication context
  const userRole = useAuth()?.user?.role || 'MERCHANT';
  
  return (
    <Router>
      <AdaptiveThemeWrapper initialUserRole={userRole}>
        {/* Your existing app content */}
        <Routes>
          {/* ... your routes */}
        </Routes>
        
        {/* Add theme notifications */}
        <ThemeAwareNotification />
      </AdaptiveThemeWrapper>
    </Router>
  );
};

export default App;
```

### 2. Add Theme Selector to Navigation
Add the theme selector to your main navigation:

```typescript
import AdaptiveThemeSelector from '../components/common/AdaptiveThemeSelector';

const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Your existing navigation */}
        
        {/* Add theme selector */}
        <Box sx={{ flexGrow: 1 }} />
        <AdaptiveThemeSelector />
      </Toolbar>
    </AppBar>
  );
};
```

### 3. Use Adaptive Theme Hook in Components
Access theme information and controls in your components:

```typescript
import { useAdaptiveTheme, useThemeColors } from '../hooks/useAdaptiveTheme';

const MyComponent: React.FC = () => {
  const adaptiveTheme = useAdaptiveTheme();
  const themeColors = useThemeColors();
  
  // Check theme state
  if (adaptiveTheme.isSecurityElevated) {
    // Show enhanced security indicators
  }
  
  // Use theme colors
  return (
    <Box sx={{ 
      background: themeColors.gradient || themeColors.background,
      color: themeColors.mode === 'dark' ? 'white' : 'black'
    }}>
      <Typography>
        Current theme: {adaptiveTheme.themeName}
        Match score: {adaptiveTheme.matchScore}%
      </Typography>
      
      {/* Toggle theme mode */}
      <Button onClick={() => adaptiveTheme.toggleThemeMode()}>
        Switch to {adaptiveTheme.isAutoMode ? 'Manual' : 'Auto'} Mode
      </Button>
    </Box>
  );
};
```

### 4. Security Integration
Trigger theme changes based on security events:

```typescript
import { useAdaptiveTheme } from '../contexts/AdaptiveThemeContext';

const SecurityMonitor: React.FC = () => {
  const { setSecurityLevel } = useAdaptiveTheme();
  
  useEffect(() => {
    // Monitor security events
    const checkSecurityStatus = async () => {
      const threats = await fetchSecurityThreats();
      
      if (threats.critical > 0) {
        setSecurityLevel('critical');
      } else if (threats.elevated > 0) {
        setSecurityLevel('elevated');
      } else {
        setSecurityLevel('normal');
      }
    };
    
    checkSecurityStatus();
    const interval = setInterval(checkSecurityStatus, 30000);
    
    return () => clearInterval(interval);
  }, [setSecurityLevel]);
  
  return <SecurityDashboard />;
};
```

### 5. Add Theme-Aware Styling
Use theme-aware classes for responsive styling:

```typescript
const StyledComponent: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Card 
      className={clsx({
        'security-indicator': theme.palette.mode === 'dark',
        'security-critical': securityLevel === 'critical'
      })}
      sx={{
        // Theme-aware gradient
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`
          : theme.palette.background.paper,
        
        // Responsive to security level
        border: securityLevel === 'critical' 
          ? `2px solid ${theme.palette.error.main}`
          : 'none',
        
        // Accessibility support
        '&:focus-visible': {
          outline: theme.palette.mode === 'high-contrast' 
            ? `4px solid ${theme.palette.primary.main}`
            : `2px solid ${theme.palette.primary.main}`
        }
      }}
    >
      {/* Component content */}
    </Card>
  );
};
```

## Theme Configuration

### Available Themes

1. **Time-Based Themes**
   - `morning-fresh`: Bright and energizing (5 AM - 12 PM)
   - `afternoon-focus`: Balanced for productivity (12 PM - 5 PM)
   - `evening-calm`: Soft colors for reduced eye strain (5 PM - 9 PM)
   - `night-mode`: Dark theme for late night work (9 PM - 5 AM)

2. **Role-Based Themes**
   - `security-critical`: High visibility for security operations
   - `security-elevated`: Enhanced monitoring theme
   - `compliance-professional`: Clean and professional
   - `admin-power`: Technical theme for system admins
   - `merchant-friendly`: Welcoming theme for merchants

3. **Activity-Based Themes**
   - `tokenization-focus`: Optimized for tokenization operations
   - `analytics-dark`: Dark theme for data visualization
   - `fraud-detection`: High alert theme for fraud monitoring

4. **Accessibility Themes**
   - `high-contrast-light`: Maximum contrast light theme
   - `high-contrast-dark`: Maximum contrast dark theme
   - `low-vision-friendly`: Large text and clear contrasts

### Customizing Themes

Add new themes to `adaptiveThemes.ts`:

```typescript
export const adaptiveThemes: AdaptiveThemeConfig[] = [
  // ... existing themes
  {
    id: 'custom-theme',
    name: 'Custom Theme',
    description: 'Your custom theme description',
    mode: 'light',
    primary: customPrimaryColor,
    secondary: customSecondaryColor,
    background: {
      default: '#custom-bg',
      paper: '#custom-paper',
      gradient: 'linear-gradient(...)'
    },
    contextMatch: {
      userRole: ['CUSTOM_ROLE'],
      activity: ['custom-activity']
    }
  }
];
```

## Best Practices

1. **Performance**
   - Theme changes are throttled to prevent excessive re-renders
   - Use `useThemeTransition()` hook to add smooth transitions

2. **Accessibility**
   - Always test themes with screen readers
   - Ensure sufficient color contrast ratios
   - Provide keyboard navigation support

3. **User Preferences**
   - Respect user's manual theme selection
   - Store preferences in localStorage
   - Provide clear theme switching options

4. **Security Considerations**
   - Use elevated themes for sensitive operations
   - Clear visual indicators for security states
   - Automatic high-contrast in critical situations

## Testing

### Manual Testing
1. Change system time to test time-based themes
2. Switch user roles to test role-based themes
3. Navigate different pages to test activity-based themes
4. Trigger security alerts to test security themes

### Automated Testing
```typescript
import { renderWithAdaptiveTheme } from '../test-utils';

test('theme changes based on time', () => {
  // Mock time
  jest.spyOn(Date.prototype, 'getHours').mockReturnValue(22); // 10 PM
  
  const { getByText } = renderWithAdaptiveTheme(<App />);
  
  expect(document.body).toHaveClass('theme-night-mode');
});
```

## Troubleshooting

### Theme Not Changing
- Check if auto mode is enabled
- Verify user role is set correctly
- Check browser console for errors

### Performance Issues
- Disable theme transitions during rapid navigation
- Use `React.memo` for theme-heavy components
- Limit theme change frequency

### Accessibility Problems
- Ensure color contrast meets WCAG standards
- Test with browser accessibility tools
- Provide theme preview before applying

## Future Enhancements

1. **Machine Learning Integration**
   - Learn user preferences over time
   - Predict optimal themes based on usage patterns

2. **Custom Theme Builder**
   - Allow users to create their own themes
   - Share themes between users

3. **Theme Scheduling**
   - Set specific themes for specific times
   - Calendar-based theme selection

4. **Multi-Device Sync**
   - Sync theme preferences across devices
   - Device-specific theme overrides