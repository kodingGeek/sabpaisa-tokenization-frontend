import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Lock, CheckCircle } from '@mui/icons-material';

const SecurityBadge: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" mb={1}>
        <Lock sx={{ fontSize: 48, color: 'primary.main', mr: 1 }} />
        <Box>
          <Typography variant="h6" color="primary">
            Secure Platform
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PCI DSS Compliant
          </Typography>
        </Box>
      </Box>
      <Box display="flex" gap={1}>
        <Chip
          icon={<CheckCircle />}
          label="256-bit Encryption"
          size="small"
          color="success"
          variant="outlined"
        />
        <Chip
          icon={<CheckCircle />}
          label="RBI Compliant"
          size="small"
          color="success"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default SecurityBadge;