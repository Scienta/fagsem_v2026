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
