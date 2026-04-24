# Øreprøven – produkteier-manual

## Formål

Øreprøven er en nettbasert musikk-quiz der brukeren gjetter artist ved å lytte til korte lydklipp. Appen henter spørsmål dynamisk fra et eksternt API, slik at innholdet varierer fra runde til runde. Appens primære mål er å være engasjerende, visuelt attraktiv og umiddelbart tilgjengelig uten innlogging eller oppsett.

---

## Sider og flyt

```
Startside → Quiz → Resultater → Startside
```

Brukeren kan til enhver tid avbryte quizen og returnere til startsiden.

---

## Side 1 – Startside

### Formål
Lar brukeren velge sjanger og starte quizen.

### Innhold
| Element | Beskrivelse |
|---|---|
| Appnavn | «Øreprøven» – stor, fremtredende tittel |
| Tagline | Kort slagord under tittelen |
| Sjanger-velger | 6 valg presentert i et rutenett |
| Start-knapp | Starter quizen med valgt sjanger |

### Sjangre
| ID | Visningsnavn | Beskrivelse |
|---|---|---|
| mixed | Blandet | Blanding av alle sjangre |
| pop | Pop | Populærmusikk fra 2010 til i dag |
| rock | Rock | Klassisk rock og 80-talls arena rock |
| metal | Metal | Heavy metal, hair metal og thrash fra 80-tallet |
| hiphop | Hip Hop | Moderne hip hop |
| rnb | R&B | Rhythm and blues og soul |

### Atferd
- Standard valg ved innlasting er «Blandet»
- Kun én sjanger kan være valgt om gangen
- Den valgte sjangerens knapp fremheves visuelt
- Bakgrunn, tittelfarger og knapp-stil på startsiden endrer seg umiddelbart når brukeren bytter sjanger

---

## Side 2 – Quiz

### Formål
Vise ett spørsmål om gangen og la brukeren svare innen tidsfristen.

### Innhold og layout (ovenfra og ned)
| Element | Beskrivelse |
|---|---|
| Fremdriftsindikator | Viser «Spørsmål X av Y» og løpende poengsum |
| Fremdriftsbar | Viser andel gjennomførte spørsmål |
| Tidslinje | Viser gjenværende tid for gjeldende spørsmål |
| Spørsmålstekst | Fast tekst: «Hvem er artisten?» |
| Album-visning | Bilde + lydavspiller |
| Svaralternativer | Fire knapper i et 2×2-rutenett |
| Poengbadge | Vises etter riktig svar |
| Neste-knapp | Vises etter at svar er avgitt |
| Avslutt-lenke | Diskret lenke nederst på siden |

### Spørsmålsgenerering
- Quizen består av **10 spørsmål** per runde
- Spørsmål hentes dynamisk fra iTunes Search API basert på valgt sjanger
- Hvert spørsmål inneholder: korrekt artist, 3 distraktorer, URL til lydklipp (30 sek), URL til albumcover
- Distraktorer hentes fra andre artister i det samme søkeresultatet
- Ingen artist skal forekomme mer enn én gang som alternativ i samme spørsmål

### Album-visning
- Albumcoveret vises skalert til 600×600 piksler
- Ved start av spørsmål er bildet **uskarp (blur)**
- Bildet blir gradvis skarpere over **20 sekunder**
- Når brukeren avgir svar **avsløres bildet umiddelbart**
- Lydklippet **starter automatisk** når spørsmålet lastes inn
- En play/pause-knapp lar brukeren styre avspillingen manuelt

### Nedtellingstimer
- Hver spørsmål har **30 sekunder** tilgjengelig tid
- Timeren vises som en horisontal progressbar som tømmes fra høyre mot venstre
- De siste **10 sekundene** endrer timeren farge til rødt for å signalisere hastverk
- Når timeren når null uten at brukeren har svart:
  - Spørsmålet markeres automatisk som besvart (0 poeng)
  - Appen venter 1,5 sekunder og avanserer automatisk til neste spørsmål

### Svaralternativer
- Fire alternativer vises samtidig i et 2×2-rutenett
- Når et alternativ er valgt:
  - Korrekt alternativ markeres **grønt** med en puls-animasjon
  - Feil valgt alternativ markeres **rødt** med en riste-animasjon
  - Alle alternativer deaktiveres
  - Lydavspillingen stopper
- På mobil (skjermbredde under 600 px) vises alternativene i én kolonne

### Poenggiving
- **Riktig svar**: `1 000 + (gjenværende sekunder / 30) × 29 000` poeng, avrundet til nærmeste heltall
  - Maksimalt: **30 000 poeng** (umiddelbart svar)
  - Minimum: **1 000 poeng** (ett sekund igjen)
- **Feil svar eller timeout**: **0 poeng**
- Poengene for gjeldende spørsmål vises som et grønt animert merke etter riktig svar
- Løpende totalsum vises øverst til høyre gjennom hele quizen

### Navigasjon i quizen
- Etter avgitt svar vises knappen **«Neste spørsmål»** (eller **«Se resultat»** på siste spørsmål)
- Brukeren kan ikke gå tilbake til forrige spørsmål
- Lenken **«Avslutt quiz»** nederst på siden sender brukeren tilbake til startsiden uten å lagre resultatet

---

## Side 3 – Resultater

### Formål
Oppsummere prestasjon og invitere til ny runde.

### Innhold
| Element | Beskrivelse |
|---|---|
| Totalpoeng | Stor, fremtredende visning av oppnådd poengsum |
| Tilbakemelding | Dynamisk tekst basert på poengandel (se tabell under) |
| «Spill igjen»-knapp | Returnerer brukeren til startsiden |

### Tilbakemeldingstekster
| Poengandel | Tekst |
|---|---|
| 100 % | «Perfekt! Du bestod Øreprøven!» |
| 80–99 % | «Imponerende! Du kan fagene dine.» |
| 60–79 % | «Bra jobbet! Litt mer øving, så er du der.» |
| 40–59 % | «Ikke verst! Prøv igjen for en bedre score.» |
| Under 40 % | «Bedre lykke neste gang!» |

---

## Visuelt design

### Generelle prinsipper
- Mørkt design med gradientbakgrunner
- Hvit tekst på mørk bakgrunn
- Avrundede hjørner og myke skygger
- Glassmorfisme på avspillingsknappen (frosted glass-effekt)
- Responsivt – fungerer på både desktop og mobil

### Sjangertemaer
Hvert sjangertema har en unik fargepalett som anvendes konsekvent på tvers av alle tre sider (startside, quiz, resultater).

| Sjanger | Primærfarge | Karakteristikk |
|---|---|---|
| Blandet | Lilla/blå | Standard tema |
| Pop | Rosa/magenta | Lys og livlig |
| Rock | Mørkerød/oransje | Intens og varm |
| Metal | Nesten svart/stålgrå | Mørk og hard |
| Hip Hop | Svart/gull | Mørk med gullaksenter |
| R&B | Dyp lilla/fiolett | Rik og sanselig |

Temafargen påvirker: bakgrunnsgradienten, fremdrifts- og tidslinje-barer, knapper, tekstelementer og poengbadge.

---

## Feilhåndtering

| Situasjon | Atferd |
|---|---|
| iTunes API utilgjengelig | Viser feilmelding: «Kunne ikke laste quiz. Sjekk internettforbindelsen og prøv igjen.» |
| Autoplay blokkert av nettleser | Lydklippet starter ikke automatisk; brukeren kan starte manuelt via play-knappen |
| Færre enn 10 spor med lydklipp returnert | Quizen kjøres med de sporene som er tilgjengelige |

---

## Utenfor scope

Følgende er bevisst ikke implementert i denne versjonen:

- Brukerkontoer og lagring av historikk
- Flerspiller / sanntidskonkurranse
- Highscore-liste
- Mulighet for å gå tilbake til forrige spørsmål
- Tilpasning av antall spørsmål eller tidsfrist
