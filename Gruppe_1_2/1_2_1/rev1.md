# Code Review: Mario Multiplayer

## Overview

A clean, well-scoped multiplayer Mario prototype. Phaser 3 + Socket.io + Express, five levels, deterministic goomba AI, power-ups, leaderboard, and a Dockerfile for cloud deploy. The design choices are sound for a LAN prototype and match the stated goals.

---

## Bugs

**1. Score update feedback loop (`game.js:481-488`)**

`_updateScoreDisplay()` always emits `score_update` to the server. It is also called when the client receives `score_updated` from the server. This means every remote score event triggers a redundant re-emission of the local score, which the server rebroadcasts, which triggers `_updateScoreDisplay()` on all other clients, and so on. No infinite loop, but it multiplies score traffic by the number of players.

Fix: split display update from emission:
```js
_emitScore()  { this.socket.emit('score_update', { score: this.score }); }
_refreshLeaderboard() { /* only re-draws text */ }
// call _emitScore() only when score actually changes
```

**2. `this.sound` overwrites Phaser's built-in (`game.js:255, 261`)**

Phaser `Scene` has a `this.sound` property (the Phaser SoundManager plugin). The game reassigns it to a custom `SoundManager` instance. This works only because the custom class is assigned before Phaser's plugin initializes it on this scene, but it is fragile and will break if Phaser ever accesses `this.sound` internally in the scene lifecycle. Rename to `this.sfx` or `this.audio`.

**3. Mushroom overlaps coin in World 1-1 (`game.js:53-58`)**

Mushroom `id:0` is at `{x:480, y:288}` and coin `id:4` is also at `{x:480, y:288}`. Two sprites are rendered at the same pixel, and collecting one doesn't remove the other.

---

## Security

**4. Server trusts all `position_update` fields (`server.js:72`)**

```js
Object.assign(p, data);
```

A client can send `{ id: "...", playerNumber: 1, score: 999999 }` and overwrite any field of the player object. Whitelist the accepted fields:
```js
const { x, y, velocityX, velocityY, facing, powered } = data;
Object.assign(p, { x, y, velocityX, velocityY, facing, powered });
```

**5. Score is fully client-authoritative (`server.js:76-81`)**

The server accepts any score the client sends. Trivially exploitable. For a prototype this is fine, but worth noting.

---

## Dead Code

**6. `wasOnGround` (`game.js:228`)**

Declared in the constructor, never read anywhere in the class.

**7. `void pn` in `_addPlayerColliders` (`game.js:457`)**

`pn` is assigned from `this.selfData.playerNumber` but is never used in any closure. The `void pn` suppressor and comment are noise; just delete the variable.

---

## UX / Design

**8. Remote players never animate**

`position_update` sends `x, y, velocityX, velocityY, facing, powered` but not the animation frame. Remote players are always displayed with the `idle` texture regardless of whether they are walking or jumping. Adding `animFrame` to the sync payload would fix this.

**9. Remote player teleportation**

At 20 updates/second, remote players jump directly to the new position each tick, which is visible at normal gameplay speeds. Linear interpolation toward the target position in `update()` would smooth this out noticeably.

**10. `sendAccumulator` reset (`game.js:771`)**

```js
this.sendAccumulator = 0;
```

If `delta` overshoots 50ms (e.g. 60ms), the surplus is discarded instead of carried forward. Use `this.sendAccumulator -= 50` to maintain correct pacing.

---

## Dockerfile

Solid: `node:20-slim`, `npm ci --omit=dev`, correct `EXPOSE`/`CMD`. No issues.

---

## Summary

| Priority | Issue |
|---|---|
| Fix | `position_update` field whitelist (security) |
| Fix | `this.sound` name collision with Phaser |
| Fix | Mushroom/coin position overlap in World 1-1 |
| Fix | Score update feedback loop |
| Cleanup | Remove `wasOnGround` and `void pn` |
| Nice-to-have | Remote player animation frames in sync payload |
| Nice-to-have | `sendAccumulator -= 50` instead of `= 0` |
