---
title: "Agentisk utvikling i praksis: Cursor + GitHub Actions"
date: 2025-11-21
draft: false
description: "Cursor AI rettet feilene i en GitHub Actions-pipeline på egen hånd, bygg for bygg. Hva agentisk utvikling betyr når DevOps skal migreres."
excerpt: "Cursor AI feilsøkte en GitHub Actions-pipeline på egen hånd gjennom fem byggesykluser og gjorde målrettede endringer helt til alt var grønt. Et lærerikt eksempel på agentisk utvikling brukt på infrastrukturarbeid."
readTime: "4 minutters lesing"
categories: ["DevOps", "AI"]
tags: ["Cursor", "GitHub Actions", "AvaloniaUI", "Agentic Development", "Azure DevOps", "CI/CD"]
author: "Pedro Dias"
featuredImage: "/images/blog/2025-11-21-cursor-github-pipelines/featured.jpg"
featuredAlt: "Cursor IDE med GitHub MCP-integrasjon som endrer pipeline-konfigurasjonen på egen hånd"
imageCredit: "© Pedro Dias"
---

{{< callout type="success" title="TL;DR" >}}
Cursor AI feilsøkte en GitHub Actions-pipeline på egen hånd gjennom fem byggesykluser. Det som ellers ville tatt en arbeidsdag, tok 30 minutter. Jeg koblet Cursor til GitHub via MCP og ga den lov til å iterere. Dermed flyttet den CI/CD for en AvaloniaUI-app fra Azure DevOps til GitHub Actions uten at noe menneske grep inn. Det viser hva agentisk utvikling kan gjøre for infrastrukturarbeid: agenten tar de kjedelige iterasjonsrundene, og utviklerne kan konsentrere seg om arkitektur og strategi.
{{< /callout >}}

## Oppsettet

Hos Tradesolution AS vurderer vi å flytte fra Azure DevOps til GitHub Actions. Testcaset vårt er en desktopapp i AvaloniaUI som må bygges for flere plattformer (Windows, macOS, Linux).

I Azure DevOps hadde vi samlet opp måneder med YAML-justeringer. Av typen «ikke rør den, den virker». Å begynne på nytt i GitHub Actions betydde å skrive alt sammen om igjen.

Eksperimentet er en del av den løpende vurderingen vår av Cursor. Vi må kunne forsvare kostnaden og abonnementsmodellen. Gir verktøyet nok verdi til å veie opp for abonnementet? Pipeline-migrasjonen ble en test under virkelige forhold.

Det var i alle fall det jeg trodde.

{{< callout type="info" title="Hovedpoenget" >}}
Dette handler ikke om at AI erstatter utviklere. Det handler om å overlate den kjedelige prøvingen og feilingen («prøv dette, vent 6 minutter, prøv igjen») til agenten, mens du konsentrerer deg om arkitektur og strategi.
{{< /callout >}}

## Dette skjedde

Jeg koblet Cursor til GitHub via MCP og ga den én instruks: «Sett opp en GitHub Actions-workflow for AvaloniaUI-appen vår. Fiks eventuelle feil. Push til main.»

Så satt jeg og så på.

Cursor lagde den første workflowen. **Builden feilet.** Avhengigheter manglet.

Den ba ikke om hjelp. Den leste feilloggene, fant ut hvilke .NET SDK-versjoner som manglet, oppdaterte workflowen og pushet på nytt.

**Builden feilet igjen.** Byggemålene for Avalonia var feil konfigurert.

Cursor justerte. Pushet. Ventet 6 minutter.

**Feilet fortsatt.** Plattformspesifikke NuGet-pakker manglet.

Den ga seg ikke. Fem runder. Hver runde: vent 6 minutter → les feilene → gjør målrettede rettelser → commit → følg med.

{{< img src="/images/blog/2025-11-21-cursor-github-pipelines/successful-build.jpg" alt="GitHub Actions-dashbord som viser vellykket bygg for flere plattformer, med grønne haker for Windows, macOS og Linux" caption="Etter 30 minutter med selvstendig iterasjon: vellykket bygg på alle plattformer" width="1000" class="article-image featured" >}}

> «Å se en AI feilsøke en pipeline gjennom fem byggesykluser à 6 minutter, uten at noe menneske grep inn, var ikke så mye imponerende som oppklarende: infrastrukturarbeid har endret seg grunnleggende.»

**Etter 30 minutter: builden gikk gjennom. Alle plattformer. Alle sjekker bestått.**

## Derfor er dette viktig

**Tiden krymper:** Uten Cursor ville de 30 minuttene vært timer, kanskje en hel dag, med manuell feilsøking. Cursor presset en dags arbeid ned i en halvtime, uten frustrasjon og uten å tvile på seg selv.

**Demokratisering av ekspertise:** Dyp kunnskap om GitHub Actions blir mindre avgjørende. Du setter målet, og Cursor finner fram til løsningen ved å iterere.

**Læring ved å se på:** Jeg lærte av å se Cursor jobbe. Den ferdige YAML-en for pipelinen er ryddigere og lettere å vedlikeholde enn det jeg selv ville skrevet. Det er som parprogrammering med en makker som har uendelig tålmodighet og velprøvde løsninger på rams.

{{< callout type="success" title="Praktisk poeng" >}}
Ikke sett av uker med spesialisttid til pipeline-migrasjoner. Gi Cursor klare mål, MCP-tilgang og lov til å iterere. Følg den første migrasjonen tett. De neste går raskere.
{{< /callout >}}

## Strategisk betydning

Dette endrer måten vi angriper migrasjonen på. I stedet for ett stort og risikabelt prosjekt som krever spesialistkunnskap, deler vi det opp i en serie mindre migrasjoner der AI hjelper til med iterasjonen.

Hver migrasjon gir treningsdata. Cursor bygger opp kunnskap om organisasjonen og blir bedre for hvert repo. Det senker «bus factor»-risikoen: kunnskapen ligger i workflowene, ikke i hodet på enkeltingeniører.

Tre repoer til skal migreres neste kvartal. Med Cursor + GitHub MCP lar det seg gjøre uten å sette av egen tid til en pipeline-spesialist.

**Bunnlinjen:** Agentisk utvikling er ikke så mye et produktivitetsløft som en ny måte å angripe infrastrukturarbeid på. Maskinene tar nå den gjentatte feilsøkingen som før spiste ingeniørtid, og vi kan bruke oppmerksomheten på arkitektur, UX og strategiske valg.

**Dette gjør utviklere sterkere. Det erstatter dem ikke.**

## Kan kostnaden forsvares?

Abonnementet på Cursor koster 20 dollar i måneden, og det er ikke ubetydelig. Kvoten går fort tom, og så begynner du å betale per bruk. Eksperimentet viser en håndfast gevinst: en dags arbeid ble presset ned i 30 minutter. For teamet vårt vokser besparelsen for hver migrasjon og i det løpende vedlikeholdet.

Vi måler tre ting: spart tid per oppgave, hvor mye mindre avhengige vi blir av spesialister, og kvaliteten på koden som genereres. De første resultatene tyder på at abonnementet betaler seg når det brukes strategisk: ikke som krykke, men som kraftmultiplikator for komplekst arbeid med mange runder.

Dommen er ikke falt ennå, men selvstendig feilsøking av pipelines veier tungt i Cursors favør.

---

## Prøv selv

Start med et repo som ikke er forretningskritisk. Gi Cursor uttrykkelig lov til å pushe endringer. Følg de første rundene nøye. Skriv ned hva som fungerer.

Har du prøvd selv, vil jeg gjerne høre hvordan det gikk, særlig hvordan det feilet og hvilke grensetilfeller du traff. Ta kontakt på [LinkedIn](https://linkedin.com/in/digitaldias) eller [GitHub](https://github.com/digitaldias).

## Vanlige spørsmål

**Er Cursor bare GitHub Copilot under et annet navn?**
Nei. Copilot fullfører kode mens du skriver. Agenten i Cursor leser kodebasen din, planlegger oppgaver i flere steg, kjører kommandoer og itererer ut fra resultatene. Feilsøkingen av pipelinen her ville vært umulig med Copilot. Den krever at noen leser byggelogger, gjør målrettede endringer, pusher og ser på neste feil.

**Fungerer dette for alle CI/CD-plattformer, eller bare GitHub Actions?**
Mønsteret gjelder like godt for pipelines i Azure DevOps, CircleCI eller et hvilket som helst system som gir lesbare feilmeldinger. Det avgjørende er at agenten har MCP-tilgang til plattformen, så den kan pushe endringer og lese resultatene uten at du må sitte i midten.

**Hva om agenten gjør en ødeleggende endring underveis?**
Det er riktig ting å bekymre seg for. I dette eksperimentet var repoet ikke forretningskritisk, og det verste som kunne skje, var en ødelagt build, ikke tapte data. For alt som ligger nær produksjon: begrens tilgangene. Lesetilgang til logger, skrivetilgang bare til en feature-branch, ingen rett til å merge.

**20 dollar i måneden virker billig. Hva koster det egentlig?**
Grunnplanen til Cursor er fort brukt opp når agenten jobber mye. Deretter betaler du per bruk. Regn med 40–80 dollar i måneden per aktiv utvikler hvis de bruker den til komplekse oppgaver med mange runder, og ikke bare til autofullføring.

---

## Referanser

Teknologier og verktøy nevnt i dette innlegget:

- **[Cursor](https://cursor.sh)** - AI-drevet kodeeditor med funksjoner for agentisk utvikling
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD-plattform for automatiserte workflows
- **[AvaloniaUI](https://avaloniaui.net/)** - Plattformuavhengig UI-rammeverk for .NET på Windows, macOS og Linux
- **[Azure DevOps](https://azure.microsoft.com/products/devops)** - Microsofts DevOps-plattform (den vi migrerte fra)
- **[MCP (Model Context Protocol)](https://modelcontextprotocol.io/)** - Protokoll for å koble AI-assistenter til eksterne verktøy og datakilder
- **[.NET SDK](https://dotnet.microsoft.com/download)** - Utviklingssett for å bygge .NET-applikasjoner
- **[NuGet](https://www.nuget.org/)** - Pakkehåndterer for .NET
