import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { selectIsAuthenticated, selectUserRole, selectHasPermission } from '../../store/slices/authSlice';
import LoadingScreen from '../common/LoadingScreen';
import UnauthorizedPage from '../../pages/Unauthorized';

interface PrivateRouteProps {
  requiredRole?: string;
  requiredPermission?: string;
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  requiredRole, 
  requiredPermission,
  children 
}) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);
  const hasPermission = useAppSelector(selectHasPermission(requiredPermission || ''));
  
  // Check authentication
  if (!isAuthenticated) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check role-based access
  if (requiredRole && userRole !== requiredRole && userRole !== 'SYSTEM_ADMIN') {
    return <UnauthorizedPage />;
  }
  
  // Check permission-based access
  if (requiredPermission && !hasPermission) {
    return <UnauthorizedPage />;
  }
  
  // Render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;