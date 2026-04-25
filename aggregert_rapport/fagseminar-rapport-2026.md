# Fagseminar Vår 2026 – Aggregert forskningsrapport

**Dato:** 25. april 2026  
**Deltakere:** 11 grupper, ~35 deltakere  
**Kontekst:** Intern fagdag hos Scienta om AI-assistert utvikling  

---

## Sammendrag

Elleve grupper gjennomførte eksperimenter innenfor fire av fem tema: bruk av AI-agenter i daglig utvikling, AI-assistert systemutvikling, lokale språkmodeller i praksis, og koordinering av parallelle kodeagenter. Alle grupper som bygde applikasjoner leverte fungerende produkter – noe som i seg selv er et resultat. De mest interessante funnene handler ikke om *om* AI fungerer, men *hvordan* og *når* ulike tilnærminger er mest effektive.

**De viktigste funnene på tvers av tema:**

- Funksjonelle applikasjoner kan bygges fullt agentic av alle erfaringsnivåer – for enkle oppgaver
- Promptestrategi og spesifikasjonsnivå har større effekt enn valg av verktøy eller erfaring med verktøyet
- Det er en reell avveining mellom kodekvalitet (iterativ styring) og regelkomplettering (detaljert spec): det du ikke spør om, blir ikke implementert
- AI har systematiske blindsoner: runtime-miljø, visuell rendering, og sikkerhet ved systemgrenser
- En ikke-teknisk produkteier kan styre utvikling direkte med riktig strukturert dialog
- Strukturert spesifikasjonsrammeverk forbedrer planlegging, men garanterer ikke bedre kode
- Lokale modeller er ikke modne for selvstendig agentbruk, men hybrid-orkestrering med skymodell er lovende
- Parallelle agenter krever eksplisitt kontraktstyring – kontrakten er flaskehalsen, ikke agentene

---

## Tema 1 – Utvikler + agent i praksis

*Gruppe 1.1 (Knut Helge, Sindre, Christian), Gruppe 1.3 (Vegard Angell, Felix Rabe, Rune Storløpa, Rafael Winterhalter) og Gruppe 1.5 (Julian Jark, Filip Egge, Erlend Kraft)*

### Forskningsspørsmål

- Kan en funksjonell beskrivelse av en ferdig app brukes til å gjenskape appen i nye tech stacks? (1.1)
- Gjør erfaring med Claude Code en målbar forskjell? Gir samme prompt svært ulike resultater på tvers av modeller? (1.3)
- Gir en iterativ feedback-loop med agenten et bedre resultat enn å skrive én stor, detaljert bestilling? (1.5)

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

### Gruppe 1.5 – Feedback-loop vs. én stor bestilling

Gruppen bygde terminal-basert BlackJack i TypeScript i to varianter: Variant A fikk én detaljert spesifikasjon (regler, tekniske krav, ferdig-kriterier) og leverte uten inngripen. Variant B startet med en bevisst minimal bestilling og ble iterert med 11 korte tilbakemeldinger om struktur, immutability, navngivning og feilhåndtering.

**Hovedresultater:**

| Mål | Variant A (én bestilling) | Variant B (feedback-loop) |
|---|---|---|
| Tid | ~2 min | ~55 min |
| Inngripener | 0 | 11 iterasjoner |
| Linjer kode | 182 | 122 |
| Max cyclomatic complexity | ~16 | ~5 |
| Regeldekning vs. spec | Komplett | Mangler 3 regler |
| Runtime-bugs funnet | 0 (ikke testet) | 1 (fanget og fikset) |

**Kvalitetsvurdering:**

| Dimensjon | Vinner |
|---|---|
| Kompleksitet / struktur | B (lavere CC, renere funksjoner) |
| Testbarhet | B (rene funksjoner med GameState inn/ut) |
| Korrekthet / regeldekning | A (komplett, inkl. edge-cases) |
| Type-presisjon | A (literal unions for Rank og Suit) |

**Funn:**
- Iterativ feedback-loop ga klart bedre kodekvalitet: lavere kompleksitet, bedre separasjon, høyere testbarhet
- Én stor bestilling ga bedre regeldekning: det du ikke spør om, blir ikke implementert
- B fanget en ekte runtime-bug (AbortError ved Ctrl+C) som aldri ville blitt oppdaget med A
- Iterativ loop korrigerer agentens dårlige vaner (lat navngivning, ikke-fungerende feilhåndtering) som en stor bestilling aldri fanger
- For kjente oppgaver med god spec er én bestilling 27× raskere

### Tema 1 – Oppsummering

Fullt agentic funksjonerer overraskende godt for alle erfaringsnivåer, men oppgavens vanskelighetsgrad må matche det man ønsker å teste. Funksjonelle beskrivelser kan brukes som effektive prompts for gjenproduksjon. Det finnes en reell avveining mellom iterativ kvalitetsforbedring og komplettering: iterativ loop gir bedre arkitektur og fanger runtime-bugs, men kan miste regeldekning. En detaljert spec gir god dekning men dårligere struktur. Modellvalg gir synlige forskjeller i arkitektur og stil selv ved identisk prompt.

---

## Tema 2 – AI-assistert systemutvikling

*Gruppe 1.2 (Per Spilling, Runar Opsahl, Espen Myklevoll, Fred-Inge Henden), Gruppe 2.1 (Nils-Christian Haugen, Stein Grimstad, Ingvild Hardeng, Fredrik Meyer), Gruppe 2.2 (Espen Skjæran, Steinar Haug, Jan-Erik Bergmann) og Gruppe 2.3*

### Forskningsspørsmål

- Iterativ utvikling vs. planlagt TDD-basert utvikling for multiplayer-spill – hvilke blindsoner har de? (1.2)
- Kan en ikke-teknisk PO styre AI-assistert utvikling gjennom strukturert dialog? (2.1)
- Påvirker planning mode ressursbruk og kvalitet sammenlignet med ukontrollert generering? (2.2)
- Gir et strukturert spesifikasjonsrammeverk (spec-kit) mer forutsigbare resultater enn frihåndsspesifisering? (2.3)

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

### Gruppe 2.3 – Spec-kit-rammeverk vs. frihåndsspesifisering

Gruppen bygde en License & Subscription Tracker i to varianter: med spec-kit (strukturert PDCA-syklus: constitution → spec → plan → tasks → implement → check) og uten rammeverk (frihåndsbeskrivelse som organisk ble strukturert med user stories og tasks). Begge varianter brukte OpenCode som agent.

**Prosess-sammenligning:**

| Mål | Med spec-kit | Uten spec-kit |
|---|---|---|
| Avklaringsspørsmål til agent | 1 | 3 |
| Stopp i arbeidsflyten | 1–2 | 5 |
| Scope-endringer | 1 | 2 |
| Sporbarhet kode → krav | ~90% | ~90% |
| Tidsbruk | ~2,5 timer | ~2–3 timer |
| Presishet (krav impl. korrekt) | ~85% | ~85% |

**Kodekvalitet (vurdert av både Claude og OpenCode/DeepSeek):**

| Dimensjon | Med spec-kit | Uten spec-kit |
|---|---|---|
| Arkitektur | Hexagonal (domain → adapters) | Lagdelt (controller → service → repository) |
| Domenemodell | 5 entiteter | 2 entiteter |
| DTOs / API-grensesnitt | Ingen – entity eksponeres direkte | Ja – Request/Response adskilt |
| Feilhåndtering | Kun 404 | GlobalExceptionHandler |
| Idempotent varsling | Nei | Ja (NotificationLog) |
| Konfigurerbar webhook | Nei (hardkodet TODO) | Ja (via @Value) |
| Tester | ~5 unit-tester (~40% dekning) | 22 unit-tester (~60% dekning) |

**Funn:**
- Spec-kit reduserte tvetydighet i planleggingsfasen målbart: færre avklaringsspørsmål, færre stopp, rikere spesifikasjon
- Spec-kit ga bedre kravkvalitet: statushåndtering og audit-log ble definert i spec-fasen – den frie tilnærmingen spesifiserte aldri disse
- Men bedre planlegging ga ikke bedre kode: uten-spec-kit-implementasjonen var mer produksjonsklar (DTOs, idempotent varsling, konfigurerbar webhook, GlobalExceptionHandler)
- Spec-kit's egne quality gates (`speckit.check`) fanget ikke hardkodet webhook, manglende API-validering eller fraværende DTOs
- TDD-målet (≥80% dekning) ble ikke nådd – faktisk oppnådd var ~40%, mens uten-varianten oppnådde ~60% uten eksplisitt mål
- Sammenligningsgrunnlaget sviktet delvis: den "frie" tilnærmingen endte opp med å lage egne user stories og tasks manuelt

### Tema 2 – Oppsummering

AI-assistert systemutvikling fungerer fra idé til produksjon, men har systematiske blindsoner: runtime-miljø, visuell rendering, og dataformat-antakelser. Detaljert spesifikasjon er viktigere enn planning mode. Strukturert PO-dialog med flervalg demokratiserer utviklingsstyring til ikke-tekniske brukere. Spesifikasjonsrammeverk forbedrer planlegging og kravkvalitet, men gapet mellom spec og implementasjon er reelt – det kreves aktiv oppfølging av quality gates for at bedre spec skal omsettes til bedre kode. Parallell kodegjennomgang med to modeller øker dekningsgraden vesentlig.

---

## Tema 3 – Lokal LLM i praksis

*Gruppe 3.1, Gruppe 3.2 (Johan, Daniel, Hakon, Kjetil) og Gruppe 3.3 (Thomas Gran, Anders, Bartas Venckus)*

### Forskningsspørsmål

- Når fungerer lokale modeller godt nok for agent-basert koding, og hva taper vi sammenlignet med skybaserte modeller? (3.2)
- Kan lokale LLM-er brukes som praktiske kodingsassistenter i en flerstegs agentarbeidsflyt? (3.3)
- Klarer en lokal modell å følge en kompleks implementasjonsplan sammenlignet med en skybasert modell? (3.1)

### Gruppe 3.1 – Skymodell vs. lokal modell på identisk plan

Gruppen genererte en detaljert implementasjonsplan (SNAKE-PLAN.md) for et terminalbasert Snake-spill i Java 25, og lot to ulike agenter implementere fra samme plan: Claude Code med Sonnet 4.6 (sky) og OpenCode med Gemma4 (lokalt via Ollama).

**Resultater:**

| Mål | Claude Code (Sonnet 4.6) | OpenCode (Gemma4) |
|---|---|---|
| Kompilering første forsøk | Ja | Nei |
| Totaltid til spillbart spill | 13 minutter | Avbrutt – kom ikke i mål |
| Bugfixer nødvendig | 4 (2 var regresjoner fra en tidligere fiks) | N/A |
| Fulgte planen | Ja, tett | Klarte ikke å følge flerlags-planen |

**Tilleggseksperiment (mcalert-analyse):**
Gruppen brukte også lokal modell (Gemma4 via OpenCode) til å analysere et macOS-overvåkningsverktøy (mcalert). Observasjoner: Ollama på Mac presterer vesentlig bedre enn på Linux under lignende belastninger; modeller oppfører seg forskjellig avhengig av plattform.

**Funn:**
- Skymodellen fulgte planen og leverte spillbart spill på 13 minutter (med 4 bugfixer)
- Lokal modell klarte ikke kompilering og ble avbrutt – evnen til å følge en kompleks, flerlags implementasjonsplan er for svak
- Selv skymodellens bugfixer introduserte regresjoner – en fiks skapte 2 nye feil

### Gruppe 3.2 – Agentbasert skatteberegner

Agentene fikk i oppgave å lage en Python-kommandolinjeapplikasjon som leser inn skattedata og beregner skattebetalinger. Oppgaven ble gitt på engelsk for å eliminere språkforskjeller.

| Betingelse | Modell | Agent | Resultat |
|---|---|---|---|
| Baseline | Claude Opus 4.7 | Claude Code | Fungerte på 7–8 minutter |
| Variant | glm-4.7-flash:q4_K_M | Claude Code | Fungerte, 1t 45min, 1 krones avvik |
| Variant | qwen3.6:35b | Claude Code | Fungerte, 90 min (Mac M2 Pro, 36G) |
| Variant | gemma4:8b | OpenCode | Feilet – klarte ikke innlesing |
| Variant | Diverse små modeller | Claude Code | Forstår ikke oppgaven / verktøybruk |

**Funn:**
- Lokale modeller har fundamentale problemer med verktøybruk (fil-lese/skriveoperasjoner) som er nødvendig for agent-workflows
- De minste modellene forstår ikke engang at de har fått en oppgave
- Modeller som lyktes (glm-4.7-flash, qwen3.6) brukte 12–22× mer tid enn Claude
- Integrasjonen mellom agenter og lokale modeller er ikke vanntett

### Gruppe 3.3 – Lokale modeller som kodingsassistenter

Gruppen testet to lokale modeller (llama3.1:8b og qwen3.6) på to kodebaser: en Python Blackjack med 24 tester og OpenTripPlanners RAPTOR-modul (real-world Java). Alle oppgaver ble kjørt i en flerstegs flyt: forstå → planlegge → implementere → teste.

**Blackjack-eksperiment (`is_soft`-property):**

| Mål | llama3.1:8b (CPU) | qwen3.6 (GPU, think=false) |
|---|---|---|
| Forsøk til korrekt kode | 4 | 1 |
| Hallusinering av API | Ja (uten kildekode som kontekst) | Nei |
| Total tid | ~135 sek (4 kall) | 133 sek (1 kall) |
| Tester grønne etter | 24/24 | 30/30 (inkl. 6 nye) |

**Java real-world (OTP Early Pruning):**
Llama3.1:8b ble brukt som delassistent med Thomas som orkestrator:
- Llama bidro med ~60% av koden (sortering + struktur)
- Claude (skymodell) supplerte med ~40% (fullstendig metodekropp, McRAPTOR-variant)
- Resultat: 917 tester i raptor-modulen grønne

**Viktige observasjoner:**
- qwen3.6 thinking-modus er ubrukelig med num_ctx < 32K: thinking-tokens fyller kontekstvinduet, ingen plass til svar
- Uten full kildekode som kontekst hallusinerer llama3.1:8b konsekvent API-et (f.eks. `Rank.ESS`, `hand.add_card()`)
- llama3.1:8b klarer ikke å holde oversikt over to metoder samtidig – metodekropper ble ufullstendige

**Funn:**
- En sterkere lokal modell (qwen3.6) er vesentlig mer robust enn en enklere (llama3.1:8b), men krever riktig konfigurasjon
- Uten full kildekode som kontekst hallusinerer selv gode modeller API-et
- **Hybrid-orkestrering** er den mest praktiske arbeidsformen: skybasert modell leser filer og supplerer, lokal modell tar avgrensede deloppgaver der konteksten er komplett
- Prompt-engineering hjelper: eksplisitt pseudokode + full kildekode løftet llama3.1:8b til korrekt resultat

### Tema 3 – Oppsummering

Tre grupper gir et samstemt bilde: lokale LLM-er er ikke modne for selvstendig agent-basert koding. De sliter med verktøybruk, klarer ikke å følge komplekse planer, og hallusinerer API-er når konteksten er ufullstendig. Tidsbruken er 12–22× høyere enn skybaserte modeller for oppgaver de faktisk klarer. Men bildet er nyansert: sterkere lokale modeller (qwen3.6, glm-4.7-flash) viser reell kapasitet på avgrensede oppgaver, og **hybrid-orkestrering** – der lokal modell tar deloppgaver og skymodell orkestrerer – er en lovende praktisk tilnærming som gruppen 3.3 demonstrerte med 60/40-fordeling på en real-world Java-kodebase.

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

| Blindsone | Eksempel | Gruppe |
|---|---|---|
| Runtime-miljø | WebSocket reconnect-håndtering ved deploy til Railway | 1.2 |
| Dataformat-antakelser | Instagram-eksportens faktiske mappestruktur | 2.1 |
| Visuell korrekthet | Bugs som kun vises på skjerm, ikke i tester | 1.2 |
| Sikkerhet ved systemgrenser | Manglende inputvalidering, JSON-injection | 2.3 |
| SQL-reserverte ord | `Group`-tabell feilet i produksjonsdatabase | 4.1 |
| Halvferdige implementasjoner | TypeScript-migrering startet men ikke fullført | 2.2 |
| Runtime-feilhåndtering | AbortError ved Ctrl+C ikke fanget av tester | 1.5 |

**Implikasjon:** Lokal testing og enhetstester er nødvendig, men ikke tilstrekkelig. Testing med ekte data i produksjonslikt miljø er avgjørende.

### 2. Spesifikasjon og strategi trumfer verktøyvalg

Funn fra fire uavhengige grupper peker i samme retning:
- Erfaring med Claude Code ga ikke bedre resultater for enkle oppgaver (1.3)
- Detaljert spesifikasjon hadde større effekt enn planning mode (2.2)
- Flervalg-strukturert dialog ga ikke-tekniske PO-er full produktkontroll (2.1)
- Inkrementell agentic-styring ga bedre struktur enn én bred prompt (1.3, 1.5)

### 3. Det finnes en reell avveining mellom kvalitet og komplettering

Gruppe 1.5 demonstrerte dette tydeligst: iterativ feedback-loop ga 3× lavere kompleksitet og bedre testbarhet, men mistet tre BlackJack-regler. Én stor bestilling med god spec implementerte alt korrekt, men med dårligere arkitektur. Gruppe 2.3 viste en lignende dynamikk: spec-kit ga bedre kravkvalitet men dårligere implementasjonskvalitet. Implikasjonen er at man trenger *både* god spec *og* aktiv review – verken spec alene eller iterasjon alene er tilstrekkelig.

### 4. Parallell AI-gjennomgang øker dekning

Gruppe 1.2 fant at parallell kodegjennomgang med to modeller (Sonnet + Opus) ga 15 unike funn mot 9 og 6 ved bruk av én modell. Overlapp var bare 4 funn. Dette antyder at modeller har ulike sterksider og at parallell review er kostnadseffektivt.

### 5. Iterasjonshastighet er et konkurransefortrinn

Fra gruppe 2.1: PO sa "teksten er for lang" – 2 minutter senere var prompten endret og ny output klar. Fra PO-feedback til implementert feature: 2–4 minutter konsekvent. Fra gruppe 1.5: 11 iterasjoner på 55 minutter, med vesentlig kvalitetsløft per runde. Denne hastigheten er fundamentalt raskere enn tradisjonelle utviklings-PO-sykler.

### 6. Kontraktstyring er den kritiske menneskelige rollen ved multi-agent

Gruppe 4.1 viste at menneskelig koordinering handler om kontraktstyring, ikke koding. API-kontrakt som levende dokument, eksplisitt kommunikasjon til riktig agent, og håndtering av avvik – dette er det menneskene faktisk bidro med.

### 7. Lokale modeller: ikke klare alene, men hybrid-orkestrering er lovende

Tre grupper (3.1, 3.2, 3.3) viser et konsistent mønster:
- Selvstendig agentic bruk feiler for de fleste lokale modeller
- Sterkere modeller (qwen3.6, glm-4.7-flash) klarer avgrensede oppgaver, men bruker 12–22× mer tid
- Hybrid-modellen der lokal modell tar delsteg og skymodell orkestrerer fungerer praktisk (60/40-fordeling i 3.3)
- Kontekst er kritisk: uten full kildekode hallusinerer lokale modeller API-er

---

## Konklusjon

Fagseminaret demonstrerer at AI-assistert utvikling har nådd et punkt der fungerende applikasjoner kan leveres på timer – av alle erfaringsnivåer, inkludert ikke-tekniske produkteiere. Det er ikke lenger et spørsmål om *om* AI kan hjelpe, men om hvilke strategier, strukturer og sikkerhetsmekanismer som gir de beste resultatene.

### Samlet læring – 10 punkter

1. **AI-agenter gir høy fart, men fjerner ikke behovet for styring.** Team som kom raskt i mål hadde tydelig scope, korte feedback-looper og eksplisitte kontrollpunkter.

2. **Tidlig kjøring med ekte data er avgjørende.** Mange av de viktigste feilene ble ikke fanget av tester eller planlegging, men først når løsningen ble kjørt mot faktisk runtime, ekte input og ekte brukerflyt.

3. **Tester alene er ikke nok.** Enhetstester og grønn build ga ofte falsk trygghet; visuelle feil, deploy-feil, miljøfeil, sikkerhetshull og interaktive bugs slapp likevel gjennom.

4. **Spesifikasjon hjelper planlegging, men garanterer ikke bedre kode.** Strukturert spec ga bedre kravkvalitet, sporbarhet og arbeidsdeling, men verken spec-kit eller detaljert plan garanterte bedre implementasjonskvalitet. Gapet mellom spec og kode er der den reelle risikoen ligger.

5. **Promptestrategi og iterasjonsmodus betyr mye.** Inkrementell styring gir bedre arkitektur og fanger dårlige vaner; én stor bestilling gir bedre regeldekning. Det du ikke ber om, blir ikke implementert. Valg av strategi bør tilpasses oppgavens art.

6. **Uavhengig review er svært verdifullt.** Parallelle AI-reviews med ulike modeller fant 67% flere unike problemer enn enkeltmodell-review. Kvalitetskontroll bør ikke overlates til implementasjonsagenten alene.

7. **PO-rollen blir viktigere, ikke mindre.** Når utviklingshastigheten øker, blir kvaliteten på problemforståelse, prioritering og avklaringer en større flaskehals enn selve kodinga.

8. **Ikke-tekniske roller kan komme mye nærmere utvikling enn før.** En PO kan styre krav, valg og iterasjoner direkte gjennom strukturert dialog med agenten. Hovedbarrieren er teknisk oppsett og miljøfriksjon, ikke selve utviklingsdialogen.

9. **Flere agenter i parallell fungerer, men bare med tydelig kontrakt.** Kontrakten er flaskehalsen, ikke agentene. Når ansvar, API-kontrakt og "single source of truth" er klart definert, fungerer samarbeidet godt; når kontrakten er ufullstendig, oppstår friksjon.

10. **Lokale modeller er et supplement – hybrid-orkestrering er veien videre.** Lokale modeller sliter med verktøybruk, oppgaveforståelse og komplekse planer, men hybrid-flyten der skymodell orkestrerer og lokal modell tar avgrensede deloppgaver er en lovende praktisk tilnærming.

---

*Rapporten er basert på eksperimentrapporter fra gruppene 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3 og 4.1. Tema 5 (personlig assistent) er ikke representert i datamaterialet.*
