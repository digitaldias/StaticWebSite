# digitaldias.com - Hugo Migration

This is the Hugo version of digitaldias.com, migrated from a custom HTML/CSS/JS static site.

## What Was Migrated

### ✅ Complete Migration
- **Hugo Configuration**: Full `hugo.toml` with proper settings, taxonomies, and params
- **Design System**: All 2,132 lines of CSS preserving dual-heritage colors (Norwegian/Portuguese flags), dark glass-morphism theme, Inter + JetBrains Mono typography
- **JavaScript Features**: All interactive features including scroll reveal, animated counters, magnetic buttons, card tilt, photo lightbox, and parallax effects
- **Homepage Layout**: Complete with hero section, photo mosaic, bio, credentials, expertise, timeline, photography gallery, and contact sections
- **Blog System**: List and single templates with Markdown support and Hugo front matter
- **404 Page**: Custom animated error page with interactive tiles
- **Static Assets**: Favicons and icons copied to static folder

### 📝 Content
- **Blog Post**: Converted "How GPT5-Codex and Azure Static Websites launched digitaldias.com" to Markdown with front matter
- **Taxonomies**: Categories and tags configured for blog organization

### 🎨 Design Preserved
- **Dual Heritage Colors**: Norwegian flag (red `#BA0C2F`, blue `#002F8B`) + Portuguese flag (green `#006600`, gold `#FFD700`)
- **Dark Theme**: Glass-morphism effects with backdrop-filter
- **Typography**: Inter (sans-serif) + JetBrains Mono (monospace)
- **Animations**: Subtle, accessibility-friendly with reduced-motion support
- **Photo Mosaic Hero**: Flickr integration with grayscale filter
- **Fixed Navigation**: Always-visible with scroll detection
- **Interactive Elements**: Magnetic buttons, card tilt, animated counters

## Directory Structure

```
digitaldias-hugo/
├── hugo.toml                 # Hugo configuration
├── archetypes/              # Content templates
├── assets/
│   ├── css/
│   │   └── styles.css       # Complete design system (2,132 lines)
│   └── js/
│       └── main.js          # All JavaScript functionality
├── content/
│   └── blog/
│       ├── _index.md        # Blog section index
│       └── *.md             # Blog posts in Markdown
├── layouts/
│   ├── _default/
│   │   ├── baseof.html      # Base template
│   │   ├── taxonomy.html    # Category/tag list
│   │   └── term.html        # Individual category/tag
│   ├── blog/
│   │   ├── list.html        # Blog index
│   │   └── single.html      # Blog post
│   ├── partials/
│   │   ├── head.html        # Meta, fonts, CSS
│   │   ├── header.html      # Navigation
│   │   └── footer.html      # Footer
│   ├── index.html           # Homepage with all sections
│   └── 404.html             # Custom error page
└── static/                   # Favicon assets
```

## Running the Site

### Development Server
```bash
cd digitaldias-hugo
hugo server
```

Visit http://localhost:1313/

### Build for Production
```bash
hugo
```

Output will be in `public/` directory.

## Key Features

### Homepage Sections
1. **Hero Section**: Photo mosaic background, animated title, description, CTA buttons, stat counters
2. **Bio Section**: Current role, signature strengths
3. **Credentials Section**: Microsoft certifications, volunteer work, languages
4. **Expertise Section**: Software architecture, content creation, family life cards with tech tags
5. **Timeline Section**: Professional journey from 1984 to present
6. **Photography Section**: Masonry gallery with Flickr photos and lightbox
7. **Contact Section**: Email card, social media grid (LinkedIn, GitHub, YouTube x2, Flickr, Facebook)

### Blog Features
- Markdown content with HTML support
- Front matter: title, date, description, excerpt, readTime, categories, tags
- List view with cards showing meta, title, excerpt
- Single view with full content and navigation CTAs
- Category and tag taxonomies

### JavaScript Features
- Loading screen with animated spinner
- Scroll reveal animations (IntersectionObserver)
- Animated stat counters with easing
- Magnetic button effects
- Card tilt on mouse movement
- Photo gallery with lazy loading
- Lightbox modal for images
- Parallax effects on background tiles
- Navigation active state tracking
- Mobile hamburger menu
- Accessibility: reduced-motion support, ARIA labels, keyboard navigation

### Performance
- Hugo Pipes for CSS/JS minification and fingerprinting
- Lazy loading for images
- Preconnect for Google Fonts
- Optimized animations with requestAnimationFrame
- Content Security Policy headers

## Content Authoring

### Creating a New Blog Post

1. Create a new Markdown file in `content/blog/`:
```bash
hugo new blog/2025-11-19-my-new-post.md
```

2. Edit the front matter:
```yaml
---
title: "Your Post Title"
date: 2025-11-19
draft: false
description: "SEO description"
excerpt: "Teaser for blog listings"
readTime: "5 minute read"
categories: ["Architecture", "Azure"]
tags: ["Blazor", "DevOps"]
author: "Pedro Dias"
---
```

3. Write content in Markdown (HTML is supported via `unsafe = true` in config)

4. The post will automatically appear in the blog index at `/blog/`

### Updating Homepage Content

Homepage content is embedded in `layouts/index.html`. To update:
- **Stats**: Edit `[params.stats]` in `hugo.toml`
- **Social Links**: Edit `[params.social]` in `hugo.toml`
- **Text Content**: Edit directly in `layouts/index.html`
- **Photos**: Update Flickr URLs in the template

## Deployment

### Azure Static Web Apps (Recommended)
```bash
# Build the site
hugo

# Upload to Azure Storage
az storage blob upload-batch \
  --source public \
  --destination '$web' \
  --account-name <storage-account>
```

### GitHub Pages
Add `.github/workflows/hugo.yml`:
```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.152.2'
          extended: true
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## Customization

### Colors
Edit CSS variables in `assets/css/styles.css`:
```css
--norway-red: #BA0C2F;
--norway-blue: #002F8B;
--portugal-green: #006600;
--portugal-gold: #FFD700;
```

### Typography
Update Google Fonts link in `layouts/partials/head.html` and CSS variables in `styles.css`

### Navigation
Edit `layouts/partials/header.html`

### Footer
Edit `layouts/partials/footer.html`

## Browser Support
- Modern browsers with CSS Grid, Flexbox, CSS Custom Properties
- IntersectionObserver (Safari 12.1+, Chrome 51+, Firefox 55+)
- backdrop-filter (Safari 9+, Chrome 76+, Firefox 103+)

## Accessibility
- WCAG 2.1 Level AA compliant
- Skip to main content link
- ARIA labels and live regions
- Semantic HTML structure
- Keyboard navigation
- Reduced motion support (`prefers-reduced-motion`)
- Focus-visible styles
- Screen reader announcements

## Migration Notes

### Preserved from Original
- ✅ All CSS (2,132 lines) with exact color values
- ✅ All JavaScript functionality
- ✅ Exact same visual design
- ✅ Photo mosaic hero with Flickr
- ✅ Animated counters
- ✅ Timeline visualization
- ✅ Photography gallery with lightbox
- ✅ Fixed navigation
- ✅ Custom 404 page
- ✅ Accessibility features

### Hugo-Specific Improvements
- ✨ Markdown-based blog authoring (easier than HTML)
- ✨ Front matter for metadata
- ✨ Built-in taxonomies (categories, tags)
- ✨ Asset pipeline (minification, fingerprinting)
- ✨ Template partials for reusability
- ✨ Fast rebuilds with Hugo's speed
- ✨ RSS feed auto-generated
- ✨ SEO-friendly URLs

### Future Enhancements
- [ ] Create shortcodes for repeated elements (stat cards, tech tags)
- [ ] Add multilingual support (Portuguese, Norwegian, English)
- [ ] Implement search functionality
- [ ] Add RSS feed styling
- [ ] Create archive pages by year/month
- [ ] Add reading time calculation
- [ ] Implement related posts
- [ ] Add social sharing buttons

## License
© 2025 Pedro Dias. All rights reserved.

## Contact
- Email: pedro.dias@tradesolution.no
- LinkedIn: https://linkedin.com/in/digitaldias
- GitHub: https://github.com/digitaldias
- Website: https://digitaldias.com
