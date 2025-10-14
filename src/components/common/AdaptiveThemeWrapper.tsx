import React, { ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { AdaptiveThemeProvider } from '../../contexts/AdaptiveThemeContext';
import { useAdaptiveTheme } from '../../contexts/AdaptiveThemeContext';
import { createAdaptiveTheme } from '../../themes/adaptiveThemes';

interface ThemeApplicatorProps {
  children: ReactNode;
}

// Internal component that uses the adaptive theme context
const ThemeApplicator: React.FC<ThemeApplicatorProps> = ({ children }) => {
  const { currentTheme } = useAdaptiveTheme();
  const muiTheme = createAdaptiveTheme(currentTheme);
  
  // Apply theme-specific global styles
  const globalStyles = (
    <GlobalStyles
      styles={{
        '*': {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
        'body': {
          background: currentTheme.background?.gradient || muiTheme.palette.background.default,
          minHeight: '100vh',
        },
        '::-webkit-scrollbar': {
          width: '12px',
          height: '12px',
        },
        '::-webkit-scrollbar-track': {
          background: muiTheme.palette.action.hover,
          borderRadius: '6px',
        },
        '::-webkit-scrollbar-thumb': {
          background: muiTheme.palette.action.selected,
          borderRadius: '6px',
          '&:hover': {
            background: muiTheme.palette.action.focus,
          },
        },
        // High contrast mode styles
        ...(currentTheme.contextMatch.accessibility === 'high-contrast' && {
          '*:focus': {
            outline: `3px solid ${muiTheme.palette.primary.main}`,
            outlineOffset: '2px',
          },
          'a, button': {
            textDecoration: 'underline',
            fontWeight: 700,
          },
        }),
        // Low vision mode styles
        ...(currentTheme.contextMatch.accessibility === 'low-vision' && {
          '*': {
            fontSize: '1.1em !important',
            lineHeight: '1.6 !important',
          },
          'button, a': {
            minHeight: '48px',
            minWidth: '48px',
          },
        }),
        // Security elevated mode styles
        ...(currentTheme.contextMatch.security === 'elevated' && {
          '.security-indicator': {
            animation: 'pulse 2s infinite',
          },
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.7 },
            '100%': { opacity: 1 },
          },
        }),
        // Critical security mode styles
        ...(currentTheme.contextMatch.security === 'critical' && {
          '.security-critical': {
            border: `2px solid ${muiTheme.palette.error.main}`,
            animation: 'alert-pulse 1s infinite',
          },
          '@keyframes alert-pulse': {
            '0%': { 
              borderColor: muiTheme.palette.error.main,
              boxShadow: `0 0 0 0 ${muiTheme.palette.error.main}40`,
            },
            '50%': { 
              borderColor: muiTheme.palette.error.light,
              boxShadow: `0 0 0 10px ${muiTheme.palette.error.main}00`,
            },
            '100%': { 
              borderColor: muiTheme.palette.error.main,
              boxShadow: `0 0 0 0 ${muiTheme.palette.error.main}00`,
            },
          },
        }),
      }}
    />
  );
  
  // Apply theme-specific classes to body
  useEffect(() => {
    const body = document.body;
    
    // Remove all theme classes
    body.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        body.classList.remove(className);
      }
    });
    
    // Add current theme classes
    body.classList.add(`theme-${currentTheme.id}`);
    body.classList.add(`theme-mode-${currentTheme.mode}`);
    
    if (currentTheme.contextMatch.accessibility) {
      body.classList.add(`accessibility-${currentTheme.contextMatch.accessibility}`);
    }
    
    if (currentTheme.contextMatch.security) {
      body.classList.add(`security-${currentTheme.contextMatch.security}`);
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', muiTheme.palette.primary.main);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = muiTheme.palette.primary.main;
      document.head.appendChild(meta);
    }
    
    return () => {
      // Cleanup
      body.classList.forEach(className => {
        if (className.startsWith('theme-') || 
            className.startsWith('accessibility-') || 
            className.startsWith('security-')) {
          body.classList.remove(className);
        }
      });
    };
  }, [currentTheme, muiTheme]);
  
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {globalStyles}
      {children}
    </ThemeProvider>
  );
};

interface AdaptiveThemeWrapperProps {
  children: ReactNode;
  initialUserRole?: string;
}

// Main wrapper component
export const AdaptiveThemeWrapper: React.FC<AdaptiveThemeWrapperProps> = ({ 
  children, 
  initialUserRole 
}) => {
  return (
    <AdaptiveThemeProvider initialUserRole={initialUserRole}>
      <ThemeApplicator>
        {children}
      </ThemeApplicator>
    </AdaptiveThemeProvider>
  );
};

export default AdaptiveThemeWrapper;