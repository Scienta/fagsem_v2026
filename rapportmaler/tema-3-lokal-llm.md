---
tema: "3 – Lokal LLM i praksis"
---

# Tema 3 – Lokal LLM i praksis

> **Til gruppen:** Fyll ut alle seksjoner. Det strukturerte sammendraget nederst (YAML-blokken) behandles av en språkmodell for å lage felles presentasjon — vær presis og kortfattet der.

---

## Forskningsspørsmål og hypoteser til inspirasjon

Velg én problemstilling, eller formuler en egen:

1. **Terskelen for "god nok":** For hvilke konkrete oppgavetyper (refaktorering, testskriving, dokumentasjon, bugfixing) er en lokal LLM god nok sammenlignet med en skybasert modell?
2. **Maskinvarekrav:** Hva er den laveste maskinvarekonfigurasjonen der en lokal modell gir akseptabel ytelse for utviklingsoppgaver — og hva er kompromissene?
3. **Personvern vs. kvalitet:** Gir behovet for å holde kode lokalt (personvern, forretningshemmeligheter) tilstrekkelig begrunnelse for å akseptere lavere modellkvalitet?
4. **Agentbruk lokalt:** Kan en lokal LLM brukes som agent (med verktøytilgang, filsystemoperasjoner) — og hva er de praktiske begrensningene?
5. **Offline og latens:** Hvilken praktisk fordel gir offline-tilgang og lavere latens i en utviklingsarbeidsflyt, og oppveier den kvalitetstapet?

---

## Rapportmal

### 1. Gruppeinformasjon

| Felt | Verdi |
|---|---|
| Gruppenummer | *(nummer)* |
| Deltakere | *(navn)* |
| Dato(er) for eksperiment | *(dato)* |
| Lokal modell(er) testet | *(f.eks. Llama 3.1 8B, Mistral 7B, Qwen2.5-Coder)* |
| Skymodell(er) for sammenligning | *(f.eks. Claude Sonnet, GPT-4o)* |
| Maskinvare | *(CPU/GPU, RAM, VRAM)* |

---

### 2. Valgt problemstilling

**Forskningsspørsmål:**
*(Skriv inn det dere undersøker)*

**Hypotese:**
*(Hva tror dere svaret er — før dere begynner?)*

---

### 3. Eksperimentoppsett

#### Hva ble testet
*(Beskriv oppgavene/scenariene som ble brukt til sammenligning)*

#### Betingelser

| Betingelse | Modell | Maskinvare/konfig |
|---|---|---|
| A – Lokal | *(modell)* | *(maskinvare)* |
| B – Sky | *(modell)* | *(N/A eller API)* |

#### Målemetoder
*(Korrekthet, hastighet/tokens per sekund, ressursbruk, subjektiv brukbarhet)*

---

### 4. Resultater

*(Presenter funn med tabeller. Inkluder gjerne konkrete eksempler der lokal vs. sky divergerte)*

---

### 5. Diskusjon

#### Hva funket

#### Hva funket ikke

#### Begrensninger

---

### 6. Konklusjon

*(1–3 setninger: hva er det viktigste dere lærte?)*

---

### 7. Strukturert sammendrag *(behandles av språkmodell)*

> Fyll ut feltene nøyaktig. Bruk korte, faktaorienterte formuleringer.

```yaml
gruppe: ""
tema: "Tema 3 – Lokal LLM i praksis"
forskningsspørsmål: ""
hypotese: ""
lokal_modell: ""
sky_modell: ""
maskinvare: ""
metode_kort: ""          # én setning om eksperimentoppsettet
hovedfunn:
  - ""
  - ""
  - ""
hypotese_bekreftet: ""   # "ja" / "nei" / "delvis"
konklusjon_én_setning: ""
overraskende_funn: ""
anbefaling: ""           # når bør man velge lokal vs. sky?
```
