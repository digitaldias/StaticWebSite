# Image Support Strategy for Blog Posts

Purpose: Introduce consistent, performant, accessible visual assets to enrich Hugo blog posts while preserving brand identity, dark theme aesthetics, and site performance.

## Goals
- Improve visual engagement (hero + contextual images)
- Maintain fast builds + excellent Lighthouse scores
- Preserve Norwegian/Portuguese color palette usage in illustrations
- Ensure accessibility (alt text, reduced motion compatibility)

## Image Categories
1. Hero / Featured Image (top of post)
2. Inline Contextual Images (support narrative every ~600–800 words)
3. Conceptual Illustrations (replacing former Mermaid diagrams)
4. Micro SVG Icons (lists, callouts, metadata accents)
5. Gallery / Multi-image (optional future front matter array)

## Sources & Selection
- Primary: Personal Flickr photos (authentic, branded tone)
- Secondary: Custom SVG diagrams (architecture, workflow)
- Tertiary (sparse use): AI-generated editorial illustrations (prompt to match palette; verify rights)
- Fallback: Public domain / CC0 when other sources unavailable

Selection Criteria: Relevance, narrative reinforcement, tonal consistency (dark backgrounds, saturated accent colors), minimal visual noise.

## Storage & Paths
- Per-post assets: `static/images/blog/<slug>/` (e.g., `static/images/blog/2025-11-19-from-html-to-hugo-migration/featured.jpg`)
- Shared illustrations: `static/images/shared/`
- Flickr: Use direct CDN URLs (size variants `_c` (800px) or `_b` (larger) depending on needed resolution)

## Front Matter Extensions (Proposed)
```yaml
featuredImage: "/images/blog/2025-11-19-from-html-to-hugo-migration/featured.jpg"
featuredAlt: "Side-by-side comparison of raw HTML and Hugo structure"
imageCredit: "Photo © Pedro Dias"
# Optional future gallery structure
# gallery:
#   - url: "https://live.staticflickr.com/.../123456789_c.jpg"
#     alt: "Azure deployment dashboard screenshot"
#     credit: "Pedro Dias"
```

## Formats & Sizing
- Hero: 1600px wide (or Flickr `_b` size), ~200–300 KB JPEG after compression
- Inline: 1000–1200px wide max; compressed JPEG/PNG (prefer JPEG for photos, PNG/SVG for diagrams)
- Diagrams: SVG (inline or file) using brand colors only
- Avoid premature WebP until pipeline updated; can add later with Hugo image processing

## Compression Workflow
Example (ImageMagick):
```bash
magick input.jpg -strip -quality 82 output.jpg
```
Optional tools: `jpegoptim`, `oxipng`, `svgo`.

## Color Usage in Illustrations
- Primary blocks: `#BA0C2F`
- Secondary emphasis / connectors: `#002F8B`
- Accents: `#006600` (sparingly), `#FFD700` for highlights only
- Maintain dark backgrounds (#0a0a0a to #1a1a1a gradients) for diagram canvases

## Accessibility
- Every non-decorative `<img>`: descriptive `alt` text
- Decorative only: `alt=""`
- Alt text pattern: WHAT + CONTEXT (e.g., `"Static site build summary showing 53ms Hugo build time"`)
- Lazy loading: `loading="lazy" decoding="async"`
- Ensure diagram text contrast (WCAG AA) against dark background

## Performance Guidelines
- Total image payload per post: < 1 MB
- Hero + 2–3 inline images typical
- Use responsive scaling via CSS; consider future Hugo `srcset` integration

## Replacing Former Mermaid Diagrams
- Convert conceptual flows to static SVG diagrams:
  - Boxes (sections/process), arrows (direction), labels (short, clear)
  - No animation (respect `prefers-reduced-motion` indirectly)
  - Export as clean SVG (group logical elements, remove editor metadata)

## Implementation Phases
1. Define front matter convention (`featuredImage`, etc.)
2. Update `layouts/blog/single.html` to conditionally render hero block
3. Add CSS styling for hero container (maintain glass-morphism if overlay used)
4. Backfill existing posts with at least one featured image
5. Create shared SVG for architecture/migration flow reuse
6. (Optional) Add gallery rendering logic if future posts need multi-image sets

## Suggested Hero Styling (Concept)
- Wrapper with `max-width` alignment to content
- Optional subtle overlay gradient to preserve text legibility on captions
- Use existing CSS variables—no new brand colors

## Alt Text Examples
- Featured: "Hand-drawn sketch of site folder structure before migration"
- Inline: "Screenshot of Hugo server rebuilding in under 60ms"
- Diagram: "Architecture flow from Markdown through Hugo build to static deployment"

## AI Assistance Prompts (For Image Planning)
- "Suggest 3 image concepts (hero + 2 inline) for this draft about static site performance."
- "Write alt text for a diagram showing content flow in Hugo."
- "List palette-conformant SVG icon ideas for a migration checklist section."

## Future Enhancements
- Add Hugo image processing (`.Resize`, `.Fit`) for automated responsive sets
- Pre-generate OG image from hero (template combining title + background)
- Introduce a diagram build script (optional) ensuring brand color consistency

## Maintenance Checklist
- [ ] All posts ≥ 800 words have at least one inline image
- [ ] Each post has hero image if available
- [ ] No missing or placeholder alt texts
- [ ] File sizes optimized (<300 KB hero, <200 KB inline)
- [ ] Diagram SVGs validate (no embedded raster, minimal IDs)

---
Last updated: 2025-11-20
