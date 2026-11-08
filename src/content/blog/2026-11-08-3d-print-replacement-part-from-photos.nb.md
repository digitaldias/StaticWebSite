---
title: "Jeg fotograferte en knekt klype. Claude lagde en ny"
date: 2026-11-08
draft: false
description: "3D-print en reservedel fra bilder: Claude sa hvordan jeg skulle ta dem, styrte Fusion 360, lagde 3MF-filen og slicet den for Bambu Lab H2C."
excerpt: "Jeg kan ikke CAD. Jeg tok bilder med skyvelæret i bildet, og Claude tegnet over dem i Fusion 360, eksporterte 3MF-filen og slicet den. Her er fotooppskriften som fikk andre forsøk til å passe."
tldr: "Claude kan gjøre en ødelagt del om til en ferdig slicet printfil hvis du fotograferer delen slik den ber om. Den styrte Fusion 360 selv, lagde 3MF-filen og slicet den for Bambu Lab H2C fra kommandolinjen. Første forsøk bommet, og det andre passet etter to printer. Her får du fotoreglene og de tre kontrollmålene som avgjorde det."
categories: ["AI", "Development"]
tags: ["Fusion 360", "Bambu Studio", "3MF", "3D printing", "Claude Code"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-08-3d-print-replacement-part-from-photos/featured.jpg"
featuredAlt: "En hvit 3D-printet kopi av en dusjhodeklype ved siden av den sprukne, limte originalen den ble modellert etter"
imageCredit: "© Pedro Dias"
---

En kollega kom til meg med en dusjhodeholder og ba om hjelp. Den er eldgammel, den gikk i stykker, noen hadde limt den sammen igjen, og den selges ikke lenger. Jeg lovet å prøve. Du kjenner sikkert til en sånn del selv.

Jeg er dårlig på CAD. Så jeg ga holderen til Claude, og Claude gjorde resten: den sa hvordan jeg skulle fotografere den, modellerte den i Fusion 360, skrev 3MF-filen og slicet den for Bambu Lab H2C.

Tidligere Claude-modeller gjorde ikke en god jobb med dette. Denne gangen imponerte Claude meg skikkelig. Jeg har hevdet at [alle hjem bør ha en 3D-printer](/nb/blog/2026-05-23-ai-at-the-workbench/).

## Reservedel fra bilder: hva Claude gjorde, fra start til slutt

Claude tok alle stegene mellom en slitt del og en printjobb, og jeg sto for to av dem: kameraet og skyvelæret.

Den ba om bilder med en linjal synlig. Den gjorde dem om til en 3D-modell, lagde printfilen og valgte printerinnstillingene. Etter 50 minutter med hvit PETG lå det en ny holder ved siden av originalen.

Det gikk ikke på første forsøk. Den 3. november bygde Claude en første modell ut fra målene mine. Jeg så på resultatet og sa at ringen bak «stemmer ikke i det hele tatt». Den hadde tegnet en rett oval der originalen buer som en nyre. Dagen endte med at jeg skrev at vi hadde svidd av alle tokens og ikke kom i mål.

I andre forsøk, fem dager senere, tegnet Claude over bildene og rettet modellen med tre mål. Resten av innlegget viser hvordan.

## Fotografere en del for Claude: reglene jeg fikk

Claude ba om et bilde rett forfra, med linjalen i samme plan som flaten den skulle tegne over. Første gang lå linjalen på bordet ved siden av en del som er 28 mm høy, og målt mot den ble delen på bildet omtrent 10 prosent for stor.

Den 8. november spurte jeg hvilket objektiv jeg burde bruke. Jeg har et 90 mm makroobjektiv, et 70-200 og et stativ, og delen er rundt 55 mm lang. Claudes råd:

- 90 mm makro på korteste fokusavstand, omtrent 30 cm.
- f/8 til f/11 og ISO 100. Dybdeskarpheten er bare rundt 5 mm, selv på f/11.
- Stativ og to sekunders selvutløser.
- Kalibrer på to streker langt fra hverandre på linjalen, ikke på én.
- Sjekk hvilken skala du leser av. Den nederste skalaen på min er i tommer, så en feil på faktor 2,54 ligger og venter.

De endelige bildene tok jeg med 90 mm-objektivet på 30 cm, f/11 og ISO 640.

De første Sony-bildene mine var tatt på skrå, med linjalen øverst i bildet. Claude leste sidebildet som 6,5 cm mot 5,5 cm på skyvelæret og ba meg ta dem på nytt. Mobilbildene fra første forsøk bommet med 5 til 7 prosent, ifølge Claudes egen visuelle avlesning av linjalen.

{{< img src="/images/blog/2026-11-08-3d-print-replacement-part-from-photos/phone-top.jpg" alt="Klypa sett ovenfra på et mørkt underlag, med en tommestokk av tre langs nederkanten" caption="Mobilbilde fra første forsøk: linjalen ligger på bordet, delen står høyere." credit="© Pedro Dias" >}}

{{< img src="/images/blog/2026-11-08-3d-print-replacement-part-from-photos/sony-top.jpg" alt="Klypa ovenfra mellom kjeftene på et skyvelær av stål, tatt rett forfra" caption="Sony-bilde fra andre forsøk: 30 cm, f/11, skyvelæret i bildet." credit="© Pedro Dias" >}}

## Fusion 360 fra bilder: tegn over bildet, ikke bygg fra tall

Claude styrer Fusion 360 gjennom en lokal MCP-server som kjører Python-skript, og det fungerer når du sier at den skal tegne over bildet og ikke bygge fra tallene.

I første forsøk bygde Claude geometrien ut fra skyvelærmålene mine og brukte bildene bare som kontroll. Claude skrev rettelsen inn i sine egne prosjektinstruksjoner, og her er den, klar til å limes inn i dine:

```text
Put each reference photo in Fusion as a canvas on its own plane, outside the part, and sketch on that same plane.
Trace the contour in the photo with lines and arcs. Add the caliper dimensions afterwards.
Never build the geometry from the parameters and use the photo only as a check.
Calipers decide the size, the photo decides the shape. Expect about 5 percent perspective error.
Calibrate scale from the millimetre ticks, but take rotation from the part itself.
Ask for 2 to 3 control measurements drawn on the photos, one per image axis. Scale the model with one factor per axis.
```

I andre forsøk brukte Claude numpy til å finne rundt 125 millimeterstreker på skyvelæret, og fikk 50,82 piksler per millimeter på bildene av toppen og undersiden. Den la tre canvas på tre plan, med midten av tappen som origo, og tegnet over omrisset på hvert av dem. Den pekte også selv ut det svake punktet: flatene den tegnet over, lå 14 til 28 mm over skyvelærskalaen, så den regnet med at modellen ville bli 3 til 5 prosent for stor.

{{< img src="/images/blog/2026-11-08-3d-print-replacement-part-from-photos/fusion-canvases.jpg" alt="Fusion 360 sett skrått ovenfra: tre fotocanvas på hvert sitt plan rundt klypemodellen, hver med skyvelær og delen" caption="De tre canvasene i Fusion 360, ett per plan, med modellen mellom dem." credit="© Pedro Dias" >}}

{{< img src="/images/blog/2026-11-08-3d-print-replacement-part-from-photos/fusion-overlay.jpg" alt="Klypemodellen tegnet over toppbildet i Fusion 360, med skyvelærskalaen bak" caption="Modellen lagt over toppbildet. Omrisset følger konturen." credit="© Pedro Dias" >}}

Derfor er kontrollmålene viktige. Jeg målte tre ting på originalen, og Claude tegnet dem inn på bildene:

| Mål | Claudes modell | Originalen |
|---|---|---|
| A: boring i toppflaten | 22,8 mm | 22,4 mm |
| B: boring i undersiden | 20,2 mm | 20,0 mm |
| C: total høyde | 27,2 mm | 28,0 mm |

Toppbildene var 1,4 prosent for store og sidebildet 2,9 prosent for lite. Claude skalerte med 0,986 i X og Y og 1,029 i Z, bygde modellen på nytt og fikk 22,40, 20,00 og 27,99 mm. Dette steget ville jeg kopiert, uansett hva du fotograferer.

{{< img src="/images/blog/2026-11-08-3d-print-replacement-part-from-photos/control-a.jpg" alt="Klypa mellom skyvelærkjeftene med en rød pil over boringen og bokstaven A for innvendig diameter" caption="Kontrollmål A. Claude tegnet pilen og modellverdien; jeg målte boringen på originalen." credit="© Pedro Dias" >}}

## 3MF og Bambu Studio fra kommandolinjen

Claude eksporterte ett legeme som `klemme.3mf` og slicet det ved å kjøre `bambu-studio.exe` selv. Grunnen er at H2C-en min finnes som profil i Bambu Studio, men ikke i Orca Slicer.

Jeg spurte om den hadde kjørt Bambu Studio uten vindu. Det hadde den. Den slo sammen arvekjedene i systemprofilene under `%APPDATA%\BambuStudio\system\BBL` til flate JSON-filer og kjørte dette:

```bash
bambu-studio.exe --slice 0 --load-settings "machine.json;process.json" --load-filaments filament.json --outputdir out --export-3mf
```

Programmet skriver ingenting til konsollen, så Claude leste `result.json` i stedet. Første kjøring ga feilkode -61, «Filaments are not compatible with the plate type». Prosessprofilen måtte ha `curr_bed_type` satt til Textured PEI Plate. Andre kjøring returnerte 0.

Innstillingene Claude valgte: toppflaten ned, Bambu PETG Basic i hvitt, 0,20 mm lagtykkelse, 5 vegger, 5 topp- og 5 bunnlag, 40 prosent gyroid og tree support bare fra platen. Anslaget var 50 minutter og 15,5 g filament. Claude åpnet den slicede filen i Bambu Studio, og jeg sendte den til printeren.

## Første print, andre print og passformen

Den første printen så nesten perfekt ut, men jeg mistenkte at den var litt unna. Jeg ba Claude sjekke så nøye den kunne, og den fant tre ting. To av dem betydde noe: armene var for korte, og stammen møtte blokken i et skarpt hjørne. Den tredje, en mer kantete stamme, var bare kosmetisk.

Jeg målte to avstander til på originalen. Armlengden D var 34,5 mm øverst og 33,5 mm nederst. Modellen hadde 33,4 og 30,9 mm, så armene var 1,1 og 2,6 mm for korte. Modellen lot tuppene ende på den ytre sirkelen, og det kappet dem av. Åpningen mellom tuppene, E, stemte.

Claude tegnet tuppene på nytt med tangentbuer og endret avrundingen der stammen møter blokken, fra R0,6 til R2,5. To Fusion-API-feller havnet i Claudes egne notater mens den bygde om: setter du `ExtrudeFeature.profile` på nytt, nullstilles `isFullLength` på en symmetrisk extent, så du må sette den tilbake etterpå, og skisser og features må ha ulike navn, ellers legger Fusion et «(1)» på featuren. Til den andre printen eksporterte Claude legemet til `klemme.3mf` og snudde det med toppflaten ned ved å rotere nettet 180 grader om X i 3MF-ens XML (`klemme_print.3mf`). Så kjørte den samme slicer-kommandoen som sist. Claudes nye slicing ga 50 minutter og 16,1 g. Jeg slo på variabel lagtykkelse i Bambu Studio, og da ble det 54 minutter.

Den andre klypa passet. Jeg tok den ødelagte originalen med hjem, så jeg kunne holde de to side om side. Kollegaen min får den nye på tirsdag, og da kommer den virkelige testen. Jeg er spent.

{{< img src="/images/blog/2026-11-08-3d-print-replacement-part-from-photos/featured.jpg" alt="En hvit 3D-printet kopi av en dusjhodeklype ved siden av den sprukne, limte originalen den ble modellert etter" caption="Printen til venstre, den limte originalen til høyre. Mobilbildet er skalert opp 2x lokalt med RealESRGAN og beskåret til 16:9." credit="© Pedro Dias" >}}

## Oppsummert

Fotografer delen rett forfra, med linjalen i samme plan, og mål tre ting på originalen. Claude tar resten.

## FAQ

### Kan Claude virkelig styre Fusion 360?

Ja, gjennom en lokal MCP-server for Fusion som kjører Python-skript. I øktene mine la den inn canvas, tegnet skisser, lagde features og eksporterte 3MF-filen.

### Hvilken printer og slicer brukte du?

En Bambu Lab H2C, med Bambu Studio og Bambu PETG Basic i hvitt på en Textured PEI Plate. Orca Slicer har ingen H2C-profil, så slicingen fra kommandolinjen gikk gjennom Bambu Studio.

### Hvor nøyaktig var den første modellen?

Nøyaktig nok til å se riktig ut, men ikke nøyaktig nok til å bestå en sjekk med skyvelæret. Armene var 1,1 og 2,6 mm for korte, og høyden bommet med 0,8 mm før kontrollmålene.

### Trenger jeg et makroobjektiv?

Jeg brukte ett fordi delen er 55 mm lang. Reglene som betydde noe, handlet ikke om objektivet: ta bildet rett forfra, ha linjalen i flatens plan og mål kontrollverdier på originalen.
