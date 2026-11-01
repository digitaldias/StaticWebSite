# Briefing style handoff: Sea Glass

This file is the spec for restyling the unlisted daily briefing at `/briefing/` ("AI Nyhetsstrøm") so it reads as part of the redesigned digitaldias.com. Pedro implements it in the Python generator and the publish layer, in the newsstream repo. Nothing under `briefing/` in this repo is edited by hand, and the deploy workflow's briefing steps stay as they are.

Every CSS block below was validated on a copy of the mirrored page from 2026-11-01. The copy was served locally and checked at 375, 800 and 1440 px in light and dark: no horizontal scroll, the catbar opens, filters and closes, and today's date chip renders. The copy was assembled exactly as sections 2 to 6 describe.

## 1. What the page is today

Read from `briefing/index.html` as mirrored on 2026-11-01:

- The generator writes one inline `<style>` with the tokens `--bg`, `--panel`, `--panel-2`, `--ink`, `--sub`, `--faint`, `--line`, `--accent`, `--accent-cool` and `--accent-gold`, in Lora, Barlow and JetBrains Mono.
- The publish layer adds a second inline block, `<style id="briefing-layer">`. It holds the date strip, the catbar and every rule under 767 px. The published page has no `briefing-mobile.css` link, so the mobile rules live wherever that inline block comes from.
- The layer also emits one pair of `body:has(#cat-…:target)` rules per category, with `font-weight:600;color:var(--accent)` hard-coded. That template needs changing too (section 6), or the current-category highlight loses its colour.
- `catbar.js` is served as a file, because the CSP (`script-src-elem 'self'`) blocks inline scripts. The prune step in the deploy workflow deletes only dated `YYYY-MM-DD.html` pages, so a second script file next to it survives.

## 2. Tokens: one source for the site and the briefing

**Order of rollout.** This restyle depends on the Sea Glass redesign being live:

1. Merge the `sea-glass` branch into `main` first. `src/assets/css/tokens.css` and `src/assets/js/theme.js` exist only there until then, and the header in section 4 links to `/log/` and `/photography/`, which the live site gains with the same merge.
2. The publisher reads both files from the same up-to-date `main` checkout it commits `briefing/` into.
3. If either file is missing, the publish run fails instead of shipping a page without tokens.

The single source is `src/assets/css/tokens.css` in this repo. The site bundles it into its fingerprinted stylesheet.

The publisher already writes into this repo, so at publish time it does two things:

1. It reads `src/assets/css/tokens.css` from its checkout and inlines it as the first `<style>` in `<head>` (`<style id="tokens">`).
2. It drops every token definition from the generator's own `<style>`. The component CSS (section 5) only references tokens.

This needs no runtime link between the two, adds no extra request and keeps the briefing out of the Cloudflare cache race described in CLAUDE.md. A token change reaches the briefing on its next nightly run. Do not link the site's fingerprinted CSS: its URL changes on every build.

| New token | Light | Dark | Old briefing token | Role |
| --- | --- | --- | --- | --- |
| `--ground` | `#f4f6f4` | `#0f1a1b` | `--bg` | Page background |
| `--ground-2` | `#e7eeec` | `#162527` | `--panel` | Raised surface: the open catbar list |
| `--ink` | `#14201f` | `#e3ebe9` | `--ink` | Text, heavy rules |
| `--muted` | `#4f5f5d` | `#9db1ae` | `--sub` | Secondary text, meta, counts |
| `--rule` | `#cdd8d5` | `#2a3b3d` | `--line` and `--faint`, merged | Hairlines, chip borders |
| `--teal` | `#0b5d63` | `#5fc3c2` | `--accent` and `--accent-cool`, merged | The only accent: labels, links, current state, bar fill |
| `--deep-1` | `#d7ebe8` | `#15343a` | `--panel-2` | Tint: bar track, pillar chip |
| `--deep-2` | `#a9d3cf` | `#18454c` | new | Hover underline sweep on headlines |
| `--deep-3` | `#5aa5a3` | `#1c5860` | new | Link underline colour on the site; never text |
| `--on-teal` | `#f4f6f4` | `#0f1a1b` | new | Text on a teal fill (today's date chip) |
| `--display` | Schibsted Grotesk | | new, replaces Lora | Wordmarks, headlines, labels, UI |
| `--text` | Source Serif 4 | | new, replaces Barlow | Summaries, tagline, reading text |
| `--mono` | Geist Mono | | new, replaces JetBrains Mono | Meta row, dates, counts, sources |
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | | new | Motion curve |
| `--transition` | `150ms ease` | | new | Hover and focus transitions |
| `--page` | `1440px` | | new | Widest page column: the header and `.page` |
| (removed) | | | `--accent-gold` | Defined but unused in the briefing CSS |

The brick red `#b83c2c` retires with `--accent`. The redesign has no warm accent at all, so no orange, terracotta or coral comes back in any form.

Every colour token carries both values through `light-dark()`. The page is light by default and turns dark only when the reader has picked dark (section 3). Contrast on `--ground` is at least 6:1 for `--muted` and `--teal` in both themes.

Paste-in fallback, only if the publisher cannot read the repo file. It is a copy and will drift:

```css
/* =============================================================================
   Sea Glass design tokens: the single source for digitaldias.com and /briefing/.
   The site bundles this file ahead of styles.css. The briefing publisher reads
   it from this repo and inlines it. Change a value here, nowhere else.
   ============================================================================= */

:root {
  color-scheme: light; /* Light by default; dark only when the reader picks it */

  /* Colour: light value first, dark value second */
  --ground:   light-dark(#f4f6f4, #0f1a1b);
  --ground-2: light-dark(#e7eeec, #162527);
  --ink:      light-dark(#14201f, #e3ebe9);
  --muted:    light-dark(#4f5f5d, #9db1ae);
  --rule:     light-dark(#cdd8d5, #2a3b3d);
  --teal:     light-dark(#0b5d63, #5fc3c2);
  --deep-1:   light-dark(#d7ebe8, #15343a);
  --deep-2:   light-dark(#a9d3cf, #18454c);
  --deep-3:   light-dark(#5aa5a3, #1c5860);
  --on-teal:  light-dark(#f4f6f4, #0f1a1b);

  /* Type */
  --display: "Schibsted Grotesk", system-ui, sans-serif;
  --text:    "Source Serif 4", Georgia, serif;
  --mono:    "Geist Mono", ui-monospace, monospace;

  /* Layout: the widest the page column gets on large screens */
  --page: 1440px;

  /* Motion */
  --ease-out:   cubic-bezier(.16, 1, .3, 1);
  --transition: 150ms ease;
}

/* The reader's stored choice (theme.js) */
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"]  { color-scheme: dark; }
```

## 3. Light and dark

The site is light by default. It stores the reader's choice under `localStorage` key `dd-theme` (`light` or `dark`; absent means light) and sets it as `data-theme` on `<html>`. The briefing is on the same origin, so it shares the choice.

The publish layer copies `src/assets/js/theme.js` from this repo into `briefing/theme.js`, next to `catbar.js`, every night. It loads in `<head>` without `defer`, so a stored choice applies before first paint:

```html
<script src="theme.js"></script>
<script src="catbar.js" defer></script>
```

`theme.js` also wires every `[data-theme-toggle]` button, which the site header in section 4 contains. It needs no other change.

Set the page's `theme-color` to the light ground; `theme.js` switches it when the reader picks dark:

```html
<meta name="theme-color" content="#f4f6f4">
```

## 4. Fonts and markup

**Fonts.** Replace the Lora, Barlow and JetBrains Mono link with the site's exact URL, so a reader who comes from the site already has the files cached:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400&family=Geist+Mono:wght@400;500&display=swap">
```

This stays inside the site's CSP: `style-src` allows `https://fonts.googleapis.com` and `font-src` allows `https://fonts.gstatic.com`. No weight beyond these is used; KPI numbers move to Schibsted Grotesk, so Geist Mono needs only 400 and 500.

**Site header.** The publish layer inserts the site's header as the first element in `<body>`, above `.page`. It is identical to the site's `layouts/partials/header.html`, without a current item, because the briefing is unlisted:

```html
<header class="mast" role="banner">
  <div class="wrap">
    <a class="wordmark" href="/">digital<b>dias</b></a>
    <nav class="nav" aria-label="Main navigation">
      <a href="/blog/">Writing</a>
      <a href="/log/">Log</a>
      <a href="/photography/">Photographs</a>
      <a href="/about/">About</a>
    </nav>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch theme"></button>
  </div>
</header>
```

The site header and the briefing masthead both use the class `wordmark`. The CSS below scopes them as `.mast .wordmark` and `.masthead .wordmark`, so neither markup needs renaming.

**Masthead headline.** The generator writes the second word in an `<em>`, which renders in teal like the site's page heads ("Ship's *log*"):

```html
<div class="wordmark">AI <em>Nyhetsstrøm</em></div>
```

Everything else keeps its current markup and class names. `.rule-thick` can stay in the markup; the CSS hides it, because the masthead now draws its own 2 px rule.

## 5. CSS per briefing class

This block replaces the generator's whole `<style>`. It expects the tokens from section 2 before it.

| Class | Was | Becomes |
| --- | --- | --- |
| `.page` | 1200 px, 32 px gutters | `var(--page)` (1440 px) with the site's `clamp(16px, 4vw, 44px)` gutters, aligned with the header |
| `.meta-row` | Mono 11 px, 2 px ink rule | The site's `.m` meta line: Geist Mono .76rem, muted, hairline below; the italic centre in Source Serif 4 |
| `.datestrip` | Centred, ink chip for today | Left-aligned mono chips like the site's category filter; today is teal on `--on-teal` |
| `.masthead`, `.wordmark`, `.tagline` | Centred Lora 56 px | The Log page's `.page-head`: display 750 up to 5.6rem, left-aligned; tagline in muted serif beside it from 900 px; 2 px ink rule below |
| `.rule-thick` | 2 px ink bar | Hidden; the masthead carries the rule |
| `.kpi-row`, `.kpi`, `.kpi-label`, `.kpi-value` | Three boxed panels, mono numbers | The article folio strip hanging from the masthead rule: cells split by hairlines, `.k`-style labels, Schibsted Grotesk 750 with tabular figures |
| `.kpi.accent` | Red value | Teal value |
| `.panel`, `.panel-title` | Boxed panel, small-caps Lora | No box: 2 px ink top rule, `.k` label in teal |
| `.bar-track`, `.bar-fill`, `.bar-count` | Bordered track, red fill | `--deep-1` track, `--teal` fill, square ends; mono count |
| `.grid`, `.cat-panel`, `.cat-head` | Three boxed panels | Newspaper columns under a 2 px ink rule; three columns from 1081 px, two from 768 px |
| `.cat-name`, `.cat-count` | Red Barlow caps, mono count | `.k` label in teal, mono count in muted |
| `.spotlight-item`, `.article-title` | Lora 16 px, dashed separators | The stream's headline: display 700 at 1.18rem with the hover underline sweep; solid hairline separators |
| `.article-summary` | Barlow 12.5 px, muted | Source Serif 4 at .98rem, full ink: the spotlight reads as the story |
| `.article-pillar`, `.pillar-tag` | Mono navy tag | Muted serif line; the tag becomes the site's `.tag.q` chip (teal on `--deep-1`) |
| `.translation-note` | Italic Barlow | The site's `.note`: muted serif italic |
| `.article-meta` | Mono 10.5 px | Mono .7rem, muted |
| `.more` | Navy mono toggle | Teal mono toggle, same `+` / `−` |
| `.rest-list`, `.rest-item-head`, `.rest-source`, `.rest-summary` | Dashed top rule, Barlow | Solid hairline; display 600 heads, muted serif summaries, mono sources: quieter than the spotlight |
| `.footline` | Centred mono | The site's `.foot`: left-aligned mono under a 2 px ink rule |

```css
/* Briefing components: Sea Glass. Expects tokens.css inlined before this block. */
*{box-sizing:border-box;}
body{margin:0;background:var(--ground);color:var(--ink);font:400 1rem/1.55 var(--text);}
a{color:inherit;text-decoration:none;transition:color var(--transition);}
a:hover{color:var(--teal);}
:focus-visible{outline:2px solid var(--teal);outline-offset:3px;}
::selection{background:var(--deep-2);color:var(--ink);}

/* Site header, inserted by the publish layer: identical to the site's */
.mast{position:sticky;top:0;z-index:40;background:var(--ground);border-bottom:1px solid var(--rule);}
.mast .wrap{max-width:var(--page);margin:0 auto;padding:0 clamp(16px,4vw,44px);display:flex;align-items:center;gap:28px;height:60px;}
.mast .wordmark{font:800 1.45rem/1 var(--display);letter-spacing:-.04em;color:var(--ink);}
.mast .wordmark b{font-weight:inherit;color:var(--teal);}
.nav{display:flex;gap:22px;margin-left:auto;font:600 .85rem/1 var(--display);}
.nav a{color:var(--muted);position:relative;padding:6px 0;}
.nav a:hover{color:var(--ink);}
.theme-toggle{flex:none;display:grid;place-items:center;width:32px;height:32px;margin-left:-6px;padding:0;background:none;border:1px solid var(--rule);border-radius:50%;color:var(--ink);cursor:pointer;transition:border-color var(--transition);}
.theme-toggle::before{content:"";width:14px;height:14px;border-radius:50%;border:1.5px solid currentColor;background:linear-gradient(90deg,currentColor 50%,transparent 50%);transition:transform 300ms var(--ease-out);}
.theme-toggle[data-current="dark"]::before{transform:rotate(180deg);}
.theme-toggle:hover{border-color:var(--teal);}

/* Page column: aligned with the header */
.page{max-width:var(--page);margin:0 auto;padding:0 clamp(16px,4vw,44px) 60px;}

/* Meta row: the site's mono meta line */
.meta-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:18px 0 12px;border-bottom:1px solid var(--rule);font:400 .76rem/1.4 var(--mono);letter-spacing:.02em;color:var(--muted);}
.meta-row .center{font:italic 400 .92rem/1.4 var(--text);letter-spacing:0;}

/* Date strip: chips like the site's category filter; today in teal */
.datestrip{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0 0;font:500 .76rem/1 var(--mono);}
.datestrip a{padding:7px 10px;border:1px solid var(--rule);border-radius:2px;color:var(--muted);transition:color var(--transition),border-color var(--transition);}
.datestrip a:hover{color:var(--teal);border-color:var(--teal);}
.datestrip a[aria-current="page"]{background:var(--teal);border-color:var(--teal);color:var(--on-teal);}

/* Masthead: the Log page's page head */
.masthead{display:grid;gap:14px;padding:40px 0 22px;border-bottom:2px solid var(--ink);}
.masthead .wordmark{font:750 clamp(2.6rem,7vw,5.6rem)/.98 var(--display);letter-spacing:-.035em;text-wrap:balance;}
.masthead .wordmark em{font-style:normal;color:var(--teal);}
.tagline{margin:0;max-width:46ch;font:400 1.05rem/1.5 var(--text);color:var(--muted);}
.rule-thick{display:none;}

/* KPI row: the article folio strip, hanging from the masthead's ink rule */
.kpi-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:0 0 32px;border-bottom:1px solid var(--rule);}
.kpi{padding:16px 20px 16px 0;}
.kpi + .kpi{padding-left:20px;border-left:1px solid var(--rule);}
.kpi-label{margin-bottom:8px;font:600 .66rem/1.3 var(--display);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);}
.kpi-value{font:750 2.4rem/1 var(--display);letter-spacing:-.03em;font-variant-numeric:tabular-nums;}
.kpi-value span{font:400 .76rem var(--mono);letter-spacing:0;color:var(--muted);}
.kpi.accent .kpi-value{color:var(--teal);}

/* Panel and bar chart */
.panel{margin:0 0 40px;padding-top:12px;border-top:2px solid var(--ink);}
.panel-title{margin-bottom:14px;font:600 .7rem/1.2 var(--display);letter-spacing:.12em;text-transform:uppercase;color:var(--teal);}
.bar-row{display:flex;align-items:center;gap:12px;padding:5px 0;}
.bar-label{width:200px;flex-shrink:0;font:600 .88rem/1.3 var(--display);}
.bar-track{flex:1;height:8px;background:var(--deep-1);overflow:hidden;}
.bar-fill{height:100%;background:var(--teal);}
.bar-count{width:28px;flex-shrink:0;text-align:right;font:500 .76rem var(--mono);color:var(--muted);}

/* Category columns: newspaper columns under an ink rule, no boxes */
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:44px 32px;align-items:start;}
.cat-panel{display:flex;flex-direction:column;padding-top:12px;border-top:2px solid var(--ink);}
.cat-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;}
.cat-name{font:600 .7rem/1.2 var(--display);letter-spacing:.12em;text-transform:uppercase;color:var(--teal);}
.cat-count{font:500 .76rem var(--mono);color:var(--muted);}

/* Spotlight items: the stream's headline treatment, summary at full ink */
.spotlight-item + .spotlight-item{margin-top:18px;padding-top:18px;border-top:1px solid var(--rule);}
.article-title{margin-bottom:8px;font:700 1.18rem/1.2 var(--display);letter-spacing:-.02em;text-wrap:balance;}
.article-title a{background:linear-gradient(var(--deep-2),var(--deep-2)) 0 92%/0 .26em no-repeat;transition:background-size 350ms var(--ease-out);}
.article-title a:hover{color:inherit;background-size:100% .26em;}
.translation-note{font:italic 400 .82rem var(--text);letter-spacing:0;color:var(--muted);}
.article-summary{margin-bottom:8px;font:400 .98rem/1.55 var(--text);color:var(--ink);}
.article-pillar{margin-bottom:8px;font:400 .9rem/1.5 var(--text);color:var(--muted);}
.pillar-tag{margin-right:6px;padding:3px 6px;vertical-align:1px;background:var(--deep-1);font:600 .6rem/1 var(--display);letter-spacing:.1em;text-transform:uppercase;color:var(--teal);}
.article-meta{font:400 .7rem/1.4 var(--mono);color:var(--muted);}

/* The rest: quieter rows behind a mono toggle */
.more{margin-top:16px;}
.more > summary{list-style:none;cursor:pointer;font:500 .74rem var(--mono);color:var(--teal);}
.more > summary::-webkit-details-marker{display:none;}
.more > summary::before{content:"+ ";}
.more[open] > summary::before{content:"\2212 ";}
.rest-list{display:flex;flex-direction:column;gap:14px;margin-top:12px;padding-top:12px;border-top:1px solid var(--rule);}
.rest-item-head{display:flex;justify-content:space-between;gap:10px;font:600 .92rem/1.35 var(--display);letter-spacing:-.01em;}
.rest-item-head a:hover{text-decoration:underline;text-decoration-color:var(--teal);text-underline-offset:.2em;}
.rest-source{flex-shrink:0;padding-top:2px;white-space:nowrap;font:400 .66rem/1.4 var(--mono);color:var(--muted);}
.rest-summary{margin-top:3px;font:400 .88rem/1.5 var(--text);color:var(--muted);}

/* Foot line: the site's footer rule */
.footline{margin-top:56px;padding-top:22px;border-top:2px solid var(--ink);font:400 .76rem/1.5 var(--mono);color:var(--muted);}

@media (min-width:900px){.masthead{grid-template-columns:1fr 1fr;align-items:end;}}
@media (min-width:768px) and (max-width:1080px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:0s !important;}}
```

## 6. Mobile and the publish layer

This block replaces the contents of `<style id="briefing-layer">`, above the per-category rules. Below 768 px the site header stops being sticky, so the catbar keeps the one sticky slot. Below 401 px the header type tightens, and at 339 px and below the nav moves to a second row, exactly as on the site.

```css
.catbar{display:none;}

@media (max-width:767px){
  .mast{position:static;}
  .mast .wrap{gap:10px;}
  .mast .wordmark{font-size:1.2rem;}
  .nav{gap:10px;font-size:.76rem;}
  .theme-toggle{width:28px;height:28px;margin-left:-2px;}

  .page{padding:0 16px 48px;}
  .meta-row{padding-top:12px;font-size:.7rem;}
  .meta-row .center{display:none;}
  .datestrip{margin-top:12px;}
  .datestrip a{display:flex;align-items:center;min-height:44px;padding:0 14px;}
  .masthead{padding:24px 0 16px;}
  .masthead .wordmark{font-size:2.6rem;}
  .tagline{font-size:1rem;}

  .kpi-row{margin-bottom:16px;}
  .kpi{padding:12px 10px 12px 0;}
  .kpi + .kpi{padding-left:10px;}
  .kpi-label{font-size:.6rem;letter-spacing:.06em;}
  .kpi-value{font-size:1.6rem;}
  .kpi-value span{display:none;}
  .panel:has(.bar-row){display:none;}

  .catbar{display:block;position:sticky;top:0;z-index:10;margin:0 -16px 20px;background:var(--ground);border-bottom:2px solid var(--ink);}
  .catbar > summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;padding:0 16px;cursor:pointer;font:700 1.05rem/1.2 var(--display);letter-spacing:-.01em;}
  .catbar > summary::-webkit-details-marker{display:none;}
  .catbar > summary::after{content:"\25BE";font-size:.9rem;color:var(--muted);}
  .catbar[open] > summary::after{content:"\25B4";}
  .catbar .cur{display:none;}
  .catbar .cur-all{display:inline;}
  body:has(.cat-panel:target) .catbar .cur-all{display:none;}
  .catbar-list{position:absolute;left:0;right:0;top:100%;max-height:70vh;overflow-y:auto;display:flex;flex-direction:column;background:var(--ground-2);border-bottom:2px solid var(--ink);}
  .catbar-list a{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;padding:0 16px;border-top:1px solid var(--rule);font:600 1rem/1.2 var(--display);}
  .catbar-list a span{font:400 .8rem var(--mono);color:var(--muted);}
  .catbar-list a.all{color:var(--teal);}
  body:has(.cat-panel:target) .catbar-list a.all{color:inherit;}
  body:has(.cat-panel:target) .cat-panel:not(:target){display:none;}

  .grid{grid-template-columns:minmax(0,1fr);gap:32px;}
  .cat-panel{scroll-margin-top:60px;}
  .cat-name,.cat-count{font-size:.74rem;}
  .article-title{font-size:1.3rem;}
  .translation-note{font-size:.86rem;}
  .article-summary{font-size:1.05rem;line-height:1.6;}
  .article-pillar{font-size:.96rem;}
  .article-meta{font-size:.76rem;}
  .spotlight-item + .spotlight-item{margin-top:22px;padding-top:22px;}
  .more{margin-top:8px;}
  .more > summary{padding:12px 0;font-size:.82rem;}
  .rest-list{gap:18px;}
  .rest-item-head{flex-direction:column;gap:2px;font-size:1.02rem;}
  .rest-source{white-space:normal;font-size:.72rem;}
  .rest-summary{font-size:.98rem;line-height:1.55;}
  .footline{margin-top:40px;font-size:.72rem;}
}

@media (max-width:400px){
  .mast .wordmark{font-size:1.1rem;}
  .nav{font-size:.72rem;}
}

@media (max-width:339px){
  .mast .wrap{flex-wrap:wrap;height:auto;padding-block:10px;row-gap:6px;}
  .nav{order:3;width:100%;margin-left:0;justify-content:space-between;}
  .theme-toggle{margin-left:auto;}
}
```

The per-category template keeps its shape. Only the declaration changes: the display face is already 600, so the weight goes, and the colour becomes teal. For each category id `X`:

```css
body:has(#cat-X:target) .catbar .cur-cat-X{display:inline;}
body:has(#cat-X:target) .catbar-list a[href="#cat-X"]{color:var(--teal);}
```

`catbar.js` needs no change.

## 7. Check before publishing

- The published page contains no `#b83c2c`, `--accent`, `--bg`, `--sub`, `Lora`, `Barlow` or `JetBrains`.
- `<style id="tokens">` is the first style block and matches `src/assets/css/tokens.css` byte for byte.
- `theme.js` and `catbar.js` both sit in `briefing/`, and `theme.js` loads in `<head>` without `defer`.
- At 375, 800 and 1440 px, in light and dark, the page has no horizontal scroll (`document.documentElement.scrollWidth` equals `clientWidth`).
- On a phone the catbar opens, filters to one category and closes. The chosen category shows teal in the list.
- The toggle in the header switches the theme, and a reload of the briefing, or of any site page, keeps the choice.
