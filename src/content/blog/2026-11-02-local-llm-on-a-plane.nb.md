---
title: "Kan du kjøre en lokal LLM offline på flyet? Dette bør du sjekke før du går om bord"
date: 2026-11-02
draft: false
description: "Skal du bruke en lokal LLM på flyet? En sjekkliste og en batteritest på ti minutter, fra én flytur med Ollama og Qwen på en M5 MacBook Pro."
excerpt: "Jeg tok med en lokal kodemodell på en flytur uten Wi-Fi. Den var tregere, svakere og mer strømsulten enn jeg hadde håpet. Her er sjekklisten og testen på ti minutter som jeg burde ha kjørt først."
tldr: "En lokal modell kan kjøre på et fly, men på en bærbar PC er den langt svakere enn en frontier-modell. Det lille kontekstvinduet får den til å miste tråden tidlig, og den tapper batteriet fort. Last den ned før du går om bord, kjør en ti minutters test på bakken, og la resultatet avgjøre om den blir med."
categories: ["AI"]
tags: ["Ollama", "Local LLMs", "Claude Code", "Qwen", "MacBook Pro", "Offline"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-02-local-llm-on-a-plane/featured.jpg"
featuredAlt: "Et klappbord på et fly med en lukket bærbar PC og en kaffekopp, og et mørkt vindu ved siden av"
imageCredit: "© Pedro Dias"
---

Flyet mitt hadde ikke Wi-Fi, så jeg tok med en AI-assistent som bor på laptopen og virker uten internett.

Det gikk dårlig. Ti minutter med testing hjemme ville ha vist meg hvorfor, og her ser du hvordan du gjør det.

## Bør du ta med en lokal LLM på flyet?

Sannsynligvis ikke ennå, men du kan finne ut av det for din egen maskin før du reiser.

En lokal modell på en laptop er et annet verktøy enn en frontier-modell, ikke en mindre utgave av det samme. På min M5 MacBook Pro svarte den tregere, mistet tråden i oppgaver på mer enn noen få steg og tappet batteriet så fort at jeg fulgte mer med på prosenten enn på skjermen.

Hvordan det går for deg, kommer an på laptopen, modellen og oppgaven. Sjekklisten nedenfor viser hva som kommer til å svi mest.

## Sjekk om du kan kjøpe Wi-Fi

Noen flyselskaper selger Wi-Fi om bord, og da stiller saken seg helt annerledes. Med nett kan du bruke frontier-modellen du allerede stoler på, og la den lokale modellen bli hjemme.

Jeg fløy med Norwegian mellom Faro og Oslo. På veien ned fantes det ikke nett å kjøpe i det hele tatt. På veien tilbake fantes det, til rundt 14 euro, hvis jeg husker riktig. Jeg lot være, for det føltes for mye for en flytur på fire timer. Sjekk dagens pris på [norwegian.com](https://www.norwegian.com) før du legger planer ut fra tallet mitt, for jeg fikk ikke bekreftet noen fast pris for denne ruten.

Til sammenligning: Claude Pro koster [20 dollar i måneden i USA](https://support.anthropic.com/en/articles/8325610-how-much-does-claude-pro-cost), og prisen varierer fra region til region. 14 euro for noen timer er altså mesteparten av et månedsabonnement. Om det er for mye, kommer an på dagen din. Sett det opp mot hva en svakere modell og et tomt batteri koster deg.

Norwegian selger Wi-Fi om bord, og konsernsjefen sa i februar 2026 at selskapet [ikke har planer om å gå over til Starlink](https://www.marketscreener.com/news/norwegian-air-does-not-plan-to-use-starlink-wi-fi-ceo-says-ce7e5ddadb8cf02c). Likevel varierer det fra fly til fly, så sjekk din egen avgang, og ha den lokale modellen i reserve i tilfelle nettet svikter.

## Kan du lade en MacBook Pro fra setet?

Noen fly har USB-uttak i setene. På Norwegian-flyene jeg reiste med, satt kontaktene der, men de gir ikke lenger strøm, så dette kunne jeg ikke teste selv. Her er det jeg fant i leverandørenes egen dokumentasjon. Det er markedsføring, ikke målinger.

Eldre USB-A-uttak gir på det meste omtrent 15 watt, ifølge [Panasonic Avionics](https://www.panasonic.aero/blog/blog-post/why-your-airline-needs-to-adopt-in-flight-usb-c-fast-charging). Det holder til en telefon. En laptop som kjører en modell, trekker langt mer, så uttaket kan bremse tappingen, men ikke stoppe den.

Nyere USB-C-uttak er noe helt annet. Panasonic oppgir garantert 67 watt per sete på Astrova-systemet sitt, og [Astronics](https://www.militaryaerospace.com/power/product/55385632/astronics-introduces-60w-usb-c-cabin-power-system-for-commercial-aircraft) selger et USB-C-system på 60 watt til kommersielle fly. Apple selger 14-tommers MacBook Pro med en lader på 70 watt, og 96 watt som tilvalg, så en seteport på 60 til 67 watt ligger like under det laptopen er laget for. Sjekk tallene for din egen modell på Apples spesifikasjonsside. Det gjorde ikke jeg.

Når uttaket gir mindre enn laptopen trenger, tar Macen resten fra batteriet. I praksis er det tre tilfeller:

- **En USB-C-seteport på 60 watt eller mer:** den bør holde batterinivået stabilt ved lett arbeid og bremse tappingen under last. Jeg har ikke målt den mens en modell kjører.
- **En USB-A-port på rundt 15 watt:** den henger ikke med når en modell kjører.
- **Ingen strøm i setet:** batteriet er alt du har.

Når du har satt deg, gir to sjekker deg det faktiske svaret. Åpne Systeminformasjon, gå til Strøm, og les av hvor mange watt Macen sier laderen gir. Kjør deretter `pmset -g batt` og se om batteriet lades eller utlades. Bruk en kabel som tåler effekten, for eksempel den som fulgte med laderen.

## Hvordan det føltes

Frontier-modeller setter en standard du slutter å legge merke til. Du ber om en endring i tre filer, og så er den gjort. Den lokale modellen ba meg presisere ting jeg allerede hadde sagt, redigerte feil fil og trengte et nytt forsøk på oppgaver Claude klarer i første forsøk.

Innlegget mitt fra april, [Local LLMs are not there yet](/nb/blog/2026-04-06-local-llms-are-not-there-yet/), kom til det samme ved et skrivebord med et RTX 5090. Ved et klappbord i flyet er det tyngre å få rett.

Den største begrensningen var det lille kontekstvinduet, altså hvor mye tekst modellen kan holde i hodet på én gang: instruksjonene dine, filene den har lest, og samtalen så langt. En kodeagent fyller det fort, og jeg hadde kuttet mitt til 32K for å få brukbar fart, som du ser i oppsettet lenger ned. Modellen min begynte å hallusinere langt tidligere enn jeg kunne godta. Den fant opp filnavn og detaljer, og resultatene ble dårlige.

Batteriet sank raskt. Inferens holder GPU-en i arbeid gjennom hele svaret, og en kodeagent lager mange svar.

## Ti minutters batteritest

Denne delen ville ha reddet meg.

1. Lad til 100 prosent, trekk ut laderen og noter nivået:

```bash
pmset -g batt
```

2. Gi modellen en ekte oppgave fra jobben din, med minst fem steg. En lekeoppgave sier deg ingenting.
3. La den kjøre i ti minutter, og sjekk på nytt med samme kommando.
4. Gang nedgangen med flytiden i minutter delt på ti.

Viser regnestykket under 20 prosent ved landing, blir modellen hjemme. Må resultatet i tillegg gjøres om, har du fått svaret to ganger.

{{< img src="/images/blog/2026-11-02-local-llm-on-a-plane/ten-minute-test.jpg" alt="En laptop uten lader på et skrivebord, ved siden av en kjøkkentimer stilt på 10:00 og en notatblokk merket 10 MIN" caption="Ut med laderen, klokka stilt, tallene på papir." >}}

Jeg noterte ingen tall på flyturen, så se på erfaringen min som én tur på én maskin. Din egen test på ti minutter sier deg mer enn inntrykkene mine.

## Sjekkliste før du reiser med en offline LLM

Gå gjennom den dagen før.

1. **Last ned alt.** Hent modellen og eventuelle verktøy mens du har nett, slå på flymodus og sjekk at den fortsatt svarer.
2. **La modellen ta omtrent halvparten av minnet.** Velg en modell der filen er på rundt halvparten av laptopens totale RAM. Resten går til kontekstvinduet, editoren, agenten og systemet. Sjekk størrelsen med `ollama list`.
3. **Sjekk kontekstvinduet.** Små modeller går tom for arbeidsminne først. Kjør `ollama show <model>` for å se kontekstlengden, og regn med at en agent som Claude Code fyller den fort. Øker du den, koster det minne, og det kolliderer med regelen om halvparten av RAM-en.
4. **Sjekk hvordan agenten oppfører seg uten nett.** Noen verktøy ringer hjem etter oppdateringer, telemetri eller innloggingssjekk. Test med Wi-Fi slått av, ikke bare med modellen i gang.
5. **Planlegg batteriet.** Vit hvor mye strøm du har, hvor lang flyturen er, og om setet har en USB-C-port som er kraftig nok til å hjelpe. Kjør batteritesten på ti minutter som står over.
6. **Velg en oppgave som passer.** Små, avgrensede endringer passer en liten modell. Refaktorering på tvers av mange filer gjør det ikke.

## Hva jeg kjørte

Claude fikk velge oppsettet. Den målte tre Qwen-varianter på min M5 Pro med 64 GB minne, på Ollama 0.40.12, og landet på `qwen3.6:35b`: en mixture-of-experts-modell med 35 milliarder parametere, der rundt 3 milliarder er aktive per token (Qwen3.6-35B-A3B på [Hugging Face](https://huggingface.co/unsloth/Qwen3.6-35B-A3B-GGUF)). Den tar 23 GB på disk, kjører i Ollama og styres gjennom Claude Code.

Den vant på fart, fordi Claude Code sender en stor kontekst på nytt i hver runde:

| Modell | Prefill, ca. 16k tokens | Decode | Minne ved 256K kontekst |
|---|---|---|---|
| `qwen3.6:35b` | 2 050 tokens/s (7,8 s) | ca. 69 tokens/s | 23 til 24 GB |
| `qwen3.8:27b-nvfp4` | 458 tokens/s (35 s) | ca. 46 tokens/s | 18 til 21 GB |
| `qwen3.8:27b-q8_0` | 370 tokens/s (43 s) | ca. 10 tokens/s | 46 GB |

Alle tre klarte de samme to kodeoppgavene, så kvaliteten skilte dem ikke fra hverandre. To oppgaver per modell er et lite utvalg.

Disse modellene har et innebygd kontekstvindu på 256K tokens. Med så stort vindu ble modellen svært treg hos meg, så Claude anbefalte å kutte konteksten for å få raskere svar. Den lagde en slank variant med 32K-vindu og lavere temperatur. Det var den jeg fløy med, og det lille vinduet var prisen jeg betalte for farten. Lagre dette som `Modelfile`:

```text
FROM qwen3.6:35b
PARAMETER num_ctx 32768
PARAMETER temperature 0.3
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.1
```

Bygg den og start Claude Code mot den mens du fortsatt har nett, så du får hentet grunnmodellen:

```bash
ollama pull qwen3.6:35b
ollama create qwen3.6:35b-lean -f Modelfile
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 ollama launch claude --model qwen3.6:35b-lean
```

`ollama launch claude` kobler Claude Code til den lokale Ollama-serveren for deg, uten at du trenger å sette miljøvariabler. `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` hindrer Claude Code i å gå på nettet etter oppdateringer og telemetri. Jeg pakket alt dette inn i et lite skript, `planemode`, som også starter Ollama-serveren, laster modellen på forhånd og laster den ut igjen når du avslutter, for å spare batteri.

Jeg er ikke sikker på at det var det beste valget. Det var det valget Claude kunne forsvare med tallene den hadde samlet inn.

## Hva du kan gjøre på flyet i stedet

Skriv, ikke kod. Lag utkast til planen, innlegget eller spesifikasjonen i en teksteditor som Notepad, TextEdit eller Notion, og gi det til en frontier-modell når du lander. Modellen jobber best på bakken, med kontekst du har forberedt i lufta.

{{< img src="/images/blog/2026-11-02-local-llm-on-a-plane/write-offline.jpg" alt="En laptop på et klappbord i et fly. Skjermen viser en enkel teksteditor med overskriften SPEC og en kort liste" caption="En spesifikasjon i en teksteditor bruker nesten ikke batteri." >}}

Det er mindre spennende enn en privat AI i sekken. Til gjengjeld virker det.

Flyturen tok meg til barndomshjemmet mitt i Portugal, der jeg jobbet en uke. Jeg lagde en video om det sammen med Claude: [se den på YouTube](https://youtu.be/BhXDzz7moYw).

## FAQ

### Kan jeg heller kjøpe Wi-Fi om bord?

På noen fly, ja. På Norwegian fra Faro til Oslo fikk jeg tilbud om nett for rundt 14 euro, hvis jeg husker riktig, og jeg takket nei. Den andre veien kunne jeg ikke kjøpe det i det hele tatt. Sjekk hva flyselskapet oppgir for din avgang før du regner med det.

### Kan jeg lade MacBooken fra en USB-port om bord?

Det kommer an på porten. Et USB-A-uttak på 15 watt holder ikke liv i en laptop som kjører en modell. Et sete med USB-C-port på 60 watt kan holde batteriet stabilt ved lett arbeid. Jeg testet ikke dette, fordi USB-kontaktene i Norwegian-setene mine ikke ga strøm.

### Kan jeg kjøre en LLM helt offline på en laptop?

Ja. Verktøy som Ollama kjører modellen på din egen maskin når den først er lastet ned. Om resultatet er nyttig for oppgaven din, er en annen sak, og det er det testen på ti minutter gir deg svar på.

### Hvor mye batteri bruker en lokal LLM?

Det kommer an på modellen, laptopen og oppgaven. Jeg har ingen målte tall fra flyturen min, og det er derfor testen over finnes. Mål ditt eget forbruk.

### Er en lokal modell god nok til koding?

Til små, tydelige endringer, noen ganger. Til arbeid i mange steg på tvers av et repo sier erfaringen min nei. Benchmark-tallene finner du i [aprilinnlegget](/nb/blog/2026-04-06-local-llms-are-not-there-yet/).

### Ville en annen modell gjort det bedre?

Muligens. Claude valgte denne ut fra sine egne tester, og jeg sammenlignet ikke alternativene selv.
