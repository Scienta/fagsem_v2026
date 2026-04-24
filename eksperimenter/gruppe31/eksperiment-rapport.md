###############
## Eksperimentrapport -gruppe-3-1

### I. Hva ble gjort? (The Experiment)
Vi utførte kloning og grundig analyse av mcalert-prosjektet. Dette innebar å studere arkitekturen, avhengighetene til Prometheus, og hvordan applikasjonen fungerer for å visualisere clusterstatus via macOS menylinjen.

### II. Hva er mcalert? (Tool Description)
`mcalert` er et macOS-verktøy som overvåker statusen til et Kubernetes-cluster ved å koble til flere Prometheus-endpoints. Det gir en synlig indikator i Mac'ens menylinje som viser om clusteret er friskt eller om det er kritiske avvik. Verktøyet er svært nyttig for rask visuell feilretting og statuskontroll.

### III. Funn og Resultater (Findings and Results)
#### 🔍 Kildedata og Funn:
*   `mcalert` effektivt identifiserer hvilke komponenter som rapporterer feil, selv når Prometheus-dataene er komplekse.
*   **Plattformytelse:** Ollama på Mac presterer vesentlig bedre enn på Linux under lignende belastninger.
*   **Modellkonsistens:** Vi observerte at den samme språkmodellen oppfører seg forskjellig avhengig av plattform, noe som kan indikere en konfigurasjonsavhengighet.

**Konklusjon:**
Konklusjon: OpenCode er dårlig på konklusjoner
###############