import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { SocketContext } from '../context/SocketContext.jsx';
import GameTable from '../components/GameTable.jsx';

export default function Game() {
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

  const handlePlay = (index) => {
    if (!socket) return;
    socket.emit('play-card', { roomId, userId: user.userId, cardIndex: index });
  };

  const handleDraw = () => {
    if (!socket) return;
    socket.emit('draw-card', { roomId, userId: user.userId });
  };

  const handleExit = () => {
    if (socket) socket.emit('leave-room', { roomId, userId: user.userId });
    navigate('/home');
  };

  useEffect(() => {
    if (gameState?.winner) {
      navigate(`/result/${roomId}`);
    }
  }, [gameState, navigate, roomId]);

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <GameTable 
        gameState={gameState}
        currentUserId={user.userId}
        onPlayCard={handlePlay}
        onDrawCard={handleDraw}
        onExit={handleExit}
      />
    </div>
  );
}
