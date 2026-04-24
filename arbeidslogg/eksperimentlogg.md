# Eksperimentlogg

Bruk denne filen til korte notater underveis i eksperimentet.

## Oppstart

- Dato: 2026-04-23
- Oppgave: Legge til navn på Scienta-konsulenter i gruppeinndelingen (README.MD)
- Handling: 43 konsulenter fordelt alfabetisk på gr1–gr12 (~3–4 per gruppe, 7 grupper à 4 og 5 grupper à 3)
- Resultat: README.MD oppdatert med navn i alle 12 grupper

---

- Gruppe: 1.5
- Tema: 1 – Utvikler + agent i praksis
- Eksperiment: 3 – Feedback-loop vs. én stor bestilling
- Dato: 2026-04-24
- Deltakere: Julian Jark, Filip, Erlend Kraft
- Verktøy/modeller: Claude Code, Opus 4.7 (1M context)
- Repo / case: BlackJack, implementert i `eksperimenter/gruppe1.5/variant-a` og `variant-b`

**Hypotese:** En iterativ feedback-loop gir bedre resultat enn å gi én stor bestilling og vente på ferdig svar.

**Oppsett:**
- Variant A: én stor instruksjon, minimalt med inngripen (kjøres først for å unngå "smitte" fra læring i B)
- Variant B: flere korte iterasjoner med tilbakemelding underveis
- Samme case (BlackJack) i begge for å muliggjøre sammenligning

---

## Løpende logg

### Oppføring – Variant A start

- Tidspunkt: 2026-04-24 14:16
- Hva ble testet: Én stor bestilling til agenten for å implementere BlackJack
- Betingelse / variant: A – én stor instruksjon, minimalt inngripen
- Bestilling: Detaljert spec (terminal-basert Blackjack i TypeScript, Node 23.6+ native TS, ingen eksterne deps, type-stripping-kompatibel, `node:readline/promises`, full runde fra utdeling til resultat, h/s-meny, ess-logikk, dealer 17-regel, rent Ctrl+C-exit)
- Resultat / observasjon: (fylles inn etter kjøring)
- Måling / eksempel:
- Tolkning / usikkerhet:

---

### Oppføring – Variant A resultat

- Tidspunkt: 2026-04-24 14:18 (ca. 2 min fra bestilling til ferdig kode)
- Hva ble testet: Leveranse på én stor bestilling uten inngripen
- Betingelse / variant: A
- Resultat / observasjon:
  - Agent leverte `eksperimenter/gruppe1.5/variant-a/blackjack.ts` på ett forsøk, ingen oppfølgingsspørsmål
  - Syntaks validert med `node --experimental-strip-types --check` → OK
  - Funksjonell kjøring med `node blackjack.ts` krever Node 23.6+ (lokalt miljø har v22.12; ikke testet ende-til-ende her)
  - Implementert: 52-kort-stokk, stokking (Fisher–Yates), hit/stand-meny med input-validering, ess-logikk (11→1 ved bust), dealer 17-regel, blackjack-sjekk på to kort (slår vanlig 21), Ctrl+C-håndtering via SIGINT
- Måling / eksempel:
  - Filstørrelse: én fil, ~160 linjer
  - Antall inngripener fra team: 0
- Tolkning / usikkerhet:
  - Ikke kjørt interaktivt i denne økten – teamet må verifisere spillflyt lokalt
  - Spec var detaljert; gjenstår å se om det er edge-cases (f.eks. 21 på flere enn 2 kort, tom kortstokk) som ikke ble dekket uten feedback

---

### Oppføring – Variant B start

- Tidspunkt: 2026-04-24 14:54
- Hva ble testet: Iterativ tilnærming – minimal startbestilling, så korte tilbakemeldinger underveis
- Betingelse / variant: B – iterativ feedback-loop
- Resultat / observasjon: (fylles inn underveis)
- Måling / eksempel: (teller iterasjoner)
- Tolkning / usikkerhet:

---

### Iterasjoner (Variant B)

*Hver iterasjon = én ny instruks/feedback fra team. Noter kort hva som ble sagt og hva som skjedde.*

| # | Tidspunkt | Instruks (kort) | Hva agent gjorde | Observasjon |
|---|-----------|-----------------|------------------|-------------|
| 1 | 14:54 | "Lag en enkel Blackjack i TS, tett feedback-loop" | Stoppet før implementasjon, stilte 2 avklarende spørsmål (UI + scope) | Viste tett-loop-oppførsel: avklarer før dybden i stedet for å anta alt |
| 2 | 14:56 | "Terminal. Bare én runde." | Skrev minimal v1 (~60 linjer): deck, total, hit/stand, dealer 17-regel, resultat | Bevisst stripped: ingen SIGINT, ingen input-validering, ingen blackjack-vs-21-skille, ingen farger/UI-pynt – venter på feedback |
| 3 | 15:04 | "Flytt game logic ut av main" | Refaktorerte til `playerTurn`, `dealerTurn`, `result`; main orkestrerer | Små, mekaniske refaktoreringer er effektive i tett loop – ingen gjetning på omfang |
| 4 | 15:05 | "Ja helt IO fri" | `playerTurn` tar nå en `askAction` callback; all readline/console.log flyttet til main via closure | Callback-mønster skiller logikk fra I/O rent; logikk-funksjonene er nå testbare uten å mocke readline |
| 5 | 15:07 | "gjør askAction til function ikke lambda" | Konverterte `const askAction = async () => {}` til `async function askAction() {}` | Stilistisk endring; nested function declaration beholder closure-semantikk |
| 6 | 15:11 | "minst mulig mutability – returner ny tilstand" | Innførte `Hand`/`Deck` som `readonly Card[]`. `playerTurn` og `dealerTurn` nå rekursive, returnerer `{deck, hand}`. Nye pure helpers `draw` og `deal`. `askAction(current: Hand)` tar inn hånd som argument i stedet for closure-mutasjon | Agenten prøvde også å rive `let` ut av `total()` med smart-matematikk – rollback til enkel while-loop fordi lokal `let` i ren funksjon ikke er problemet, leselighet er viktigere |
| 7 | 15:24 | "hvorfor player0/dealer0? hvorfor 0?" | Navneendring: `player0→startPlayer`, `dealer0→startDealer`, `d1/d2/d3→afterPlayerDeal/afterDealerDeal/afterPlayerTurn` | Naming som "0/1/2" lekker implementasjon – bedre å beskrive *hva steget var*. Verdifull korreksjon: teamet fanget en latskap agenten hadde begått uten å se etter |
| 8 | 15:28 | "lag en GameState og bruk den" | Innførte `GameState = { deck, player, dealer }`. `playerTurn(state) → GameState`, `dealerTurn(state) → GameState`, `result(state)`. Nytt `newGame()` for initial state. Main: `dealt → afterPlayer → final` | Signaturene er vesentlig kortere og mer sammenhengende. State-threading-boilerplaten i main forsvant. Spread `{...state, deck, player}` gir tydelig "hva som endres" på hvert steg |
| 9 | 15:34 | "Legg til Ctrl+C-håndtering, avslutt rolig" | Første forsøk: `process.on('SIGINT', …)`. IDE-diagnostikk: `process` mangler typer (ingen `@types/node`). Prøvde flere import-varianter og en `declare const process` – ingen løste roten | Lærdom: type-problemet var et IDE-artefakt, ikke runtime; men løsningsforsøket løste heller ikke selve funksjonaliteten |
| 10 | 15:36 | "Når vi trykker Ctrl+C får vi AbortError" | Teamet testet og fant at SIGINT-handler ikke hjalp – readline kaster AbortError før handleren får presentere sitt. Byttet strategi: try/catch rundt main-body, matcher `err.name === 'AbortError'`, `rl.close()` i finally. Fjernet SIGINT-handler og `declare const process` | Viktigste tett-loop-funn så langt: uten runtime-feedback ville agenten levert en "fungerende" SIGINT-handler som ikke faktisk fungerer. Kort iterasjon med ekte kjøring avdekket feilen umiddelbart |
| 11 | 15:40 | "Dra ut spill-logikken fra try/catch" | Ekstrahert `runGame(rl)` som eier hele spillflyten; `main` er nå bare readline-oppsett + try/catch/finally rundt kallet | Tydelig separasjon: `runGame` = spill, `main` = lifecycle/feilhåndtering |

---

### Oppføring – Variant B resultat

- Tidspunkt: 2026-04-24 15:49 (ca. 55 min fra start, 11 iterasjoner)
- Hva ble testet: Iterativ bygging av samme case (BlackJack) via tett feedback-loop
- Betingelse / variant: B
- Resultat / observasjon:
  - 11 iterasjoner fra minimal bestilling til ferdig-erklæring
  - Koden utviklet seg gjennom tydelige faser: (1) avklaring → (2) minimal v1 → (3-5) struktur/IO-separasjon → (6-8) immutability + GameState → (9-11) feilhåndtering
  - Runtime-test fra team (iterasjon 10) avdekket at agentens Ctrl+C-løsning ikke virket – ble korrigert umiddelbart
  - Teamet fanget også en nomenklatur-latskap (`player0`/`d1/d2/d3`) som agenten ikke reflekterte over selv
  - Sluttproduktet har *mindre* funksjonalitet enn Variant A (mangler blackjack-vs-21-skille, kulører, dealer-snu-utskrift, header, mise.toml) men *klarere* arkitektur (readonly-typer, GameState, rene funksjoner, runGame separert fra main/feilhåndtering)
- Måling / eksempel:
  - Iterasjoner: 11 (inkludert åpningsspørsmål)
  - Total tid: ~55 min
  - Filstørrelse: ~120 linjer (litt kortere enn A selv om den er mindre featurerik – typer + helpers tar plass, men funksjonalitet som suits og blackjack-skille mangler)
  - Antall runtime-bugs oppdaget av team: 1 (AbortError/Ctrl+C)
  - Antall rene kode-kvalitet-korreksjoner fra team: 3 (naming, mutability, struktur)
- Tolkning / usikkerhet:
  - Kvalitetsforskjell A vs B: B har bedre *form* (immutability, separasjon, typer) men dårligere *regeldekning* (blackjack-skille, dealer-stopp-ved-bust). Hvilken som er "bedre" avhenger av kriteriet
  - Tidsforbruk: A ~2 min, B ~55 min. B koster mye mer tid for en enkel oppgave der speccen er kjent
  - Tett loop hjalp ikke bare med kvalitet – den fanget også én ekte bug (Ctrl+C) som A's "leverte ferdig"-tilnærming aldri ville fanget uten separat verifisering
  - B's kvalitetsgevinster (immutability, GameState) var teamets valg, ikke ting agenten foreslo selv – dvs. iterativ loop krever at teamet faktisk bidrar med retning

---

## Sammenligning A vs. B

| Dimensjon | Variant A (én bestilling) | Variant B (iterativ) |
|-----------|--------------------------|----------------------|
| Tid fra start til "ferdig" | ~2 min | ~55 min |
| Team-inngripener | 0 | 11 |
| Linjer kode | ~160 | ~120 |
| Regel-dekning | Full (inkl. blackjack-skille, suits, Ctrl+C) | Delvis (mangler blackjack-skille, suits, cosmetic) |
| Arkitektur | OK, blandet mutability, enum-aktig hard-kodede lister | Rene funksjoner, readonly-typer, GameState, runGame/main-separasjon |
| Runtime-testet under utvikling | Nei | Ja (fant 1 bug) |
| Agent-initierte feil | Ukjent (ikke runtime-testet) | 2 fanget av team: nomenklatur-latskap, ikke-fungerende SIGINT-handler |

### Tentative konklusjoner (til rapport)

1. **Hypotesen bekreftet delvis:** Iterativ loop ga bedre *kode-kvalitet* (design, typer, separasjon), men ikke bedre *regeldekning*. Med en detaljert spec (A) klarte agenten regelkravene uten hjelp; uten detaljert spec (B) hoppet vi over regler som ikke ble etterspurt.
2. **Tid er en reell kostnad:** B tok 27× så lang tid. For små/kjente oppgaver med god spec er A åpenbart mer effektiv. B's gevinst kommer når teamet har *opinions* å tilføre underveis.
3. **Runtime-feedback er kritisk:** B fanget en ikke-fungerende Ctrl+C-handler som A aldri testet. Dette hadde gått gjennom til "ferdig" i A uten ende-til-ende-kjøring.
4. **Loopen speiler teamets tanker:** B ble god fordi teamet hadde klare meninger (immutability, GameState, naming). En passiv iterativ loop ville antakelig ikke gitt samme kvalitet.
5. **Rekkefølgen A→B var viktig:** Når vi kjørte B, hadde vi allerede sett A. Vi valgte bevisst å *ikke* gjenbruke A's spec, men noen indirekte "vi vet hva spillet trenger"-bias er uunngåelig.
