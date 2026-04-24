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
