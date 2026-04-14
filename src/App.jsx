import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';

import { Dashboard } from './pages/Dashboard';
import { Flashcards } from './pages/Flashcards';
import { Quiz } from './pages/Quiz';
import { Profile } from './pages/Profile';

const theme = createTheme({
  palette: {
    primary: { 
      main: '#2563EB', // Vibrant premium blue
      dark: '#1D4ED8',
      light: '#60A5FA'
    },
    secondary: { 
      main: '#10B981', // Emerald tech
    },
    background: { 
      default: '#F1F5F9', // Clean light gray-blue
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569'
    }
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em', color: '#1E293B' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)'
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="flashcards" element={<Flashcards />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
