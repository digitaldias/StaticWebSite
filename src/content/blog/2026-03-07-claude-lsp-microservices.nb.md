---
title: "Du åpner sannsynligvis Claude Code på feil nivå"
date: 2026-03-07
draft: false
description: "Åpne Claude Code i roten over mikrotjenestene, ikke i hver tjeneste. Uten CLAUDE.md og LSP-plugins på plass koster det mer enn det sparer."
excerpt: "De fleste åpner Claude Code inne i én enkelt tjeneste. Åpne det heller i overmappen, og gi det verktøyene det trenger for ikke å famle i blinde."
readTime: "7 minutters lesing"
categories: ["DevOps", "AI"]
tags: ["Claude Code", "LSP", "dotnet", "csharp", "typescript", "microservices", "monorepo", "csharp-ls", "agentic-development"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-03-07-claude-lsp-microservices/featured.jpg"
featuredAlt: "Et mørkt gatenett om natten sett rett ovenfra: 13 bydeler forbundet av lysende blå stier, med ett sentralt knutepunkt i dyp rødt"
imageCredit: "Generated with Z-Image-Turbo"
---

Er systemet ditt delt opp i mikrotjenester, kjører du trolig Claude Code inne i hver enkelt tjeneste. Én økt for API-et, én for workeren, én for frontend. Det er det opplagte valget.

Det er også feil.

Den store produktivitetsgevinsten får du når du åpner Claude Code i overmappen, den felles roten som rommer alle tjenestene dine. Én økt, full oversikt over systemet, resonnering på tvers av tjenester uten å bytte kontekst. Men åpner du i roten uten skikkelig forberedelse, gjør du vondt verre. Claude kjenner ikke strukturen og veier opp for det ved å lese alt det finner. I et repo med 13 tjenester brenner det fort gjennom kontekstvinduet ditt.

To ting må på plass for at arbeid fra rotnivå skal fungere. Du trenger begge.

{{< callout >}}
**TLDR:** Åpne Claude Code i overmappen som inneholder alle tjenestene dine, ikke inne i hver enkelt. Legg en `CLAUDE.md` i roten, så vet Claude hvor det er fra første stund. Installer LSP-plugins, så navigerer det etter typegrafen i stedet for å lese filer: go-to-definition går fra ~2 100 tokens til ~15. På Windows virker C#-LSP-en med en gang. TypeScript-LSP-en trenger en [liten `.exe`-shim](https://gist.github.com/digitaldias/0570fdec31127113ffd10144dad2b5b5) fordi Claude Code har en feil i måten det bruker spawn i Node.js på. Strategien fungerer også i Cursor og Windsurf.
{{< /callout >}}

---

## Hva «rotnivå» faktisk betyr her

Repoet jeg jobber med har tretten tjenestemapper: .NET-API-er, en React-SPA, en Blazor-app, et skrivebordsverktøy, delte NuGet-biblioteker og en .NET Aspire-orkestrator som binder alt sammen. Hver mappe er teknisk sett sitt eget git-repo. Det felles inngangspunktet er `Platform.AppHost.sln`, som refererer til alle tjenestene som prosjekter, på tvers av solutions.

Mønsteret er så vanlig at det har fått et navn: multi-repo som oppfører seg som monorepo. Hver tjeneste får sin egen deploy-pipeline og en tydelig eier, mens lokal utvikling kjører som ett samlet system. Én `dotnet run` fra Aspire-verten starter alt.

Åpner du Claude Code i roten av denne strukturen, kan det resonnere på tvers av alle tretten tjenestene i én og samme økt. Det er nettopp det du vil ha. Når en feil krysser en tjenestegrense (noe publiserer en hendelse, noe annet konsumerer den, noe går i stykker på veien), vil du at Claude skal følge flyten uten at du må flytte kontekst for hånd mellom separate økter.

Problemet er dette: i en økt på rotnivå uten verktøy navigerer Claude i blinde. Det ser et stort katalogtre det ikke forstår, og gjør som enhver navigatør uten kart: begynner å lese veiskilt. I et stort repo blir det dyrt.

Team som jobber med mikrotjenester fordelt på mange repoer, [brenner rutinemessig 40–60 prosent av tokenbudsjettet på kontekst som dupliseres mellom repoene](https://richardporter.dev/blog/claude-code-token-management). Det meste lar seg unngå.

---

## Det første kravet: CLAUDE.md som systemkart

`CLAUDE.md` lastes før alt annet i en økt. I roten av repoet avgjør den om Claude starter orientert eller forvirret.

En `CLAUDE.md` i roten av et repo med flere tjenester bør dekke:

- Hver tjeneste: hva den gjør, hvilken teknologi den bruker, hvilken port den kjører på
- Arkitekturbeslutninger som gjelder overalt: navnekonvensjoner, bibliotekvalg, mønstre du skal følge og unngå
- Delte biblioteker: hva de er, hva de gjør, avhengighetskjeden mellom dem
- Hva som ikke skal røres uten å spørre (delte kontrakter, infrastrukturdefinisjoner, publiserte pakker)
- Bygge- og testkommandoer per teknologi

Den siste sperren er viktig. I et oppsett med flere tjenester har enkelte filer en sprengradius som dekker hele systemet. Claude vet ikke det hvis du ikke sier det. En lettvint refaktorering av en delt domenemodell kan knekke tjenester du ennå ikke har nevnt i økten.

Anthropic anbefaler selv å holde `CLAUDE.md` i roten under 10 000 ord og bare dokumentere det som gjelder bredt. Detaljer om én tjeneste hører hjemme i en egen `CLAUDE.md` i mappen til den tjenesten. Claude henter dem inn automatisk når det jobber i en undermappe. [Den nestede strukturen er tilsiktet og støttet](https://claude.com/blog/using-claude-md-files).

En godt skrevet `CLAUDE.md` i roten fjerner utforskningsfasen helt. Claude trenger ikke å liste kataloger eller lese README-filer for å forstå hva det jobber med. Det vet det allerede.

{{< img src="/images/blog/2026-03-07-claude-lsp-microservices/blueprint.jpg" alt="Mørk teknisk blåkopi som viser programvaresoner forbundet av merknadslinjer på en nesten svart bakgrunn" caption="CLAUDE.md er systemets blåkopi: hver tjeneste, hva den er til, og reglene som gjelder for alle" credit="Generated with Z-Image-Turbo" >}}

---

## Det andre kravet: LSP, og hvorfor det ikke lenger er valgfritt på rotnivå

Her blir oppsettet avgjørende. Når du jobber på rotnivå, vokser antallet mulige fillesninger med antallet tjenester. Hvert spørsmål på tvers av tjenester (hvor brukes denne typen, hvem implementerer dette grensesnittet, hva returnerer denne metoden) blir et navigasjonsproblem over flere kataloger. Uten en typegraf løser Claude det med tekstsøk: grep, les, grep igjen, les igjen.

Tallene gjør problemet konkret. Slik ser kostnaden ut for typiske navigasjonsoperasjoner, med og uten LSP:

| Operasjon | Uten LSP | Tokens | Med LSP | Tokens |
|---|---|---:|---|---:|
| Go to definition (type i solutionen) | grep: 206 filstier returnert | ~2 100 | `goToDefinition`-kall | ~15 |
| Find all references (prosjekt med 100 filer) | grep-skanning + filtrering av utdata | 2 000+ | `findReferences`-kall | ~500 |
| Sjekke returtypen til en metode | les filen som inneholder den | ~800 | `hover`-kall | ~50 |
| Bekrefte at et grensesnitt har én implementør | grep + les treffene | ~1 500 | `findReferences` på grensesnittet | ~150 |
| Følge en hendelsesflyt på tvers av tjenester | grep × 3 + les 4–5 filer | ~4 500 | LSP-kall + målrettede lesninger | ~1 100 |

Raden for go-to-definition er målt i dette repoet: et grep-søk etter `TsExceptionHandler` returnerte 206 filstier (~2 100 tokens). Det samme oppslaget via `goToDefinition` kostet ~15 tokens og landet rett på definisjonen. Raden for find-references kommer fra [en publisert benchmark på et prosjekt med 100 filer](https://zircote.com/blog/2025/12/lsp-tools-plugin-for-claude-code/). Resten er beregnet ut fra hvordan operasjonene virker. Hastigheten forteller det samme: [grep bruker 3–60 sekunder per operasjon, LSP svarer på ~50 ms](https://karanbansal.in/blog/claude-code-lsp/).

I en økt med én tjeneste går overheaden an. I roten av et repo med 13 tjenester vokser den raskt. En ikke-triviell feilsøking som berører fire tjenester, koster uten LSP omtrent 15 000–20 000 tokens bare til navigasjon. Det er 10–15 prosent av hele kontekstvinduet, brukt på å finne ting, ikke på å fikse dem.

I tillegg kommer et presisjonsproblem som tokentallene ikke fanger opp. [Grep etter `getUserById` i et middels stort prosjekt gir 500+ treff (kommentarer, strenger, lignende funksjonsnavn, typedefinisjoner)](https://zircote.com/blog/2025/12/lsp-tools-plugin-for-claude-code/). `findReferences` gir de 23 reelle kallstedene. Claude må gå gjennom alle 500 grep-treffene før det kan gjøre noe med de 23 det trenger. I stor skala blir støyen til mye bortkastet kontekst.

### Blindsonen: typer utenfor den indekserte solutionen

LSP virker ikke alltid. Det samme søket etter `TsExceptionHandler` viste det: når en type ligger i et lokalt NuGet-bibliotekprosjekt som den indekserte solution-filen ikke refererer til, returnerer `goToDefinition` ingenting. I det stille. Ingen feil, ingen reserveløsning, ingen antydning. Grep fant den i ett kall. LSP så den ikke i det hele tatt.

Dette er en strukturell begrensning. `csharp-ls` indekserer det som ligger i solutionen. Typer i NuGet-pakker som bygges separat, upubliserte lokale biblioteker og prosjekter utenfor solution-grafen er usynlige for den. I et multi-repo-oppsett med delte biblioteker kommer du til å støte på dette.

I praksis: bruk LSP først når du navigerer innenfor solutionen, og hold grep i reserve for alt som kommer tomt tilbake. [LSP og grep utfyller hverandre, de erstatter ikke hverandre](https://claudelog.com/faqs/what-is-lsp-tool-in-claude-code/): grep finner, LSP navigerer. Det som forsvinner, er ikke grep, men den dyre kjeden av fillesninger som følger etter et vellykket oppslag.

{{< img src="/images/blog/2026-03-07-claude-lsp-microservices/type-graph.jpg" alt="Abstrakt konstellasjonsgraf med 13 lysende noder i et mørkt tomrom, forbundet av blå kanter, med én rød sti som går gjennom fire noder" caption="Når LSP indekserer hele solutionen, ser Claude typegrafen som ett sammenhengende system, ikke som 13 isolerte kataloger" credit="Generated with Z-Image-Turbo" >}}

---

## Installere pluginene

Claude Code fikk innebygd LSP-støtte i desember 2025 (versjon 2.0.74). To plugins dekker hele stakken i repoet jeg jobber med:

**C#: alle .NET-tjenester, via `csharp-ls`:**

```bash
dotnet tool install --global csharp-ls
claude plugin install csharp-lsp@claude-plugins-official --scope local
```

`csharp-ls` (versjon 0.22.0) er et globalt dotnet-verktøy. Når det peker på `Platform.AppHost.sln`, indekserer det hele typegrafen på tvers av alle .NET-tjenestene samtidig. Ikke ett prosjekt om gangen, men hele referansegrafen på tvers av solutions. Det er dette som gjør multi-repo-strukturen gjennomsiktig for agenten.

**TypeScript: React-frontenden, via `typescript-language-server`:**

```bash
npm install -g typescript-language-server typescript
claude plugin install typescript-lsp@claude-plugins-official --scope local
```

`typescript-language-server` (versjon 5.1.3) dekker alle `.ts`- og `.tsx`-filer.

`--scope local` på begge installasjonene betyr at pluginene bare er aktive for dette workspacet. Begge serverne starter automatisk når Claude Code åpner workspacet.

Jobber du i andre språk, dekker [samlinger av LSP-plugins som fellesskapet vedlikeholder](https://github.com/boostvolt/claude-code-lsps) de fleste store språkene: Go, Python, Rust, Java, Kotlin og flere.

### Merknader om oppsett på Windows

På Windows 11 oppfører disse to installasjonene seg svært ulikt.

**C# virket med en gang.** `dotnet tool install -g csharp-ls` lager en ekte `.exe`, som Node.js kan starte direkte. Ingenting å rette på. Én ting er greit å vite: kaldstarten, mens den indekserer solutionen, tar lengre tid enn du tror. Gi den et minutt før du antar at noe er galt.

**TypeScript virket ikke.** Årsaken er en feil i Claude Code som bare rammer Windows. npm installerer globale binærfiler som `.cmd`-batchwrappere, men Claude Code starter LSP-servere med Node.js `spawn()` uten `shell: true`. Dermed kan det bare kjøre ekte `.exe`-filer. `.cmd`-wrapperen er usynlig for det, og språkserveren starter aldri.

Det finnes to løsninger. Jeg valgte å bygge en liten .NET-konsollapp som shim: en ekte `typescript-language-server.exe` som kaller `node.exe` direkte med stien til `cli.mjs`, inngangspunktet til språkserveren, og dermed går helt utenom `.cmd`. Legg den i `C:\Users\<you>\AppData\Roaming\npm\` ved siden av `.cmd`-filen som allerede ligger der, så plukker Claude Code den opp neste gang det starter. [Kildekode og byggeinstruksjoner ligger på GitHub Gist](https://gist.github.com/digitaldias/0570fdec31127113ffd10144dad2b5b5).

Alternativet er [`tweakcc --apply`](https://github.com/Piebald-AI/tweakcc), en patch som får Claude Code til å bruke `shell: true` på Windows. Den løser samme problem uten at du bygger noe, men Claude Code kan ikke kjøre mens du legger den inn. Shimen krever ikke at du lukker noe, og den overlever oppdateringer av Claude Code. Derfor foretrekker jeg den.

**Utover Claude Code.** Plugin-systemet og `CLAUDE.md` hører til Claude Code, men strategien gjelder for alle agentiske kodeverktøy som støtter språkservere. Cursor og Windsurf har innebygd LSP-støtte og egne kontekstfiler (`.cursorrules` og `.windsurfrules`). GitHub Copilot leser `.github/copilot-instructions.md`. Navnene er forskjellige, prinsippet er det samme: start orientert, og naviger etter typegrafen, ikke etter filsystemet.

---

## Hva som endrer seg i praksis

Med CLAUDE.md og LSP på plass virker Claude Code i roten slik du vil. Claude starter med kunnskap om hvordan systemet er bygd, hvilke begrensninger som gjelder og hvilke konvensjoner dere følger. Må det spore noe på tvers av tjenestegrenser, følger det typegrafen i stedet for å lese filer på måfå.

Claude navigerer som en utvikler som har vært på prosjektet i et år. Det hopper til definisjoner, finner alle som bruker en type i hele solutionen, sjekker implementasjoner av grensesnitt og kontrollerer typekompatibilitet. Ingenting av dette krever at det leser kildefiler, med mindre de virkelig trengs.

Kjører du separate økter per tjeneste, betaler du for å laste kontekst flere ganger, og du må selv bygge bro mellom tjenestene. Én økt i roten med riktige verktøy gjør jobben til flere. Oppsettet tar omtrent en time. `CLAUDE.md` tar lengre tid å skrive godt, men den innsatsen betaler seg i hver eneste økt etterpå.

---

## Neste steg: MCP-er

LSP tar seg av kodeforståelsen. MCP-servere (Model Context Protocol) utvider Claudes oversikt til eksterne systemer etter samme prinsipp: gi Claude strukturert tilgang til informasjon i stedet for å la det gjette. Azure DevOps for arbeidsoppgaver og pipelinestatus, Azure for infrastruktur og alt annet som er relevant.

Jeg holder på å koble disse opp i det samme workspacet, og skriver om oppsettet for seg når det har kjørt lenge nok til at jeg har en mening om det. Erfaringen med LSP tyder på at mønsteret virker: fortell Claude det det trenger å vite gjennom riktig grensesnitt, så slutter det å gripe etter sløve verktøy.

---

*Pedro Dias er konstituert Chief AI Officer i Tradesolution AS og skriver om .NET, arkitektur og verktøyene som gjør utvikling mindre smertefull. Mer på [digitaldias.com](https://digitaldias.com).*
