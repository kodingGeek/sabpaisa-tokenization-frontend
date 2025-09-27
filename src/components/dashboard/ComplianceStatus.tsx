import React from 'react';
import { Box, Typography, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface ComplianceStatusProps {
  score: number;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({ score }) => {
  const complianceItems = [
    'RBI Data Localization',
    'PCI DSS Level 1',
    'Audit Trail Integrity',
    'Encryption Standards',
    'Access Controls',
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="center" mb={2}>
        <Box position="relative" display="inline-flex">
          <CircularProgress 
            variant="determinate" 
            value={score} 
            size={120}
            thickness={4}
            color="success"
          />
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
            <Typography variant="h4" component="div" color="text.secondary">
              {score}%
            </Typography>
          </Box>
        </Box>
      </Box>
      <List dense>
        {complianceItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <CheckCircle color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ComplianceStatus;