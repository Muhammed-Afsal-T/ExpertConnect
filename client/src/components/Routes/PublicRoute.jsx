import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  if (localStorage.getItem('token')) {
    const user = JSON.parse(localStorage.getItem('user'));
    // Redirect already logged-in users to their role-specific dashboard.
    if (user?.role === 'admin') return <Navigate to="/admin" />;
    if (user?.role === 'expert') return <Navigate to="/expert-dashboard" />;
    return <Navigate to="/user-dashboard" />;
  }
  // No token means this public page (e.g., login/register) can be shown.
  return children;
};

export default PublicRoute;
