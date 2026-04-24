---
tema: ""
---

# Rapport

Status for dokument: Provisorisk, på kanten til useriøs. 

---

## Rapport

### 1. Gruppeinformasjon

| Felt                         | Verdi                                            |
|------------------------------|--------------------------------------------------|
| Gruppenummer                 | 3.2                                              |
| Deltakere                    | Johan, Daniel, Hakon, Kjetil                     |
| Tema                         | *Lokal modell i praksis (i teorien)*             |
| Dato(er) for eksperiment     | *2026-04-24*                                     |
| Verktøy/modeller brukt       | *Claude Code, opencode, ollama*                  |
| Repo / kodebase / case brukt | *https://github.com/Scienta/fagsem-2026-grp3_2/* |

---

### 2. Valgt problemstilling

**Forskningsspørsmål:**

Forskjeller mellom Claude og lokale modeller

**Hypotese:**

Claude er best.

---

### 3. Eksperimentoppsett

#### Hva ble testet

Be agenten om å lage en enkel kommandolinjeapplikasjon i Python, som

1. Leser innputtfil med data om skatteytere
2. Produserer en liste over skatteytere og hvor mye de skal betale i skatt

#### Betingelser

*(Minst to betingelser for sammenligning dersom det passer for eksperimentet)*

| Betingelse   | Beskrivelse                                             |
|--------------|---------------------------------------------------------|
| A - Baseline | *Applikasjon produsert av Claude Code med Opus 4.7*     |
| B - Variant  | *Applikasjon produsert av Claude Code med lokal modell* |

#### Målemetoder

*At de gir samme svar*

(Vurderte å evaluere tiden brukt til generering, kodekvalitet etc. men kom aldri så langt.)

---

### 4. Resultater

Det er bare såvidt det funker med lokale modeller:
* Claude Code mangler pr. default tools for å lese/skrive filer
* Lokale modeller skjønner ikke oppgaven
* Lokale modeller skjønner ikke AT DE HAR FÅTT en oppgave engang
* Lokale modeller KAN få til noen, men så skjønner de ikke hvor filene skal skrives

---

### 5. Diskusjon

#### Hva funket

Claude.
glm-4.7-flash:q4_K_M fungerte forsåvidt, men brukte 1 time og 45  minutter. Avik på 1.- i forhold til fasit må vel være innafor :D 

#### Hva funket ikke

Lokale små modeller (gemma4:8b og lignende) klarer ikke å benytte seg av verktøyene i Claude Code og OpenCode.

#### Begrensninger

Egen innsikt.

---

### 6. Konklusjon

* Dette var gøy!
---
