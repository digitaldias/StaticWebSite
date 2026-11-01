# Sea Glass redesign — implementation plan

Branch `sea-glass` (worktree `.claude/worktrees/sea-glass`), cut from `main` at `4a36095`. Target: the approved prototype in `E:\Caches\Temp\sea-glass-prototype\` (`home.html`, `post-*.html`, `log.html`, `photos.html`, `about.html`, shared `site.css` and `site.js`; serve with `python -m http.server 8790` from that folder): Sea Glass palette, Schibsted Grotesk + Source Serif 4 + Geist Mono, Split homepage, expressive motion, full-colour photos, light and dark.

Delete this file once the redesign is merged.

## Constraints carried in

- Giscus reactions and comments stay on every post. Its theme follows light/dark.
- Ko-fi stays as one quiet line after the article ("If this saved you an afternoon…"); keep `initKofiTracking`.
- Reader tools stay and are restyled: the Chart rail and course strip, resume slip, read stamps, § / ¶ citations.
- The `tldr` field renders above the first paragraph.
- No photos of Pedro's children. No orange, terracotta or coral accents.
- Never edit existing posts' Markdown: any commit to a post marks it "Revised". Covers for the two image-less posts are looked up by convention instead (see Photography and covers).
- CSP lives in `layouts/partials/head.html`; Google Fonts and `live.staticflickr.com` are already allowed, so no CSP change is needed.
- `main.js` scores 8.1; two functions are already above cc 9 (12 and 13). New behaviour goes into new small `init*` functions, never into those two.
- Never push from this branch. Merging to `main` and pushing are Pedro's calls (deploy race in CLAUDE.md).

## Briefing pages (/briefing/)

The unlisted daily briefing ("AI Nyhetsstrøm") must read as part of the new site. It is not built by Hugo and nothing under `briefing/` is edited in this repo: a publisher script outside the repo deletes and rewrites the folder every night, and the deploy workflow's briefing steps stay as they are. Pedro implements the restyle in the Python generator and the publish layer, in another repo, from `doc/briefing-style-handoff.md`.

What the mirrored page shows today (`briefing/index.html`, 2026-11-01): the generator's inline `<style>`, then a second inline `<style id="briefing-layer">` holding the date strip, the catbar and every rule under 767 px. There is no `briefing-mobile.css` link in the published page, so the mobile rules are edited wherever the layer's inline block comes from. The layer also emits one `body:has(#cat-…:target)` rule pair per category with a hard-coded `var(--accent)`; that template needs the rename too. `catbar.js` is served as a file because `script-src-elem 'self'` blocks inline scripts.

**One source of truth.** `src/assets/css/tokens.css` holds every token. The site bundles it into its fingerprinted stylesheet. The publisher already writes into this repo, so at publish time it reads `src/assets/css/tokens.css` from its checkout and inlines it as the first `<style>` block, and copies `src/assets/js/theme.js` next to `catbar.js`. No runtime coupling, no extra request and no exposure to the Cloudflare cache race; a token change reaches the briefing on its next nightly run. The handoff also carries the token block for pasting, as a fallback.

**Token table.**

| New token | Light | Dark | Old briefing token | Role |
| --- | --- | --- | --- | --- |
| `--ground` | `#f4f6f4` | `#0f1a1b` | `--bg` | Page background |
| `--ground-2` | `#e7eeec` | `#162527` | `--panel` | Raised surface: code, image wells, the open catbar list |
| `--ink` | `#14201f` | `#e3ebe9` | `--ink` | Text, heavy rules |
| `--muted` | `#4f5f5d` | `#9db1ae` | `--sub` | Secondary text, meta |
| `--rule` | `#cdd8d5` | `#2a3b3d` | `--line` and `--faint`, merged | Hairlines |
| `--teal` | `#0b5d63` | `#5fc3c2` | `--accent` and `--accent-cool`, merged | The only accent: labels, links, current state, bar fill |
| `--deep-1` | `#d7ebe8` | `#15343a` | `--panel-2` | Tint: bar track, chip ground, Now box, callouts |
| `--deep-2` | `#a9d3cf` | `#18454c` | new | Hover underline sweep, chart markers |
| `--deep-3` | `#5aa5a3` | `#1c5860` | new | Link underline colour; never text |
| `--on-teal` | `#f4f6f4` | `#0f1a1b` | new | Text on a teal fill |
| `--display` | Schibsted Grotesk | | new, replaces Lora | Wordmark, headings, labels, UI |
| `--text` | Source Serif 4 | | new, replaces Barlow | Reading text, summaries |
| `--mono` | Geist Mono | | new, replaces JetBrains Mono | Meta, dates, counts, sources |
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | | new | Motion curve |
| `--transition` | `150ms ease` | | new to the briefing | Hover and focus transitions |
| (removed) | | | `--accent-gold` | Unused in the briefing CSS; the brick-red `--accent` goes with it, so no warm accent remains |

**Light and dark.** The briefing gets dark mode for free from `light-dark()`. `theme.js` in `<head>`, without `defer`, applies the reader's stored choice (key `dd-theme`, shared with the site because the briefing is same-origin) and wires the same toggle button.

**Component mapping.** Every briefing component borrows an existing site pattern instead of inventing one:

- Site header: the publish layer inserts the site's `.mast` (wordmark, nav, theme toggle) above `.page`. It is static on phones so the catbar keeps the sticky slot.
- `.meta-row` becomes the site's mono meta line (`.m`); its italic centre uses Source Serif 4 italic.
- `.masthead` becomes the Log page's `.page-head`: a left-aligned display headline ("AI *Nyhetsstrøm*", second word in teal), the tagline in muted serif beside it from 900 px, and a 2 px ink rule underneath. `.rule-thick` is dropped.
- `.datestrip` keeps its place above the masthead as mono chips; today is teal on `--on-teal`, other days are ruled chips.
- `.kpi-row` becomes a folio strip like the article's: a 2 px ink top rule, cells split by hairlines, no boxes. Labels are `.k` small caps, values Schibsted Grotesk 750 with tabular figures; `.kpi.accent` sets its value in teal.
- `.panel` and `.cat-panel` drop the boxed panel look for the site's newspaper columns: no fill, a 2 px ink top rule. `.panel-title` and `.cat-name` become `.k` labels in teal; counts are mono.
- Bar chart: a `--deep-1` track with a `--teal` fill, square ends, no border.
- `.spotlight-item` gets the stream's headline treatment (display 700) with the summary in serif at full ink; items are split by a solid hairline instead of a dashed one.
- `.rest-list` and `.rest-item` stay quieter: display 600 at body size, muted serif summary, mono source.
- `.pillar-tag` becomes the site's `.tag.q` chip (teal on `--deep-1`). `.translation-note` becomes the site's `.note` (muted serif italic). `.more` stays a mono teal toggle. `.footline` becomes the site's `.foot`.
- Mobile catbar: sticky at the top on `--ground` with a 2 px ink bottom rule, display-font summary, the open list on `--ground-2`, the current category in teal, 48 px touch rows.

## Steps

- [x] **Tokens and type.** The Sea Glass set lives in its own file, `assets/css/tokens.css` (`light-dark()`, `color-scheme: light dark`), the single source for the site and the briefing (see Briefing pages). `head.html` bundles it ahead of `styles.css` with `resources.Concat`. Swap the Google Fonts URL in `head.html` to Schibsted Grotesk, Source Serif 4, Geist Mono. Done when every page builds and no old token name (`--accent-gold`, `--accent-map`, parchment `--bg`) remains in use.
- [x] **Theme toggle.** A light/dark switch in the header, stored per browser under `localStorage` key `dd-theme` (`light` or `dark` on `<html data-theme>`; absent means follow the OS), wrapped in try/catch. The logic lives in `assets/js/theme.js`, loaded without `defer` in `<head>` so the choice applies before first paint; the CSP's `script-src-elem` blocks an inline pre-paint script. Giscus is injected by `main.js` with the current theme and follows `theme:change`. Done when a reload keeps the choice and Giscus matches.
- [x] **Header and footer partials.** New wordmark and nav: Writing, Log, Photographs, About. Footer keeps the social links and RSS.
- [x] **Homepage (`layouts/index.html`).** Split layout: sticky sidebar (portrait, one-line bio, Positions held, Now, link to the log) beside the post stream with the lead post first. Values stay in `hugo.toml` `[params]`. Positions become `[[params.positions]]` tables (`text`, optional `since` and `post`) so the About page can say where each is argued; CLAUDE.md's blog-post workflow asks Pedro to refresh them and `[params.currently]` with every new post.
- [x] **Blog list (`layouts/blog/list.html`).** Same stream partial as the homepage, without the sidebar, with the category filter kept.
- [x] **Article (`layouts/blog/single.html`).** Restyle the header, folio, hero, drop cap, figures, code, tables, callouts, See also, revision record, next entry, Ko-fi line and Giscus block to the prototype.
- [x] **Ship's log (new `content/log/_index.md` + `layouts/log/list.html`).** "Now" from `params.currently`; dated entries from a new `data/log.yaml` merged with automatic "Published" rows generated from posts. Seed `log.yaml` with real entries only.
- [x] **Photographs (`layouts/photography/list.html`).** Replace the broken page: intro text, a curated `data/photos.yaml` (Flickr title, page URL, image URL, alt, size class) rendered as the gap-free grid with a `<dialog>` lightbox. Seed with the 13 prototype frames; Pedro confirms the selection.
- [x] **About (`layouts/about/list.html`, the template `/about/` actually renders; the unused `single.html` is gone).** Portrait in colour, headline, bio from `content/about/_index.md`, track list, Positions held with links. Career years stay blank until Pedro supplies them.
- [x] **Covers for image-less posts.** Cyanotype covers (the MakeImage frames approved in the prototype, run through `optimize-image.py hero`; `just cover` for future ones) into `static/images/blog/<post>/featured.jpg`; teach the templates to use that path when `featuredImage` is empty (`fileExists`), so the posts' Markdown stays untouched.
- [ ] **Motion.** CSS-only scroll-driven reveals and progress hairline behind `@supports (animation-timeline: view())`; cross-document view transitions (lead image and title morph); headline word rise from a new small `initHeadlineRise` in `main.js`. Everything sits behind `prefers-reduced-motion: no-preference`. Remove `initPageFade` and `initScrollReveal` if the CSS replaces them.
- [x] **Briefing handoff.** Write `doc/briefing-style-handoff.md` (token table, fonts and loading, CSS per briefing class, new markup for the masthead, mobile section) from the finished `tokens.css`, `theme.js` and header partial. Validate it against a scratchpad copy of `briefing/index.html` served with `python -m http.server` at 375, 800 and 1440 px in light and dark. Done when the copy reads as part of the site and nothing under `briefing/` or `.github/` has changed.
- [ ] **Docs.** Rewrite the CLAUDE.md design-system section (tokens, fonts, motion rules) and update `static/llm.txt` for the new sections.
- [ ] **Verify.** `just check` passes; `node --check` on `main.js`; every page at 375, 800 and 1440 px in light and dark has no horizontal scroll; reader tools, Giscus and the lightbox work; reduced motion shows a still page.
- [ ] **Hand over.** Merge `main` into `sea-glass` if it moved, show Pedro on a dev server, then ask whether to merge into `main` and push.
