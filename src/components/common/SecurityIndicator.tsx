import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { CheckCircle, Security } from '@mui/icons-material';

const SecurityIndicator: React.FC = () => {
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Security fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2" fontWeight="bold">
          Security Status
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <CheckCircle fontSize="small" color="success" />
        <Typography variant="caption">
          All systems secure
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={98} 
        sx={{ mt: 1, height: 6, borderRadius: 3 }}
        color="success"
      />
    </Box>
  );
};

export default SecurityIndicator;