---
title: "Navigasjonssnarveien Visual Studio glemte å ta med"
date: 2026-03-05
draft: false
description: "Navigate to Handler er en gratis utvidelse til Visual Studio 2022 som finner alle metoder i løsningen som tar en gitt type. For MediatR, event-busser og mer."
excerpt: "F12 viser hvor en type er definert. Den viser ikke hvor typen brukes. Jeg lagde en utvidelse til Visual Studio 2022 som gjør nettopp det."
readTime: "3 minutters lesing"
categories: ["Development"]
tags: ["dotnet", "visual-studio-extension", "mediatr", "productivity", "csharp", "cqrs"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-03-05-navigate-to-handler/featured.jpg"
featuredAlt: "Kontekstmenyen i Visual Studio 2022 med Navigate to Handler uthevet og hurtigtasten Ctrl+Alt+H"
imageCredit: "© Pedro Dias"
---

Du feilsøker et tregt API-endepunkt. Du finner controller-actionen, ser at den sender en `GetOrderSummaryQuery`, og trykker **F12** for å gå til handleren.

Visual Studio sender deg til definisjonen av grensesnittet `IRequest<T>` i MediatR-pakken.

Takk. Veldig nyttig.

Du lukker den, åpner Solution Explorer, skriver «GetOrderSummary» i søkefeltet og finner til slutt `GetOrderSummaryQueryHandler`, begravd tre mappenivåer ned i et annet prosjekt.

Har du brukt MediatR i en ekte kodebase, har du danset denne dansen hundrevis av ganger. Men problemet dukker opp overalt der typer går gjennom en meldingsbuss, en event-dispatcher eller en DI-container under kjøring.

---

## Derfor svikter F12 deg her

F12 («Go to Definition») følger typesystemet. Trykker du F12 på `new GetOrderSummaryQuery()`, ser Visual Studio en klasse og hopper dit klassen er definert. Helt logisk. Og helt ubrukelig for det du prøver å få til.

Problemet er ikke MediatR. Problemet er alle mønstre der koblingen mellom en type og den som bruker den, settes opp under kjøring og ikke i koden. Mediator-mønsteret, domenehendelser, egne kommandobusser: ingen av dem gir en referanse ved kompilering fra typen til klassen som håndterer den. Controlleren din sender en melding. Noe, et eller annet sted, plukker den opp. F12 kan ikke følge den.

Derfor søker du. Hver gang. For alltid.

---

## Utvidelsen: Navigate to Handler

**[Navigate to Handler](https://marketplace.visualstudio.com/items?itemName=digitaldias-pedro-g-dias.n2hv1)** er en gratis utvidelse til Visual Studio 2022. Den svarer på et annet spørsmål enn F12: ikke «hvor er denne typen definert?», men «hvor brukes denne typen?»

Sett markøren på en type som ikke er innebygd, og velg **Navigate to Handler** i kontekstmenyen (eller trykk **Ctrl+Alt+H**). Utvidelsen går gjennom alle prosjektene i løsningen og finner alle public- og protected-metoder som tar typen som parameter.

Det er alt. Du er framme.

Ikke noe søk. Ingen gjetting på hvilket prosjekt handleren bor i. Ingen leting gjennom mappenavn i håp om at ett av dem gir deg et hint.

---

## Slik ser det ut i praksis

Si at du har dette i controlleren din:

```csharp
var result = await _mediator.Send(new CreateInvoiceCommand(order.Id, customerId));
```

Du setter markøren på `CreateInvoiceCommand` og velger **Navigate to Handler**. Visual Studio åpner:

```csharp
public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, InvoiceDto>
{
    public async Task<InvoiceDto> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
    {
        // the actual work happens here
    }
}
```

Er det bare én konsument, hopper du rett dit. Er det flere (en MediatR pipeline behavior, en handler til, en event-abonnent i en annen modul), får du en liste å velge i.

Det virker på samme måte for domenehendelser, egne kommando-dispatchere og alle andre typer som kodebasen sender rundt under kjøring. Tar en metode et sted typen som parameter, finner Navigate to Handler den.

Vil du se den i bruk? [Se den korte demoen på YouTube](https://www.youtube.com/watch?v=THvwOrCXdwc).

---

## Derfor betyr dette mer i store løsninger

I et lite prosjekt med en håndfull handlere husker du hvor ting ligger. Du bygde det i forrige uke.

I en stor løsning med mer enn 50 prosjekter og mer enn 200 kommandoer og spørringer spredt utover domenemodulene, ryker det mentale kartet fort. Nye i teamet bruker de første ukene på å lære seg *hvor ting ligger*. Selv erfarne utviklere i teamet slutter å stole på hukommelsen og griper til søket.

Hvert unødvendig kontekstbytte koster. Du mister tråden. Du glemmer hva du lette etter i utgangspunktet. Feilsøkingen burde ta 10 minutter, men trekker ut til 30.

**Navigate to Handler** er en liten løsning på et lite problem. Men problemet dukker opp hele tiden, og når du fjerner friksjon fra noe som skjer hele tiden, blir det mye til sammen.

---

## Hvorfor jeg bygde den

Jeg ble lei av å søke.

Det er egentlig alt. Jeg så det samme mønsteret igjen og igjen: utvikleren trykker F12 på en request-type, havner et sted som ikke hjelper, sukker og åpner søket. Selv gjorde jeg det titalls ganger om dagen: i MediatR-kodebaser, i prosjekter med egne event-busser, i eldre systemer med hjemmesnekrede kommando-dispatchere.

Det virket som et problem noen allerede hadde løst. Da jeg lette, viste det seg at ingen hadde det, i hvert fall ikke på en måte som passet naturlig inn i navigasjonsmodellen Visual Studio allerede har.

Så jeg bygde den og publiserte den. Nå bruker jeg den hver dag.

---

## Vanlige spørsmål

**Fungerer den med Visual Studio 2019?**
Nei. Den er laget for Visual Studio 2022. Det finnes ingen planer om å portere den bakover.

**Hva med JetBrains Rider?**
Ikke ennå. Rider har sin egen modell for utvidelser, og det ville blitt et eget prosjekt.

**Hva om den finner flere konsumenter?**
Da får du en liste å velge i, i et verktøyvindu, i stedet for et direkte hopp. Hvert treff viser klassenavn, metodenavn og kildefil, så du kan velge riktig.

**Fungerer den bare med MediatR?**
Nei. Utvidelsen har ingen logikk som er spesiell for MediatR. Den virker på alle typer som ikke er innebygd. Sett markøren på en klasse eller et grensesnitt, så finner den alle public- og protected-metoder i løsningen som tar typen som parameter. Lag din egen mediator, event-buss eller kommando-dispatcher, så finner den konsumentene.

---

## Få den

**Navigate to Handler** ligger i Visual Studio Marketplace.

- [Installer fra VS Marketplace](https://marketplace.visualstudio.com/items?itemName=digitaldias-pedro-g-dias.n2hv1), eller søk etter *«Navigate to Handler»* i **Extensions → Manage Extensions**
- [Kildekoden på GitHub](https://github.com/digitaldias/NavigateToHandler). Opprett issues, send PR-er og se hva som er planlagt.
- [Se demoen på YouTube](https://www.youtube.com/watch?v=THvwOrCXdwc). To minutter, og du ser nøyaktig hva den gjør.

Sparer den deg tid, si fra. Det er alltid godt å høre at den er nyttig for andre også.

---

*Pedro Dias er konstituert Chief AI Officer i Tradesolution AS og skriver om .NET, arkitektur og verktøyene som gjør utvikling mindre smertefull. Mer på [digitaldias.com](https://digitaldias.com).*
