import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import { AuthContext } from '../context/AuthContext.jsx';
import { SocketContext } from '../context/SocketContext.jsx';

export default function Result() {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [gameState, setGameState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    socket.emit('join-room', { roomId, userId: user.userId, username: user.username });
    socket.on('game-state', setGameState);
    socket.on('game-started', setGameState);
    return () => {
      socket.off('game-state');
      socket.off('game-started');
    };
  }, [socket, roomId, user]);

  const ranking = useMemo(() => {
    if (!gameState?.players) return [];
    return [...gameState.players]
      .sort((a, b) => a.hand.length - b.hand.length)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
        winner: player.userId === gameState.winner,
      }));
  }, [gameState]);

  const winner = gameState?.players?.find((player) => player.userId === gameState?.winner);

  return (
    <Box className="rounded-3xl page-panel p-8 shadow-xl">
      <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="h4" className="page-title">Game Results</Typography>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/home')}>Back Home</Button>
      </Box>
      {!gameState ? (
        <Typography className="mt-6 page-subtitle">Loading result...</Typography>
      ) : (
        <>
          <Box className="mt-6 rounded-3xl panel-surface p-6 text-center">
            <Typography variant="subtitle2" className="page-subtitle">Winner</Typography>
            <Typography variant="h5" className="mt-1">
              {winner ? winner.username : 'Game over'}
            </Typography>
          </Box>
          <List className="mt-6 space-y-3">
            {ranking.map((player) => (
              <ListItem key={player.userId} className="rounded-3xl panel-surface p-4">
                <ListItemText
                  primary={player.username}
                  secondary={`Cards left: ${player.hand.length}`}
                  primaryTypographyProps={{ className: 'text-slate-900' }}
                  secondaryTypographyProps={{ className: 'page-subtitle' }}
                />
                <Chip
                  label={player.winner ? `#${player.rank} Winner` : `#${player.rank}`}
                  color={player.winner ? 'success' : 'default'}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
