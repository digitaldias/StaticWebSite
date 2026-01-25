# New Blog Post Creation Workflow

This command guides you through creating a new blog post for digitaldias.com with proper image planning.

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
- **Centering**: Hero images are automatically centered horizontally - ensure image is properly composed for center alignment
- **Aspect ratio**: Maintain consistent aspect ratio; images will use `object-fit: contain` to preserve aspect ratio

### Inline Images
- **Size**: 1200×800px (3:2 landscape) or 800×1200px (2:3 portrait)
- **Format**: JPEG quality 82%, 72 DPI (or PNG if transparency needed)
- **File size**: ~150-200KB
- **Usage**: Landscape for screenshots/process, Portrait for people/details
- **PNG Transparency**: PNG images with transparency are fully supported. Images in `static/` folder preserve transparency automatically. Transparency works best on dark backgrounds.

### Diagrams/SVG
- **Colors**: Use LIMITED color palette - only 3 primary colors + a few secondaries
  - Primary: `#3B82F6` (Blue-500) - Links, CTAs, active states
  - Secondary: `#8B5CF6` (Violet-500) - Highlights, special elements
  - Accent: `#10B981` (Green-500) - Success states, callouts
  - **Avoid**: Using all colors at once (no "Christmas tree" effect)
  - Legacy brand colors available but use sparingly:
    - `#BA0C2F` (Norway red)
    - `#002F8B` (Norway blue)
    - `#006600` (Portugal green)
    - `#FFD700` (Portugal gold) - Use minimally, avoid yellow on yellow
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
title: "Your post title in sentence case"
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

**IMPORTANT**: 
- **Title Case Rule**: Use **sentence case** for titles (first word capitalized, rest lowercase unless proper nouns). Example: "Agentic development in practice: Cursor + GitHub Actions" NOT "Agentic Development In Practice: Cursor + GitHub Actions"
- This applies to ALL headers throughout the post as well - use sentence case for h2, h3, etc.

### Content Structure Template

```markdown
---
title: "Your post title in sentence case"
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

{{< callout type="success" title="TL;DR" >}}
Your 2-3 sentence summary of the entire post. Highlight the key outcome and value proposition. This appears right after the hero image.
{{< /callout >}}

## First section heading

Your content here...

---

## Try It Yourself

Action items and next steps for readers.

## References

Technologies and tools mentioned in this post:

- **[Tool Name](https://example.com)** - Brief description of what it is
- **[Another Tool](https://example.com)** - Brief description
- **[Yet Another](https://example.com)** - Brief description
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

**Writing Style**: 
- First-person, conversational but professional
- Personal, warm, and authentic - NOT LinkedIn-like or sterile
- Add humor and personality where appropriate
- Enthusiastic about tech, humble about experience
- Use sentence case for ALL headers (h1, h2, h3, etc.) - NOT Title Case
- Example: "The setup" NOT "The Setup"

**Visual Hierarchy**:
- Categories appear BELOW excerpt in blog cards (not before)
- Categories should be subtle and muted (not prominent)
- Content (title, excerpt) should draw attention first, categories second

**Topics**: Software architecture, Azure, .NET, Blazor, AI/ML, photography, family.

**Length**: 800-2000 words (5-10 min read)

**SEO**: Unique title/description, descriptive excerpt, specific tags only.

**Color Consistency**:
- Use only 3 primary colors + a few secondaries throughout
- Avoid "Christmas tree" effect from too many colors
- Ensure RSS icons, badges, and UI elements use consistent primary palette

**Horizontal Rules (HR)**:
- Use `---` in markdown to create horizontal rules
- HRs render as white lines (not red) with appropriate spacing
- **Avoid double HRs**: Don't place `---` immediately before or after h2 headings, as h2 headings no longer have top borders
- HR spacing is automatically optimized (not too much padding)

**Callout Boxes**:
- Callout content uses bright white text (`--text-primary`) for better readability and emphasis
- Callout titles also use bright white for consistency
- Use callouts sparingly to highlight key insights, takeaways, or important information

**TL;DR Section**:
- Add a TL;DR callout box **immediately after the hero image** (at the very start of content, before first heading)
- Use `{{< callout type="success" title="TL;DR" >}}` format
- Summarize the entire post in 2-3 sentences
- Highlight the key outcome and value proposition
- This gives readers a quick summary before diving into the full content

**References Section**:
- Add a "References" section at the **bottom of the post** (after "Try It Yourself" and final callout)
- Include links to ALL technologies, tools, and services mentioned in the post
- Format as a bulleted list with descriptive links: `- **[Tool Name](URL)** - Brief description`
- Examples: Cursor, GitHub Actions, AvaloniaUI, Azure DevOps, MCP, .NET SDK, NuGet, etc.
- Helps readers find and explore the technologies discussed

## Step 8: Pre-Publish Checklist

**Content & Style**:
- [ ] Title uses **sentence case** (not Title Case)?
- [ ] All headers (h2, h3) use sentence case?
- [ ] Content is personal and warm (not LinkedIn-like)?
- [ ] Appropriate humor and personality added?

**Images**:
- [ ] Hero image selected and optimized?
- [ ] Hero image properly centered when previewed?
- [ ] No text walls > 600 words without visual breaks?
- [ ] All images have descriptive `alt` text (not generic)?
- [ ] File sizes under limits (hero <300KB, inline <200KB)?
- [ ] Images readable on dark background?
- [ ] PNG images with transparency display correctly (if using PNG)?
- [ ] Front matter includes `featuredImage`, `featuredAlt`, `imageCredit`?
- [ ] All `<img>` tags have `loading="lazy" decoding="async"`?

**Visual Hierarchy**:
- [ ] Categories appear below excerpt (not before)?
- [ ] Categories are subtle and muted (not too prominent)?
- [ ] Color palette is limited (3 primaries + few secondaries)?
- [ ] No "Christmas tree" effect from too many colors?

**Formatting**:
- [ ] No double HRs (avoid `---` immediately before/after h2 headings)?
- [ ] HRs used appropriately for section breaks?
- [ ] Callout boxes used for key insights/takeaways?
- [ ] TL;DR callout added right after hero image (at start of content)?
- [ ] References section added at bottom with links to all mentioned technologies?

**Technical**:
- [ ] Hugo builds without errors (`hugo` command)?
- [ ] Preview in browser looks correct (`hugo server`)?
- [ ] Article spacing looks appropriate (not too much vertical space)?
- [ ] Hero image is horizontally centered?

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

