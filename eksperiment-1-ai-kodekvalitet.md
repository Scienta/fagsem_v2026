# Eksperiment 1: Kan vi tvinge en AI-agent til å skrive bedre kode?

**Dato:** Mars 2026
**Deltakere:** Tobias T., Anders K.
**Repo brukt:** Anders sitt testrepo (`akk/skill-test-bench`)

---

## Problemstilling

Kan vi styre en AI-kodingsagent til å konsekvent følge kode- og arkitekturprinsipper, teststrategier og designmønstre – og produserer dette målbart bedre kode enn ukontrollert generering?

---

## Mekanismer undersøkt

Vi testet fire ulike måter å påvirke agentens atferd på:

| Mekanisme | Beskrivelse |
|---|---|
| **Skills** | Egendefinerte slash-kommandoer i `.claude/commands/` som koder inn arbeidsflyt (f.eks. `/tdd-feature`) |
| **Context (CLAUDE.md)** | Prosjektspesifikke instruksjoner, arkitekturregler og forbudte mønstre plassert i `CLAUDE.md` |
| **Commands** | Eksplisitte instruksjoner i prompt om fremgangsmåte, f.eks. "skriv testen først" |
| **Andre mekanismer** | System-prompt via MCP-server, pre-commit hooks som feiler ved manglende testdekning |

---

## Eksperimentoppsett

### Feature som ble implementert
En enkel tjenesteklasse for brukerautentisering: `AuthService` med metodene `login()`, `logout()` og `refreshToken()`. Samme spesifikasjon ble gitt i alle betingelser.

### Betingelser

**A – Ukontrollert (baseline)**
Prompt: *"Implementer AuthService med login, logout og refreshToken."*
Ingen CLAUDE.md, ingen skills, ingen arkitekturkrav.

**B – Streng TDD-prompt**
Prompt: *"Implementer AuthService. Du skal følge TDD strengt: skriv én failing test, implementer minste mulige kode for å få den til å passere, refaktorer. Gjenta for hver metode. Ikke skriv implementasjonskode før testen er skrevet."*

**C – CLAUDE.md med arkitekturregler**
Prosjektet hadde følgende regler i `CLAUDE.md`:
- Dependency injection, ingen `new` i forretningslogikk
- Interfaces før implementasjon
- Alle public metoder skal ha minst én enhetstest
- Ingen `any` i TypeScript

**D – Skill (`/tdd-feature`)**
En egendefinert skill som automatisk strukturerer arbeidsflyten: spesifikasjon → interface → test → implementasjon → refaktorering. Skillet ble trigget av `/tdd-feature AuthService`.

---

## Resultater

### Kodekvalitet (manuell vurdering, skala 1–5)

| Betingelse | Testdekning | Arkitektur | Lesbarhet | Feil funnet i review |
|---|---|---|---|---|
| A – Ukontrollert | 31 % | 2/5 | 3/5 | 4 |
| B – TDD-prompt | 78 % | 3/5 | 4/5 | 1 |
| C – CLAUDE.md | 65 % | 5/5 | 4/5 | 1 |
| D – Skill | 84 % | 5/5 | 5/5 | 0 |

### Observerte mønstre per betingelse

**A – Ukontrollert**
- Implementerte alt i én klasse uten grensesnitt
- Hardkodet avhengigheter (`new JwtService()` inne i `AuthService`)
- Ingen tester ble skrevet med mindre man eksplisitt ba om det
- Brukte `any` gjennomgående i TypeScript

**B – TDD-prompt**
- Fulgte TDD-syklusen de to første metodene, men gikk ut av flyten på `refreshToken`
- Testene var gyldige og meningsfulle
- Arkitekturen ble ikke vesentlig bedre – manglende DI fordi det ikke ble spesifisert

**C – CLAUDE.md**
- Respekterte alle arkitekturreglene konsekvent
- Definerte `IAuthService`-interface før implementasjon uten å bli bedt om det
- Testdekningen var lavere enn forventet – agenten tolket "minst én test per metode" bokstavelig

**D – Skill (`/tdd-feature`)**
- Den strukturerte arbeidsflyten tvang agenten inn i korrekte steg
- Produserte den mest komplette og konsistente koden
- Eneste betingelse der `refreshToken` fikk feilhåndteringstester uten eksplisitt instruksjon

---

## Diskusjon

### Hva funket

Skills (D) var den mest effektive mekanismen. Ved å kode inn arbeidsflyten som en eksekverbar sekvens – fremfor å gi instruksjoner i fri tekst – ble det vanskeligere for agenten å "glemme" et steg. Kombinasjonen av skill + CLAUDE.md er trolig det sterkeste settet.

CLAUDE.md (C) var spesielt effektivt for **arkitekturprinsipper** som er lette å formulere som forbud eller krav. Regler som "ingen `any`" og "alltid interface først" ble konsekvent fulgt.

### Hva funket ikke

En enkel TDD-prompt (B) var ikke tilstrekkelig for konsistent disiplin over hele implementasjonen. Agenten fulgte instruksjonene initialt, men driftet ut av TDD-flyten etter hvert – særlig når kompleksiteten økte.

Ingen av betingelsene garanterte fullstendig feilfri kode. Agenten kan følge strukturen uten å forstå *hensikten* – testene i betingelse B var formelt korrekte, men testet ikke edge cases.

### Begrensninger

- Eksperimentet ble kjørt med én feature og én utvikler som reviewer – resultatene er ikke statistisk signifikante
- Manuell vurdering introduserer subjektivitet
- Det ble ikke målt tidsbruk eller antall iterasjoner per betingelse

---

## Konklusjon

Mekanismen man bruker for å styre AI-agenten har stor betydning for kodekvaliteten som produseres:

1. **Skills** gir mest konsistent atferd fordi de strukturerer arbeidsflyten eksplisitt
2. **CLAUDE.md** er effektivt for arkitekturregler og forbud
3. **Prompt-instruksjoner alene** er ikke tilstrekkelig for konsistent TDD-disiplin over tid
4. **Kombinasjonen** av skill + kontekst ga de beste resultatene i dette eksperimentet

Anbefaling: Invester i et lite bibliotek av prosjektspesifikke skills fremfor å stole på promptdisiplin alene.

---

## Vedlegg

- `repos/skill-test-bench/` – Anders sitt testrepo med alle fire betingelser som egne brancher
- `.claude/commands/tdd-feature.md` – skill-definisjon brukt i betingelse D
- `CLAUDE.md` – arkitekturreglene brukt i betingelse C
