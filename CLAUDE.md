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

**Homepage content** is entirely in `layouts/index.html`. Dynamic values (stats, social links) come from `[params]` in `hugo.toml`. Do not create `content/_index.md`.

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

## CSP

The Content Security Policy is hardcoded in `layouts/partials/head.html`. Any new external resource (font, script, image host) requires updating the CSP there explicitly.

## Deployment

Target: **Azure Static Web Apps**. Build output is `src/public/`. The `src/isableFastRender/` directory is a Hugo server artifact — ignore it.

## Content Guidelines

- Writing: first-person, conversational but technically precise
- Categories (use existing): Architecture, Azure, AI, DevOps, Family, Photography
- Tags: specific only (e.g. `MediatR`, `Blazor`) — not generic (`web`, `code`)
- Images: hero at `static/images/blog/<post-slug>/featured.jpg`, 1920×1080, JPEG ~200–300 KB
- HTML is allowed in Markdown (`unsafe = true` in markup config)
