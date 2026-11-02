---
title: "Lokale LLM-er er ikke der ennå"
date: 2026-04-06
draft: false
description: "128 GB RAM, 32 kjerner og et RTX 5090. Til koding når lokale LLM-er fortsatt ikke Claude Code til knærne. Her er hva lokalt faktisk duger til."
excerpt: "Jeg kjører en av de kraftigste AI-maskinene du kan bygge av forbrukerdeler i dag. Lokale modeller til bildegenerering? Utmerket. Til koding, sammenlignet med noe som Claude Code? Ikke i nærheten. Her er min ærlige gjennomgang."
readTime: "5 minutters lesing"
categories: ["AI"]
tags: ["Ollama", "Local LLMs", "Claude", "Image Generation", "Qwen", "Gemma"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-04-06-local-llms-are-not-there-yet/featured.jpg"
featuredAlt: "En kraftig arbeidsstasjon som gløder i mørket, omgitt av varmen fra GPU-en"
imageCredit: "© Pedro Dias"
---

Arbeidsstasjonen min har 128 GB RAM, en AMD Threadripper med 32 kjerner og et RTX 5090. Det er ingen beskjeden maskin. Når jeg starter [Ollama](https://ollama.com) og laster inn en lokal modell, får den alle ressursene den kan ønske seg.

Til koding holder det likevel ikke på langt nær.

Gapet er avgrenset. Vet du hvor det går, vet du også hvor du bør bruke tid og penger.

## Hva lokale modeller er utmerket til

Det er på bildegenerering lokal maskinvare tjener inn pengene. [ComfyUI](https://github.com/comfyanonymous/ComfyUI) på et RTX 5090 er raskt, privat og gratis når det først er satt opp. Ingen bruksgrenser og ingen pris per bilde. Du får mer kontroll over finjustering, LoRA-er og arbeidsflyter enn noen skytjeneste gir deg. Hvert eneste bilde på denne bloggen er laget på den maskinen.

## Der lokale modeller kommer til kort

Gapet er ikke like stort overalt. Det skillet er viktig.

De beste modellene du kan kjøre lokalt i dag, er [Qwen3-Coder-Next](https://qwenlm.github.io/blog/qwen3-coder/) (MoE med 80B parametere totalt og 3B aktive, kontekstvindu på 262K) og Googles [Gemma 4 31B](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/), som kom 2. april. På [LiveCodeBench v6](https://livecodebench.github.io/), en benchmark i konkurranseprogrammering som er laget for å motstå datasettkontaminering, får Gemma 4 31B 80,0 prosent. Claude får rundt 76 prosent på samme benchmark. Der vinner lokal.

Så hvorfor bruker jeg fortsatt [Claude Code](https://claude.ai/code) når jobben skal gjøres?

Fordi LiveCodeBench måler kodegenerering i isolasjon. Du får et problem, skriver en funksjon og er ferdig. Slik foregår ikke programvareutvikling. [SWE-bench Verified](https://www.swebench.com/) ligger nærmere virkeligheten. Der får modellene ekte GitHub-saker og skal rette koden på tvers av et helt repo. På SWE-bench havner modellene du kan kjøre lokalt, på rundt 70-72 prosent. Claude ligger på omtrent 80 prosent. Det er de 8-10 prosentpoengene du merker hver dag.

**Resonnering i flere steg.** Når du refaktorerer en tjeneste eller leter etter grunnen til at en test er ustabil gjennom tre abstraksjonslag, må du holde styr på mye tilstand gjennom mange beslutninger. Det er nettopp dette SWE-bench-gapet måler. Frontier-modellene klarer det pålitelig. Lokale modeller mister tråden.

**Agentisk sammenheng.** Claude Code kan legge en plan over tjue steg, gå tilbake når noe ryker, og gjøre seg ferdig. Lokale modeller mister den røde tråden og lager resultater som ser troverdige ut, men som ikke passer inn. Du ender opp med å gå gjennom og rette alt, og da forsvinner hele poenget.

Ingenting av dette er kritikk av teamene bak Qwen, Gemma eller [DeepSeek](https://www.deepseek.com/). Gemma 4-lanseringen er en reell seier for det åpne økosystemet. Men modellene er ikke på frontier-nivå i agentisk kodearbeid, og det er nettopp det Claude Code driver med.

## Der lokale modeller hører hjemme i kodearbeidsflyten din

Claude Code kan bruke Ollama som modell-backend. Jeg kjører `gemma4:26b-a4b-it-q4_K_M` og `gemma4:e4b` lokalt, og Claude Code kan starte agentteam som bruker dem.

{{< img src="/images/blog/2026-04-06-local-llms-are-not-there-yet/ollama-list.jpg" alt="Utskrift fra ollama list i terminalen, med to Gemma 4-modeller" caption="De to Gemma 4-modellene jeg kjører lokalt i Ollama." >}}

Det endrer regnestykket. Med Ollamas kompatibilitetslag for Anthropic-API-et (v0.14+) kan du peke Claude Code rett mot en lokal modell:

```bash
ollama launch claude --model gemma4:26b-a4b-it-q4_K_M
```

Til lettere deloppgaver, som å oppsummere en fil, lage et raskt testskjelett eller forklare hva en funksjon gjør, er en lokal Gemma 4-modell rask og privat, og den koster ingenting per token. Du kan sende det billige arbeidet til den lokale modellen og spare Sonnet eller Opus til resonneringen som virkelig trenger dem.

Dette innlegget ble gjennomgått og rettet med nettopp dette oppsettet.

## Regnestykket taler ikke for maskinen

Claude Code koster noen dollar om dagen ved vanlig bruk. RTX 5090-kortet mitt kostet langt mer enn et års abonnement. Hvis kodeproduktivitet var hovedmålet, ville regnestykket pekt mot API-et hver gang.

Maskinen betaler seg gjennom bildegenerering, private eksperimenter, at sensitiv kode slipper å gå til eksterne tjenester, og friheten til å kjøre hvilken modell eller pipeline jeg vil uten å spørre noen om lov. Det er reelle verdier. Kodeproduktivitet står ikke på listen.

## Hva jeg ville sagt til den som vurderer dette

Bygger du en maskin først og fremst for å kjøre lokale LLM-er til koding, så ikke forhast deg. Maskinvaren tetter ikke gapet mellom modeller med åpne vekter og frontier-modellene. Det gapet handler om regnekraft til trening, data og forskningsinvesteringer. Mer RAM eller en større GPU på skrivebordet løser ingenting av det.

Bygger du for bildegenerering, lokal lyd, private eksperimenter eller for å holde sensitive data unna tredjepartsinfrastruktur, kan investeringen forsvares. Bruksområdene er reelle.

Modellene blir bedre. Gapet krymper. Men per tidlig 2026 er «lokal» og «frontier» fortsatt to ulike klasser når det gjelder koding, og later du som noe annet, koster det deg tid.

## Skiftet som betyr mer enn benchmarkene

Benchmarkdebatten tar oppmerksomheten bort fra noe mer grunnleggende: utviklerrollen er i endring.

Jobben er ikke lenger å skrive kode. Jobben er å forstå virksomheten godt nok til å beskrive hva programvaren skal gjøre, og så la Claude ta seg av implementeringen. Du eier fortsatt arkitekturen: du velger stakken, språket og mønstrene. Det skjønnet krever fortsatt erfaring. Men derfra er det Claude som bygger.

Dette er ingen degradering. En utvikler som kan hente ut det egentlige kravet fra en samtale om produktet, velge riktig arkitektur og styre Claude presist, er mer verdt enn en som skriver hver linje for hånd. Å skrive for hånd var aldri poenget.

Bruk mer tid på forretningsdomenet ditt. Forstå hvorfor systemet finnes, hva det koster når det svikter, og forskjellen på hva brukerne faktisk gjør og hva spesifikasjonen sier. Det er det du tar med deg inn i samtalen. Jo bedre du beskriver i forretningstermer hva som må skje, desto bedre blir det Claude leverer.

Gapet mellom en modell med 70 prosent og en med 80 prosent på SWE-bench betyr mindre enn gapet mellom en utvikler som kan formulere krav tydelig, og en som ikke kan det.

## FAQ

**Hvilke lokale modeller kommer nærmest frontier-nivå i koding akkurat nå?**
Qwen3-Coder-Next og Googles Gemma 4 31B (lansert 2. april 2026) er de sterkeste alternativene. På LiveCodeBench v6 scorer Gemma 4 31B faktisk høyere enn Claude. På SWE-bench Verified, som bygger på ekte oppgaver fra programvareutvikling, ligger modeller du kan kjøre lokalt, på rundt 70-72 prosent, mot omtrent 80 prosent for Claude. Gapet ligger nettopp i agentisk arbeid i flere steg, ikke i å skrive enkeltfunksjoner.

**Finnes det et maskinvarenivå der lokale kodemodeller blir konkurransedyktige?**
Ikke ennå. Flaskehalsen er ikke rå regnekraft, men selve modellvektene og forskningsinvesteringene som skapte dem. En treningskjøring lar seg ikke slå med mer RAM.

**Hva betyr «bildegenerering» egentlig her?**
Pipelines for bildegenerering som kjører lokalt i ComfyUI. RTX 5090 tar store modeller og høye oppløsninger uten å svette. Det som ville tatt minutter på et kort i mellomklassen, tar sekunder.

**Kommer dette til å endre seg?**
Ja. Gemma 4-lanseringen tyder på at gapet på isolerte kodeoppgaver allerede er tettet. Gapet som gjenstår, ligger i agentisk arbeid i flere steg. Om det tettes om 12 måneder eller 36, er uklart. Bruk SWE-bench som signal, ikke LiveCodeBench.
