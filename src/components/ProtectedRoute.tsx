
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { currentUser } = useAuth();
  
  console.log("ProtectedRoute - currentUser:", currentUser);
  console.log("ProtectedRoute - requireAdmin:", requireAdmin);
  
  if (!currentUser) {
    console.log("ProtectedRoute - No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !currentUser.isAdmin) {
    console.log("ProtectedRoute - User is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("ProtectedRoute - Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
