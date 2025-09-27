import React from 'react';
import { Container, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const TokenManagement: React.FC = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Token Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate, view, and manage tokenization operations.
        </Typography>
      </Container>
    </DashboardLayout>
  );
};

export default TokenManagement;