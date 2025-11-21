---
description: Optimize images for blog posts with technical specifications
---

# Image Optimization for digitaldias.com

This prompt helps you optimize images for the Hugo static site with correct dimensions, formats, and file sizes.

## Quick Reference Table

| Image Type | Dimensions | Format | Quality | File Size | Use Case |
|------------|------------|--------|---------|-----------|----------|
| Hero | 1920×1080px (16:9) | JPEG | 80-85% | <300KB | Featured image, landscape |
| Hero (alt) | 1600×900px (16:9) | JPEG | 80-85% | <300KB | Minimum acceptable size |
| Inline (landscape) | 1200×800px (3:2) | JPEG | 82% | <200KB | Screenshots, processes |
| Inline (portrait) | 800×1200px (2:3) | JPEG | 82% | <200KB | People, details |
| Diagram | Variable | SVG | N/A | <100KB | Architecture, flows |
| Thumbnail | 600×400px | JPEG | 80% | <80KB | Blog list previews |

## Hero Image Optimization

### Target Specifications
- **Dimensions**: 1920×1080px (16:9 aspect ratio) or 1600×900px minimum
- **Orientation**: Landscape only
- **Format**: JPEG (not PNG unless transparency needed)
- **Quality**: 80-85% compression
- **Color space**: sRGB (not Adobe RGB or ProPhoto)
- **DPI**: 72 (web standard)
- **File size**: 200-300KB maximum

### Composition Guidelines
- **Rule of thirds**: Place subjects at intersection points
- **Negative space**: Leave room for text overlay (title, excerpt)
- **Focal point**: Ensure main subject is clear and uncluttered
- **Dark theme compatibility**: Test visibility on `#0a0a0a` background

### Lightroom Export Settings
```
File Settings:
  Image Format: JPEG
  Quality: 80-85
  Color Space: sRGB
  
Image Sizing:
  Resize to Fit: Long Edge
  Long Edge: 1920 pixels
  Resolution: 72 pixels per inch
  
Output Sharpening:
  Sharpen For: Screen
  Amount: Standard
```

## Inline Image Optimization

### Landscape (Screenshots, Processes)
- **Dimensions**: 1200×800px (3:2 aspect ratio)
- **Format**: JPEG quality 82%
- **File size**: 150-200KB
- **Use for**: Code editor screenshots, dashboard views, step-by-step visuals

### Portrait (People, Details)
- **Dimensions**: 800×1200px (2:3 aspect ratio)
- **Format**: JPEG quality 82%
- **File size**: 150-200KB
- **Use for**: Portrait photos, mobile screenshots, detail close-ups

### Lightroom Export Settings
```
File Settings:
  Image Format: JPEG
  Quality: 82
  Color Space: sRGB
  
Image Sizing:
  Resize to Fit: Long Edge
  Long Edge: 1200 pixels (landscape) or 800 pixels (portrait)
  Resolution: 72 pixels per inch
```

## SVG Diagram Optimization

### Brand Color Palette
Use ONLY these colors in diagrams:
```css
--norway-red: #BA0C2F      /* Primary brand color */
--norway-blue: #002F8B     /* Secondary brand color */
--portugal-green: #006600  /* Accent color */
--portugal-gold: #FFD700   /* Highlight color */
```

### Background Colors
- **Dark mode**: `#0a0a0a` to `#1a1a1a`
- **Subtle contrast**: `#1a1a1a` to `#2a2a2a`
- **Never use**: Pure white backgrounds

### Export Guidelines
- **Remove metadata**: Strip editor info, timestamps
- **Optimize paths**: Simplify curves, reduce nodes
- **Group elements**: Logical grouping for easier editing
- **Embed fonts**: Or convert text to paths
- **File size**: Keep under 100KB

### SVG Optimization Tools
```bash
# Using SVGO (if installed)
svgo diagram.svg -o diagram-optimized.svg

# Manual cleanup
# - Remove <metadata> tags
# - Remove unused defs
# - Simplify decimal precision
# - Combine similar paths
```

## File Naming Conventions

### Blog Post Images
```
static/images/blog/2025-11-21-post-slug/
├── featured.jpg              # Hero image
├── inline-01.jpg             # First inline (descriptive names better)
├── architecture-diagram.svg  # Descriptive diagram name
└── screenshot-dashboard.jpg  # Descriptive screenshot name
```

### Shared Images
```
static/images/shared/
├── avatar-pedro-dias.jpg
├── logo-tradesolution.svg
└── pattern-geometric-dark.svg
```

## HTML Implementation

### Hero Image (in template)
```html
<img 
  src="{{ .Params.featuredImage }}" 
  alt="{{ .Params.featuredAlt }}"
  width="1920" 
  height="1080"
  loading="eager"
  decoding="async"
  class="hero-image"
>
```

### Inline Images (in Markdown)
```html
<img 
  src="/images/blog/2025-11-21-post-slug/inline-01.jpg" 
  alt="Descriptive alt text explaining what and why"
  width="1200"
  height="800"
  loading="lazy"
  decoding="async"
>
```

### Flickr Photos (external)
```html
<img 
  src="https://live.staticflickr.com/.../photo_c.jpg" 
  alt="Nature scene from Norway trip"
  loading="lazy"
  decoding="async"
>
```

## AI-Assisted Optimization Prompts

### Ask AI to Analyze Images
- "Analyze this image composition - does it have space for text overlay?"
- "Is this color palette aligned with Norway red (#BA0C2F) and blue (#002F8B)?"
- "Should I crop this to 16:9 landscape or keep 4:3?"
- "What Lightroom adjustments would improve contrast for dark backgrounds?"

### AI Can Provide
- **Composition feedback**: Negative space, focal points, rule of thirds
- **Brand alignment**: Color palette matching
- **Technical recommendations**: Crop ratios, exposure adjustments
- **Mood/tone assessment**: Does it match post topic?

## Compression Workflow

### Batch Processing (if needed)
```bash
# ImageMagick example (if installed)
magick convert input.jpg -quality 82 -resize 1920x1080 output.jpg

# For multiple files
for f in *.jpg; do
  magick convert "$f" -quality 82 -resize 1920x1080 "optimized-$f"
done
```

### Online Tools (fallback)
- **TinyJPG/TinyPNG**: https://tinyjpg.com
- **Squoosh**: https://squoosh.app
- **ImageOptim** (macOS): https://imageoptim.com

## Accessibility Requirements

### Alt Text Guidelines
- **Be descriptive**: Explain WHAT is shown and WHY it matters
- **Length**: 100-150 characters ideal
- **Context**: Relate to surrounding content
- **Avoid**: "Image of...", "Picture showing..." (redundant)

### Examples
❌ **Bad**: `alt="screenshot"`
❌ **Bad**: `alt="Image of Azure dashboard"`
✅ **Good**: `alt="Azure Static Web Apps dashboard showing successful deployment with green status indicator"`

❌ **Bad**: `alt="diagram"`
❌ **Bad**: `alt="Picture showing Hugo architecture"`
✅ **Good**: `alt="Hugo build pipeline: Markdown content flows through templates to generate static HTML pages"`

### Decorative Images
```html
<!-- If image is purely decorative with no informational value -->
<img src="pattern.svg" alt="" role="presentation">
```

## Pre-Upload Checklist

- [ ] Image dimensions match specifications?
- [ ] File size under limits (hero <300KB, inline <200KB)?
- [ ] JPEG quality 80-85% for hero, 82% for inline?
- [ ] sRGB color space (not Adobe RGB)?
- [ ] 72 DPI resolution?
- [ ] Filename is descriptive (not IMG_1234.jpg)?
- [ ] Alt text is meaningful and contextual?
- [ ] SVG diagrams use brand colors only?
- [ ] Images readable on dark background (#0a0a0a)?
- [ ] `loading="lazy"` for inline images?
- [ ] `loading="eager"` for hero image only?

---

**Remember**: Quality over quantity. One great optimized image beats five poorly compressed ones.
