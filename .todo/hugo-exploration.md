# Hugo Exploration & Enhancement Roadmap

Purpose: Structured plan to systematically explore Hugo capabilities to elevate digitaldias.com beyond baseline static generation—focusing on performance, authoring experience, accessibility, automation, and sustainable extensibility.

## Guiding Principles
- Keep site fast (sub-100ms build for current size; scale gracefully)
- Preserve brand identity & dark glass-morphism design system
- Avoid unnecessary dependencies (favor native Hugo features)
- Accessibility and semantic quality are non-negotiable
- Each enhancement must have measurable impact (speed, UX, authoring ease)

## Current Strengths (Baseline)
- Clean dark theme with heritage color palette
- Hand-authored CSS + JS features preserved in Hugo
- Sub-second builds
- Taxonomies (categories/tags) auto-generated
- RSS feeds available

## Opportunity Areas
1. Responsive & Optimized Images (Hugo Image Processing)
2. Automated Social / OpenGraph Image Generation
3. JSON Feed + OPML export for power subscribers
4. Search (Client-side index via Lunr/Fuse or pre-built JSON)
5. Shortcodes & Partials Consolidation (reduce repetition)
6. Structured Data / Schema.org (BlogPosting, Person)
7. Automated Deployment Enhancements (GitHub Actions + Cache)
8. Asset Pipeline Fine-Tuning (fingerprinting strategies, SCSS split, purge CSS?)
9. i18n / Localization (future multilingual expansion)
10. Componentization (reuse pattern blocks: hero, callouts, checklist)
11. Diagram Alternatives (static SVG library + shortcode params)
12. Accessibility Audits & Automated Checks
13. Performance Budgets (asset weight alerts)
14. Content Authoring Tooling (front matter linting / archetypes)
15. SEO Refinements (canonical review, meta variations per type)
16. Archive / Timeline Views (chronological visual index)
17. Custom Output Formats (e.g., /index.json or sitemap per taxonomy)
18. Category/Tag Landing Page Enhancements (descriptions, curated highlights)
19. Deploy-time Integrity & Security Headers Review
20. Analytics (privacy-friendly: serverless counter or lightweight script)

## Exploration Phases
### Phase 1: Foundation Enhancements
- Implement front matter for `featuredImage`, `featuredAlt`, `imageCredit`.
- Update single post template to conditionally render hero.
- Introduce shared partial for post metadata (reduce duplication).
- Add global + blog RSS visibility (from `rss-promoting.md`).

### Phase 2: Media & Visual Upgrades
- Add Hugo image processing for hero + inline images (`.Resize` / `.Fit`).
- Create SVG diagram partials (replacing Mermaid) with parameters.
- Evaluate automated OG image (generate via template: title overlay + palette gradient) → output as custom format.

### Phase 3: Content Discovery & Subscription
- JSON Feed output format.
- OPML file generation for categories.
- Build search index JSON (titles, excerpts, tags) updated on build.
- Client-side search component (accessible, zero external dependencies).

### Phase 4: Performance & Quality
- Introduce build metrics logging (time, pages, asset sizes). 
- Optional CSS size monitoring; warn if > threshold.
- Run Lighthouse locally against build artifacts (manual phase initially).
- Introduce structured data blocks (BlogPosting, Person markup in `head.html`).

### Phase 5: Automation & CI
- GitHub Actions workflow: build + deploy to Azure Static Web Apps.
- Cache Hugo module directory and resources.
- Automated link checker stage.
- Optional feed change detector script.

### Phase 6: Progressive Enhancements
- Add page-level reading progress indicator (respect reduced motion).
- Tag and category description front matter + styled landing pages.
- Archive page with year grouping and quick filter.

### Phase 7: Future Flex / Internationalization
- Evaluate i18n readiness (extract strings, introduce translation files).
- Assess viability of multi-language toggle without UI clutter.

## Prioritization Matrix (Effort vs Impact)
High Impact / Low Effort:
- Featured image support
- RSS UI promotion
- Search index JSON (basic)
- Structured data meta tags

High Impact / Moderate Effort:
- Hugo image processing + responsive sets
- JSON Feed + OPML
- Automated OG image generation

Moderate Impact / Low Effort:
- Shortcode refactors
- Partial consolidation

Long-Term / High Effort:
- i18n
- Advanced analytics or personalization

## Metrics to Track
| Metric | Baseline | Target |
|--------|----------|--------|
| Build time | ~50–70ms | <120ms at 5× pages |
| Largest single CSS asset | ~ (existing) | <150KB (minified) |
| Avg image weight/hero | N/A | <300KB |
| Accessibility score | 90+ | Maintain ≥ 95 |
| CLS / Layout Shift | Low | Near-zero |

## Implementation Guidelines
- Keep changes incremental; commit per phase.
- Validate after each build (`hugo --minify`).
- Avoid adding heavy JS libraries; use lean vanilla patterns.
- Maintain CSP policy—revisit only if new external sources required.

## Potential Shortcodes (To Design)
- `diagram` → loads inline SVG by name.
- `callout` → stylized info/warning/success block (uses brand colors).
- `stat` → wraps counters with ARIA semantics.
- `gallery` (future) → responsive flex grid.

## Structured Data Plan
Add JSON-LD in `head.html`:
- Site-wide `WebSite` object
- Per post `BlogPosting` with: headline, datePublished, dateModified, author, description, image (if available), keywords.

## Search Index Prototype (Concept)
Generate `public/search-index.json` via custom template listing:
```json
[
  {"title": "Post Title", "url": "/blog/post-slug/", "excerpt": "...", "tags": ["Hugo", "AI"], "date": "2025-11-19"}
]
```
Client-side: Basic fuzzy match (lowercase includes) with result ranking by title/tag hits.

## Risk & Mitigation
| Risk | Mitigation |
|------|------------|
| Feature creep | Phase boundaries & review before starting next |
| Performance regression | Measure before/after; revert if > threshold |
| Accessibility drift | Periodic audit (ARIA, landmarks, contrast) |
| Branding inconsistency | Centralize colors; no new palette values |

## Tooling & Helpers (Optional)
- Script to generate OG image: Node canvas or headless browser (later phase).
- Simple alt text lint: Regex scan for missing `featuredAlt` when `featuredImage` present.
- Build summary script appended to CI logs.

## Acceptance Checklist per Enhancement
- [ ] Build succeeds without errors
- [ ] No console errors in browser
- [ ] Lighthouse performance ≥ baseline
- [ ] Accessibility audit passes (manual + automated)
- [ ] Docs (`.todo/`) updated with rationale
- [ ] Tested at mobile viewport

## Collaboration Prompts (For AI Assistant)
- "List potential partials we can extract from current templates." 
- "Generate structured data JSON-LD for this post using front matter." 
- "Suggest three improvement ideas to reduce CSS size without losing design." 
- "Draft a search index template for Hugo that outputs JSON." 

## Immediate Next Candidates
1. Featured image front matter + template block
2. RSS visibility additions
3. Search index scaffolding
4. JSON-LD basic integration

## Deferral Items
- i18n (until content volume & audience justify)
- Automated OG image generation (until hero image pipeline stabilized)
- Gallery shortcode (until multi-image posts emerge)

---
Last updated: 2025-11-20
