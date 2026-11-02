---
title: "Slutt å betale en frontier-modell for å lese nyhetene dine"
date: 2026-11-01
draft: false
description: "Mens jeg sover, leser PC-en min 60 nyhetssider og plukker ut det som betyr noe for jobben min. Slik bygger du din egen: kode, prompter og ingen API-regning."
excerpt: "PC-en min leser rundt 60 nyhetskilder hver natt og plukker ut de få sakene som betyr noe for jobben min. Du kan bygge det samme på en ettermiddag, og driften koster nesten ingenting."
tldr: "Du kan bygge et nyhetsfilter på din egen maskin på en ettermiddag, og en bunke saker du rangerer selv, viser deg om du kan stole på det. Den største lærdommen er hvilke jobber du bør holde unna de dyre modellene: lesing og sortering er småjobber, og en lokal modell gjør dem for prisen av strømmen. Filteret mitt er nå langt oftere enig med meg enn det første forsøket var, men utvalget er lite, så se på det som en magefølelse med et tall på."
categories: ["AI"]
tags: ["Local LLMs", "Decision Models", "News Filtering", "Spearman", "Ollama"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-01-local-models-news-filter/featured.jpg"
featuredAlt: "Et lite svart datatårn merket LOCAL ved siden av en trådkurv med papirlapper på et trebord, med én lapp løftet ut og merket MUST-READ 1.9"
imageCredit: "© Pedro Dias"
---

Klokka 02:30 hver natt leser PC-en min rundt 60 nettsider. Jeg sover. Om morgenen har den plukket ut de få sakene som betyr noe for jobben min, og modellene som gjorde utvalget, har aldri forlatt maskinen.

Det finnes ingen API-nøkkel og ingen faktura. Den eneste måleren som går, er strømmåleren i sikringsskapet, og lenger ned ser du hvor lite den snurrer.

Bak koden ligger en vane som er verdt mer enn selve koden: ikke gi en frontier-modell en jobb som en liten lokal modell klarer.

Du kan bygge det samme på en ettermiddag. Hvert steg nedenfor ender i noe du kan lime inn eller kjøre: et scoringsskript, en test som viser om det duger, og prompter til din egen Claude. Jeg tar også med de tre feilene som kostet meg en kveld, så du slipper å bruke din på dem.

## Hvorfor filtrere etter rolle

Jeg er Chief AI Officer i Tradesolution, et norsk programvareselskap som leverer til dagligvarebransjen. De fleste AI-nyheter er ikke skrevet for den jobben. En raskere brikke, en finansieringsrunde, en krangel om benchmarks: ekte nyheter, men de endrer ingenting på mandagen min. Flaskehalsen er å lese, ikke å finne.

Derfor henter pipelinen min rundt 60 kilder, kaster det som ikke handler om AI, oppsummerer resten og publiserer resultatet som [briefingen](/briefing/), en side jeg leser til kaffen.

Modellene kjører på min egen maskin. En lokal språkmodell kjører på din egen datamaskin og ikke på en leverandørs servere, så ingenting forlater maskinen, og ingenting faktureres per sak. Et token er den lille tekstbiten en modell leser eller skriver, og leverandørene tar betalt per tusen. Lokalt koster bare strømmen. Det endrer måten du designer på. Betaler du per token, pakker du 30 saker inn i én prompt og håper på det beste. Lokalt får hver sak sitt eget kall, du kan stille samme spørsmål to ganger, og du kan se etter duplikater når du vil. Et kall koster så lite at det forsvinner i avrundingen, så du slutter å telle.

Leselisten holder jeg også for meg selv, for det du leser, avslører hva du bekymrer deg for.

## Spar den store modellen til de store jobbene

Tar du med deg én ting fra dette innlegget, så la det være denne vanen, enten du bygger noe av koden eller ikke.

En frontier-modell er det beste en leverandør selger: den du betaler per token for, og den du vil sette på de vanskeligste problemene dine. Å lese en overskrift og avgjøre om den betyr noe, er ikke vanskelig. Det er heller ikke å skumme en byggelogg etter linjen som forteller hva som feilet, eller å plukke en pris ut av et avsnitt. Dette er lesejobber: kort tekst inn, ett lite svar ut. En modell på din egen PC gjør dem godt, også klokka 02:30, og uten at taksameteret går. Testen min nedenfor viser det for rangering av nyheter. Byggelogger har jeg ikke målt, men jobben er av samme slag, og testoppsettet nedenfor måler din.

Slik sorterer jeg arbeidet:

| Jobb | Hvor den kjører | Hvorfor |
|---|---|---|
| Score eller sorter korte tekster | Lokalt | Kort inn, ett tall ut, og du kan sjekke det mot din egen fasit. |
| Skumme bygge- eller testlogger etter linjen som betyr noe | Lokalt | Ren lesing, og du kan ta stikkprøver av svaret. |
| Hente felt ut av tekst, som priser, datoer og navn | Lokalt | Svaret er lite og lett å sammenligne med kilden. |
| «Handler disse to sakene om samme hendelse?» | Lokalt | Et ja-eller-nei-spørsmål. |
| Refaktorere på tvers av et repo, jakte på en feil gjennom fem lag, planlegge tjue steg | Frontier | Modellen må holde styr på mye gjennom mange avgjørelser. [Lokale modeller mister tråden der](/nb/blog/2026-04-06-local-llms-are-not-there-yet/). |
| Siste ord i alt som betyr noe | Hos deg | Modellen tar første runde. |

Smart betyr ikke billig. Det betyr riktig verktøy til jobben. Å sette en frontier-modell på en sorteringsjobb er som å la en kirurg åpne posten: det går fint, men du betaler kirurgtakst.

To forbehold. Produksjonslogger kan inneholde kundedata, så sjekk selskapets regler før en modell leser dem, lokal eller ikke. Og ikke ta mitt ord for hvilke jobber som er små: bruk dine egne tall. Testen med 30 saker nedenfor gir deg grønt lys. Jeg har ikke kjørt en frontier-modell på mine 30 saker, så jeg vet ikke hvor langt foran den ville ha havnet. Prøv på dine egne. Score de samme sakene med en modell i skyen, sammenlign de to Spearman-tallene, og er forskjellen liten, har du funnet en jobb du kan slutte å betale for.

Lim dette inn i Claude for å finne slike jobber i din egen uke:

```text
Below is a list of the tasks I currently send to a frontier model. Sort each one into LOCAL FIRST or FRONTIER. LOCAL FIRST means the input is short, the answer is one of a few options or a short extraction, and I can check the result against labels or by eye. FRONTIER means the task needs many dependent steps, a long context, or open-ended writing. For each LOCAL FIRST task, write a five-item test I can run: what to feed it, what a correct answer looks like, and what score would make me trust it. If a task touches customer data, flag it and tell me to check my company's rules first. Tasks: [paste your list]
```

## Få detaljene på plass først

Et godt filter står og faller på detaljene. Her er tre av mine:

**Sikkerhetsvarsler havner øverst, og ingen modell får bestemme over dem.** Et sikkerhetsvarsel er en melding om at en programvare har et hull som noen allerede utnytter. Tenk på en tilbakekalling av en matvare: den vil du se før alt annet, selv om du ikke er sikker på at du kjøpte varen. Mine kommer fra to offentlige kilder, [NSMs varsler](https://nsm.no/rss/sarbarhetsvarsler-fra-nsm/) og den amerikanske [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)-listen. Faste regler avgjør hva som når frem til meg. Akkurat her vil jeg ikke ha gjetting.

Her er CISA-listen som et skript på ti linjer. Det skriver ut alle hull som er lagt til listen de siste sju dagene:

```python
from datetime import date, timedelta

import httpx

URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
cutoff = (date.today() - timedelta(days=7)).isoformat()

for v in httpx.get(URL, timeout=30, follow_redirects=True).json()["vulnerabilities"]:
    if v["dateAdded"] >= cutoff:
        print(v["dateAdded"], v["cveID"], v["vendorProject"], v["product"])
```

Kjør det én gang og se hvor mye som kommer ut. Er det mer enn du orker å lese, snevrer du det inn til produktene du kjører. Den innsnevringen kan bare du gjøre.

{{< img src="/images/blog/2026-11-01-local-models-news-filter/recall-shelf.jpg" alt="En rød varseltrekant på en butikkhylle, over en lang etikett med teksten SECURITY WARNING" caption="Tilbakekallingen du vil se før alt annet." >}}

**Regn om tallene, så du slipper.** Et verktøy koster 20 dollar i måneden, og en leveringsdrone flyr 10 engelske mil. Slikt regner du ikke om i hodet, så du hopper over det. Pipelinen min setter et kronebeløp ved siden av hvert beløp i utenlandsk valuta og gjør om alle mål til metriske enheter. Én regel er viktig: hopp aldri over et beløp fordi skrivemåten er uklar. Et dollartegn alene betyr amerikanske dollar. En omregner som hopper over enkelte valutaer, er ikke verdt å ha.

Du kan prøve ideen i dag uten å skrive kode. Lim dette inn i Claude, og legg til noen saker fra din egen feed:

```text
Rewrite the news items below for a reader in Norway. Put every amount in a foreign currency into NOK in parentheses after the original, for example "$20 a month (X kr)". Convert imperial units to metric. Convert every time to Oslo time. Never skip an amount because the notation is vague; a bare "$" means US dollars. Tell me which exchange rate and date you assumed, because you can't see live rates. Keep everything else word for word.
```

Bytt ut «Norway» og «NOK» med dine egne. Kontroller kursen modellen oppgir. Den ville jeg aldri stolt blindt på.

**La koden ta seg av tidssonene.** Ikke be en modell regne om klokkeslett. Bruk standardbiblioteket:

```python
from datetime import datetime
from zoneinfo import ZoneInfo

t = datetime(2026, 11, 3, 9, 0, tzinfo=ZoneInfo("America/Los_Angeles"))
print(t.astimezone(ZoneInfo("Europe/Oslo")).strftime("%H:%M"))  # 18:00
```

Bytt datoen til 28. oktober 2026, og det skriver ut 17:00. USA og Europa stiller om til og fra sommertid på ulike datoer, så i rundt tre uker om våren og én uke om høsten er forskjellen mellom Pacific-tid og Oslo-tid åtte timer, ikke ni. En modell gjetter på forskjellen. `zoneinfo` vet den.

## Ett spørsmål, tre nivåer

Den første versjonen av utvalget mitt ba en generell modell plukke favoritter fra en nummerert liste. Det fungerte, og jeg ville vite hvor godt. Den andre versjonen bruker en beslutningsmodell (decision model). En slik modell skriver ikke tekst. Den svarer på et spørsmål om en tekst med en sannsynlighet for hvert nivå du har definert, og gir deg det forventede nivået tilbake. Jeg skrev om en beslektet idé i [Jev-eksperimentet](/nb/blog/2026-09-19-jev-before-the-waitlist/): still en modell et spørsmål av en bestemt type, og få en score tilbake.

Jeg stiller ett spørsmål per sak: «Hvor viktig er det å løfte frem denne saken for denne leseren?» Svarene er tre nivåer i stigende rekkefølge: 0 for ikke verdt å løfte frem, 1 for verdt å nevne, 2 for må leses. Modellens sannsynligheter for de tre nivåene blir til en score mellom 0 og 2. Det er dette jeg liker best: du får en skala, ikke en dom. En sak på 1,9 og en på 1,1 er begge «relevante», men du ser hvilken som vinner.

Det er i nivåene og beskrivelsen av leseren at skjønnet ditt kommer inn. Vil du ikke skrive dem fra bunnen av, kan du lime dette inn i Claude:

```text
I want to build a filter that scores news stories for one specific reader: me. Interview me to write the scoring prompt. Ask one question at a time and wait for my answer. Cover my role, the decisions I make in a typical month, what I already follow, and what I never want to see. After at most eight questions, write:

1. PROFILE: three sentences describing the reader, in third person.
2. LEVELS: an ordered list of three levels, 0 to 2, from "not worth highlighting" to "must-read". One sentence each, naming concrete topics, so that a small local model can apply them without guessing.
3. TEST STORIES: five invented headlines with a one-line summary each, and the level you'd expect for each. Make one of them sit on the border between two levels.

Do not praise my answers. Keep the output ready to copy.
```

Kjør deretter scoringsskriptet. Denne versjonen fungerer med alle chatmodeller i Ollama som returnerer token-sannsynligheter. Jeg testet den med `qwen3:8b` på Ollama 0.40.13:

```python
import math

import httpx

OLLAMA = "http://127.0.0.1:11434"
MODEL = "qwen3:8b"
PROFILE = (
    "The reader is the Chief AI Officer of a Norwegian software company that "
    "serves grocery retailers. They want news that changes what they should "
    "know or do about AI."
)
LEVELS = {
    "0": "Not worth highlighting: off-topic, minor, or not about AI.",
    "1": "Worth a mention: relevant, but not a must-read.",
    "2": "Must-read: directly relevant to the reader's work or decisions.",
}


def score(story: str) -> float:
    levels = "\n".join(f"{k} = {v}" for k, v in LEVELS.items())
    prompt = (
        f"{PROFILE}\n\nHow worth highlighting is this story for this reader?\n"
        f"{levels}\n\nStory:\n{story}\n\nAnswer with one digit."
    )
    r = httpx.post(
        f"{OLLAMA}/api/chat",
        json={
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "think": False,
            "stream": False,
            "logprobs": True,
            "top_logprobs": 10,
            "options": {"temperature": 0, "num_predict": 1},
        },
        timeout=120,
    )
    r.raise_for_status()
    top = r.json()["logprobs"][0]["top_logprobs"]
    p = {t["token"].strip(): math.exp(t["logprob"]) for t in top if t["token"].strip() in LEVELS}
    return sum(int(k) * v for k, v in p.items()) / sum(p.values())
```

Tre overskrifter kjørt gjennom skriptet ga dette:

| Overskrift | Score |
|---|---|
| EU AI Office publishes guidance on high-risk AI systems used in retail pricing | 2,00 |
| Chipmaker unveils faster GPU for gaming laptops | 0,00 |
| Tech start-up raises $40 million for a robot that folds laundry | 0,02 |

Scorer nær null varierer med noen hundredeler fra kjøring til kjøring. Den tredje overskriften landet mellom 0,01 og 0,05 i mine kjøringer. Trikset er `num_predict: 1`. Du vil ikke at modellen skal skrive et svar. Du vil ha sannsynlighetene den gir det første tokenet, og det forventede nivået regnes ut fra dem.

I produksjon kaller jeg i stedet en beslutningsmodell gjennom Ollamas `/v1/systemone`-endepunkt. Samme spørsmål, samme nivåer, men modellen returnerer sannsynlighetene selv:

```python
payload = {
    "model": "<your decision model>",
    "state": story,
    "questions": {
        "q": {
            "type": "score",
            "instructions": instructions,
            "criteria": ["Not worth highlighting.", "Worth a mention.", "Must-read."],
        }
    },
}
r = httpx.post("http://127.0.0.1:11434/v1/systemone", json=payload, timeout=60)
print(r.json()["answers"]["q"]["score"])
```

Svaret inneholder også `probabilities` per nivå og en `confidence`-verdi. Jeg har ikke sammenlignet denne veien med logprobs-versjonen på mine 30 saker, så jeg kan ikke si hvilken som vinner.

Seks linjer gjør scorene om til et utvalg. Den beste saken i en kategori kommer alltid med. Opptil to til kommer med hvis de scorer minst 1,0. Hele kategorien kommer aldri med:

```python
def picks(scored, max_picks=3, threshold=1.0):
    ranked = sorted(scored, key=lambda p: p[1], reverse=True)
    limit = min(max_picks, len(ranked) - 1) or 1
    chosen = [ranked[0]]
    for story, s in ranked[1:]:
        if len(chosen) >= limit or s < threshold:
            break
        chosen.append((story, s))
    return chosen
```

Én regel til hindrer at én stor lansering tar alle plassene: før en sak nummer to slipper inn, spør du modellen «Do Story A and Story B report on the same news event, announcement or release?», og hopper over saken hvis svaret er ja.

## Regningen er strøm

Maskinvaren var ikke gratis. Jeg har sagt før at [riggen min kostet mer enn et års abonnement](/nb/blog/2026-04-06-local-llms-are-not-there-yet/). Denne delen handler om marginalkostnaden: hva én sak til koster når maskinen først står der.

Jeg målte den med `qwen3:8b` på et RTX 5090, med en testsak som var utvidet til rundt 250 prompt-tokens, instruksjonene medregnet. Tallene:

- Hver sak tok 0,49 sekunder. Tusen saker tar rundt åtte minutter.
- GPU-en brukte i snitt 68 W under scoring, mot 64 W i hvile (`nvidia-smi`, bare GPU). Regner du med hvileforbruket også, bruker tusen saker høyst 0,01 kWh.

Til sammenligning: å koke 300 ml vann til te tar rundt 0,03 kWh. Å score tusen saker koster altså om lag en tredjedel av en kopp te. Regner du med hele PC-en og ikke bare GPU-en, la oss si 300 W, havner du nærmere en kopp og litt til. Resten av nattkjøringen min, med henting og oppsummering, tok mellom 8 og 21 minutter fem netter i slutten av oktober.

Regn ut hva din egen kjøring koster. Lagre scoringsskriptet over som `score.py`, legg dette i samme mappe, og bytt ut de to konstantene med dine egne tall. En smartplugg med strømmåling gir deg wattallet:

```python
import time

from score import score

WATTS = 300          # your machine under load: read it off a smart plug
PRICE_PER_KWH = 1.0  # what a kWh costs you, in your currency

stories = ["EU AI Office publishes guidance on high-risk AI systems used in retail pricing."] * 20

start = time.time()
for story in stories:
    score(story)
seconds = (time.time() - start) / len(stories)

kwh_per_1000 = WATTS * seconds * 1000 / 3_600_000
print(f"{seconds:.2f} s per story, {kwh_per_1000:.4f} kWh per 1,000 stories, cost {kwh_per_1000 * PRICE_PER_KWH:.4f}")
```

Med 0,45 sekunder per sak (den korte overskriften over) og anslagsvis 300 W skriver skriptet ut rundt 0,04 kWh per tusen saker. Se på GPU-tallet som et minimum og tallet fra stikkontakten som det du faktisk betaler.

## Finn ut om det virker

At en metode føles bedre, beviser ingenting. Du trenger et tall, og det kan du få på omtrent en halvtime.

Lag din egen fasit: gi 30 saker 0, 1 eller 2 før du ser noe av det modellen har svart. Sammenlign deretter fasiten med scorene. Til det bruker du Spearmans korrelasjon, et mål på hvor godt to rangeringer stemmer overens. Si at du og en venn rangerer fem restauranter hver, fra best til dårligst. Lik rekkefølge gir 1. Rekkefølger uten noe felles mønster gir 0.

{{< img src="/images/blog/2026-11-01-local-models-news-filter/thirty-cards.jpg" alt="To rader hvite kort med håndskrevne sifre 0, 1 og 2. Den øverste raden er merket ME, den nederste MODEL, og en hånd flytter et kort." caption="Min fasit øverst, modellens score under. Spearman måler hvor godt de to radene stemmer overens." >}}

Lagre fasiten som `labels.csv` (`id,label`) og scorene som `scores.csv` (`id,score`), og kjør dette:

```python
import csv
import random
import statistics

from scipy.stats import spearmanr

labels = {r["id"]: float(r["label"]) for r in csv.DictReader(open("labels.csv", encoding="utf-8"))}
scores = {r["id"]: float(r["score"]) for r in csv.DictReader(open("scores.csv", encoding="utf-8"))}
ids = sorted(labels.keys() & scores.keys())


def rho(sample):
    return spearmanr([labels[i] for i in sample], [scores[i] for i in sample])[0]


spread = statistics.pstdev(scores[i] for i in ids)
boot = sorted(rho(random.choices(ids, k=len(ids))) for _ in range(5000))
print(f"n={len(ids)}  score spread={spread:.2f}")
print(f"rho={rho(ids):.2f}  95% interval {boot[125]:.2f} to {boot[4875]:.2f}")
```

Linjen `score spread` står ikke der til pynt. Viser den noe nær null, gir scoringsskriptet samme svar på alle saker, og rho-verdien over betyr ingenting. Mer om det straks.

Mine tall: den gamle metoden, der modellen plukket fra en liste, fikk 0,39 mot fasiten min. Beslutningsmodellen fikk 0,77. På AI-sakene alene fikk den 0,70. Les 0,39 som svak enighet og 0,77 som sterk, men ikke perfekt.

To forbehold gjelder for disse tallene, og for dine.

- **30 saker er et lite utvalg.** En rho på 0,77 på 30 saker har et 95 prosent konfidensintervall på omtrent 0,55 til 0,89. Det har jeg regnet ut selv med den vanlige Fisher-tilnærmingen. Det er ikke en ny analyse av dataene mine.
- **Jeg målte på de samme sakene som jeg justerte etter.** Jeg prøvde mer enn én modell og satte terskelen for utvalget på øyemål, begge deler på de samme 30 sakene. 0,77 er det beste resultatet på en eksamen der jeg skrev fasiten selv. Gjør det bedre: lag fasit for 30, juster på 15, og rapporter resultatet for de andre 15.

## Tre feil som kostet meg en kveld

**Hver sak fikk samme score.** Første gang jeg kjørte beslutningsmodellen, ga den samme svar på alt. Endepunktet forventer feltene `instructions` og `criteria`. Jeg hadde brukt andre navn, og endepunktet overså dem uten et pip. Linjen `score spread` over er der på grunn av denne feilen.

**Modellen tenkte seg tom for tokens.** Fra og med Ollama 0.40 tenker `qwen3`-modellene som standard. Tankerekken spiste opp `num_predict`-budsjettet før JSON-svaret i det hele tatt begynte. Send `"think": false` i hvert kall, slik scoringsskriptet over gjør.

**Halve modellen havnet på CPU-en.** Ollama lastet modellen med 262k tokens kontekst og presset en del av den ut av GPU-en. Den lengste prompten jeg sender, er på rundt 4 200 tokens, så jeg satte `num_ctx` til 8192, og da holdt hele modellen seg på GPU-en. Kjør `ollama ps` og se på kolonnen `PROCESSOR`. En fordeling som 70 prosent CPU og 30 prosent GPU betyr at en del av modellen ikke fikk plass i videominnet. Hos meg skyldtes det en kontekst som var større enn jeg trengte.

## Bygg det hele med Claude Code

Sett det sammen i en tom mappe. Lim dette inn i Claude Code, fyll inn feedene dine, og ha PROFILE og LEVELS klare i en fil som heter `profile.txt`:

```text
Build a small news-scoring harness in this empty folder. Python 3.12, httpx and scipy only. Ollama runs at http://127.0.0.1:11434 and qwen3:8b is already pulled.

1. items.csv: fetch the latest 40 items from these RSS feeds [paste 3 to 5 feed URLs] and write id, title, summary. Use the link as id. Strip HTML from summaries.
2. label.py: a terminal tool. It shows one item at a time, in random order, with no model output visible. I type 0, 1 or 2 (0 = not worth highlighting, 1 = worth a mention, 2 = must-read). It appends to labels.csv and resumes where I stopped. It stops after 30 labels.
3. score.py: for each item, call /api/chat with think=false, temperature 0, num_predict 1, logprobs=true and top_logprobs=10. Ask "How worth highlighting is this story for this reader?" with the PROFILE and LEVELS from profile.txt. Take the probabilities of the tokens "0", "1" and "2", renormalize them, and write the expected level to scores.csv.
4. eval.py: join labels.csv and scores.csv on id. Print n, the standard deviation of the scores, Spearman rho (scipy), and a 95% bootstrap interval from 5000 resamples. If the standard deviation is below 0.05, print a warning that the scorer is probably not seeing the story.
5. Split the labeled items at random into a tuning half and a test half and print rho for each half separately.

Run each script on five items to check it works before you move on. Do not write any other files.
```

Fasit først, score etterpå, og ingen titting. Den rekkefølgen er hele eksperimentet.

## Hva 0,77 ikke beviser

Tallet mitt sier at den nye metoden er enig med meg på 30 saker. Det sier ikke at modellen finner alt jeg trenger, for en sak den rangerer lavt, kan være en jeg ville ha hatt. Det sier heller ikke at tallet holder en annen uke, på andre temaer eller for en annen leser. Og det ble målt på de samme sakene jeg justerte etter, så en ny runde saker vil trolig score lavere.

Den lille modellen tar første runde. Jeg tar den siste. Den store modellen får jobbene som trenger en stor modell.

## FAQ

### Trenger jeg en beslutningsmodell til dette?

Nei. Logprobs-varianten av scoringsskriptet fungerer med alle chatmodeller i Ollama som returnerer token-sannsynligheter. Jeg testet den med `qwen3:8b` på Ollama 0.40.13. Returnerer ikke serveren din sannsynligheter, kan du be om sifferet fem ganger med temperatur 0,7 og ta gjennomsnittet av svarene. Den varianten gir mer støy, og den har jeg ikke testet.

### Når trenger jeg fortsatt en frontier-modell?

Når jobben består av mange steg som avhenger av hverandre, krever lang kontekst eller handler om fri skriving. Jeg har sett lokale modeller miste tråden når de skal refaktorere på tvers av et repo, spore en feil gjennom flere lag eller planlegge tjue steg frem. Kan du ikke skrive ned hvordan et riktig svar ser ut, er det som regel også en frontier-jobb.

### Er en lokal modell gratis?

Maskinvaren er ikke gratis. Selve modellen koster strøm per sak: på maskinen min høyst 0,01 kWh for GPU-en per tusen saker, og rundt 0,04 kWh hvis du regner med en hel PC på 300 W. Om det lønner seg mer enn et API i skyen, kommer an på hva du allerede eier og hvor mange saker du scorer. Har du ikke en kraftig GPU, ser regnestykket annerledes ut.

### Hvor mange saker må jeg lage fasit for?

Tretti gir deg et grovt tall med et bredt intervall, omtrent 0,55 til 0,89 rundt en rho på 0,77. Seksti snevrer det inn til omtrent 0,63 til 0,86 ved samme rho.

### Hva betyr en Spearman-score på 0,77?

Spearmans korrelasjon sammenligner to rangeringer og gir et tall fra -1 til 1. Verdien 1 betyr at rangeringene er like, 0 at ikke noe mønster knytter dem sammen, og -1 at den ene er det stikk motsatte av den andre. Ved 0,77 er du og modellen enige om det meste av rekkefølgen, men ikke alt.

### Hvor kan jeg lese briefingen?

På [/briefing](/briefing/). Den oppdateres daglig.
