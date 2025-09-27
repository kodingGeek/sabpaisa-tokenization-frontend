import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Block, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Block sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have permission to access this resource.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This incident has been logged for security purposes.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 3 }}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;