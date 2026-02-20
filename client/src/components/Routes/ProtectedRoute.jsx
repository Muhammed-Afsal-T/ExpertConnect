import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    // If not logged in, it will take you to the login page.
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If the role does not match, it will be sent to the home page.
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;