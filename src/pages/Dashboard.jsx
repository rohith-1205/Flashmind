import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AutoAwesome, Bolt, ArrowForwardIos, HistoryEdu } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [pastScores, setPastScores] = useState([]);
  const [avgScore, setAvgScore] = useState(null);
  const [totalCards, setTotalCards] = useState(0);
  const [loadingScores, setLoadingScores] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!currentUser) return;
      try {
        // Fetch Scores
        const qScores = query(
          collection(db, "scores"),
          where("userId", "==", currentUser.uid)
        );
        const scoresSnapshot = await getDocs(qScores);
        let scoresData = [];
        let totalPct = 0;
        
        scoresSnapshot.forEach((doc) => {
          const data = doc.data();
          scoresData.push({ id: doc.id, ...data });
          totalPct += data.percentage;
        });

        scoresData.sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return b.timestamp.toMillis() - a.timestamp.toMillis();
        });
        
        setPastScores(scoresData);
        if (scoresData.length > 0) {
          setAvgScore(Math.round(totalPct / scoresData.length));
        }

        // Fetch Flashcards Count
        const qCards = query(
          collection(db, "flashcardsMeta"),
          where("userId", "==", currentUser.uid)
        );
        const cardsSnapshot = await getDocs(qCards);
        let cardsCount = 0;
        cardsSnapshot.forEach((doc) => {
          cardsCount += doc.data().count || 0;
        });
        setTotalCards(cardsCount);

      } catch (error) {
        console.error("Error fetching dashboard stats: ", error);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchDashboardStats();
  }, [currentUser]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
      <Box sx={{ mb: 5, mt: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
          {getGreeting()}, {currentUser?.email?.split('@')[0]}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to crush your study goals today? Here's your overview.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              borderRadius: 4, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}
          >
            <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}>
              <AutoAwesome sx={{ fontSize: 150 }} />
            </Box>
            <Box sx={{ zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.light', color: 'white', mr: 2, display: 'flex' }}>
                  <AutoAwesome />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Cards</Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                {loadingScores ? '--' : totalCards}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total generated all-time</Typography>
            </Box>
            <Button 
              variant="contained" 
              sx={{ mt: 4, borderRadius: 2, py: 1.5 }} 
              onClick={() => navigate('/flashcards')}
              endIcon={<ArrowForwardIos sx={{ fontSize: 12 }} />}
              disableElevation
            >
              Generate New
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              borderRadius: 4, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              border: '2px solid transparent',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, borderColor: 'secondary.main' }
            }}
            onClick={() => setHistoryOpen(true)}
          >
            <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}>
              <Bolt sx={{ fontSize: 150 }} />
            </Box>
            <Box sx={{ zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'secondary.main', color: 'white', mr: 2, display: 'flex' }}>
                  <Bolt />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Average Score</Typography>
              </Box>
              
              {loadingScores ? (
                 <CircularProgress size={40} color="secondary" sx={{ mt: 2 }} />
              ) : (
                <>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                    {avgScore !== null ? `${avgScore}` : '--'}<span style={{fontSize: '1.5rem'}}>{avgScore !== null ? '%' : ''}</span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Across {pastScores.length} recorded quizzes
                  </Typography>
                </>
              )}
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ mt: 4, borderRadius: 2, py: 1.5 }} 
              onClick={(e) => { e.stopPropagation(); navigate('/quiz'); }}
              disableElevation
            >
              Take New Quiz
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* History Modal */}
      <Dialog 
        open={historyOpen} 
        onClose={() => setHistoryOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', fontWeight: 800 }}>
          <HistoryEdu sx={{ mr: 1, color: 'secondary.main' }} /> Test History
        </DialogTitle>
        <DialogContent dividers>
          {loadingScores ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : pastScores.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">You haven't taken any quizzes yet.</Typography>
            </Box>
          ) : (
            <List>
              {pastScores.map((score, idx) => (
                <React.Fragment key={score.id}>
                  <ListItem sx={{ py: 2 }}>
                    <Box sx={{ 
                      width: 48, height: 48, borderRadius: 2, 
                      bgcolor: score.percentage >= 50 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: score.percentage >= 50 ? '#10B981' : '#EF4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, mr: 2
                    }}>
                      {score.percentage}%
                    </Box>
                    <ListItemText 
                      primary={<Typography variant="subtitle1" fontWeight={700}>{score.topic}</Typography>}
                      secondary={`Score: ${score.score}/${score.total} • ${score.timestamp ? new Date(score.timestamp.toDate()).toLocaleDateString() : 'Just now'}`}
                    />
                  </ListItem>
                  {idx < pastScores.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setHistoryOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>Close</Button>
          <Button variant="contained" color="secondary" onClick={() => navigate('/quiz')} sx={{ borderRadius: 2, px: 3 }}>
            Start New Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
