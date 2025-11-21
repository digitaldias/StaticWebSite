# Hero Image Setup

## Dog Photo Background

The homepage hero section uses a subtle dog photo as a background element.

**Image Requirements:**
- **Path**: `/images/dog-hero.jpg` (place in `src/static/images/`)
- **Recommended Size**: 1920x1080px (16:9 aspect ratio)
- **Format**: JPEG (optimized, quality 80-85%)
- **File Size**: < 300KB (ideally 200-250KB)

**Current Status:**
- ✅ Image exists: `dog-hero.jpg` (302KB)
- ⚠️ Needs optimization: See `DOG-HERO-OPTIMIZE.md` for detailed instructions

**Current Implementation:**
- Subtle background with grayscale filter
- Low opacity (40%) with dark overlay
- Slight blur for texture without distraction
- Positioned behind hero content

**To add your image:**
1. Place the dog photo at `src/static/images/dog-hero.jpg`
2. Optimize it to meet the requirements above
3. The image will automatically appear on the homepage

**Alternative: Small Accent Version**
If you prefer the dog photo as a small accent instead of a background, we can switch to that implementation. The accent version would appear as a small circular or rounded image in the hero section, perhaps next to the title or as a floating element.

