// ── Sound manager (Web Audio API, no files) ───────────────────────────────────

class SoundManager {
  constructor() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { this.ctx = null; }
  }

  _tone(freq, dur, type = 'square', vol = 0.25, freqEnd = null) {
    if (!this.ctx) return;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + dur);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.start(); osc.stop(this.ctx.currentTime + dur);
  }

  jump()     { this._tone(200, 0.15, 'square', 0.2, 600); }
  coin()     { this._tone(800, 0.05, 'square', 0.25); setTimeout(() => this._tone(1200, 0.1, 'square', 0.25), 60); }
  stomp()    { this._tone(300, 0.1, 'square', 0.35, 80); }
  die()      { this._tone(500, 0.45, 'square', 0.3, 100); }
  mushroom() { [600,800,1000].forEach((f,i) => setTimeout(() => this._tone(f, 0.1, 'square', 0.22), i*90)); }
  flag()     { [523,659,784,1047].forEach((f,i) => setTimeout(() => this._tone(f, 0.15, 'square', 0.22), i*100)); }
  levelUp()  { [400,500,600,800].forEach((f,i) => setTimeout(() => this._tone(f, 0.12, 'square', 0.2), i*80)); }
}

// LEVELS, PLAYER_COLORS, PLAYER_COLOR_NAMES come from levels.js (loaded before
// this script in index.html) and are also require()d by server.js.

// ── Scene ─────────────────────────────────────────────────────────────────────

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.socket             = null;
    this.selfData           = null;
    this.localPlayer        = null;
    this.localLabel         = null;
    this.facing             = 1;
    this.score              = 0;
    this.powered            = false;
    this.invincible         = false;
    this.flagReached        = false;
    this.currentLevel       = 0;
    this.walkFrame          = 0;
    this.walkTimer          = 0;
    this.remoteSprites      = new Map();
    this.remoteScores       = new Map();
    this.platformGroup      = null;
    this.goombas            = null;
    this.aliveGoombas       = new Map();
    this.coinGroup          = null;
    this.coinSprites        = new Map();
    this.mushroomGroup      = null;
    this.mushroomSprites    = new Map();
    this.flagGraphics       = null;
    this.flagZone           = null;
    this.levelColliders     = [];
    this.deadGoombaIds      = new Set();
    this.collectedCoinIds   = new Set();
    this.collectedMushroomIds = new Set();
    this.cursors            = null;
    this.spaceKey           = null;
    this.sendAccumulator    = 0;
    this.scoreText          = null;
    this.leaderboardText    = null;
    this.levelText          = null;
    this.bannerText         = null;
    // Renamed from `this.sound` — Phaser.Scene already has a `sound` property
    // (the SoundManager plugin) and overwriting it is fragile.
    this.sfx                = null;
  }

  create() {
    this.sfx = new SoundManager();
    this._generateTextures();
    this._setupInput();
    this._setupHUD();
    this._setupSocket();
  }

  // ── Texture generation ────────────────────────────────────────────────────

  _generateTextures() {
    for (const [num, color] of Object.entries(PLAYER_COLORS)) {
      ['idle','walk0','walk1','jump'].forEach(frame => {
        const g = this.add.graphics();
        this._drawMarioFrame(g, color, frame);
        g.generateTexture(`player_${num}_${frame}`, 32, 48);
        g.destroy();
      });
    }

    const gg = this.add.graphics();
    this._drawGoomba(gg);
    gg.generateTexture('goomba', 24, 24);
    gg.destroy();

    const cg = this.add.graphics();
    this._drawCoin(cg);
    cg.generateTexture('coin', 16, 16);
    cg.destroy();

    const mg = this.add.graphics();
    this._drawMushroom(mg);
    mg.generateTexture('mushroom', 24, 24);
    mg.destroy();
  }

  _drawMarioBase(g, color) {
    g.fillStyle(0xCC0000); g.fillRect(8,  0, 16,  7);   // hat top
    g.fillStyle(0xFF2222); g.fillRect(4,  5, 24,  5);   // hat brim
    g.fillStyle(0xFFCC99); g.fillRect(6, 10, 20, 12);   // face
    g.fillStyle(0x000000);
    g.fillRect(9, 13, 4, 4); g.fillRect(19,13, 4, 4);  // eyes
    g.fillStyle(0x553300); g.fillRect(7, 19, 18,  4);   // mustache
    g.fillStyle(color);
    g.fillRect(10, 22, 12, 15);                          // overalls bib
    g.fillRect(4,  33, 24,  8);                          // overalls lower
  }

  _drawMarioFrame(g, color, frame) {
    this._drawMarioBase(g, color);
    if (frame === 'jump') {
      // Arms up
      g.fillStyle(0xFF2222); g.fillRect(0, 20, 8, 9); g.fillRect(24,20, 8, 9);
      // Legs tucked
      g.fillStyle(0x8B4513);
      g.fillRect(4,  38, 11, 10);
      g.fillRect(17, 38, 11, 10);
    } else if (frame === 'walk0') {
      // Right leg forward
      g.fillStyle(0xFF2222); g.fillRect(0, 24, 8, 9); g.fillRect(24,24, 8, 9);
      g.fillStyle(0x8B4513);
      g.fillRect(2,  42, 13,  6);   // left shoe back
      g.fillRect(17, 37, 13, 11);   // right shoe forward
    } else if (frame === 'walk1') {
      // Left leg forward
      g.fillStyle(0xFF2222); g.fillRect(0, 24, 8, 9); g.fillRect(24,24, 8, 9);
      g.fillStyle(0x8B4513);
      g.fillRect(2,  37, 13, 11);   // left shoe forward
      g.fillRect(17, 42, 13,  6);   // right shoe back
    } else {
      // Idle
      g.fillStyle(0xFF2222); g.fillRect(0, 24, 8, 9); g.fillRect(24,24, 8, 9);
      g.fillStyle(0x8B4513);
      g.fillRect(2,  40, 13,  8);
      g.fillRect(17, 40, 13,  8);
    }
  }

  _drawGoomba(g) {
    g.fillStyle(0xAA6633); g.fillRect(2, 10, 20, 14);
    g.fillStyle(0x7A3B1E); g.fillRect(0,  0, 24, 13);
    g.fillStyle(0xFFFFFF); g.fillRect(2, 2, 8, 8); g.fillRect(14,2, 8, 8);
    g.fillStyle(0x000000); g.fillRect(2, 4, 5, 5); g.fillRect(17,4, 5, 5);
    g.fillStyle(0x3A1A00); g.fillRect(2, 1, 8, 2); g.fillRect(14,1, 8, 2);
    g.fillStyle(0x4A1A00); g.fillRect(1, 20, 9, 4); g.fillRect(14,20, 9, 4);
  }

  _drawCoin(g) {
    g.fillStyle(0xFFD700); g.fillCircle(8, 8, 7);
    g.fillStyle(0xFFFF88); g.fillCircle(6, 5, 3);
    g.fillStyle(0xFFAA00); g.fillCircle(10,11, 2);
  }

  _drawMushroom(g) {
    g.fillStyle(0xFF3333); g.fillCircle(12, 9, 11);   // red cap
    g.fillStyle(0xFFFFFF);
    g.fillCircle(6, 6, 3); g.fillCircle(18, 6, 3); g.fillCircle(12, 2, 2); // dots
    g.fillStyle(0xFFEECC); g.fillRect(6, 14, 12, 10); // stem
    g.fillStyle(0x000000);
    g.fillRect(8, 16, 3, 3); g.fillRect(13,16, 3, 3); // eyes
  }

  // ── Level loading ─────────────────────────────────────────────────────────

  _loadLevel(index) {
    this._destroyLevelObjects();
    this.currentLevel = index;
    const lvl = LEVELS[index];
    this.cameras.main.setBackgroundColor(lvl.background);

    // Platforms
    this.platformGroup = this.physics.add.staticGroup();
    for (const p of lvl.platforms) {
      const color = (p.h >= 35) ? lvl.groundColor : lvl.platformColor;
      this.platformGroup.add(
        this.add.rectangle(p.x + p.w/2, p.y + p.h/2, p.w, p.h, color)
      );
    }
    this.platformGroup.refresh();

    // Goombas
    this.goombas = this.physics.add.group();
    for (const def of lvl.goombas) {
      if (this.deadGoombaIds.has(def.id)) continue;
      const g = this.goombas.create(def.x, def.y, 'goomba');
      g.setOrigin(0.5, 0.5); g.goombaDef = def; g.direction = 1;
      g.body.setCollideWorldBounds(true);
      this.aliveGoombas.set(def.id, g);
    }
    this.levelColliders.push(this.physics.add.collider(this.goombas, this.platformGroup));

    // Coins
    this.coinGroup = this.physics.add.staticGroup();
    for (const pos of lvl.coins) {
      if (this.collectedCoinIds.has(pos.id)) continue;
      const c = this.coinGroup.create(pos.x, pos.y, 'coin');
      c.setOrigin(0.5, 0.5); c.coinId = pos.id;
      this.coinSprites.set(pos.id, c);
    }
    this.coinGroup.refresh();

    // Mushrooms
    this.mushroomGroup = this.physics.add.staticGroup();
    for (const pos of (lvl.mushrooms || [])) {
      if (this.collectedMushroomIds.has(pos.id)) continue;
      const m = this.mushroomGroup.create(pos.x, pos.y, 'mushroom');
      m.setOrigin(0.5, 0.5); m.mushroomId = pos.id;
      this.mushroomSprites.set(pos.id, m);
    }
    this.mushroomGroup.refresh();

    // Flag
    const { flag } = lvl;
    this.flagGraphics = this.add.graphics();
    this.flagGraphics.fillStyle(0xC0C0C0); this.flagGraphics.fillRect(flag.x-3, flag.y-120, 6, 120);
    this.flagGraphics.fillStyle(0x00CC00); this.flagGraphics.fillRect(flag.x+3,  flag.y-118, 22, 16);
    this.flagZone = this.add.zone(flag.x, flag.y-60, 28, 120);
    this.physics.add.existing(this.flagZone, true);

    // Level name
    if (this.levelText) this.levelText.destroy();
    this.levelText = this.add.text(16, 46, lvl.name, {
      fontSize: '16px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setDepth(10);
  }

  _destroyLevelObjects() {
    for (const c of this.levelColliders) { if (c) c.destroy(); }
    this.levelColliders = [];
    if (this.platformGroup)  { this.platformGroup.clear(true,true);  this.platformGroup.destroy();  this.platformGroup = null; }
    if (this.goombas)        { this.goombas.clear(true,true);        this.goombas.destroy();        this.goombas = null; }
    this.aliveGoombas.clear();
    if (this.coinGroup)      { this.coinGroup.clear(true,true);      this.coinGroup.destroy();      this.coinGroup = null; }
    this.coinSprites.clear();
    if (this.mushroomGroup)  { this.mushroomGroup.clear(true,true);  this.mushroomGroup.destroy();  this.mushroomGroup = null; }
    this.mushroomSprites.clear();
    if (this.flagGraphics)   { this.flagGraphics.destroy();   this.flagGraphics = null; }
    if (this.flagZone)       { this.flagZone.destroy();       this.flagZone = null; }
  }

  _addPlayerColliders() {
    this.levelColliders.push(
      this.physics.add.collider(this.localPlayer, this.platformGroup),
      this.physics.add.overlap(this.localPlayer, this.goombas,      this._onGoombaOverlap,   null, this),
      this.physics.add.overlap(this.localPlayer, this.coinGroup,    (_p, c) => this._collectCoin(c)),
      this.physics.add.overlap(this.localPlayer, this.mushroomGroup,(_p, m) => this._collectMushroom(m)),
      this.physics.add.overlap(this.localPlayer, this.flagZone, () => {
        if (!this.flagReached) {
          this.flagReached = true;
          this.sfx.flag();
          this.socket.emit('flag_reached');
        }
      })
    );
  }

  // ── Input & HUD ───────────────────────────────────────────────────────────

  _setupInput() {
    this.cursors  = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  _setupHUD() {
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 4
    }).setDepth(10);

    this.leaderboardText = this.add.text(944, 16, '', {
      fontSize: '14px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 3,
      align: 'right'
    }).setOrigin(1, 0).setDepth(10);
  }

  // Display-only — safe to call from remote score updates without re-broadcasting.
  _refreshScoreDisplay() {
    this.scoreText.setText(`Score: ${this.score}`);
    const entries = [{ pn: this.selfData.playerNumber, score: this.score }];
    for (const [pn, s] of this.remoteScores) entries.push({ pn, score: s });
    entries.sort((a, b) => b.score - a.score);
    this.leaderboardText.setText(entries.map(e => `P${e.pn}: ${e.score}`).join('\n'));
  }

  // Call only when the local score actually changes.
  _onLocalScoreChanged() {
    this._refreshScoreDisplay();
    this.socket.emit('score_update', { score: this.score });
  }

  _showBanner(text, color = '#FFD700') {
    if (this.bannerText) this.bannerText.destroy();
    this.bannerText = this.add.text(480, 270, text, {
      fontSize: '52px', fontFamily: 'monospace',
      color, stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5, 0.5).setDepth(100).setAlpha(0);
    this.tweens.add({
      targets: this.bannerText, alpha: 1, duration: 300,
      onComplete: () => this.time.delayedCall(1800, () =>
        this.tweens.add({ targets: this.bannerText, alpha: 0, duration: 400 })
      )
    });
  }

  // ── Socket ────────────────────────────────────────────────────────────────

  _setupSocket() {
    this.socket = io();

    this.socket.on('init', ({ self, existingPlayers, currentLevel, deadGoombas, collectedCoins, collectedMushrooms }) => {
      this.selfData             = self;
      this.deadGoombaIds        = new Set(deadGoombas       || []);
      this.collectedCoinIds     = new Set(collectedCoins    || []);
      this.collectedMushroomIds = new Set(collectedMushrooms|| []);

      document.getElementById('status').textContent =
        `Player ${self.playerNumber} (${PLAYER_COLOR_NAMES[self.playerNumber]}) — Arrows · Up/Space jump · Reach the flag!`;

      // Clear any stale remote sprites from a previous connection
      for (const [, r] of this.remoteSprites) { r.sprite.destroy(); r.label.destroy(); }
      this.remoteSprites.clear();
      this.remoteScores.clear();

      this._loadLevel(currentLevel || 0);
      this.spawnLocalPlayer(self);
      for (const p of existingPlayers) {
        this.spawnRemotePlayer(p);
        this.remoteScores.set(p.playerNumber, p.score || 0);
      }
      this._onLocalScoreChanged();
    });

    this.socket.on('player_joined', p => {
      this.spawnRemotePlayer(p);
      this.remoteScores.set(p.playerNumber, 0);
      this._refreshScoreDisplay();
    });

    this.socket.on('player_moved', ({ id, x, y, velocityX, velocityY, facing, powered, animFrame }) => {
      const r = this.remoteSprites.get(id);
      if (!r) return;
      r.targetX     = x;
      r.targetY     = y;
      r.velocityX   = velocityX || 0;
      r.velocityY   = velocityY || 0;
      r.facing      = facing;
      r.powered     = !!powered;
      r.animFrame   = animFrame || 'idle';
    });

    this.socket.on('player_left', ({ id }) => {
      const r = this.remoteSprites.get(id);
      if (!r) return;
      // Clear leaderboard entry so a reused slot doesn't inherit the old score.
      this.remoteScores.delete(r.playerNumber);
      r.sprite.destroy(); r.label.destroy();
      this.remoteSprites.delete(id);
      this._refreshScoreDisplay();
    });

    this.socket.on('score_updated', ({ playerNumber, score }) => {
      this.remoteScores.set(playerNumber, score);
      this._refreshScoreDisplay();
    });

    this.socket.on('goomba_killed',    ({ id }) => this._killGoomba(id));

    this.socket.on('coin_collected',   ({ id }) => {
      const c = this.coinSprites.get(id);
      if (c) { c.destroy(); this.coinSprites.delete(id); }
    });

    this.socket.on('mushroom_collected', ({ id }) => {
      const m = this.mushroomSprites.get(id);
      if (m) { m.destroy(); this.mushroomSprites.delete(id); }
    });

    this.socket.on('level_change', ({ level }) => {
      this._showBanner(LEVELS[level].name);
      this.sfx.levelUp();
      this.deadGoombaIds = new Set(); this.collectedCoinIds = new Set(); this.collectedMushroomIds = new Set();
      this.flagReached = false; this.powered = false;
      this._loadLevel(level);
      if (this.localPlayer) {
        this.localPlayer.setScale(1.0);
        this.localPlayer.setPosition(this.selfData.x, LEVELS[level].spawnY);
        this.localPlayer.body.setVelocity(0, 0);
        this._addPlayerColliders();
      }
    });

    this.socket.on('game_won', () => {
      this.add.rectangle(480, 270, 960, 540, 0x000000, 0.75).setDepth(98);
      this.add.text(480, 220, 'YOU WIN!', {
        fontSize: '64px', fontFamily: 'monospace',
        color: '#FFD700', stroke: '#000000', strokeThickness: 6
      }).setOrigin(0.5).setDepth(99);
      this.add.text(480, 305, `Score: ${this.score}`, {
        fontSize: '32px', fontFamily: 'monospace',
        color: '#ffffff', stroke: '#000000', strokeThickness: 4
      }).setOrigin(0.5).setDepth(99);
      this.add.text(480, 360, 'Refresh to play again', {
        fontSize: '18px', fontFamily: 'monospace', color: '#aaaaaa'
      }).setOrigin(0.5).setDepth(99);
    });

    this.socket.on('server_full',   () => { document.getElementById('status').textContent = 'Server full — max 4 players'; });
    this.socket.on('connect_error', () => { document.getElementById('status').textContent = 'Connection error — is the server running?'; });
  }

  // ── Player spawning ───────────────────────────────────────────────────────

  _playerTextureKey() {
    return `player_${this.selfData.playerNumber}_idle`;
  }

  spawnLocalPlayer(self) {
    // Destroy previous instance — happens on socket reconnect when init fires again
    if (this.localPlayer) { this.localPlayer.destroy(); this.localPlayer = null; }
    if (this.localLabel)  { this.localLabel.destroy();  this.localLabel = null; }

    const lvl = LEVELS[this.currentLevel];
    this.localPlayer = this.physics.add.sprite(self.x, lvl.spawnY, `player_${self.playerNumber}_idle`);
    this.localPlayer.setOrigin(0.5, 0.5);
    this.localPlayer.body.setCollideWorldBounds(true);
    this.localPlayer.body.setMaxVelocityX(300);
    this._addPlayerColliders();

    this.localLabel = this.add.text(self.x, lvl.spawnY - 32, 'YOU', {
      fontSize: '11px', fontFamily: 'monospace',
      color: '#ffff00', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(3);
  }

  spawnRemotePlayer(p) {
    // Destroy existing sprite for this socket ID if present (guards against duplicate spawns)
    const existing = this.remoteSprites.get(p.id);
    if (existing) { existing.sprite.destroy(); existing.label.destroy(); }

    const sprite = this.add.sprite(p.x, p.y, `player_${p.playerNumber}_idle`);
    sprite.setOrigin(0.5, 0.5).setAlpha(0.85).setDepth(2);
    const label = this.add.text(p.x, p.y - 32, `P${p.playerNumber}`, {
      fontSize: '11px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(3);
    this.remoteSprites.set(p.id, {
      sprite, label,
      playerNumber: p.playerNumber,
      targetX: p.x, targetY: p.y,
      velocityX: 0, velocityY: 0,
      facing: p.facing || 1,
      powered: false,
      animFrame: 'idle',
    });
  }

  // ── Game mechanics ────────────────────────────────────────────────────────

  _onGoombaOverlap(player, goomba) {
    if (this.invincible) return;
    const stompingDown = player.body.velocity.y > 50;
    const aboveCenter  = player.body.bottom <= goomba.body.center.y + 4;
    if (stompingDown && aboveCenter) {
      this._killGoomba(goomba.goombaDef.id);
      player.body.setVelocityY(-420);
      this.score += 100;
      this._onLocalScoreChanged();
      this.sfx.stomp();
      this.socket.emit('goomba_killed', { id: goomba.goombaDef.id });
    } else {
      if (this.powered) {
        this._losePower();
      } else {
        this._respawn();
      }
    }
  }

  _killGoomba(id) {
    const g = this.aliveGoombas.get(id);
    if (!g) return;
    g.destroy(); this.aliveGoombas.delete(id);
  }

  _collectCoin(coin) {
    const id = coin.coinId;
    if (!this.coinSprites.has(id)) return;
    coin.destroy(); this.coinSprites.delete(id);
    this.score += 200;
    this._onLocalScoreChanged();
    this.sfx.coin();
    this.socket.emit('coin_collected', { id });
  }

  _collectMushroom(mushroom) {
    const id = mushroom.mushroomId;
    if (!this.mushroomSprites.has(id)) return;
    mushroom.destroy(); this.mushroomSprites.delete(id);
    this.powered = true;
    this.localPlayer.setScale(1.5);
    this.score += 500;
    this._onLocalScoreChanged();
    this.sfx.mushroom();
    this.socket.emit('mushroom_collected', { id });
  }

  _losePower() {
    this.powered = false;
    this.localPlayer.setScale(1.0);
    this._startInvincibility(1500);
    this.sfx.die();
  }

  _respawn() {
    if (this.invincible) return;
    this.powered = false;
    this.localPlayer.setScale(1.0);
    this.localPlayer.setPosition(this.selfData.x, LEVELS[this.currentLevel].spawnY);
    this.localPlayer.body.setVelocity(0, 0);
    this.sfx.die();
    this._startInvincibility(2000);
  }

  _startInvincibility(duration) {
    this.invincible = true;
    this.tweens.add({
      targets: this.localPlayer, alpha: 0, yoyo: true, repeat: Math.floor(duration / 200 - 1), duration: 200,
      onComplete: () => { this.localPlayer.setAlpha(1); this.invincible = false; }
    });
  }

  // ── Update ────────────────────────────────────────────────────────────────

  update(_time, delta) {
    if (!this.localPlayer) return;

    const body     = this.localPlayer.body;
    const onGround = body.blocked.down;
    const pn       = this.selfData.playerNumber;

    // Input
    const movingLeft  = this.cursors.left.isDown;
    const movingRight = this.cursors.right.isDown;

    if (movingLeft)       { body.setVelocityX(-220); this.facing = -1; }
    else if (movingRight) { body.setVelocityX(220);  this.facing = 1;  }
    else                  { body.setVelocityX(0); }

    if ((this.cursors.up.isDown || this.spaceKey.isDown) && onGround) {
      body.setVelocityY(-560);
      this.sfx.jump();
    }

    this.localPlayer.setFlipX(this.facing < 0);

    // Animation state
    const moving = Math.abs(body.velocity.x) > 10;
    let animFrame;
    if (!onGround) {
      animFrame = 'jump';
    } else if (moving) {
      this.walkTimer += delta;
      if (this.walkTimer >= 100) { this.walkTimer = 0; this.walkFrame = 1 - this.walkFrame; }
      animFrame = `walk${this.walkFrame}`;
    } else {
      this.walkTimer = 0; this.walkFrame = 0;
      animFrame = 'idle';
    }
    this.localPlayer.setTexture(`player_${pn}_${animFrame}`);

    this.localLabel.setPosition(this.localPlayer.x, this.localPlayer.y - (this.powered ? 42 : 32));

    // Fall death
    if (this.localPlayer.y > 570) this._respawn();

    // Goomba AI
    for (const [, goomba] of this.aliveGoombas) {
      const def = goomba.goombaDef;
      if (goomba.x <= def.minX) goomba.direction = 1;
      if (goomba.x >= def.maxX) goomba.direction = -1;
      goomba.body.setVelocityX(def.speed * goomba.direction);
      goomba.setFlipX(goomba.direction < 0);
    }

    // Remote players: interpolate toward last reported position and pick anim frame
    // from the synced state. Lerp factor tuned for 20 Hz updates over a 60 Hz tick.
    const lerp = Math.min(1, delta / 80);
    for (const [, r] of this.remoteSprites) {
      const sx = r.sprite.x + (r.targetX - r.sprite.x) * lerp;
      const sy = r.sprite.y + (r.targetY - r.sprite.y) * lerp;
      r.sprite.setPosition(sx, sy);
      r.sprite.setFlipX(r.facing < 0);
      r.sprite.setScale(r.powered ? 1.5 : 1.0);
      r.sprite.setTexture(`player_${r.playerNumber}_${r.animFrame}`);
      r.label.setPosition(sx, sy - (r.powered ? 42 : 36));
    }

    // Network sync (20/s) — subtract the interval so leftover ms carry to the next tick.
    this.sendAccumulator += delta;
    if (this.sendAccumulator >= 50) {
      this.sendAccumulator -= 50;
      this.socket.emit('position_update', {
        x: this.localPlayer.x, y: this.localPlayer.y,
        velocityX: body.velocity.x, velocityY: body.velocity.y,
        facing: this.facing, powered: this.powered,
        animFrame,
      });
    }
  }
}

// ── Phaser config ─────────────────────────────────────────────────────────────

const config = {
  type: Phaser.AUTO,
  width: 960, height: 540,
  backgroundColor: '#5c94fc',
  parent: 'game-container',
  physics: { default: 'arcade', arcade: { gravity: { y: 800 }, debug: false } },
  scene: GameScene
};

new Phaser.Game(config);
