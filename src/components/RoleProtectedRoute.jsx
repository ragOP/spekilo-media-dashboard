import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Shield } from 'lucide-react';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && user && user.role) {
    const userRole = user.role.toLowerCase();
    const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);
    
    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center space-y-4 text-center p-8">
            <div className="p-4 bg-destructive/10 rounded-full">
              <Shield className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Access Denied</h1>
              <p className="text-muted-foreground max-w-md">
                You don't have permission to access this page. This area is restricted to users with the appropriate role.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Your current role: <span className="font-medium">{user.role}</span>
            </div>
          </div>
        </div>
      );
    }
  }

  // Render protected content if authenticated and authorized
  return children;
};

export default RoleProtectedRoute;
