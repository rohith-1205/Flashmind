import React, { useState } from 'react';
import { Box, Button, Typography, TextField, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined, AutoAwesome } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    try {
      setError('');
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-background">
      <Box 
        className="glass-panel"
        sx={{
          width: '100%',
          maxWidth: '420px',
          p: { xs: 4, md: 5 },
          borderRadius: 4,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mx: 2
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
            <AutoAwesome color="primary" sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h4" component="h1" sx={{ fontFamily: 'Outfit, sans-serif' }}>
              FlashMind
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {isLogin ? 'Welcome back! Ready to study?' : 'Create an account to master any topic.'}
          </Typography>
        </Box>

        {error && (
          <Box sx={{ bgcolor: '#fee2e2', color: '#b91c1c', p: 1.5, borderRadius: 2, mb: 3, width: '100%', fontSize: '0.875rem' }}>
            {error}
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            placeholder="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.8)' }
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            required
            fullWidth
            name="password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.8)' }
            }}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2, fontSize: '1.05rem', textTransform: 'none' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </Box>

        <Button 
          variant="text" 
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          sx={{ mt: 3, textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
        >
          {isLogin ? (
            <span>Don't have an account? <strong style={{color: '#2563EB'}}>Sign up</strong></span>
          ) : (
            <span>Already have an account? <strong style={{color: '#2563EB'}}>Sign in</strong></span>
          )}
        </Button>
      </Box>
    </Box>
  );
};
