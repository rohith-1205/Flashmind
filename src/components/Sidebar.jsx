import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, Divider, ListItemButton } from '@mui/material';
import { DashboardCustomize, SearchOutlined, ClassOutlined, GroupOutlined, PersonOutlined, LogoutOutlined, Bolt } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardCustomize />, path: '/' },
    { text: 'AI Flashcards', icon: <ClassOutlined />, path: '/flashcards' },
    { text: 'Quick Quiz', icon: <Bolt />, path: '/quiz' },
    { text: 'Profile Settings', icon: <PersonOutlined />, path: '/profile' },
  ];

  // Quick fallback if Style isn't imported right
  const getIcon = (text) => {
    switch (text) {
      case 'Dashboard': return <DashboardCustomize />;
      case 'AI Flashcards': return <ClassOutlined />;
      case 'Quick Quiz': return <Bolt />;
      case 'Profile Settings': return <PersonOutlined />;
      default: return <SearchOutlined />;
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#0F172A', // Deep corporate blue
          color: '#F8FAFC',
          borderRight: 'none',
          boxShadow: '4px 0 24px rgba(0,0,0,0.1)'
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
        <Bolt sx={{ color: '#60A5FA', fontSize: 32 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', letterSpacing: '0.5px' }}>
          FlashMind
        </Typography>
      </Box>

      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.05)', mx: 2, borderRadius: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: '#3B82F6', width: 40, height: 40, fontWeight: 700 }}>
          {currentUser?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
            {currentUser?.email?.split('@')[0]}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            Pro Student
          </Typography>
        </Box>
      </Box>

      <Typography variant="overline" sx={{ px: 4, color: '#64748B', fontWeight: 700, letterSpacing: '1px' }}>
        MENU
      </Typography>

      <List sx={{ px: 2, mt: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  color: isActive ? '#38BDF8' : '#CBD5E1',
                  '&:hover': {
                    bgcolor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    '& .MuiListItemIcon-root': { color: '#38BDF8' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#38BDF8' : '#94A3B8', minWidth: 40 }}>
                  {getIcon(item.text)}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: '0.95rem' }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
      <List sx={{ px: 2, mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: '#FCA5A5', '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' } }}>
            <ListItemIcon sx={{ color: '#FCA5A5', minWidth: 40 }}>
              <LogoutOutlined />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};
