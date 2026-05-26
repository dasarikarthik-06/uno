import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Home() {
  const { token, user, logout, apiUrl } = useContext(AuthContext);
  const [joinId, setJoinId] = useState('');
  const [error, setError] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createRoom = async () => {
    setError('');
    const response = await fetch(`${apiUrl}/api/rooms/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Unable to create room');
      return;
    }
    setRoomId(data.roomId);
    navigate(`/lobby/${data.roomId}`);
  };

  const joinRoom = async () => {
    setError('');
    if (!joinId) {
      setError('Enter a room code');
      return;
    }
    const response = await fetch(`${apiUrl}/api/rooms/${joinId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.message || 'Room not found');
      return;
    }
    navigate(`/lobby/${joinId}`);
  };

  return (
    <Box className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-xl">
      <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="h4">Welcome, {user?.username}</Typography>
        <Button onClick={logout} color="secondary" variant="outlined">Logout</Button>
      </Box>
      <Typography className="mt-2 text-slate-400">Create or join a room to start online UNO.</Typography>
      {error && <Alert severity="error" className="my-4">{error}</Alert>}
      <Box className="mt-6 space-y-4">
        <Button variant="contained" fullWidth onClick={createRoom}>Create Room</Button>
        <Box className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <TextField value={joinId} onChange={(e) => setJoinId(e.target.value.toUpperCase())} label="Room Code" fullWidth />
          <Button variant="outlined" onClick={joinRoom}>Join</Button>
        </Box>
      </Box>
      {roomId && (
        <Typography className="mt-4 text-slate-300">Created room <strong>{roomId}</strong></Typography>
      )}
    </Box>
  );
}
