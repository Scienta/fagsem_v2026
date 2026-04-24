###############
## Eksperimentrapport -gruppe-3-1

### I. Hva ble gjort? (The Experiment)
Vi utførte kloning og grundig analyse av mcalert-prosjektet. Dette innebar å studere arkitekturen, avhengighetene til Prometheus, og hvordan applikasjonen fungerer for å visualisere clusterstatus via macOS menylinjen.

### II. Hva er mcalert? (Tool Description)
`mcalert` er et macOS-verktøy som overvåker statusen til et Kubernetes-cluster ved å koble til flere Prometheus-endpoints. Det gir en synlig indikator i Mac'ens menylinje som viser om clusteret er friskt eller om det er kritiske avvik. Verktøyet er svært nyttig for rask visuell feilretting og statuskontroll.

### III. Funn og Resultater (Findings and Results)
#### 🔍 Kildedata og Funn:
[Oppsummer de viktigste observasjonene her. For eksempel: "Vi observerte at mcalert effektivt identifiserer hvilke komponenter som rapporterer feil, selv når Prometheus-dataene er komplekse."]

#### ⏱️ Ytelse og Query-tid:
| Scenario | Forespørselstype | Gjennomsnittlig tid | Kommentar |
| :--- | :--- | :--- | :--- |
| Feilhåndtering | [Eksempel: KubeControllerManager] | [Sett inn tidsforbruk] | [Kommentar om hvor raskt feilen ble fanget.] |
| Normal drift | Hver endpoint | [Sett inn tidsforbruk] | Generelt rask respons. |

**Konklusjon:**
[Oppsummer en kort konklusjon. For eksempel: "Eksperimentet viser at mcalert er et robust og brukervennlig verktøy for å gi umiddelbar oversikt over operasjonell stabilitet i store systemer."]
###############