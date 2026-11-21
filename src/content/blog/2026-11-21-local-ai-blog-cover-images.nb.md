---
title: "Lokal AI lager forsidebilder til bloggen din"
date: 2026-11-21
draft: false
description: "Lag forsidebilder til bloggen med en lokal AI-bildemodell på PC eller Mac. Med nøkling er den nær Nano Banana 2, uten tak på antall bilder. Med oppsettprompt."
excerpt: "De fleste forsidebildene på denne bloggen kommer fra en bildemodell som kjører på mine egne maskiner. Her ser du hvilken maskinvare den trenger, hvordan jeg skriver promptene og en prompt som lar Claude sette den opp for deg."
tldr: "Har du en PC med et brukbart skjermkort eller en nyere Mac, kan en lokal AI-bildemodell lage forsidebilder som er gode nok til en blogg, og det koster bare strøm. Med et referansebilde og nøkling kom oppsettet mitt nær Googles Nano Banana 2 på et bilde fullt av tekst, uten tak på hvor mange bilder jeg kan lage. Innlegget gir deg promptoppskriften min og en prompt som lar Claude sette opp det samme for deg."
categories: ["AI", "Development"]
tags: ["ComfyUI", "Krea 2", "Lokal AI", "Bildegenerering"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-21-local-ai-blog-cover-images/featured-nb.jpg"
featuredAlt: "Ei eldre dame i gul hønedrakt holder et skilt foran Stortinget i Oslo. På skiltet står VIL DU HA EGG? LEGG DEM SJÆL!, med tre krav under"
imageCredit: "© Pedro Dias"
---

Dama i hønedrakt på forsidebildet finnes ikke. En modell på PC-en min hjemme tegnet henne foran Stortinget på 15 sekunder, og en kommando som heter makeImage, skrev ut skiltet hun holder. Skiltet er på norsk her og på engelsk i den engelske versjonen av dette blogginnlegget. Samme bilde, samme seed.

De fleste forsidebildene på denne bloggen er laget slik, og resten er bilder jeg har tatt selv. Uten abonnement, uten opplasting og uten kreditter som tar slutt.

## Lokal AI-bildegenerering: gode nok forsidebilder til en blogg

En lokal bildemodell kjører på din egen datamaskin og lager et bilde ut fra en tekstprompt. Har du en PC med et brukbart skjermkort eller en nyere Mac, kan du bruke den til å lage forsidebilder som er gode nok til en blogg.

Med gode nok mener jeg gode nok til et blogginnlegg, ikke gode nok til profesjonelt arbeid. Jeg bruker to modeller, og de er gode på hver sine ting. Krea 2 Turbo er standardvalget mitt. Den får til travle scener, tåke og lys, og et kort ord eller to:

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/krea2-harbour.jpg" alt="Fem røde naust på høye trestolper i en tåkete norsk fjord ved daggry, en hvit robåt fortøyd under dem og et lite skilt på det nærmeste naustet der det står BRYGGE 5" caption="Krea 2 Turbo, andre seed. Jeg ba om fem naust. Denne seeden tegnet fem, og den første tegnet seks." credit="© Pedro Dias" >}}

MiniMax H3 Image tar over når bildet trenger et avsnitt med tekst eller hender som holder noe:

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/h3-note-nb.jpg" alt="To hender holder et krøllete linjert ark med en håndskrevet lapp: Lørdag: kjøp egg, melk og kaffe. Hent pakken på posten før fem. Naboens hund bor hos oss til søndag. Ring rørleggeren om kjøkkenkranen. Ikke glem søpla." caption="MiniMax H3 Image, tredje seed. Alle de 26 ordene er riktige. De to første seedene skrev svensk ö i stedet for ø." credit="© Pedro Dias" >}}

Begge bildene er laget på PC-en min hjemme.

## Maskinvare til en lokal bildemodell: hva som kjører den

En lokal bildemodell kjører på en PC med et Nvidia-skjermkort med nok videominne, eller på en Mac med Apple-brikke og mye minne. Jeg har den installert på begge: en PC hjemme og en MacBook Pro M5 på jobben.

PC-en hjemme har et RTX 5090 med 32 GB videominne. Det trenger du ikke. Et 3090 har 24 GB, og det gir god plass til de 19 GB med modellfiler. Jeg har også testet et gammelt RTX 2080 Ti, og det ga greie resultater. Det er bare én test hos meg, så prøv selv før du stoler på den.

På jobben bruker jeg en MacBook Pro M5. En Mac med Apple-brikke trenger mye minne, og den laster inn større filer enn en PC, fordi Mac-backenden i PyTorch ikke støtter 8-bits flyttall: 26 GB for bildemodellen mot 13 GB på PC-en. Jeg har ikke prøvd en Mac med mindre minne enn min. De samme maskinene kjører også lokale språkmodeller, og jeg har skrevet et innlegg om å [kjøre en av dem uten nett på et fly](/nb/blog/2026-11-02-local-llm-on-a-plane/).

Tiden betyr mindre enn du tror. Du ber AI-agenten om bildet og går tilbake til skrivingen. På PC-en tar et bilde omtrent ett minutt. På Macen tar det omtrent fire minutter med Krea 2-modellen jeg bruker til de fleste forsidebildene, og under to med MiniMax H3 Image.

## Promptoppskrift til forsidebilder: ett avsnitt, seks deler

En prompt på 50 til 120 ord gir et forsidebilde som sier noe. En kort prompt gir et intetsigende stockbilde.

Skriv ett avsnitt, i denne rekkefølgen:

1. Motivene, med antall og hvordan de henger sammen.
2. Stedet, materialene og fargene.
3. Kamera og lys.
4. Komposisjonen, og hvor det skal være tomt.
5. Eventuell tekst, i anførselstegn, og hvor den skal stå.
6. Stemningen, i én kort setning, til slutt.

Begge modellene gjengir korte ord skarpt. Skal det stå et ord i bildet, setter du ordet i anførselstegn. Skal det ikke være tekst, skriver du det også. Her er den korte prompten jeg tester et nytt oppsett med:

```text
Overhead photograph of a wooden desk in warm morning light, a small black computer tower with a strip of masking tape on its front that reads "LOCAL".
```

Denne er kort. En prompt til et ekte forsidebilde er lengre. Du kan lime oppskriften inn i din egen Claude og la den skrive den lange versjonen til innlegget ditt:

```text
Write a prompt for an image model that makes the cover image for my blog post. Use one paragraph of 50 to 120 words, in this order: subjects with counts, setting and materials, camera and light, composition and empty space, any text in quotes with its position, mood in one clause. Here is the post: [paste your post or its summary]
```

## Lokale bildemodeller: hvor de kommer til kort

Hver lokal bildemodell er svak på noe: Krea 2 Turbo på lang tekst og MiniMax H3 Image på antall. Da jeg testet 14. november, med ett eller to bilder per oppgave, ødela Krea 2 Turbo en tredjedel av ordene i et avsnitt på 52 ord og delte et norsk stedsnavn i to. MiniMax H3 Image stavet begge riktig. H3 tegnet 24 spillkort der jeg ba om 20, mens Krea 2 traff antallet på én av to seeder. Begge bommer likevel på antall: til dette innlegget tegnet Krea 2 seks naust på én seed der jeg ba om fem. Jeg har skrevet et innlegg om [nattjobben som tester nye modeller mot dem jeg bruker](/nb/blog/2026-11-14-local-image-model-scout/). Les det hvis du vil se hele tabellen.

På et forsidebilde klarer begge modellene ett til tre korte ord. Skal det stå mer tekst, bruker jeg et triks i makeImage som heter nøkling (keying), og det er kjernen i makeImage. Jeg brukte fire dager mellom 7. og 14. november på å bygge den: 22 commits og rundt 22 timer fra første til siste commit de dagene. Modellen tegner skiltet som et blankt magenta ark. Så strekker makeImage en nettside slik at den fyller arket: den følger kantene, perspektivet og eventuelle buer, og den henter lyset fra magentaen, så skygger og bretter havner på trykket. Hver bokstav blir riktig og gir siden samme form som arket. Forsidebildet til dette innlegget er laget slik: dama og Stortinget kommer fra modellen, og skiltet er en HTML-side Claude skrev på to språk og la på samme bilde. En lærdom fra dette bildet: be om en stiv, flat plate. Et mykt ark bøyer seg i hendene hennes, og teksten bøyer seg med det. Nøklingen ligger i makeImage, som er privat, så din egen Claude må bygge den, og prompten til det er lengre enn oppsettprompten lenger ned.

## Lokal mot nettbasert bildemodell: nær Nano Banana 2, uten tak

På én vanskelig prompt kom de lokale modellene mine nær Googles Nano Banana 2, som kjører på Googles servere, og de har ikke noe tak på hvor mange bilder jeg kan lage. Prompten ber om det som er vanskelig for oppsettet mitt: dama fra forsidebildet som referanse, seks tekster, en kaffekopp med buet hylse og et neonskilt som speiler seg i en vanndam. Jeg ga samme prompt og samme referanse til tre modeller og beholdt det første bildet fra Nano Banana 2 og fra H3. Det første bildet fra Krea 2 måtte nøkles.

Googles Nano Banana 2 fikk forsidebildet til dette blogginnlegget som referanse:

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/nano-banana-tram.jpg" alt="Dama i hønedrakt venter på en regnvåt trikkeholdeplass i Oslo om kvelden, med en blå trikk merket MAJORSTUEN, et neonskilt med KIOSK, en avisforside der det står HØNENE STREIKER, en rutetabell med overskriften AVGANGER og en kaffekopp der det står EGG ER IKKE GRATIS" caption="Nano Banana 2 i Adobe Firefly, én kjøring. Samme dame, og MAJORSTUEN, KIOSK, AVGANGER og HØNENE STREIKER er stavet riktig, også teksten på den buede koppen. Skiltet hennes ble en blank magenta plate, KIOSK i vanndammen burde stått opp ned, og KIOSK i glasset har blitt til KISO." credit="© Pedro Dias, laget med Google AI" >}}

MiniMax H3 Image fikk samme referanse, gjennom redigeringsmodusen i makeImage:

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/h3-tram.jpg" alt="Dama i hønedrakt står på en regnvåt trikkeholdeplass om kvelden med en kaffekopp og skiltet under armen, en trikk merket MAJORSTUEN bak seg, et neonskilt med KIOSK og en avis der det står HØNENE STREIKER" caption="MiniMax H3 Image på PC-en min, én kjøring. KIOSK, MAJORSTUEN, AVGANGER og HØNENE STREIKER er riktige, og hun har skiltet under armen, slik prompten ba om. På koppen står det ERATIS, KIOSK i vanndammen står ikke opp ned, og rutetabellen er bare støy." credit="© Pedro Dias" >}}

Krea 2 fikk også samme referanse. På det første bildet hadde avisoverskriften mistet en E, og rutetabellen var bare støy. Så jeg nøklet montren: én redigering til malte den magenta, og makeImage skrev ut en avisforside og en rutetabell på den.

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/krea2-tram.jpg" alt="Dama i hønedrakt holder protestskiltet og en kaffekopp på en regnvåt trikkeholdeplass, ved siden av en opplyst monter med en avisforside der det står HØNENE STREIKER og en rutetabell med overskriften AVGANGER" caption="Krea 2 Turbo på PC-en min, tre kjøringer: redigeringen med referansen, redigeringen som malte montren magenta og nøklingen. Hver bokstav i montren er riktig, selv med regndråper på glasset. Utenfor montren står det OSA på trikken, oppslaget på glasset er bare støy, den første K-en i KIOSK er speilvendt, og hun holder fortsatt skiltet fra forsidebildet." credit="© Pedro Dias" >}}

Nano Banana 2 klarte det på én kjøring, og det er det eneste bildet i dette innlegget som er laget på noen andres servere. H3 kom nær på én kjøring på PC-en min. Krea 2 med nøkling trengte tre kjøringer, men fikk den beste teksten i montren: hver bokstav i avisen og rutetabellen der er riktig. Med nøkling er forskjellen altså et par kjøringer til.

Det er på prisen lokalt vinner. Google tar 0,067 dollar for et 1K-bilde fra Nano Banana 2 gjennom API-et, 0,0336 dollar fra den nyere Nano Banana 2.1, og det finnes ikke noe gratisnivå ([Googles prisside](https://aistudio.google.com/docs/pricing), sjekket 21. november 2026). Adobe Firefly Standard koster 11,99 dollar i måneden for 2 000 kreditter ([Firefly-planene](https://www.adobe.com/products/firefly/plans.html)), og ett Nano Banana 2-bilde koster foreløpig 20 av dem, en pris Adobe kaller tidsbegrenset ([Adobes tabell over partnermodeller](https://helpx.adobe.com/creative-cloud/apps/generative-ai/non-adobe-models-in-adobe-products.html)). Det blir 100 bilder i måneden.

Jeg laget minst 19 bilder til dette innlegget og kastet de fleste. Det er slik du får et godt forsidebilde: du prøver en ny seed. PC-en min har ikke noe tak. Et bilde koster strøm, og jeg anslår det til under 2 øre: bruker hele PC-en 700 watt i ett minutt, blir det 0,012 kWh, og det koster snaut 2 øre med en strømpris på 1,50 kroner per kWh. Har du maskinen fra før, lønner det seg å kjøre lokalt. Jeg har skrevet et innlegg om det samme valget for nyhetslesing, [Slutt å betale en frontier-modell for å lese nyhetene dine](/nb/blog/2026-11-01-local-models-news-filter/). Les det hvis du betaler per token i dag.

## Oppsettprompt: la Claude installere det

Claude kan installere en lokal bildemodell for deg, så du slipper å gjøre det for hånd. Oppsettet mitt ligger i en kommando som heter `makeImage`, og jeg skriver den sjelden selv. Jeg ber Claude om bildet, og Claude leser en fil som heter `makeimage.md` som forteller hvordan kommandoen brukes. Alle agenter som leser en `AGENTS.md`, kan gjøre det samme. Kommandoen pakker inn [ComfyUI](https://github.com/Comfy-Org/ComfyUI) og to modeller, [Krea 2 Turbo](https://huggingface.co/krea/Krea-2-Turbo) og MiniMax H3 Image. makeImage ligger i et privat repo, så du kan ikke klone det, men din egen Claude kan bygge det samme ut fra filene Comfy-Org publiserer. Her er en forkortet versjon av prompten jeg brukte. Den setter opp Krea 2, modellen jeg bruker til de fleste forsidebildene.

```text
Set up local image generation on this machine, and verify each step before the next.
1. Install ComfyUI: the portable build on Windows, ComfyUI Desktop on a Mac. Ask me where to put it.
2. Download these files from https://huggingface.co/Comfy-Org/Krea-2/tree/main into ComfyUI's models folders, and check each size against what Hugging Face lists. On Windows with an Nvidia card, take diffusion_models/krea2_turbo_fp8_scaled.safetensors (13 GB) and text_encoders/qwen3vl_4b_fp8_scaled.safetensors (5 GB). On a Mac, take the bf16 versions of the same two files (26 GB and 9 GB), because a Mac has no 8-bit float. On both, take vae/qwen_image_vae.safetensors.
3. Build a ComfyUI workflow for Krea 2 Turbo from ComfyUI's own template, and write a command named makeimage that takes a prompt and a seed and saves a 1920x1080 JPEG at about 82 percent quality.
4. Test it with this prompt: overhead photograph of a wooden desk in warm morning light, a small black computer tower with a strip of masking tape on its front that reads "LOCAL". Open the picture and confirm that it shows the word LOCAL.
5. Write a short makeimage.md that tells an AI agent how to use the command: the flags, the prompt recipe (subjects, setting, camera and light, composition, quoted text, mood) and the lessons from the test. Tell me which line to add to my AGENTS.md or CLAUDE.md so that agents read it. Do not edit those files yourself.
Finish with a short report: install paths, file sizes, render time and the path of the test picture.
```

Kjør den i en tom mappe, og la den spørre før den laster ned noe. De tre filene er til sammen rundt 19 GB på en PC og 35 GB på en Mac, så sjekk at du har nok diskplass først. Hver fil har sin egen jobb: tekstenkoderen gjør prompten om til tallene modellen leser, diffusjonsmodellen tegner bildet i komprimert form, og VAE-en dekoder det til piksler.

## FAQ

### Trenger jeg abonnement for å lage AI-forsidebilder?

Nei. En lokal bildemodell kjører på din egen datamaskin og koster bare strøm. Modellfilene laster du ned gratis fra Hugging Face.

### Hvilket skjermkort trenger jeg til en lokal bildemodell?

Et Nvidia-kort med nok videominne. Jeg kan bare si noe om mine egne tester. Et RTX 3090 har 24 GB, nok til de 19 GB med modellfiler, og et gammelt RTX 2080 Ti ga meg greie resultater i én test. PC-en hjemme har et RTX 5090.

### Kan en Mac lage forsidebilder med lokal AI?

Ja, hvis den har Apple-brikke og mye minne. Jeg bruker en MacBook Pro M5. En Mac med mindre minne enn min har jeg ikke prøvd.

### Er en lokal bildemodell like god som Nano Banana 2?

Nesten, med nøkling. På en vanskelig prompt fikk H3 det meste av teksten riktig på én kjøring på PC-en min, og Krea 2 med nøkling fikk avisteksten riktig på tre kjøringer. Nano Banana 2 klarte det på én. Det er én prompt og ett bilde per modell, så test selv.

### Hva koster Nano Banana 2 sammenlignet med en lokal modell?

Google tar 0,067 dollar for et 1K-bilde gjennom API-et, og det finnes ikke noe gratisnivå. I Adobe Firefly Standard får du 2 000 kreditter for 11,99 dollar i måneden, og et Nano Banana 2-bilde koster foreløpig 20, så det blir 100 bilder i måneden. En lokal modell har ikke noe tak, og jeg anslår at et bilde koster under 2 øre i strøm.

### Staver en lokal bildemodell ordene i bildet riktig?

Korte ord, ja. Begge modellene jeg bruker, klarer ett til tre korte ord, som BRYGGE 5 på naustet i dette innlegget. For en tekstblokk på 9 til 50 ord stavet H3 bedre enn Krea 2 i testen min. Til mer tekst enn det bruker jeg nøkling: modellen tegner et blankt ark, og makeImage skriver ut en HTML-side på det. Forsidebildet med dama i hønedrakt er laget slik.
