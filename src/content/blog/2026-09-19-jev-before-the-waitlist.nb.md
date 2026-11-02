---
title: "Det største AI-spranget for programvare siden LLM-en?"
date: 2026-09-19
draft: false
description: "Jev gjør AI om til en typet beslutning: et raskt, kalibrert svar i stedet for et chatsvar. Jeg bygde en lokal erstatning før API-tilgangen i det hele tatt kom."
excerpt: "Chatmodeller endret måten vi skriver på. Jev er bygget for å endre måten programvare tar beslutninger på. Jeg klarte ikke å vente på API-tilgang, så jeg lot Claude Sonnet 5 bygge en lokal erstatning: ekte modell, ekte bro, ekte testrigg."
readTime: "6 minutters lesing"
categories: ["AI"]
tags: ["Jev", "oMLX", "DiffusionGemma", "Bun", "Local LLMs"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-09-19-jev-before-the-waitlist/featured.jpg"
featuredAlt: "En live triagetavle der supporthenvendelser strømmer gjennom automatisk klassifisering, og hvert kort viser en konfidensscore, en sentimentetikett og et hasteflagg"
imageCredit: "© Pedro Dias"
---

LLM-en endret måten vi skriver, søker og koder på. [Jev](https://typesafe.ai/) er bygget for å endre noe større: måten programvare tar beslutninger på.

Jev er et typet beslutnings-API. Du sender inn en tekst og et sett med spørsmål. Tilbake får du strukturerte svar med en konfidensscore knyttet til. Ikke et chatsvar. En klassifisering, en score, et ja eller nei, kalibrert godt nok til at koden din kan handle på det. Det er det som er nytt. Det meste av AI-en som kjører inne i ekte programvare, er ingen samtale. Det er en beslutning som tas tusenvis av ganger i minuttet, og Jev er det første API-et som er laget for å svare på nettopp det.

Jeg sto på ventelisten, men hadde ingen API-nøkkel. Så jeg satte Claude Sonnet 5 på [LocalJev](https://github.com/githubnext/localjev) på GitHub og ba den få det hele opp og gå. Den satte opp [oMLX](https://github.com/jundot/omlx), lastet ned en modell, koblet opp broen, bygde en testrigg og justerte til den ikke lenger knakk sammen under last. Alt sammen, fra start til slutt, mens jeg holdt på med andre ting.

## Stakken

```
oMLX (localhost:8000)  →  LocalJev (localhost:8080)  →  jev-tester (localhost:8090)
inference server           typed decision API            tests and demos
```

[oMLX](https://github.com/jundot/omlx) er en lokal inferensserver for Apple Silicon. Den tilbyr et OpenAI-kompatibelt API. LocalJev ligger oppå. Den gjør Jevs typede spørsmål om til en klassifiseringsprompt, ber modellen om en sannsynlighet, kontrollerer resultatet og sender tilbake et svar i Jevs format. jev-tester er webappen som styrer begge og viser resultatene.

Modellen som står for tenkningen, er `diffusiongemma-26B-A4B-it-4bit`. 26 milliarder parametere, kvantisert til 4 bit, servert rett fra RAM. M5 Pro-en min har 64 GB samlet minne som CPU og GPU deler. Det finnes ikke noe eget VRAM å gå tom for. Modellen alene tar omtrent 16 GB.

## Hvordan et typet spørsmål ser ut

Jev har tre typer spørsmål. `choice` velger én etikett fra en liste. `score` plasserer noe på en skala. `noul` svarer ja eller nei. Du sender én tekstblokk, stiller flere typede spørsmål om den i samme kall og får et typet svar tilbake på hvert av dem, med egen sannsynlighet.

{{< img src="/images/blog/2026-09-19-jev-before-the-waitlist/playground.jpg" alt="Playground-fanen i jev-tester med en supporthenvendelse sendt gjennom LocalJev, der avdeling, frustrasjonsscore og konfidens kom tilbake på 2458 millisekunder" caption="Én henvendelse, tre typede spørsmål, ett kall. 2,4 sekunder på en bærbar." >}}

Svaret kom etter 2458 millisekunder. Henvendelsen ble sendt til «technical» med 85,7 prosent konfidens, og kundens frustrasjon fikk 0,9 på en skala fra rolig til sint. Ingen prompt engineering. Ingen leting etter svaret begravd i et chatsvar. Et typet spørsmål inn, et typet svar ut.

Tallet må ses i sammenheng. Dette er en lokal erstatning, ikke Jev selv, og den kjører på det delte minnet i en bærbar i stedet for på dedikert VRAM. Det koster merkbart i fart. Den ekte Jev-tjenesten er laget for akkurat denne typen typede beslutninger og ventes å svare på et ensifret antall millisekunder. 2,4 sekunder er det et hobbyoppsett klarer. Det er ikke taket.

## Hvorfor dette er større enn nok en chatbot

Det meste av AI i programvare er ingen samtale. Det er en beslutning inne i en pipeline: er denne henvendelsen en hastesak, ser denne transaksjonen feil ut, hvilken kø hører forespørselen hjemme i. Disse beslutningene må være raske og billige, fordi de kjøres for hver hendelse, ikke én gang per brukerøkt. De trenger et konfidenstall, slik at systemet rundt vet når det kan stole på svaret, og når det bør sende saken videre til et menneske.

Chat lot oss snakke med programvare. Jev lar programvaren bestemme selv, med et tall som sier hvor sikker den er. Det er den delen som kan skaleres inn i hver pipeline du allerede kjører, ikke bare de som har fått et chatvindu skrudd på.

Triagetavle-demoen i jev-tester gjør dette konkret.

{{< img src="/images/blog/2026-09-19-jev-before-the-waitlist/triage-board.jpg" alt="Triagetavle-demoen i jev-tester midt i en kjøring, der supporthenvendelser lander i kolonnene Billing, Technical og Sales, med konfidens, sentiment og latens på hvert kort" caption="Fjorten henvendelser behandlet så langt, sortert etter avdeling, hver med egen konfidens, sentiment og latens." >}}

Atten supporthenvendelser går gjennom klassifiseringen og havner på en tavle sortert etter avdeling. Hvert kort viser konfidens og latens. Ingenting av dette ser komplisert ut, og det er nettopp poenget. Slik ser AI ut når den lever inne i pipelinen og ikke foran den.

## Tallene holder

Jeg har [vært skeptisk til lokale modeller før](/nb/blog/2026-04-06-local-llms-are-not-there-yet/), særlig til agentisk kodearbeid. Klassifisering er en smalere oppgave, og her holder tallene godt.

Claude lot også modellene konkurrere: fem installerte modeller, tre offentlige benchmarker og 1200 forespørsler på omtrent 23,5 minutter på denne Macen.

| Modell | AG News | BoolQ | SST-5 | Makronøyaktighet | p50-latens |
|---|---:|---:|---:|---:|---:|
| Gemma 4 E2B | 32.5% | 70.0% | 35.0% | 45.8% | 0.52s |
| Gemma 4 E4B | 65.0% | 75.0% | 50.0% | 63.3% | 0.54s |
| Gemma 4 26B-A4B | 87.5% | 85.0% | 52.5% | 75.0% | 0.68s |
| Qwen3.6-35B-A3B | 90.0% | 85.0% | 55.0% | 76.7% | 0.89s |
| DiffusionGemma 26B-A4B | 87.5% | 87.5% | 47.5% | 74.2% | 1.21s |

Gemma 4 26B-A4B ser ut til å være det beste standardvalget for kort input her. Den er rask og ligger tett bak toppscoren på hver oppgave. Qwen3.6 er så vidt bedre på rå nøyaktighet, med to riktige svar mer av 120. Det er et myntkast, ikke et forsprang.

To ting bør du vite før du stoler på disse tallene for dine egne data. Konfidensverdiene er selvrapporterte: modellen blir bedt om å oppgi en sannsynlighet, den leses ikke direkte ut av logits. Sjekk kalibreringen på din egen arbeidslast før en viktig beslutning hviler på den. Og lang, irrelevant input svekker nøyaktigheten over hele linja, mest for sentiment. Hold input kort og fokusert, så holder tallene ovenfor.

## Justering for reell last

Standardinnstillingene tålte ikke lastdemoen. oMLX tar imot 8 forespørsler samtidig. LocalJev sendte bare 2. Det løste seg da `LOCALJEV_MAX_INFLIGHT` ble økt fra 2 til 6, og det var lastdemoen som avslørte misforholdet.

Noen andre endringer ble gjort mens alt kjørte, og det er bekreftet at de overlever en omstart:

- Hot cache i oMLX, som er av som standard, ble slått på med 8 GB. Gjentatte kall går raskere.
- Minnevakten ble satt til aggressiv, så cachen får mer plass å jobbe med.
- Modellen ble låst i minnet, så den aldri blir kastet ut når den står ledig.
- `LOCALJEV_OUTCOMES_PER_CALL` ble senket fra 128 til 64, etter at testsuiten viste at tilfellet med 128 utfall feilet fullstendig.

Én endring ble bevisst droppet. oMLX sine egne Metal-kjerner dekker bare noen få modellfamilier, og DiffusionGemma er ikke blant dem. Å slå dem på ville ikke gjort noen forskjell.

## Resten av maskinen

Admin-dashbordet i oMLX viste seg å kunne mer enn å vise modellstatus.

{{< img src="/images/blog/2026-09-19-jev-before-the-waitlist/omlx-dashboard.jpg" alt="Admin-dashbordet i oMLX med serverstatistikk, minnebruk for den aktive modellen, API-endepunkter og oppføringen for å starte Claude Code med én kommando" caption="Samme maskin, samme modell, også koblet opp som lokal backend for kodeagenter." >}}

Det viser tokengjennomstrømning og cache-effektivitet for økten, og det fungerer i tillegg som lokal backend for kodeagenter. Claude Code, Codex, OpenCode, OpenClaw og Copilot CLI kan alle kobles til det med én kommando. Den samme Macen som leverer typede beslutninger til en Jev-erstatning, leverer også tokens til den kodeagenten jeg tilfeldigvis bruker den dagen.

## Hva dette legger til rette for

Ingenting av dette krevde en patchet inferensbackend eller et rack fullt av GPU-er. Det krevde en modell, en bro og nok justering til at broen ikke sto i veien. Claude Sonnet 5 bygde alle tre uten tilsyn og fant samtidighetsfeilen ved å kjøre lastdemoen, ikke ved å lese en konfigurasjonsfil.

Når API-nøkkelen til Jev kommer, vet dette oppsettet allerede hvordan et typet spørsmål bør se ut, hvilken latens du kan forvente, og hvor justeringsknappene sitter. Det er gevinsten ved å bygge erstatningen først: når originalen kommer, ligger rullebanen allerede klar.

---

## FAQ

### Hva er Jev?

Jev er et typet beslutnings-API fra [TypeSafe](https://typesafe.ai/). I stedet for et chatsvar tar det imot strukturerte spørsmål (`choice`, `score`, `noul`) om en tekst og gir tilbake typede svar, hvert med sin egen konfidensscore.

### Hva er oMLX?

[oMLX](https://github.com/jundot/omlx) er en lokal inferensserver for Apple Silicon. Den kjører kvantiserte modeller i samlet minne og tilbyr et OpenAI-kompatibelt API, uten noe eget VRAM å holde styr på.

### Hvorfor bygge en lokal erstatning i stedet for å vente på API-tilgang?

Da slipper du ventetiden. Du kan sjekke om et typet beslutnings-API passer arbeidslasten din, hvordan latens og kostnad ser ut med ditt volum, og om konfidensscorene er kalibrert, alt før invitasjonen kommer. Det holder også sensitiv tekst unna andres servere.

### Er konfidensscorene fra en lokal modell pålitelige?

De er selvrapporterte: modellen oppgir selv en sannsynlighet, i stedet for at den leses direkte ut av logits. Det stemmer med svarformatet til Jev, men er ikke det samme som å lese logits direkte. Sjekk kalibreringen på dine egne data før en viktig beslutning avhenger av den.

### Hvorfor betyr typet klassifisering mer enn chat for AI inne i programvare?

Det meste av AI i produksjonsprogramvare er ingen samtale. Det er en beslutning som tas ofte, inne i en pipeline: ruting, moderering, triage, svindelkontroll. Det krever fart, lav kostnad per kall og et konfidenstall systemet kan handle på. Et typet beslutnings-API er laget for å svare på nettopp det, direkte.

### Blir det ekte Jev-API-et like tregt som dette lokale oppsettet?

Nei. Eksempelet på 2,4 sekunder i dette innlegget kjører på det delte minnet i en bærbar, ikke på dedikert VRAM, og det er en lokal erstatning, ikke den ekte tjenesten. Jev selv er laget for akkurat denne jobben og ventes å svare på et ensifret antall millisekunder.
