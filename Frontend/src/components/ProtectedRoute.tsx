import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Nếu chưa đăng nhập, redirect đến trang login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu yêu cầu role cụ thể và user không có role đó
  if (requiredRole && requiredRole.length > 0) {
    if (!requiredRole.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
