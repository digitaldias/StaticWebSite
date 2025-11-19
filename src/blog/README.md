# Blog authoring guide

The blog lives under `blog/` to keep content close to the site while remaining fully static.

## Directory structure

```
blog/
├── index.html            # Blog landing page with list of posts
├── README.md             # This guide
└── posts/
    └── YYYY-MM-DD-slug.html  # Individual post pages
```

### CSS & JavaScript

All blog pages reuse the global stylesheet (`../css/styles.css`) and JavaScript (`../js/main.js`) so the navigation, typography, and motion settings remain consistent with the homepage.

## Creating a new post

1. **Create the HTML file** under `blog/posts/` using the ISO date and a short slug.
   - Example: `blog/posts/2025-10-07-agentic-architecture.html`.
   - Base your markup on an existing post to retain the navigation, footer, and accessibility helpers.
2. **Update the blog index** (`blog/index.html`).
   - Add a new `<article class="blog-card">` block to the `.blog-grid` with the correct date, title, excerpt, and links.
   - Keep posts in reverse chronological order (newest first).
3. **Optional: highlight on the homepage.**
   - If a post deserves extra visibility, add a CTA or mention on the main landing page or relevant section.
4. **Deploy.**
   - Upload the new HTML files and the updated index to Azure Storage Static Websites (or trigger your CI pipeline).

## Writing tips

- Keep titles under 70 characters for good sharing previews.
- Use `<h2>` for top-level sections inside the article body.
- Include bullet lists or callouts for key takeaways—readers scan!
- Reference code or commands with `<code>` or properly styled blocks.
- For external links, include `target="_blank"` and `rel="noopener noreferrer"` to match the site’s security posture.

Happy writing! ✍️