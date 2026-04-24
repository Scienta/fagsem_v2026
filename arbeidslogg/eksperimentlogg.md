# Eksperimentlogg

Bruk denne filen til korte notater underveis i eksperimentet.

## Oppstart

- Dato: 2026-04-23
- Oppgave: Legge til navn på Scienta-konsulenter i gruppeinndelingen (README.MD)
- Handling: 43 konsulenter fordelt alfabetisk på gr1–gr12 (~3–4 per gruppe, 7 grupper à 4 og 5 grupper à 3)
- Resultat: README.MD oppdatert med navn i alle 12 grupper

---

- Dato: 2026-04-24
- Forfatter: Anders
- Oppgave: Dokumentere maskinvare for gruppe 3.3 for Anders (Lokal LLM i praksis)
- Handling: Innhentet systemspesifikasjoner via `lscpu`, `free`, `lspci`, `lsblk`, `hostnamectl`
- Resultat: Spesifikasjonsrapport lagret i [`arbeidslogg/maskinvare-spesifikasjon.md`](./maskinvare-spesifikasjon.md)
- Viktigste funn: Lenovo ThinkPad T14 Gen 5, Intel Core Ultra 7 155U, 32 GB RAM, ingen diskret GPU — inferens via CPU (GGUF). 7B–13B modeller er praktiske; 34B er mulig men stramt.

---

- Dato: 2026-04-24
- Forfatter: Anders
- Oppgave: Research på gjeldende modellandskap for Ollama (april 2026)
- Handling: Søk på ollama.com/library, lokalaimaster.com, aimadetools.com og ollama GitHub
- Resultat: Anbefalte modeller oppdatert i `maskinvare-spesifikasjon.md` under "Anbefalte Ollama-modeller"
- Viktigste funn:
  - Qwen 2.5 → Qwen 3/3.5/3.6, Gemma 2 → Gemma 3/4, Phi-3.5 → Phi-4 — hele modellandskapet er en generasjon nyere enn aug 2025
  - **GPT-OSS 20B** (OpenAI open weights, MoE): 21B totale parametere men bare ~3,6B aktive per token — sannsynligvis den raskeste modellen over 10B for CPU-only oppsett
  - MoE-modeller er interessante for CPU-inference; undersøkelsesspørsmål: _gir MoE bedre tokens/sek enn dense ved samme RAM-forbruk?_
  - Anbefalt testsett: `qwen3:8b`, `phi4:14b`, `gpt-oss:20b`, `devstral-small-2:24b`

---

- Dato: 2026-04-24
- Forfatter: Anders
- Oppgave: Opprette måleverktøy for ressursbruk og tokens/sek (gruppe 3.3)
- Handling: Implementerte `benchmarks/observer.py` — live observer som sampler CPU/RAM fra Ollama-prosessen og extraherer tokens/sek fra server-loggen. Kjøres i eget terminalvindu ved siden av Claude Code + Ollama.
- Resultat: `benchmarks/observer.py` og `benchmarks/README.md` opprettet. Resultat-CSV lagres i `arbeidslogg/benchmarks.csv`. Output er en klar Markdown-blokk for lim-inn i "Måling / eksempel:"-feltet.
- Viktigste beslutninger:
  - PEP 723 inline-deps (`uv run`) — ingen virtualenv-oppsett nødvendig
  - To tokens/sek-tall: `gen_tokens_per_sec` (ren modell-throughput) og `e2e_tokens_per_sec` (inkl. vente-tid)
  - Hardware-kontekst fanges automatisk per kjøring (host, CPU, tråder, RAM) — nødvendig fordi Thomas og Bartas har annen maskinvare enn Anders
  - Krever `OLLAMA_DEBUG=1` for token-statistikk; CPU/RAM fanges alltid

---

- Gruppe: 3.3
- Tema: Tema 3 – Lokal LLM i praksis
- Eksperiment: Eksperiment 4 – Lokal LLM med agentarbeidsform
- Dato: 2026-04-24
- Forfatter: Anders
- Verktøy/modeller: Claude Code + Ollama (modeller lastes ned)
- Repo / case: `demo/` – Blackjack i Python (24 tester, grønt)

- Demo-kodebase opprettet: `demo/blackjack/` med `card.py`, `hand.py`, `game.py`, `main.py`
- Tre oppgaver definert i `demo/oppgaver.md` (enkel → middels → kompleks)
- Alle 24 tester grønne før eksperimentet starter

---

## Måling av ressursbruk

Kjør `benchmarks/observer.py` i et eget terminalvindu mens agenten jobber:

```bash
uv run benchmarks/observer.py --label "qwen3:8b – oppgave 1"
```

Trykk Ctrl-C når oppgaven er ferdig. Skriptet printer en ferdig Markdown-blokk
som limes inn i **"Måling / eksempel:"**-feltet under, og lagrer en rad i
`arbeidslogg/benchmarks.csv` for tverrmodell-sammenligning.  
Se `benchmarks/README.md` for full dokumentasjon.

---

## Løpende logg

### Oppføring 1 – Steg 1: Forstå koden

- Forfatter: Thomas Gran
- Tidspunkt: 2026-04-24
- Hva ble testet: llama3.1:8b bedt om å forklare Hand-klassen og ess-logikken
- Betingelse / variant: Én fil (hand.py) gitt som kontekst, norsk prompt
- Resultat / observasjon: Korrekt og strukturert forklaring. Ess-logikken (reduksjon fra 11→1 ved bust) beskrevet riktig. Noe blanding av norsk/engelsk terminologi ("aker" for ace).
- Måling / eksempel: 41 sekunder responstid
- Tolkning / usikkerhet: Forståelsesteget fungerte godt for én isolert fil.

---

### Oppføring 2 – Steg 2+3: Implementere is_soft

- Forfatter: Thomas Gran
- Tidspunkt: 2026-04-24
- Hva ble testet: llama3.1:8b bedt om å implementere `is_soft`-property på Hand
- Betingelse / variant: hand.py gitt som kontekst, bedt om kun kode
- Resultat / observasjon: **Feil implementasjon.** Sjekker `11 in non_ace_values` der non_ace_values er verdier fra ikke-ess-kort — disse kan aldri være 11. Metoden returnerer alltid False.
- Måling / eksempel: `non_ace_values = [...]; return any(11 in non_ace_values)` — 14 sek responstid
- Tolkning / usikkerhet: Koden ser plausibel ut ved rask lesing, men er logisk feil. Modellen forstår domenet, men klarer ikke den logiske koblingen.

---

### Oppføring 3 – Steg 4: Skrive tester for is_soft

- Forfatter: Thomas Gran
- Tidspunkt: 2026-04-24
- Hva ble testet: llama3.1:8b bedt om å skrive pytest-tester for is_soft
- Betingelse / variant: Ingen eksisterende kode gitt som kontekst
- Resultat / observasjon: **Feil API.** Brukte `Rank.ESS` (hallusinert norsk enum-navn, riktig er `Rank.ACE`) og `hand.add_card()` (ikke-eksisterende metode, riktig er `hand.add()`). Testene ville krasjet ved kjøring.
- Måling / eksempel: 9 sek responstid
- Tolkning / usikkerhet: Uten kodebasen som kontekst hallusinerer modellen API-et. Testene avdekket heller ikke sin egen implementasjonsfeil.

---

### Oppføring 4 – Prompt-iterasjon: is_soft med justerte prompts

- Forfatter: Thomas Gran
- Tidspunkt: 2026-04-24
- Hva ble testet: Gjentatt forsøk på å få llama3.1:8b til å implementere `is_soft` korrekt, med progressivt justerte prompts
- Betingelse / variant: Fire forsøk via Ollama REST API

- **Forsøk 1** – Norsk prompt, fri beskrivelse, hand.py som kontekst: Feil algoritme. `card.rank.points > 10` sjekker alle kort, ikke bare ess som teller som 11. Returnerer True når som helst det er et ess.
- **Forsøk 2** – Norsk prompt, eksempler og hint om reduksjonslogikk: Feil algoritme. `total_aces == aces` alltid (alle ess har points=11), så returnerer alltid False.
- **Forsøk 3** – Engelsk prompt, eksplisitt nummerert pseudokode, uten kildekode: Korrekt algoritme, men hallusinerte API (`card.point_value`, `self.cards`, `card.rank == 'Ace'`).
- **Forsøk 4** – Engelsk prompt, eksplisitt pseudokode + full kildekode (card.py + hand.py): Korrekt algoritme OG korrekte attributtnavn. Alle 4 kanttilfeller passerte manuell verifisering, og alle 24 eksisterende tester forble grønne.

- Måling / eksempel:
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
- Tolkning / usikkerhet: Modellen trenger to ting samtidig for å lykkes: (1) algoritmen formulert som eksplisitt pseudokode (ikke beskrivelse av ønsket adferd), og (2) full kildekode som kontekst for å unngå API-hallusinering. Ingen av delene alene er tilstrekkelig.

---

### Oppføring 5 – qwen3.6: Steg 1 – Forstå koden

- Forfatter: Bartas Venckus
- Tidspunkt: 2026-04-24
- Hva ble testet: qwen3.6:latest bedt om å forklare Hand-klassen og ess-logikken
- Betingelse / variant: card.py + hand.py gitt som kontekst, norsk prompt, num_ctx=8192, think=false
- Maskin: PC2 – Razer Blade 16 (AMD Ryzen AI 9 365, 20 tråder, 63.1 GB RAM, RTX 5080 16 GB VRAM)
- Resultat / observasjon: **Korrekt og detaljert forklaring.** Ess-logikken (reduksjon 11→1 ved bust) forklart nøyaktig med konkrete talleksempler. Inkluderte spontant emoji-overskrifter og gjennomarbeidede tall-eksempler som Ess+Ess+9=21.
- Måling / eksempel: 140s veggklokke | ~1996 tokens | ~14,7 tok/s gen
- Tolkning / usikkerhet: Kvalitativt bedre og mer detaljert enn llama3.1:8b (41s), men betydelig tregere. qwen3.6 er en reasoning-modell; selv med think=false genererer den lange, gjennomarbeidede svar.

---

### Oppføring 6 – qwen3.6: Kontekstvindu-problem ved kode-generering

- Forfatter: Bartas Venckus
- Tidspunkt: 2026-04-24
- Hva ble testet: qwen3.6:latest med thinking aktivert (standard) på implementasjonsoppgaven
- Betingelse / variant: card.py + hand.py som kontekst, num_ctx=4096 og 8192, num_predict=-1
- Resultat / observasjon: **Tomt svar ved thinking-modus.** Med num_ctx=4096: 2000 tokens generert, response-feltet tomt (kontekstvinduet fullt under thinking-fasen). Med num_ctx=8192: 7435 tokens generert, 759 prompt + 7435 gen = 8194 ≈ 8192 – igjen tomt svar (thinking fyller hele vinduet). Modellen tenker i `<think>`-tokens som teller mot kontekstbudsjettet men er usynlige for brukeren.
- Måling / eksempel: 461s veggklokke | 7435 tokens gen | 16,6 tok/s | thinking=22114 tegn | CPU peak 64% | RSS peak 11 741 MB
- Tolkning / usikkerhet: qwen3.6 er en MoE-reasoning-modell (qwen35moe, 262K kontekstlengde). Thinking-prosessen kan bruke mange tusen tokens. Med for lite num_ctx når den aldri frem til å skrive selve svaret. **Løsning: bruk think=false via chat-API for kode-oppgaver, eller sett num_ctx≥32768.**

---

### Oppføring 7 – qwen3.6: Vellykket implementasjon med think=false

- Forfatter: Bartas Venckus
- Tidspunkt: 2026-04-24
- Hva ble testet: qwen3.6:latest med think=false (chat-API) på Oppgave 1
- Betingelse / variant: card.py + hand.py som kontekst, chat-API, think=false, num_ctx=8192, num_predict=-1
- Maskin: PC2 – Rocinante (AMD Ryzen AI 9 365, 20 tråder, 63.1 GB RAM, RTX 5080 16 GB VRAM)
- Resultat / observasjon: **Korrekt implementasjon produsert.** Modellen returnerte full hand.py med riktig `is_soft`. Koden inkluderte mange inline-kommentarer som viste resonneringssteget (bortimot et "thinking på papir"). Den endelige logikken `non_ace_sum + 11 + (num_aces - 1) <= 21` er **matematisk korrekt** og håndterer multi-ess-kanttilfeller (Ess+Ess+10 = False, Ess+Ess+9 = True). Alle 30 tester (24 eksisterende + 6 nye is_soft-tester) grønne.
  ```python
  @property
  def is_soft(self) -> bool:
      non_ace_sum = sum(card.rank.points for card in self._cards if card.rank != Rank.ACE)
      num_aces = sum(1 for card in self._cards if card.rank == Rank.ACE)
      if num_aces == 0:
          return False
      return non_ace_sum + 11 + (num_aces - 1) <= 21
  ```
- Måling / eksempel:
  **Maling** (2026-04-24 16:48:47, "qwen3.6:latest – oppgave 1 (is_soft)"):
  - Maskin: Rocinante — AMD Ryzen AI 9 365 w/ Radeon 880M, 20 tråder, 63.1 GB RAM
  - Modell: qwen3.6:latest (think=false, chat-API)
  - Veggklokke: 132.7 s
  - Prompt-tokens: 761 | Genererte tokens: 2329
  - Gen-tokens/sek: 18.19 | E2E-tokens/sek: 17.55
  - CPU (mean/peak): 0.4% / 6.1% | RSS peak: 162 MB (ollama.exe prosess; modellvekter i GPU/RAM-offload)
- Tolkning / usikkerhet: Med think=false leverer qwen3.6 korrekt kode på én kjøring, uten iterasjon. llama3.1:8b trengte 4 forsøk og eksplisitt pseudokode for å nå samme resultat. Avveining: qwen3.6 er 3–4× tregere (133s vs ~14s), men mer robust. think=false er nødvendig for praktisk bruk – thinking-modus gjør modellen ubrukelig for kode-oppgaver uten num_ctx≥32768.
- Kode-endring (`demo/blackjack/hand.py`):
  ```diff
   @property
   def is_blackjack(self) -> bool:
       return len(self._cards) == 2 and self.value == 21

  +@property
  +def is_soft(self) -> bool:
  +    non_ace_sum = sum(card.rank.points for card in self._cards if card.rank != Rank.ACE)
  +    num_aces = sum(1 for card in self._cards if card.rank == Rank.ACE)
  +    if num_aces == 0:
  +        return False
  +    return non_ace_sum + 11 + (num_aces - 1) <= 21
  +
   def __str__(self) -> str:
  ```

---

### Oppføring 8 – qwen3.6: Spillet oppdatert og spillbart

- Forfatter: Bartas Venckus
- Tidspunkt: 2026-04-24
- Hva ble gjort: Soft/hard-visning lagt til i main.py, 6 is_soft-tester lagt til i test_hand.py. 30 tester grønne.
- Kode-endring (`demo/blackjack/main.py`):
  ```diff
  -from .game import Game, MIN_BET
  +from .game import Game, MIN_BET
  +from .hand import Hand
  +
  +
  +def _hand_label(hand: Hand) -> str:
  +    qualifier = "soft" if hand.is_soft else "hard"
  +    return f"{qualifier} {hand.value}"
  
  
   def main():
  ...
  -    print(f"\nDine kort:    {game.player_hand}  ({game.player_hand.value})")
  -    print(f"Dealer viser: {game.dealer_hand._cards[0]}  [skjult]")
  +    print(f"\nDine kort:    {game.player_hand}  ({_hand_label(game.player_hand)})")
  +    print(f"Dealer viser: {game.dealer_hand._cards[0]}  [skjult]")
  ...
  -                    print(f"Dine kort: {game.player_hand}  ({game.player_hand.value})")
  +                    print(f"Dine kort: {game.player_hand}  ({_hand_label(game.player_hand)})")
  ...
  -    print(f"\nDine kort:    {game.player_hand}  ({game.player_hand.value})")
  -    print(f"Dealers kort: {game.dealer_hand}  ({game.dealer_hand.value})")
  +    print(f"\nDine kort:    {game.player_hand}  ({_hand_label(game.player_hand)})")
  +    print(f"Dealers kort: {game.dealer_hand}  ({_hand_label(game.dealer_hand)})")
  ```
- Eksempel på output under spill:
  ```
  Dine kort:    A♠  6♥  (soft 17)
  Dealer viser: K♠  [skjult]

  [h]it / [s]tand: h
  Dine kort: A♠  6♥  3♣  (hard 20)
  ```

---

### Oppføring 9 – Real-world Java-oppgave: OTP Early Pruning

- Forfatter: Thomas Gran
- Tidspunkt: 2026-04-24
- Hva ble testet: llama3.1:8b brukt som kodingsassistent på implementasjon av Early Pruning i OpenTripPlanner (opentripplanner/OpenTripPlanner#7470) — real-world Java-kodebase
- Betingelse / variant: Relevante kodeseksjoner hentet og gitt som kontekst per steg. Claude (meg) orkestrerte flyten, leste filer, sendte prompts til Llama og vurderte output
- Maskin: MacBook Pro M1 Pro, 32 GB RAM

**Hva Llama gjorde:**

- **Steg 1 – Forstå (29 sek):** Fikk de tre nøkkelfilene som kontekst. Identifiserte korrekt at sortering hørte hjemme i `PreCachedRaptorTransferIndex` og pruning i begge worker states. Forsto algoritmen konseptuelt.
- **Steg 2 – Sorter transfer-kanter (4 sek):** Produserte korrekt Java: `.stream().sorted(Comparator.comparingInt(DefaultRaptorTransfer::durationInSeconds)).collect(Collectors.toList())`. Ble brukt direkte.
- **Steg 3 – Pruning i StdRangeRaptorWorkerState (10 sek):** Produserte riktig *struktur*: `transferToStop()` endret til å returnere `boolean`, ytre løkke i `transferToStops()` bryter på `true`. To feil: (1) brukte `bestDestinationArrivalTime` som om det var en definert variabel (hallusinert), (2) metodekroppen var ufullstendig — erstattet eksisterende logikk med `// ...`.
- **Steg 4 – Korreksjon (3 iterasjoner, ~16 sek):** Fikk beskjed om begge feilene. Fikset parameter-signaturen for `transferToStops()` korrekt. Klarte likevel aldri å skrive fullstendig metodekropp for `transferToStop()` — gjentok `// Resten av vanlig logikk her...`.

**Hva Claude gjorde:**

- Leste alle relevante filer og hentet riktige kodeseksjoner som kontekst til Llama
- Vurderte Llamas output og identifiserte feilene
- Implementerte den fullstendige, korrekte `transferToStop()`-metoden i `StdRangeRaptorWorkerState` (brukte `exceedsTimeLimit` som pruning-signal i stedet for den hallusinerte variabelen)
- Implementerte McRAPTOR-varianten (`McRangeRaptorWorkerState`) selvstendig — Llama ble aldri spurt om denne, siden flyten hadde brutt ned
- La til `import`-setninger som Llama glemte i sorteringssteget

- Resultat / observasjon: Implementasjonen fullført. 917 tester i `raptor`-modulen grønne.
- Måling: Total Llama-tid ~50 sek over 5 kall. Llama bidro med ~60% av koden (sortering + struktur), Claude supplerte ~40% (fullstendig metodekropp + McRAPTOR).
- Tolkning: Llama klarer godt avgrensede endringer der hele konteksten er i én metode. Svikter når implementasjonen krever å holde oversikt over to metoder samtidig og holde eksisterende logikk intakt. Egnet som "første utkast"-assistent — men krever tett review og korreksjon av menneskelig (eller sterkere) modell.

---

### Oppføring 10 – SpeedTest kjørt med Early Pruning-implementasjonen

- Forfatter: Thomas Gran
- Tidspunkt: 2026-04-25
- Hva ble testet: OTP SpeedTest mot 11 Vestfold-reisesøk med Early Pruning aktivert i koden
- Betingelse: dev-2.x-toppen (commit e828da9), graph `ser.ver.id: 252` fra Entur's Vestfold-datasett, 5 testrunder

**Oppsett-problemer løst:**
- Foreldet `raptor-2.10.0-SNAPSHOT.jar` i lokal Maven-repo brukte gammel bytekode (pre-rename `tripIndex()`) — slettet og reinstallert med `mvn install`
- `StreetPath`-klassen manglet i classpath — fikset ved `mvn install` av alle avhengige moduler

**SpeedTest A/B-resultater (11 søk, 5 runder, profiler `sr` + `mc`):**

| | Standard transit | MC transit | Standard total | MC total |
|---|---|---|---|---|
| **Uten Early Pruning** (dev-2.x) | Avg 4.4 ms | Avg 8.2 ms | Avg 18.2 ms | Avg 24.2 ms |
| **Med Early Pruning** (branch `early-pruning-impl`) | Avg 4.4 ms | Avg 8.2 ms | Avg 18.6 ms | Avg 24.6 ms |
| **Differanse** | 0 ms | 0 ms | +0.4 ms | +0.4 ms |

- Total tid for alle 11 søk: ~0.2–0.3 sekunder per runde (begge varianter)
- Routing korrekt i begge varianter (alle 11 søk returnerer gyldige bussruter)

**Tolkning:** Ingen målbar ytelseseffekt på Vestfold-datasettet. Sannsynlige årsaker:
- Datasettet er lite (3 743 stopp, 1 462 mønstre) — antall transfer-kanter per stopp er lavt
- Early Pruning effekt vokser med antall kanter som avkuttes — vises bedre på store nasjonale datasett (f.eks. Norway eller Germany)
- Overhead fra sortering (O(n log n) i indeksbygging) er ubetydelig, men gir heller ingen gevinst her

**Konklusjon:** Implementasjonen er korrekt og ikke regresjon. Ytelseseffekten forventes å bli synlig på større datasett.
