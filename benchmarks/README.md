# benchmarks/observer.py

Live observer for group 3.3 – measures CPU%, RAM and tokens/sec during a running
Ollama session (e.g. Claude Code using a local model).

Run it in a **separate terminal** while the agent works. Stop with Ctrl-C.

---

## Krav

- Python ≥ 3.11 + `uv` (anbefalt), **eller** `pip install --user psutil`
- `ollama serve` kjørende
- For token-statistikk: Ollama startet med `OLLAMA_DEBUG=1` (se under)

---

## Starte Ollama med loggutput for tokens/sek

```bash
OLLAMA_DEBUG=1 ollama serve
```

Loggfilen skrives til `~/.ollama/logs/server.log`.  
Observer-skriptet finner denne automatisk.

Alternativt (systemd-tjeneste):

```bash
sudo systemctl edit --force --full ollama.service
# Legg til under [Service]:
#   Environment="OLLAMA_DEBUG=1"
sudo systemctl restart ollama
```

---

## Kjøre observeren

I et eget terminalvindu, fra rotkatalogen i repoet:

```bash
uv run benchmarks/observer.py --label "qwen3:8b – oppgave 1"
```

Uten `uv`:

```bash
pip install --user psutil
python benchmarks/observer.py --label "qwen3:8b – oppgave 1"
```

La observeren kjøre mens du bruker Claude Code + Ollama som normalt.  
Trykk **Ctrl-C** når oppgaven er ferdig.

---

## Output

Observeren printer en Markdown-blokk til stdout når den stoppes:

```
**Måling** (2026-04-24 14:32:10, "qwen3:8b – oppgave 1"):
- Maskin: andkvernberg-t14 — Intel Core Ultra 7 155U, 14 tråder, 32 GB RAM
- Modell: qwen3:8b
- Generasjoner i vinduet: 47
- Total generert: 3 812 tokens
- Gen-tokens/sek (aktiv generering, mean): 14.3
- Gen-tokens/sek (p50): 14.8
- E2E-tokens/sek (inkl. prompt-eval og vente-tid): 6.1
- CPU (mean/peak): 612 % / 1 050 %
- RSS (mean/peak): 5 412 MB / 5 498 MB
- Veggklokke: 624.3 s
```

Kopier blokken inn i **"Måling / eksempel:"**-feltet i `arbeidslogg/eksperimentlogg.md`.

En CSV-rad legges automatisk til i `arbeidslogg/benchmarks.csv` (opprettes ved
første kjøring). Filen har en rad per kjøring med kolonner for maskin, modell og
alle måletall — bruk den til å sammenligne modeller og maskiner i sluttrapporten.

---

## To tokens/sek-tall — hva er forskjellen?

| Tall | Forklaring | Bruk |
|---|---|---|
| **Gen-tokens/sek** | `eval_count / eval_duration` per generasjon, summert. Ren modell-throughput når den faktisk genererer. | MoE-vs-dense-sammenligning |
| **E2E-tokens/sek** | `total_tokens / veggklokke`. Inkluderer prompt-evaluering, tool-kjøring og vente-tid. | Reell agent-produktivitet |

---

## Avansert bruk

```bash
# Spesifiser loggfil eksplisitt
uv run benchmarks/observer.py --label "phi4:14b – oppgave 2" \
    --log-path ~/.ollama/logs/server.log

# Annen Ollama-port
uv run benchmarks/observer.py --label "test" --port 11435

# Annen CSV-fil
uv run benchmarks/observer.py --label "test" --output /tmp/my_benchmarks.csv
```

---

## Aggregere på tvers av maskiner (Thomas, Bartas, Anders)

Alle tre kjører observeren på sin maskin med samme `--label`-konvensjon.
CSV-filene har `host`-kolonnen som skiller maskinene. For å slå dem sammen:

```bash
# Kopier alle tre CSV-filer til samme katalog, så:
head -1 benchmarks_anders.csv > combined.csv
tail -n +2 -q benchmarks_anders.csv benchmarks_thomas.csv benchmarks_bartas.csv >> combined.csv
```

I Python/pandas: `df.groupby(["host", "model"])["gen_tokens_per_sec"].mean()`
