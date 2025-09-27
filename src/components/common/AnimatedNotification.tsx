import React from 'react';
import { Alert, AlertTitle, Snackbar, Slide, Box, IconButton } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { 
  CheckCircle, 
  Error, 
  Warning, 
  Info, 
  Close,
  Celebration,
  Security,
} from '@mui/icons-material';

interface AnimatedNotificationProps {
  open: boolean;
  message: string;
  title?: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
  variant?: 'standard' | 'filled' | 'outlined';
  showIcon?: boolean;
  action?: React.ReactNode;
}

function SlideTransition(props: TransitionProps & {
  children: React.ReactElement<any, any>;
}) {
  return <Slide {...props} direction="down" />;
}

const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  open,
  message,
  title,
  severity,
  onClose,
  duration = 6000,
  variant = 'filled',
  showIcon = true,
  action,
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <Celebration />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
      default:
        return <Info />;
    }
  };

  const getGradient = () => {
    switch (severity) {
      case 'success':
        return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      case 'error':
        return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #fa8072 0%, #ffd700 100%)';
      case 'info':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        top: { xs: 16, sm: 24 },
        '& .MuiSnackbar-root': {
          top: { xs: 16, sm: 24 },
        },
      }}
    >
      <Alert
        severity={severity}
        variant={variant}
        onClose={onClose}
        icon={showIcon ? getIcon() : undefined}
        action={
          action || (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={onClose}
            >
              <Close fontSize="small" />
            </IconButton>
          )
        }
        sx={{
          minWidth: 300,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          ...(variant === 'filled' && {
            background: getGradient(),
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }),
          animation: 'slideInBounce 0.5s ease-out',
          '@keyframes slideInBounce': {
            '0%': {
              transform: 'translateY(-100%)',
              opacity: 0,
            },
            '60%': {
              transform: 'translateY(10px)',
              opacity: 1,
            },
            '80%': {
              transform: 'translateY(-5px)',
            },
            '100%': {
              transform: 'translateY(0)',
            },
          },
        }}
      >
        {title && <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export const useNotification = () => {
  const [notification, setNotification] = React.useState<{
    open: boolean;
    message: string;
    title?: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info' = 'info',
    title?: string
  ) => {
    setNotification({
      open: true,
      message,
      severity,
      title,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const NotificationComponent = () => (
    <AnimatedNotification
      open={notification.open}
      message={notification.message}
      title={notification.title}
      severity={notification.severity}
      onClose={hideNotification}
    />
  );

  return {
    showNotification,
    hideNotification,
    NotificationComponent,
  };
};

export default AnimatedNotification;