# Eksperimentlogg

Bruk denne filen til korte notater underveis i eksperimentet.

## Oppstart

- Dato: 2026-04-23
- Oppgave: Legge til navn på Scienta-konsulenter i gruppeinndelingen (README.MD)
- Handling: 43 konsulenter fordelt alfabetisk på gr1–gr12 (~3–4 per gruppe, 7 grupper à 4 og 5 grupper à 3)
- Resultat: README.MD oppdatert med navn i alle 12 grupper

---

- Gruppe: 1.3
- Tema: Tema 1 – Utvikler + agent i praksis
- Eksperiment: Egen variant av eks. 1 – samme oppgave (Snake-spill), ulikt nivå av agentic coding
- Dato: 2026-04-24
- Deltakere: Vegard Angell, Felix Rabe, Rune Storløpa, Rafael Winterhalter
- Verktøy/modeller: Claude Code (claude-sonnet-4-6)
- Repo / case: https://github.com/Scienta/fagsem_v2026/tree/main/Gruppe_1_3

---

## Eksperimentdesign

**Forskningsspørsmål:** Gjør det en forskjell i bruk av Claude Code om man har erfaring med verktøyet fra før?

**Hypotese:** Erfarne brukere utnytter Claude Code mer effektivt – bedre prompts, kortere iterasjonsløkker, og resultater som er lettere å stole på.

**Oppgave:** Lag et Snake-spill – alle fire deltakere, alle fullt agentic (kun instrukser, ingen manuell koding)

| Betingelse | Verktøy | Erfaring | Deltaker |
|---|---|---|---|
| A – Erfaren | Claude Code CLI | Daglig bruk | Felix |
| B – Erfaren | Claude Code CLI | Daglig bruk | Rafael |
| C – Lite erfaren | Claude Code CLI | Brukt litt | Rune |
| D – Lite erfaren (kontroll) | JetBrains AI + Claude | Brukt litt | Vegard |

Vegard er kontrollbetingelse: samme erfaringsnivå som Rune, men annet verktøy (JetBrains AI med Claude som underliggende modell) – gir sammenligningspunkt for IDE-integrasjon vs. CLI.

**Måles:** Tidsbruk, antall iterasjoner/prompts, kvalitet på resultatet, flyt i arbeidsflyten, opplevd kontroll

---

## Løpende logg

### Oppstart eksperiment – 2026-04-24 13:30

- Valgt eksperiment: Snake-spill, fullt agentic for alle fire
- Opprinnelig plan (ulike nivåer av agentic) ble forkastet – alle valgte å kun gi instrukser
- 3 bruker Claude Code CLI, 1 bruker JetBrains AI med Claude (Vegard)
- Eksperimentet ble dermed: erfaring med verktøyet vs. resultat, med Vegard som verktøykontroll

---

### Resultat – runde 1

- Alle fire fikk et kjørende Snake-spill etter første prompt
- Ingen trengte iterasjoner for å komme til et fungerende spill
- Noen spill var nesten prikk like – tyder på at Claude produserer svært like løsninger for samme oppgave uavhengig av verktøy og brukererfaring
- Observasjon: oppgaven (Snake) var muligens for enkel til å skille erfarne fra uerfarne – agenten "løser seg selv"

### Viktig observasjon – Vegards tilnærming skilte seg ut

- Vegard styrte agenten trinn for trinn: git repo først → filstruktur → funksjonalitet steg for steg
- Resulterte i et annet spill enn de tre andre
- De tre andre (Felix, Rafael, Rune) ga én bred instruksjon og fikk nesten identiske spill – valgte deretter å modifisere i ulike retninger
- Tolkning: promptestrategi (inkrementell styring vs. bred bestilling) ser ut til å påvirke resultatet mer enn erfaring med verktøyet
- Gruppens vurdering: verktøyvalg forklarer ikke forskjellen – Vegard beskriver det som sin naturlige måte å tenke på, ikke et bevisst metodisk valg

---

## Eksperiment 2 – Multisnake: 19 modeller, samme prompt

### Oppsett – 2026-04-24

- Prompt: *"Create a single self-contained HTML file with a fully playable Snake game."*
- Verktøy: OpenCode med GitHub Copilot provider, kjørt parallelt via `run-all-models.sh`
- 19 modeller testet: Claude (haiku/opus/sonnet, ulike versjoner), GPT-5.x, Gemini 2.5/3.x, Grok
- Repo: `Gruppe_1_3/felix-multisnake/`

### Resultater

- 16/19 produserte spillbare spill
- 2 feilet helt (gpt-4.1, gpt-4o – ingen `index.html`)
- 1 ødelagt (grok-code-fast-1 – øyeblikkelig game over pga. self-collision bug)

**Standouts:**

| Kategori | Modell | Begrunnelse |
|---|---|---|
| Mest polert | gpt-5.2 | 841 linjer, ARIA, auto-pause, DPR-aware canvas |
| Beste arkitektur | claude-opus-4.7 | State machine, rAF, pause, keyboard hints |
| Mest kompakt | claude-opus-4.6 | 124 linjer, fullt spillbar |
| Raskest | gemini-3-flash-preview | 27 sekunder |
| Mest unik | gpt-5.2-codex | Wrap-around vegger, "Neon Serpent"-branding |

### Viktige observasjoner

- Modellene klustrer i tydelige stilgrupper – tyder på delt treningsdata eller felles mønstre
- claude-sonnet-4 og sonnet-4.5 er nesten identiske (samme farger, samme bug)
- GPT-5.x-familien deler arkitektur (rAF + localStorage) på tvers av varianter
- Eldre GPT-modeller (4.1, 4o) feilet – klarte ikke å produsere output
- Tokenbruk varierer mye: Gemini bruker mange input-tokens, Claude bruker cache effektivt

### Tolkning

- Samme enkle prompt gir svært ulike resultater på tvers av modeller
- Snake som oppgave er kompleks nok til å skille modellene – i motsetning til eks. 1 der alle kom i mål likt
- Verktøy/infrastruktur (OpenCode) fungerte godt for parallell kjøring

---
