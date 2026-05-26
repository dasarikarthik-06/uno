import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography, Alert } from '@mui/material';
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

  useEffect(() => {
    if (gameState?.winner) {
      navigate(`/result/${roomId}`);
    }
  }, [gameState, navigate, roomId]);

  const player = gameState?.players?.find((p) => p.userId === user.userId);
  const otherPlayers = gameState?.players?.filter((p) => p.userId !== user.userId) ?? [];
  const myIndex = gameState?.players?.findIndex((p) => p.userId === user.userId) ?? -1;
  const isMyTurn = gameState ? gameState.currentTurn === myIndex : false;
  const activeCard = gameState?.discard?.[gameState?.discard.length - 1];
  const currentPlayer = gameState?.players?.[gameState?.currentTurn]?.username;

  return (
    <Box className="game-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <Box className="mx-auto max-w-6xl rounded-[40px] page-panel p-6 shadow-2xl">
        <Box className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Box>
            <Typography variant="h4" className="page-title">UNO Game</Typography>
            <Typography className="page-subtitle">Room {roomId} · {gameState?.players?.length ?? 0} players</Typography>
          </Box>
          <Box className="flex flex-wrap gap-3">
            <Box className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">03:00</Box>
            <Button variant="outlined" color="secondary" onClick={leaveRoom}>Exit</Button>
          </Box>
        </Box>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        {!gameState ? (
          <Typography className="mt-6 page-subtitle">Waiting for game state...</Typography>
        ) : (
          <>
            <Box className="grid gap-6 xl:grid-cols-[1fr_auto_0.9fr]">
              <Box className="grid gap-4">
                {otherPlayers.slice(0, 2).map((playerItem) => (
                  <Box key={playerItem.userId} className="player-pod">
                    <Typography className="page-subtitle">Player</Typography>
                    <Typography variant="h6" className="player-name">{playerItem.username}</Typography>
                    <Typography className="mt-2 text-sm text-slate-600">Cards: {playerItem.hand.length}</Typography>
                  </Box>
                ))}
                {otherPlayers.length === 0 && (
                  <Box className="player-pod">
                    <Typography className="page-subtitle">Waiting for players</Typography>
                  </Box>
                )}
              </Box>

              <Box className="relative flex justify-center items-center py-6">
                <Box className="game-arena">
                  <Box className="game-planet">
                    <Box className="game-table card-highlight">
                      {activeCard ? <Card card={activeCard} clickable={false} /> : <Typography>No card</Typography>}
                    </Box>
                  </Box>
                </Box>
                <Box className="game-card-stack deck">
                  <div className="stack-label">Deck</div>
                  <div className="absolute top-4 left-4 text-sm font-semibold text-slate-700">{gameState.deck.length}</div>
                </Box>
              </Box>

              <Box className="grid gap-4">
                <Box className="player-pod">
                  <Typography className="page-subtitle">Current turn</Typography>
                  <Typography variant="h6" className="player-name mt-2">{currentPlayer}</Typography>
                </Box>
                <Box className="player-pod">
                  <Typography className="page-subtitle">Your cards</Typography>
                  <Typography variant="h6" className="player-name mt-2">{player?.hand.length ?? 0}</Typography>
                </Box>
              </Box>
            </Box>

            <Box className="game-footer mt-6">
              <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Typography variant="h6" className="page-title">Your hand</Typography>
                <Typography className="page-subtitle">{isMyTurn ? 'It’s your turn' : `Waiting for ${currentPlayer}`}</Typography>
              </Box>
              <Box className="hand-row mt-4">
                {player?.hand?.map((card, index) => (
                  <Card
                    key={`${card.color}-${card.value}-${index}`}
                    card={card}
                    clickable={isMyTurn}
                    onClick={() => handlePlay(index)}
                  />
                ))}
              </Box>
            </Box>

            <Box className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="contained" onClick={handleDraw} fullWidth>Draw Card</Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
