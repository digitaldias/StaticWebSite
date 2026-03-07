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
│   ├── css/styles.css # Full design system, ~2100 lines — do NOT break CSS variables
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

Colors are brand-locked to Pedro's dual Norwegian/Portuguese heritage:

```css
--norway-red: #BA0C2F    /* primary */
--norway-blue: #002F8B   /* secondary */
--portugal-green: #006600
--portugal-gold: #FFD700
```

Theme: dark glass-morphism (`backdrop-filter: blur`). Typography: Inter (body) + JetBrains Mono (code).

All animations must respect `prefers-reduced-motion`. Use `requestAnimationFrame` for scroll/animation work.

CSS conventions: mobile-first, breakpoints at 480px / 768px / 1200px. Use existing variables only — don't add new colors. Glass-morphism pattern: `backdrop-filter: blur(var(--blur-md))`. Transitions: `transition: all var(--transition-normal)`.

Hugo template conventions: use `{{- -}}` for whitespace control; guard optional params with `{{ with .Params.excerpt }}{{ . }}{{ end }}`; internal links via `.RelPermalink`; render HTML content via `{{ .Content | safeHTML }}`.

## CSP

The Content Security Policy is hardcoded in `layouts/partials/head.html`. Any new external resource (font, script, image host) requires updating the CSP there explicitly.

## Deployment

Push to `main` triggers `.github/workflows/deploy-to-azure.yml`, which builds with `hugo --minify` and uploads `src/public/` to Azure Blob Storage (`$web` container) via `az storage blob upload-batch`. Requires `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_KEY` secrets in the repo.

The `src/isableFastRender/` directory is a Hugo server artifact — ignore it.

## Content Guidelines

- Writing: first-person, conversational but technically precise
- Categories (use existing): Architecture, Azure, AI, DevOps, Family, Photography
- Tags: specific only (e.g. `MediatR`, `Blazor`) — not generic (`web`, `code`)
- Images: hero at `static/images/blog/<post-slug>/featured.jpg`, 1920×1080, JPEG 80–85% quality, ~200–300 KB; inline images 1200×800, ~150–200 KB. Diagrams use brand colors only on dark backgrounds (#0a0a0a–#1a1a1a).
- HTML is allowed in Markdown (`unsafe = true` in markup config)
- Keep `static/llm.txt` updated when major site structure changes (new sections, content types, or technologies)
