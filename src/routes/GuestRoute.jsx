import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';

/**
 * GuestRoute: Chỉ cho phép người dùng CHƯA đăng nhập truy cập.
 * Nếu đã đăng nhập, tự động chuyển hướng về trang chủ.
 */
export function GuestRoute({ children }) {
  if (authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
