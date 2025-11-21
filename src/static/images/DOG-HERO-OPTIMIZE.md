# Image Optimization for dog-hero.jpg

This guide provides specific instructions to optimize the dog hero image for the homepage background, ensuring it meets the site's performance and visual standards.

## Current Image Status

- **File**: `dog-hero.jpg`
- **Current Size**: 302KB
- **Target**: <300KB (ideally 200-250KB)
- **Action**: Recompress and resize if needed

## Hero Image Specifications

Based on `/optimize-image` command guidelines:

- **Dimensions**: 1920×1080px (16:9 aspect ratio) or 1600×900px minimum
- **Format**: JPEG
- **Quality**: 80-85% compression
- **Color space**: sRGB (not Adobe RGB or ProPhoto)
- **DPI**: 72 (web standard)
- **File size**: 200-300KB maximum
- **Orientation**: Landscape

## Optimization Steps

### Option 1: ImageMagick (Recommended for batch processing)

Ensure you have ImageMagick installed (`magick --version`).

```bash
# Navigate to the image directory
cd src/static/images

# Optimize dog-hero.jpg
# Target: 1920x1080px, JPEG quality 82%, <300KB
magick dog-hero.jpg -strip -quality 82 -resize 1920x1080^ -gravity center -extent 1920x1080 dog-hero-optimized.jpg

# Verify the new file size
ls -lh dog-hero-optimized.jpg

# If satisfied, replace the original
mv dog-hero-optimized.jpg dog-hero.jpg
```

**Explanation of ImageMagick commands:**
- `-strip`: Removes all metadata (EXIF, IPTC, comments).
- `-quality 82`: Sets JPEG compression quality to 82% (good balance of size/quality for hero images).
- `-resize 1920x1080^`: Resizes the image to fill the 1920x1080 area, maintaining aspect ratio. The `^` ensures it covers the area.
- `-gravity center -extent 1920x1080`: Crops any excess from the center to ensure exact dimensions.
- `mv`: Replaces the original file after verification.

### Option 2: Squoosh.app (Online Tool - Easiest)

1. Go to [https://squoosh.app](https://squoosh.app)
2. Drag and drop `src/static/images/dog-hero.jpg`
3. Under "Compress", choose "MozJPEG"
4. Set quality to `82`
5. Under "Resize", set width to `1920px` (height will adjust automatically, then crop to 1080px if needed)
6. Download the optimized file and replace the original `dog-hero.jpg`

### Option 3: Adobe Lightroom / Photoshop

Follow these export settings:

```
File Settings:
  Image Format: JPEG
  Quality: 82
  Color Space: sRGB
  
Image Sizing:
  Resize to Fit: Long Edge
  Long Edge: 1920 pixels
  Resolution: 72 pixels per inch
  
Output Sharpening:
  Sharpen For: Screen
  Amount: Standard
```

## Composition Considerations

Since this image is used as a **subtle background** with:
- Grayscale filter (100%)
- Brightness reduction (15%)
- Blur (2px)
- Opacity (40%)
- Dark gradient overlay

**Optimization tips:**
- The image will be heavily processed, so focus on **file size** over perfect composition
- Ensure the main subject (dog) is centered or follows rule of thirds
- The grayscale filter will remove color, so color accuracy is less critical
- The blur and opacity will soften details, so extreme sharpness isn't necessary

## Verification

After optimizing, run:

```bash
cd src/static/images
ls -lh dog-hero.jpg
# Expected: dog-hero.jpg <300KB (ideally 200-250KB)
```

Also check the homepage locally (`hugo server`) to ensure:
1. The image displays correctly
2. The subtle background effect looks good
3. Text remains readable over the background
4. Page load performance is acceptable

## Expected Results

- **File size**: 200-250KB (down from 302KB)
- **Dimensions**: 1920×1080px (16:9)
- **Visual quality**: Maintained despite compression (the background filters will mask minor quality loss)
- **Performance**: Faster page load, especially on mobile

---

**Note**: Since this image is heavily processed (grayscale, blur, opacity), you can be more aggressive with compression than a standard hero image. The visual filters will mask compression artifacts.

