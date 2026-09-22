# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All Hugo commands must be run from the `src/` directory:

```bash
cd src
hugo server          # Dev server at http://localhost:1313
hugo --minify        # Production build → src/public/
hugo new blog/$(date +%Y-%m-%d)-post-title.md   # New post from archetype
```

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
readTime: "5 minute read"
categories: ["Architecture", "Azure"]   # First category drives breadcrumbs and article:section
tags: ["Blazor", "DevOps"]              # Drive OG article:tag and JSON-LD keywords
author: "Pedro Dias"
featuredImage: "/images/blog/YYYY-MM-DD-slug/featured.jpg"  # Drives OG image + JSON-LD image
featuredAlt: "Descriptive alt text"
imageCredit: "© Pedro Dias"
---
```

Without `featuredImage`, the OG image falls back to `images/dog-hero.jpg`.

## Available Shortcodes

- `{{< callout >}}` — highlighted callout block
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

## Content Guidelines

- Writing: first-person, conversational but technically precise
- Categories (use existing): Architecture, Azure, AI, DevOps, Family, Photography
- Tags: specific only (e.g. `MediatR`, `Blazor`) — not generic (`web`, `code`)
- Images: hero at `static/images/blog/<post-slug>/featured.jpg`, 1920×1080, JPEG 80–85% quality, ~200–300 KB; inline images 1200×800, ~150–200 KB. Diagrams use brand color tokens on light parchment backgrounds.
- HTML is allowed in Markdown (`unsafe = true` in markup config)
- Keep `static/llm.txt` updated when major site structure changes (new sections, content types, or technologies)
