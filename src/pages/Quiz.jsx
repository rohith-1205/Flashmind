import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Radio, RadioGroup, FormControlLabel, FormControl, CircularProgress } from '@mui/material';
import { generateQuiz } from '../services/gemini';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Bolt, AutoAwesome, Refresh } from '@mui/icons-material';

export const Quiz = () => {
  const { currentUser } = useAuth();
  const [topic, setTopic] = useState('');
  const [quizContent, setQuizContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const generated = await generateQuiz(topic);
      setQuizContent(generated);
      setAnswers({});
      setScore(null);
    } catch (error) {
      console.error(error);
      alert('Failed to generate quiz. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: parseInt(optionIndex)
    }));
  };

  const calculateScore = async () => {
    let currentScore = 0;
    quizContent.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    
    // Save to Firestore
    if (currentUser) {
      setSaving(true);
      try {
        await addDoc(collection(db, "scores"), {
          userId: currentUser.uid,
          topic: topic,
          score: currentScore,
          total: quizContent.length,
          percentage: Math.round((currentScore / quizContent.length) * 100),
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.error("Error saving score: ", e);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Bolt sx={{ color: 'secondary.main', fontSize: 32, mr: 1.5 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Quick Quiz
        </Typography>
      </Box>
      
      {!quizContent.length && (
        <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 4, border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>What do you want to test?</Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Enter any topic, concept, or historical event, and our AI will synthesize a custom 5-question multi-choice quiz to test your mastery.
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="E.g., Quantum Mechanics, The French Revolution, React Hooks..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': { bgcolor: '#F8FAFC', borderRadius: 2 }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
              sx={{ px: 4, borderRadius: 2 }}
            >
              {loading ? 'Synthesizing...' : 'Generate Quiz'}
            </Button>
          </Box>
        </Paper>
      )}

      {quizContent.length > 0 && score === null && (
        <Box>
          {quizContent.map((q, qIndex) => (
            <Paper elevation={1} key={qIndex} sx={{ p: { xs: 3, md: 4 }, mb: 3, borderRadius: 4, borderLeft: '4px solid #10B981' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                {qIndex + 1}. {q.question}
              </Typography>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup 
                  value={answers[qIndex] !== undefined ? answers[qIndex] : ''} 
                  onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                >
                  {q.options.map((opt, optIndex) => (
                    <FormControlLabel 
                      key={optIndex} 
                      value={optIndex.toString()} 
                      control={<Radio color="secondary" />} 
                      label={<Typography variant="body1" sx={{ ml: 1 }}>{opt}</Typography>} 
                      sx={{ 
                        mb: 1.5, 
                        p: 1.5, 
                        border: '1px solid #E2E8F0', 
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        bgcolor: answers[qIndex] == optIndex ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                        borderColor: answers[qIndex] == optIndex ? '#10B981' : '#E2E8F0',
                        '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.02)' }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 8 }}>
            <Button 
              variant="contained" 
              size="large" 
              color="primary" 
              onClick={calculateScore}
              disabled={Object.keys(answers).length !== quizContent.length || saving}
              sx={{ px: 5, py: 1.5, borderRadius: 3, fontSize: '1.1rem' }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : 'Submit Answers'}
            </Button>
          </Box>
        </Box>
      )}

      {score !== null && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 5, 
            background: score >= quizContent.length / 2 
              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
              : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', 
            color: 'white',
            mb: 6
          }}
        >
          <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 2, opacity: 0.8 }}>
            {score >= quizContent.length / 2 ? 'Great Job!' : 'Keep Studying!'}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
            {Math.round((score / quizContent.length) * 100)}%
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            You scored {score} out of {quizContent.length} correctly.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<Refresh />}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              borderRadius: 3,
              px: 4
            }} 
            onClick={() => {
              setQuizContent([]);
              setTopic('');
              setScore(null); 
              setAnswers({});
            }}
          >
            Take Another Quiz
          </Button>
        </Paper>
      )}
    </Box>
  );
};
