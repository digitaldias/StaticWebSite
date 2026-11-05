set shell := ["pwsh", "-NoProfile", "-Command"]

scratch := env_var_or_default("TEMP", ".") / "digitaldias-build"

# Create a draft post from src/archetypes/blog.md, e.g. `just new-post my-slug`
new-post slug:
    hugo new --source src "blog/$(Get-Date -Format yyyy-MM-dd)-{{slug}}.md"

# Generate a featured image with MakeImage and optimise it to the hero spec.
# `post` is the post's file name without .md, e.g. 2026-11-01-my-slug
cover post prompt seed="":
    $out = Join-Path $env:TEMP "digitaldias-cover"; \
    $seedArg = if ("{{seed}}") { @("-s", "{{seed}}") } else { @() }; \
    makeImage --no-input -p landscape @seedArg -o $out "{{prompt}}"; \
    $png = Get-ChildItem $out -Filter *.png | Sort-Object LastWriteTime | Select-Object -Last 1; \
    python scripts/optimize-image.py $png.FullName hero "src/static/images/blog/{{post}}/featured.jpg"

# Build with drafts into a scratch folder to catch template and front-matter errors; never into src/public
check:
    hugo --quiet --minify --buildDrafts --source src --destination "{{scratch}}"

# Score each section's reader depth (100-400) with the local decision model into src/data/depth.yaml, e.g. `just depth 2026-11-01-my-slug` or `just depth --all`
depth +posts:
    $env:PYTHONUTF8 = "1"; python scripts/depth-score.py {{posts}}

# Pedro's most-played Spotify artists of the last four weeks, as suggestions for Now / Listening (one-time setup: scripts/spotify-top.py)
listening:
    $env:PYTHONUTF8 = "1"; python scripts/spotify-top.py

# Proofread the homepage briefing claim: the next 14 days in both languages, or every combination with `just claims --all`
claims *args:
    $env:PYTHONUTF8 = "1"; python scripts/briefing-claims.py {{args}}
