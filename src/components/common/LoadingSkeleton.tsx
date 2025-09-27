import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'list' | 'dashboard';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const renderCardSkeleton = () => (
    <Card className="skeleton-loading" sx={{ mb: 2 }}>
      <CardContent>
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 1 }} />
        <Box display="flex" gap={1}>
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
        </Box>
      </CardContent>
    </Card>
  );

  const renderTableSkeleton = () => (
    <Card>
      <CardContent>
        <Box mb={2}>
          <Skeleton variant="text" width="30%" height={32} />
        </Box>
        <Box>
          <Skeleton variant="rectangular" height={50} sx={{ mb: 1 }} />
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 0.5 }} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <Box>
      {[...Array(count)].map((_, index) => (
        <Box key={index} display="flex" alignItems="center" p={2} gap={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box flex={1}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={16} />
          </Box>
          <Skeleton variant="rounded" width={80} height={32} />
        </Box>
      ))}
    </Box>
  );

  const renderDashboardSkeleton = () => (
    <Box>
      <Grid container spacing={3} mb={3}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="skeleton-loading">
              <CardContent>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="30%" height={16} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card className="skeleton-loading">
            <CardContent>
              <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="skeleton-loading">
            <CardContent>
              <Skeleton variant="text" width="50%" height={24} sx={{ mb: 2 }} />
              {[...Array(5)].map((_, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Box flex={1}>
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="50%" height={14} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  switch (type) {
    case 'table':
      return renderTableSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'dashboard':
      return renderDashboardSkeleton();
    default:
      return (
        <>
          {[...Array(count)].map((_, index) => (
            <Box key={index}>{renderCardSkeleton()}</Box>
          ))}
        </>
      );
  }
};

export default LoadingSkeleton;