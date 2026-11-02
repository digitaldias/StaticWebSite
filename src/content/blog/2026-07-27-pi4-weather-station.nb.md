---
title: "Jeg prøvde å fikse et Wi-Fi-kamera. Jeg bygde en værstasjon."
date: 2026-07-27
draft: false
description: "En Raspberry Pi 4 skulle videresende et svakt Wi-Fi-signal fra et kamera. Etter tre dager med driverfeil og dårlig strøm ble berøringsskjermen en værstasjon."
excerpt: "Et kamera for langt fra huben. En Raspberry Pi som nektet å videresende signalet. Etter tre dager med driverfeil og dårlig strøm ga jeg opp og lot berøringsskjermen gjøre det den var laget for: vise noe nyttig på veggen."
readTime: "5 minutters lesing"
categories: ["Development"]
tags: ["Raspberry Pi", "Weather Station", "Home Assistant", "Wi-Fi", "3D Printing"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-07-27-pi4-weather-station/featured.png"
featuredAlt: "Et værdashbord på en Raspberry Pi montert på veggen, med været akkurat nå, neste søppeltømming, neste vaskedag og en stripe med værmelding"
imageCredit: "© Pedro Dias"
---

Munin, batterikameraet vårt på kjøkkensiden av huset, mistet stadig bilder. Det var ikke batteriet. Wi-Fi-signalet der ute var for svakt, og det hjalp ikke å flytte på kameraet.

Jeg hadde allerede en [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) i gangen, koblet til strøm og i drift, med en offisiell 7"-berøringsskjerm skrudd fast foran. Den opplagte løsningen: gjøre den om til et Wi-Fi-aksesspunkt, plassere den mellom Munin og huben og la den sende videostrømmen videre.

Det tok meg tre dager å skjønne hvorfor den planen ikke virker.

## Reléet som ikke holdt

Første problem: to strømforsyninger forsynte Pi-en samtidig og matet strøm tilbake i hverandre. `vcgencmd get_throttled` viste underspenning og struping fra første oppstart. Det betydde at ingenting jeg hadde målt fram til da, var til å stole på. Én strømforsyning med riktig dimensjonering løste det.

Andre problem: strømsparing for Wi-Fi var slått på som standard på begge radioene i Pi-en, og den kuttet forbindelser uten et ord. Kameraet kobler seg til, og noen minutter senere er det borte. Ingen feil, ingen logglinje verdt å lese. En systemd-tjeneste som slår av strømsparingen ved oppstart, løste også det.

Tredje problem: USB-radioen til aksesspunktet var en Broadcom-brikke fra 2014 med kjente driverfeil i akkurat denne jobben: frittstående AP-modus. Ren strøm, ingen strømsparing, og likevel havnet den i stormer av nye tilkoblinger under belastning.

Én gang klarte Munin en handshake gjennom reléet. DHCP virket, huben fant veien via repeateren, og kameraet strømmet. Men det holdt aldri mer enn noen få minutter om gangen. Å få hele kjeden stabil nok til daglig bruk var å kaste god tid etter gammel maskinvare uten støtte. Jeg koblet ut reléet.

## Hva Pi-en var god til

Pi-en hadde fortsatt en skjerm. En brukbar skjerm, i den travleste gangen i huset, allerede montert og med strøm. Jeg hadde brukt tre dager på å gjøre den god til noe den aldri var laget for, mens det ene den faktisk hadde å by på, sto ubrukt.

Så i stedet for enda et nettverksforsøk ga jeg den en jobb som passet til det den allerede hadde: å vise nyttige ting til den som går forbi.

## Bygge værstasjonen

Første versjon var et værpanel. [Yr/MET Norway](https://developer.yr.no/) har to API-er som er verdt å kombinere: Nowcast for det som skjer akkurat nå, oppdatert hvert kvarter, og Locationforecast for de neste timene og dagene. Jeg hentet begge, bufret dem på serversiden og bygde et enkelt rutenett.

Så vokste det. Et kort for neste søppeltømming, hentet fra [Norkarts Komtek Renovasjon](https://www.norkart.no/offentlig/komtek/renovasjon), som bare er uthevet på tømmedagen og dagen før. Et kort for neste vaskedag, siden vaskeplanen vår er «fredager i partallsuker» og ingen husker hvilken uke det er. Dagens sitat fra [ZenQuotes](https://zenquotes.io/), oppdatert hver fjerde time, fordi det var ledig plass å fylle. En farget varselstripe som bare dukker opp når værtjenesten har et aktivt varsel for koordinatene våre, gult, oransje eller rødt, og som forsvinner i samme øyeblikk som varselet utløper.

{{< img src="/images/blog/2026-07-27-pi4-weather-station/featured.png" alt="Det ferdige værdashbordet på Raspberry Pi-en, med været akkurat nå, et aktivt skogbrannvarsel, neste søppeltømming, neste vaskedag og en stripe med værmelding" caption="En vanlig mandag morgen: været akkurat nå, et aktivt varsel om lav skogbrannfare, neste søppeltømming og neste vaskedag." >}}

Før jeg publiserte skjermbildet, fjernet jeg gatenavnet vårt og detaljene om bursdager.

Ingenting av dette bruker påloggingen til Home Assistant eller en skykonto. Vær- og sitat-API-ene trenger bare en User-Agent-header. Avfalls-API-et trenger en fast, offentlig app-nøkkel, den samme som alle integrasjonene fra fellesskapet bruker. Alt er ett Python-skript uten avhengigheter som snakker direkte med API-ene.

## I kamp med en nettleser fra 2019

Chromium-versjonen som fulgte med Pi-en fra fabrikken, var 74, fra 2019. Operatoren for nullish coalescing i moderne JavaScript, `??`, kom først i Chrome 80. Det er ikke en manglende funksjon, men en parsefeil, og en parsefeil dreper hele skriptet på siden. Ingenting ble rendret, ingenting ble logget, og jeg hadde ingen anelse om hvorfor. Jeg oppgraderte Chromium til 92 fra det samme repoet, og dashbordet våknet til liv igjen.

CSS hadde enda en overraskelse på lur: `blur()` og `drop-shadow()` blir til en heldekkende svart boks på denne GPU-en. Ingen advarsel, ingen delvis effekt, bare svart. Jeg byttet ut hver eneste myke glødeeffekt med en `radial-gradient` som toner ut til gjennomsiktig. Så nært at ingen andre enn meg ville merke forskjellen.

Operativsystemet har heller ingen norsk locale installert. Når jeg ba det formatere en norsk dato, fikk jeg i all stillhet engelske ukedagsnavn og en AM/PM-klokke tilbake. Løsningen var grov: to hardkodede arrays med norske navn på ukedager og måneder, indeksert for hånd. Ikke elegant. Riktig.

For at skjermen ikke skal brenne seg inn, glir bakgrunnen gjennom en langsom gradient, tre myke lysflekker driver over den i sitt eget tempo, og hele layouten flytter seg noen piksler hvert fjerde minutt, godt innenfor en marg, så ingenting blir kuttet.

## Legge til en bursdagskalender

Det siste jeg la til, var en bursdagskalender. Den innebygde kalenderen i [Home Assistant](https://www.home-assistant.io/) kan holde hendelser som gjentas hvert år, men standardtjenesten for å legge dem inn godtar ikke en regel for årlig gjentakelse. Så jeg skrev en liten lokal tjeneste som gjør det, pluss et enkelt skjema der du skriver inn navn og dato uten å slåss med en datovelger for noen som er født for flere tiår siden. Dashbordet viser nå neste bursdag, hvem som har den og hvor mange år vedkommende fyller, klemt inn i toppen uten å presse noe annet ut.

## Hvor det endte

Jeg 3D-printet en ramme til den og monterte den på veggen i gangen. Den forteller deg hva du bør ha på deg, når søpla skal ut, når neste store vaskedag er og nå også hvem som snart har bursdag.

Det begynte som et forsøk på å redde ett kamera som slet. Det endte som den ene skjermen i huset som alle leser.
