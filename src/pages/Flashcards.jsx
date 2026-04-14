import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, CircularProgress, Paper, IconButton } from '@mui/material';
import { AutoAwesome, Cached } from '@mui/icons-material';
import { generateFlashcards } from '../services/gemini';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/flashcard.module.css';

export const Flashcards = () => {
  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const generated = await generateFlashcards(inputText);
      setCards(generated);
      setFlippedCards({});
      
      // Save generation stats to Firestore
      if (currentUser && generated.length > 0) {
        try {
          await addDoc(collection(db, "flashcardsMeta"), {
            userId: currentUser.uid,
            count: generated.length,
            timestamp: serverTimestamp()
          });
        } catch (e) {
          console.error("Error saving flashcard stats:", e);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Generation Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <AutoAwesome sx={{ color: 'primary.main', fontSize: 32, mr: 1.5 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
          AI Flashcard Studio
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>Generate from Notes</Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Paste your study material below. Our AI engine will automatically extract the core concepts and convert them into an interactive deck of flashcards.
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          placeholder="E.g. The mitochondria is the powerhouse of the cell. It's responsible for generating most of the cell's supply of adenosine triphosphate (ATP)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              bgcolor: '#F8FAFC',
              borderRadius: 2
            }
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {cards.length > 0 && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => { setCards([]); setInputText(''); }}
              startIcon={<Cached />}
            >
              Clear
            </Button>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleGenerate}
            disabled={loading || !inputText.trim()}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
            sx={{ px: 4, borderRadius: 2 }}
          >
            {loading ? 'Synthesizing...' : 'Generate Deck'}
          </Button>
        </Box>
      </Paper>

      {cards.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            Your Deck ({cards.length} Cards)
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
            gap: 3 
          }}>
            {cards.map((card, index) => (
              <Box key={index}>
                <div 
                  className={`${styles.flashcard} ${flippedCards[index] ? styles.flipped : ''}`} 
                  onClick={() => toggleFlip(index)}
                >
                  <div className={styles.flashcardInner}>
                    <div className={styles.flashcardFront}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1.1rem' }}>
                        {card.question}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 'auto', opacity: 0.8, fontWeight: 500 }}>
                        Tap to flip card
                      </Typography>
                    </div>
                    <div className={styles.flashcardBack}>
                      <Typography variant="body1" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
                        {card.answer}
                      </Typography>
                    </div>
                  </div>
                </div>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
