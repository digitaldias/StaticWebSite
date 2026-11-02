---
title: "Ut av komfortsonen i C#"
date: 2025-12-29
draft: false
description: "Agentisk koding bygde en foosball-tracker, et lydverktøy i Qt/C++ og en DirectX-renderer i assembler mens jeg styrte med prompts. Nå leverer jeg annerledes."
excerpt: "Jeg skrev ikke selv koden til tre prosjekter: en foosball-tracker, en lydbehandler i Qt/C++ og en DirectX-renderer i assembler. GPT-5 og Claude 4.5 (Opus og Sonnet) skrev den, mens jeg sto for prompts, tester og rammer. Her er det som fungerte, det som overrasket meg, og hva det betyr for de neste prosjektene."
readTime: "10 minutters lesing"
categories: ["Architecture", "Development"]
tags: ["JavaScript", "TypeScript", "C++", "Assembler", "DirectX", "Qt", "Audio", "Graphics"]
author: "Pedro Dias"
featuredImage: "/images/blog/2025-12-29-beyond-comfort/featured.jpg"
featuredAlt: "Skrivebord med et Mandelbrot-bilde, en ball fra foosballbordet og lydbølger: verktøyene til en som bygger i mange språk"
imageCredit: "Pedro Dias"
---

{{< callout type="success" title="TL;DR" >}}
Agentisk koding skrev tre fungerende apper for meg: en foosball-tracker som gikk fra JS til TypeScript, et lydverktøy i Qt/C++ og en DirectX-renderer drevet av assembler. Jobben min var å styre med prompts, sette rammer, kjøre tester og vurdere resultatet. GPT-5 og Claude 4.5 (Opus og Sonnet) skrev koden. Det som sjokkerte meg, er hvor langt dette kom uten at jeg skrev koden selv. Neste steg er å finne ut når jeg kan stole på agentene, og når jeg bør bremse dem.
{{< /callout >}}

## Ut av komforten i C#

C# har vært hjemmebanen min helt siden språket kom. Gode verktøy, LINQ i fingrene og en forutsigbar runtime gjorde at jeg kunne bygge funksjoner på autopilot. Nå har komforten fått selskap. GPT-5, Claude 4.5 og andre agenter skriver kode i alle slags stacker, i et tempo som får vanene mine til å virke trege. Da agentene kom, trengte autopiloten et sikkerhetsbelte. Jeg ville se om agentene kunne forlate C#-verdenen min og levere i språk der jeg vanligvis snubler. Svaret kom raskt. Jeg beskrev målet, satte rammer og så på mens robotene bygde.

Tre prosjekter viser endringen. Foosh, en foosball-tracker bygd som PWA, med React-klient, server i Node.js og TypeScript, MongoDB, Socket.IO og Microsoft Entra ID. En lydbehandler for skrivebordet som normaliserer, komprimerer, klipper og fader lydbibliotek. En fraktalrenderer som animerer Mandelbrot- og Julia-mengder uten å miste bilder. Jeg sto for prompting, avgrensning og gjennomgang. Agentene skrev JavaScript- og TypeScript-modulene, Qt- og C++-koden og assembler-løkken inne i en DirectX-pipeline. Jeg følte meg mindre som programmerer og mer som regissør for et team som var raskt og tok alt bokstavelig.

## Foosball-trackeren: fra prompt til ferdig Foosh

Foosh måtte føles som et spill, ikke som et regneark. Jeg ba GPT-5 om en PWA: React-klient bygd med Vite, server i Node.js og TypeScript, MongoDB, Socket.IO og Microsoft Entra ID via MSAL. Den skulle kjøre i Docker og deployes til Azure Container Apps. Den første prompten listet opp funksjonene. En lobby der du oppretter eller blir med i kamper. En poengside for mobilen som ligger flatt på bordet, med scoreknapper på skjermen. En live-side med tidslinje. Elo-topplister. De tre veggene for skryt og skam. Agenten leverte en build som kjørte, i løpet av minutter. Jeg leste ikke koden. Jeg åpnet poengsiden på telefonen, startet en lobby på laptopen og så hendelsene synkronisere i sanntid.

Jeg itererte ved å beskrive det jeg så, ikke ved å lese kildekoden. Live-siden føltes for stille, så jeg ba om lydsignaler på scorer-enheten ved mål, vunne runder, stuffings, sudden death og angring. Veggene manglet. Jeg ba om Wall of Shame (en runde som endte 10-0), Wall of Utter Disgrace (en kamp som endte 20-0) og Wall of Øyvind (3 stuffings på rad), alle med live-oppdatering. Lobbyen føltes treg, og da ba jeg om en mørkere palett med spillpreg og en raskere vei fra QR-koden til poengføringen. Hver endring kom tilbake som en liten diff med en kort begrunnelse. Rytmen min var enkel: spill en runde, noter hullene, send en ny prompt. Som å bestille påfyll hos en svært rask barista.

Også arkitekturen lå hos agentene. Jeg ba Claude bygge om Foosh med CQRS og Event Sourcing. Kommandoer og hendelser fikk felles TypeScript-kontrakter, så klient og server ikke kunne gli fra hverandre. Agenten projiserte hendelsesstrømmene til topplister, vegger og tidslinjer. Den koblet også opp Socket.IO, så oppdateringene nådde ut før kjeften rundt bordet hadde stilnet. Da poengsiden og live-siden kom i utakt, beskrev jeg avviket. Agenten fikk kontraktene til å stemme igjen og leverte en ny build.

Disiplin i promptene betydde mer enn syntaks. Jeg hadde en levende prompt som navnga domenebegrepene (lobby, runde, tidslinje, vegg). Den beskrev scoreknappene på skjermen i bordmodus, regelen om at lyd bare spilles på scoreren, og forbudet mot eksterne kall utover MongoDB og Entra ID. Hver gang jeg ba om noe nytt, limte jeg inn den samme kontrakten først. Det ble et lite ritual for å holde ånden i flasken på rett kurs. Driften falt til nesten null. Når agenten foreslo prangende UI jeg ikke hadde bedt om, sendte jeg den tilbake med den samme kontrakten, og den rettet seg etter den. Det føltes som å lede en juniorutvikler som jobber raskt så lenge spesifikasjonen ligger synlig.

{{< img src="/images/blog/2025-12-29-beyond-comfort/inline-01.jpg" alt="Diagram som viser foosball-trackeren på vei fra C# via JS til TypeScript" caption="Foosh-arkitekturen: fra JavaScript-prototype til TypeScript-kontrakter" >}}

## Lydbehandleren Woosh i Qt og C++: bølgeformer under kontroll

Neste problem var lydkaos: målrop, bakgrunnslyd og timingsignaler. Jeg fant ikke noe verktøy, verken kommersielt eller med åpen kildekode, der jeg kunne redigere og holde orden på alle Foosh-lydene på ett sted. Så jeg ba en agent bygge det. Jeg valgte C++ fra start, fordi jeg trengte rå prosessorkraft til å redigere bølgeformer og en VU-måler som svarer raskt. Claude Opus fikk en prompt: desktopapp i Qt, kjerne i C++, visning av bølgeformer, normalisering, komprimering, klipping, fading og eksport til flere formater. Svaret var et prosjektskjelett, CMake-filer og avhengigheter som kompilerer rent med libsndfile, mpg123, mp3lame og Qt6 Multimedia. Vi kalte den Woosh, for navn betyr noe når du leverer spillyder. Foosh lager målene. Woosh får målene til å høres ut som et meteornedslag i bordet.

Jeg ba agenten om et brukergrensesnitt som svarer raskt og aldri låser seg. Den brukte signaler og slots for å holde tegningen av grensesnittet adskilt fra trådene som behandler lyd. Byggene går fortsatt via CMake først. Når en avhengighet måtte justeres, ga agenten meg patchen og stegene for å bygge på nytt. Den første builden ga bare stillhet, så jeg ba om en plan for feilsøking. Agenten la inn logging rundt gain staging og buffergrensene, og ved neste kjøring kom lyden.

Pipelinen skanner nå en mappe med råfiler, tegner bølgeformer, normaliserer, komprimerer, klipper, legger på fades og eksporterer til lydmappen i spillet uten å røre originalene. Råmappen er spiskammeret. Spillmappen er retten som står anrettet på tallerkenen. Agenten mellomlagret buffere, så en justering kjøres på nytt på millisekunder. En filovervåker starter pipelinen igjen når nye lyder havner i råmappen. Dermed blir appen en stille assistent på kampdager. Den oppfører seg som et native verktøy fordi den er det, og jeg skrev ikke C++-koden selv.

Jeg stolte på resultatet fordi jeg hadde kontroll på det som gikk inn. Agenten lagde en tabell med søkeprompts for hvert klipp jeg trengte, og ut fra den hentet jeg en samling lyder fra Pixabay. Jeg lastet dem ned, la dem i råmappen og lot Woosh behandle dem. Så lyttet jeg, noterte det som hørtes feil ut, og ba agenten justere. Den runden (prompt, last ned, behandle, lytt) føltes som en smaksmeny med lydeffekter.

{{< img src="/images/blog/2025-12-29-beyond-comfort/inline-02.jpg" alt="Lydbehandler i Qt som viser trimming av en bølgeform og komprimering" caption="Woosh: visning av bølgeformer og DSP-pipeline i Qt/C++" >}}

## DirectX og assembler: fraktaler i bevegelse uten svinn

Det tredje hoppet gikk helt ned på metallet. Jeg ba GPT-5 bygge en fraktalrenderer i DirectX 11. Ekte assembler hadde jeg ikke rørt siden studietiden, og DirectX hadde jeg aldri rørt. Målet var jevne Mandelbrot- og Julia-animasjoner, raske palettbytter og zoom som glir i stedet for å rykke.

Agenten delte jobben i to. Først lot den GPU-en tegne fraktalen og effektene med stjerner og røyk i ett pass, så skjermen holder 60 fps. Klarer ikke GPU-en den tunge matematikken (hei, ARM-laptoper), bytter koden til en enklere modus. Deretter kom en reserveløsning på CPU-en. Tråder tegner små fliser, og en håndskrevet indre løkke i assembler tygger åtte piksler om gangen. Blir det for mye der og da, tar en vanlig C-variant over. Ulike pensler, samme bilde.

Palettene er ferdigbakte fargeskalaer. Å bytte palett er å bytte en buffer, ikke å bygge noe på nytt. Zoomen har myke overganger, så bevegelsene føles jevne. Panorering følger musen, og når du klikker for å zoome, lander du der du forventer.

Fullskjerm var den kresne delen. Agenten tok seg av DirectX-oppsettet, shaderne, assembler-kjernen og at alt tålte endring av vindusstørrelse. Jobben min var å kjøre programmet, si «den krasjet» og lime inn logger. Agenten satte til og med opp logginnsamling, og hentet senere loggfilen selv da jeg ba om det. Jeg visste ikke hvorfor det feilet. Det visste agenten, og den fikset det. Røyken steg, bildene gikk jevnt, og jeg slapp å grave i detaljene.

{{< img src="/images/blog/2025-12-29-beyond-comfort/inline-03.jpg" alt="Kontroller for animasjon av Mandelbrot og Julia i DirectX med assembler" caption="Mandelbrot- og Julia-animasjon: indre løkke i assembler i en DirectX 11-pipeline" >}}

## Slik prompter og gjennomgår jeg

- Definer omfang og grenser først: språk, byggeverktøy, runtime, hosting og «ingen ekstra tjenester». Klarhet slår flaks.
- Gi ankerpunkter når du kan: eksempler på inndata, forventet utdata og hvordan «ødelagt» ser ut. Adjektiver er vage. Eksempler roper.
- Be om en plan før kode når omfanget er stort. En plan holder utdataene i tømme og gir meg et første kontrollpunkt. Sett agenten i plan mode, og vent med implementeringen til planen er solid.
- Be om diffs, ikke romaner. En patch med kort begrunnelse er lett å godta eller avvise.
- Rapporter virkeligheten, ikke teorier. Jeg limer inn logger og skjermbilder, beskriver det jeg ser og lar agenten fikse det. Mindre gjetting, mer fiksing.
- Stopp scope creep. Kommer en prompt tilbake med uventede avhengigheter eller glitter-UI, sender jeg den tilbake med den samme kontrakten.

## Dette overrasket meg ved agentisk koding

- Agentene holdt seg til kontraktene når jeg gjentok dem. Når jeg ble lat, drev de ut.
- De skrev byggeskript når jeg ba om det, men ignorerte dem av og til helt til jeg minnet dem på sine egne instruksjoner.
- Jeg åpnet aldri koden. Agentene formet grensesnittene, og jeg fulgte med gjennom prompts, kjøringer og logger.
- Jeg ba dem optimalisere og fjerne kode og filer som ikke lenger var i bruk. De påsto at de hadde ryddet, men filene var fortsatt skremmende store, noen godt over 1 000 linjer.
- Uten målinger feilet de høylytt. Så snart jeg ga dem tall, optimaliserte de klart og målrettet mot tallene.
- Jeg kan ikke si om resultatet ble slankt eller spagetti. Jeg åpnet aldri filene for å sjekke.

## Dette trenger fortsatt hendene mine

- Valg av rammer. Det er ikke agentene som bestemmer hvilke avhengigheter som holdes ute. Det gjør jeg.
- Vern av data. Ingen hemmeligheter fra produksjon havner i prompts, og ingen ekte brukerfiler forlater maskinen min.
- Integrasjon med maskinvare. Når lydenheter eller nettlesere tuller, er det fortsatt jeg som plugger inn, plugger ut igjen og ser hva som skjer.
- Smak. Agenten kan foreslå UI, men jeg velger klarhet fremfor show, og jeg fjerner alt som tar oppmerksomheten fra spillerne.
- Ansvar. Krasjer appen midt i en kamp, går det på meg, ikke på modellen.

## Mønstre som fungerer i alle stacker

- Agenter oppfører seg pent når rammene er skarpe: arkitekturen, hvilke filer de får røre, hvilke tester de må bestå.
- Be om diffs med én linje om hvorfor. En patch er rask å gå gjennom. En roman er det ikke.
- Hold kantene stramme. DOM, lyd-IO og GPU-kall hører hjemme i ytterkant, så kjernen kan testes.
- Be om tester fra start: egenskapsbaserte tester for poengberegningen, golden files for lyd og asserts på bildetid for grafikk.
- Legg inn målinger før du tigger om fart. Tall slår magefølelse.
- Hold rundene korte. Små prompts, raske kjøringer, små binærfiler. Espresso, ikke kaffekanner.
- Start nye chatter ofte. Lange prompts går ut på dato. Start en ny økt etter hver oppgave, så holder agenten seg skarp i VSCode, Cursor og Visual Studio 2026.

## Veien videre

Eksperimentene ga meg en ny rolle. Jeg ber om noe, agentene bygger, og jeg sjekker at det henger på greip. De neste stegene krever bevisste valg.

- Foosh: pakk TypeScript-builden som en nøkkelferdig nedlasting, finpuss poengføringen i bordmodus, lever sjekksummer og hold den uten synkronisering.
- Woosh: legg til ferdige oppsett for batchkjøring, nivåmål per lokale og eksportprofiler, så venner kan behandle lydbibliotek uten å tenke på kompressorer. Lås builden, så avhengighetene ikke kan drive.
- Fraktaler: pakk assembler-kjernen bak et ryddig DirectX-grensesnitt, styr animasjonene med skript i TypeScript og ha en samling benchmarks som fanger opp når noe blir tregere.
- På tvers av alt: én levende sjekkliste for prompts, tester og forbudte grep før du velger språk.
- Nye prosjekter: start i en tom mappe og legg inn en `.github` eller `.cursor` med kommandoene og reglene du vet at du trenger. Gi deretter agenten hele bildet av prosjektet: arkitektur, stack, tester og fakta av typen «terminalen din er Git Bash på Windows». Med et forberedt miljø lander de første promptene slik du planla.

Rytmen teller også. Ukentlige småprosjekter holder ferdighetene varme. Hvert av dem ender med et notat på én side om hva agenten traff, hvor den drev ut, og hvilke rammer som hjalp. Notatene blir et kart til neste bestilling.

Eierskapet er fortsatt mitt. Agenten skriver koden, men det er jeg som leverer den. Jeg holder hemmeligheter ute av prompts, låser ned nøkler og kjører lokalt før jeg stoler på noe som kommer i nærheten av brukere. Farten er ekte. Skjønnet teller fortsatt.
Og når en oppgave er ferdig, starter jeg en ny chat. Lange økter går ut på dato. En ny økt holder agenten skarpere enn gårsdagens kontekst på slep.

## Prøv selv

- Velg en liten funksjon du alltid bygger for hånd, og be en agent lage den i et annet språk denne uken.
- Be om tester i samme prompt som funksjonen. Ikke heng dem på etterpå.
- Be om diffs, ikke kodevegger, så gjennomgangen går raskt.
- Legg inn logging og målinger før du ber agenten optimalisere. Gi den harde tall å forbedre.
- Før logg over promptmaler og hva de ga, så du vet hvilke rammer som gir ren kode.
- Hold hemmeligheter ute av prompts, og lim ikke inn produksjonsdata. Behandle agenter som innleide konsulenter som bare ser det de trenger.
- Kjør det agenten lager lokalt og offline først. Koble til eksterne tjenester først når det har bestått de lokale testene.

Eksperimentene er dokumentert. Koden kjører. Den neste prompten tar allerede form.

## Vanlige spørsmål

**Må jeg forstå språkene agenten skriver?**
Ikke for å få en build som virker. Men du må kunne nok til å vurdere arkitekturen, se sikkerhetsproblemer og merke når agenten går i feil retning. «Jeg kan ikke lese denne koden» er en risiko som er din.

**Hva skjer når agenten driver bort fra spesifikasjonen?**
Den driver når den ikke ser rammene. Lim inn den samme domenekontrakten øverst i hver prompt, så går driften betydelig ned. Foreslår agenten noe du ikke har bedt om, sender du den tilbake med den opprinnelige spesifikasjonen.

**Kan jeg virkelig stole på C++ eller assembler skrevet av AI?**
For interne verktøy der du har kontroll på inn- og utdata: ja, med gjennomgang. For alt som håndterer data du ikke kan stole på, eller som leveres til kunder: nei. Lydpipelinen i Woosh behandler filer fra en kjent mappe på en lokal maskin. Det er noe helt annet enn en produksjonstjeneste på nett.

**Hvilken AI fungerte best til hvilken oppgave?**
GPT-5 var raskere til å reise grunnmuren i Foosh og til fraktalrendereren. Claude Opus ga ryddigere refaktoreringer i TypeScript og var flinkere til å holde seg innenfor de arkitektoniske rammene. Sonnet tok seg godt av forbedringer til lavere kostnad. Ingen av dem kan erstatte din vurdering av hva som skal bygges.

---

## Referanser

- **[Hugo](https://gohugo.io/)** - Generatoren for statiske nettsteder som driver denne bloggen.
- **[JavaScript](https://developer.mozilla.org/docs/Web/JavaScript)** - Brukt i hele Foosh, både klient og server.
- **[TypeScript](https://www.typescriptlang.org/)** - Felles kontrakter for klient, server og hendelser.
- **[React](https://react.dev/)** - PWA-klienten i Foosh.
- **[Vite](https://vitejs.dev/)** - Byggeverktøy for Foosh-klienten.
- **[Node.js](https://nodejs.org/)** - Runtime for serveren som håndterer kommandoer og hendelser i Foosh.
- **[MongoDB](https://www.mongodb.com/)** - Lagring av Foosh-data.
- **[Socket.IO](https://socket.io/)** - Synkronisering i sanntid mellom scorer-, lobby- og live-sidene.
- **[Microsoft Entra ID](https://learn.microsoft.com/entra/identity-platform/overview)** - Identitetsleverandør via MSAL.
- **[CQRS and Event Sourcing](https://martinfowler.com/bliki/CQRS.html)** - Arkitekturmønster for kommandoer og projeksjoner i Foosh.
- **[Docker](https://www.docker.com/)** - Containerruntime for Foosh-deployments.
- **[Azure Container Apps](https://learn.microsoft.com/azure/container-apps/)** - Hosting for Foosh.
- **[Qt](https://www.qt.io/)** - Plattformuavhengig rammeverk bak brukergrensesnittet i lydbehandleren.
- **[C++](https://isocpp.org/)** - Språket bak lydpipelinen og de tunge DSP-delene.
- **[CMake](https://cmake.org/)** - Byggesystem for Woosh.
- **[libsndfile](https://libsndfile.github.io/libsndfile/)** - Lesing og skriving av lydfiler i Woosh.
- **[mpg123](https://www.mpg123.de/)** - MP3-dekoding i Woosh.
- **[LAME](https://lame.sourceforge.io/)** - MP3-koding i Woosh.
- **[Qt6 Multimedia](https://doc.qt.io/qt-6/qtmultimedia-index.html)** - Lydavspilling i Woosh via QAudioSink.
- **[DirectX](https://learn.microsoft.com/windows/win32/direct3d)** - Grafikk-API for fraktalrendereren.
- **[NASM](https://www.nasm.us/)** - Assembleren bak iterasjonsløkken i fraktalrendereren.
- **[GPT-5](https://openai.com/)** - Agenten som skrev koden til fraktalene og Foosh.
- **[Claude 4.5 Opus](https://claude.ai/)** - Agenten som sto for TypeScript-refaktoreringen og Qt/C++-koden.
- **[Claude 4.5 Sonnet](https://claude.ai/)** - Agenten som forbedret prompts og projeksjoner.
- **[VS Code](https://code.visualstudio.com/)** - Editoren jeg brukte til prompting og gjennomgang.
- **[Cursor](https://cursor.sh/)** - Agentvennlig IDE brukt i alle disse prosjektene.
- **[Visual Studio 2026](https://visualstudio.microsoft.com/)** - IDE brukt til å kontrollere utdata og logger.
