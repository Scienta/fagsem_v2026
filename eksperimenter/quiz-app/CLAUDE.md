# Øreprøven – musikk-quiz app

## Kjøring og bygging

```bash
npm install        # første gang
npm run dev        # utviklingsserver på http://localhost:5173
npm run build      # produksjonsbygg til dist/
```

## Tech stack

- **React 18** med TypeScript (strict `verbatimModuleSyntax` — bruk `import type` for type-only imports)
- **Vite** som byggverktøy
- Ingen eksterne avhengigheter utover React — all styling er ren CSS

## Arkitektur

Appen er en enkel single-page app med en `Page`-state-maskin i `App.tsx`:

```
lobby → music-quiz → results → lobby
```

`App.tsx` holder `page`, `score`, `total` og valgt `genre`. Disse tre sidene er egne komponenter.

## Filstruktur

```
src/
  App.tsx / App.css          – ruter mellom sider, holder global state
  LobbyPage.tsx              – sjanger-velger + start-knapp
  MusicQuizPage.tsx          – selve quizen
  MusicQuizPage.css          – quiz-spesifikk styling (album cover, play-knapp)
  QuizPage.css               – delte quiz-stiler (brukes av MusicQuizPage)
  ResultsPage.tsx / .css     – poengvisning etter quiz
  genres.ts                  – Genre-type, konfig per sjanger (label, emoji, theme-klasse, søkeord)
  spotify/musicClient.ts     – henter spørsmål fra iTunes Search API
  utils/shuffle.ts           – Fisher-Yates shuffle
```

## Sjangervalg og temaer

`genres.ts` er den eneste kilden til sannhet for sjangre. Hver sjanger har:
- `label` / `emoji` – vises i lobbyen
- `theme` – CSS-klasse som settes på `<main>` i alle tre sider (f.eks. `theme-rock`)
- `terms` – liste med søkeord til iTunes

For å legge til en ny sjanger: legg til en ny nøkkel i `GENRES`-objektet og `GENRE_ORDER`-arrayen i `genres.ts`, og legg til tilhørende `.theme-X`-overrides i `App.css`, `QuizPage.css`, `MusicQuizPage.css` og `ResultsPage.css`.

## Spørsmålsgenerering

`generateQuizQuestions(terms, count = 10)` i `musicClient.ts`:
1. Velger ett tilfeldig søkeord fra `terms`
2. Søker iTunes Search API (gratis, ingen auth, CORS-vennlig)
3. Filtrerer bort spor uten `previewUrl`
4. Shuffler og tar de første 10
5. Bygger 4 svaralternativer: riktig artist + 3 distraktorer fra samme resultatsett (deduplisert med `Set`)
6. Skalerer `artworkUrl100` til 600×600

Spotify ble vurdert men forkastet – preview URLs er fjernet fra Spotify API (2023).

## Poengberegning

```
riktig svar: Math.round(1000 + (timeLeft / 30) * 29000)   → 1 000–30 000 poeng
feil svar / timeout: 0 poeng
```

`onFinish` kalles med `(totalPoints, questions.length * 30000)` slik at `score/total`-ratioen i `ResultsPage` fortsatt gir meningsfull feedback (0–1).

## Timer og tilstandshåndtering

`MusicQuizPage` bruker fire `useEffect`-hooks for timer-logikk:
1. Reset timer og autoplay audio når spørsmål endres
2. Teller ned `timeLeft` hvert sekund
3. Setter `timedOut = true` når `timeLeft` når 0 (eget flagg for å unngå race condition)
4. Auto-avanserer til neste spørsmål 1,5 sek etter timeout

`timedOut`-flagget er viktig: uten det ville timeren sette nytt spørsmål som besvart umiddelbart fordi `timeLeft` er 0 ved første render.

## Album cover

To lag stables oppå hverandre i `.audio-visual`:
- `.album-cover-blur` – CSS-animasjon `album-reveal 20s ease-in forwards` (blur 20px → 0)
- `.album-cover-sharp` – opacity 0 → 1 via transition når `isAnswered` blir true

Begge har `key={currentIndex}` / `key={\`sharp-${currentIndex}\`}` for å remounte og nullstille tilstand ved nytt spørsmål.

## Kjente gotchas

- `audio.play()` returnerer en Promise som kan rejectes (autoplay-blokkering). Kall alltid `.then(() => setIsPlaying(true)).catch(...)` — ikke sett state synkront etter kallet.
- iTunes-fetchen kan feile. `isError`-state viser feilmelding i stedet for å henge på "Genererer quiz...".
- Distraktorer dedupliseres med `Set` før filtrering — uten dette kan samme artist dukke opp flere ganger som alternativ og gi dupliserte React-nøkler.
