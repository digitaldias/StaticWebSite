---
title: "En nattjobb som anbefaler bedre lokale modeller"
date: 2026-11-14
draft: false
description: "Lokal modellspeider: en nattjobb tester nye lokale modeller mot den du bruker og anbefaler et bytte. Slik bygger du en for dine egne modeller."
excerpt: "Bildekommandoen min, makeImage, tester nå nye modeller for meg hver natt og sier fra om jeg bør bytte. Her ser du hvordan løkken fungerer, så du kan bygge en for dine egne modeller."
tldr: "Hver natt samler en jobb det som er nytt innen lokale AI-modeller. En Claude-oppgave leser rapporten, velger en modell å laste ned, tester den mot den jeg bruker i dag og skriver en anbefaling til meg. Jeg bygde den på bildekommandoen min, makeImage. Første fulle kjøring anbefalte MiniMax H3 Image, som staver norsk riktig der modellen jeg bruker i dag roter det til. En lokal dommermodell velger vinnerne, jeg tar avgjørelsen, og innlegget viser deg hvordan du bygger samme løkke for modellene du selv er avhengig av."
categories: ["AI", "Development"]
tags: ["ComfyUI", "Ollama", "Claude Code", "MiniMax H3 Image", "Krea 2"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-14-local-image-model-scout/featured.jpg"
featuredAlt: "En tegnet speider på en stige maler NEW TRAIL på et treskilt i en solfylt skog, mens en rev ser på. På skiltet under står det fortsatt rotete bokstaver"
imageCredit: "© Pedro Dias"
---

Jeg ba bildekommandoen min lage en plakat som sier «Høstmarked på Grünerløkka». Den skrev «Høst marked på Grüre Lløkka». Sjarmerende, men ingen kommer til å finne markedet.

En nyere modell, MiniMax H3 Image, stavet det riktig på begge seedene jeg prøvde. Jeg testet den ikke selv. En nattjobb fant den, en Claude-oppgave testet den mot modellen jeg bruker i dag, og jeg våknet til en anbefaling. Coq au vin-bildene likte jeg best, og de kom fra H3.

## Lokal modellspeider: en nattjobb som anbefaler bedre modeller

En speider er en liten rutine som går hver natt. Den finner nye AI-modeller, tester én mot modellen du bruker i dag, og sier fra om du bør bytte.

Min passer på makeImage, kommandoen som lager omslagene til bloggen. Først samler den det som er nytt. Klokken 03:00 velger Claude en ny modell, laster den ned og gir den de samme oppgavene som modellen jeg bruker nå. En annen AI ser på begge resultatene og velger vinneren. Om morgenen har jeg en anbefaling og ett ja/nei-spørsmål.

Speideren endrer aldri makeImage. Den tester og anbefaler, og jaet er mitt.

Den første nye modellen var [MiniMax H3 Image](https://huggingface.co/Comfy-Org/MiniMax-H3-Image). Den vant 3 av 6 tester, så speideren anbefalte å beholde den. Dette er delen jeg liker: dommen kom med bilder og tall.

## Decider: den lokale dommeren som kan se

Decider er en modell med 27 milliarder parametere som kjører i [Ollama](https://ollama.com) (`pplx-decider:27b`). Du gir den to bilder og et spørsmål, og den svarer med en sannsynlighet for hvert svaralternativ.

Den ser bildene. Derfor duger den som dommer: den kan sjekke om teksten er stavet riktig, hvor mange kort som ligger på bordet, om en hånd har fem fingre og om motivet stemmer med prompten. Den filtrerer også nyhetene om natten: den første jobben samler det som er nytt på Hugging Face og Reddit, med et filter som det i [Slutt å betale en frontier-modell for å lese nyhetene dine](/nb/blog/2026-11-01-local-models-news-filter/). Den koster bare strøm, noe som teller når en oppgave går uten tilsyn.

Den har en skjevhet. På to nesten like bilder ga den det første 0,69, og 0,61 da jeg byttet rekkefølge. Den favoriserer det som kommer først. Speideren spør derfor begge veier og teller en dom bare når de to svarene er enige.

På 11 av 12 bildepar var Decider enig med Claudes egen vurdering. Det tolvte, et spørsmål om antall spillkort, endte uavgjort.

Den har heller ingen smak. På coq au vin-kortet ga den H3 0,06 og 0,02, fordi Krea 2 stavet mer av fransken riktig. Jeg likte H3-bildet best: en slitt papirlapp med troverdig håndskrift. Decider svarer på «hvilket bilde passer beskrivelsen best?», ikke på «hvilket bilde vil du ha på bloggen din?» Utmerket staving, ingen smak. Se på bildene selv.

{{< img src="/images/blog/2026-11-14-local-image-model-scout/coq-au-vin.jpg" alt="To portretter av en smilende kokk som holder opp et oppskriftskort for coq au vin. Til venstre H3: slitt papir med rotete randnotater. Til høyre Krea 2: et rent kort med stort sett leselig fransk" caption="Coq au vin, seed 1201. H3 til venstre, Krea 2 Turbo til høyre. Decider valgte bildet til høyre, jeg likte det til venstre best." credit="© Pedro Dias" >}}

## Test nye lokale modeller på jobb: samme løkke for verktøyene dine

Løkken passer for alt du er avhengig av som stadig blir bedre: en kodemodell, en embedding-modell, en tale-til-tekst-motor. Jeg bruker den til omslag, men du kan rette den mot det teamet ditt kjører.

Du trenger fire ting. Et fast testsett med dine egne vanskelige tilfeller. En baseline du kjører likt hver gang. En dommer som gir et tall. Og en regel for hva som skjer med en taper; min sletter de nedlastede filene.

Behold det menneskelige leddet. En speider rapporterer og spør. Den deployer ikke.

## Testsett: seks prompter, fem av dem vanskelige

Testsettet har seks oppføringer på seed 1201 og 1202: én vanlig scene og fem vanskelige tilfeller. makeImage kjører [Krea 2 Turbo](https://huggingface.co/krea/Krea-2-Turbo) på ComfyUI. H3 kjørte med innstillingene fra Comfy-Orgs mal: 6 steg, euler-sampler, cfg 1, int8-vekter på 49,3 GB. H3 krever ComfyUI v0.45, så installasjonen gikk fra v0.34.0 til v0.45.3. Speideren oppdaterer aldri ComfyUI på egen hånd; denne gangen ba jeg den om det.

| Oppføring | Vinner | Forskjellen |
|---|---|---|
| Vanlig scene (naust) | Krea 2 | Stolper og tåke som i prompten; H3 tegnet en vanlig brygge |
| Tett tekst (et langt avsnitt) | H3 | Hvert ord riktig på begge seedene, ett kuttet i kanten; Krea 2 ødela en tredjedel |
| Norsk plakat | H3 | «Grünerløkka» helt riktig to ganger; Krea 2 delte ordet |
| Oppskriftskort | Krea 2 | Små randnotater: H3 tegnet kruseduller |
| Telle kort | Krea 2 | Riktig antall én gang; H3 tegnet 24 og snudde kortene med framsiden opp |
| Hender og krøllet papir | H3 | Skarpe bretter og riktig grep |

H3 var også raskere: 4 til 16 sekunder per bilde mot 13 til 14 for Krea 2. Tallene er mine, fra én natt, én maskin med 32 GB VRAM og to seeder per oppføring. Se på dem som en første pekepinn.

{{< img src="/images/blog/2026-11-14-local-image-model-scout/norwegian-poster.jpg" alt="To bilder av en papirplakat på en murvegg. Til venstre H3: Høstmarked på Grünerløkka stavet riktig. Til høyre Krea 2: Høst marked på Grüre Lløkka, med siste ord delt og avskåret" caption="Norsk plakat, seed 1201. H3 til venstre, Krea 2 Turbo til høyre." credit="© Pedro Dias" >}}

## Speiderprompt: lim den inn i din egen Claude

Denne prompten er speiderens framgangsmåte, uten mine stier og modeller. Originalen gjorde sin første fulle kjøring 14. november. Bytt ut det som står i klammer, legg den i en planlagt Claude-oppgave, og kjør den én gang for hånd før du stoler på den.

```text
You are the nightly scout for [tool or model I use today]. You test and report. You never change my setup, and you never install code from a repository.
Each night, read [news sources] and list anything that might beat what I use today. Skip repackages, single-author quantisations and models that cannot run on [my hardware].
Keep a ledger file with every candidate you have seen, its status (queued, blocked, skipped, kept, deleted), its licence and the reason. Never test the same candidate twice unless its files changed.
Test at most one candidate per run. It must load with [my runtime] as it is. If it needs a newer runtime, mark it blocked and say which version. Download one precision only, and keep at least [N] GB of disk free.
Use my test set in [file]: one ordinary case and the hard cases where my current tool fails. Run each case on my current tool and on the candidate, with the same seeds.
Judge every pair with [judge model], once in each order. A verdict counts only when both orders agree. Then look at the results yourself and say where you disagree with the judge.
The candidate wins a case when it wins more seeds than it loses. Keep the candidate if it wins two or more cases. Otherwise delete exactly the files you downloaded.
Write a report in plain words with a table: case, winner, what differed. Quote the wrong words, counts and numbers, so I can read it without the pictures. End with one yes-or-no question: should we adopt it?
```

## Dommer i to rekkefølger: rettferdig dom fra en skjev dommer

Spør dommeren i begge rekkefølger, og tell en dom bare når de to svarene er enige. Her er hele ideen i Python; bytt ut `ask` med ditt eget dommerkall.

```python
def verdict(ask, a, b):
    forward = ask(a, b)    # probability that the first picture is better
    backward = ask(b, a)   # same question, order swapped
    p = (forward + 1 - backward) / 2
    if forward > 0.5 > backward:
        return "first", round(p, 2)
    if forward < 0.5 < backward:
        return "second", round(p, 2)
    return "undecided", round(p, 2)
```

Gi den tallene mine, 0,69 forover og 0,61 bakover, så svarer den `undecided` med p på 0,54. Uten byttet hadde to nesten like bilder gått til det som kom først.

En kandidat vinner en oppføring når den vinner flere seeder enn den taper og Claude er enig når den ser på bildene. Den anbefales når den vinner to eller flere oppføringer.

Speideren jobber mens jeg sover. Jeg ser fortsatt på bildene selv.

## FAQ

### Trenger jeg en lokal dommermodell?

Nei. Enhver modell som ser bilder og gir et tall, duger, også Claude. Jeg bruker en lokal fordi speideren går uten tilsyn om natten og bare koster strøm. Uansett hvilken dommer du velger: spør i begge rekkefølger.

### Installerer speideren vinneren for meg?

Nei. Den beholder filene til en vinner og spør. Å ta en modell i bruk i makeImage er en egen oppgave som starter når jeg sier ja.

### Hvor mye diskplass trenger den?

H3-vektene er på 49,3 GB. Speideren holder minst 200 GB ledig på modelldisken og sletter filene til hver kandidat som taper.
