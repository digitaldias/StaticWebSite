# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Repeatable commands live in the root `justfile` (`just --list`): `new-post`, `cover`, `check`, `listening`. Add a recipe there rather than re-deriving a command twice.

```bash
just new-post my-slug     # src/content/blog/<today>-my-slug.md from src/archetypes/blog.md
just check                # build with drafts into %TEMP%, never src/public
just listening            # Pedro's five most-played Spotify artists of the last 4 weeks (setup: scripts/spotify-top.py)
just depth <post-file>     # score each section's reading level (100-400) with the local decision model into data/depth.yaml
cd src && hugo server -D  # dev server at http://localhost:1313
```

A Hugo dev server Pedro already has running is his. Reuse it; never start a second one on the same port or restart his.

## Finishing work

- Verify every claim yourself before reporting it: build, grep, curl, run the snippet. A report never contains "not verified", "open questions", "remaining issues" or a list of nits (Pedro, 2026-11-06).
- Fix the small defects you find along the way (stale notes, dead files, a fact duplicated in two places that can drift) in the same change instead of listing them.
- Something only Pedro can do (the Cloudflare dashboard, an account, a decision) goes to him as one concrete action, with the exact place to click, as the closing question. Verify the result yourself once he says it is done.
- Probing the live site with curl is fine, except right after a deploy (see the deploy race).

## Architecture

This is a **Hugo static site**. The entire Hugo project lives under `src/`, not the repo root. Config is `src/hugo.toml` (not config.toml or config.yaml). `src/public/` is build output and `src/isableFastRender/` is a Hugo server artifact: never edit either. `theme.js` and `lang.js` load without `defer` in `<head>`; everything else is in `main.js` (vanilla ES6+).

**Homepage values** come from `[params]` in `hugo.toml`: `bio`, `motto`, `photo`, `[[params.positions]]` (`text`, optional `since` YYYY-MM and `post` path), `[params.currently]`. Edit there, not in the template. Do not create `content/_index.md`.

**Data files.** `data/log.yaml` holds the Ship's log notes (published posts join it automatically). Every reader-visible site feature or fix gets a dated note there (`Shipped`, `Site` or `Fixed`) in the same commit. `data/photos.yaml` is the Photographs selection; never add photos of the children. `data/track.yaml` is the About page's milestone list. `data/listening.yaml` is the history of the homepage Listening pick, newest first (`artist`, `song`, optional `guest`, `genres`, `spotify`, `song_url`); its first entry feeds the Now box on the homepage and the Log, and `/listening/` (and `/nb/listening/`) lists them all. Facts about an artist come from the Spotify API, never from memory. `data/covers.yaml` holds alt text for generated covers. `data/briefing_claims.yaml` holds the phrase parts for the homepage briefing sentence, which `partials/briefing-claim.html` rewords per edition by date; keep its list lengths pairwise coprime and proofread every combination with `just claims --all` after an edit. `data/depth.yaml` holds the decision model's raw score per `## ` section (`just depth`, model `d3:4b-q8_0` on Ollama, which newsstream also uses: coordinate before running it). `partials/depth.html` turns the scores into levels with `[params.depth]` cutoffs in `hugo.toml`, and renders the folio's level key and card, the turnout where the gist ends, and the level marks on the Chart and on every list of posts (`stream.html`, `archive-card.html`, the Ship's log's Published rows). A new place that lists posts gets the level mark too. Recalibrate the cutoffs against Pedro's labels with `python scripts/depth-score.py --calibrate`. The levels follow Microsoft's conference session scale (Mike Hall, MSDN 2008): the scorer asks two questions, what the section assumes the reader knows (weight 0.75) and what its code does (0.25).

**Two languages.** English is the default and Norwegian bokmål lives under `/nb/` (`[languages]` in `hugo.toml`). Every post exists in both: `<post>.md` (English) and `<post>.nb.md` (Norwegian) side by side, with the same `date`, `categories`, `tags`, `featuredImage` and `imageCredit`, and translated `title`, `description`, `excerpt`, `tldr`, `featuredAlt` and shortcode `alt`/`caption`. Internal links in a `.nb.md` point at `/nb/blog/...`. The header switch (`partials/lang-switch.html`, `lang.js`) stores `en` or `nb` under `localStorage` key `dd-lang` and redirects to the translation before first paint; a page without a translation stays in its own language and the other language shows dimmed. New UI text goes into both `i18n/*.yaml` files, never hardcoded in a template. Homepage values for Norwegian live in `[languages.nb.params]` in `hugo.toml`: change `bio`, `motto`, `currently` and `positions` there as well as in `[params]`. The Norwegian must be idiomatic bokmål that reads as if a Norwegian wrote it first, never anglicised Norwegian; the full rules and checklist are in `doc/nb-style.md`. Everything a reader sees is translated: template text through `i18n/*.yaml`, `main.js` strings through `assets/js/i18n.js` (picked by `<html lang>`), the depth level names through `[languages.nb.params.depth]`, and data files through `_nb` fields (`text_nb`, `title_nb`, `alt_nb`, `note_nb`) read with `partials/loc.html`. A new template string or data field gets its Norwegian in the same change; only the `404.html` page stays English, because the static host serves one 404. Norwegian pages use `nb/` URLs, so link with `relLangURL`. Text in CSS `content:` (the Chart's "The gist ends here") gets a `:lang(nb)` override in `styles.css`. Hugo gotchas found here: `.Fragments.Headings` has one synthetic level-0 root whose `.Headings` are the h2s; `depth.html` matches a translated post's sections to `data/depth.yaml` by h2 position, because the scored headings are English; and a `hugo server` that hit one template error keeps logging "Rebuild failed" and serving stale pages even after the fix, so restart it (check `hugo --quiet` first).

**Assets are processed by Hugo Pipes** — CSS and JS are minified and fingerprinted at build time.

## Blog Post Front Matter

All fields consumed by the templates:

```yaml
---
title: "Post Title"
date: 2025-11-19
draft: false
description: "SEO meta description (max 160 chars)"
excerpt: "Teaser text shown in blog listing cards"
tldr: "The whole post in two or three plain sentences"   # Rendered as a TL;DR box above the first paragraph
readTime: "5 minute read"             # Optional override; omit on new posts to use Hugo's word-count estimate
updates:                              # Optional dated notes shown in the article's Revision record
  - date: 2026-01-15
    note: "Corrected the Hugo install command for Windows."
categories: ["Architecture", "Azure"]   # First category drives breadcrumbs and article:section
tags: ["Blazor", "DevOps"]              # Drive OG article:tag and JSON-LD keywords
author: "Pedro Dias"
featuredImage: "/images/blog/YYYY-MM-DD-slug/featured.jpg"  # Drives OG image + JSON-LD image
featuredAlt: "Descriptive alt text"
imageCredit: "© Pedro Dias"
---
```

Without `featuredImage`, the `cover` partial looks for `static/images/blog/<post file name>/featured.jpg` (alt text in `data/covers.yaml`), so an image-less post gets a cover without a Markdown edit. With neither, the OG image falls back to `images/dog-hero.jpg`.

Each post's `## ` headings drive the reader tools in `main.js`: the Chart (section route rail and course strip), the resume slip and Read stamps (browser `localStorage` key `dd-reading-log`), and § / ¶ passage links. A post needs at least two `## ` sections for the Chart to appear.

`lastmod` comes from git history (`enableGitInfo`, with `fetch-depth: 0` in CI). A post shows "Revised" in its folio line and a Revision record once its last commit lands more than 7 days after `date`. Any commit to a post counts, so never sweep mechanical front-matter edits across all posts: every one of them would claim a revision that day.

## Shortcodes

`callout`, `pullquote` and `img` in `layouts/shortcodes/`. New posts put the TL;DR in the `tldr` field, never in a callout. Mermaid was removed; do not add it back.

## Design System — Sea Glass

Cool Nordic palette, newspaper structure (ruled columns, folio lines, no cards), full-colour photos, light and dark themes. Every token lives in `src/assets/css/tokens.css`, which the site bundles ahead of `styles.css` and the briefing publisher inlines (see `doc/briefing-style-handoff.md`). Change a value there, nowhere else; its comments say what each token is for. `--teal` is the only accent, and `--deep-3` is never used for text.

No orange, terracotta, coral or any other warm accent: it reads as AI-made. Use the tokens only; don't add colours.

Typography: `--display` Schibsted Grotesk (headlines, labels, UI), `--text` Source Serif 4 (reading text), `--mono` Geist Mono (meta, dates, code), loaded from Google Fonts in `head.html`. Utility classes: `.d` display headline (`<em>` inside turns teal), `.k` kicker label, `.m` mono meta, `.note` muted aside.

Light/dark: the site is light by default, whatever the OS says; dark applies only when the reader picks it. The header switch (`[data-theme-toggle]`, `theme.js`) stores `light` or `dark` under `localStorage` key `dd-theme` and sets `<html data-theme>`. `theme.js` loads without `defer` in `<head>` because the CSP's `script-src-elem` blocks an inline pre-paint script. It emits `theme:change`; `initGiscus` in `main.js` re-themes Giscus from it.

Motion: headline word rise (`.split-words`, `initHeadlineRise`), image wipe (`.wipe`), entrance (`.lift`), scroll-driven reveals (`.reveal`) and the progress hairline (`animation-timeline`, behind `@supports`), and cross-document view transitions (`lead-image`, `lead-title`, `portrait`). Every animation sits inside `@media (prefers-reduced-motion: no-preference)`; under reduce, transitions drop to zero and nothing is split, so the page is still. Use `requestAnimationFrame` for scroll work in JS.

CSS conventions: mobile-first rules; breakpoints at 400 / 520 / 560 / 700 / 760 / 900 / 960 / 1180 px (the Chart switches from strip to rail at 1180). Side gutter `clamp(16px, 4vw, 44px)`; nothing may scroll horizontally from 320 px up. Transitions use `var(--transition)` or `var(--ease-out)`.

In `main.js`, `initChart`'s `update` and `initReadMarks` are already over `qualify`'s complexity threshold. Add new behaviour as small `init*` functions, never inside those two.

Hugo template conventions: in the blog section `.PrevInSection` is the older post and `.NextInSection` the newer one (the "Next entry" link uses `.PrevInSection`); use `{{- -}}` for whitespace control; guard optional params with `{{ with .Params.excerpt }}{{ . }}{{ end }}`; internal links via `.RelPermalink`; render HTML content via `{{ .Content | safeHTML }}`.

## Ko-fi supporters

`functions/KofiSupporters` (.NET 10 isolated, Flex Consumption app `digitaldias-kofi` in Pedro's personal subscription, resource group `puppytrackerRG`) receives Ko-fi's webhook at `/api/kofi`, checks `KOFI_VERIFICATION_TOKEN` (an app setting, never in the repo) and, only when `is_public` is true, adds name, message, type and date to `supporters.json` in the blog's `$web` container (storage account `puppytrackerstorage`, written through the app's managed identity). `initSupporters` (the footer's thank-you line) and `initSupporterPage` (the `/supporters/` page, `layouts/supporters/list.html`, with a hopeful-dog empty state) in `main.js` read it through one shared fetch. A blank name is stored as null and shown as Someone/Noen. Never put a `supporters.json` in `src/static`: the deploy's `upload-batch --overwrite` would replace the real list (it is in `.gitignore`). Deploy the function with `func azure functionapp publish digitaldias-kofi --dotnet-isolated` from `functions/KofiSupporters`; tests run with `dotnet test` in `functions/`.

## The dd-desk pane

`.claude/plugins/dd-desk` is a Claude Code mod that opens a pane beside the chat in every session started in this repo: drafts with their workflow checks, unpushed `main`, the last deploy, the Now box, Cloudflare traffic per day split into readers (Web Analytics page loads), AI bots and the rest, and buttons that submit the workflow prompts. `.claude/settings.json` enables it as `dd-desk@digitaldias`; each machine registers the folder marketplace once with `claude plugin marketplace add ./.claude/plugins` from the repo root (a relative path in project settings does not resolve). It reads `CLOUDFLARE_API_TOKEN` from `.env` (read-only analytics token, zone digitaldias.com) and the Search Console service account key from `gsc-key.json` (service account `dd-desk@digitaldias-desk.iam.gserviceaccount.com`, Restricted user on `sc-domain:digitaldias.com`); both are gitignored and copied to the Mac by hand. The mod runtime has no RSA signing, so `node scripts/gsc-assertion.mjs` signs the Google JWT. Edit the mod there, then `claude plugin validate`, `claude plugin test` and `tsc -p` in its folder. Its colours are the Sea Glass tokens in mid tones, never `claude` orange.

## CSP

The Content Security Policy is hardcoded in `layouts/partials/head.html`, and Cloudflare also sends it as a response header from two Response Header Transform Rules (Rules → Overview): "Add security headers" for every path and "Briefing CSP: allow https images" for `/briefing/`. The browser enforces the meta tag and the header together, so any new external resource (font, script, image host, beacon endpoint) goes into all three; Claude's token cannot edit rules, so Pedro edits the two in Cloudflare. `src/static/staticwebapp.config.json` holds a copy of the header text. The header blocks inline scripts, so a script goes in a file under `assets/js/`, never inline.

## Deployment

Push to `main` triggers `.github/workflows/deploy-to-azure.yml`, which builds with `hugo --minify` and uploads `src/public/` to Azure Blob Storage (`$web` container) via `az storage blob upload-batch`. Requires `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_KEY` secrets in the repo. Cloudflare sits in front of the storage origin as CDN/DNS for the custom domain.

The nightly briefing publisher (newsstream, early morning) commits `briefing/` in this checkout, then runs `git pull` and `git push origin main`; it refuses to publish while `main` is ahead of `origin/main`. Never leave unpushed commits on `main` overnight: finish work on a branch, or push it.

The deploy workflow has no `concurrency` group, so back-to-back pushes deploy in parallel and the run that finishes last wins the upload. After two quick pushes, check in `gh run list` that the newest commit's run finished last.

### Known deploy race: do not verify a fresh deploy against the live CDN URL

`upload-batch` uploads files in no fixed order, so HTML can go live seconds before the fingerprinted CSS/JS it references. Cloudflare caches static extensions for 4 hours (`max-age=14400`), and one early request used to pin a 404 at the edge for everyone.

- Never curl or open the live custom-domain URL right after a deploy: checking is what poisons it. Confirm a deploy from the `upload-batch` step's JSON in the GitHub Actions log, which lists every blob with `eTag` and `Last Modified`.
- The Cache Rule "Never cache error responses" (`http.response.code ge 400`, `no-store`) keeps new 404s out of the cache; a missing file answers `cf-cache-status: BYPASS`. A missing asset with `cf-cache-status: HIT` means the rule is off (Caching → Cache Rules) or the entry predates it.
- A poisoned URL needs a Cloudflare purge. Claude has no Cloudflare token: ask Pedro to purge. Re-bumping the fingerprint and re-checking in a loop is not a fix.
- A comment-only edit to `styles.css` or `main.js` does not change the fingerprint; the minifier strips comments first.
- A replaced image under the same URL keeps serving the old bytes for up to 4 hours. Save a regenerated image under a new file name and update the reference, or ask Pedro to purge it. Compare `curl -sIL <url>` `Content-Length` with the local file to check.

## AI readers

Most of the site's traffic is AI bots (Cloudflare bot analytics, Pedro's reading). The goal is to be cited with a link in AI answers. The voice still wins: the body keeps its scene, rhythm and punchline, and the agent gets its due in the frame around it.

- `robots.txt` names every AI crawler and agent and allows it, training bots included. A named group does not inherit `User-agent: *`, so each one repeats the `Disallow` lines. Cloudflare can block AI bots at zone level whatever `robots.txt` says, and its managed robots.txt is prepended to ours. Check both with `curl -sL -o /dev/null -w '%{http_code}' -A 'GPTBot/1.2' https://digitaldias.com/blog/` (403 means blocked) and `curl -s https://digitaldias.com/robots.txt` (a `Content-Signal` header or a Cloudflare `Disallow` list means the managed file is on). Since 2026-11-06 the zone's AI Crawler and Agent access policies (Security → Settings → Bot traffic) allow Search, Training and Agents, and Bot Preference Sync is off, so the repo's `robots.txt` is the only one served.
- The deploy uploads `*.md` and `llms.txt` in their own `upload-batch` calls with an explicit UTF-8 content type, because the extension guess may not know `.md`. A new agent-facing file type gets the same treatment.
- `/llms.txt` (llmstxt.org) and an `index.md` beside every post's HTML are generated at build time from the content. Never hand-edit a copy in `src/static`. A new section or content type shows up in the `llms.txt` template.
- What agents get per post: the `tldr`, a first sentence in each `## ` section that states its claim on its own, descriptive headings, the FAQ, dated facts with numbers and versions, and the JSON-LD in `head.html`.

## Writing a new blog post

When Pedro brings an idea for a post, run these steps in order. Each ends on its completion criterion.

1. **Interview.** Ask Pedro one question at a time (`AskUserQuestion`) until you hold the post's one claim, the story or evidence behind it, and the reader it is for. Done when you can state the claim in one sentence and Pedro agrees with it.
2. **Scaffold.** `just new-post <slug>`. Done when the file exists with `draft: true`.
3. **Draft.** Load the `writing-rules` skill first, then write to the voice rules below. Use `## ` sections (at least two, so the reader tools' Chart appears). Write in ascending reading level on Microsoft's 100-400 scale (`[params.depth.levels]` in `hugo.toml`): the opening and the first section are always level 100, a gist a CEO can stop after with no prior knowledge (what it is, why it matters, what to decide); then 200 (what it can do, where it fits, a little code to make a point), 300 (how to build it, with runnable code), and 400 only when the post has internals worth explaining. Cover the whole range when the subject allows, and never skip the 100 gist. Never step back down to 100 or 200 after a 300 section, except for the closing punchline and the FAQ; a late shallow section makes the turnout land in the wrong place. Done when every section serves the one claim and every number, quote and link is real and checked. Ask Pedro for anything only he knows instead of guessing it. Then write the Norwegian version as `<post>.nb.md` (see Two languages), rebuilt from the meaning and not word for word, with code, URLs, product names and shortcode `src` unchanged and the same `## ` headings in the same order. Then run the idiom pass: a subagent on the Opus model reads `doc/nb-style.md`, edits the `.nb.md` in place and reports; never skip it, Pedro will not ask for it each time. Done when both files have equal counts of `## ` headings, fenced blocks and shortcodes and the idiom pass has run.
4. **Front matter.** Fill every field in the block above: `title` at most 60 bytes in both languages (`head.html` cuts a longer `<title>` to "..." and drops the site name; æ, ø and å count as two bytes), `description` at most 160 characters, `excerpt` one or two sentences, `categories` from the list below, specific `tags`, `featuredAlt` describing the image. Omit `readTime`.
   Every new post gets a `tldr`: the claim and its payoff in two or three plain sentences, written for a reader who stops there. Say what the reader learns or can do, not what the post covers. Word it differently from `description`: the TL;DR is visible page content (good for skimmers, featured snippets and AI answers), while `description` is the search-result snippet.
5. **Images.** Prefer Pedro's own photos or real screenshots. When the post needs an illustration, generate it locally with MakeImage (see below). Done when `featured.jpg` exists at the hero spec and every image has alt text.
6. **Positions held and Now.** The homepage sidebar and the Log's Now box should change as the writing does, so ask about them with every new post. Ask Pedro one question at a time (`AskUserQuestion`), all five, in this order, never skipped or merged:
   1. **Position.** Does the post add or sharpen a position in `[[params.positions]]`? Options: a new position the post argues, a sharper rewording of an existing one, "Keep as is". A new or reworded position records `post` (the post's path; the homepage links the position to it) and `since` (the post's month, `YYYY-MM`). Keep four to five positions; when one is added, ask which one retires.
   2. **Building** (`building`): options drafted from the post and the current value, plus "Keep as is".
   3. **Tinkering** (`tinkering`): the same.
   4. **Listening** (`data/listening.yaml`, not `hugo.toml`): run `just listening` first. It prints Pedro's five most-played artists on Spotify over the last four weeks, one per line; offer the top three names as the options, artists only (he often plays one artist at a time, so a song or album goes through "Other"). If it fails (no `SPOTIFY_CLIENT_ID` or no network), offer the current value and "Keep as is".
   5. **Annoyed by** (`annoyed_by`): one or two candidates the post or the session surfaced, plus "Keep as is".

   Pedro's own wording always goes through the built-in "Other". Done when `hugo.toml` holds his answers to the four it covers and `data/listening.yaml` has a new first entry for the fifth, the Listening pick (artist, song, and the Spotify facts fetched from the API).
7. **Check.** First the agent frame: the `tldr` exists, every `## ` heading names its topic in its first words, every section's first sentence states its claim, the post ends on a `## FAQ`, and every fact links its source. Fix the draft until all five hold. Then `just depth <post-file-name>` scores the post's reading levels (coordinate Ollama with newsstream first). Done when the opening scores level 100, the levels climb, and the turnout ("The gist ends here") sits before the first hands-on section; if not, revise the draft, not the cutoffs. Then `just check` passes, then show Pedro the draft in both languages on his running dev server (`/` and `/nb/`).
8. **Fact-check and SEO.** Run this step when Pedro says he is happy with the post, before it goes live and before the `promote-post` skill runs.
   - **Fact-check.** A fresh subagent that has not seen the drafting reads both language files and checks the post's message against the evidence. Is the claim supported by what the post shows? Does every number, quote and attribution match its primary source? Does every link answer 200 and say what the post says it says? Correct each failure in both files and tell Pedro what changed and why.
   - **SEO.** Pick the post's primary search phrase in each language, the words a reader would type. Put it in the `title` (at most 60 bytes), at the front of `description` (at most 160 characters), in the slug (rename the file and image folder before the first push, never after), and in at least one `## ` heading. Add internal links to two or three related posts and check that every image has descriptive alt text. Then run `just check` again.
   - Done when both passes are clean and Pedro has seen the changes. Pedro sets `draft: false` and decides when to commit and push; a push deploys (see the deploy race above).

### Voice

Model new posts on the 2026 posts (from `2026-04-06-…` on); the 2025 posts carry habits Pedro has since dropped.

- **Value first.** Every post gives the reader something to use: a prompt to paste into their own Claude, a code snippet that runs, a command, a checklist, a number they can reproduce. Test every snippet and prompt before it goes in, and say which versions it was tested on. A post that only reports what Pedro did, like a school report, is not done; ask what the reader can try in the next 15 minutes.
- **Talk to the reader.** Write to "you" and keep "I" for evidence ("I tested this on Ollama 0.40"), not for reminiscing. Show the excitement of a nerd who found something that works, in measured doses: one or two lines of plain enthusiasm per post ("This is the part I like"), never superlatives or exclamation marks. Lead with what the reader gets, then how.
- First person where it carries evidence, direct, dry. Pedro tells what he did, what broke, and what he concluded. Opinions are offered as his own, then reasoned ("Local won that one for me."). Humour is understated self-deprecation.
- **Norwegian, not American, in tone (both languages).** Modesty and honesty over claims stated as facts. Write as one person to another, me to you, never as a pitch: "my suggestion is", "in my sessions", "I've only checked this on". Label Pedro's own numbers and thresholds as his, from his sessions, and say where he may be wrong. No commands to leaders ("Here is the decision"), no slogans. Never invent what Pedro experienced, felt or measured; mark it for him to fill in.
- **Length.** Aim for Hugo's estimate of 6 to 8 minutes (about 1,000 words of prose plus code). Cut whole sections before trimming sentences. Give the reader a prompt to paste rather than a long script to read (Pedro, 2026-11-05: "the user can ask Claude to write it").
- Rhythm: about 12 words per sentence on average, with frequent short lines and fragments for emphasis ("Not a battery problem."). Paragraphs of two to four sentences. "Not X, but Y" contrasts recur.
- Open on a concrete scene or personal fact ("I have a drawer. You probably have one too."). End on a short punchline, then a `## FAQ` of real reader questions with `###` questions.
- Specific numbers, named tools and links over adjectives. Estimates are labelled as estimates; caveats are numeric, not hedged. Disclose edits to screenshots or data briefly.
- Titles and headings are sentence case. Titles are a claim, a question or a small story ("I tried to fix a Wi-Fi camera. I built a weather station."). A `## ` heading names its subject first, in the words a reader would search for, and any twist comes after a colon ("Browser DevTools: why F12 fails you here"); agents use headings to pick which part of a page to quote.
- The first sentence of each `## ` section states that section's claim so it reads correctly when quoted alone. The scene, the build-up and the joke come after it.
- Back claims the way the GEO study (arXiv 2311.09735) found makes pages most visible in AI answers: a quotation from a named person, a number, and a link to the primary source. Label what is Pedro's own bet rather than evidence as a bet.
- Plain punctuation: no emoji, no exclamation marks, commas or colons instead of em dashes, and no hype vocabulary.
- `{{< img >}}` for every in-post image, `{{< callout >}}` sparingly. Fenced code blocks name their language. Every fenced block gets a language label and a Copy button from `initCodeBlocks` in `main.js`, so write each snippet as something a reader can paste and run as is. Write prompts as ```` ```text ```` blocks with one paragraph or list item per line (the site wraps them and Copy returns them clean), never hard-wrapped. Hugo's Chroma classes `.k` and `.m` collide with the `.k` and `.m` utilities in `styles.css`; the `.highlight` rules reset them, so keep them.
- Norwegian quality is a fixed rule, not a request: every `.nb.md` passes the idiom pass in `doc/nb-style.md` (no calques, no split compounds such as `kontekst vindu`, no English word order, correct number and date formats, «guillemets» for quotes) before it counts as done. Developer terms Norwegians really say in English (commit, pipeline, deploy, prompt) stay.
- Every post is written in both languages: English (`en-us`) first, then Norwegian bokmål (`nb-NO`), never nynorsk. Pedro may brief in either language; the English file is the source of truth and the Norwegian file follows it. Explain Norwegian terms in English in the English version where they matter. Categories: Architecture, Azure, AI, Development, DevOps, Family, Photography. Tags are specific (`MediatR`, `Blazor`), never generic (`web`, `code`).
- HTML is allowed in Markdown (`unsafe = true`), but prefer the shortcodes.

### Images and MakeImage

- Hero: `static/images/blog/<post-file-name>/featured.jpg`, 1920×1080, JPEG ~82%, ~200–300 KB. Inline: 1200×800, ~150–200 KB. `python scripts/optimize-image.py <in> hero|inline <out>` produces both.
- MakeImage is Pedro's local image generator (`makeImage`, Krea 2 Turbo on ComfyUI, about a minute per image; run it in the background). `just cover <post-file-name> "<prompt>" [seed]` generates a landscape image and writes the optimised `featured.jpg`. For other images: `makeImage --no-input -p landscape -s <seed> -o <folder> "<prompt>"`, then `optimize-image.py`.
- Prompts are long and specific (50 to 120 words), and the model renders text in images sharply: quote the exact words, say where they appear, and say what stays blank. Add "no text" only when a picture should have none. Full recipe in `~/.claude/docs/makeimage.md`. Show Pedro the result before using it; regenerate with a new seed rather than accept a weak image.
- Photos of Pedro's children stay on Flickr; they never go on this site. Pedro's Flickr (`digitaldias`) holds landscape, dog, studio and still-life imagery.

## Promotion

- After a new post has passed step 8 (fact-check and SEO) and gone live, invoke the `promote-post` skill (`.claude/skills/promote-post/SKILL.md`) and follow it for every promotion step: Hacker News, Dev.to, Google Search Console and stats, including AI referrals.
