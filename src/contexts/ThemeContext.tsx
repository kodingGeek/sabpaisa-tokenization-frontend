import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const AppThemeProvider: React.FC<{
  children: React.ReactNode;
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}> = ({ children, currentTheme, onThemeChange }) => {
  return (
    <ThemeContext.Provider value={{ currentTheme, onThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;