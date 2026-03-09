import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    // Block unauthenticated access to protected pages.
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Block authenticated users who do not have one of the allowed roles.
    return <Navigate to="/" />;
  }

  // Authorized access: render target route content.
  return children;
};

export default ProtectedRoute;
