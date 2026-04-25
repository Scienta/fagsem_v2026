---
tema: "Tema 3 – Lokal LLM i praksis"
---

# Sluttrapport – Gruppe 3.3

---

## 1. Gruppeinformasjon

| Felt | Verdi |
|---|---|
| Gruppenummer | 3.3 |
| Deltakere | Thomas Gran, Anders, Bartas Venckus |
| Tema | Tema 3 – Lokal LLM i praksis |
| Dato(er) for eksperiment | 2026-04-24 – 2026-04-25 |
| Verktøy/modeller brukt | Ollama, llama3.1:8b, qwen3.6:latest, Claude Code (Sonnet 4.6) |
| Repo / kodebase / case brukt | `demo/blackjack/` (Python Blackjack, 24 tester) + OpenTripPlanner `raptor`-modul (real-world Java) |

---

## 2. Valgt problemstilling

**Forskningsspørsmål:**
Kan lokale LLM-er (via Ollama) brukes som praktiske kodingsassistenter i en flerstegs agentarbeidsflyt, og hvor svikter de sammenlignet med skybaserte modeller?

**Hypotese:**
Lokale modeller fungerer på avgrensede, tydelig definerte oppgaver, men møter raskt grenser når flyten blir mer kompleks — særlig når oppgaven krever at modellen holder oversikt over flere filer eller lengre kontekst samtidig.

---

## 3. Eksperimentoppsett

### Hva ble testet

To kodebaser ble brukt:

1. **`demo/blackjack/`** — Python Blackjack med 24 tester. Oppgaven var å implementere `is_soft`-property på `Hand`-klassen (avgjør om en hånd er «myk» — dvs. et ess teller som 11 uten å gi bust).
2. **OpenTripPlanner `raptor`-modulen** — real-world Java-kodebase. Oppgaven var å implementere Early Pruning i RAPTOR-algoritmen (opentripplanner/OpenTripPlanner#7470), etterfulgt av en SpeedTest A/B-sammenligning.

Begge casene kjørte i en flerstegs agentflyt: forstå → planlegge → implementere → teste.

### Betingelser

| Betingelse | Beskrivelse |
|---|---|
| A – llama3.1:8b (CPU, Thomas) | 8B tett modell. Maskin: MacBook Pro M1 Pro, 32 GB RAM. Kjørt via Ollama REST API. |
| B – qwen3.6:latest (GPU, Bartas) | MoE reasoning-modell (~262K kontekstlengde). Maskin: Razer Blade 16 — AMD Ryzen AI 9 365, 63 GB RAM, RTX 5080 16 GB VRAM. |
| C – Claude Code (sky, Thomas) | Sonnet 4.6 som orkestrator og supplement i Java-caset. |

### Maskinvare

| Maskin | CPU | RAM | GPU |
|---|---|---|---|
| Anders – Lenovo ThinkPad T14 Gen 5 | Intel Core Ultra 7 155U, 14 tråder | 32 GB | Ingen diskret GPU (Xe integrert) |
| Bartas – Razer Blade 16 (Rocinante) | AMD Ryzen AI 9 365, 20 tråder | 63 GB | RTX 5080 16 GB VRAM |
| Thomas – MacBook Pro M1 Pro | Apple M1 Pro | 32 GB | Integrert |

### Målemetoder

- Korrekthet: Tester grønne/røde etter implementasjon
- Responstid: Veggklokke (sekunder) og tokens/sek (via `benchmarks/observer.py`)
- Robusthet: Antall iterasjoner/korreksjonsforsøk før korrekt resultat
- Kvalitativ vurdering: Hallusinering av API, logiske feil, fullstendighet

---

## 4. Resultater

### 4.1 Blackjack – `is_soft` med llama3.1:8b

| Steg | Resultat | Tid |
|---|---|---|
| Forstå koden (hand.py) | Korrekt og strukturert forklaring | 41 sek |
| Implementere is_soft (1. forsøk) | Feil: sjekker `11 in non_ace_values` — logisk umulig | 14 sek |
| Skrive tester | Feil API: `Rank.ESS`, `hand.add_card()` — hallusinert | 9 sek |
| Prompt-iterasjon (4 forsøk) | Korrekt på 4. forsøk: krever eksplisitt pseudokode + full kildekode | ~60 sek |

**Konklusjon llama3.1:8b:** 4 forsøk og eksplisitt pseudokode + full kildekode nødvendig for korrekt resultat. Uten begge deler samtidig: enten logisk feil algoritme eller hallusinert API.

**Korrekt is_soft (Forsøk 4):**
```python
@property
def is_soft(self) -> bool:
    total = sum(card.rank.points for card in self._cards)
    aces = sum(1 for card in self._cards if card.rank == Rank.ACE)
    reduced = 0
    while total > 21 and reduced < aces:
        total -= 10
        reduced += 1
    return reduced < aces
```

---

### 4.2 Blackjack – `is_soft` med qwen3.6:latest

| Konfigurasjon | Resultat |
|---|---|
| think=true, num_ctx=4096 | Tomt svar — kontekstvindu fullt under thinking-fasen |
| think=true, num_ctx=8192 | Tomt svar — 7435 tokens thinking, ingen plass til output |
| think=false, num_ctx=8192 | **Korrekt implementasjon på 1. forsøk** |

**Korrekt is_soft (qwen3.6, think=false):**
```python
@property
def is_soft(self) -> bool:
    non_ace_sum = sum(card.rank.points for card in self._cards if card.rank != Rank.ACE)
    num_aces = sum(1 for card in self._cards if card.rank == Rank.ACE)
    if num_aces == 0:
        return False
    return non_ace_sum + 11 + (num_aces - 1) <= 21
```

**Ytelsesmåling (qwen3.6, think=false):**
- Veggklokke: 132,7 sek | Prompt-tokens: 761 | Genererte tokens: 2 329
- Gen-tokens/sek: 18,19 | E2E-tokens/sek: 17,55
- CPU mean/peak: 0,4% / 6,1% (modellvekter i GPU/RAM-offload)

Alle 30 tester (24 eksisterende + 6 nye is_soft-tester) grønne.

---

### 4.3 Modell-sammenligning – Blackjack-caset

| | llama3.1:8b | qwen3.6:latest (think=false) |
|---|---|---|
| Forsøk til korrekt kode | 4 | 1 |
| Total tid | ~135 sek (4 kall) | 133 sek (1 kall) |
| Hallusinering av API | Ja (uten kildekode som kontekst) | Nei |
| Kontekstbehov | Full kildekode + eksplisitt pseudokode | Full kildekode |
| Tester grønne etter | 24/24 (eksisterende, ingen nye) | 30/30 |

---

### 4.4 Real-world Java – OTP Early Pruning (llama3.1:8b)

Llama ble brukt som kodingsassistent av Thomas (som orkestrator) på OpenTripPlanner.

| Steg | Resultat | Tid |
|---|---|---|
| Forstå nøkkelfilene | Korrekt, identifiserte riktig plassering | 29 sek |
| Sortere transfer-kanter | Korrekt Java produsert, brukt direkte | 4 sek |
| Pruning i StdRangeRaptorWorkerState | Riktig struktur, to feil (hallusinert variabel + ufullstendig metodekropp) | 10 sek |
| Korreksjon (3 iterasjoner) | Fikset metodesignatur; klarte aldri fullstendig metodekropp | ~16 sek |

**Bidragsfordeling:**
- Llama: ~60% av koden (sortering + struktur)
- Claude (orkestrator): ~40% (fullstendig metodekropp + McRAPTOR-variant)

Resultat: 917 tester i `raptor`-modulen grønne.

---

### 4.5 SpeedTest A/B – Early Pruning

11 Vestfold-reisesøk, 5 testrunder, profiler `sr` + `mc`:

| | Standard transit | MC transit | Standard total | MC total |
|---|---|---|---|---|
| **Uten Early Pruning** (dev-2.x) | Avg 4,4 ms | Avg 8,2 ms | Avg 18,2 ms | Avg 24,2 ms |
| **Med Early Pruning** (branch `early-pruning-impl`) | Avg 4,4 ms | Avg 8,2 ms | Avg 18,6 ms | Avg 24,6 ms |
| **Differanse** | 0 ms | 0 ms | +0,4 ms | +0,4 ms |

Ingen målbar ytelseseffekt på Vestfold-datasettet (3 743 stopp, 1 462 mønstre). Implementasjonen er korrekt og ingen regresjon. Effekten forventes synlig på større nasjonale datasett.

---

## 5. Diskusjon

### Hva funket

- **qwen3.6 (think=false)** leverte korrekt kode på første forsøk, uten iterasjon, der llama3.1:8b trengte fire forsøk. Algoritmen var matematisk korrekt og håndterte alle kanttilfeller.
- **llama3.1:8b på avgrensede steg** fungerte godt: sortering av transfer-kanter i Java ble korrekt på første forsøk. Forklaringssteget (forstå koden) var solid.
- **Prompt-engineering hjalp** — eksplisitt pseudokode + full kildekode løftet llama3.1:8b til korrekt resultat, selv om det krevde fire iterasjoner.
- **Hybrid-flyten** (lokal modell som delassistent, skybasert orkestrator) fungerte praktisk: Llama bidro med ~60% av Java-koden, Claude supplerte der Llama sviktet.

### Hva funket ikke

- **Uten full kildekode som kontekst** hallusinerte llama3.1:8b konsekvent API-et (`Rank.ESS`, `hand.add_card()`). Dette er en praktisk utfordring i agentflyt der kontekst må håndteres eksplisitt.
- **qwen3.6 thinking-modus** er ubrukelig for kode-oppgaver med num_ctx < 32 768 — thinking-fasens tokens fyller kontekstvinduet og modellen produserer aldri selve svaret.
- **llama3.1:8b klarte ikke å holde oversikt over to metoder samtidig** i Java-caset: strukturen var riktig, men metodekroppen ble alltid ufullstendig (`// Resten av vanlig logikk her...`).
- **Responstid for qwen3.6** er 3–4× tregere enn llama3.1:8b per kall (133 sek vs ~14 sek), men robustheten kompenserte i totaltid.

### Begrensninger

- qwen3.6 ble kun testet på maskin med dedikert GPU (RTX 5080) — ytelse på CPU-only maskinvare er ikke målt.
- Kun én oppgave (is_soft) brukt for direkte modellsammenligning — resultatene kan ikke generaliseres til alle oppgavetyper.
- SpeedTest kjørt på lite datasett; Early Pruning-effekten er ikke målt på et nasjonalt datasett.
- Anders sin maskinvare (ThinkPad T14, ingen diskret GPU) ble brukt til research og oppsett, men ikke til modell-kjøringer med måling.

---

## 6. Konklusjon

Lokale LLM-er fungerer som praktiske delassistenter i en agentarbeidsflyt, men krever tydelig kontekst og eksplisitt strukturering for å levere korrekte resultater. **Uten full kildekode som kontekst hallusinerer selv gode modeller API-et.** En sterkere lokal modell (qwen3.6) er vesentlig mer robust enn en enklere (llama3.1:8b), men krever riktig konfigurasjon — thinking-modus er kontraproduktivt for kodeoppgaver uten tilstrekkelig kontekstvindu. Den mest praktiske arbeidsformen vi fant var **hybrid-orkestrering**: skybasert modell leser filer, vurderer output og supplerer der lokal modell svikter, mens lokal modell brukes for avgrensede deloppgaver der konteksten er komplett.
