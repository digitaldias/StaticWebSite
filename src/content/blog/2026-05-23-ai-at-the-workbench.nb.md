---
title: "AI ved arbeidsbenken"
date: 2026-05-23
draft: false
description: "Slik hjalp AI meg med å koble opp tilstedeværelsessensoren HLK-LD2410B, tegne et kabinett i OpenSCAD og for en gangs skyld fullføre et maskinvareprosjekt."
excerpt: "HLK-LD2410B oppdager folk som ikke rører seg. Å koble den til en D1 Mini og få den inn i et 3D-printet kabinett var akkurat den typen prosjekt der AI utgjorde forskjellen mellom en skuff full av komponenter og en ferdig dings på veggen."
readTime: "8 minutters lesing"
categories: ["AI"]
tags: ["HLK-LD2410B", "Home Automation", "OpenSCAD", "ESPHome", "D1 Mini"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-05-23-ai-at-the-workbench/featured.jpg"
featuredAlt: "Sprengskisse i OpenSCAD av det 3D-printede kabinettet til tilstedeværelsessensoren HLK-LD2410B og D1 Mini"
imageCredit: "© Pedro Dias"
---

Jeg har en skuff. Det har du sikkert også. Den er full av komponenter jeg kjøpte, koblet halvveis opp, kjørte meg fast med og i det stille pensjonerte. En håndfull ESP32-er. Noen DHT22-sensorer. Tre-fire Arduinoer på ulike ambisjonsnivåer. Skuffen er der gode forsetter blir liggende og samle støv.

HLK-LD2410B var nær ved å havne der den også.

Det er en mmWave-radarmodul på 24 GHz som oppdager at et menneske er til stede. Ikke bare bevegelse, men faktisk tilstedeværelse. En person som sitter stille ved skrivebordet. Noen som puster i et hjørne av rommet. Vanlige PIR-sensorer reagerer bare på bevegelse, så lyset slukker i det du slutter å vri på deg. LD2410B har ikke det problemet. Den er dessuten på størrelse med en tyggegummiplate.

{{< img src="/images/blog/2026-05-23-ai-at-the-workbench/sensor.jpg" alt="HLK-LD2410B-sensoren ved siden av en linjal, omtrent 35 mm lang" caption="35 mm med 24 GHz radar. Hele sensorantennen sitter i det rektangulære feltet til høyre." >}}

Jeg kjøpte den for å få ordentlig tilstedeværelsesdeteksjon på hjemmekontoret. Planen var å koble den til en D1 Mini, få den inn i Home Assistant via ESPHome og slutte å skru lyset av og på for hånd som om det var 1995.

Problemet var avstanden mellom «jeg kan skrive programvare» og «jeg vet hvilken ledning som skal hvor».

## Koblingsproblemet

Førti år med programvare lar seg ikke overføre til elektronikk. Jeg kan resonnere om protokoller og timing, men jeg vet fortsatt ikke på refleks om GPIO-pinnene på et kort går på 3,3 V eller 5 V, eller hvilken TX-pad som skal kobles til hvilken RX-pad på et annet kort.

Databladet til LD2410B finnes. Det er også en tresiders PDF skrevet for lesere som allerede vet hva de driver med. D1 Mini, et ESP8266-basert kort som får plass til WiFi og et fullt sett GPIO-pinner på 26 mm, har dokumentasjon av samme sort: teknisk komplett, men lite imøtekommende for den som kommer fra programvaresiden.

Så jeg åpnet en samtale med Claude og beskrev hva jeg hadde. To kort. Jeg vil at de skal snakke sammen over UART. Hva må jeg vite?

Svaret var alt databladene ikke var. LD2410B får 5 V strøm, men bruker 3,3 V logikk. GPIO-pinnene på D1 Mini er også 3,3 V. Du kan koble dem direkte, uten nivåomformer. Baudraten er 256000, en verdi utenfor standardene som ESPHome tar uten å klage. TX på sensoren går til RX på D1 Mini, og omvendt. GND er felles. Det var alt.

Det hjalp mer å vite *hvorfor* hvert av disse punktene stemte, enn bare å få svaret. Jeg skjønte hva som ville gå galt om jeg tok feil.

{{< img src="/images/blog/2026-05-23-ai-at-the-workbench/pinout-documentation.jpg" alt="AI-generert koblingsdokumentasjon med UART-pinnekartet mellom D1 Mini og HLK-LD2410B i en tabell" caption="Koblingsguiden Claude lagde. Pinnetabell, notater og den ene tingen du ikke skal gjøre." >}}

## ESPHome på ti minutter

ESPHome har en solid LD2410-integrasjon. Da koblingen først var riktig, tok det rundt ti minutter å få sensoren til å snakke med Home Assistant, med en YAML-blokk som Claude skrev det meste av. Jeg oppga pinnene og baudraten og fikk tilbake en konfigurasjon som kompilerer, lar seg flashe og virker.

Home Assistant styrer allerede det meste av huset vårt: flere hundre sensorer og lys, lading av bilene planlagt etter spotprisen, oppvaskmaskinen, en robotstøvsuger, to tørketromler og hjemmekinoen. LD2410B skulle ikke bevise noe som helst. Den var bare neste punkt på listen.

Sensoren melder om to typer mål: bevegelige og stasjonære. Hver av dem har en deteksjonsavstand og en signalstyrke. Du kan justere deteksjonsportene (LD2410B har ti soner på 75 cm som kan stilles inn hver for seg) og sette en timeout for hvor lenge den venter før den melder rommet tomt. Jeg satte min til 30 sekunder. Det er lenge nok til at den ikke blafrer når jeg lener meg tilbake i stolen, og kort nok til at den fanger opp at jeg faktisk går ut av rommet.

Virker og er testet. Den blir der den er.

{{< img src="/images/blog/2026-05-23-ai-at-the-workbench/drawer.jpg" alt="D1 Mini og HLK-LD2410B koblet sammen med jumperledninger, den fungerende prototypen før den fikk et ordentlig kabinett" caption="Proof of concept. Virket i to år, festet til ingenting." >}}

## Kabinettproblemet

Jeg hadde ikke tenkt å feste dette til veggen med strips.

Jeg spurte Claude hva et fornuftig menneske bruker for å tegne et lite kabinett til 3D-printing. Den foreslo OpenSCAD. Jeg hadde aldri åpnet det. Poenget er at du beskriver geometrien i kode i stedet for å dra hjørnepunkter rundt i et grafisk grensesnitt. Endrer du tallene, endres modellen. Det passet meg godt. Så jeg ga den målene på kortene og en kravliste: USB-porten skulle nås utenfra, lokket skulle ha et vindu over sensorflaten, og det trengtes festehull og plass til ledninger mellom kortene.

Jeg fikk tilbake en fil som virket. I første rendering satt USB-utsparingen på feil side, og kortholderne var for trange, men strukturen var riktig. Jeg brukte en time på å justere tall i stedet for å lære verktøyet fra bunnen av.

Jeg ante fortsatt ikke om noe av dette ville overleve overgangen til plast. Så jeg hentet fram skyvelæret og målte alt nøye: lengden og bredden på kortene, høyden på kontaktene og hvor langt USB-kontakten stakk ut. Så la jeg inn de faktiske målene.

{{< img src="/images/blog/2026-05-23-ai-at-the-workbench/caliper.jpg" alt="HLK-LD2410B-sensoren og D1 Mini ved siden av et skyvelære i stål, brukt til å ta nøyaktige mål til kabinettet" caption="Ingenting slår et skyvelære og ekte mål." >}}

Så printet jeg bare bunnen. Kortene falt på plass. Hver holder traff. USB-porten sto rett i utsparingen. Satt som et skudd.

Hele printen gikk på min nye Bambu Lab H2C, bestilt fra [PolyAlkemi.no](https://www.polyalkemi.no). De var hjelpsomme og sendte raskt, og i pakken lå det godteri, visstnok en fast tradisjon hos dem. Er du på jakt etter filament eller en ny maskin i Norge, er de verdt å vite om.

Hvitt lokk med ventilasjonsgitter over sensorvinduet og en avlang utsparing til USB-porten. Mørkt hus med kortholdere og skruehylser i hjørnene. Delene passer sammen, og boksen ligger flatt mot veggen. Et bilde av den ferdige, sammensatte enheten kommer her når printeren har sluttet å durre.

## Hva som faktisk endret seg

Det finnes en versjon av dette prosjektet som aldri blir ferdig. Jeg kjøper delene, prøver å lese databladene, blir forvirret av logikknivåer, legger det til side til senere, og senere kommer aldri. Dette prosjektet lå i skuffen i to år før jeg endelig hadde riktig verktøy til å komme meg over hullene.

Forskjellen denne gangen var at jeg hadde noe å spørre. Før hadde jeg datablader jeg ikke klarte å tolke, og forumtråder fra 2019 der halvparten av bildene var borte. Nå fikk et konkret spørsmål et konkret svar, med begrunnelsen på kjøpet. Det var hele forskjellen.

Spenningsnivåene, den rare baudraten, grunnstrukturen i OpenSCAD: det var nettopp de veggene prosjektet hadde kjørt inn i to ganger før. Resten kunne jeg. Bare ikke dette.

Nå henger den på veggen. Lyset står på så lenge jeg sitter ved skrivebordet.

Det er en egen følelse å gå fra idé til ferdig produkt på en ettermiddag. Jeg vokste opp med Donald Duck, og Gyro Gearloose, eller Petter Smart som han heter på norsk, var alltid figuren jeg ville være: oppfinneren i Andeby som kunne bygge alt han kunne tenke seg. Etter førti år med koding kan jeg endelig bygge ting, jeg også. Det tok sin tid.

Neste steg: flere romsensorer i resten av huset. Og i en pakke på vei hit ligger det magneter, fjærer og kulelagre, for arbeidsbenken har andre planer også.

Et av standpunktene på denne bloggen er «automatiser huset ditt». Et prosjekt som lå i en skuff i to år, ble ferdig på en ettermiddag. Det er det standpunktet betyr.

---

## FAQ

### Hva er HLK-LD2410B?

HLK-LD2410B er en mmWave-radarmodul på 24 GHz fra Hi-Link som oppdager at mennesker er til stede. I motsetning til PIR-sensorer, som krever fysisk bevegelse, kan den oppdage en person som sitter i ro, ved å fange opp mikrobevegelser som pust. Den er omtrent 35 mm lang, kommuniserer over UART med 256000 baud og går på 5 V strøm med 3,3 V logikknivå.

### Hva skiller tilstedeværelsesdeteksjon fra bevegelsesdeteksjon?

Bevegelsesdeteksjon krever fysisk bevegelse: en PIR-sensor slår inn når den infrarøde signaturen din flytter seg gjennom deteksjonssonene. Når du slutter å bevege deg, slutter den å se deg. Tilstedeværelsesdeteksjon med mmWave-radar fanger opp mikrobevegelser: pust, små endringer i holdningen, til og med hjerteslag på kort hold. I hjemmeautomatisering svarer tilstedeværelsesdeteksjon på «er det noen i dette rommet?» i stedet for «har noen beveget seg her nylig?».

### Kan AI hjelpe med å koble elektronikk?

I praksis ja, når det gjelder hobbyprosjekter med etablerte komponenter og dokumenterte protokoller. Dette fungerer godt: å finne riktige pinner, sjekke at spenningene passer sammen, forklare hvordan en protokoll virker og skrive et utgangspunkt for konfigurasjonen. Dette krever fortsatt ditt eget skjønn: å kontrollere svaret mot det faktiske databladet, særlig for uvanlige komponenter eller grensetilfeller. Se på AI som et kunnskapsrikt utgangspunkt, ikke som et maskinvareorakel.

### Hvordan bruker du HLK-LD2410B med ESPHome og Home Assistant?

ESPHome har en innebygd LD2410-komponent. Koble VCC til 5 V, GND til GND, sensorens TX til RX-pinnen på mikrokontrolleren og sensorens RX til TX. Sett baudraten til 256000. Definer komponenten i ESPHome-YAML-en med riktige TX/RX-pinner og flash enheten. Da dukker den opp i Home Assistant som en sensor med egne entiteter for avstand til bevegelig mål, avstand til stasjonært mål og deteksjonsstatus. Konfigurasjonen tar rundt ti minutter når koblingen er riktig.

### Hvilke verktøy brukes til å 3D-printe kabinetter?

Kabinettet ble tegnet i OpenSCAD, som er gratis og parametrisk: du skriver kode som beskriver geometrien, og det gjør nøyaktige målendringer enkle. Modellen ble printet på en Bambu Lab H2C.
