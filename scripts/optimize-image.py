#!/usr/bin/env python3
"""
optimize-image.py — Image optimizer for digitaldias.com

Resizes and compresses images to the correct spec for each use case.

Usage:
    python scripts/optimize-image.py <input> [type] [output]

Types:
    hero      1920x1080  JPEG q82  ~200-300 KB  (blog featured image, default)
    inline    1200x800   JPEG q82  ~150-200 KB  (in-post images)
    portrait  600x600    JPEG q85  ~50-80 KB    (about page / author photo)

Examples:
    python scripts/optimize-image.py ~/Downloads/screenshot.png
    python scripts/optimize-image.py ~/Downloads/photo.jpg portrait src/static/images/pedro.jpg
    python scripts/optimize-image.py ~/Downloads/diagram.png inline src/static/images/blog/2026-03-07-my-post/step-2.jpg

Install once:
    pip install Pillow
"""

import sys
import os
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Pillow not installed. Run: pip install Pillow")
    sys.exit(1)

PROFILES = {
    "hero":     {"size": (1920, 1080), "quality": 82, "target_kb": (200, 300)},
    "inline":   {"size": (1200, 800),  "quality": 82, "target_kb": (150, 200)},
    "portrait": {"size": (600, 600),   "quality": 85, "target_kb": (50, 80)},
}

PAD_COLOR = (240, 236, 225)  # #f0ece1 — site warm paper background


def optimize(input_path: str, profile_name: str = "hero", output_path: str = None):
    input_file = Path(input_path).expanduser().resolve()
    if not input_file.exists():
        print(f"Error: file not found: {input_file}")
        sys.exit(1)

    profile = PROFILES.get(profile_name)
    if not profile:
        print(f"Error: unknown type '{profile_name}'. Choose: {', '.join(PROFILES)}")
        sys.exit(1)

    target_w, target_h = profile["size"]
    quality = profile["quality"]
    target_low, target_high = profile["target_kb"]

    # Determine output path
    if output_path:
        out_file = Path(output_path).expanduser().resolve()
    else:
        out_file = input_file.parent / (input_file.stem + "_optimized.jpg")

    out_file.parent.mkdir(parents=True, exist_ok=True)

    # Open and process
    img = Image.open(input_file)

    # Convert to RGB (handles PNG transparency, CMYK, etc.)
    if img.mode != "RGB":
        img = img.convert("RGB")

    src_w, src_h = img.size
    print(f"\nInput:   {input_file.name}")
    print(f"         {src_w}x{src_h}px  {input_file.stat().st_size // 1024} KB")
    print(f"Profile: {profile_name} -> {target_w}x{target_h}px  q{quality}")

    if profile_name == "portrait":
        # Square crop: fit then pad to square
        img = ImageOps.fit(img, (target_w, target_h), Image.LANCZOS, centering=(0.5, 0.35))
    else:
        # Fit within target dimensions preserving aspect ratio, then pad
        img.thumbnail((target_w, target_h), Image.LANCZOS)
        if img.size != (target_w, target_h):
            padded = Image.new("RGB", (target_w, target_h), PAD_COLOR)
            offset = ((target_w - img.width) // 2, (target_h - img.height) // 2)
            padded.paste(img, offset)
            img = padded

    # Save
    img.save(out_file, "JPEG", quality=quality, optimize=True, progressive=True)
    out_kb = out_file.stat().st_size // 1024

    print(f"Output:  {out_file}")
    print(f"         {img.width}x{img.height}px  {out_kb} KB", end="")

    if out_kb < target_low:
        print(f"  OK (under target {target_low}-{target_high} KB - fine, just small source)")
    elif out_kb <= target_high:
        print(f"  OK (within target {target_low}-{target_high} KB)")
    else:
        # Try reducing quality slightly to hit target
        for q in range(quality - 5, 60, -5):
            img.save(out_file, "JPEG", quality=q, optimize=True, progressive=True)
            new_kb = out_file.stat().st_size // 1024
            if new_kb <= target_high:
                print(f"\n  Reduced quality to q{q} -> {new_kb} KB to hit target")
                break
        else:
            out_kb = out_file.stat().st_size // 1024
            print(f"\n  Warning: {out_kb} KB still over target {target_high} KB - source may be very high-res, check manually")

    print()


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        sys.exit(0)

    input_path  = args[0]
    profile     = args[1] if len(args) > 1 else "hero"
    output_path = args[2] if len(args) > 2 else None

    optimize(input_path, profile, output_path)
