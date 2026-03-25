import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export function ProtectedRoute({ children, allowRoles = [] }) {
  const user = authService.getCurrentUser();
  const location = useLocation();

  const isAuth = authService.isAuthenticated();
  const isAllowed = allowRoles.length === 0 || allowRoles.includes(user?.role);

  useEffect(() => {
    if (isAuth && !isAllowed) {
      toast.error("Bạn không có quyền truy cập vào trang này");
    }
  }, [isAuth, isAllowed]);

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
