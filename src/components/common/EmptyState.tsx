import React from 'react';
import { Box, Typography, Button, useTheme, alpha, Fade } from '@mui/material';
import { 
  SearchOff, 
  FolderOff, 
  Receipt,
  SecurityUpdateGood,
  AddCircleOutline,
} from '@mui/icons-material';

interface EmptyStateProps {
  icon?: React.ReactElement;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'search' | 'data' | 'error' | 'success';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  type = 'data',
}) => {
  const theme = useTheme();

  const getDefaultIcon = () => {
    switch (type) {
      case 'search':
        return <SearchOff />;
      case 'error':
        return <Receipt />;
      case 'success':
        return <SecurityUpdateGood />;
      default:
        return <FolderOff />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'error':
        return theme.palette.error.main;
      case 'success':
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 3,
          textAlign: 'center',
          minHeight: 400,
        }}
      >
        <Box
          className="animate-fade-in-scale"
          sx={{
            width: 120,
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(getColor(), 0.1)} 0%, ${alpha(getColor(), 0.05)} 100%)`,
            mb: 3,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -20,
              borderRadius: '50%',
              border: `2px dashed ${alpha(getColor(), 0.2)}`,
              animation: 'rotate 20s linear infinite',
            },
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        >
          {React.cloneElement(icon || getDefaultIcon(), {
            sx: { fontSize: 48, color: getColor() },
          })}
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 400,
              mb: 3,
              lineHeight: 1.7,
            }}
          >
            {description}
          </Typography>
        )}

        {action && (
          <Button
            variant="contained"
            onClick={action.onClick}
            startIcon={<AddCircleOutline />}
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            {action.label}
          </Button>
        )}

        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: alpha(theme.palette.primary.main, 0.1),
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: alpha(theme.palette.secondary.main, 0.1),
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
      </Box>
    </Fade>
  );
};

export default EmptyState;