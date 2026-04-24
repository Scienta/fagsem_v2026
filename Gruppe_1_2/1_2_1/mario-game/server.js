const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.static('public'));

const players = new Map();
const PLAYER_COLORS = { 1: 0xe74c3c, 2: 0x3498db, 3: 0x2ecc71, 4: 0xf39c12 };
const MAX_PLAYERS = 4;

let currentLevel     = 0;
let transitioning    = false;
let deadGoombas      = new Set();
let collectedCoins   = new Set();
let collectedMushrooms = new Set();

function nextAvailableSlot() {
  const used = new Set([...players.values()].map(p => p.playerNumber));
  for (let n = 1; n <= MAX_PLAYERS; n++) {
    if (!used.has(n)) return n;
  }
  return null;
}

io.on('connection', (socket) => {
  if (players.size >= MAX_PLAYERS) {
    socket.emit('server_full');
    socket.disconnect();
    return;
  }

  const playerNumber = nextAvailableSlot();
  if (!playerNumber) {
    socket.emit('server_full');
    socket.disconnect();
    return;
  }

  const spawnX = 60 + (playerNumber - 1) * 100;

  const player = {
    id: socket.id,
    playerNumber,
    color: PLAYER_COLORS[playerNumber],
    x: spawnX, y: 350,
    velocityX: 0, velocityY: 0,
    facing: 1,
    score: 0
  };

  players.set(socket.id, player);
  console.log(`Player ${playerNumber} connected (${socket.id.slice(0, 6)}), total: ${players.size}`);

  socket.emit('init', {
    self: player,
    existingPlayers: [...players.values()].filter(p => p.id !== socket.id),
    currentLevel,
    deadGoombas:       [...deadGoombas],
    collectedCoins:    [...collectedCoins],
    collectedMushrooms:[...collectedMushrooms]
  });

  socket.broadcast.emit('player_joined', player);

  socket.on('position_update', (data) => {
    const p = players.get(socket.id);
    if (!p) return;
    Object.assign(p, data);
    socket.broadcast.emit('player_moved', { id: socket.id, ...data });
  });

  socket.on('score_update', ({ score }) => {
    const p = players.get(socket.id);
    if (!p) return;
    p.score = score;
    socket.broadcast.emit('score_updated', { id: socket.id, playerNumber: p.playerNumber, score });
  });

  socket.on('goomba_killed', ({ id }) => {
    deadGoombas.add(id);
    socket.broadcast.emit('goomba_killed', { id });
  });

  socket.on('coin_collected', ({ id }) => {
    collectedCoins.add(id);
    socket.broadcast.emit('coin_collected', { id });
  });

  socket.on('mushroom_collected', ({ id }) => {
    collectedMushrooms.add(id);
    socket.broadcast.emit('mushroom_collected', { id });
  });

  socket.on('flag_reached', () => {
    if (transitioning) return;
    transitioning = true;
    deadGoombas.clear();
    collectedCoins.clear();
    collectedMushrooms.clear();

    if (currentLevel >= 4) {
      io.emit('game_won');
    } else {
      currentLevel++;
      console.log(`Advancing to level ${currentLevel}`);
      io.emit('level_change', { level: currentLevel });
    }
    setTimeout(() => { transitioning = false; }, 2000);
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
