import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';

export function ProtectedRoute({ children, allowRoles = [] }) {
  const user = authService.getCurrentUser();
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowRoles.length > 0 && !allowRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
