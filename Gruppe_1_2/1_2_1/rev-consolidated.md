# Code Review: Mario Multiplayer (consolidated)

Tight, coherent prototype — ~700 lines covers multiplayer, 5 levels, physics, sound, HUD, deploy. Phaser 3 + Socket.io + Express. Naming is clear, separation (server/client/assets-by-code) is consistent. The main weakness is that **the server is not authoritative**, which matters because this is deployed publicly to Railway, not just LAN.

---

## Security / trust

**1. `position_update` trusts all client fields (`server.js:72`)** — *high priority*

```js
Object.assign(p, data);
```

A malicious client can overwrite any field on the server-side player record (`id`, `playerNumber`, `color`, `score`), which is then rebroadcast. Whitelist:
```js
const { x, y, velocityX, velocityY, facing, powered } = data;
Object.assign(p, { x, y, velocityX, velocityY, facing, powered });
```

**2. Scores are client-authoritative (`server.js:76-81`)**

Server accepts whatever number the client sends. Leaderboard is trivially spoofable. Acceptable for a LAN demo; worth calling out given public deploy.

**3. No validation on `goomba_killed` / `coin_collected` / `mushroom_collected` / `flag_reached`**

Any connected client can clear coins, kill goombas, or skip the level. `flag_reached` is the most impactful — one bad actor can force-advance everyone. At minimum, gate on "is this id valid for `currentLevel` and not already collected/killed?" The level data lives client-side today; moving `LEVELS` (or at least the id sets) to a shared file would let the server validate.

**4. No rate limiting on `position_update`**

Client-paced at 20 Hz, but nothing stops a client from flooding. Cheap to add: `if (now - p.lastUpdate < 20) return;`.

**5. CORS `origin: '*'` (`server.js:7`)**

Broad for a deployed app. Not an active vuln given current endpoints, but tighten to the Railway host for production.

---

## Bugs / correctness

**6. Score update feedback loop (`game.js:481-488`)**

`_updateScoreDisplay()` always emits `score_update` to the server and is also called when the client *receives* `score_updated` from the server. Every remote score event triggers a redundant re-emission, which the server rebroadcasts. No infinite loop, but it multiplies score traffic by the number of players. Split display update from emission:
```js
_emitScore()          { this.socket.emit('score_update', { score: this.score }); }
_refreshLeaderboard() { /* only re-draws text */ }
// call _emitScore() only when score actually changes
```

**7. `this.sound` overwrites Phaser's built-in (`game.js:255, 261`)**

Phaser `Scene` has a `this.sound` property (the SoundManager plugin). The game reassigns it to a custom `SoundManager` instance. Works only because the custom class is assigned before Phaser's plugin touches it — fragile and will break if Phaser ever accesses `this.sound` in the scene lifecycle. Rename to `this.sfx` or `this.audio`.

**8. Mushroom overlaps coin in World 1-1 (`game.js:53-58`)**

Mushroom `id:0` is at `{x:480, y:288}` and coin `id:4` is also at `{x:480, y:288}`. Two sprites rendered at the same pixel; collecting one doesn't remove the other.

**9. `disconnect` handler fires for rejected connections (`server.js:115`)**

Runs for `server_full` / slot-exhausted paths too, emitting `player_left` with a socket id that was never announced, closing over a stale `playerNumber`. Either register the handler only after successful join, or early-return if `!players.has(socket.id)`.

**10. Remote score leaks across slot reuse (`game.js:556`)**

`remoteScores` is keyed by `playerNumber`. `player_left` (`game.js:548`) doesn't clear it, so between "player 2 leaves" and "new player 2 joins," the leaderboard shows the old score. `player_joined` resets to 0, so the window is small but visible. One-line fix on `player_left`.

**11. `sendAccumulator` reset (`game.js:771`)**

```js
this.sendAccumulator = 0;
```

If `delta` overshoots 50 ms (e.g. 60 ms), the surplus is discarded instead of carried forward. Use `this.sendAccumulator -= 50` to maintain correct pacing.

---

## UX / polish

**12. Remote players never animate (`game.js:634`)**

Texture is set once to `idle`; only `setFlipX` / `setScale` update on `player_moved`. `position_update` already carries `velocityX` and `velocityY` — enough to pick idle/walk/jump frames. A small pass would make multiplayer feel live.

**13. Remote player teleportation**

At 20 updates/sec, remote players jump directly to each new position, which is visible at normal gameplay speeds. Linear interpolation toward the target position in `update()` would smooth this out noticeably.

---

## Dead code / nits

**14. `void pn` in `_addPlayerColliders` (`game.js:442, 457`)**
```js
const pn = this.selfData.playerNumber;
// ...
void pn;
```
Nothing uses `pn`; the `void pn` papers over a lint warning for a variable that shouldn't exist. Delete both lines.

**15. `wasOnGround` (`game.js:228`)** — declared in constructor, never read.

**16. `goombaDef.y`** — written but never used after creation. Goombas patrol by x only; `y` comes from platform collisions.

**17. `PLAYER_COLORS` duplicated** between `server.js:12` and `game.js:212`. Acceptable without a build step — a one-line comment so the next editor knows to update both would help.

**18. Empty `preload()` (`game.js:258`)** — Phaser doesn't require it; delete.

**19. Missing `.dockerignore`** — `COPY . .` will pull in `node_modules` if it exists locally when building outside CI. One-line fix.

---

## Design observation (not a bug)

Deterministic goomba AI on every client (acknowledged in CLAUDE.md) works, but `physics.add.group()` + `collideWorldBounds` means goombas can drift between clients over time — a goomba stomped on client A may visually live for a few frames on client B before `goomba_killed` arrives. Fine for LAN; worth noting because the game is deployed publicly where latency is higher.

---

## Dockerfile

Solid: `node:20-slim`, `npm ci --omit=dev`, correct `EXPOSE`/`CMD`. Only miss is `.dockerignore` (#19).

---

## Priorities if you want to harden this

| Priority | Issue |
|---|---|
| Fix (security) | Whitelist `position_update` fields (#1) |
| Fix (security) | Server-validate `flag_reached` at minimum (#3) |
| Fix (bug) | `this.sound` name collision with Phaser (#7) |
| Fix (bug) | Mushroom/coin position overlap in World 1-1 (#8) |
| Fix (bug) | Score update feedback loop (#6) |
| Fix (bug) | Clear `remoteScores` on `player_left` (#10) |
| Fix (bug) | `disconnect` handler early-return for rejected connections (#9) |
| Cleanup | Remove `wasOnGround`, `void pn`, empty `preload()` (#14, #15, #18) |
| Nice-to-have | Remote player animation frames + interpolation (#12, #13) |
| Nice-to-have | `sendAccumulator -= 50` instead of `= 0` (#11) |
| Nice-to-have | Rate limit `position_update`, tighten CORS, add `.dockerignore` (#4, #5, #19) |
