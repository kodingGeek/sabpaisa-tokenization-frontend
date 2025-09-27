import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Warning, Info, Error } from '@mui/icons-material';

const SecurityAlerts: React.FC = () => {
  const alerts = [
    { type: 'warning', message: 'Unusual login pattern detected', time: '10 minutes ago' },
    { type: 'info', message: 'Security scan completed successfully', time: '1 hour ago' },
    { type: 'error', message: 'Failed login attempts from IP 192.168.1.1', time: '2 hours ago' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  return (
    <List>
      {alerts.map((alert, index) => (
        <ListItem key={index}>
          <ListItemIcon>{getIcon(alert.type)}</ListItemIcon>
          <ListItemText
            primary={alert.message}
            secondary={alert.time}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default SecurityAlerts;