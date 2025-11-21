# Deployment Checklist & Workflow

This command guides you through validating and deploying the Hugo site to Azure.

## Pre-Deployment Validation

### 1. Content Review
- [ ] All blog posts have required front matter (title, date, description, excerpt)?
- [ ] No posts marked as `draft: true` unintentionally?
- [ ] Featured images exist at specified paths?
- [ ] All internal links use `RelPermalink` (not `Permalink`)?
- [ ] Categories limited to: Architecture, Azure, AI, Family, Photography, DevOps?
- [ ] Tags are specific (e.g., "Blazor", not generic "web")?

### 2. Template Validation
- [ ] Homepage renders all sections correctly?
- [ ] Blog list page (`/blog/`) shows all posts with excerpts?
- [ ] Blog single post page displays properly with featured image?
- [ ] 404 page works with animated tiles?
- [ ] Navigation active states work on all pages?
- [ ] Footer displays correctly with social links?

### 3. Interactive Features
- [ ] Mobile menu opens/closes smoothly?
- [ ] Photo gallery lightbox functions?
- [ ] Stat counters animate on homepage?
- [ ] Magnetic button effects work?
- [ ] Card tilt effects work on blog cards?
- [ ] Scroll reveal animations trigger?
- [ ] All effects respect `prefers-reduced-motion`?

### 4. Build Validation
```bash
cd e:/dev/private/digitaldias.com/src

# Clean previous build
rm -rf public

# Build with Hugo
hugo --minify

# Check for errors in output
# Should see: "Total in <70ms" and "42 pages" (or similar)
```

Expected output:
```
Start building sites … 
hugo v0.152.2+extended

                   | EN  
-------------------+-----
  Pages            |  42  
  Paginator pages  |   0  
  Non-page files   |   0  
  Static files     |   8  
  Processed images |   0  
  Aliases          |   0  
  Cleaned          |   0  

Total in 67 ms
```

### 5. Local Testing
```bash
# Start development server
hugo server

# Open browser to http://localhost:1313
# Test all interactive features
# Check browser console for errors (F12)
```

### 6. Browser Console Check
- [ ] No JavaScript errors in console?
- [ ] No CSP violations (except known Cloudflare analytics)?
- [ ] No 404 errors for missing resources?
- [ ] No failed image loads?
- [ ] All fonts loaded successfully?

### 7. Accessibility Validation
- [ ] Tab navigation works through all interactive elements?
- [ ] Skip to main content link appears on tab?
- [ ] ARIA labels present on all buttons/links?
- [ ] All images have alt text (or empty alt="" for decorative)?
- [ ] Focus-visible styles show keyboard focus?
- [ ] Screen reader announcements work (aria-live regions)?

### 8. Performance Check
```bash
# Build production version
hugo --minify

# Check asset sizes
ls -lh public/css/
ls -lh public/js/

# CSS should be <50KB minified
# JS should be <30KB minified
```

### 9. SEO Validation
- [ ] Each page has unique `<title>` tag?
- [ ] Each page has unique meta description?
- [ ] `robots.txt` exists in `static/` folder?
- [ ] `sitemap.xml` generated in `public/`?
- [ ] RSS feeds generated (`/index.xml`, `/blog/index.xml`)?
- [ ] Social sharing meta tags present (Open Graph)?

### 10. Configuration Check
Edit `src/hugo.toml` - ensure production settings:
```toml
baseURL = "https://www.digitaldias.com/"
languageCode = "en-us"
title = "Pedro Dias - Chief Architect & Technology Enthusiast"

[markup.goldmark.renderer]
  unsafe = true  # Allow HTML in Markdown

[params]
  description = "..."
  # Verify all params are correct
```

## Deployment Workflow

### Option 1: GitHub Actions (Automatic)

Deployment happens automatically on push to `main` branch:

```bash
cd e:/dev/private/digitaldias.com

# Ensure you're on main branch
git checkout main

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add blog post: [title]" 
# or
git commit -m "Fix: [issue description]"
# or  
git commit -m "Update: [what changed]"

# Push to trigger deployment
git push origin main
```

GitHub Actions workflow (`.github/workflows/deploy-to-azure.yml`) will:
1. Checkout code
2. Setup Hugo (extended version)
3. Build site with `hugo --minify`
4. Deploy to Azure Storage `$web` container using `az storage blob upload-batch`

### Option 2: Manual Deployment

If you need to deploy manually:

```bash
cd e:/dev/private/digitaldias.com/src

# Build production site
hugo --minify

# Deploy to Azure Storage
az storage blob upload-batch \
  --account-name digitaldias \
  --account-key "${AZURE_STORAGE_KEY}" \
  --source public \
  --destination '$web' \
  --overwrite
```

**Note**: You'll need `AZURE_STORAGE_KEY` environment variable set.

## Post-Deployment Verification

### 1. Live Site Check
Visit https://www.digitaldias.com and verify:
- [ ] Homepage loads without errors?
- [ ] New blog post appears in `/blog/` listing?
- [ ] New blog post page loads correctly?
- [ ] Featured images load correctly?
- [ ] All interactive features work?
- [ ] Navigation works across all pages?
- [ ] Footer social links work?

### 2. Browser Console (Production)
- [ ] Open DevTools (F12) on live site
- [ ] Check for console errors
- [ ] Known issue: CSP violations for Cloudflare analytics (can ignore for now)
- [ ] Verify no 404 errors for resources

### 3. Performance Validation
Use browser DevTools or online tools:
- **Lighthouse**: Should score 90+ in all categories
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s

### 4. Mobile Testing
- [ ] Test on mobile device (or Chrome DevTools mobile emulation)
- [ ] Mobile menu works?
- [ ] Touch interactions work?
- [ ] Images scale properly?
- [ ] Text is readable (not too small)?

### 5. Social Sharing Test
Share a blog post URL and verify:
- [ ] Correct title appears?
- [ ] Correct description/excerpt appears?
- [ ] Featured image shows in preview?
- [ ] Links work correctly?

Test on:
- LinkedIn (preview debugger: https://www.linkedin.com/post-inspector/)
- Facebook (debugger: https://developers.facebook.com/tools/debug/)
- Twitter/X (card validator: https://cards-dev.twitter.com/validator)

## Rollback Procedure

If deployment breaks the site:

### Option 1: Revert Git Commit
```bash
# Find the last working commit
git log --oneline

# Revert to previous commit
git revert HEAD

# Push to trigger re-deployment
git push origin main
```

### Option 2: Force Push Previous Version
```bash
# Reset to previous commit (use with caution)
git reset --hard HEAD~1

# Force push
git push --force origin main
```

### Option 3: Manual Rollback
1. Checkout previous working commit
2. Rebuild site: `hugo --minify`
3. Manually deploy: `az storage blob upload-batch ...`

## Deployment Troubleshooting

### Build Fails
```bash
# Check Hugo version
hugo version
# Should be v0.152.2+extended or higher

# Try clean build
rm -rf public
hugo --minify --verbose
```

### GitHub Actions Fails
1. Check workflow run: https://github.com/digitaldias/StaticWebSite/actions
2. Review error logs
3. Common issues:
   - Hugo version mismatch
   - Missing Azure credentials (check repository secrets)
   - Invalid TOML syntax in `hugo.toml`

### Azure Deployment Fails
- Verify Azure Storage account exists: `digitaldias`
- Check `$web` container exists and is configured for static hosting
- Verify account key is valid in GitHub Secrets (`AZURE_STORAGE_KEY`)
- Check Azure Storage firewall rules

### Site Loads but Broken
- Check `baseURL` in `hugo.toml` matches production URL
- Verify CSP headers in `layouts/partials/head.html`
- Check browser console for specific errors
- Verify all asset paths are relative (not absolute with localhost)

## Emergency Contacts

If deployment is broken and you need help:
- **Azure Support**: Access via Azure Portal
- **GitHub Support**: https://support.github.com
- **Hugo Community**: https://discourse.gohugo.io/

## Deployment Frequency

**Recommended cadence**:
- Blog posts: Deploy immediately after publishing
- Bug fixes: Deploy as soon as tested locally
- Design changes: Test thoroughly locally, deploy during low-traffic hours
- Major refactors: Deploy in stages, monitor closely

---

**Remember**: Always test locally before pushing to production. When in doubt, revert and debug offline.

