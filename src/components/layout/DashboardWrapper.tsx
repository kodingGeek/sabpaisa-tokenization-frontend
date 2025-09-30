import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

interface DashboardWrapperProps {
  children: React.ReactNode;
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ 
  children, 
  currentTheme, 
  onThemeChange 
}) => {
  return (
    <DashboardLayout 
      currentTheme={currentTheme} 
      onThemeChange={onThemeChange}
    >
      {children}
    </DashboardLayout>
  );
};

export default DashboardWrapper;