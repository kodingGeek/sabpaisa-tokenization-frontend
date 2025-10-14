import { createTheme, PaletteMode } from '@mui/material';
import { 
  blue, grey, deepPurple, teal, orange, pink, green, indigo,
  red, amber, lightBlue, cyan, lime, purple
} from '@mui/material/colors';

export interface AdaptiveThemeConfig {
  id: string;
  name: string;
  description: string;
  mode: PaletteMode;
  primary: any;
  secondary: any;
  accent?: any;
  background?: {
    default?: string;
    paper?: string;
    gradient?: string;
  };
  contextMatch: {
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    userRole?: string[];
    activity?: string[];
    security?: 'normal' | 'elevated' | 'critical';
    accessibility?: 'standard' | 'high-contrast' | 'low-vision';
  };
  components?: any;
}

// Define context-aware themes
export const adaptiveThemes: AdaptiveThemeConfig[] = [
  // Time-based themes
  {
    id: 'morning-fresh',
    name: 'Morning Fresh',
    description: 'Bright and energizing theme for morning hours',
    mode: 'light',
    primary: lightBlue,
    secondary: amber,
    accent: orange,
    background: {
      default: '#fafafa',
      paper: '#ffffff',
      gradient: 'linear-gradient(135deg, #e3f2fd 0%, #fff3e0 100%)'
    },
    contextMatch: {
      timeOfDay: 'morning'
    }
  },
  {
    id: 'afternoon-focus',
    name: 'Afternoon Focus',
    description: 'Balanced theme for productive afternoon work',
    mode: 'light',
    primary: blue,
    secondary: green,
    accent: teal,
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    contextMatch: {
      timeOfDay: 'afternoon'
    }
  },
  {
    id: 'evening-calm',
    name: 'Evening Calm',
    description: 'Softer colors to reduce eye strain',
    mode: 'dark',
    primary: indigo,
    secondary: amber,
    accent: purple,
    background: {
      default: '#1a1a2e',
      paper: '#16213e',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)'
    },
    contextMatch: {
      timeOfDay: 'evening'
    }
  },
  {
    id: 'night-mode',
    name: 'Night Mode',
    description: 'Dark theme for late night work',
    mode: 'dark',
    primary: cyan,
    secondary: lime,
    accent: amber,
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a'
    },
    contextMatch: {
      timeOfDay: 'night'
    }
  },
  
  // Role-based themes
  {
    id: 'security-critical',
    name: 'Security Critical',
    description: 'High visibility theme for security operations',
    mode: 'dark',
    primary: red,
    secondary: amber,
    accent: orange,
    background: {
      default: '#1a0f0f',
      paper: '#2d1515',
      gradient: 'linear-gradient(135deg, #1a0f0f 0%, #2d1515 100%)'
    },
    contextMatch: {
      userRole: ['SECURITY_OFFICER'],
      security: 'critical'
    }
  },
  {
    id: 'security-elevated',
    name: 'Security Elevated',
    description: 'Enhanced visibility for security monitoring',
    mode: 'dark',
    primary: orange,
    secondary: blue,
    accent: amber,
    background: {
      default: '#1a1a0f',
      paper: '#2d2d15'
    },
    contextMatch: {
      userRole: ['SECURITY_OFFICER'],
      security: 'elevated'
    }
  },
  {
    id: 'compliance-professional',
    name: 'Compliance Professional',
    description: 'Clean and professional for compliance work',
    mode: 'light',
    primary: indigo,
    secondary: grey,
    accent: blue,
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    contextMatch: {
      userRole: ['COMPLIANCE_OFFICER']
    }
  },
  {
    id: 'admin-power',
    name: 'Admin Power',
    description: 'Technical theme for system administrators',
    mode: 'dark',
    primary: purple,
    secondary: cyan,
    accent: pink,
    background: {
      default: '#0f0f1a',
      paper: '#1a1a2d',
      gradient: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2d 100%)'
    },
    contextMatch: {
      userRole: ['SYSTEM_ADMIN']
    }
  },
  {
    id: 'merchant-friendly',
    name: 'Merchant Friendly',
    description: 'Welcoming theme for merchant users',
    mode: 'light',
    primary: teal,
    secondary: orange,
    accent: green,
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    },
    contextMatch: {
      userRole: ['MERCHANT']
    }
  },
  
  // Activity-based themes
  {
    id: 'tokenization-focus',
    name: 'Tokenization Focus',
    description: 'Optimized for tokenization operations',
    mode: 'light',
    primary: green,
    secondary: blue,
    accent: teal,
    background: {
      default: '#f0fdf4',
      paper: '#ffffff'
    },
    contextMatch: {
      activity: ['tokenization', 'token-management']
    }
  },
  {
    id: 'analytics-dark',
    name: 'Analytics Dark',
    description: 'Dark theme for data visualization',
    mode: 'dark',
    primary: cyan,
    secondary: purple,
    accent: pink,
    background: {
      default: '#0a0f1a',
      paper: '#141b2d'
    },
    contextMatch: {
      activity: ['analytics', 'monitoring', 'dashboard']
    }
  },
  {
    id: 'fraud-detection',
    name: 'Fraud Detection',
    description: 'High alert theme for fraud monitoring',
    mode: 'dark',
    primary: red,
    secondary: amber,
    accent: orange,
    background: {
      default: '#1a0a0a',
      paper: '#2d1414'
    },
    contextMatch: {
      activity: ['fraud-detection', 'threat-monitoring']
    }
  },
  
  // Accessibility themes
  {
    id: 'high-contrast-light',
    name: 'High Contrast Light',
    description: 'Maximum contrast for better visibility',
    mode: 'light',
    primary: { main: '#000000' },
    secondary: { main: '#0066cc' },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    contextMatch: {
      accessibility: 'high-contrast'
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            border: '2px solid currentColor'
          }
        }
      }
    }
  },
  {
    id: 'high-contrast-dark',
    name: 'High Contrast Dark',
    description: 'Dark high contrast theme',
    mode: 'dark',
    primary: { main: '#ffffff' },
    secondary: { main: '#66ccff' },
    background: {
      default: '#000000',
      paper: '#1a1a1a'
    },
    contextMatch: {
      accessibility: 'high-contrast'
    }
  },
  {
    id: 'low-vision-friendly',
    name: 'Low Vision Friendly',
    description: 'Large text and clear contrasts',
    mode: 'light',
    primary: blue,
    secondary: orange,
    background: {
      default: '#fffef0',
      paper: '#ffffff'
    },
    contextMatch: {
      accessibility: 'low-vision'
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            fontSize: '1.1em'
          }
        }
      }
    }
  }
];

// Context detection functions
export const detectTimeContext = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const detectActivityContext = (pathname: string): string[] => {
  const activities: string[] = [];
  
  if (pathname.includes('token')) activities.push('tokenization');
  if (pathname.includes('unified')) activities.push('token-management');
  if (pathname.includes('analytics') || pathname.includes('dashboard')) activities.push('analytics');
  if (pathname.includes('monitor')) activities.push('monitoring');
  if (pathname.includes('fraud') || pathname.includes('threat')) activities.push('fraud-detection');
  if (pathname.includes('compliance') || pathname.includes('audit')) activities.push('compliance');
  
  return activities;
};

export const getAdaptiveTheme = (
  userRole?: string,
  pathname?: string,
  securityLevel?: 'normal' | 'elevated' | 'critical',
  accessibility?: 'standard' | 'high-contrast' | 'low-vision',
  preferredThemeId?: string
): AdaptiveThemeConfig => {
  // If user has a preferred theme and it exists, use it
  if (preferredThemeId) {
    const preferredTheme = adaptiveThemes.find(t => t.id === preferredThemeId);
    if (preferredTheme) return preferredTheme;
  }
  
  const timeContext = detectTimeContext();
  const activityContext = pathname ? detectActivityContext(pathname) : [];
  
  // Find the best matching theme based on context
  const scoredThemes = adaptiveThemes.map(theme => {
    let score = 0;
    
    // Time match
    if (theme.contextMatch.timeOfDay === timeContext) score += 2;
    
    // Role match
    if (userRole && theme.contextMatch.userRole?.includes(userRole)) score += 3;
    
    // Activity match
    if (activityContext.length > 0 && theme.contextMatch.activity) {
      const matchCount = theme.contextMatch.activity.filter(a => activityContext.includes(a)).length;
      score += matchCount * 2;
    }
    
    // Security level match
    if (securityLevel && theme.contextMatch.security === securityLevel) score += 4;
    
    // Accessibility match
    if (accessibility && theme.contextMatch.accessibility === accessibility) score += 5;
    
    return { theme, score };
  });
  
  // Sort by score and return the best match
  scoredThemes.sort((a, b) => b.score - a.score);
  
  // Return the highest scoring theme, or default to morning-fresh
  return scoredThemes[0]?.score > 0 
    ? scoredThemes[0].theme 
    : adaptiveThemes.find(t => t.id === 'morning-fresh')!;
};

export const createAdaptiveTheme = (config: AdaptiveThemeConfig) => {
  const baseTheme = createTheme({
    palette: {
      mode: config.mode,
      primary: typeof config.primary === 'object' && config.primary.main ? config.primary : config.primary,
      secondary: typeof config.secondary === 'object' && config.secondary.main ? config.secondary : config.secondary,
      background: config.background || (config.mode === 'dark' ? {
        default: '#121212',
        paper: '#1e1e1e',
      } : {
        default: '#f5f5f5',
        paper: '#ffffff',
      }),
      ...(config.accent && { accent: config.accent })
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        letterSpacing: '-0.02em'
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        letterSpacing: '-0.01em'
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: config.mode === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
            borderRadius: 16,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: config.mode === 'dark' 
                ? '0 12px 40px rgba(0, 0, 0, 0.6)' 
                : '0 8px 30px rgba(0, 0, 0, 0.12)',
            }
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      ...config.components
    },
  });
  
  return baseTheme;
};