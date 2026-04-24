# Code review — mario-game

Overall: tight, coherent prototype — ~700 lines covers multiplayer, 5 levels, physics, sound, HUD, deploy. Code reads well, naming is clear, separation (server/client/assets-by-code) is consistent. Main weakness: **the server is not authoritative**, which matters because this is deployed publicly to Railway, not just LAN. Details below.

## Security / trust (server.js)

1. **Client-controlled fields leak into server state.** `server.js:72` — `Object.assign(p, data)` on every `position_update` copies *any* key the client sends. A malicious client can overwrite `id`, `playerNumber`, `color`, or `score` in the server record; those then get broadcast out on subsequent events. Whitelist fields:
   ```js
   const { x, y, velocityX, velocityY, facing, powered } = data;
   Object.assign(p, { x, y, velocityX, velocityY, facing, powered });
   ```
2. **Scores are self-reported.** `server.js:76` — the server trusts whatever number the client sends for `score`. Leaderboard is spoofable. For a LAN demo this is fine; call it out if this is publicly deployed.
3. **No validation on `goomba_killed` / `coin_collected` / `mushroom_collected` / `flag_reached`.** Any connected client can clear coins, kill goombas, or skip the level. `flag_reached` is the most impactful — one bad actor can force-advance everyone. At minimum, gate on "is this id valid for currentLevel and not already collected/killed?" The level data exists only on the client today — moving `LEVELS` (or at least the id sets) to a shared file would let the server validate.
4. **No rate limiting.** `position_update` is client-paced at 20 Hz, but nothing stops a client from flooding at 10 kHz. Cheap to add (`if (now - p.lastUpdate < 20) return;`).
5. **CORS `origin: '*'`** (`server.js:7`) is broad for a deployed app. Not an active vuln given the endpoints, but tighten to the Railway host for production.

## Bugs / correctness

6. **`disconnect` handler fires even for rejected connections.** `server.js:115` runs for the `server_full` / slot-exhausted paths too, emitting `player_left` with a socket id that was never announced, and closing over a stale `playerNumber`. Either register the handler only after successful join, or early-return if `!players.has(socket.id)`.
7. **Remote score leaks across slot reuse.** `game.js:556` keys `remoteScores` by `playerNumber`, and `player_left` (`game.js:548`) doesn't clear it. Between "player 2 leaves" and "new player 2 joins," the leaderboard keeps showing the old player's score. `player_joined` resets it to 0, so the window is small, but it's visible — and clearing on `player_left` is one line.
8. **Remote players never animate.** Their texture is set once to `idle` (`game.js:634`) and only `setFlipX` / `setScale` is updated on `player_moved`. For the prototype this is clearly a choice, not a bug — but `position_update` already carries enough state (`velocityX`, `onGround` derivable from `velocityY`) to pick the right frame. Worth a tiny pass if you want the multiplayer experience to feel live.
9. **`goombaDef.y` is written but never used after creation.** Goombas patrol by x only; `y` comes from platform collisions. Fine — just noting the field is effectively unused in the AI.

## Dead code / nits

10. **`_addPlayerColliders` has dead `pn`.** `game.js:442,457`:
    ```js
    const pn = this.selfData.playerNumber;
    // ...
    void pn;
    ```
    Nothing uses `pn`; the `void pn` is papering over a lint warning for a variable that shouldn't exist. Delete both lines.
11. **`PLAYER_COLORS` duplicated** between `server.js:12` and `game.js:212`. Acceptable for a prototype with no build step — worth a line of comment so the next editor knows to update both.
12. **`preload() {}`** (`game.js:258`) — empty method can be removed; Phaser doesn't require it.
13. **Missing `.dockerignore`.** `COPY . .` will pull in `node_modules` if it exists locally when you build outside CI. One-line fix.

## Design observation (not a bug)

Deterministic goomba AI on every client (acknowledged in CLAUDE.md) works, but `physics.add.group()` + `collideWorldBounds` means goombas can drift between clients over time — a goomba stomped on client A may visually live for a few frames on client B before the `goomba_killed` event arrives. Fine for a LAN demo; noting it because the game is deployed publicly and latency is higher.

## Priorities if you want to harden this

1. Whitelist `position_update` fields (item 1) — tiny diff, closes the state-corruption path.
2. Make `flag_reached` server-validated (item 3) — one griefer shouldn't be able to skip levels for everyone.
3. Clear `remoteScores` on `player_left` (item 7) — one line, removes a visible artifact.

Everything else is polish.
