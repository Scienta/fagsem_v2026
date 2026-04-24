const LEVEL_PLATFORMS = [
  { x: 0,   y: 500, width: 960, height: 40 },  // ground
  { x: 100, y: 380, width: 200, height: 20 },
  { x: 380, y: 300, width: 200, height: 20 },
  { x: 660, y: 380, width: 200, height: 20 },
  { x: 200, y: 220, width: 150, height: 20 },
  { x: 620, y: 220, width: 150, height: 20 },
  { x: 380, y: 150, width: 200, height: 20 },  // apex
];

const PLAYER_COLORS = { 1: 0xe74c3c, 2: 0x3498db, 3: 0x2ecc71, 4: 0xf39c12 };
const PLAYER_COLOR_NAMES = { 1: 'Red', 2: 'Blue', 3: 'Green', 4: 'Orange' };

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.socket = null;
    this.localPlayer = null;
    this.localLabel = null;
    this.platformGroup = null;
    this.cursors = null;
    this.remoteSprites = new Map();
    this.facing = 1;
    this.sendAccumulator = 0;
    this.selfData = null;
  }

  preload() {}

  create() {
    this.socket = io();

    // Build platforms
    this.platformGroup = this.physics.add.staticGroup();
    for (const p of LEVEL_PLATFORMS) {
      const cx = p.x + p.width / 2;
      const cy = p.y + p.height / 2;
      const color = (p.height === 40) ? 0x3a7d44 : 0x8B4513;
      const rect = this.add.rectangle(cx, cy, p.width, p.height, color);
      this.platformGroup.add(rect);
    }
    this.platformGroup.refresh();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Socket events
    this.socket.on('init', ({ self, existingPlayers }) => {
      this.selfData = self;
      document.getElementById('status').textContent =
        `Player ${self.playerNumber} (${PLAYER_COLOR_NAMES[self.playerNumber]}) — Arrow keys to move, Up / Space to jump`;

      this.spawnLocalPlayer(self);

      for (const p of existingPlayers) {
        this.spawnRemotePlayer(p);
      }
    });

    this.socket.on('player_joined', (player) => {
      this.spawnRemotePlayer(player);
    });

    this.socket.on('player_moved', ({ id, x, y }) => {
      const remote = this.remoteSprites.get(id);
      if (remote) {
        remote.rect.setPosition(x, y);
        remote.label.setPosition(x, y);
      }
    });

    this.socket.on('player_left', ({ id }) => {
      const remote = this.remoteSprites.get(id);
      if (remote) {
        remote.rect.destroy();
        remote.label.destroy();
        this.remoteSprites.delete(id);
      }
    });

    this.socket.on('server_full', () => {
      document.getElementById('status').textContent = 'Server full — max 4 players connected';
    });

    this.socket.on('connect_error', () => {
      document.getElementById('status').textContent = 'Connection error — is the server running?';
    });
  }

  spawnLocalPlayer(self) {
    this.localPlayer = this.add.rectangle(self.x, self.y, 32, 48, self.color);
    this.physics.add.existing(this.localPlayer);
    this.localPlayer.body.setCollideWorldBounds(true);
    this.localPlayer.body.setMaxVelocityX(300);
    this.physics.add.collider(this.localPlayer, this.platformGroup);

    this.localLabel = this.add.text(self.x, self.y, String(self.playerNumber), {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(1);
  }

  spawnRemotePlayer(p) {
    const rect = this.add.rectangle(p.x, p.y, 32, 48, p.color).setAlpha(0.85);
    const label = this.add.text(p.x, p.y, String(p.playerNumber), {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(1);
    this.remoteSprites.set(p.id, { rect, label });
  }

  update(time, delta) {
    if (!this.localPlayer) return;

    const body = this.localPlayer.body;
    const onGround = body.blocked.down;

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

    this.localLabel.setPosition(this.localPlayer.x, this.localPlayer.y);

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
