import React from 'react';
import { Box, Typography, Paper, Button, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export const Profile = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>User Profile</Typography>
      
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        <Avatar src={currentUser?.photoURL} sx={{ width: 100, height: 100, mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 1 }}>{currentUser?.displayName || 'User'}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>{currentUser?.email}</Typography>
        
        <Button variant="outlined" color="error" fullWidth onClick={logout}>
          Sign Out
        </Button>
      </Paper>
    </Box>
  );
};
