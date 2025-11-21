# Common Tasks

Quick reference guide for routine updates and maintenance tasks.

## Update Homepage Stats

The hero section displays dynamic statistics pulled from `hugo.toml`.

### Location
File: `src/hugo.toml`

### Edit Stats
```toml
[params.stats]
  age = 41              # Your current age
  photos = 172          # Photo count from Flickr
  channels = 2          # YouTube channels
  family = "∞"          # Infinity symbol for family
```

### Steps
1. Open `src/hugo.toml`
2. Find `[params.stats]` section
3. Update values
4. Test locally: `hugo server`
5. Commit and push to deploy

**Note**: Age updates automatically based on birthdate calculation in template, but you can override it here.

## Add Social Media Link

Social links appear in the hero section and footer.

### Location
File: `src/hugo.toml`

### Add New Platform
```toml
[params.social]
  linkedin = "https://linkedin.com/in/digitaldias"
  github = "https://github.com/digitaldias"
  flickr = "https://flickr.com/photos/digitaldias"
  youtube = "https://youtube.com/@digitaldias"
  # Add new platform below
  twitter = "https://twitter.com/digitaldias"
  mastodon = "https://mastodon.social/@digitaldias"
```

### Steps
1. Open `src/hugo.toml`
2. Find `[params.social]` section
3. Add new line with platform name and URL
4. Update template if custom icon needed (see below)
5. Test locally: `hugo server`
6. Commit and push

### Custom Icon Support
If the platform needs a custom icon, edit `src/layouts/partials/footer.html` or `src/layouts/index.html`:

```html
{{ with .Site.Params.social.twitter }}
<a href="{{ . }}" target="_blank" rel="noopener" aria-label="Twitter">
  <i class="fab fa-twitter"></i>
</a>
{{ end }}
```

## Update Navigation Menu

Navigation links appear in the site header.

### Location
File: `src/layouts/partials/header.html`

### Edit Menu Items
Find the `<nav>` section:
```html
<nav class="nav-links">
  <a href="/" class="nav-link" data-page="home">Home</a>
  <a href="/blog/" class="nav-link" data-page="blog">Blog</a>
  <a href="/about/" class="nav-link" data-page="about">About</a>
  <!-- Add new item -->
  <a href="/projects/" class="nav-link" data-page="projects">Projects</a>
</nav>
```

### Steps
1. Open `src/layouts/partials/header.html`
2. Find `<nav class="nav-links">` section
3. Add new `<a>` tag with proper class and data attribute
4. Ensure `data-page` matches URL path for active state
5. Maintain glass-morphism styling
6. Test locally: `hugo server`
7. Commit and push

## Change Site Title or Description

### Location
File: `src/hugo.toml`

### Edit Meta Information
```toml
title = "Pedro Dias - Chief Architect & Technology Enthusiast"
languageCode = "en-us"

[params]
  description = "Personal portfolio and blog of Pedro Dias, Chief Architect at Tradesolution AS, sharing insights on software architecture, Azure, AI, and family life."
  author = "Pedro Dias"
  keywords = ["architecture", "azure", "ai", "blazor", "software development"]
```

### Steps
1. Open `src/hugo.toml`
2. Update `title` (appears in browser tab and meta tags)
3. Update `params.description` (appears in meta description and social sharing)
4. Update `params.keywords` if needed (for SEO)
5. Test locally: `hugo server`
6. Verify `<title>` and `<meta name="description">` in page source
7. Commit and push

## Add New Content Section

To add a new section (e.g., `/projects/`, `/talks/`):

### Create Section Folder
```bash
cd e:/dev/private/digitaldias.com/src
mkdir -p content/projects
```

### Create Index File
File: `content/projects/_index.md`
```yaml
---
title: "Projects"
description: "Open source projects and experiments by Pedro Dias"
---
```

### Create List Template
File: `layouts/projects/list.html`
```html
{{ define "main" }}
<main class="projects-list">
  <h1>{{ .Title }}</h1>
  <div class="project-grid">
    {{ range .Pages }}
    <article class="project-card">
      <h2><a href="{{ .RelPermalink }}">{{ .Title }}</a></h2>
      <p>{{ .Summary }}</p>
    </article>
    {{ end }}
  </div>
</main>
{{ end }}
```

### Create Single Template
File: `layouts/projects/single.html`
```html
{{ define "main" }}
<article class="project-single">
  <h1>{{ .Title }}</h1>
  {{ .Content }}
</article>
{{ end }}
```

### Add Navigation Link
Edit `src/layouts/partials/header.html` (see "Update Navigation Menu" above)

### Test
```bash
hugo server
# Visit http://localhost:1313/projects/
```

## Update Footer Content

### Location
File: `src/layouts/partials/footer.html`

### Edit Footer Sections
```html
<footer class="site-footer">
  <div class="footer-content">
    <div class="footer-section">
      <h3>About</h3>
      <p>Your updated bio text here...</p>
    </div>
    
    <div class="footer-section">
      <h3>Contact</h3>
      <p>Email: <a href="mailto:pedro.dias@tradesolution.no">pedro.dias@tradesolution.no</a></p>
    </div>
    
    <div class="footer-section">
      <h3>Social</h3>
      <!-- Social links here -->
    </div>
  </div>
</footer>
```

### Steps
1. Open `src/layouts/partials/footer.html`
2. Update content in relevant `<div class="footer-section">` blocks
3. Maintain glass-morphism styling (don't remove classes)
4. Test locally: `hugo server`
5. Commit and push

## Change Favicon

### Location
Files in: `src/static/`

### Replace Favicon Files
You'll need to generate a full favicon set:
1. Create base image (512×512px PNG)
2. Use favicon generator: https://realfavicongenerator.net/
3. Download zip file
4. Replace files in `src/static/`:
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`
   - `site.webmanifest`

### Update Manifest
Edit `src/static/site.webmanifest`:
```json
{
  "name": "Pedro Dias - digitaldias.com",
  "short_name": "digitaldias",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#BA0C2F",
  "background_color": "#0a0a0a",
  "display": "standalone"
}
```

### Steps
1. Generate favicon set
2. Replace files in `src/static/`
3. Verify `site.webmanifest` has correct colors (Norway red theme)
4. Test locally: `hugo server`
5. Check browser tab icon
6. Commit and push

## Update Contact Information

### Location
File: `src/hugo.toml` and `src/layouts/partials/footer.html`

### Edit Config
```toml
[params]
  email = "pedro.dias@tradesolution.no"
  phone = "+47 ..."  # Optional
  location = "Frogner, Norway"
  company = "Tradesolution AS"
  role = "Chief Architect"
```

### Edit Footer
Update email link in `src/layouts/partials/footer.html`:
```html
<p>Email: <a href="mailto:pedro.dias@tradesolution.no">pedro.dias@tradesolution.no</a></p>
```

### Steps
1. Open `src/hugo.toml` and update `[params]` section
2. Open `src/layouts/partials/footer.html` and update email link
3. Test locally: `hugo server`
4. Verify email link works (opens mail client)
5. Commit and push

## Enable/Disable Draft Posts

### Show Drafts Locally
```bash
hugo server --buildDrafts
# or
hugo server -D
```

### Publish Draft Post
Edit the post's front matter:
```yaml
---
draft: false  # Change from true to false
---
```

### Hide Published Post
Edit the post's front matter:
```yaml
---
draft: true  # Change from false to true
---
```

**Note**: Draft posts are never included in production builds (`hugo --minify`), only in development server when `--buildDrafts` flag is used.

## Update llm.txt

The `/llm.txt` file provides AI-friendly site documentation.

### Location
File: `src/static/llm.txt`

### When to Update
Update `llm.txt` when:
- Major site structure changes (new sections)
- Technology stack changes (new frameworks)
- Content types change (new post categories)
- Contact information changes
- Project statistics change significantly

### Format
Follow the llmstxt.org convention:
```
# digitaldias.com

> Personal portfolio and blog of Pedro Dias

## Owner
Pedro Dias
Chief Architect at Tradesolution AS
Location: Frogner, Norway
Email: pedro.dias@tradesolution.no

## Content Structure
- Homepage: https://www.digitaldias.com/
- Blog: https://www.digitaldias.com/blog/
- Categories: Architecture, Azure, AI, Family, Photography, DevOps

## Technology Stack
- Framework: Hugo (static site generator)
- Hosting: Azure Static Web Apps / Azure Storage
- Deployment: GitHub Actions
```

### Steps
1. Open `src/static/llm.txt`
2. Update relevant sections
3. Keep format simple (plain text, markdown-style)
4. Test locally: visit `http://localhost:1313/llm.txt`
5. Commit and push

---

**Quick Command Reference**
```bash
# Development server
hugo server

# Build production site
hugo --minify

# Create new blog post
hugo new blog/$(date +%Y-%m-%d)-post-title.md

# Clean build
rm -rf public && hugo --minify
```

