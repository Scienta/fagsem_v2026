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

### Oppføring 9 – Oppsett: kontekstvinduproblem med standard Ollama-konfigurasjon

- Forfatter: Anders
- Tidspunkt: 2026-04-24 ~15:20
- Hva ble testet: qwen3:8b via `claude --model qwen3:8b` (agentarbeidsform, ende-til-ende)
- Betingelse / variant: Standard Ollama-oppsett, ingen endringer i num_ctx
- Resultat / observasjon: **Agenten hengte seg tilsynelatende.** Én forespørsel fullførte etter 2 min 37 sek, deretter ingen aktivitet. Ollamaloggen viste kritisk advarsel: `truncating input prompt limit=4096 prompt=27964 keep=4 new=4096` — prompten (kodebase + verktøyhistorikk) ble kuttet fra 27 964 til 4096 tokens. Modellen svarte uten nesten noe relevant kontekst.
- Måling / eksempel: 1 forespørsel fullført på 2m37s. Effektiv kontekst: 4 av 27 964 tokens.
- Tolkning / usikkerhet: Standard `num_ctx=4096` i Ollama er for lite for agentbruk. Claude Code bygger raskt opp kontekst (fillesing + verktøykall), og prompten vokser langt over 4096 tokens allerede i første runde. **Løsning: opprett modellvarianter med `num_ctx 32768` via `ollama create`** — dette deler eksisterende vekter (ingen nedlasting) og setter kun nytt manifest. Gjelder alle 4 modeller i eksperimentet.

---

### Oppføring 10 – Kontekstvekst-timeout: qwen3:8b-32k, multi-turn samtale

- Forfatter: Anders (via Claude Code)
- Tidspunkt: 2026-04-24
- Hva ble testet: qwen3:8b-32k med multi-turn samtale (tre steg sendt som én voksende konversasjon)
- Betingelse / variant: card.py + hand.py som kontekst, steg 1-svar lagt til historikken, deretter steg 2 kalt med full historikk. Timeout satt til 300s per kall.
- Resultat / observasjon:
  - **Steg 1 (forstå koden):** Fullførte på 288.8 sekunder. Korrekt og strukturert forklaring av Hand-klassen og ess-logikk.
  - **Steg 2 (implementer is_soft):** Timeout etter 300s. Konteksten inneholdt nå step 1-svaret i tillegg — prompten vokste, og modellen rakk ikke å svare innen grensen.
- Måling / eksempel: Steg 1: 288.8s. Steg 2: timeout >300s.
- Tolkning / usikkerhet: Multi-turn samtale med akkumulert kontekst er for tregt på denne maskinvaren. Hvert steg tar lenger tid enn det forrige fordi promptlengden vokser. Konklusjon: **stateless kall per steg** (kun relevant kontekst per forespørsel) er nødvendig for praktisk bruk av qwen3:8b-32k lokalt.

---

### Oppføring 11 – qwen3:8b-32k, oppgave 1, stateless per steg

- Forfatter: Anders (via Claude Code)
- Tidspunkt: 2026-04-24
- Hva ble testet: qwen3:8b-32k — oppgave 1 (is_soft-property), stateless API-kall per steg
- Betingelse / variant: Tre uavhengige kall. Steg 1: card.py + hand.py + forklaringsprompt. Steg 2: kun hand.py + implementasjonsprompt. Steg 3: kun test_hand.py + testprompt. Ingen samtalehistorikk mellom steg. Timeout 600s per kall.
- Resultat / observasjon:
  - **Steg 1 (forstå koden):** Fullførte på 171.7 sekunder (raskere enn forrige kjøring fordi modellen allerede lå i RAM). Korrekt, strukturert forklaring med fem punkter — inkl. ess-justeringslogikken beskrevet riktig.
  - **Steg 2 (implementer is_soft):** Timeout etter 600 sekunder. Modellen startet ikke å generere output innen fristen, selv med stateless kall og minimal kontekst (~300 tokens).
  - **Forsøk med manuell "hello"-prompt etterpå:** Heller ikke dette svarte — bekrefter at modellen var fullstendig blokkert.
- Måling / eksempel: Steg 1: 171.7s. Steg 2: timeout >600s. Manuell "hello": ingen respons.
- Tolkning / usikkerhet:
  - **Trolig årsak: RAM-press.** `qwen3:8b-32k` (10.2 GB) og `gemma4:latest` (10.5 GB) lå lastet samtidig = ~20 GB modell-RAM på en maskin med 32 GB totalt. En annen Claude Code-instans hadde aktivert begge modellene. Dette etterlater for lite minne til OS og generering, og fører til at inferens henger eller krasjer.
  - **Konklusjon:** qwen3:8b-32k alene kan gjennomføre enkle forklaringsoppgaver, men er ekstremt treg (~170s per steg). Kodegenerering (steg 2) under RAM-press er ikke gjennomførbart. **32k kontekstvindus-konfigurasjonen er sannsynligvis for tung for CPU-only inferens med parallelle modeller.**

---

### Oppføring 12 – Oppsummering: qwen3:8b-32k, oppgave 1

- Forfatter: Anders (via Claude Code)
- Tidspunkt: 2026-04-24
- Hva ble testet: Totalt tre kjøringsforsøk med qwen3:8b-32k på oppgave 1 (is_soft)
- Betingelse / variant: Se oppføring 9–11 for detaljer
- Resultat / observasjon:
  - **Steg 1 (forstå koden) fullførte 2 av 3 ganger** — 288.8s og 171.7s. Svar var korrekt og strukturert begge ganger.
  - **Steg 2 (implementere is_soft) fullførte aldri** — timeout i alle forsøk (300s og 600s).
  - **Oppgaven ble ikke løst** — ingen `is_soft`-implementasjon eller tester ble produsert av modellen.
- Måling / eksempel: Raskeste steg 1: 171.7s. Steg 2: aldri fullført (>600s).
- Tolkning / usikkerhet:
  - qwen3:8b-32k er **ikke brukbar for agentarbeidsform** på denne maskinvaren (ThinkPad T14 Gen 5, CPU-only).
  - Forklaringsoppgaver (lese og beskrive kode) er mulig, men svært trege.
  - Kodegenerering med 32k kontekstvindus er utenfor kapasiteten i praksis.
  - **Neste steg:** Prøv `qwen3:8b` (standard 4096 token kontekstvindu) alene med svært korte prompts — eller bytt til `gpt-oss:20b` for å se om MoE-arkitektur gir bedre throughput.

---

### Oppføring
