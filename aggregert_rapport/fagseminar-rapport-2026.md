# Fagseminar Vår 2026 – Aggregert forskningsrapport

**Dato:** 25. april 2026  
**Deltakere:** 9 grupper, ~30 deltakere  
**Kontekst:** Intern fagdag hos Scienta om AI-assistert utvikling  

---

## Sammendrag

Ni grupper gjennomførte eksperimenter innenfor fire tema: bruk av AI-agenter i daglig utvikling, AI-assistert systemutvikling, lokale språkmodeller i praksis, og koordinering av parallelle kodeagenter. Alle grupper som bygde applikasjoner leverte fungerende produkter – noe som i seg selv er et resultat. De mest interessante funnene handler ikke om *om* AI fungerer, men *hvordan* og *når* ulike tilnærminger er mest effektive.

**De viktigste funnene på tvers av tema:**

- Funksjonelle applikasjoner kan bygges fullt agentic av alle erfaringsnivåer – for enkle oppgaver
- Promptestrategi og spesifikasjonsnivå har større effekt enn valg av verktøy eller erfaring med verktøyet
- AI har systematiske blindsoner: runtime-miljø, visuell rendering, og sikkerhet ved systemgrenser
- En ikke-teknisk produkteier kan styre utvikling direkte med riktig strukturert dialog
- Lokale modeller er foreløpig ikke modne for agent-bruk til koding
- Parallelle agenter krever eksplisitt kontraktstyring – kontrakten er flaskehalsen, ikke agentene

---

## Tema 1 – Utvikler + agent i praksis

*Gruppe 1.1 (Knut Helge, Sindre, Christian) og Gruppe 1.3 (Vegard Angell, Felix Rabe, Rune Storløpa, Rafael Winterhalter)*

### Forskningsspørsmål

- Kan en funksjonell beskrivelse av en ferdig app brukes til å gjenskape appen i nye tech stacks? (1.1)
- Gjør erfaring med Claude Code en målbar forskjell? Gir samme prompt svært ulike resultater på tvers av modeller? (1.3)

### Gruppe 1.1 – Iterativ utvikling og funksjonell beskrivelse

Gruppen bygde en musikk-quizapp iterativt over ~15 prompts. Deretter ba de Claude om å generere en generell funksjonell beskrivelse av appen – og brukte denne beskrivelsen som prompt for å bygge appen helt på nytt, med ulike tech stacks.

**Funn:**
- Alle regenererte applikasjoner fungerte med minimalt av bugs
- Ulike tech stacks, tilnærmet lik funksjonalitet
- En vel utarbeidet funksjonell beskrivelse kan erstatte iterativ prosess for kjente problemdomener

**Sitat fra rapporten:** *"Man sitter aldri fast og får en god sparringspartner som kommer med forslag og alternativer."*

### Gruppe 1.3 – Erfaringsnivå og modellsammenligning

**Eksperiment 1:** Fire deltakere med ulik erfaring bygde Snake-spill fullt agentic. Alle fikk kjørende spill etter første prompt. Erfaringen viste seg i tilnærmingen, ikke resultatet.

| Deltaker | Tilnærming | Resultat |
|---|---|---|
| Felix (erfaren) | Én bred instruksjon | Kjørende spill |
| Rafael (erfaren) | Én bred instruksjon | Kjørende spill |
| Rune (lite erfaren) | Én bred instruksjon | Kjørende spill |
| Vegard (lite erfaren) | Inkrementell styring | Annerledes, mer strukturert spill |

**Eksperiment 2:** 19 AI-modeller fikk identisk prompt. 16/19 leverte spillbare spill.

| Kategori | Modell |
|---|---|
| Mest polert | gpt-5.2 (ARIA, auto-pause, DPR-aware canvas) |
| Beste arkitektur | claude-opus-4.7 (state machine, pause, keyboard hints) |
| Mest kompakt | claude-opus-4.6 (124 linjer, fullt spillbar) |
| Raskest | gemini-3-flash-preview (27 sekunder) |
| Feilet | gpt-4.1, gpt-4o (ingen output) |

**Funn:**
- Promptestrategi har større innvirkning enn verktøyvalg og erfaring – for enkle, veldefinerte oppgaver
- Inkrementell agentic styring ga annerledes og potensielt bedre strukturert kode enn én bred bestilling
- Modeller klustrer i tydelige stilgrupper – claude-sonnet-4 og sonnet-4.5 er nesten identiske
- Oppgavens kompleksitet er avgjørende: for å se erfaringsforskjeller kreves mer komplekse oppgaver

### Tema 1 – Oppsummering

Fullt agentic funksjonerer overraskende godt for alle erfaringsnivåer, men oppgavens vanskelighetsgrad må matche det man ønsker å teste. Funksjonelle beskrivelser kan brukes som effektive prompts for gjenproduksjon. Modellvalg gir synlige forskjeller i arkitektur og stil selv ved identisk prompt.

---

## Tema 2 – AI-assistert systemutvikling

*Gruppe 1.2 (Per Spilling, Runar Opsahl, Espen Myklevoll, Fred-Inge Henden), Gruppe 2.1 (Nils-Christian Haugen, Stein Grimstad, Ingvild Hardeng, Fredrik Meyer), Gruppe 2.2 (Espen Skjæran, Steinar Haug, Jan-Erik Bergmann)*

### Forskningsspørsmål

- Iterativ utvikling vs. planlagt TDD-basert utvikling for multiplayer-spill – hvilke blindsoner har de? (1.2)
- Kan en ikke-teknisk PO styre AI-assistert utvikling gjennom strukturert dialog? (2.1)
- Påvirker planning mode ressursbruk og kvalitet sammenlignet med ukontrollert generering? (2.2)

### Gruppe 1.2 – Iterativ vs. planlagt multiplayer-utvikling

Begge undergrupper bygde et nettbasert multiplayer-plattformspill (Mario-inspirert) fra scratch – uten at menneskene selv skrev kode – og deployet til Railway. Tilnærmingene var:

- **1_2_1 (iterativ):** Minimal planlegging, mye live-testing
- **1_2_2 (planlagt):** Detaljert spec, TDD-basert iterasjon

**Resultater:**

| Aspekt | Iterativ (1_2_1) | Planlagt (1_2_2) |
|---|---|---|
| Tester | 31 grønne | 31 grønne |
| Reconnect-bugs oppdaget | Tidlig, ved live-test | Sent, ved første deploy |
| Arkitekturkvalitet | Lavere | Høyere |
| Visuell polering | Høyere (live-testing) | Lavere |
| Blindsoner | Arkitekturell gjeld | Runtime-miljø, visuell rendering |

**Parallell AI-kodegjennomgang (tilleggseksperiment):**
Gruppen testet parallell kodegjennomgang med Sonnet og Opus:

| Modell | Unike funn |
|---|---|
| Sonnet | 6 |
| Opus | 9 |
| Overlapp | 4 |
| **Totalt unike funn** | **15** |

**Funn:**
- Begge tilnærminger leverte fungerende spill med samme testdekning
- Iterativ tilnærming fanger praktiske runtime-problemer tidlig; planlagt tilnærming fanger arkitekturell kvalitet
- Parallell kodegjennomgang med to modeller gir 67% flere unike funn enn én modell alene
- TDD og enhetstester sier ingenting om visuell korrekthet, miljø-spesifikke bugs, eller deployment-problemer

### Gruppe 2.1 – PO-drevet utvikling

En ikke-teknisk produkteier (Stein) styrte utviklingen av en komplett Instagram-innholdsapp ("Konro Content Tool") gjennom strukturert dialog med Claude Code. Utvikleren (Nils-Christian) fasiliterte dialogen uten å skrive kode.

**Tidsforbruk:**

| Fase | Varighet |
|---|---|
| Brainstorming (idé → godkjent design) | ~38 min |
| Implementeringsplan | ~9 min |
| Implementering (12 oppgaver, 15 filer, 29 tester) | ~22 min |
| Testing med ekte data + bugfiks | ~26 min |
| PO-drevne iterasjoner | ~28 min |
| **Total: idé til ferdig, testet app** | **~2 timer** |

**PO tok alle vesentlige produktbeslutninger** gjennom flervalg-dialog:
- Datakilde, scope, eksportformat, teksttone, musikksjangre, UI-type

**Bugs funnet med ekte data (ingen av disse ville blitt funnet med syntetiske testdata):**
- Instagram-eksportens mappestruktur brukte dynamisk prefix
- Norske tegn eksportert som Latin-1 byte-sekvenser
- CORS-feil ved Claude API-kall
- Safari-caching av gammel JavaScript

**Sesjon 2 – PO alene uten utvikler:**  
PO fortsatte etter første sesjon og la til nye features på egenhånd, inkludert individuell eksportfunksjon per post. PO oppdaget og korrigerte feil tolkning fra Claude uten teknisk hjelp.

**Funn:**
- En ikke-teknisk PO kan styre fullstendig applikasjonsutvikling med flervalg-basert strukturert dialog
- Iterasjonshastigheten matcher samtaletempoet – 2 minutter fra feedback til endring
- Ekte data avslørte alle reelle bugs; syntetiske testdata ville ikke fanget noen av dem
- Primær barriere for selvstendige PO-er: teknisk oppsett (installasjon, miljø), ikke selve utviklingsdialogen

### Gruppe 2.2 – Planning mode vs. uten planning

Tre betingelser fikk samme oppgave: "*Lag en web-applikasjon for vedlikehold av matoppskrifter*"

| Betingelse | Tid | Stack | Spontane funksjoner |
|---|---|---|---|
| A – Kort prompt (baseline) | 7m 57s | Spring Boot + H2 + Vanilla JS | Ingen |
| B – Detaljert spec, ingen planning | 14m 45s | Spring Boot + MySQL + TypeScript | TypeScript, paginering, tester |
| C – Detaljert spec + planning mode | 23m 31s | Spring Boot + MySQL + React JSX | Konsistent arkitektur |

**Funn:**
- Alle tre betingelser produserte fungerende applikasjoner
- Betingelse B genererte spontant mer avanserte features enn spesifisert (TypeScript, paginering, testsuites) – men startet en TypeScript-migrering som aldri ble fullført
- Planning mode (C) ga den mest konsistente arkitekturen – ett DTO-lag, enklere avhengigheter
- Planning mode stilte mange lavnivå-spørsmål (kjøre npm?), men ingen om arkitekturvalg
- **Viktigste funn:** Detaljert spesifikasjon har større effekt på resultatkvalitet enn planning mode alene

### Tema 2 – Oppsummering

AI-assistert systemutvikling fungerer fra idé til produksjon, men har systematiske blindsoner: runtime-miljø, visuell rendering, og dataformat-antakelser. Detaljert spesifikasjon er viktigere enn planning mode. Strukturert PO-dialog med flervalg demokratiserer utviklingsstyring til ikke-tekniske brukere. Parallell kodegjennomgang med to modeller øker dekningsgraden vesentlig.

---

## Tema 3 – Lokal LLM i praksis

*Gruppe 3.2 (Johan, Daniel, Hakon, Kjetil)*

### Forskningsspørsmål

Når fungerer lokale modeller godt nok for agent-basert koding, og hva taper vi sammenlignet med skybaserte modeller?

### Eksperiment

Agentene fikk i oppgave å lage en Python-kommandolinjeapplikasjon som leser inn skattedata og beregner skattebetalinger.

| Betingelse | Modell | Resultat |
|---|---|---|
| Baseline | Claude Code med Opus 4.7 | Fungerte umiddelbart |
| Variant | Claude Code med lokal modell (via Ollama) | Se tabell under |

**Lokale modeller testet:**

| Modell | Resultat |
|---|---|
| gemma4:8b (og lignende) | Klarer ikke bruke verktøy (tools), forstår ikke oppgaven |
| Diverse små modeller | Forstår ikke engang AT DE HAR FÅTT en oppgave |
| glm-4.7-flash:q4_K_M | Fungerte, men brukte 1 time og 45 minutter |

**Funn:**
- Claude Code mangler som standard tools for fil-lese/skriveoperasjoner med lokale modeller
- Lokale modeller klarer ikke verktøybruk, som er fundamentalt for agent-workflows
- GLM-4.7-flash var eneste modell som løste oppgaven – med 1% avvik og 105 minutter ekstra tidsbruk
- Ressurskrav for modeller som faktisk fungerer er høye

### Tema 3 – Oppsummering

Lokale LLM-er er foreløpig ikke modne for agent-basert koding i daglig bruk. Selv enklere oppgaver krever verktøybruk som de fleste lokale modeller ikke mestrer. Skybaserte modeller (Claude) er dramatisk overlegne på tid, kvalitet og reliabilitet.

---

## Tema 4 – Flere parallelle kodeagenter

*Gruppe 4.1 (Are Fossli Viberg, Maria Selivanova)*

### Forskningsspørsmål

Kan flere parallelle kodeagenter (backend, frontend, tester) bygge en fungerende fullstack-applikasjon koordinert av en menneskelig koordinator, og hva krever det?

### Eksperiment

Gruppen bygde **Session Tracker** – en live fullstack-app for å spore arbeidsøkter og funn på tvers av seminargrupper. Applikasjonen ble bygget med 4 separate agentøkter som jobbet parallelt:

| Agent | Scope | Leveranse |
|---|---|---|
| Koordinatoragent | KOORDINERING.md, API-kontrakt | API-kontrakt, beslutningslogg |
| Backendagent | Kotlin + Spring Boot | REST API, H2-database, alle endepunkter |
| Frontendagent | TypeScript + React | Live polling, kortlayout, tema-farger |
| Testeragent | JUnit 5 + Vitest | Alle tester grønne |

**Koordineringsavvik som ble oppdaget og løst:**

| Avvik | Oppdaget av | Løsning |
|---|---|---|
| `GET /sessions` manglet i kontrakten | Frontendagent ved implementering | Lagt til i kontrakt |
| Seed-data brukte eksempelnavn | Koordinator (menneske) | Oppdatert til faktiske seminargrupper |
| `Group`-tabell kolliderte med SQL-reservert ord | Deployment | Rename i JPA-mapping |

**Funn:**
- Parallelle agenter kan bygge en fungerende fullstack-applikasjon fra scratch på én dag
- `KOORDINERING.md` som single source of truth for API-kontrakt fungerte godt i praksis
- **Kontrakten er flaskehalsen** – avvik oppstår ikke fordi agenter gjør feil, men fordi kontrakten er ufullstendig
- Agentene leser ikke kontraktdokumentet automatisk – koordinatoren må formidle eksplisitt hva som er nytt
- Menneskelig koordinator er nødvendig, men rollen handler om kontrakt-vedlikehold, ikke koding
- TDD-rekkefølge (tester skrives FØR implementasjon) ga en tydelig kontrakt mellom testeragent og implementasjonsagenter

### Tema 4 – Oppsummering

Parallell kodeagent-koordinering er gjennomførbart i praksis, men krever en aktivt vedlikeholdt API-kontrakt og en koordinatorrolle. Arkitekturell planlegging og kontraktetablering er den viktigste menneskelige innsatsfaktoren – ikke selve implementasjonsarbeidet.

---

## Tverrgående funn

### 1. AI har systematiske blindsoner

Alle grupper som deployet til produksjon opplevde bugs som ikke ble fanget i lokal testing:

| Blindsone | Eksempel |
|---|---|
| Runtime-miljø | Reconnect-håndtering i WebSocket ved deploy til Railway |
| Dataformat-antakelser | Instagram-eksportens faktiske mappestruktur |
| Visuell korrekthet | Bugs som kun vises på skjerm, ikke i tester |
| Sikkerhet ved systemgrenser | Ikke fanget av enhetstester |
| SQL-reserverte ord | `Group`-tabell feilet i produksjonsdatabase |

**Implikasjon:** Lokal testing og enhetstester er nødvendig, men ikke tilstrekkelig. Testing med ekte data i produksjonslikt miljø er avgjørende.

### 2. Spesifikasjon og strategi trumfer verktøyvalg

Funn fra tre uavhengige grupper peker i samme retning:
- Erfaring med Claude Code ga ikke bedre resultater for enkle oppgaver (1.3)
- Detaljert spesifikasjon hadde større effekt enn planning mode (2.2)
- Flervalg-strukturert dialog ga ikke-tekniske PO-er full produktkontroll (2.1)
- Inkrementell agentic-styring ga annerledes strukturkode enn én bred prompt (1.3)

### 3. Parallell AI-gjennomgang øker dekning

Gruppe 1.2 fant at parallell kodegjennomgang med to modeller (Sonnet + Opus) ga 15 unike funn mot 9 og 6 ved bruk av én modell. Overlapp var bare 4 funn. Dette antyder at modeller har ulike sterkside og at parallell review er kostnadseffektivt.

### 4. Iterasjonshastighet er et konkurransefortrinn

Fra gruppe 2.1: PO sa "teksten er for lang" – 2 minutter senere var prompten endret og ny output klar. Fra PO-feedback til implementert feature: 2–4 minutter konsekvent. Dette er fundamentalt raskere enn tradisjonelle utviklings-PO-sykler.

### 5. Kontraktstyring er den kritiske menneskelige rollen ved multi-agent

Gruppe 4.1 viste at menneskelig koordinering handler om kontraktstyring, ikke koding. API-kontrakt som levende dokument, eksplisitt kommunikasjon til riktig agent, og håndtering av avvik – dette er det menneskene faktisk bidro med.

---

## Konklusjon

Fagseminaret demonstrerer at AI-assistert utvikling har nådd et punkt der fungerende applikasjoner kan leveres på timer – av alle erfaringsnivåer, inkludert ikke-tekniske produkteiere. Det er ikke lenger et spørsmål om *om* AI kan hjelpe, men om hvilke strategier, strukturer og sikkerhetsmekanismer som gir de beste resultatene.

De viktigste implikasjonene for fremtidig arbeidsflyt:

1. **Invester i spesifikasjon** – en god spec gir bedre resultater enn planning mode eller verktøyvalg
2. **Test med ekte data** – AI-generert kode har blindsoner for runtime og dataformat som enhetstester ikke fanger
3. **Bruk parallell review** – to modeller i kodegjennomgang gir vesentlig bedre dekning enn én
4. **Strukturer PO-dialogen** – flervalg og ett spørsmål om gangen gir ikke-tekniske brukere reell produktkontroll
5. **Ha en API-kontrakt** – ved multi-agent utvikling er kontrakten flaskehalsen, ikke agentenes evner
6. **Bruk skymodeller** – lokale modeller er ikke klare for agent-basert koding i daglig praksis

---

*Rapporten er basert på eksperimentrapporter fra gruppene 1.1, 1.3, 1.2, 2.1, 2.2, 3.2 og 4.1. Tema 5 (personlig assistent) er ikke representert i datamaterialet.*
