import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Divider } from '@mui/material';
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export const StudyRooms = () => {
  const { currentUser } = useAuth();
  const [roomId, setRoomId] = useState('');
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Minimal implementation for shared room concept
  const joinRoom = () => {
    if (roomId.trim()) {
      setActiveRoom(roomId);
    }
  };

  useEffect(() => {
    if (!activeRoom) return;

    const q = query(
      collection(db, `studyRooms/${activeRoom}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return unsubscribe;
  }, [activeRoom]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, `studyRooms/${activeRoom}/messages`), {
        text: newMessage,
        userId: currentUser?.uid,
        userName: currentUser?.displayName || 'Anonymous',
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Study Rooms</Typography>
      
      {!activeRoom ? (
        <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Join or Create a Room</Typography>
          <TextField 
            fullWidth 
            variant="outlined" 
            placeholder="Room ID" 
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={joinRoom}>Join Room</Button>
        </Paper>
      ) : (
        <Grid container spacing={3} sx={{ height: '70vh' }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>Room: {activeRoom}</Typography>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                {messages.length === 0 && <Typography color="text.secondary">No messages yet. Start collaborating!</Typography>}
                {messages.map((msg) => (
                  <Box key={msg.id} sx={{ mb: 1.5, textAlign: msg.userId === currentUser?.uid ? 'right' : 'left' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{msg.userName}</Typography>
                    <Box 
                      sx={{ 
                        display: 'inline-block', 
                        p: 1.5, 
                        borderRadius: 2, 
                        bgcolor: msg.userId === currentUser?.uid ? 'primary.main' : 'common.white',
                        color: msg.userId === currentUser?.uid ? 'primary.contrastText' : 'text.primary',
                        border: msg.userId === currentUser?.uid ? 'none' : '1px solid #e0e0e0',
                        maxWidth: '80%'
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <form onSubmit={sendMessage} style={{ display: 'flex' }}>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  size="small"
                  placeholder="Type a message or share a note..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <Button type="submit" variant="contained">Send</Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
             <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>Shared Flashcards</Typography>
              <Typography color="text.secondary">Flashcards generated in this room will appear here.</Typography>
             </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
