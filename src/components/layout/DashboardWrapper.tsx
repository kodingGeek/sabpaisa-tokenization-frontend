import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default DashboardWrapper;