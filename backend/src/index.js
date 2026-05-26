const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const { createGameState, playCardInRoom, drawCardInRoom } = require('./game');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const rooms = {};
const socketRoomMap = {};

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, userId, username }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit('room-error', 'Room not found');
      return;
    }
    if (!room.players.find((p) => p.userId === userId)) {
      room.players.push({ userId, username, hand: [] });
    }
    socket.join(roomId);
    socketRoomMap[socket.id] = { roomId, userId };
    io.to(roomId).emit('room-update', {
      roomId,
      players: room.players.map((p) => ({ userId: p.userId, username: p.username })),
      hostId: room.hostId,
      started: room.started,
    });
    if (room.started) {
      socket.emit('game-state', room);
    }
  });

  socket.on('start-game', ({ roomId, userId }) => {
    const room = rooms[roomId];
    if (!room) return;
    if (room.hostId !== userId) return;
    if (room.players.length < 2) return;
    if (room.started) return;
    rooms[roomId] = createGameState(room);
    io.to(roomId).emit('game-started', rooms[roomId]);
    io.to(roomId).emit('game-state', rooms[roomId]);
  });

  socket.on('play-card', ({ roomId, userId, cardIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.started) return;
    const result = playCardInRoom(room, userId, cardIndex);
    if (result.error) {
      socket.emit('game-error', result.error);
      return;
    }
    io.to(roomId).emit('game-state', room);
  });

  socket.on('draw-card', ({ roomId, userId }) => {
    const room = rooms[roomId];
    if (!room || !room.started) return;
    const result = drawCardInRoom(room, userId);
    if (result.error) {
      socket.emit('game-error', result.error);
      return;
    }
    io.to(roomId).emit('game-state', room);
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.players = room.players.filter((p) => p.userId !== userId);
    if (room.hostId === userId && room.players.length) {
      room.hostId = room.players[0].userId;
    }
    io.to(roomId).emit('room-update', {
      roomId,
      players: room.players.map((p) => ({ userId: p.userId, username: p.username })),
      hostId: room.hostId,
      started: room.started,
    });
  });

  socket.on('disconnect', () => {
    const mapping = socketRoomMap[socket.id];
    if (!mapping) return;
    const { roomId, userId } = mapping;
    const room = rooms[roomId];
    if (!room) return;
    room.players = room.players.filter((p) => p.userId !== userId);
    if (room.hostId === userId && room.players.length) {
      room.hostId = room.players[0].userId;
    }
    io.to(roomId).emit('room-update', {
      roomId,
      players: room.players.map((p) => ({ userId: p.userId, username: p.username })),
      hostId: room.hostId,
      started: room.started,
    });
    delete socketRoomMap[socket.id];
  });
});

app.post('/api/rooms/create', authMiddleware, (req, res) => {
  const roomId = Math.random().toString(36).slice(2, 8).toUpperCase();
  rooms[roomId] = {
    roomId,
    hostId: req.user.id,
    players: [{ userId: req.user.id, username: req.user.username, hand: [] }],
    started: false,
  };
  res.json({ roomId });
});

app.get('/api/rooms/:id', authMiddleware, (req, res) => {
  const room = rooms[req.params.id];
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  res.json({ roomId: room.roomId, players: room.players.map((p) => ({ userId: p.userId, username: p.username })), hostId: room.hostId, started: room.started });
});

const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uno';
mongoose.connect(mongoUri).then(() => {
  console.log('MongoDB connected');
  server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}).catch((error) => {
  console.error('MongoDB error', error);
});
