---
tema: ""
---

# Rapport

Status for dokument: Levert. (Og korrigert igjen litt etterpå.)

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

Forskjeller mellom Claude og lokale modeller som modeller for kodeagenter.

**Hypotese:**

Claude er best, lokale modeller har verdi.

---

### 3. Eksperimentoppsett

#### Hva ble testet

Be agenten om å lage en enkel kommandolinjeapplikasjon i Python, som

1. Leser innputtfil med data om skatteytere
2. Produserer en liste over skatteytere og hvor mye de skal betale i skatt

Applikasjonen skal lages basert på en beskrivelse av skatteutregningen, lastet fra Skatteetaten,
pluss et prompt som beskriver oppgaven:

```aiignore
The task is to produce a command-line utility in Python that can perform the following task:

1. Read a file containing tax data for one or more persons who are wage earners.
2. For each person, calculate tax owed. The rules for the calculation can be found in the Appendix A
3. Output the result of the calculation for each person.

The program should written from scratch as a stand-alone project, in the output directory given by the `$FILE_DIR`
environment variable.

The program should accept a single input file as an argument and produce the answer on stdout.

The Python project should be located in the subdirectory `solutions/gemma4`.

The project directory should contain a `README.md` file with instructions on how to run the program. For evaluation
purposes, the README file should contain a section saying when the project was initiated, and when it was completed. The
timestamps should be in a resolution of seconds.

Example input file, with two taxpayers where name, age, income, and region are provided:

Roger Rud
50 years
125 000 NOK
Eastern Norway

Per Høneeier
42 years
7 000 000 NOK
Finnmark

Example result output, where the taxpayers are listed with tax owed:

Roger Rud
20 000 NOK

Per Hønseeier
1 000 000 NOK
```

Oppgaven ble gitt på engelsk, og skatteutregningsbeskrivelsen ble også oversatt til engelsk.
Dette fordi vi antar at modeller har varierende norsk-kunnskaper, og det er ikke denne variasjonen vi vil evaluere.

#### Betingelser

*(Minst to betingelser for sammenligning dersom det passer for eksperimentet)*

| Betingelse   | Beskrivelse                                             |
|--------------|---------------------------------------------------------|
| A - Baseline | *Applikasjon produsert av Claude Code med Opus 4.7*     |
| B - Variant  | *Applikasjon produsert av Claude Code med lokal modell* |

Lokale modeller som ble evaluert:

* gemma4
* glm-4.7-flash
* qwen3.6

Lokale modeller ble kjørt av Ollama.

Agenter som ble evaluert:

* Claude Code
* OpenCode

#### Målemetoder

Vi vurderte følgende egenskaper som målbare:

* Korrekthet (At de gir samme output)
* Kvalitet (Evaluert av Claude QA)
* Tidsbruk (Tid brukt på generering)

Av disse rakk vi kun å se på korrektheten, og da med varierende grad av suksess.

Siden gruppa hadde forskjellige maskiner og spesifikasjoner, er tidsbruk antagelig ikke en interessant måleparameter.

---

### 4. Resultater

Claude Opus 4.7 i Claude Code ga inntrykk av å fungere som forventet. Den besvarte sin oppgave på 7-8 minutter. Denne
ble akseptert som "fasit" for andre modeller å sammenligne seg
med. Vi satte ikke av tid til å verifisere løsningen.

Fungerende lokale modeller:

* glm-4.7-flash:q4_K_M (i Claude Code) lagde en applikasjon som ga riktig (nok) svar. Tidsbruk: 1 time og 45 minutter.
  Avvik på 1 krone i forhold til fasit.
* gemma4:8b (i opencode) lagde en applikasjon som feilet på innlesing av innputtfil.
* qwen3.6:35b (i Claude Code) lagde en applikasjon som ga riktig svar. Tidsbruk: 90 minutter (Mac, M2 Pro, 36G RAM)

Ellers var det mest problemer:

* Lokale modeller hadde problemer med å bruke Claude Codes verktøykasse, f.eks. for lesing og skriving av filer
* Lokale modeller skjønner ikke oppgaven
    * Lokale modeller skjønner ikke AT DE HAR FÅTT en oppgave engang
* Lokale modeller KAN få til noen, men så skjønner de ikke hvor filene skal skrives (manglede verktøytilgang)

---

### 5. Diskusjon

#### Hva funket

Claude med Claude Code fungerer. Lokale modeller fungerer med betydelig mer tidsbruk.

#### Hva funket ikke

Integrasjon mellom agenter og modeller (verktøy) er ikke helt vanntett, og lokale modeller (gemma4:8b og lignende)
klarer ikke å benytte seg av verktøyene i Claude Code og OpenCode.

#### Begrensninger

Egen innsikt og manglende erfaring med agenter.

---

### 6. Konklusjon

* Dette var gøy!
