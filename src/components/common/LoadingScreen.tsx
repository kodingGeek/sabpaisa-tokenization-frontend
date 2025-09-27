import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Lock } from '@mui/icons-material';

const LoadingScreen: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Box position="relative" display="inline-flex" mb={2}>
        <CircularProgress size={60} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Lock color="primary" />
        </Box>
      </Box>
      <Typography variant="h6" color="text.secondary">
        Loading secure content...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;