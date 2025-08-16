import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 

const PrivateRoute = () => {
  const token = localStorage.getItem('access_token');
  const decoded = jwtDecode(token);
  return token && decoded.scope?.includes("ROLE_MANAGER")  ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;