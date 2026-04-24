# Gruppe 1_2_1 – Arbeidslogg

Hold denne filen oppdatert underveis i arbeidet.

## Hva som skal loggføres

- Hva som ble testet
- Hvilken variant eller betingelse som ble brukt
- Hva som skjedde
- Hva dere lærte eller ble usikre på

## Logg

### 2026-04-24 – Oppstart og valg av eksperiment

- **Testet:** Planlegging og scaffolding av et nettbasert multiplayer Mario-spill med Claude Code
- **Variant:** AI-drevet prosjektoppstart fra scratch – ingen eksisterende kode
- **Hva skjedde:**
  - Valgte scope: enkel prototype med én bane, løp/hopp, 2–4 spillere synlige samtidig
  - Valgte tech stack: Phaser.js 3 (CDN) + Node.js + Socket.io + Express
  - Kjøringsmodell: localhost, spillere kobler til via browser på samme nettverk
  - Claude genererte alle fire filer (`package.json`, `server.js`, `public/index.html`, `public/game.js`) uten ekstern assets – all grafikk tegnes med Phaser Graphics API
  - Node.js måtte installeres via Homebrew (ikke installert på forhånd)
  - `npm install` og serveroppstart verifisert – serveren svarer på `http://localhost:3000`
- **Lærte:** Claude håndterte hele arkitekturdesign og implementasjon i én runde. Planleggingsfasen (ExitPlanMode) hjalp med å avklare scope og tech-valg før koding startet.

### 2026-04-24 – Mario-funksjoner lagt til

- **Testet:** Utvidelse av prototype med Goomba-fiender, mynter/poeng og bedre grafikk
- **Variant:** Alt generert med Phaser Graphics API – ingen bildefiler
- **Hva skjedde:**
  - Lagt til pixel-art Mario-karakter for hver spiller (rød/blå/grønn/oransje kjeledress)
  - 5 Goomba-fiender med patrol-AI (deterministisk simulering på alle klienter, synkroniserte drap via Socket.io)
  - 22 mynter spredt over banen – innsamling synkronisert via server slik at sent-tilkoblede spillere ser riktig tilstand
  - Poengsum per spiller (100p for å trampe Goomba, 200p per mynt)
  - Respawn med kortvarig uovervinnelighet ved berøring av Goomba eller fall utenfor skjermen
  - Server sporer `deadGoombas` og `collectedCoins` for korrekt initialstate for nye spillere
- **Lærte:** Deterministisk klient-simulering av fiender (alle klienter kjører samme AI) fungerer godt på LAN. Krever kun synkronisering av hendelser (fiende drept, mynt samlet), ikke løpende posisjoner for fiendene.

### 2026-04-24 – 5 brett implementert

- **Testet:** Utvidelse med 5 ulike brett og niveau-overgang via flagg
- **Variant:** Flagg på høyre side, første spiller som treffer flagg trigger overgang for alle
- **Hva skjedde:**
  - Lagt til `LEVELS`-array med 5 brett: World 1-1 (lett) til World 1-5 (veldig vanskelig)
  - Hvert brett har unikt bakgrunnsfarge, plattform-farger, layout, goombas og mynter
  - Flagg tegnet med Phaser Graphics (stang + grønn flagg), trigger `flag_reached`-event til server
  - Server håndterer overgang: nullstiller dead goombas/collected coins, sender `level_change` til alle klienter
  - Klientene river ned og bygger opp nytt brett uten å laste siden på nytt
  - `_destroyLevelObjects()` og `_addPlayerColliders()` rydder opp Phaser physics korrekt mellom brett
  - Win-screen etter siste brett med total poengsum
- **Lærte:** Dynamisk nivå-lasting i Phaser 3 krever eksplisitt sporring av colliders slik at de kan fjernes. `group.clear(true, true)` + `group.destroy()` er riktig måte å fullstendig rydde opp physics-grupper.

### 2026-04-24 – Lydeffekter, animasjoner, power-ups, leaderboard og deploy

- **Testet:** Implementert alle fire gjenstående features + deploy-oppsett i én sammenhengende runde
- **Variant:** Alt client-side generert, ingen filer/assets lastet fra nett (utenom Phaser CDN)
- **Hva skjedde:**
  - **Lyd (Web Audio API):** SoundManager-klasse genererer 8-bit lyder prosedyralt – hopp, mynt, tramping, sopp, flagg, nivå-overgang, death. Ingen lydfiler nødvendig.
  - **Animasjoner:** Fire tekstur-frames per spiller (idle, walk0, walk1, jump) tegnet med Phaser Graphics. Animasjons-state machine i update(): idle/gå/hopp basert på velocity og onGround. Gå-animasjon veksler mellom frames hvert 100ms.
  - **Power-ups (sopp):** Sopp plassert i hvert brett (1–2 per brett). Samling gir 500p og dobbel størrelse (setScale(1.5)). Goomba-treff mens powered = mister power i stedet for å dø. Synkronisert mellom klienter via server.
  - **Leaderboard:** Alle spilleres poengsum vises øverst til høyre i sanntid. Klienter sender `score_update` til server som relayer til alle. Sortert etter poengsum.
  - **Deploy:** Dockerfile lagt til og deployet til Railway. Spillet er live på https://mario-multiplayer-production.up.railway.app
- **Lærte:** Web Audio API er et kraftig verktøy for prosedyrale 8-bit lyder uten assets. Separate tekstur-frames per animasjonsstilstand er enklere enn Phaser spritesheet-API ved runtime-generering.

### 2026-04-24 – Bugfikser: duplikate spillere og slot-reuse

- **Testet:** Feilsøking av duplikate spillere rapportert under live-testing
- **Feil 1 — Player slot overflow:** `nextPlayerNumber` talte bare oppover, så etter disconnect/reconnect fikk nye spillere slot 5+ med `undefined` farge og tekstur. Løsning: `nextAvailableSlot()` finner alltid det laveste ledige slot (1–4).
- **Feil 2 — Ghost remote players:** Ved socket-reconnect kjørte `init`-handleren på nytt og spawnet nye remote sprites oppå de gamle. Løsning: nullstill `remoteSprites` i `init`-handler, og gjør `spawnRemotePlayer` idempotent (destroyer eksisterende sprite for samme socket-ID).
- **Feil 3 — Duplikat lokal spiller (rotårsak):** `spawnLocalPlayer` destroyet aldri det forrige sprite-objektet. Ved reconnect (vanlig på cloud-plattformer pga. automatisk WebSocket-reconnect) ble ny lokal spiller laget oppå den gamle, som mistet sine fysikk-kolliders og falt gjennom brettet. Løsning: destroy `localPlayer` og `localLabel` i starten av `spawnLocalPlayer` om de eksisterer.
- **Lærte:** Cloud WebSocket-reconnect er vanlig og må håndteres eksplisitt — alle spawn-funksjoner må være idempotente.

### 2026-04-24 – Konsolidert review og rettet 19 funn

- **Testet:** To uavhengige Claude-reviews (Sonnet og Opus) av samme codebase, slått sammen til én konsolidert liste, og deretter rettet alle funn i ett pass.
- **Variant:** Sonnet og Opus produserte overlappende men ikke identiske funn (4 duplikater, 6 + 9 unike). Konsolidert review listet 19 saker; alle ble adressert.
- **Hva skjedde:**
  - **Delt modul:** `LEVELS`, `PLAYER_COLORS`, `PLAYER_COLOR_NAMES` flyttet til ny `public/levels.js` med UMD-stil eksport. Lastes både av `index.html` (`<script>`) og `server.js` (`require`). Fjerner duplisering mellom server og klient.
  - **Server-validering:** Pre-beregnet `LEVEL_IDS` (Set per nivå for goombas/coins/mushrooms). `goomba_killed` / `coin_collected` / `mushroom_collected` valideres mot gyldige IDs + idempotens-sjekk (allerede død/samlet). `flag_reached` krever fortsatt aktiv socket.
  - **Whitelist:** `position_update` plukker kun `x, y, velocityX, velocityY, facing, powered, animFrame` — klient kan ikke lenger overskrive `id`, `playerNumber`, `color`, `score` på serverens player-record.
  - **Rate limit:** server avviser `position_update` oftere enn 20 ms.
  - **CORS:** lest fra `process.env.CORS_ORIGIN`, defaulter til `*` for dev-bekvemmelighet.
  - **Disconnect:** early-return hvis socket aldri ble lagt til (avviste connections fra `server_full` slipper å sende fantom `player_left`).
  - **Score-feedback-loop:** `_updateScoreDisplay` splittet i `_refreshScoreDisplay` (display) og `_onLocalScoreChanged` (display + emit). Server-relayed `score_updated` trigger ikke lenger ny emit.
  - **`this.sound` → `this.sfx`:** unngår navnekollisjon med Phaser SoundManager-plugin.
  - **Sopp/mynt-overlap World 1-1:** sopp flyttet fra `(480,288)` (lå på mynt 4) til `(820,368)` (på platformen til høyre).
  - **Slot-reuse-leak:** `player_left` sletter nå `remoteScores`-entry slik at neste spiller i slot ikke arver poeng.
  - **`sendAccumulator -= 50`:** rest-ms carryes til neste tick i stedet for å droppes.
  - **Remote-animasjon:** `position_update` carrier nå `animFrame`; remote-spillere settes til riktig tekstur (idle/walk/jump).
  - **Interpolasjon:** remote sprites lerper mot `targetX/targetY` per tick (lerp-faktor `delta/80`) i stedet for å hoppe rett til ny posisjon.
  - **Død kode fjernet:** `wasOnGround`, `void pn`, tom `preload()`.
  - **`.dockerignore`:** lagt til (node_modules, .git, *.md osv.).
- **Lærte:**
  - To AI-reviews av samme codebase finner overlappende men forskjellige funn — verdt å kjøre flere parallelt før man rangerer.
  - Når server skal validere events, er det enklere å eksportere `LEVELS` som delt modul enn å duplisere ID-data — UMD-mønsteret (`if (typeof module !== 'undefined') module.exports = ...`) lar én fil bli brukt fra både browser og Node uten build-step.
  - Klient-autoritativ score lar seg verifisere noe (typesjekk `Number.isFinite`) uten at server må kjøre full spillsimulering.
