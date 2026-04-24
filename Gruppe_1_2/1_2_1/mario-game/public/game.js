const LEVEL_PLATFORMS = [
  { x: 0,   y: 500, width: 960, height: 40 },
  { x: 100, y: 380, width: 200, height: 20 },
  { x: 380, y: 300, width: 200, height: 20 },
  { x: 660, y: 380, width: 200, height: 20 },
  { x: 200, y: 220, width: 150, height: 20 },
  { x: 620, y: 220, width: 150, height: 20 },
  { x: 380, y: 150, width: 200, height: 20 },
];

const PLAYER_COLORS = { 1: 0xe74c3c, 2: 0x3498db, 3: 0x2ecc71, 4: 0xf39c12 };
const PLAYER_COLOR_NAMES = { 1: 'Red', 2: 'Blue', 3: 'Green', 4: 'Orange' };

const GOOMBA_DEFS = [
  { id: 0, x: 200, y: 480, minX: 50,  maxX: 350, speed: 80 },
  { id: 1, x: 480, y: 480, minX: 380, maxX: 580, speed: 80 },
  { id: 2, x: 760, y: 480, minX: 660, maxX: 910, speed: 80 },
  { id: 3, x: 160, y: 360, minX: 100, maxX: 280, speed: 60 },
  { id: 4, x: 730, y: 360, minX: 660, maxX: 840, speed: 60 },
];

const COIN_POSITIONS = [
  { id:  0, x: 150, y: 472 }, { id:  1, x: 190, y: 472 }, { id:  2, x: 230, y: 472 },
  { id:  3, x: 700, y: 472 }, { id:  4, x: 740, y: 472 }, { id:  5, x: 780, y: 472 },
  { id:  6, x: 140, y: 358 }, { id:  7, x: 180, y: 358 }, { id:  8, x: 220, y: 358 },
  { id:  9, x: 440, y: 278 }, { id: 10, x: 480, y: 278 }, { id: 11, x: 520, y: 278 },
  { id: 12, x: 700, y: 358 }, { id: 13, x: 740, y: 358 }, { id: 14, x: 770, y: 358 },
  { id: 15, x: 240, y: 198 }, { id: 16, x: 280, y: 198 },
  { id: 17, x: 650, y: 198 }, { id: 18, x: 690, y: 198 },
  { id: 19, x: 440, y: 128 }, { id: 20, x: 480, y: 128 }, { id: 21, x: 520, y: 128 },
];

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.socket        = null;
    this.selfData      = null;
    this.localPlayer   = null;
    this.localLabel    = null;
    this.facing        = 1;
    this.score         = 0;
    this.invincible    = false;
    this.remoteSprites = new Map();
    this.platformGroup = null;
    this.goombas       = null;
    this.aliveGoombas  = new Map();
    this.coinGroup     = null;
    this.coinSprites   = new Map();
    this.deadGoombaIds    = new Set();
    this.collectedCoinIds = new Set();
    this.cursors       = null;
    this.spaceKey      = null;
    this.sendAccumulator = 0;
    this.scoreText     = null;
  }

  preload() {}

  create() {
    this._generateTextures();
    this._buildPlatforms();
    this._setupInput();
    this._setupHUD();
    this._setupSocket();
  }

  // ── Texture generation ──────────────────────────────────────────────────────

  _generateTextures() {
    for (const [num, color] of Object.entries(PLAYER_COLORS)) {
      const g = this.add.graphics();
      this._drawMario(g, color);
      g.generateTexture(`player_${num}`, 32, 48);
      g.destroy();
    }

    const gg = this.add.graphics();
    this._drawGoomba(gg);
    gg.generateTexture('goomba', 24, 24);
    gg.destroy();

    const cg = this.add.graphics();
    this._drawCoin(cg);
    cg.generateTexture('coin', 16, 16);
    cg.destroy();
  }

  _drawMario(g, overallsColor) {
    g.fillStyle(0xCC0000); g.fillRect(8,  0, 16,  7);  // hat top
    g.fillStyle(0xFF2222); g.fillRect(4,  5, 24,  5);  // hat brim
    g.fillStyle(0xFFCC99); g.fillRect(6, 10, 20, 12);  // face
    g.fillStyle(0x000000);
    g.fillRect(9,  13,  4, 4);                          // left eye
    g.fillRect(19, 13,  4, 4);                          // right eye
    g.fillStyle(0x553300); g.fillRect(7, 19, 18,  4);  // mustache
    g.fillStyle(0xFF2222); g.fillRect(0, 24,  8,  9);  // left arm
    g.fillStyle(0xFF2222); g.fillRect(24,24,  8,  9);  // right arm
    g.fillStyle(overallsColor);
    g.fillRect(10, 22, 12, 15);                         // overalls bib
    g.fillRect(4,  33, 24,  8);                         // overalls lower
    g.fillStyle(0x8B4513);
    g.fillRect(2,  40, 13,  8);                         // left shoe
    g.fillRect(17, 40, 13,  8);                         // right shoe
  }

  _drawGoomba(g) {
    g.fillStyle(0xAA6633); g.fillRect(2, 10, 20, 14);  // body
    g.fillStyle(0x7A3B1E); g.fillRect(0,  0, 24, 13);  // head
    g.fillStyle(0xFFFFFF);
    g.fillRect(2, 2, 8, 8);                             // left eye white
    g.fillRect(14,2, 8, 8);                             // right eye white
    g.fillStyle(0x000000);
    g.fillRect(2, 4, 5, 5);                             // left pupil (inward)
    g.fillRect(17,4, 5, 5);                             // right pupil (inward)
    g.fillStyle(0x3A1A00);
    g.fillRect(2, 1, 8, 2);                             // left brow
    g.fillRect(14,1, 8, 2);                             // right brow
    g.fillStyle(0x4A1A00);
    g.fillRect(1, 20, 9, 4);                            // left foot
    g.fillRect(14,20, 9, 4);                            // right foot
  }

  _drawCoin(g) {
    g.fillStyle(0xFFD700); g.fillCircle(8, 8, 7);
    g.fillStyle(0xFFFF88); g.fillCircle(6, 5, 3);
    g.fillStyle(0xFFAA00); g.fillCircle(10,11, 2);
  }

  // ── Level building ──────────────────────────────────────────────────────────

  _buildPlatforms() {
    this.platformGroup = this.physics.add.staticGroup();
    for (const p of LEVEL_PLATFORMS) {
      const color = p.height === 40 ? 0x3a7d44 : 0x8B4513;
      const rect = this.add.rectangle(
        p.x + p.width / 2, p.y + p.height / 2,
        p.width, p.height, color
      );
      this.platformGroup.add(rect);
    }
    this.platformGroup.refresh();
  }

  _buildGoombas() {
    this.goombas = this.physics.add.group();
    for (const def of GOOMBA_DEFS) {
      if (this.deadGoombaIds.has(def.id)) continue;
      const g = this.goombas.create(def.x, def.y, 'goomba');
      g.setOrigin(0.5, 0.5);
      g.goombaDef = def;
      g.direction = 1;
      g.body.setCollideWorldBounds(true);
      this.aliveGoombas.set(def.id, g);
    }
    this.physics.add.collider(this.goombas, this.platformGroup);
  }

  _buildCoins() {
    this.coinGroup = this.physics.add.staticGroup();
    for (const pos of COIN_POSITIONS) {
      if (this.collectedCoinIds.has(pos.id)) continue;
      const c = this.coinGroup.create(pos.x, pos.y, 'coin');
      c.setOrigin(0.5, 0.5);
      c.coinId = pos.id;
      this.coinSprites.set(pos.id, c);
    }
    this.coinGroup.refresh();
  }

  // ── Input & HUD ─────────────────────────────────────────────────────────────

  _setupInput() {
    this.cursors  = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  _setupHUD() {
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 4
    }).setDepth(10);
  }

  // ── Socket ──────────────────────────────────────────────────────────────────

  _setupSocket() {
    this.socket = io();

    this.socket.on('init', ({ self, existingPlayers, deadGoombas, collectedCoins }) => {
      this.selfData         = self;
      this.deadGoombaIds    = new Set(deadGoombas   || []);
      this.collectedCoinIds = new Set(collectedCoins || []);

      document.getElementById('status').textContent =
        `Player ${self.playerNumber} (${PLAYER_COLOR_NAMES[self.playerNumber]}) — Arrows to move · Up/Space to jump · Stomp Goombas!`;

      this._buildGoombas();
      this._buildCoins();
      this.spawnLocalPlayer(self);
      for (const p of existingPlayers) this.spawnRemotePlayer(p);
    });

    this.socket.on('player_joined', p => this.spawnRemotePlayer(p));

    this.socket.on('player_moved', ({ id, x, y, facing }) => {
      const r = this.remoteSprites.get(id);
      if (!r) return;
      r.sprite.setPosition(x, y);
      r.sprite.setFlipX(facing < 0);
      r.label.setPosition(x, y - 30);
    });

    this.socket.on('player_left', ({ id }) => {
      const r = this.remoteSprites.get(id);
      if (!r) return;
      r.sprite.destroy();
      r.label.destroy();
      this.remoteSprites.delete(id);
    });

    this.socket.on('goomba_killed', ({ id }) => this._killGoomba(id));

    this.socket.on('coin_collected', ({ id }) => {
      const coin = this.coinSprites.get(id);
      if (coin) { coin.destroy(); this.coinSprites.delete(id); }
    });

    this.socket.on('server_full', () => {
      document.getElementById('status').textContent = 'Server full — max 4 players';
    });

    this.socket.on('connect_error', () => {
      document.getElementById('status').textContent = 'Connection error — is the server running?';
    });
  }

  // ── Player spawning ─────────────────────────────────────────────────────────

  spawnLocalPlayer(self) {
    this.localPlayer = this.physics.add.sprite(self.x, self.y, `player_${self.playerNumber}`);
    this.localPlayer.setOrigin(0.5, 0.5);
    this.localPlayer.body.setCollideWorldBounds(true);
    this.localPlayer.body.setMaxVelocityX(300);
    this.physics.add.collider(this.localPlayer, this.platformGroup);
    this.physics.add.overlap(this.localPlayer, this.goombas, this._onGoombaOverlap, null, this);
    this.physics.add.overlap(this.localPlayer, this.coinGroup, (_p, coin) => this._collectCoin(coin));

    this.localLabel = this.add.text(self.x, self.y - 30, 'YOU', {
      fontSize: '11px', fontFamily: 'monospace',
      color: '#ffff00', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(3);
  }

  spawnRemotePlayer(p) {
    const sprite = this.add.sprite(p.x, p.y, `player_${p.playerNumber}`);
    sprite.setOrigin(0.5, 0.5).setAlpha(0.85).setDepth(2);
    const label = this.add.text(p.x, p.y - 30, `P${p.playerNumber}`, {
      fontSize: '11px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(3);
    this.remoteSprites.set(p.id, { sprite, label });
  }

  // ── Game mechanics ──────────────────────────────────────────────────────────

  _onGoombaOverlap(player, goomba) {
    if (this.invincible) return;
    const stompingDown = player.body.velocity.y > 50;
    const aboveCenter  = player.body.bottom <= goomba.body.center.y + 4;
    if (stompingDown && aboveCenter) {
      this._killGoomba(goomba.goombaDef.id);
      player.body.setVelocityY(-420);
      this.score += 100;
      this.scoreText.setText(`Score: ${this.score}`);
      this.socket.emit('goomba_killed', { id: goomba.goombaDef.id });
    } else {
      this._respawn();
    }
  }

  _killGoomba(id) {
    const g = this.aliveGoombas.get(id);
    if (!g) return;
    g.destroy();
    this.aliveGoombas.delete(id);
  }

  _collectCoin(coin) {
    const id = coin.coinId;
    if (!this.coinSprites.has(id)) return;
    coin.destroy();
    this.coinSprites.delete(id);
    this.score += 200;
    this.scoreText.setText(`Score: ${this.score}`);
    this.socket.emit('coin_collected', { id });
  }

  _respawn() {
    if (this.invincible) return;
    this.invincible = true;
    this.localPlayer.setPosition(this.selfData.x, this.selfData.y);
    this.localPlayer.body.setVelocity(0, 0);
    this.tweens.add({
      targets: this.localPlayer,
      alpha: 0,
      yoyo: true,
      repeat: 4,
      duration: 200,
      onComplete: () => {
        this.localPlayer.setAlpha(1);
        this.invincible = false;
      }
    });
  }

  // ── Update loop ─────────────────────────────────────────────────────────────

  update(_time, delta) {
    if (!this.localPlayer) return;

    const body     = this.localPlayer.body;
    const onGround = body.blocked.down;

    // Movement
    if (this.cursors.left.isDown) {
      body.setVelocityX(-220);
      this.facing = -1;
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(220);
      this.facing = 1;
    } else {
      body.setVelocityX(0);
    }

    if ((this.cursors.up.isDown || this.spaceKey.isDown) && onGround) {
      body.setVelocityY(-560);
    }

    this.localPlayer.setFlipX(this.facing < 0);
    this.localLabel.setPosition(this.localPlayer.x, this.localPlayer.y - 30);

    // Fall off screen
    if (this.localPlayer.y > 570) this._respawn();

    // Goomba AI (deterministic on all clients)
    for (const [, goomba] of this.aliveGoombas) {
      const def = goomba.goombaDef;
      if (goomba.x <= def.minX) goomba.direction = 1;
      if (goomba.x >= def.maxX) goomba.direction = -1;
      goomba.body.setVelocityX(def.speed * goomba.direction);
      goomba.setFlipX(goomba.direction < 0);
    }

    // Network send (throttled to 20/s)
    this.sendAccumulator += delta;
    if (this.sendAccumulator >= 50) {
      this.sendAccumulator = 0;
      this.socket.emit('position_update', {
        x: this.localPlayer.x,
        y: this.localPlayer.y,
        velocityX: body.velocity.x,
        velocityY: body.velocity.y,
        facing: this.facing
      });
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#5c94fc',
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 800 }, debug: false }
  },
  scene: GameScene
};

new Phaser.Game(config);
