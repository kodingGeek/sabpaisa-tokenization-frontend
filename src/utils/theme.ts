import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode colors
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff',
          },
          secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
            contrastText: '#fff',
          },
          error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828',
          },
          warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100',
          },
          info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
          },
          success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
          },
          background: {
            default: '#f8f9fa',
            paper: '#ffffff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
          },
          divider: 'rgba(0, 0, 0, 0.12)',
        }
      : {
          // Dark mode colors
          primary: {
            main: '#90caf9',
            light: '#e3f2fd',
            dark: '#42a5f5',
            contrastText: 'rgba(0, 0, 0, 0.87)',
          },
          secondary: {
            main: '#ce93d8',
            light: '#f3e5f5',
            dark: '#ab47bc',
            contrastText: 'rgba(0, 0, 0, 0.87)',
          },
          error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
          },
          warning: {
            main: '#ffa726',
            light: '#ffb74d',
            dark: '#f57c00',
          },
          info: {
            main: '#29b6f6',
            light: '#4fc3f7',
            dark: '#0288d1',
          },
          success: {
            main: '#66bb6a',
            light: '#81c784',
            dark: '#388e3c',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '0.0075em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '0.01071em',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: mode === 'light'
    ? [
        'none',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 4px 8px rgba(0,0,0,0.05)',
        '0px 8px 16px rgba(0,0,0,0.05)',
        '0px 12px 24px rgba(0,0,0,0.05)',
        '0px 16px 32px rgba(0,0,0,0.05)',
        '0px 20px 40px rgba(0,0,0,0.05)',
        '0px 24px 48px rgba(0,0,0,0.05)',
        '0px 28px 56px rgba(0,0,0,0.05)',
        '0px 32px 64px rgba(0,0,0,0.05)',
        '0px 36px 72px rgba(0,0,0,0.05)',
        '0px 40px 80px rgba(0,0,0,0.05)',
        '0px 44px 88px rgba(0,0,0,0.05)',
        '0px 48px 96px rgba(0,0,0,0.05)',
        '0px 52px 104px rgba(0,0,0,0.05)',
        '0px 56px 112px rgba(0,0,0,0.05)',
        '0px 60px 120px rgba(0,0,0,0.05)',
        '0px 64px 128px rgba(0,0,0,0.05)',
        '0px 68px 136px rgba(0,0,0,0.05)',
        '0px 72px 144px rgba(0,0,0,0.05)',
        '0px 76px 152px rgba(0,0,0,0.05)',
        '0px 80px 160px rgba(0,0,0,0.05)',
        '0px 84px 168px rgba(0,0,0,0.05)',
        '0px 88px 176px rgba(0,0,0,0.05)',
        '0px 92px 184px rgba(0,0,0,0.05)',
      ]
    : [
        'none',
        '0px 2px 4px rgba(0,0,0,0.2)',
        '0px 4px 8px rgba(0,0,0,0.2)',
        '0px 8px 16px rgba(0,0,0,0.2)',
        '0px 12px 24px rgba(0,0,0,0.2)',
        '0px 16px 32px rgba(0,0,0,0.2)',
        '0px 20px 40px rgba(0,0,0,0.2)',
        '0px 24px 48px rgba(0,0,0,0.2)',
        '0px 28px 56px rgba(0,0,0,0.2)',
        '0px 32px 64px rgba(0,0,0,0.2)',
        '0px 36px 72px rgba(0,0,0,0.2)',
        '0px 40px 80px rgba(0,0,0,0.2)',
        '0px 44px 88px rgba(0,0,0,0.2)',
        '0px 48px 96px rgba(0,0,0,0.2)',
        '0px 52px 104px rgba(0,0,0,0.2)',
        '0px 56px 112px rgba(0,0,0,0.2)',
        '0px 60px 120px rgba(0,0,0,0.2)',
        '0px 64px 128px rgba(0,0,0,0.2)',
        '0px 68px 136px rgba(0,0,0,0.2)',
        '0px 72px 144px rgba(0,0,0,0.2)',
        '0px 76px 152px rgba(0,0,0,0.2)',
        '0px 80px 160px rgba(0,0,0,0.2)',
        '0px 84px 168px rgba(0,0,0,0.2)',
        '0px 88px 176px rgba(0,0,0,0.2)',
        '0px 92px 184px rgba(0,0,0,0.2)',
      ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: mode === 'dark' ? {
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 12,
            backgroundColor: '#2b2b2b',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#6b6b6b',
            minHeight: 24,
            border: '3px solid #2b2b2b',
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#959595',
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#959595',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#959595',
          },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#2b2b2b',
          },
        } : {},
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '8px 16px',
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0 4px 8px rgba(0,0,0,0.1)'
              : '0 4px 8px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light'
            ? '0 2px 8px rgba(0,0,0,0.08)'
            : '0 2px 8px rgba(0,0,0,0.3)',
          backgroundImage: 'none',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' 
                  ? alpha('#1976d2', 0.5)
                  : alpha('#90caf9', 0.5),
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));

export default createAppTheme;