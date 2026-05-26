import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography, Alert, Chip } from '@mui/material';
import { AuthContext } from '../context/AuthContext.jsx';
import { SocketContext } from '../context/SocketContext.jsx';
import Card from '../components/Card.jsx';

export default function Game() {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    socket.emit('join-room', { roomId, userId: user.userId, username: user.username });
    socket.on('game-state', setGameState);
    socket.on('game-started', setGameState);
    socket.on('game-error', (message) => setError(message));
    return () => {
      socket.off('game-state');
      socket.off('game-started');
      socket.off('game-error');
    };
  }, [socket, roomId, user]);

  useEffect(() => {
    if (!error) return undefined;
    const timer = setTimeout(() => setError(''), 2000);
    return () => clearTimeout(timer);
  }, [error]);

  const handlePlay = (index) => {
    if (!socket) return;
    socket.emit('play-card', { roomId, userId: user.userId, cardIndex: index });
  };

  const handleDraw = () => {
    if (!socket) return;
    socket.emit('draw-card', { roomId, userId: user.userId });
  };

  const leaveRoom = () => {
    if (socket) socket.emit('leave-room', { roomId, userId: user.userId });
    navigate('/home');
  };

  const player = gameState?.players?.find((p) => p.userId === user.userId);
  const activeCard = gameState?.discard?.[gameState.discard.length - 1];
  const currentPlayer = gameState?.players?.[gameState?.currentTurn]?.username;

  return (
    <Box className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-xl">
      <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="h4">UNO Game</Typography>
        <Button variant="outlined" color="secondary" onClick={leaveRoom}>Exit</Button>
      </Box>
      {error && <Alert severity="error" className="my-4">{error}</Alert>}
      {!gameState ? (
        <Typography className="mt-6 text-slate-400">Waiting for game state...</Typography>
      ) : (
        <>
          <Box className="mt-6 grid gap-4 md:grid-cols-3">
            <Box className="rounded-3xl bg-slate-950/80 p-4 text-center">
              <Typography variant="subtitle2" className="text-slate-400">Current turn</Typography>
              <Typography variant="h6">{currentPlayer}</Typography>
              <Chip label={`Deck ${gameState.deck.length}`} className="mt-3" />
            </Box>
            <Box className="rounded-3xl bg-slate-950/80 p-4 text-center">
              <Typography variant="subtitle2" className="text-slate-400">Discard top</Typography>
              {activeCard ? <Card card={activeCard} clickable={false} /> : <Typography>No card</Typography>}
            </Box>
            <Box className="rounded-3xl bg-slate-950/80 p-4 text-center">
              <Typography variant="subtitle2" className="text-slate-400">Players</Typography>
              <Typography>{gameState.players.length}</Typography>
            </Box>
          </Box>
          <Box className="mt-6 rounded-3xl bg-slate-950/80 p-4">
            <Typography variant="h6">Your hand</Typography>
            <Box className="mt-4 flex flex-wrap gap-3">
              {player?.hand?.map((card, index) => (
                <Card
                  key={`${card.color}-${card.value}-${index}`}
                  card={card}
                  clickable={gameState.currentTurn === gameState.players.findIndex((p) => p.userId === user.userId)}
                  onClick={() => handlePlay(index)}
                />
              ))}
            </Box>
          </Box>
          <Box className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="contained" onClick={handleDraw} fullWidth>Draw Card</Button>
            {gameState.winner && (
              <Typography className="rounded-3xl bg-emerald-500/20 p-4 text-center">Winner: {gameState.players.find((p) => p.userId === gameState.winner)?.username}</Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
