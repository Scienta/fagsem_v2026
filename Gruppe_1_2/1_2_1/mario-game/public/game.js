// ── Level definitions ────────────────────────────────────────────────────────

const LEVELS = [
  {
    name: 'World 1-1',
    background: '#5c94fc',
    groundColor: 0x3a7d44,
    platformColor: 0x8B4513,
    spawnY: 360,
    platforms: [
      { x: 0,   y: 500, w: 720, h: 40 },
      { x: 820, y: 500, w: 140, h: 40 },
      { x: 100, y: 380, w: 180, h: 20 },
      { x: 380, y: 310, w: 180, h: 20 },
      { x: 640, y: 250, w: 160, h: 20 },
      { x: 820, y: 390, w: 140, h: 20 },
    ],
    goombas: [
      { id: 0, x: 200, y: 480, minX: 20,  maxX: 700, speed: 70 },
      { id: 1, x: 500, y: 480, minX: 20,  maxX: 700, speed: 60 },
      { id: 2, x: 860, y: 480, minX: 825, maxX: 955, speed: 70 },
    ],
    coins: [
      {id:0,x:150,y:358},{id:1,x:200,y:358},{id:2,x:250,y:358},
      {id:3,x:430,y:288},{id:4,x:480,y:288},{id:5,x:530,y:288},
      {id:6,x:670,y:228},{id:7,x:720,y:228},{id:8,x:770,y:228},
      {id:9,x:200,y:472},{id:10,x:400,y:472},{id:11,x:600,y:472},
    ],
    flag: { x: 930, y: 500 },
  },
  {
    name: 'World 1-2',
    background: '#3d6b8a',
    groundColor: 0x4a5568,
    platformColor: 0x2d3748,
    spawnY: 360,
    platforms: [
      { x: 0,   y: 500, w: 280, h: 40 },
      { x: 420, y: 500, w: 220, h: 40 },
      { x: 730, y: 500, w: 230, h: 40 },
      { x: 220, y: 420, w: 120, h: 20 },
      { x: 370, y: 360, w: 130, h: 20 },
      { x: 60,  y: 340, w: 140, h: 20 },
      { x: 250, y: 260, w: 170, h: 20 },
      { x: 480, y: 280, w: 140, h: 20 },
      { x: 660, y: 210, w: 160, h: 20 },
      { x: 820, y: 140, w: 140, h: 20 },
    ],
    goombas: [
      { id: 0, x: 130, y: 480, minX: 10,  maxX: 260, speed: 70 },
      { id: 1, x: 530, y: 480, minX: 425, maxX: 630, speed: 80 },
      { id: 2, x: 800, y: 480, minX: 735, maxX: 950, speed: 70 },
      { id: 3, x: 100, y: 318, minX: 65,  maxX: 185, speed: 65 },
    ],
    coins: [
      {id:0,x:80,y:318},{id:1,x:130,y:318},{id:2,x:170,y:318},
      {id:3,x:390,y:338},{id:4,x:450,y:338},
      {id:5,x:510,y:258},{id:6,x:560,y:258},{id:7,x:600,y:258},
      {id:8,x:700,y:188},{id:9,x:750,y:188},{id:10,x:800,y:188},
      {id:11,x:840,y:118},{id:12,x:890,y:118},
      {id:13,x:150,y:472},{id:14,x:560,y:472},
    ],
    flag: { x: 930, y: 140 },
  },
  {
    name: 'World 1-3',
    background: '#87ceeb',
    groundColor: 0x6db33f,
    platformColor: 0xffffff,
    spawnY: 360,
    platforms: [
      { x: 0,   y: 500, w: 160, h: 40 },
      { x: 140, y: 440, w: 120, h: 20 },
      { x: 300, y: 385, w: 120, h: 20 },
      { x: 460, y: 325, w: 120, h: 20 },
      { x: 620, y: 265, w: 120, h: 20 },
      { x: 790, y: 205, w: 170, h: 20 },
      { x: 240, y: 480, w: 80,  h: 20 },
      { x: 400, y: 440, w: 80,  h: 20 },
      { x: 550, y: 415, w: 80,  h: 20 },
    ],
    goombas: [
      { id: 0, x: 70,  y: 480, minX: 5,   maxX: 145, speed: 70 },
      { id: 1, x: 180, y: 418, minX: 145, maxX: 250, speed: 80 },
      { id: 2, x: 345, y: 363, minX: 305, maxX: 415, speed: 85 },
      { id: 3, x: 510, y: 303, minX: 465, maxX: 575, speed: 90 },
      { id: 4, x: 670, y: 243, minX: 625, maxX: 735, speed: 95 },
    ],
    coins: [
      {id:0,x:170,y:418},{id:1,x:210,y:418},
      {id:2,x:330,y:363},{id:3,x:380,y:363},
      {id:4,x:490,y:303},{id:5,x:540,y:303},
      {id:6,x:650,y:243},{id:7,x:710,y:243},
      {id:8,x:820,y:183},{id:9,x:870,y:183},{id:10,x:920,y:183},
      {id:11,x:70,y:472},{id:12,x:270,y:458},{id:13,x:440,y:418},
    ],
    flag: { x: 930, y: 205 },
  },
  {
    name: 'World 1-4',
    background: '#1a1a2e',
    groundColor: 0x3d2b1f,
    platformColor: 0x5a3e28,
    spawnY: 360,
    platforms: [
      { x: 0,   y: 500, w: 180, h: 40 },
      { x: 320, y: 500, w: 160, h: 40 },
      { x: 650, y: 500, w: 180, h: 40 },
      { x: 120, y: 420, w: 120, h: 20 },
      { x: 280, y: 360, w: 100, h: 20 },
      { x: 150, y: 290, w: 120, h: 20 },
      { x: 330, y: 230, w: 190, h: 20 },
      { x: 540, y: 290, w: 120, h: 20 },
      { x: 420, y: 430, w: 100, h: 20 },
      { x: 570, y: 420, w: 100, h: 20 },
      { x: 690, y: 230, w: 140, h: 20 },
      { x: 830, y: 155, w: 130, h: 20 },
    ],
    goombas: [
      { id: 0, x: 80,  y: 480, minX: 5,   maxX: 170, speed: 85 },
      { id: 1, x: 390, y: 480, minX: 325, maxX: 470, speed: 85 },
      { id: 2, x: 720, y: 480, minX: 655, maxX: 820, speed: 90 },
      { id: 3, x: 310, y: 338, minX: 285, maxX: 370, speed: 75 },
      { id: 4, x: 390, y: 208, minX: 335, maxX: 510, speed: 85 },
      { id: 5, x: 745, y: 208, minX: 695, maxX: 820, speed: 85 },
    ],
    coins: [
      {id:0,x:145,y:398},{id:1,x:195,y:398},
      {id:2,x:300,y:338},{id:3,x:345,y:338},
      {id:4,x:185,y:268},{id:5,x:235,y:268},
      {id:6,x:390,y:208},{id:7,x:450,y:208},{id:8,x:500,y:208},
      {id:9,x:575,y:268},{id:10,x:625,y:268},
      {id:11,x:725,y:208},{id:12,x:780,y:208},
      {id:13,x:855,y:133},{id:14,x:915,y:133},
      {id:15,x:100,y:472},{id:16,x:460,y:408},
    ],
    flag: { x: 920, y: 155 },
  },
  {
    name: 'World 1-5',
    background: '#7f0000',
    groundColor: 0x5a1a1a,
    platformColor: 0x8b0000,
    spawnY: 370,
    platforms: [
      { x: 0,   y: 500, w: 110, h: 40 },
      { x: 150, y: 445, w: 90,  h: 20 },
      { x: 300, y: 390, w: 90,  h: 20 },
      { x: 200, y: 330, w: 90,  h: 20 },
      { x: 360, y: 280, w: 100, h: 20 },
      { x: 500, y: 330, w: 90,  h: 20 },
      { x: 630, y: 270, w: 100, h: 20 },
      { x: 760, y: 330, w: 90,  h: 20 },
      { x: 880, y: 260, w: 80,  h: 20 },
      { x: 690, y: 195, w: 100, h: 20 },
      { x: 550, y: 205, w: 90,  h: 20 },
      { x: 410, y: 185, w: 90,  h: 20 },
      { x: 270, y: 235, w: 90,  h: 20 },
      { x: 790, y: 125, w: 170, h: 20 },
    ],
    goombas: [
      { id: 0, x: 175, y: 423, minX: 155, maxX: 230, speed: 95 },
      { id: 1, x: 325, y: 368, minX: 305, maxX: 380, speed: 95 },
      { id: 2, x: 395, y: 258, minX: 365, maxX: 445, speed: 100 },
      { id: 3, x: 525, y: 308, minX: 505, maxX: 580, speed: 95 },
      { id: 4, x: 655, y: 248, minX: 635, maxX: 720, speed: 100 },
      { id: 5, x: 785, y: 308, minX: 765, maxX: 840, speed: 95 },
      { id: 6, x: 715, y: 173, minX: 695, maxX: 780, speed: 105 },
    ],
    coins: [
      {id:0,x:180,y:423},{id:1,x:325,y:368},
      {id:2,x:225,y:308},{id:3,x:390,y:258},
      {id:4,x:525,y:308},{id:5,x:655,y:248},
      {id:6,x:785,y:308},{id:7,x:905,y:238},
      {id:8,x:715,y:173},{id:9,x:755,y:173},
      {id:10,x:570,y:183},{id:11,x:615,y:183},
      {id:12,x:430,y:163},{id:13,x:475,y:163},
      {id:14,x:820,y:103},{id:15,x:870,y:103},{id:16,x:920,y:103},
    ],
    flag: { x: 930, y: 125 },
  },
];

// ── Player colors ────────────────────────────────────────────────────────────

const PLAYER_COLORS = { 1: 0xe74c3c, 2: 0x3498db, 3: 0x2ecc71, 4: 0xf39c12 };
const PLAYER_COLOR_NAMES = { 1: 'Red', 2: 'Blue', 3: 'Green', 4: 'Orange' };

// ── Scene ────────────────────────────────────────────────────────────────────

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.socket           = null;
    this.selfData         = null;
    this.localPlayer      = null;
    this.localLabel       = null;
    this.facing           = 1;
    this.score            = 0;
    this.invincible       = false;
    this.flagReached      = false;
    this.currentLevel     = 0;
    this.remoteSprites    = new Map();
    this.platformGroup    = null;
    this.goombas          = null;
    this.aliveGoombas     = new Map();
    this.coinGroup        = null;
    this.coinSprites      = new Map();
    this.flagGraphics     = null;
    this.flagZone         = null;
    this.levelColliders   = [];
    this.deadGoombaIds    = new Set();
    this.collectedCoinIds = new Set();
    this.cursors          = null;
    this.spaceKey         = null;
    this.sendAccumulator  = 0;
    this.scoreText        = null;
    this.levelText        = null;
    this.bannerText       = null;
  }

  preload() {}

  create() {
    this._generateTextures();
    this._setupInput();
    this._setupHUD();
    this._setupSocket();
  }

  // ── Textures ─────────────────────────────────────────────────────────────

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
    g.fillStyle(0xCC0000); g.fillRect(8,  0, 16,  7);
    g.fillStyle(0xFF2222); g.fillRect(4,  5, 24,  5);
    g.fillStyle(0xFFCC99); g.fillRect(6, 10, 20, 12);
    g.fillStyle(0x000000);
    g.fillRect(9,  13, 4, 4);
    g.fillRect(19, 13, 4, 4);
    g.fillStyle(0x553300); g.fillRect(7, 19, 18,  4);
    g.fillStyle(0xFF2222); g.fillRect(0, 24,  8,  9);
    g.fillStyle(0xFF2222); g.fillRect(24,24,  8,  9);
    g.fillStyle(overallsColor);
    g.fillRect(10, 22, 12, 15);
    g.fillRect(4,  33, 24,  8);
    g.fillStyle(0x8B4513);
    g.fillRect(2,  40, 13,  8);
    g.fillRect(17, 40, 13,  8);
  }

  _drawGoomba(g) {
    g.fillStyle(0xAA6633); g.fillRect(2, 10, 20, 14);
    g.fillStyle(0x7A3B1E); g.fillRect(0,  0, 24, 13);
    g.fillStyle(0xFFFFFF);
    g.fillRect(2, 2, 8, 8);
    g.fillRect(14,2, 8, 8);
    g.fillStyle(0x000000);
    g.fillRect(2, 4, 5, 5);
    g.fillRect(17,4, 5, 5);
    g.fillStyle(0x3A1A00);
    g.fillRect(2, 1, 8, 2);
    g.fillRect(14,1, 8, 2);
    g.fillStyle(0x4A1A00);
    g.fillRect(1, 20, 9, 4);
    g.fillRect(14,20, 9, 4);
  }

  _drawCoin(g) {
    g.fillStyle(0xFFD700); g.fillCircle(8, 8, 7);
    g.fillStyle(0xFFFF88); g.fillCircle(6, 5, 3);
    g.fillStyle(0xFFAA00); g.fillCircle(10,11, 2);
  }

  // ── Level loading / unloading ─────────────────────────────────────────────

  _loadLevel(index) {
    this._destroyLevelObjects();

    this.currentLevel = index;
    const lvl = LEVELS[index];
    this.cameras.main.setBackgroundColor(lvl.background);

    // Platforms
    this.platformGroup = this.physics.add.staticGroup();
    for (const p of lvl.platforms) {
      const color = (p.h >= 35) ? lvl.groundColor : lvl.platformColor;
      const rect = this.add.rectangle(
        p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, color
      );
      this.platformGroup.add(rect);
    }
    this.platformGroup.refresh();

    // Goombas
    this.goombas = this.physics.add.group();
    for (const def of lvl.goombas) {
      if (this.deadGoombaIds.has(def.id)) continue;
      const g = this.goombas.create(def.x, def.y, 'goomba');
      g.setOrigin(0.5, 0.5);
      g.goombaDef = def;
      g.direction = 1;
      g.body.setCollideWorldBounds(true);
      this.aliveGoombas.set(def.id, g);
    }
    this.levelColliders.push(this.physics.add.collider(this.goombas, this.platformGroup));

    // Coins
    this.coinGroup = this.physics.add.staticGroup();
    for (const pos of lvl.coins) {
      if (this.collectedCoinIds.has(pos.id)) continue;
      const c = this.coinGroup.create(pos.x, pos.y, 'coin');
      c.setOrigin(0.5, 0.5);
      c.coinId = pos.id;
      this.coinSprites.set(pos.id, c);
    }
    this.coinGroup.refresh();

    // Flag
    const { flag } = lvl;
    this.flagGraphics = this.add.graphics();
    this.flagGraphics.fillStyle(0xAAAAAA); this.flagGraphics.fillRect(flag.x - 3, flag.y - 120, 6, 120);
    this.flagGraphics.fillStyle(0x00CC00); this.flagGraphics.fillRect(flag.x + 3, flag.y - 118, 22, 16);
    this.flagZone = this.add.zone(flag.x, flag.y - 60, 28, 120);
    this.physics.add.existing(this.flagZone, true);

    // Level name label
    if (this.levelText) this.levelText.destroy();
    this.levelText = this.add.text(16, 46, lvl.name, {
      fontSize: '16px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setDepth(10);
  }

  _destroyLevelObjects() {
    for (const c of this.levelColliders) { if (c) c.destroy(); }
    this.levelColliders = [];

    if (this.platformGroup) { this.platformGroup.clear(true, true); this.platformGroup.destroy(); this.platformGroup = null; }
    if (this.goombas)       { this.goombas.clear(true, true);       this.goombas.destroy();       this.goombas = null; }
    this.aliveGoombas.clear();
    if (this.coinGroup)     { this.coinGroup.clear(true, true);     this.coinGroup.destroy();     this.coinGroup = null; }
    this.coinSprites.clear();
    if (this.flagGraphics)  { this.flagGraphics.destroy();  this.flagGraphics = null; }
    if (this.flagZone)      { this.flagZone.destroy();      this.flagZone = null; }
  }

  _addPlayerColliders() {
    this.levelColliders.push(
      this.physics.add.collider(this.localPlayer, this.platformGroup),
      this.physics.add.overlap(this.localPlayer, this.goombas,  this._onGoombaOverlap, null, this),
      this.physics.add.overlap(this.localPlayer, this.coinGroup, (_p, coin) => this._collectCoin(coin)),
      this.physics.add.overlap(this.localPlayer, this.flagZone, () => {
        if (!this.flagReached) { this.flagReached = true; this.socket.emit('flag_reached'); }
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
  }

  _showBanner(text, color = '#ffffff') {
    if (this.bannerText) this.bannerText.destroy();
    this.bannerText = this.add.text(480, 270, text, {
      fontSize: '52px', fontFamily: 'monospace',
      color, stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5, 0.5).setDepth(100).setAlpha(0);

    this.tweens.add({
      targets: this.bannerText,
      alpha: 1, duration: 300, yoyo: false,
      onComplete: () => {
        this.time.delayedCall(1800, () => {
          this.tweens.add({ targets: this.bannerText, alpha: 0, duration: 400 });
        });
      }
    });
  }

  // ── Socket ────────────────────────────────────────────────────────────────

  _setupSocket() {
    this.socket = io();

    this.socket.on('init', ({ self, existingPlayers, currentLevel, deadGoombas, collectedCoins }) => {
      this.selfData         = self;
      this.deadGoombaIds    = new Set(deadGoombas   || []);
      this.collectedCoinIds = new Set(collectedCoins || []);

      document.getElementById('status').textContent =
        `Player ${self.playerNumber} (${PLAYER_COLOR_NAMES[self.playerNumber]}) — Arrows to move · Up/Space to jump · Reach the flag!`;

      this._loadLevel(currentLevel || 0);
      this.spawnLocalPlayer(self);
      for (const p of existingPlayers) this.spawnRemotePlayer(p);
    });

    this.socket.on('player_joined', p => this.spawnRemotePlayer(p));

    this.socket.on('player_moved', ({ id, x, y, facing }) => {
      const r = this.remoteSprites.get(id);
      if (!r) return;
      r.sprite.setPosition(x, y);
      r.sprite.setFlipX(facing < 0);
      r.label.setPosition(x, y - 32);
    });

    this.socket.on('player_left', ({ id }) => {
      const r = this.remoteSprites.get(id);
      if (!r) return;
      r.sprite.destroy(); r.label.destroy();
      this.remoteSprites.delete(id);
    });

    this.socket.on('goomba_killed', ({ id }) => this._killGoomba(id));

    this.socket.on('coin_collected', ({ id }) => {
      const coin = this.coinSprites.get(id);
      if (coin) { coin.destroy(); this.coinSprites.delete(id); }
    });

    this.socket.on('level_change', ({ level }) => {
      this._showBanner(`${LEVELS[level].name}`, '#FFD700');
      this.deadGoombaIds    = new Set();
      this.collectedCoinIds = new Set();
      this.flagReached = false;
      this._loadLevel(level);
      if (this.localPlayer) {
        const lvl = LEVELS[level];
        this.localPlayer.setPosition(this.selfData.x, lvl.spawnY);
        this.localPlayer.body.setVelocity(0, 0);
        this._addPlayerColliders();
      }
    });

    this.socket.on('game_won', () => {
      this.add.rectangle(480, 270, 960, 540, 0x000000, 0.75).setDepth(98);
      this.add.text(480, 230, 'YOU WIN!', {
        fontSize: '64px', fontFamily: 'monospace',
        color: '#FFD700', stroke: '#000000', strokeThickness: 6
      }).setOrigin(0.5, 0.5).setDepth(99);
      this.add.text(480, 310, `Score: ${this.score}`, {
        fontSize: '32px', fontFamily: 'monospace',
        color: '#ffffff', stroke: '#000000', strokeThickness: 4
      }).setOrigin(0.5, 0.5).setDepth(99);
      this.add.text(480, 360, 'Refresh to play again', {
        fontSize: '20px', fontFamily: 'monospace', color: '#aaaaaa'
      }).setOrigin(0.5, 0.5).setDepth(99);
    });

    this.socket.on('server_full', () => {
      document.getElementById('status').textContent = 'Server full — max 4 players';
    });

    this.socket.on('connect_error', () => {
      document.getElementById('status').textContent = 'Connection error — is the server running?';
    });
  }

  // ── Player spawning ───────────────────────────────────────────────────────

  spawnLocalPlayer(self) {
    const lvl = LEVELS[this.currentLevel];
    this.localPlayer = this.physics.add.sprite(self.x, lvl.spawnY, `player_${self.playerNumber}`);
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
    const sprite = this.add.sprite(p.x, p.y, `player_${p.playerNumber}`);
    sprite.setOrigin(0.5, 0.5).setAlpha(0.85).setDepth(2);
    const label = this.add.text(p.x, p.y - 32, `P${p.playerNumber}`, {
      fontSize: '11px', fontFamily: 'monospace',
      color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(3);
    this.remoteSprites.set(p.id, { sprite, label });
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
    const lvl = LEVELS[this.currentLevel];
    this.localPlayer.setPosition(this.selfData.x, lvl.spawnY);
    this.localPlayer.body.setVelocity(0, 0);
    this.tweens.add({
      targets: this.localPlayer, alpha: 0, yoyo: true, repeat: 4, duration: 200,
      onComplete: () => { this.localPlayer.setAlpha(1); this.invincible = false; }
    });
  }

  // ── Update ────────────────────────────────────────────────────────────────

  update(_time, delta) {
    if (!this.localPlayer) return;

    const body     = this.localPlayer.body;
    const onGround = body.blocked.down;

    if (this.cursors.left.isDown) {
      body.setVelocityX(-220); this.facing = -1;
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(220);  this.facing = 1;
    } else {
      body.setVelocityX(0);
    }

    if ((this.cursors.up.isDown || this.spaceKey.isDown) && onGround) {
      body.setVelocityY(-560);
    }

    this.localPlayer.setFlipX(this.facing < 0);
    this.localLabel.setPosition(this.localPlayer.x, this.localPlayer.y - 32);

    if (this.localPlayer.y > 570) this._respawn();

    // Goomba AI — deterministic on all clients
    for (const [, goomba] of this.aliveGoombas) {
      const def = goomba.goombaDef;
      if (goomba.x <= def.minX) goomba.direction = 1;
      if (goomba.x >= def.maxX) goomba.direction = -1;
      goomba.body.setVelocityX(def.speed * goomba.direction);
      goomba.setFlipX(goomba.direction < 0);
    }

    // Network sync (20 updates/sec)
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

// ── Phaser config ─────────────────────────────────────────────────────────────

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
