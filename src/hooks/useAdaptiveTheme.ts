import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdaptiveThemeContext from '../contexts/AdaptiveThemeContext';

export interface AdaptiveThemeHook {
  // Current theme info
  themeName: string;
  themeMode: 'light' | 'dark';
  isAutoMode: boolean;
  
  // Context awareness
  isSecurityElevated: boolean;
  isHighContrast: boolean;
  matchScore: number;
  
  // Theme actions
  toggleThemeMode: () => void;
  enableAutoMode: () => void;
  disableAutoMode: () => void;
  selectTheme: (themeId: string) => void;
  
  // Quick actions
  enableDarkMode: () => void;
  enableLightMode: () => void;
  enableHighContrast: () => void;
  disableHighContrast: () => void;
  
  // Recommendations
  recommendedTheme: string | null;
  shouldSuggestThemeChange: boolean;
}

export const useAdaptiveTheme = (): AdaptiveThemeHook => {
  const context = useContext(AdaptiveThemeContext);
  const location = useLocation();
  const [shouldSuggest, setShouldSuggest] = useState(false);
  
  if (!context) {
    throw new Error('useAdaptiveTheme must be used within an AdaptiveThemeProvider');
  }
  
  const {
    currentTheme,
    themeMode,
    themeScore,
    suggestedThemes,
    securityLevel,
    accessibilityMode,
    setThemeMode,
    setManualTheme,
    setAccessibilityMode
  } = context;
  
  // Check if we should suggest a theme change
  useEffect(() => {
    // Suggest theme change if:
    // 1. Auto mode is off and score is low
    // 2. There's a much better matching theme available
    if (themeMode === 'manual' && themeScore < 50) {
      setShouldSuggest(true);
    } else if (suggestedThemes.length > 0 && suggestedThemes[0].id !== currentTheme.id) {
      // Check if suggested theme has significantly better match
      setShouldSuggest(true);
    } else {
      setShouldSuggest(false);
    }
  }, [themeMode, themeScore, suggestedThemes, currentTheme]);
  
  // Auto-switch to high contrast in certain security situations
  useEffect(() => {
    if (securityLevel === 'critical' && location.pathname.includes('security')) {
      // Automatically enable high contrast for better visibility
      if (accessibilityMode !== 'high-contrast') {
        setAccessibilityMode('high-contrast');
      }
    }
  }, [securityLevel, location.pathname, accessibilityMode, setAccessibilityMode]);
  
  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'auto' ? 'manual' : 'auto');
  };
  
  const enableAutoMode = () => setThemeMode('auto');
  const disableAutoMode = () => setThemeMode('manual');
  
  const selectTheme = (themeId: string) => {
    setManualTheme(themeId);
  };
  
  const enableDarkMode = () => {
    // Find first available dark theme
    const darkTheme = context.availableThemes.find(t => t.mode === 'dark');
    if (darkTheme) {
      setManualTheme(darkTheme.id);
    }
  };
  
  const enableLightMode = () => {
    // Find first available light theme
    const lightTheme = context.availableThemes.find(t => t.mode === 'light');
    if (lightTheme) {
      setManualTheme(lightTheme.id);
    }
  };
  
  const enableHighContrast = () => {
    setAccessibilityMode('high-contrast');
  };
  
  const disableHighContrast = () => {
    setAccessibilityMode('standard');
  };
  
  return {
    themeName: currentTheme.name,
    themeMode: currentTheme.mode,
    isAutoMode: themeMode === 'auto',
    isSecurityElevated: securityLevel !== 'normal',
    isHighContrast: accessibilityMode === 'high-contrast',
    matchScore: themeScore,
    toggleThemeMode,
    enableAutoMode,
    disableAutoMode,
    selectTheme,
    enableDarkMode,
    enableLightMode,
    enableHighContrast,
    disableHighContrast,
    recommendedTheme: suggestedThemes[0]?.id || null,
    shouldSuggestThemeChange: shouldSuggest
  };
};

// Additional hook for theme animations
export const useThemeTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const adaptiveTheme = useAdaptiveTheme();
  
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [adaptiveTheme.themeName]);
  
  return { isTransitioning };
};

// Hook for theme-aware colors
export const useThemeColors = () => {
  const context = useContext(AdaptiveThemeContext);
  
  if (!context) {
    throw new Error('useThemeColors must be used within an AdaptiveThemeProvider');
  }
  
  const { currentTheme } = context;
  
  return {
    primary: currentTheme.primary[500] || currentTheme.primary.main || '#1976d2',
    secondary: currentTheme.secondary[500] || currentTheme.secondary.main || '#dc004e',
    accent: currentTheme.accent?.[500] || currentTheme.accent?.main || null,
    background: currentTheme.background?.default || '#ffffff',
    paper: currentTheme.background?.paper || '#f5f5f5',
    gradient: currentTheme.background?.gradient || null,
    mode: currentTheme.mode
  };
};

export default useAdaptiveTheme;