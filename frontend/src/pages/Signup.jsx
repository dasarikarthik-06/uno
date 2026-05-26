import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(username, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-xl">
      <Typography variant="h4" className="mb-4 text-center">Create Account</Typography>
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} className="space-y-4">
        <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" fullWidth>Sign up</Button>
      </Box>
      <Typography className="mt-4 text-center text-sm text-slate-400">
        Already have an account? <Link to="/login" className="text-cyan-300">Login</Link>
      </Typography>
    </Box>
  );
}
