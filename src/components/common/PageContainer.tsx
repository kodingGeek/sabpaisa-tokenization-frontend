import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface PageContainerProps {
  children: React.ReactNode;
  noPadding?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | false;
  sx?: SxProps<Theme>;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  noPadding = false,
  maxWidth = false,
  sx
}) => {
  return (
    <Box
      sx={{
        p: noPadding ? 0 : 3,
        maxWidth: maxWidth ? maxWidth : '100%',
        mx: maxWidth ? 'auto' : 0,
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;