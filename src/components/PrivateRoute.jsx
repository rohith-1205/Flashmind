import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser === undefined) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};
