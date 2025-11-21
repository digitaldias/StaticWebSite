# Image Optimization Instructions

## Current Status

- `featured.jpg`: 306KB (target: <300KB) - Needs slight compression
- `successful-build.png`: 699KB (target: <200KB as JPEG) - Needs conversion and optimization

## Optimization Steps

### 1. Featured Image (featured.jpg)

**Target**: 1920×1080px (16:9), JPEG 80-85% quality, <300KB

**Using ImageMagick**:
```bash
cd src/static/images/blog/2025-11-21-cursor-github-pipelines
magick featured.jpg -strip -quality 82 -resize 1920x1080^ -gravity center -extent 1920x1080 featured-optimized.jpg
```

**Using Lightroom**:
- Export Settings:
  - Image Format: JPEG
  - Quality: 82
  - Color Space: sRGB
  - Resize to Fit: Long Edge
  - Long Edge: 1920 pixels
  - Resolution: 72 pixels per inch

**Online Tool**:
- Upload to https://squoosh.app
- Select JPEG, quality 82
- Resize to 1920×1080px
- Download and replace `featured.jpg`

### 2. Inline Image (successful-build.png → successful-build.jpg)

**Target**: 1200×800px (3:2 landscape), JPEG 82% quality, <200KB

**Using ImageMagick**:
```bash
cd src/static/images/blog/2025-11-21-cursor-github-pipelines
magick successful-build.png -strip -quality 82 -resize 1200x800^ -gravity center -extent 1200x800 successful-build.jpg
```

**Using Lightroom**:
- Export Settings:
  - Image Format: JPEG
  - Quality: 82
  - Color Space: sRGB
  - Resize to Fit: Long Edge
  - Long Edge: 1200 pixels
  - Resolution: 72 pixels per inch

**Online Tool**:
- Upload to https://squoosh.app
- Select JPEG, quality 82
- Resize to 1200×800px
- Download as `successful-build.jpg`

### 3. After Optimization

1. Replace `featured.jpg` with optimized version
2. Delete `successful-build.png`
3. Update blog post to reference `successful-build.jpg` instead of `.png`
4. Verify file sizes:
   - `featured.jpg` should be <300KB
   - `successful-build.jpg` should be <200KB

## Verification Checklist

- [ ] `featured.jpg` is <300KB
- [ ] `featured.jpg` is 1920×1080px (16:9)
- [ ] `successful-build.jpg` exists (converted from PNG)
- [ ] `successful-build.jpg` is <200KB
- [ ] `successful-build.jpg` is 1200×800px (3:2)
- [ ] Blog post references `.jpg` not `.png`
- [ ] Images readable on dark background (#0a0a0a)
- [ ] Alt text is descriptive and contextual

