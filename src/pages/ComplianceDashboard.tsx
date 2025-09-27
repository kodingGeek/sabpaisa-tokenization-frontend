import React from 'react';
import { Container, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const ComplianceDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Compliance Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor regulatory compliance and generate reports.
        </Typography>
      </Container>
    </DashboardLayout>
  );
};

export default ComplianceDashboard;