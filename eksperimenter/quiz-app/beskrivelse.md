# Øreprøven – funksjonell beskrivelse

## Hva er Øreprøven?

Øreprøven er en nettbasert musikk-quiz der brukeren skal gjette artist basert på et kort lydklipp fra en sang. Appen henter sanger dynamisk fra internett, slik at spørsmålene er forskjellige hver gang man spiller.

## Brukerflyt

### 1. Velg sjanger
Brukeren møter en startside der de velger hvilken sjanger de vil bli testet i. Alternativene er:

- **Blandet** – et tverrsnitt av ulike sjangre
- **Pop** – populærmusikk fra 2010-tallet og frem til i dag
- **Rock** – klassisk rock og 80-talls arena rock
- **Metal** – heavy metal, hair metal og thrash fra 80-tallet
- **Hip Hop** – moderne hip hop
- **R&B** – rhythm and blues og soul

Forsiden skifter visuelt utseende basert på valgt sjanger, slik at man allerede på startsiden får en følelse av hvilken stemning som venter.

### 2. Spill quizen
Quizen består av 10 spørsmål. For hvert spørsmål skjer følgende:

- Et lydklipp starter automatisk så fort spørsmålet lastes inn
- Et albumcover vises i bakgrunnen, gradvis skarpere over 20 sekunder
- Brukeren ser fire svaralternativer og velger hvem artisten er
- En tidslinje øverst viser hvor mye tid som gjenstår (30 sekunder per spørsmål)
- Når svaret er avgitt avsløres albumcoveret umiddelbart

**Ved riktig svar** lyser svaralternativet grønt med en animasjon, og et poengbeløp vises.

**Ved feil svar** rister det valgte alternativet, og det riktige svaret markeres grønt.

**Hvis tiden går ut** uten at brukeren har svart, avanserer spillet automatisk til neste spørsmål etter kort tid.

Brukeren kan når som helst avslutte quizen ved å trykke på «Avslutt quiz» nederst på siden.

### 3. Poenggiving
Poengene beregnes ut fra hvor raskt brukeren svarer riktig:

- **Umiddelbart svar** gir 30 000 poeng
- **Svar på slutten av nedtellingen** gir 1 000 poeng
- **Feil svar eller timeout** gir 0 poeng

En løpende totalsum vises øverst til høyre under hele quizen.

### 4. Resultater
Etter siste spørsmål vises resultatsiden med totalpoeng og en tilbakemelding basert på prestasjon. Herfra kan brukeren velge å spille igjen, og kommer da tilbake til startsiden.

## Visuell identitet

Appen har et mørkt, moderne design med gradientbakgrunner og glassmorfisme-effekter. Hvert sjangertema har sin egen fargepalett som går igjen på tvers av alle sider – fra startside til quiz til resultater.
