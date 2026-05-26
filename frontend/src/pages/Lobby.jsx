import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography, List, ListItem, ListItemText, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext.jsx';
import { SocketContext } from '../context/SocketContext.jsx';

export default function Lobby() {
  const { roomId } = useParams();
  const { token, user, apiUrl } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [players, setPlayers] = useState([]);
  const [hostId, setHostId] = useState('');
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    socket.emit('join-room', { roomId, userId: user.userId, username: user.username });
    socket.on('room-update', (data) => {
      setPlayers(data.players);
      setHostId(data.hostId);
      setStarted(data.started);
    });
    socket.on('game-started', () => navigate(`/game/${roomId}`));
    socket.on('room-error', (message) => setError(message));
    return () => {
      socket.off('room-update');
      socket.off('game-started');
      socket.off('room-error');
    };
  }, [socket, roomId, user, navigate]);

  const startGame = () => {
    if (!socket) return;
    socket.emit('start-game', { roomId, userId: user.userId });
  };

  const leaveRoom = () => {
    if (socket) socket.emit('leave-room', { roomId, userId: user.userId });
    navigate('/home');
  };

  return (
    <Box className="rounded-3xl page-panel p-8 shadow-xl">
      <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="h4" className="page-title">Lobby</Typography>
        <Typography className="page-subtitle">Room code: {roomId}</Typography>
      </Box>
      {error && <Alert severity="error" className="my-4">{error}</Alert>}
      <List className="mt-4 rounded-3xl panel-surface p-3">
        {players.map((player) => (
          <ListItem key={player.userId} className="rounded-2xl panel-surface card-action">
            <ListItemText primary={player.username} secondary={player.userId === hostId ? 'Host' : 'Player'} />
          </ListItem>
        ))}
      </List>
      <Box className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="contained" disabled={user.userId !== hostId || players.length < 2 || started} onClick={startGame} fullWidth>
          Start Game
        </Button>
        <Button variant="outlined" color="secondary" onClick={leaveRoom} fullWidth>
          Leave Room
        </Button>
      </Box>
      <Typography className="mt-4 page-subtitle">Host can begin when 2+ players are present.</Typography>
    </Box>
  );
}
