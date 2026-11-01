# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Repeatable commands live in the root `justfile` (`just --list`): `new-post`, `cover`, `check`. Add a recipe there rather than re-deriving a command twice.

```bash
just new-post my-slug     # src/content/blog/<today>-my-slug.md from src/archetypes/blog.md
just check                # build with drafts into %TEMP%, never src/public
cd src && hugo server -D  # dev server at http://localhost:1313
```

A Hugo dev server Pedro already has running is his. Reuse it; never start a second one on the same port or restart his.

## Architecture

This is a **Hugo static site**. The entire Hugo project lives under `src/` — not the repo root.

```
src/
├── hugo.toml          # Config (use this — not config.toml or config.yaml)
├── assets/
│   ├── css/styles.css # Full design system, ~1715 lines — do NOT break CSS variables
│   └── js/main.js     # All interactive JS (vanilla ES6+)
├── content/           # Markdown posts and pages
│   └── blog/          # Blog posts (filename: YYYY-MM-DD-slug.md)
├── layouts/           # Go HTML templates
│   ├── _default/      # baseof.html, taxonomy/term fallbacks
│   ├── blog/          # list.html + single.html
│   ├── partials/      # head.html, header.html, footer.html
│   ├── shortcodes/    # callout, img, pullquote (see below)
│   └── index.html     # Homepage — all sections hardcoded here
├── static/            # Favicons, robots.txt, llm.txt, images/
└── public/            # Build output — do not edit
```

**Homepage content** is entirely in `layouts/index.html`. Dynamic values (stats, social links) come from `[params]` in `hugo.toml` — edit there, not in the template. Do not create `content/_index.md`.

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

Without `featuredImage`, the OG image falls back to `images/dog-hero.jpg`.

Each post's `## ` headings drive the reader tools in `main.js`: the Chart (section route rail and course strip), the resume slip and Read stamps (browser `localStorage` key `dd-reading-log`), and § / ¶ passage links. A post needs at least two `## ` sections for the Chart to appear.

`lastmod` comes from git history (`enableGitInfo`, with `fetch-depth: 0` in CI). A post shows "Revised" in its folio line and a Revision record once its last commit lands more than 7 days after `date`. Any commit to a post counts, so never sweep mechanical front-matter edits across all posts: every one of them would claim a revision that day.

## Available Shortcodes

- `{{< callout >}}` — highlighted callout block (four older posts carry a TL;DR in one; new posts use the `tldr` front-matter field instead)
- `{{< pullquote >}}` — pull quote styling
- `{{< img >}}` — image with caption support

Mermaid was fully removed — do not add it back.

## Design System — Do Not Break

Theme: aged-map/navigator — light parchment background, deep navy accents. ~1715 lines.

```css
--bg:          #f0ece1   /* parchment */
--ink:         #161a1e   /* body text */
--accent:      #b83c2c   /* primary red */
--accent-cool: #162447   /* deep navy */
--accent-map:  #2e6ebc   /* map blue */
--accent-gold: #8a6a1c   /* gold */
--transition:  150ms ease
```

Typography: Lora (display) + Barlow (body) + JetBrains Mono (code).

All animations must respect `prefers-reduced-motion`. Use `requestAnimationFrame` for scroll/animation work.

CSS conventions: mobile-first, breakpoints at 480px / 640px / 768px / 900px. Use existing variables only — don't add new colors or tokens. Transitions: `transition: ... var(--transition)`.

Hugo template conventions: use `{{- -}}` for whitespace control; guard optional params with `{{ with .Params.excerpt }}{{ . }}{{ end }}`; internal links via `.RelPermalink`; render HTML content via `{{ .Content | safeHTML }}`.

## CSP

The Content Security Policy is hardcoded in `layouts/partials/head.html`. Any new external resource (font, script, image host) requires updating the CSP there explicitly.

## Deployment

Push to `main` triggers `.github/workflows/deploy-to-azure.yml`, which builds with `hugo --minify` and uploads `src/public/` to Azure Blob Storage (`$web` container) via `az storage blob upload-batch`. Requires `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_KEY` secrets in the repo. Cloudflare sits in front of the storage origin as CDN/DNS for the custom domain.

The `src/isableFastRender/` directory is a Hugo server artifact — ignore it.

### Known deploy race: do not verify a fresh deploy against the live CDN URL

`upload-batch` uploads many files without guaranteeing order, so a page's HTML can become servable a moment before every fingerprinted asset it references (`css/styles.min.<hash>.css`, `js/main.min.<hash>.js`) is actually live at the origin. Cloudflare caches static-looking extensions (`.css`, `.js`, `.jpg`, …) **by default, including non-2xx responses**, and this site's zone currently returns `Cache-Control: max-age=14400` on those — so a single request that lands in that few-second window gets a 404 pinned at the edge for up to 4 hours, for everyone, until purged. This has caused a real outage (2026-09-19): the live site rendered unstyled because `styles.min.*.css` 404'd once, immediately after deploy, and stayed cached.

Rules that follow from this:

- **Never curl or open the live custom-domain URL immediately after a deploy finishes**, especially the fingerprinted CSS/JS paths. Checking is what poisons it. If you must confirm a deploy landed, read the `az storage blob upload-batch` step's JSON output in the GitHub Actions log (it lists every blob with its `eTag` and `Last Modified`) — that confirms the origin has the file without ever touching the CDN.
- **Bumping the Hugo fingerprint is not a reliable fix on its own.** A new hash is a new URL Cloudflare has never cached, which sidesteps an already-poisoned entry — but the new URL can be raced and poisoned the exact same way (an uptime monitor, Cloudflare's own analytics beacon, or your own verification curl can all do it). Don't chase this by re-bumping and re-checking in a loop.
- **The only deterministic fix once a URL is poisoned is a Cloudflare cache purge** (dashboard: Caching → Configuration → Purge Cache — purge the specific URL, or Purge Everything). Claude Code has no Cloudflare API token in this environment and cannot do this; ask Pedro to purge when this happens.
- **The real fix belongs in Cloudflare, not this repo**: a Cache Rule that bypasses cache for non-2xx origin responses (e.g. "Bypass cache when Origin Status Code ≥ 400") would prevent this class of bug entirely. This needs to be set up once in the Cloudflare dashboard — flag it to Pedro rather than trying to work around it repo-side again.
- Hugo's minifier strips comments before fingerprinting, so a comment-only edit to `styles.css`/`main.js` does **not** change the hash. Bumping the fingerprint on purpose requires an actual rule/value change.

## Writing a new blog post

When Pedro brings an idea for a post, run these steps in order. Each ends on its completion criterion.

1. **Interview.** Ask Pedro one question at a time (`AskUserQuestion`) until you hold the post's one claim, the story or evidence behind it, and the reader it is for. Done when you can state the claim in one sentence and Pedro agrees with it.
2. **Scaffold.** `just new-post <slug>`. Done when the file exists with `draft: true`.
3. **Draft.** Load the `writing-rules` skill first, then write to the voice rules below. Use `## ` sections (at least two, so the reader tools' Chart appears). Done when every section serves the one claim and every number, quote and link is real and checked. Mark anything unverified for Pedro instead of guessing.
4. **Front matter.** Fill every field in the block above: `description` at most 160 characters, `excerpt` one or two sentences, `categories` from the list below, specific `tags`, `featuredAlt` describing the image. Omit `readTime`.
   Every new post gets a `tldr`: the claim and its payoff in two or three plain sentences, written for a reader who stops there. Say what the reader learns or can do, not what the post covers. Word it differently from `description`: the TL;DR is visible page content (good for skimmers, featured snippets and AI answers), while `description` is the search-result snippet.
5. **Images.** Prefer Pedro's own photos or real screenshots. When the post needs an illustration, generate it locally with MakeImage (see below). Done when `featured.jpg` exists at the hero spec and every image has alt text.
6. **Positions held and Now.** Every new post is a chance to refresh the homepage sidebar, so ask about it every time. Ask Pedro one question at a time (`AskUserQuestion`): first whether the post adds or sharpens a position in `[[params.positions]]`, then whether any `[params.currently]` field (Building, Tinkering, Listening, Annoyed by) has changed. Each question offers two or three concrete options drafted from the post and the current values (a new position the post argues, a sharper rewording of an existing one, the position it replaces, "Keep as is"), with Pedro's own wording through the built-in "Other". A new or reworded position records `since` (the post's month) and `post` (the post's path) so the About page can link to where it is argued. Keep four to five positions; when one is added, ask which one retires. Done when `hugo.toml` holds Pedro's answers or he chose to keep everything.
7. **Check.** `just check` passes, then show Pedro the draft on his running dev server. Pedro sets `draft: false` and decides when to commit and push; a push deploys (see the deploy race above).

### Voice

Model new posts on the 2026 posts (from `2026-04-06-…` on); the 2025 posts carry habits Pedro has since dropped.

- First person, direct, dry. Pedro tells what he did, what broke, and what he concluded. Opinions are stated flat, then reasoned ("Local wins that one."). Humour is understated self-deprecation.
- Rhythm: about 12 words per sentence on average, with frequent short lines and fragments for emphasis ("Not a battery problem."). Paragraphs of two to four sentences. "Not X, but Y" contrasts recur.
- Open on a concrete scene or personal fact ("I have a drawer. You probably have one too."). End on a short punchline, then a `## FAQ` of real reader questions with `###` questions.
- Specific numbers, named tools and links over adjectives. Estimates are labelled as estimates; caveats are numeric, not hedged. Disclose edits to screenshots or data briefly.
- Titles and headings are sentence case. Titles are a claim, a question or a small story ("I tried to fix a Wi-Fi camera. I built a weather station."); headings are descriptive with a light twist ("Why F12 fails you here").
- Plain punctuation: no emoji, no exclamation marks, commas or colons instead of em dashes, and no hype vocabulary.
- `{{< img >}}` for every in-post image, `{{< callout >}}` sparingly. Fenced code blocks name their language.
- Posts are in English. Categories: Architecture, Azure, AI, Development, DevOps, Family, Photography. Tags are specific (`MediatR`, `Blazor`), never generic (`web`, `code`).
- HTML is allowed in Markdown (`unsafe = true`), but prefer the shortcodes.

### Images and MakeImage

- Hero: `static/images/blog/<post-file-name>/featured.jpg`, 1920×1080, JPEG ~82%, ~200–300 KB. Inline: 1200×800, ~150–200 KB. `python scripts/optimize-image.py <in> hero|inline <out>` produces both.
- MakeImage is Pedro's local image generator (`makeImage`, Krea 2 Turbo on ComfyUI, about a minute per image; run it in the background). `just cover <post-file-name> "<prompt>" [seed]` generates a landscape image and writes the optimised `featured.jpg`. For other images: `makeImage --no-input -p landscape -s <seed> -o <folder> "<prompt>"`, then `optimize-image.py`.
- Prompts end with "no text"; generated letters come out garbled. Show Pedro the result before using it; regenerate with a new seed rather than accept a weak image.
- Photos of Pedro's children stay on Flickr; they never go on this site. Pedro's Flickr (`digitaldias`) holds 172 photos for landscape, dog, studio and still-life imagery.
- Keep `static/llm.txt` updated when the site structure changes (new sections, content types, or technologies).
