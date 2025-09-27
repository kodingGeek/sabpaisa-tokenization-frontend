import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const MerchantPortal: React.FC = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Merchant Portal
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your tokenization services and monitor usage.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Token Management</Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage your tokens, generate new tokens, and monitor token usage.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default MerchantPortal;