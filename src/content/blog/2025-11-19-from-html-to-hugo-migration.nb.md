---
title: "Fra håndskrevet HTML til Hugo: en migreringshistorie"
date: 2025-11-19
draft: false
description: "Slik flyttet jeg digitaldias.com fra egen HTML/CSS/JS til Hugo sammen med GitHub Agent, og så hvordan AI som samarbeidspartner forandrer måten jeg skriver på."
excerpt: "I september 2024 kodet jeg et porteføljenettsted for hånd. To måneder senere gikk det et lys opp for meg under en YouTube-video: statiske sidegeneratorer + AI-agenter = arbeidsflyten for innhold jeg hadde savnet siden jeg overlot WordPress til hackerne."
readTime: "8 minutters lesing"
categories: ["Architecture", "DevOps"]
tags: ["Hugo", "Static Sites", "AI", "GitHub Agent", "Migration", "Web Development", "Chocolatey"]
author: "Pedro Dias"
---

<div class="toc-wrapper">
  <div class="toc-header">
    <h2>Innholdsfortegnelse</h2>
  </div>
  <nav class="toc-content">
    <ol>
      <li><a href="#the-revelation">Åpenbaringen: statiske generatorer + AI = frihet til å skrive</a>
        <ul>
          <li><a href="#wordpress-scars">Arrene etter WordPress</a></li>
          <li><a href="#hand-coded-interlude">Mellomspillet med håndskrevet kode</a></li>
          <li><a href="#youtube-epiphany">YouTube-øyeblikket</a></li>
        </ul>
      </li>
      <li><a href="#why-hugo">Hvorfor Hugo? (og hvordan du faktisk installerer det)</a>
        <ul>
          <li><a href="#selection-criteria">Utvalgskriteriene</a></li>
          <li><a href="#installing-hugo">Installere Hugo på Windows (den riktige måten)</a></li>
        </ul>
      </li>
      <li><a href="#migration-process">Migreringen: AI som medarkitekt</a>
        <ul>
          <li><a href="#phase-1">Fase 1: kartlegging og planlegging</a></li>
          <li><a href="#phase-2">Fase 2: grunnoppsett</a></li>
          <li><a href="#phase-3">Fase 3: innholdsmigrering</a></li>
          <li><a href="#phase-4">Fase 4: interaktive funksjoner</a></li>
        </ul>
      </li>
      <li><a href="#results">Resultatene: gevinster utover forventning</a></li>
      <li><a href="#what-i-learned">Hva jeg lærte: AI som migreringspartner</a></li>
      <li><a href="#recommendations">Anbefalinger for din migrering</a></li>
      <li><a href="#bottom-line">Konklusjonen</a></li>
      <li><a href="#getting-started">Kom i gang: hurtigstart</a></li>
    </ol>
  </nav>
</div>

I september 2024 gjorde jeg noe herlig gammeldags: jeg kodet hele porteføljenettstedet mitt for hånd. Egen HTML, 2 132 linjer CSS, interaktiv JavaScript. Hele pakken. Det var deilig å ha full kontroll, men jeg tenkte ikke langt fram.

**Deretter så jeg en YouTube-video om statiske sidegeneratorer.**

Plutselig falt brikkene på plass. Jeg hadde brukt Jekyll for flere år siden uten helt å forstå hva det var, bare enda et verktøy i stakken. Nå, med moderne verktøy i hverdagen, så jeg sammenhengen: **statiske sidegeneratorer begrenser deg ikke, de setter deg fri.**

Her kommer Hugo, Chocolatey og GitHub Agent inn i bildet. Dette er historien om hvordan et to måneder gammelt, håndkodet nettsted ble en innholdsmaskin gjennom samarbeid med AI.

## Åpenbaringen: statiske generatorer + AI = frihet til å skrive {#the-revelation}

### Arrene etter WordPress {#wordpress-scars}

La meg ta det fra begynnelsen. Før jeg kodet alt for hånd, drev jeg blogger på WordPress. Du vet hvordan det er:
- Stadige sikkerhetsoppdateringer
- Sårbarheter i plugins
- Forsøk på å bryte seg inn i databasen
- Den kvalmende følelsen når du logger inn og ser «Your site may be hacked»

**Til slutt ga jeg opp bloggingen** fordi vedlikeholdet veide tyngre enn skrivegleden. Hackerne vant.

### Mellomspillet med håndskrevet kode {#hand-coded-interlude}

Spol fram til september 2024. Jeg bestemte meg for å bygge alt på nytt fra grunnen av: ren HTML, CSS og JavaScript. Ingen CMS, ingen angrepsflate, ingen filer å hacke. Det fungerte utmerket ... for en portefølje.

Men til blogging? Å skrive rå HTML var som å kode med grytevotter på:
- Hvert avsnitt pakket inn i `<p>`-tagger
- Manuelle oppdateringer av bloggindeksen
- Ingen RSS-feed
- Ingen kategorier eller tagger
- Ingen automatisk sitemap

**Friksjonen var reell.** Jeg bygde et vakkert nettsted og unngikk så å skrive på det, fordi det var så tungvint.

### YouTube-øyeblikket {#youtube-epiphany}

Så snublet jeg over en video som forklarte statiske sidegeneratorer (jeg husker ærlig talt ikke hvilken, takk for det, YouTube-algoritmen). Videoskaperen viste hvordan Jekyll gjorde Markdown om til HTML.

**Det gikk et lys opp for meg:** «Vent, jeg har jo brukt Jekyll før, og skjønte ikke at det var dette det gjorde?»

Poenget var ikke bare statiske generatorer. Poenget var **ansvarsdeling**:
- Skriv innholdet i Markdown (fokus på ideene)
- La generatoren ta seg av HTML (fokus på strukturen)
- Publiser statiske filer (sikkerhet gjennom enkelhet)

Og så kom den andre åpenbaringen: **hva om jeg kombinerte Hugo med AI?** Ikke bare til migreringen, men til *skrivingen videre*. AI kunne hjelpe meg å skrive raskere, holde fokus og slippe å tenke på Markdown-syntaks og front matter.

## Hvorfor Hugo? (og hvordan du faktisk installerer det) {#why-hugo}

### Utvalgskriteriene {#selection-criteria}
Slik gikk vurderingen min, rett fram:

**Rammeverk jeg vurderte**
- Hugo (fart + enkelhet)
- Next.js (React-økosystemet)
- Nuxt (Vue-økosystemet)
- 11ty (fleksibilitet)

**Hvorfor Hugo skilte seg ut**
- Leveres som én enkelt binærfil
- Bygger nettstedet på under ett sekund (millisekunder, ikke sekunder)
- Trenger ingen Node.js-runtime
- Innebygde taksonomier, sitemap og RSS
- Passer godt til publisering på Azure

**Hugo vant av fem grunner:**

1. **Fart**: Et bygg tar millisekunder. Nettstedet mitt på 27 sider? 71 ms.
2. **Null avhengigheter**: Én binærfil, ingen npm-helvete, ingen virtuelle Python-miljøer, ingen Ruby gems
3. **Markdown først**: Skriv Markdown, få HTML. Som skapt for blogging.
4. **Innebygde funksjoner**: Taksonomier, sitemap, RSS og asset-pipeline følger med
5. **AI-vennlig arbeidsflyt**: Markdown passer perfekt til AI-hjelp. GitHub Agent kan hjelpe med å skrive, strukturere og finpusse innhold

### Installere Hugo på Windows (den riktige måten) {#installing-hugo}

Slik gjorde jeg det på min egen Windows-maskin:

**Steg 1: Installer Chocolatey (pakkebehandleren for Windows)**

Åpne PowerShell som administrator og kjør:

```powershell
winget install chocolatey.chocolatey
```

**Steg 2: Installer Hugo Extended**

```powershell
choco install hugo-extended -y
```

`-extended`-versjonen kan behandle Sass/SCSS, og det vil du ha på alle seriøse nettsteder.

**Steg 3: Bekreft installasjonen**

```bash
hugo version
# hugo v0.152.2-6abdacad3f3fe944ea42177844469139e81feda6+extended windows/amd64
```

**Steg 4: Opprett Hugo-nettstedet ditt**

```bash
hugo new site my-site
cd my-site
hugo server
```

Mer skal det ikke til. Ingen `npm install`, ingen `bundle install`, ingen virtuelle miljøer. Bare en binærfil som gjør jobben sin.

## Migreringen: AI som medarkitekt {#migration-process}

Her blir det interessant. Jeg tok ikke migreringen alene. Jeg jobbet i par med **GitHub Agent i VS Code** (drevet av Claude Sonnet 4.5), ikke som kodegenerator, men som *samarbeidspartner*.

**Viktig skille:** Jeg bruker GitHub Agent (den agentiske AI-assistenten i VS Code), ikke GitHub Copilot (verktøyet for kodefullføring mens du skriver). Agent kan undersøke, planlegge, utføre oppgaver i flere steg og justere seg etter tilbakemelding. Til en migrering som denne er det akkurat det du trenger.

### Fase 1: kartlegging og planlegging {#phase-1}

**Jeg**: «Jeg har nettstedet mitt i src-mappen. Jeg har nylig installert hugo, og jeg må overføre det eksisterende nettstedet slik at jeg kan fortsette å skrive blogginnlegg med hugo.»

**GitHub Agent**: *Startet en research-subagent* som:
- Analyserte hele mappestrukturen under `src/`
- Leste alle HTML-, CSS- og JavaScript-filene
- Identifiserte designmønstre, fargevalg og interaktive funksjoner
- Vurderte hvordan tilgjengelighet var løst
- Lagde en omfattende migreringsplan i sju faser

Dette var mer enn å flytte filer rundt. AI-en forsto *intensjonen* bak designet mitt.

### Fase 2: grunnoppsett {#phase-2}
Samarbeidet fulgte en enkel rekkefølge:
1. Jeg ba GitHub Agent sette opp Hugo-grunnmuren.
2. Den genererte `hugo.toml`, basislayouter, taksonomier og asset-pipeline.
3. Jeg ba den bevare designsystemet.
4. Den kopierte alle de 2 132 CSS-linjene og porterte JavaScript-funksjonene.
5. Jeg kontrollerte at interaktive effekter og typografi ble vist riktig.

**Dette gjorde GitHub Agent bra:**
- Satte opp `hugo.toml` med riktige innstillinger, ikke generiske standardverdier
- Lagde partial-maler (`head.html`, `header.html`, `footer.html`) som fulgte strukturen jeg allerede hadde
- Satte opp Hugo Pipes for CSS/JS-prosessering og beholdt de eksakte variabelnavnene mine
- Fant tilgjengelighetsfunksjonene i HTML-en min og sørget for at de ble med over i Hugo-malene

**Det jeg satte mest pris på:** Den *spurte* om spesialtilfeller i stedet for å gjette. «Skal navigasjonen fungere annerledes på bloggsider enn på forsiden?» Det er samarbeid, ikke automatisering.

### Fase 3: innholdsmigrering {#phase-3}

Den vanskeligste delen var å gjøre HTML-innleggene mine om til Markdown uten å miste noe av semantikken.

**Før (HTML):**
```html
<article class="article-container">
    <header class="article-header section-container">
        <p class="blog-card-meta">September 30, 2025 · 6 minute read</p>
        <h1 class="article-title">How GPT5-Codex and Azure Static Websites launched digitaldias.com</h1>
        <p class="article-subtitle">It finally happened — I paired with GPT5-Codex...</p>
    </header>
    <div class="article-body section-container">
        <p>Building software for four decades gives you instincts...</p>
    </div>
</article>
```

**Etter (Markdown med Hugo front matter):**
```yaml
---
title: "How GPT5-Codex and Azure Static Websites launched digitaldias.com"
date: 2025-09-30
description: "Pedro Dias shares how GPT5-Codex helped build digitaldias.com..."
excerpt: "I paired with GPT5-Codex..."
readTime: "6 minute read"
categories: ["Architecture", "Azure", "AI"]
tags: ["GPT5", "Codex", "Azure Static Web Apps"]
---

Building software for four decades gives you instincts...
```

GitHub Agent lagde Hugo-maler som bruker denne front matter-en til å rendre nøyaktig den samme HTML-strukturen. CSS-klassene, den semantiske markeringen og tilgjengelighetsfunksjonene mine ble stående urørt.

### 4. De interaktive funksjonene beholdes {#phase-4}

Nettstedet mitt bruker mye interaktiv JavaScript:
- Animasjoner som dukker opp når du scroller
- Animerte tellere for statistikk
- Magnetiske knappeeffekter
- Kort som vipper ved hover
- Fotogalleri med lightbox
- Bakgrunnsfliser med parallakse

**GitHub Agent skjønte poenget:** Dette var ikke valgfri pynt, men en del av opplevelsen. Den porterte hver eneste funksjon med `prefers-reduced-motion`-støtten intakt, slik at tilgjengelighet ikke ble ofret for utseendet.

## Resultatene: gevinster utover forventning {#results}

### 1. Innholdstempo

**Før Hugo:**
```bash
# Create a new blog post
1. Copy template HTML file
2. Update metadata manually
3. Write content in HTML tags
4. Add to blog index manually
5. Update sitemap manually
6. Deploy
Time: ~45 minutes overhead
```

**Med Hugo:**
```bash
hugo new blog/2025-11-19-my-post.md
# Write in Markdown
hugo
Time: ~5 minutes overhead
```

**Resultat:** Jeg gikk fra ett–to blogginnlegg i året til å se fram til å publisere hver uke.

### 2. Innebygd SEO

Hugo genererer automatisk:
- `sitemap.xml` med alle sider, kategorier og tagger
- RSS-feeder for bloggen og kategoriene
- Kanoniske URL-er på hver side
- OpenGraph- og Twitter Card-metadata
- Riktig overskriftshierarki

Jeg la til `robots.txt` og konfigurerte sitemap. Ferdig.

### 3. Taksonomi

Bloggen min har nå automatisk:
- **Kategorier**: Architecture, Azure, AI, DevOps, Photography
- **Tagger**: Blazor, Hugo, GitHub Copilot, Static Sites osv.
- **Arkivsider**: Genereres automatisk for hver kategori og tagg

Før måtte jeg lage og vedlikeholde disse sidene for hånd. Med Hugo bare finnes de.

### 4. Utvikleropplevelse

```bash
hugo server
# Site rebuilds in ~20ms on file save
# Live reload in browser
# Error messages are actually helpful
```

Sammenlign det med den gamle arbeidsflyten min: oppdatere nettleseren for hånd og feilsøke med «inspect element».

### 5. Enkel publisering

**Byggkommando:**
```bash
hugo --minify
```

Resultatet er optimaliserte statiske filer i `public/`. Publiser til Azure Static Web Apps, Netlify, GitHub Pages eller hvilken som helst statisk vert. Du trenger ingen serverruntime.

## Hva jeg lærte: AI som migreringspartner {#what-i-learned}

### Det gode

**1. Mønstergjenkjenning:** GitHub Agent fant designmønstre jeg hadde bygd uten å tenke over det, og bevarte dem konsekvent.

**2. Vaktbikkje for tilgjengelighet:** Den fanget opp tilgjengelighetshensyn jeg kanskje hadde oversett under migreringen: ARIA-labels, fokustilstander og semantisk HTML-struktur.

**3. Husket konteksten:** Gjennom en økt på flere timer husket Agent designvalg og begrensninger uten at jeg måtte gjenta dem.

**4. Utprøvd konfigurasjon:** Den satte opp Hugo med sitemap-innstillinger, RSS-utdata, kanoniske URL-er og optimaliseringer av asset-pipelinen som jeg ikke visste fantes.

**5. AI-drevet innholdsproduksjon:** Den største gevinsten? Nå kan jeg be GitHub Agent om hjelp til å skrive blogginnlegg. Den hjelper meg å strukturere ideene, holde tonen jevn og holde meg til budskapet.

### Utfordringene

**1. Rot med filstier:** På Windows blandet AI-en av og til `\` og `/` i stier. Noen ganger måtte jeg gå inn og rette stiene for hånd.

**2. Fristelsen til å gjøre for mye:** AI-en foreslo å lage shortcodes for gjentatte elementer (god idé), men jeg måtte trekke i håndbremsen. «Først blir vi ferdige med migreringen, så optimaliserer vi.»

**3. Krever kontroll:** AI-en kunne ikke *se* det som ble rendret. Jeg måtte selv sjekke at nettstedet så riktig ut, at animasjonene virket og at det responsive designet oppførte seg som det skulle.

**Mennesker er gode til:** Visjon, smak, skjønn, kontroll og å vite når «godt nok» er godt nok
**AI er god til:** Research, mønstergjenkjenning, konsistens, utførelse, utrettelig iterasjon
**Sammen:** Vi leverte en kompleks migrering på timer, ikke uker, og bygde en innholdsflyt som gjør det gøy å skrive igjen.

## Anbefalinger for din migrering {#recommendations}

### Gjør dette:
1. **Start med research**: La AI-en analysere strukturen på det nåværende nettstedet grundig
2. **Bevar først, optimaliser senere**: Få på plass samme funksjonalitet, og forbedre etterpå
3. **Bruk versjonskontroll**: Commit etter hver større fase, så er det enkelt å rulle tilbake
4. **Visuell kontroll**: AI-en kan ikke se nettstedet ditt, så du må sjekke renderingen selv
5. **Dokumenter beslutninger**: Skriv dokumentasjon for prosjektet som AI-en kan bruke som kontekst senere

### Unngå dette:
1. **Blind automatisering**: Ikke godta AI-forslag uten å forstå dem
2. **For tidlig optimalisering**: Migrer først, refaktorer senere
3. **Å hoppe over tilgjengelighet**: Kontroller ARIA-labels, fokustilstander og semantisk HTML
4. **Å ignorere feil**: Byggfeil fra Hugo er vennene dine, så rett dem med en gang
5. **Å glemme sikkerhetskopier**: Behold det gamle nettstedet urørt til du er 100 prosent sikker

## Konklusjonen {#bottom-line}

I september 2024 kodet jeg et nettsted for hånd fordi jeg ville ha kontroll. I november 2024 migrerte jeg til Hugo fordi jeg ville *skrive*.

Hva endret seg? Jeg innså at:
- WordPress hadde lært meg å frykte blogging (sikkerhetsmareritt)
- Håndskrevet HTML hadde lært meg å unngå blogging (friksjon i skrivingen)
- Hugo + GitHub Agent lærte meg å *like* blogging igjen (AI-støttet innholdsflyt)

Den egentlige gevinsten er ikke migreringen, men den nye arbeidsflyten:
- Skriv i Markdown med AI-hjelp
- La Hugo ta seg av HTML, sitemap, RSS og taksonomier automatisk
- Publiser statiske filer uten sikkerhetsbekymringer
- Bygg hele nettstedet på under ett sekund (71 ms for 27 sider)
- Ingen database, ingen plugins, ingen angrepsflate

Verktøy skal forsterke det du vil, ikke begrense det. Hugo står for strukturen. GitHub Agent står for samarbeidet. Du står for visjonen.

Jeg håndkoder ikke lenger, og jeg slåss ikke mot WordPress-hackere lenger. Jeg skriver. Det var hele poenget.

---

## Vanlige spørsmål {#faq}

**Er Hugo bedre enn WordPress for en personlig blogg?**
Det kommer an på målene dine. Hugo er raskere, tryggere og billigere i drift, men krever at du er vant med kommandolinjen og Markdown. Vil du ha en dra-og-slipp-editor og har ikke noe imot å vedlikeholde plugins, har WordPress fortsatt sin plass. Er du utvikler og vil eie alt selv, vinner Hugo.

**Må du kunne Go for å bruke Hugo?**
Nei. Hugo bruker Go-maler under panseret, men du kan skrive hele temaer og alt innhold uten å røre Go. Malsyntaksen er lesbar, og dokumentasjonen er god.

**Hva med GitHub Copilot mot GitHub Agent for migreringer som denne?**
Copilot fullfører kode mens du skriver. Agent planlegger, utfører og itererer. Til en migrering med dusinvis av filer, strukturelle valg og oppgaver i flere steg er Agent riktig verktøy. Copilot hadde hjulpet med enkeltstående snutter. Agent drev hele prosjektet.

**Hvor lang tid tok migreringen egentlig?**
Noen timers aktivt arbeid fordelt over en helg. AI-en tok seg av det repetitive, jeg tok kontrollen og beslutningene. Den fordelingen passer omtrent for enhver kompleks migrering.

---

## Kom i gang: hurtigstart {#getting-started}

**1. Installer Hugo (Windows)**
```powershell
# Install Chocolatey first
> winget install Chocolatey.Chocolatey

# Then install Hugo Extended
> choco install hugo-extended -y
```

**2. Opprett nettstedet ditt**
```bash
hugo new site my-blog
cd my-blog
hugo server
```

**3. Bruk GitHub Agent i VS Code**
- Installer VS Code
- Aktiver GitHub Agent (Settings → GitHub Copilot)
- Be den hjelpe deg med å migrere eller lage innhold

**4. Skriv ditt første innlegg**
```bash
hugo new blog/my-first-post.md
```

Be deretter GitHub Agent: «Help me write a blog post about [topic]. Include structure and examples.»

Mer er det ikke. Nå blogger du med AI-hjelp på en trygg og rask plattform.

---

*Nysgjerrig på de tekniske detaljene? Se [Hugo-dokumentasjonen](https://gohugo.io/documentation/).*
