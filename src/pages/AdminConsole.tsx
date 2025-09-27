import React from 'react';
import { Container, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const AdminConsole: React.FC = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          System Administration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage system configuration and users.
        </Typography>
      </Container>
    </DashboardLayout>
  );
};

export default AdminConsole;