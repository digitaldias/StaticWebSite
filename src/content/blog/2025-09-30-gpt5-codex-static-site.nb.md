---
title: "Slik fikk GPT5-Codex og Azure Static Websites digitaldias.com i lufta"
date: 2025-09-30
draft: false
description: "Pedro Dias forteller hvordan GPT5-Codex hjalp ham å bygge digitaldias.com og publisere det på Azure Storage Static Websites, og hva han lærte underveis."
excerpt: "Jeg parprogrammerte med GPT5-Codex, skjenket meg en dobbel espresso og hadde en ny digitaldias.com klar etter noen økter. Her er det som fungerte, det som overrasket meg, og hvorfor jeg ville gjort det igjen."
readTime: "6 minutters lesetid"
categories: ["Architecture", "Azure", "AI"]
tags: ["GPT5", "Codex", "Azure Static Web Apps", "AI", "Agentic Development"]
author: "Pedro Dias"
---

Fire tiår med programvareutvikling gir deg et instinkt for ting. Med **GPT5-Codex** fikk jeg en medspiller som aldri mister tråden, og som har meninger om designdetaljer. Sammen bygde vi dette nettstedet fra bunnen av: tilgjengelighet først, finjustert for ytelse og bygget rundt den doble arven som former måten jeg ser ting på.

## Hvorfor GPT5-Codex var den perfekte andrepiloten

- **Idéer på løpende bånd:** Trenger du tre layoutvarianter for toppseksjonen? Codex kom med alternativer raskere enn jeg rakk å skissere dem på papir.
- **Vaktbikkje for tilgjengelighet:** Fra «hopp til innhold»-lenker til aria-live-tellere passet Codex på at vi tok inkluderende design på alvor helt fra første commit.
- **Refaktorering uten friksjon:** Å justere tekst, kutte ubrukt JavaScript eller tenke ut en ny bio-seksjon ble en samtale, ikke et slit.

> Når det føles som å jamme i kodeeditoren, vet du at du har funnet riktig makker.

## Spennende hosting med Azure Storage Static Websites

Da pikslene og teksten satt, gikk deployen til **Azure Storage Static Websites**. Det er påfallende lite styr å publisere et nettsted for hele verden. En rask `az storage blob upload-batch`, et CDN-endepunkt, og plutselig kan resten av kloden kikke inn i min verden.

Legg til *betal-for-bruk*-modellen og global redundans, så har du en herlig lettvint måte å holde personlige prosjekter driftssikre på. Ingen servere å passe, ingen patchevinduer. Commit, last opp, og så tilbake til å veilede team eller ta det neste bildet.

## Verdt å tenke på når du bygger selv

1. **Automatiser pipelinen:** Selv for et statisk nettsted sparer en pipeline i GitHub Actions eller Azure DevOps deg for feil ved manuell opplasting.
2. **Husk CSP:** Stram inn Content Security Policy-headerne tidlig, særlig når du henter inn eksterne ressurser eller analyseskript.
3. **Versjoner bloggen:** Innleggene ligger i `blog/posts/`. Gi filene ISO-dato i navnet, og legg dem inn i `blog/index.html` så feeden holder seg oppdatert.
4. **Cache med omtanke:** Azures statiske hosting fungerer fint med uforanderlig (immutable) caching. Gi tunge ressurser filnavn med innholdshash, så slipper du utdatert innhold.
5. **Behold den menneskelige stemmen:** Codex kan improvisere glimrende, men hjertet i teksten kommer fra ekte historier. Bland generert struktur med ditt eget perspektiv.

## Vanlige spørsmål

**Erstatter GPT5-Codex en utvikler, eller går ting bare raskere?**
Det går raskere, noen ganger dramatisk raskere. Men noen må fortsatt vite hva «tilgjengelighet først» betyr, hvorfor en CSP er viktig, og når AI-en har tatt av i feil retning. Skjønnet er fortsatt menneskets. Tastingen i mindre grad.

**Er Azure Storage Static Websites et godt valg for en personlig blogg?**
Ja, både på pris og enkelhet. Dette nettstedet flyttet jeg etter hvert over til Azure Static Web Apps, som gir deg en skikkelig CI/CD-pipeline, egne domener og administrert SSL uten ekstra oppsett. Begge fungerer, men Static Web Apps krever mindre håndarbeid.

**Hva er haken med AI-assistert webutvikling?**
Verifiseringen. AI-en kan ikke se resultatet i nettleseren. Du må åpne nettleseren selv, sjekke layouten, teste på mobil og kontrollere at ARIA-rollene virker. Koden virker som regel, men de visuelle detaljene trenger fortsatt et menneskeøye.

---

## Hva skjer videre?

Bloggen fortsetter med agentiske arbeidsflyter i virksomhetsarkitektur, mønstre for Blazor og Avalonia, og hvordan det er å holde seg nysgjerrig etter 40 år. Abonner på RSS-feeden, eller stikk innom igjen senere.
