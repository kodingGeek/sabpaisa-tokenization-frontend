import React from 'react';
import { Box, List, ListItem, ListItemText, Chip } from '@mui/material';

const RecentTokens: React.FC = () => {
  const mockTokens = [
    { id: 'TOK_SABP_FPT_X7Y8Z9A1B2C3_7', status: 'active', created: '2 hours ago' },
    { id: 'TOK_SABP_RND_A1B2C3D4E5F6_9', status: 'active', created: '3 hours ago' },
    { id: 'TOK_SABP_COF_M9N8O7P6Q5R4_2', status: 'suspended', created: '5 hours ago' },
  ];

  return (
    <List>
      {mockTokens.map((token, index) => (
        <ListItem key={index} divider={index < mockTokens.length - 1}>
          <ListItemText
            primary={token.id}
            secondary={`Created ${token.created}`}
            primaryTypographyProps={{ fontFamily: 'monospace', fontSize: 14 }}
          />
          <Chip
            label={token.status}
            color={token.status === 'active' ? 'success' : 'warning'}
            size="small"
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RecentTokens;