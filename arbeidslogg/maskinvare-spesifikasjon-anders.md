# Maskinvare-spesifikasjon

**Innhentet:** 2026-04-24  
**Maskin:** Lenovo ThinkPad T14 Gen 5 (21ML003MMX)  
**Gruppe:** 3.3 — Lokal LLM i praksis

---

## Sammendrag

| Komponent | Spesifikasjon |
|---|---|
| Maskin | Lenovo ThinkPad T14 Gen 5 |
| OS | Fedora Linux 43 (Workstation Edition) |
| Kernel | Linux 6.19.13-200.fc43.x86\_64 |
| CPU | Intel Core Ultra 7 155U |
| Kjerner / tråder | 12 kjerner / 14 tråder |
| Maks CPU-frekvens | 4,8 GHz |
| RAM | 32 GB |
| GPU | Intel Meteor Lake-P (Xe integrert grafikk) |
| Dedikert VRAM | Ingen — deler systemminne |
| Lagring | 1 TB NVMe SSD (LUKS-kryptert) |

---

## CPU

- **Modell:** Intel Core Ultra 7 155U (Meteor Lake, 6. gen Core Ultra)
- **Arkitektur:** x86-64, Intel Hybrid (P-cores + E-cores)
- **Kjerner / tråder:** 12 kjerner, 14 tråder
- **Frekvens:** 400 MHz (min) – 4 800 MHz (maks)
- **Cache:**
  - L1d: 352 KiB (10 instanser)
  - L1i: 640 KiB (10 instanser)
  - L2: 10 MiB (5 instanser)
  - L3: 12 MiB (1 instans)
- **Utvidelser:** AVX2, AVX-VNNI, AES-NI, VAES, VNNI

---

## Minne (RAM)

| | Total | Brukt | Ledig | Tilgjengelig |
|---|---|---|---|---|
| RAM | 32 GB | ~7 GB | ~6 GB | ~24 GB |
| Swap | 8 GB | 0 | 8 GB | — |

- Minne-detaljer (type, hastighet, antall moduler) krever `sudo dmidecode` og ble ikke innhentet.

---

## GPU

- **Modell:** Intel Meteor Lake-P [Intel Arc / Xe integrert grafikk]
- **PCI-ID:** 8086:7d45 (rev 08)
- **Kernel-driver:** i915 (også xe tilgjengelig)
- **Dedikert VRAM:** Ingen — bruker delt systemminne
- **GPU-frekvens:** opptil ~1 200 MHz (målt via sysfs)

Ingen diskret GPU (NVIDIA / AMD) ble funnet.

---

## Lagring

| Enhet | Størrelse | Type | Modell |
|---|---|---|---|
| nvme0n1 | 953,9 GB | NVMe SSD | Micron MTFDKBA1T0TGD |

- Kryptert med LUKS (full disk encryption)
- Rotpartisjon: 953 GB totalt, ~100 GB brukt, ~850 GB ledig

---

## Relevans for lokal LLM

Maskinen har **ingen diskret GPU** med dedikert VRAM. All inferens kjøres enten:
- på **CPU** via `llama.cpp` / Ollama (GGUF-format), eller
- med delt systemminne via **Intel Xe / SYCL**-backend i `llama.cpp`

Med 32 GB systemminne er følgende størrelsesklasser realistiske:

| Modellstørrelse | Kvantisering | Estimert størrelse | Status |
|---|---|---|---|
| 3–4B | Q4_K_M | ~2–3 GB | Komfortabelt, rask |
| 7–9B | Q4_K_M | ~4–6 GB | Komfortabelt |
| 13–14B | Q4_K_M | ~8–10 GB | Komfortabelt |
| 20–24B (MoE) | Q4/MXFP4 | ~14–16 GB | Mulig — MoE aktiverer færre parametere |
| 27B (dense) | Q4_K_M | ~17–20 GB | Mulig, lite minne igjen til OS |
| 70B+ | Q4_K_M | ~40–45 GB+ | Ikke mulig |

**Viktig for CPU-only:** MoE-modeller (Mixture of Experts) aktiverer bare en brøkdel av
parameterne per token. `gpt-oss:20b` har f.eks. 21B totale parametere men bare ~3,6B aktive —
det gir vesentlig bedre tokens/sek enn en tilsvarende dense-modell på CPU.

---

## Anbefalte Ollama-modeller (april 2026)

*Oppdatert etter research på gjeldende modellandskap. Mange populære modeller fra 2025
(Qwen 2.5, Gemma 2, Phi-3.5) er erstattet av nyere generasjoner.*

### Tier 1 — Raske baselinjer (~2–3 GB)

| Modell | Pull-kommando | RAM | Merknad |
|---|---|---|---|
| Llama 3.2 3B | `ollama pull llama3.2:3b` | ~2 GB | Tiny baseline, tool-calling |
| Gemma 3 4B | `ollama pull gemma3:4b` | ~3 GB | 140+ språk, multimodal, effektiv |
| Qwen 3 4B | `ollama pull qwen3:4b` | ~3 GB | Sterk small, god norsk |
| Phi-4 Mini | `ollama pull phi4-mini` | ~3 GB | Reasoning-fokus for størrelsen |

### Tier 2 — Primærmodeller for testing (~5–10 GB)

| Modell | Pull-kommando | RAM | Merknad |
|---|---|---|---|
| Qwen 3 8B | `ollama pull qwen3:8b` | ~5 GB | Anbefalt daglig driver, god norsk |
| Llama 3.1 8B | `ollama pull llama3.1:8b` | ~5 GB | Klassisk referanse/baseline |
| Phi-4 14B | `ollama pull phi4:14b` | ~9 GB | Microsoft SOTA kompakt |
| DeepSeek R1 14B | `ollama pull deepseek-r1:14b` | ~9 GB | Beste reasoning i klassen |

### Tier 3 — Grensetest på 32 GB (~14–20 GB)

| Modell | Pull-kommando | RAM | Merknad |
|---|---|---|---|
| **GPT-OSS 20B** | `ollama pull gpt-oss:20b` | ~16 GB | MoE, 3.6B aktive — trolig raskeste >10B på CPU |
| Devstral Small 2 24B | `ollama pull devstral-small-2:24b` | ~14 GB | Beste åpne kodemodell, 256K kontekst |
| Qwen 3 14B | `ollama pull qwen3:14b` | ~9 GB | God generalist med mer kapasitet |
| Qwen 3.5 27B | `ollama pull qwen3.5:27b` | ~17–20 GB | Stramt men mulig |

### Kode-spesifikke modeller

| Modell | Pull-kommando | RAM | Merknad |
|---|---|---|---|
| Qwen 3 Coder | `ollama pull qwen3-coder-next` | ~5–9 GB | Erstatter qwen2.5-coder, SOTA åpen kode |
| Devstral Small 2 | `ollama pull devstral-small-2:24b` | ~14 GB | Samme som over — kodingsflaggskip |

### Anbefalt sammenligningssett (4 modeller)

For en systematisk sammenligning på denne maskinen anbefales:

1. `qwen3:8b` — rask generalist, god norsk, referansemodell
2. `phi4:14b` — reasoning-orientert, tett Microsoft-modell
3. `gpt-oss:20b` — MoE-eksperiment: *er MoE raskere per token på CPU enn dense?*
4. `devstral-small-2:24b` — grensetest for kodekvalitet

Dette gir et naturlig forskningsspørsmål: **"Gir MoE-arkitektur bedre ytelse enn
dense-modeller på CPU-only maskinvare med samme RAM-forbruk?"**
