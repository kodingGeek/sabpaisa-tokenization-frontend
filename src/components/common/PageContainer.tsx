import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface PageContainerProps extends BoxProps {
  children: React.ReactNode;
  noPadding?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | false;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  noPadding = false,
  maxWidth = false,
  sx,
  ...props 
}) => {
  return (
    <Box
      sx={{
        p: noPadding ? 0 : 3,
        maxWidth: maxWidth ? maxWidth : '100%',
        mx: maxWidth ? 'auto' : 0,
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default PageContainer;