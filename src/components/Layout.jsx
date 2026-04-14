import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
