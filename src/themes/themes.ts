import { createTheme, PaletteMode } from '@mui/material';
import { blue, grey, deepPurple, teal, orange, pink, green, indigo } from '@mui/material/colors';

export interface ThemeConfig {
  id: string;
  name: string;
  mode: PaletteMode;
  primary: any;
  secondary: any;
  background?: {
    default?: string;
    paper?: string;
  };
}

export const themes: ThemeConfig[] = [
  {
    id: 'default-light',
    name: 'Default Light',
    mode: 'light',
    primary: blue,
    secondary: deepPurple,
  },
  {
    id: 'default-dark',
    name: 'Default Dark',
    mode: 'dark',
    primary: blue,
    secondary: deepPurple,
  },
  {
    id: 'ocean-light',
    name: 'Ocean Light',
    mode: 'light',
    primary: teal,
    secondary: orange,
  },
  {
    id: 'ocean-dark',
    name: 'Ocean Dark',
    mode: 'dark',
    primary: teal,
    secondary: orange,
  },
  {
    id: 'sunset-light',
    name: 'Sunset Light',
    mode: 'light',
    primary: orange,
    secondary: pink,
  },
  {
    id: 'sunset-dark',
    name: 'Sunset Dark',
    mode: 'dark',
    primary: orange,
    secondary: pink,
  },
  {
    id: 'forest-light',
    name: 'Forest Light',
    mode: 'light',
    primary: green,
    secondary: orange,
  },
  {
    id: 'forest-dark',
    name: 'Forest Dark',
    mode: 'dark',
    primary: green,
    secondary: orange,
  },
  {
    id: 'royal-light',
    name: 'Royal Light',
    mode: 'light',
    primary: indigo,
    secondary: pink,
  },
  {
    id: 'royal-dark',
    name: 'Royal Dark',
    mode: 'dark',
    primary: indigo,
    secondary: pink,
  },
];

export const createCustomTheme = (config: ThemeConfig) => {
  return createTheme({
    palette: {
      mode: config.mode,
      primary: config.primary,
      secondary: config.secondary,
      background: config.background || (config.mode === 'dark' ? {
        default: '#121212',
        paper: '#1e1e1e',
      } : {
        default: '#f5f5f5',
        paper: '#ffffff',
      }),
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
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
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: config.mode === 'dark' 
              ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });
};