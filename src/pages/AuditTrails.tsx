import React from 'react';
import { Container, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const AuditTrails: React.FC = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Audit Trails
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View immutable audit logs with cryptographic verification.
        </Typography>
      </Container>
    </DashboardLayout>
  );
};

export default AuditTrails;