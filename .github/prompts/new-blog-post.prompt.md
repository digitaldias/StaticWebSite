---
description: Create a new blog post with image planning workflow
---

# New Blog Post Creation Workflow

This prompt guides you through creating a new blog post for digitaldias.com with proper image planning.

## Step 1: Image Planning (Do This FIRST)

Before writing a single word, plan your visuals:

### Visual Concept Questions
- **Hero image**: What's the main visual concept? (landscape photo, diagram, screenshot)
- **Inline images**: What 2-3 visuals support the narrative? (every ~600-800 words)
- **Diagrams**: What concepts need visual explanation? (architecture, flows, comparisons)

### Image Count by Word Length
| Word Count | Images Needed |
|------------|---------------|
| 800-1200 words | 1 hero + 1 inline |
| 1200-1800 words | 1 hero + 2-3 inline |
| 1800+ words | 1 hero + 3-4 inline + pull quote with visual |

### Topic → Image Type Mapping
| Post Topic | Image Types | Mood/Style |
|------------|-------------|------------|
| Architecture/Technical | Diagrams (SVG), system screenshots, building geometry | Clean, geometric, professional |
| Azure/Cloud | Sky/cloud photos, dashboard screenshots, architecture diagrams | Expansive, modern, ethereal |
| Migration/Process | Before/after comparisons, paths/roads, timeline visuals | Progressive, transformative |
| AI/Experimental | Abstract patterns, light trails, code editor screenshots | Futuristic, curious, innovative |
| Personal/Family | Flickr candid photos, nature, travel moments | Warm, authentic, emotional |

## Step 2: Technical Specifications

### Hero Images
- **Size**: 1920×1080px (16:9) or 1600×900px minimum, landscape
- **Format**: JPEG quality 80-85%, 72 DPI, sRGB
- **File size**: ~200-300KB
- **Composition**: Rule of thirds, room for text overlay if needed

### Inline Images
- **Size**: 1200×800px (3:2 landscape) or 800×1200px (2:3 portrait)
- **Format**: JPEG quality 82%, 72 DPI
- **File size**: ~150-200KB
- **Usage**: Landscape for screenshots/process, Portrait for people/details

### Diagrams/SVG
- **Colors**: Use brand colors ONLY
  - `#BA0C2F` (Norway red)
  - `#002F8B` (Norway blue)
  - `#006600` (Portugal green)
  - `#FFD700` (Portugal gold)
- **Background**: Dark (#0a0a0a to #1a1a1a) to match theme
- **Export**: Clean (no editor metadata), group logical elements

## Step 3: File Storage

### Directory Structure
```
static/images/blog/<post-slug>/
├── featured.jpg          # Hero image
├── inline-01.jpg         # First inline image
├── inline-02.jpg         # Second inline image
└── diagram.svg           # Architecture diagram
```

### Shared/Reusable Images
```
static/images/shared/
├── common-pattern.svg
└── reusable-screenshot.jpg
```

### Flickr Photos
Use direct CDN URLs (no local copy needed):
```
https://live.staticflickr.com/.../<photo-id>_<size-suffix>.jpg
```

## Step 4: Create Post File

```bash
cd e:/dev/private/digitaldias.com/src
hugo new blog/$(date +%Y-%m-%d)-post-title.md
```

## Step 5: Front Matter Template

```yaml
---
title: "Your Post Title"
date: 2025-11-21
draft: false
description: "SEO meta description (150-160 characters)"
excerpt: "Teaser shown in blog listings (200-250 characters)"
readTime: "5 minute read"
categories: ["Architecture", "Azure", "AI"]
tags: ["Blazor", "DevOps", "Codex"]
author: "Pedro Dias"
featuredImage: "/images/blog/2025-11-21-post-slug/featured.jpg"
featuredAlt: "Descriptive alt text (WHAT + WHY relevant)"
imageCredit: "© Pedro Dias"
---
```

## Step 6: AI-Assisted Image Selection

When choosing between candidate images, ask AI:
- "Which fits a [serious/casual/technical] post about [topic]?"
- "Does this color palette align with Norway red/blue brand?"
- "What crop/treatment optimizes this for hero use?"
- "Should I use landscape or portrait orientation here?"

**AI can provide:**
- Composition analysis (negative space for text overlay)
- Brand color alignment feedback
- Mood/tone matching (technical vs emotional)
- Lightroom treatment suggestions (contrast, crop, color grade)

## Step 7: Content Guidelines

**Writing Style**: First-person, conversational but professional. Enthusiastic about tech, humble about experience.

**Topics**: Software architecture, Azure, .NET, Blazor, AI/ML, photography, family.

**Length**: 800-2000 words (5-10 min read)

**SEO**: Unique title/description, descriptive excerpt, specific tags only.

## Step 8: Pre-Publish Checklist

- [ ] Hero image selected and optimized?
- [ ] No text walls > 600 words without visual breaks?
- [ ] All images have descriptive `alt` text (not generic)?
- [ ] File sizes under limits (hero <300KB, inline <200KB)?
- [ ] Images readable on dark background?
- [ ] Front matter includes `featuredImage`, `featuredAlt`, `imageCredit`?
- [ ] All `<img>` tags have `loading="lazy" decoding="async"`?
- [ ] Hugo builds without errors (`hugo` command)?
- [ ] Preview in browser looks correct (`hugo server`)?

## Step 9: Build & Deploy

```bash
# Test locally
hugo server

# Build for production
hugo --minify

# Deploy (via GitHub Actions on push to main)
git add .
git commit -m "Add blog post: <title>"
git push origin main
```

---

**Remember**: Images are NOT an afterthought. Plan them FIRST, then write around them.
