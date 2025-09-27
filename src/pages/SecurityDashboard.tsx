import React from 'react';
import { Container, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const SecurityDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Security Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor security threats and incidents.
        </Typography>
      </Container>
    </DashboardLayout>
  );
};

export default SecurityDashboard;