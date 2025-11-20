# GitHub Copilot Instructions for digitaldias.com

## Project Overview

**This is a Hugo static site** for digitaldias.com - Pedro Dias's personal portfolio and blog. The site was migrated from custom HTML/CSS/JS to Hugo for better content management and faster authoring.

## Critical: This is a Hugo Site

- **Framework**: Hugo (static site generator)
- **Content**: Markdown files with YAML front matter in `content/`
- **Templates**: Go HTML templates in `layouts/`
- **Assets**: CSS/JS in `assets/` (processed by Hugo Pipes)
- **Static files**: Favicons, images in `static/`
- **Configuration**: `hugo.toml` (not `config.toml` or `config.yaml`)

**Do NOT** suggest custom HTML files in root or `src/` folder - this is Hugo, content goes in `content/`, layouts in `layouts/`.

## Design System - Dual Heritage Theme

### Brand Identity
The site celebrates Pedro's Norwegian and Portuguese heritage through its color palette:

**Norwegian Flag Colors:**
```css
--norway-red: #BA0C2F      /* Primary brand color */
--norway-blue: #002F8B     /* Secondary brand color */
--norway-white: #FFFFFF
```

**Portuguese Flag Colors:**
```css
--portugal-green: #006600  /* Accent color */
--portugal-red: #FF0000    /* Danger/alert color */
--portugal-gold: #FFD700   /* Highlight color */
```

**DO NOT** change these color values - they're core to the brand identity.

### Visual Style
- **Theme**: Dark mode with glass-morphism effects
- **Typography**: 
  - Sans-serif: `Inter` (weights: 300-900)
  - Monospace: `JetBrains Mono` (weights: 400-600)
- **Design patterns**: Backdrop-filter blur, subtle shadows, smooth animations
- **Accessibility**: WCAG 2.1 Level AA compliant with `prefers-reduced-motion` support

## Content Structure

### Blog Posts
Create blog posts in `content/blog/` with this front matter:

```yaml
---
title: "Your Post Title"
date: 2025-11-19
draft: false
description: "SEO meta description"
excerpt: "Teaser shown in blog listings"
readTime: "5 minute read"
categories: ["Architecture", "Azure", "AI"]
tags: ["Blazor", "DevOps", "Codex"]
author: "Pedro Dias"
---
```

- **Filename format**: `YYYY-MM-DD-slug.md` (e.g., `2025-11-19-my-post.md`)
- **Content**: Write in Markdown (HTML is allowed via `unsafe = true` setting)
- **Images**: Reference from `static/` or use external URLs (Flickr for photos)

### Homepage Content
- Homepage sections are in `layouts/index.html`
- Dynamic data (stats, social links) comes from `hugo.toml` under `[params]`
- **DO NOT** create `content/_index.md` for homepage - layout handles everything

## Hugo Commands

```bash
# Development server
hugo server                    # Serves at http://localhost:1313

# Production build
hugo                          # Output in public/

# Create new blog post
hugo new blog/2025-11-19-title.md
```

## File Organization

```
digitaldias-hugo/
├── hugo.toml                 # Configuration (use this, not config.yaml)
├── assets/
│   ├── css/styles.css       # Main stylesheet (2,132 lines)
│   └── js/main.js           # Interactive features
├── content/
│   └── blog/                # Blog posts as Markdown
├── layouts/
│   ├── index.html           # Homepage (all sections)
│   ├── blog/                # Blog templates
│   ├── partials/            # Reusable components
│   └── _default/            # Base templates
└── static/                   # Favicon, robots.txt, etc.
```

## JavaScript Features

The site has rich JavaScript interactivity in `assets/js/main.js`:

- **Loading screen**: Animated spinner on page load
- **Scroll reveal**: IntersectionObserver-based animations
- **Stat counters**: Animated counting with easing
- **Magnetic buttons**: Subtle hover movement
- **Card tilt**: 3D tilt effect on mouse movement
- **Photo gallery**: Lazy loading + lightbox modal
- **Parallax**: Background tile movement
- **Navigation**: Active state tracking, mobile menu

Mermaid diagrams were previously enabled via a shortcode and a `mermaid-init.js` module. This feature has been fully deprecated and all related assets and shortcodes have been removed. Do NOT add Mermaid (or similar diagram auto-rendering libraries) back into the project unless explicitly reinstated in future requirements.

**Respect `prefers-reduced-motion`** - all animations must check for this preference.

## Coding Conventions

### Hugo Templates
- Use `{{- -}}` for whitespace control
- Always check if parameters exist: `{{ with .Params.excerpt }}{{ . }}{{ end }}`
- Use `RelPermalink` for internal links (not `Permalink`)
- Safe HTML when needed: `{{ .Content | safeHTML }}`

### CSS
- Use existing CSS variables - don't add new colors
- Mobile-first responsive design (breakpoints: 480px, 768px, 1200px)
- Glass-morphism pattern: `backdrop-filter: blur(var(--blur-md))`
- Smooth transitions: `transition: all var(--transition-normal)`

### JavaScript
- ES6+ syntax is fine (no IE11 support needed)
- Use `requestAnimationFrame` for animations
- Always include ARIA labels for interactive elements
- Debounce/throttle expensive operations (scroll, resize)

## Deployment

**Target**: Azure Static Web Apps (or Azure Storage Static Websites)

```bash
# Build for production
hugo --minify

# Deploy to Azure (example)
az storage blob upload-batch \
  --source public \
  --destination '$web' \
  --account-name digitaldias
```

**Important**: 
- Set `baseURL` in `hugo.toml` to production URL before building
- Ensure CSP headers allow Flickr images (`live.staticflickr.com`)
- Test 404 page behavior in production

## Content Guidelines

### Blog Writing Style
- **Voice**: First-person, conversational but professional
- **Tone**: Enthusiastic about technology, humble about experience
- **Topics**: Software architecture, Azure, .NET, Blazor, Avalonia, AI/ML, photography, family
- **Length**: 800-2000 words ideal (5-10 minute read)

### SEO Requirements
- Unique `title` and `description` in front matter
- Descriptive `excerpt` for social sharing
- Categories limited to: Architecture, Azure, AI, Family, Photography, DevOps
- Use specific tags (e.g., "Blazor", "GPT5", "Codex", not generic "web")

## Image Handling

- **Personal photos**: Hosted on Flickr, reference with full URL
- **Screenshots/diagrams**: Place in `static/images/blog/`
- **Hero photos**: Photo mosaic uses 6 Flickr images (defined in `layouts/index.html`)
- **Lazy loading**: Always include `loading="lazy" decoding="async"`

## Accessibility Standards

- Skip to main content link (first focusable element)
- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- ARIA labels on all interactive elements
- Keyboard navigation for all features
- `aria-live` regions for dynamic content (stat counters)
- Focus-visible styles (not just `:focus`)
- Alt text for all images (empty `alt=""` for decorative)

## Performance Targets

- **Lighthouse Score**: 90+ in all categories
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Asset optimization**: Hugo Pipes minifies/fingerprints CSS/JS
- **Image optimization**: Use Flickr's `_c.jpg` size variants (800px width)

## Testing Checklist

Before committing changes:
- [ ] Homepage renders all sections correctly
- [ ] Blog index shows all posts
- [ ] Blog single post page displays properly
- [ ] 404 page works with animated tiles
- [ ] Navigation active states work
- [ ] Mobile menu opens/closes
- [ ] Photo gallery lightbox functions
- [ ] Stat counters animate
- [ ] All interactive effects work
- [ ] `hugo` builds without errors
- [ ] No console errors in browser

## Common Tasks

### Add a New Blog Post
```bash
hugo new blog/$(date +%Y-%m-%d)-post-title.md
# Edit front matter and content
# Post appears automatically in /blog/
```

### Update Stats in Hero Section
Edit `hugo.toml`:
```toml
[params.stats]
  age = 41
  photos = 172
  channels = 2
  family = "∞"
```

### Add Social Link
Edit `hugo.toml`:
```toml
[params.social]
  linkedin = "https://linkedin.com/in/digitaldias"
  github = "https://github.com/digitaldias"
  # Add new platform here
```

### Modify Navigation
Edit `layouts/partials/header.html` - maintain glass-morphism styling

## Brand Voice Examples

✅ **Good**: "Crafting digital experiences since 1984"
✅ **Good**: "As Chief Architect at Tradesolution AS and a former Microsoft technology evangelist..."
✅ **Good**: "A never-ending curiosity keeps me experimenting"

❌ **Avoid**: Corporate jargon, buzzword bingo, excessive formality
❌ **Avoid**: Claiming expertise in everything
❌ **Avoid**: Losing the personal, human touch

## Key Contact Information

- **Email**: pedro.dias@tradesolution.no
- **Location**: Frogner, Norway
- **Company**: Tradesolution AS (Chief Architect)
- **LinkedIn**: linkedin.com/in/digitaldias
- **GitHub**: github.com/digitaldias
- **Flickr**: flickr.com/photos/digitaldias
- **YouTube**: @digitaldias (tech), @digitalhome (family)

## License & Copyright

© 2025 Pedro Dias. All rights reserved.

When generating content or suggesting changes, respect copyright and don't suggest copying code from other projects without attribution.

---

**Remember**: This is a Hugo site. All content must follow Hugo conventions. Suggest Markdown files in `content/`, templates in `layouts/`, not custom HTML in random places.
