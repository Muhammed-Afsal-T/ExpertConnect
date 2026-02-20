import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  if (localStorage.getItem('token')) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role === 'admin') return <Navigate to="/admin" />;
    if (user?.role === 'expert') return <Navigate to="/expert-dashboard" />;
    return <Navigate to="/user-dashboard" />;
  }
  return children;
};

export default PublicRoute;