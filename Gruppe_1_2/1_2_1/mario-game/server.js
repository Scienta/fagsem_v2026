const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.static('public'));

const players = new Map();
let nextPlayerNumber = 1;
const PLAYER_COLORS = { 1: 0xe74c3c, 2: 0x3498db, 3: 0x2ecc71, 4: 0xf39c12 };

const deadGoombas = new Set();
const collectedCoins = new Set();

io.on('connection', (socket) => {
  if (players.size >= 4) {
    socket.emit('server_full');
    socket.disconnect();
    return;
  }

  const playerNumber = nextPlayerNumber++;
  const spawnX = 100 + (playerNumber - 1) * 120;

  const player = {
    id: socket.id,
    playerNumber,
    color: PLAYER_COLORS[playerNumber],
    x: spawnX,
    y: 400,
    velocityX: 0,
    velocityY: 0,
    facing: 1
  };

  players.set(socket.id, player);
  console.log(`Player ${playerNumber} connected (${socket.id.slice(0, 6)}), total: ${players.size}`);

  socket.emit('init', {
    self: player,
    existingPlayers: [...players.values()].filter(p => p.id !== socket.id),
    deadGoombas: [...deadGoombas],
    collectedCoins: [...collectedCoins]
  });

  socket.broadcast.emit('player_joined', player);

  socket.on('position_update', (data) => {
    const p = players.get(socket.id);
    if (!p) return;
    Object.assign(p, data);
    socket.broadcast.emit('player_moved', { id: socket.id, ...data });
  });

  socket.on('goomba_killed', ({ id }) => {
    deadGoombas.add(id);
    socket.broadcast.emit('goomba_killed', { id });
  });

  socket.on('coin_collected', ({ id }) => {
    collectedCoins.add(id);
    socket.broadcast.emit('coin_collected', { id });
  });

  socket.on('disconnect', () => {
    players.delete(socket.id);
    console.log(`Player ${playerNumber} disconnected, total: ${players.size}`);
    io.emit('player_left', { id: socket.id });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Other devices on the same network can join via your local IP');
});
