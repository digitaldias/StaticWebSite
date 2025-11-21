# GitHub Copilot Instructions for digitaldias.com

## Project Overview

**This is a Hugo static site** for digitaldias.com - Pedro Dias's personal portfolio and blog. The site was migrated from custom HTML/CSS/JS to Hugo for better content management and faster authoring.

## Available Prompts

You have access to specialized workflow prompts for common tasks. Use these by typing `/` in Copilot Chat:

- **`/new-blog-post`** - Complete blog post creation workflow with image planning, technical specs, front matter template, and pre-publish checklist
- **`/optimize-image`** - Image optimization guide with dimensions, formats, compression settings, brand colors for diagrams, and AI-assisted selection
- **`/deploy-checklist`** - Pre-deployment validation, build verification, deployment workflow, post-deployment checks, and rollback procedures
- **`/common-tasks`** - Quick reference for updating stats, adding social links, changing navigation, managing content sections, and routine maintenance

These prompts are in `.github/prompts/` and provide detailed, step-by-step guidance for specific workflows.

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
└── static/                   # Favicon, robots.txt, llm.txt, etc.
```

## LLM Integration

**llm.txt File:** The site includes a `/llm.txt` file (in `static/`) following the [llm.txt convention](https://llmstxt.org/). This provides structured information about the site for AI assistants and LLMs, including:
- Site purpose and owner details
- Content structure and key pages
- Technology stack
- Licensing and usage guidelines

Keep `llm.txt` updated when major site structure changes occur (new sections, content types, or technologies).

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

**Writing Style**: First-person, conversational but professional. Enthusiastic about tech, humble about experience. Topics: software architecture, Azure, .NET, Blazor, AI/ML, photography, family. Length: 800-2000 words (5-10 min read).

**SEO Requirements**: Unique `title`/`description` in front matter. Descriptive `excerpt` for sharing. Categories: Architecture, Azure, AI, Family, Photography, DevOps. Specific tags only (e.g., "Blazor", "GPT5", not generic "web").

## Blog Post Creation Workflow

### Image Planning (Do This FIRST)
When starting a blog post, immediately plan visuals:
- **Hero image**: What's the main visual concept? (landscape photo, diagram, screenshot)
- **Inline images**: What 2-3 visuals support the narrative? (every ~600-800 words)
- **Diagrams**: What concepts need visual explanation? (architecture, flows, comparisons)

### Image Count by Word Length
- **800-1200 words**: 1 hero + 1 inline
- **1200-1800 words**: 1 hero + 2-3 inline
- **1800+ words**: 1 hero + 3-4 inline + pull quote with visual

### Topic → Image Type Mapping
| Post Topic | Image Types | Mood/Style |
|------------|-------------|------------|
| Architecture/Technical | Diagrams (SVG), system screenshots, building geometry | Clean, geometric, professional |
| Azure/Cloud | Sky/cloud photos, dashboard screenshots, architecture diagrams | Expansive, modern, ethereal |
| Migration/Process | Before/after comparisons, paths/roads, timeline visuals | Progressive, transformative |
| AI/Experimental | Abstract patterns, light trails, code editor screenshots | Futuristic, curious, innovative |
| Personal/Family | Flickr candid photos, nature, travel moments | Warm, authentic, emotional |

### Technical Specifications
**Hero Images:**
- Size: 1920×1080px (16:9) or 1600×900px minimum, landscape
- Format: JPEG quality 80-85%, 72 DPI, sRGB, ~200-300KB
- Composition: Rule of thirds, room for text overlay if needed

**Inline Images:**
- Size: 1200×800px (3:2 landscape) or 800×1200px (2:3 portrait)
- Format: JPEG quality 82%, 72 DPI, ~150-200KB
- Usage: Landscape for screenshots/process, Portrait for people/details

**Diagrams/SVG:**
- Use brand colors ONLY: #BA0C2F (red), #002F8B (blue), #006600 (green), #FFD700 (gold)
- Dark backgrounds (#0a0a0a to #1a1a1a) to match theme
- Export clean (no editor metadata), group logical elements

### Storage & Front Matter
**File locations:**
- Per-post: `static/images/blog/<post-slug>/featured.jpg`
- Shared/reusable: `static/images/shared/`
- Flickr photos: Use direct CDN URLs

**Required front matter:**
```yaml
featuredImage: "/images/blog/2025-11-19-post-slug/featured.jpg"
featuredAlt: "Descriptive alt text (WHAT + WHY relevant)"
imageCredit: "© Pedro Dias" # or other attribution
```

### AI-Assisted Image Selection
When choosing between candidate images, share them with AI and ask:
- "Which fits a [serious/casual/technical] post about [topic]?"
- "Does this color palette align with Norway red/blue brand?"
- "What crop/treatment optimizes this for hero use?"
- "Should I use landscape or portrait orientation here?"

**AI can provide:**
- Composition analysis (negative space for text overlay)
- Brand color alignment feedback
- Mood/tone matching (technical vs emotional)
- Lightroom treatment suggestions (contrast, crop, color grade)

### Pre-Publish Image Checklist
- [ ] Hero image selected and optimized?
- [ ] No text walls > 600 words without visual breaks?
- [ ] All images have descriptive `alt` text (not generic)?
- [ ] File sizes under limits (hero <300KB, inline <200KB)?
- [ ] Images readable on dark background?
- [ ] Front matter includes `featuredImage`, `featuredAlt`, `imageCredit`?

**Lazy loading**: Always add `loading="lazy" decoding="async"` to `<img>` tags

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
