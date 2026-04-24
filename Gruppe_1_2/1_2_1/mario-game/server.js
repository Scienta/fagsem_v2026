const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { LEVELS, PLAYER_COLORS } = require('./public/levels');

const app = express();
const httpServer = createServer(app);
const corsOrigin = process.env.CORS_ORIGIN || '*';
const io = new Server(httpServer, { cors: { origin: corsOrigin } });

app.use(express.static('public'));

const players = new Map();
const MAX_PLAYERS = 4;
const POSITION_UPDATE_MIN_INTERVAL_MS = 20;

// Pre-compute valid IDs per level so event validation is O(1).
const LEVEL_IDS = LEVELS.map(lvl => ({
  goombas:        new Set(lvl.goombas.map(g => g.id)),
  coins:          new Set(lvl.coins.map(c => c.id)),
  mushrooms:      new Set((lvl.mushrooms       || []).map(m => m.id)),
  questionBlocks: new Set((lvl.questionBlocks  || []).map(q => q.id)),
}));

let currentLevel       = 0;
let transitioning      = false;
const deadGoombas        = new Set();
const collectedCoins     = new Set();
const collectedMushrooms = new Set();
const hitQuestionBlocks  = new Set();

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
    score: 0,
    lastPositionUpdate: 0,
  };

  players.set(socket.id, player);
  console.log(`Player ${playerNumber} connected (${socket.id.slice(0, 6)}), total: ${players.size}`);

  socket.emit('init', {
    self: player,
    existingPlayers: [...players.values()].filter(p => p.id !== socket.id),
    currentLevel,
    deadGoombas:        [...deadGoombas],
    collectedCoins:     [...collectedCoins],
    collectedMushrooms: [...collectedMushrooms],
    hitQuestionBlocks:  [...hitQuestionBlocks]
  });

  socket.broadcast.emit('player_joined', player);

  socket.on('position_update', (data) => {
    const p = players.get(socket.id);
    if (!p || !data) return;

    const now = Date.now();
    if (now - p.lastPositionUpdate < POSITION_UPDATE_MIN_INTERVAL_MS) return;
    p.lastPositionUpdate = now;

    // Whitelist: never trust client-sent id, playerNumber, color, score.
    const { x, y, velocityX, velocityY, facing, powered, animFrame } = data;
    Object.assign(p, { x, y, velocityX, velocityY, facing, powered });

    socket.broadcast.emit('player_moved', {
      id: socket.id,
      x, y, velocityX, velocityY, facing, powered, animFrame,
    });
  });

  // Score remains client-authoritative — acceptable for a prototype, trivially
  // spoofable. Server only relays so the leaderboard stays in sync.
  socket.on('score_update', ({ score } = {}) => {
    const p = players.get(socket.id);
    if (!p || typeof score !== 'number' || !Number.isFinite(score)) return;
    p.score = score;
    socket.broadcast.emit('score_updated', { id: socket.id, playerNumber: p.playerNumber, score });
  });

  socket.on('goomba_killed', ({ id } = {}) => {
    if (!players.has(socket.id)) return;
    if (!LEVEL_IDS[currentLevel].goombas.has(id)) return;
    if (deadGoombas.has(id)) return;
    deadGoombas.add(id);
    socket.broadcast.emit('goomba_killed', { id });
  });

  socket.on('coin_collected', ({ id } = {}) => {
    if (!players.has(socket.id)) return;
    if (!LEVEL_IDS[currentLevel].coins.has(id)) return;
    if (collectedCoins.has(id)) return;
    collectedCoins.add(id);
    socket.broadcast.emit('coin_collected', { id });
  });

  socket.on('mushroom_collected', ({ id } = {}) => {
    if (!players.has(socket.id)) return;
    if (!LEVEL_IDS[currentLevel].mushrooms.has(id)) return;
    if (collectedMushrooms.has(id)) return;
    collectedMushrooms.add(id);
    socket.broadcast.emit('mushroom_collected', { id });
  });

  socket.on('question_block_hit', ({ id } = {}) => {
    if (!players.has(socket.id)) return;
    if (!LEVEL_IDS[currentLevel].questionBlocks.has(id)) return;
    if (hitQuestionBlocks.has(id)) return;
    hitQuestionBlocks.add(id);
    socket.broadcast.emit('question_block_hit', { id });
  });

  socket.on('flag_reached', () => {
    if (!players.has(socket.id)) return;
    if (transitioning) return;
    transitioning = true;
    deadGoombas.clear();
    collectedCoins.clear();
    collectedMushrooms.clear();
    hitQuestionBlocks.clear();

    if (currentLevel >= LEVELS.length - 1) {
      io.emit('game_won');
    } else {
      currentLevel++;
      console.log(`Advancing to level ${currentLevel}`);
      io.emit('level_change', { level: currentLevel });
    }
    setTimeout(() => { transitioning = false; }, 2000);
  });

  socket.on('disconnect', () => {
    // Guards against rejected connections (server_full / no slot) where the
    // player was never added and we'd otherwise broadcast a phantom player_left.
    if (!players.has(socket.id)) return;
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
