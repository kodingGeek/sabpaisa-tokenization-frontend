import React, { useEffect, useState } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { CheckCircle, Error, Warning } from '@mui/icons-material';
import tokenizationService from '../../services/tokenizationService';

export const BackendHealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await tokenizationService.checkHealth();
        setStatus(isHealthy ? 'connected' : 'disconnected');
        setLastChecked(new Date());
      } catch (error) {
        setStatus('disconnected');
        setLastChecked(new Date());
      }
    };

    // Initial check
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle fontSize="small" />,
          label: 'Backend Connected',
          color: 'success' as const,
        };
      case 'disconnected':
        return {
          icon: <Error fontSize="small" />,
          label: 'Backend Disconnected',
          color: 'error' as const,
        };
      default:
        return {
          icon: <Warning fontSize="small" />,
          label: 'Checking Backend...',
          color: 'warning' as const,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Tooltip title={`Last checked: ${lastChecked.toLocaleTimeString()}`}>
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    </Tooltip>
  );
};

export default BackendHealthCheck;