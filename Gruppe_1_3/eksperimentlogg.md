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
