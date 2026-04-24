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

### Oppføring

- Forfatter: <!-- Anders Kvernberg / Bartas Venckus / Thomas Gran -->
- Tidspunkt:
- Hva ble testet:
- Betingelse / variant:
- Resultat / observasjon:
- Måling / eksempel:
- Tolkning / usikkerhet:
