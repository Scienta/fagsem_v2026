---
tema: "Tema 2 – AI-assistert systemutvikling"
---

# Rapport – Gruppe 1_2_1

---

## 1. Gruppeinformasjon

| Felt | Verdi |
|---|---|
| Gruppenummer | 1_2_1 |
| Deltakere | Per Spilling (utvikling), Runar Opsahl (code review) |
| Tema | Tema 2 – AI-assistert systemutvikling |
| Dato(er) for eksperiment | 2026-04-24 |
| Verktøy/modeller brukt | Claude Code (Sonnet 4.6, Opus) |
| Repo / kodebase / case brukt | `Gruppe_1_2/1_2_1/mario-game` – nettbasert multiplayer Mario-spill |

---

## 2. Valgt problemstilling

**Forskningsspørsmål:**
Hvor langt kan en AI-kodingsagent (Claude Code) ta et ikke-trivielt nettbasert spill fra scratch til ferdig, deployet produkt i én arbeidsøkt – og hvilke flaskehalser oppstår underveis?

**Hypotese:**
Claude Code kan håndtere scaffolding, arkitekturvalg og de fleste implementasjonsdetaljene, men vil sannsynligvis trenge menneskelig korreksjon ved sanntids-bugs (WebSocket-reconnect, klient/server-synkronisering) og sikkerhetssvakheter som først viser seg under testing.

---

## 3. Eksperimentoppsett

### Hva ble testet

Et nettbasert multiplayer-plattformspill inspirert av Super Mario Bros ble bygget fra bunnen av med Claude Code som primær utvikler. Oppgaven dekket:

- Arkitekturvalg og prosjektoppstart
- Spillmekanikk (løp, hopp, fiender, mynter, power-ups)
- Multiplayer-synkronisering via WebSockets
- 5 spillbrett med progressiv vanskelighetsgrad
- Lyd (prosedyralt generert), animasjoner og leaderboard
- Containerisering (Docker) og deploy til Railway
- Kodegjennomgang med to AI-modeller parallelt, og retting av alle funn

### Betingelser

| Betingelse | Beskrivelse |
|---|---|
| A – AI-drevet fra scratch | Claude Code tar alle beslutninger om arkitektur, tech stack og implementasjon. Mennesket setter kun overordnet scope og verifiserer at serveren kjører. |
| B – AI-review av ferdig kode | To uavhengige Claude-modeller (Sonnet og Opus) gjennomgår den ferdige koden, og funnene konsolideres og rettes i ett pass. |

### Målemetoder

- **Funksjonsdekning:** Hvilke features ble implementert uten manuell kode fra mennesket?
- **Antall bugs funnet i testing:** Registrert under live-testing etter deploy
- **Review-kvalitet:** Antall og overlapp mellom funn fra to modeller
- **Deploy-suksess:** Kjører spillet uten feil på offentlig URL etter siste rettinger?

---

## 4. Resultater

### Funksjonsdekning – hva Claude Code leverte uten manuell kode

| Feature | Levert av AI | Kommentar |
|---|---|---|
| Prosjektscaffolding (4 filer) | Ja | Én runde, ingen iterasjon nødvendig |
| Pixel-art grafikk (Phaser Graphics API) | Ja | Ingen bildefiler, alt tegnet prosedyralt |
| Multiplayer-synkronisering (Socket.io) | Ja | Server-autoritativ spilltilstand |
| Deterministisk fiende-AI | Ja | Alle klienter kjører identisk simulering |
| 5 brett med progressiv layout | Ja | Inkl. flagg-overgang og win-screen |
| 8-bit lyd (Web Audio API) | Ja | 7 lydeffekter, ingen lydfiler |
| Animasjons-state machine | Ja | 4 frames: idle, walk×2, jump |
| Power-ups (sopp) | Ja | Synkronisert mellom klienter |
| Leaderboard i sanntid | Ja | Sortert, oppdateres ved score-endring |
| Dockerfile + Railway-deploy | Ja | Live på https://mario-multiplayer-production.up.railway.app |

**Alle planlagte features ble levert av Claude Code uten at mennesket skrev én linje kode.**

### Bugs funnet under live-testing

| Bug | Rotårsak | Oppdaget |
|---|---|---|
| Spillere fikk slot 5+ etter reconnect | `nextPlayerNumber` telte bare oppover | Live-testing |
| Duplikate remote sprites ved reconnect | `init`-handler ikke idempotent | Live-testing |
| Lokal spiller falt gjennom brettet ved reconnect | `spawnLocalPlayer` destroyet ikke gammelt sprite | Live-testing |

Alle tre bugs hadde samme rotårsak: **WebSocket-reconnect** (vanlig på cloud-plattformer) ble ikke håndtert eksplisitt. Claude Code fikset alle tre da feilen var beskrevet.

### AI-review: Sonnet vs. Opus

| | Sonnet | Opus | Konsolidert |
|---|---|---|---|
| Antall funn | 10 | 13 | 19 (4 duplikater) |
| Unike funn | 6 | 9 | – |
| Kategorier | Sikkerhet, bugs, arkitektur | Sikkerhet, ytelse, kodestruktur | Alle kategorier dekket |

Utvalgte funn fra konsolidert review (alle rettet):

- **Sikkerhetssvakheter:** Klienten kunne overskrive `id`, `playerNumber`, `color`, `score` på serverens spillerobjekt via `position_update`. Løst med whitelist.
- **Score-feedback-loop:** `score_updated` fra server trigget ny `score_update` fra klient i en løkke. Løst ved å splitte display- og emit-logikk.
- **Duplisert data:** `LEVELS`, `PLAYER_COLORS` m.fl. lå i to filer. Løst med UMD-modul som brukes av både browser og Node.
- **Rate limiting:** `position_update` hadde ingen frekvensbegrensning. Løst med 20 ms-grense på server.
- **Interpolasjon:** Remote-spillere hoppet rett til ny posisjon. Løst med lerp per tick.

---

## 5. Diskusjon

### Hva funket

**AI-drevet scaffolding fra scratch** fungerte svært godt. Claude Code valgte en fornuftig tech stack (Phaser 3 + Socket.io + Express) og produserte en fungerende multiplayer-prototype i første iterasjon. Planleggingsfasen (ExitPlanMode) var nyttig for å avklare scope og tech-valg *før* koding startet, noe som reduserte omarbeid.

**Prosedyral generering** av grafikk og lyd – der alt tegnes/genereres i koden uten bildefiler – passet AI-drevet utvikling svært godt. Det eliminerte hele problemstillingen med asset-håndtering og filbaner.

**Parallelle AI-reviews** ga bedre dekning enn én review alene: Sonnet og Opus fant 4 felles funn, men til sammen 15 unike funn som den andre ikke fanget. Å kjøre to modeller parallelt og konsolidere er en effektiv strategi.

**Deterministisk klient-simulering** av fiender (alle klienter kjører identisk AI-logikk, kun hendelser synkroniseres) er en arkitektur Claude valgte selv og som fungerte bra på LAN og cloud.

### Hva funket ikke

**Reconnect-håndtering** var en blindsone. Claude genererte ikke idempotente spawn-funksjoner i første runde; dette er et mønster som ikke er åpenbart ved lokal testing (ingen reconnect), men som alltid inntreffer på cloud-plattformer. Det krever eksplisitt instruksjon eller testing i riktig miljø for å avdekke.

**Sikkerhetssvakheter ved første generering:** Klient-autoritativ tilstand (klienten kan sende hva som helst og server stoler på det) dukket opp automatisk fordi det er enkleste implementasjon. Uten eksplisitt review eller sikkerhetsinstuksjon i CLAUDE.md ville dette blitt med videre.

### Begrensninger

- Utviklingsdelen og review-delen ble gjennomført av to ulike personer (Per Spilling og Runar Opsahl) på separate maskiner, men begge i samme økt. Det er ikke kontrollert for variasjon i prompte-stil mellom de to.
- Spillet er ikke testet med 4 samtidige spillere over lang tid; det finnes trolig ytterligere edge cases i synkroniseringslogikken.
- Review-sammenligning (Sonnet vs. Opus) er basert på én kjøring per modell; stokastisk variasjon er ikke kontrollert for.

---

## 6. Konklusjon

Claude Code kan ta et ikke-trivielt, sanntids multiplayer-spill fra null til deployet produkt i én arbeidsøkt uten at mennesket skriver kode – men **sikkerhetsegenskaper og reconnect-robusthet krever eksplisitt oppmerksomhet**, enten via instruksjoner i CLAUDE.md, dedikert review-runde, eller testing i produksjonslikt miljø. Å kjøre to AI-modeller parallelt i review-runden ga målbart bredere dekning enn én modell alene, og er et enkelt tiltak med høy avkastning.
