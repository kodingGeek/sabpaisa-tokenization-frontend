import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, alpha, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import CountUp from 'react-countup';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactElement;
  trend?: number;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  suffix?: string;
  prefix?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  suffix = '',
  prefix = '',
  isLoading = false,
  onClick,
}) => {
  const theme = useTheme();

  const getGradient = () => {
    const gradients = {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      error: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      warning: 'linear-gradient(135deg, #fa8072 0%, #ffd700 100%)',
      info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    };
    return gradients[color] || gradients.primary;
  };

  if (isLoading) {
    return (
      <Card className="skeleton-loading" sx={{ height: '100%', minHeight: 180 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="rectangular" width="40%" height={60} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="30%" sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="hover-lift animate-fade-in"
      onClick={onClick}
      sx={{
        height: '100%',
        minHeight: 180,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          '& .stat-icon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .trend-indicator': {
            transform: 'translateY(-2px)',
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: getGradient(),
          opacity: 0.1,
          transform: 'skewX(-20deg) translateX(20%)',
          transition: 'transform 0.3s ease',
        },
        '&:hover::before': {
          transform: 'skewX(-20deg) translateX(10%)',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 500, letterSpacing: 0.5 }}
            >
              {title}
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: getGradient(),
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                lineHeight: 1.2,
                mt: 1,
              }}
            >
              {typeof value === 'number' ? (
                <>
                  {prefix}
                  <CountUp
                    end={value}
                    duration={2}
                    separator=","
                    decimals={value % 1 !== 0 ? 2 : 0}
                  />
                  {suffix}
                </>
              ) : (
                value
              )}
            </Typography>

            {trend !== undefined && (
              <Box
                className="trend-indicator"
                display="flex"
                alignItems="center"
                mt={1.5}
                sx={{ transition: 'transform 0.3s ease' }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    color: trend >= 0 ? 'success.main' : 'error.main',
                    backgroundColor: trend >= 0 
                      ? alpha(theme.palette.success.main, 0.1) 
                      : alpha(theme.palette.error.main, 0.1),
                    borderRadius: 2,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  {trend >= 0 ? (
                    <TrendingUp fontSize="small" />
                  ) : (
                    <TrendingDown fontSize="small" />
                  )}
                  <Typography
                    variant="body2"
                    sx={{ ml: 0.5, fontWeight: 600 }}
                  >
                    {Math.abs(trend)}%
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  vs last period
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            className="stat-icon"
            sx={{
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 3,
              background: getGradient(),
              color: 'white',
              transition: 'transform 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {React.cloneElement(icon, { fontSize: 'medium' })}
          </Box>
        </Box>

        {/* Animated background pattern */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: getGradient(),
            opacity: 0.05,
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StatCard;