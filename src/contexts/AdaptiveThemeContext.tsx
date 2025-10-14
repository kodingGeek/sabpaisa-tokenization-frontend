import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { 
  AdaptiveThemeConfig, 
  getAdaptiveTheme, 
  detectTimeContext,
  detectActivityContext,
  adaptiveThemes
} from '../themes/adaptiveThemes';

interface AdaptiveThemeContextType {
  currentTheme: AdaptiveThemeConfig;
  availableThemes: AdaptiveThemeConfig[];
  themeMode: 'auto' | 'manual';
  securityLevel: 'normal' | 'elevated' | 'critical';
  accessibilityMode: 'standard' | 'high-contrast' | 'low-vision';
  userRole?: string;
  
  setThemeMode: (mode: 'auto' | 'manual') => void;
  setManualTheme: (themeId: string) => void;
  setSecurityLevel: (level: 'normal' | 'elevated' | 'critical') => void;
  setAccessibilityMode: (mode: 'standard' | 'high-contrast' | 'low-vision') => void;
  setUserRole: (role: string) => void;
  
  // Theme metadata
  timeContext: 'morning' | 'afternoon' | 'evening' | 'night';
  activityContext: string[];
  themeScore: number;
  suggestedThemes: AdaptiveThemeConfig[];
}

const AdaptiveThemeContext = createContext<AdaptiveThemeContextType | undefined>(undefined);

export const useAdaptiveTheme = () => {
  const context = useContext(AdaptiveThemeContext);
  if (!context) {
    throw new Error('useAdaptiveTheme must be used within an AdaptiveThemeProvider');
  }
  return context;
};

interface AdaptiveThemeProviderProps {
  children: React.ReactNode;
  initialUserRole?: string;
}

export const AdaptiveThemeProvider: React.FC<AdaptiveThemeProviderProps> = ({ 
  children, 
  initialUserRole 
}) => {
  const location = useLocation();
  const muiTheme = useMuiTheme();
  
  // State management
  const [themeMode, setThemeMode] = useState<'auto' | 'manual'>(() => {
    return (localStorage.getItem('themeMode') as 'auto' | 'manual') || 'auto';
  });
  
  const [manualThemeId, setManualThemeId] = useState<string>(() => {
    return localStorage.getItem('manualThemeId') || 'morning-fresh';
  });
  
  const [securityLevel, setSecurityLevel] = useState<'normal' | 'elevated' | 'critical'>('normal');
  const [accessibilityMode, setAccessibilityMode] = useState<'standard' | 'high-contrast' | 'low-vision'>('standard');
  const [userRole, setUserRole] = useState<string | undefined>(initialUserRole);
  
  // Context detection
  const timeContext = useMemo(() => detectTimeContext(), []);
  const activityContext = useMemo(() => detectActivityContext(location.pathname), [location.pathname]);
  
  // Calculate current theme based on context
  const currentTheme = useMemo(() => {
    if (themeMode === 'manual') {
      return adaptiveThemes.find(t => t.id === manualThemeId) || adaptiveThemes[0];
    }
    
    return getAdaptiveTheme(
      userRole,
      location.pathname,
      securityLevel,
      accessibilityMode
    );
  }, [themeMode, manualThemeId, userRole, location.pathname, securityLevel, accessibilityMode]);
  
  // Calculate theme score (how well the current theme matches context)
  const themeScore = useMemo(() => {
    let score = 0;
    
    if (currentTheme.contextMatch.timeOfDay === timeContext) score += 20;
    if (userRole && currentTheme.contextMatch.userRole?.includes(userRole)) score += 30;
    if (currentTheme.contextMatch.security === securityLevel) score += 20;
    if (currentTheme.contextMatch.accessibility === accessibilityMode) score += 30;
    
    if (activityContext.length > 0 && currentTheme.contextMatch.activity) {
      const matchCount = currentTheme.contextMatch.activity.filter(a => activityContext.includes(a)).length;
      score += Math.min(matchCount * 10, 30);
    }
    
    return Math.min(score, 100);
  }, [currentTheme, timeContext, userRole, securityLevel, accessibilityMode, activityContext]);
  
  // Get suggested themes based on current context
  const suggestedThemes = useMemo(() => {
    return adaptiveThemes
      .map(theme => {
        let relevance = 0;
        
        if (theme.contextMatch.timeOfDay === timeContext) relevance += 1;
        if (userRole && theme.contextMatch.userRole?.includes(userRole)) relevance += 2;
        if (theme.contextMatch.security === securityLevel) relevance += 2;
        if (theme.contextMatch.accessibility === accessibilityMode) relevance += 3;
        
        if (activityContext.length > 0 && theme.contextMatch.activity) {
          const matchCount = theme.contextMatch.activity.filter(a => activityContext.includes(a)).length;
          relevance += matchCount;
        }
        
        return { theme, relevance };
      })
      .filter(({ relevance }) => relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5)
      .map(({ theme }) => theme);
  }, [timeContext, userRole, securityLevel, accessibilityMode, activityContext]);
  
  // Handlers
  const handleSetThemeMode = (mode: 'auto' | 'manual') => {
    setThemeMode(mode);
    localStorage.setItem('themeMode', mode);
  };
  
  const handleSetManualTheme = (themeId: string) => {
    setManualThemeId(themeId);
    localStorage.setItem('manualThemeId', themeId);
    if (themeMode !== 'manual') {
      handleSetThemeMode('manual');
    }
  };
  
  const handleSetSecurityLevel = (level: 'normal' | 'elevated' | 'critical') => {
    setSecurityLevel(level);
    
    // Emit event for security monitoring
    window.dispatchEvent(new CustomEvent('securityLevelChanged', { 
      detail: { level, timestamp: new Date().toISOString() } 
    }));
  };
  
  const handleSetAccessibilityMode = (mode: 'standard' | 'high-contrast' | 'low-vision') => {
    setAccessibilityMode(mode);
    localStorage.setItem('accessibilityMode', mode);
  };
  
  const handleSetUserRole = (role: string) => {
    setUserRole(role);
  };
  
  // Auto-refresh theme based on time
  useEffect(() => {
    if (themeMode === 'auto') {
      const interval = setInterval(() => {
        // Force re-calculation of theme every hour
        setUserRole(role => role); // Trigger re-render
      }, 3600000); // 1 hour
      
      return () => clearInterval(interval);
    }
  }, [themeMode]);
  
  // Persist accessibility mode
  useEffect(() => {
    const savedMode = localStorage.getItem('accessibilityMode') as any;
    if (savedMode && ['standard', 'high-contrast', 'low-vision'].includes(savedMode)) {
      setAccessibilityMode(savedMode);
    }
  }, []);
  
  const value: AdaptiveThemeContextType = {
    currentTheme,
    availableThemes: adaptiveThemes,
    themeMode,
    securityLevel,
    accessibilityMode,
    userRole,
    setThemeMode: handleSetThemeMode,
    setManualTheme: handleSetManualTheme,
    setSecurityLevel: handleSetSecurityLevel,
    setAccessibilityMode: handleSetAccessibilityMode,
    setUserRole: handleSetUserRole,
    timeContext,
    activityContext,
    themeScore,
    suggestedThemes
  };
  
  return (
    <AdaptiveThemeContext.Provider value={value}>
      {children}
    </AdaptiveThemeContext.Provider>
  );
};

export default AdaptiveThemeContext;