import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

const DashboardLayoutWrapper: React.FC = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default DashboardLayoutWrapper;