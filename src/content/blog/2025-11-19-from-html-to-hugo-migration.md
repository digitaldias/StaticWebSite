---
title: "From hand-crafted HTML to Hugo: a migration story"
date: 2025-11-19
draft: false
description: "How I migrated digitaldias.com from custom HTML/CSS/JS to Hugo with GitHub Agent assistance, discovering how AI collaboration transforms the content creation workflow."
excerpt: "In September 2024, I hand-coded a portfolio site. Two months later, a YouTube video sparked a revelation: static site generators + AI agents = the content workflow I'd been missing since abandoning WordPress to hackers."
readTime: "8 minute read"
categories: ["Architecture", "DevOps"]
tags: ["Hugo", "Static Sites", "AI", "GitHub Agent", "Migration", "Web Development", "Chocolatey"]
author: "Pedro Dias"
---

<div class="toc-wrapper">
  <div class="toc-header">
    <h2>Table of contents</h2>
  </div>
  <nav class="toc-content">
    <ol>
      <li><a href="#the-revelation">The revelation: static generators + AI = content freedom</a>
        <ul>
          <li><a href="#wordpress-scars">My WordPress scars</a></li>
          <li><a href="#hand-coded-interlude">The hand-coded interlude</a></li>
          <li><a href="#youtube-epiphany">The YouTube epiphany</a></li>
        </ul>
      </li>
      <li><a href="#why-hugo">Why Hugo? (and how to actually install it)</a>
        <ul>
          <li><a href="#selection-criteria">The selection criteria</a></li>
          <li><a href="#installing-hugo">Installing Hugo on Windows (the right way)</a></li>
        </ul>
      </li>
      <li><a href="#migration-process">The migration process: AI as co-architect</a>
        <ul>
          <li><a href="#phase-1">Phase 1: assessment and planning</a></li>
          <li><a href="#phase-2">Phase 2: foundation setup</a></li>
          <li><a href="#phase-3">Phase 3: content migration</a></li>
          <li><a href="#phase-4">Phase 4: interactive features</a></li>
        </ul>
      </li>
      <li><a href="#results">The results: benefits beyond expectations</a></li>
      <li><a href="#what-i-learned">What I learned: AI as migration partner</a></li>
      <li><a href="#recommendations">Recommendations for your migration</a></li>
      <li><a href="#bottom-line">The bottom line</a></li>
      <li><a href="#getting-started">Getting started: your quick-start guide</a></li>
    </ol>
  </nav>
</div>

In September 2024, I did something delightfully old-school: I hand-coded my entire portfolio website. Custom HTML, 2,132 lines of CSS, interactive JavaScript. The whole nine yards. It felt great to have complete control, but I wasn't thinking about the future.

**Then I watched a YouTube video about static site generators.**

Suddenly, neurons fired. I'd used Jekyll years ago without really understanding what it was, another tool in the stack. But now, working with modern tooling daily, the pieces clicked: **Static site generators aren't limitations; they're liberation.**

Enter Hugo, Chocolatey, and GitHub Agent. This is the story of how AI collaboration turned a two-month-old hand-coded site into a content machine.

## The revelation: static generators + AI = content freedom {#the-revelation}

### My WordPress scars {#wordpress-scars}

Let me back up. Before hand-coding everything, I ran blogs on WordPress. You know the drill:
- Constant security updates
- Plugin vulnerabilities
- Database compromise attempts
- That sinking feeling when you log in and see "Your site may be hacked"

**I eventually gave up blogging** because the maintenance burden outweighed the joy of writing. The hackers won.

### The hand-coded interlude {#hand-coded-interlude}

Fast forward to September 2024. I decided to rebuild from scratch: pure HTML, CSS, and JavaScript. No CMS, no attack surface, no files to hack. It worked beautifully... for a portfolio.

But for blogging? Writing in raw HTML felt like coding with oven mitts on:
- Every paragraph wrapped in `<p>` tags
- Manual blog index updates
- No RSS feed
- No categories or tags
- No sitemap automation

**The friction was real.** I built a beautiful site, then avoided writing because the authoring experience was painful.

### The YouTube epiphany {#youtube-epiphany}

Then I stumbled upon a video explaining static site generators (I honestly can't remember which one; thanks, YouTube algorithm). The creator showed how Jekyll transformed Markdown into HTML.

**Brain explosion moment:** "Wait, I used Jekyll before and didn't realize it was doing this?!"

The lightbulb wasn't only about static generators; it was about **separation of concerns**:
- Write content in Markdown (focus on ideas)
- Let the generator handle HTML (focus on structure)
- Deploy static files (security by simplicity)

And then the second revelation: **What if I paired Hugo with AI?** Not only for migration, but for *ongoing content creation*. AI could help me write faster, stay focused, and not worry about Markdown syntax or front matter details.

## Why Hugo? (and how to actually install it) {#why-hugo}

### The selection criteria {#selection-criteria}
Here's the plain breakdown of my evaluation process:

**Framework options considered**
- Hugo (speed + simplicity)
- Next.js (React ecosystem)
- Nuxt (Vue ecosystem)
- 11ty (flexibility)

**Why Hugo stood out**
- Single binary distribution
- Sub-second builds (milliseconds, not seconds)
- No Node.js runtime required
- Built-in taxonomies, sitemap, RSS
- Azure-friendly deployment model

**Hugo won for five reasons:**

1. **Speed**: Builds in milliseconds. My 27-page site? 71ms.
2. **Zero dependencies**: Single binary; no npm hell, no Python virtual environments, no Ruby gems
3. **Markdown-first**: Write in Markdown, get HTML. Perfect for blogging.
4. **Built-in features**: Taxonomies, sitemap, RSS, asset pipeline: all included
5. **AI-friendly workflow**: Markdown is perfect for AI assistance. GitHub Agent can help write, structure, and refine content

### Installing Hugo on Windows (the right way) {#installing-hugo}

Here's what I actually did on my Windows machine:

**Step 1: Install Chocolatey (Windows Package Manager)**

Open PowerShell as Administrator and run:

```powershell
winget install chocolatey.chocolatey
```

**Step 2: Install Hugo Extended**

```powershell
choco install hugo-extended -y
```

The `-extended` version includes Sass/SCSS processing, which you'll want for any serious site.

**Step 3: Verify installation**

```bash
hugo version
# hugo v0.152.2-6abdacad3f3fe944ea42177844469139e81feda6+extended windows/amd64
```

**Step 4: Create your Hugo site**

```bash
hugo new site my-site
cd my-site
hugo server
```

That's it. No `npm install`, no `bundle install`, no virtual environments. Just a binary doing its job.

## The migration process: AI as co-architect {#migration-process}

Here's where it gets interesting. I didn't migrate this alone; I paired with **GitHub Agent in VS Code** (powered by Claude Sonnet 4.5). Not as a code generator, but as a *collaborator*.

**Important distinction:** I'm using GitHub Agent (the agentic AI assistant in VS Code), not GitHub Copilot (the inline code completion tool). The Agent can research, plan, execute multi-step tasks, and adapt based on feedback. For a migration like this, that's exactly what you need.

### Phase 1: assessment and planning {#phase-1}

**Me**: "I have my website under the src folder. I recently installed hugo, and I need to transfer my existing website so that I can continue writing blogs using hugo."

**GitHub Agent**: *Launched a research subagent* that:
- Analyzed my entire `src/` folder structure
- Read all HTML, CSS, and JavaScript files
- Identified design patterns, color schemes, interactive features
- Assessed accessibility implementations
- Generated a comprehensive 7-phase migration plan

This wasn't "move files around." The AI understood my *design intent*.

### Phase 2: foundation setup {#phase-2}
The collaboration flowed like a simple sequence:
1. I asked GitHub Agent to configure the Hugo foundation.
2. It generated `hugo.toml`, base layouts, taxonomies, and asset pipeline.
3. I requested preservation of the design system.
4. It copied all 2,132 lines of CSS and ported JavaScript features.
5. I verified that interactive effects and typography rendered correctly.

**What GitHub Agent did well:**
- Configured `hugo.toml` with proper settings, not generic defaults
- Created partial templates (`head.html`, `header.html`, `footer.html`) that matched my existing structure
- Set up Hugo Pipes for CSS/JS processing while preserving my exact variable names
- Identified accessibility features in my HTML and ensured they carried over to Hugo templates

**What I appreciated most:** It *asked* about edge cases rather than assuming. "Should navigation work differently on blog pages vs homepage?" That's collaboration, not automation.

### Phase 3: content migration {#phase-3}

The trickiest part: converting my HTML blog posts to Markdown without losing semantic richness.

**Before (HTML):**
```html
<article class="article-container">
    <header class="article-header section-container">
        <p class="blog-card-meta">September 30, 2025 · 6 minute read</p>
        <h1 class="article-title">How GPT5-Codex and Azure Static Websites launched digitaldias.com</h1>
        <p class="article-subtitle">It finally happened — I paired with GPT5-Codex...</p>
    </header>
    <div class="article-body section-container">
        <p>Building software for four decades gives you instincts...</p>
    </div>
</article>
```

**After (Markdown with Hugo front matter):**
```yaml
---
title: "How GPT5-Codex and Azure Static Websites launched digitaldias.com"
date: 2025-09-30
description: "Pedro Dias shares how GPT5-Codex helped build digitaldias.com..."
excerpt: "I paired with GPT5-Codex..."
readTime: "6 minute read"
categories: ["Architecture", "Azure", "AI"]
tags: ["GPT5", "Codex", "Azure Static Web Apps"]
---

Building software for four decades gives you instincts...
```

GitHub Agent created Hugo templates that used this front matter to render the exact same HTML structure, preserving my CSS classes, semantic markup, and accessibility features.

### 4. Interactive features preservation {#phase-4}

My site has rich JavaScript interactions:
- Scroll-reveal animations
- Animated stat counters
- Magnetic button effects
- Card tilt on hover
- Photo gallery with lightbox
- Parallax background tiles

**GitHub Agent understood the requirement:** These weren't optional decorations; they were part of the experience. It ported every feature with `prefers-reduced-motion` support intact, ensuring accessibility wasn't compromised for aesthetics.

## The results: benefits beyond expectations {#results}

### 1. Content velocity

**Before Hugo:**
```bash
# Create a new blog post
1. Copy template HTML file
2. Update metadata manually
3. Write content in HTML tags
4. Add to blog index manually
5. Update sitemap manually
6. Deploy
Time: ~45 minutes overhead
```

**With Hugo:**
```bash
hugo new blog/2025-11-19-my-post.md
# Write in Markdown
hugo
Time: ~5 minutes overhead
```

**Result:** I went from writing 1-2 blog posts per year to feeling excited about weekly publishing.

### 2. Built-in SEO

Hugo automatically generates:
- `sitemap.xml` with all pages, categories, and tags
- RSS feeds for blog and categories
- Canonical URLs on every page
- OpenGraph and Twitter Card metadata
- Proper heading hierarchy

I added `robots.txt` and configured the sitemap. Done.

### 3. Taxonomy

My blog now has automatic:
- **Categories**: Architecture, Azure, AI, DevOps, Photography
- **Tags**: Blazor, Hugo, GitHub Copilot, Static Sites, etc.
- **Archive pages**: Generated automatically for each category/tag

Old way: create and maintain these pages manually. Hugo way: they exist automatically.

### 4. Development experience

```bash
hugo server
# Site rebuilds in ~20ms on file save
# Live reload in browser
# Error messages are actually helpful
```

Compare that to my old workflow of manual browser refreshes and "inspect element" debugging.

### 5. Deployment simplicity

**Build command:**
```bash
hugo --minify
```

Output: optimized static files in `public/`. Deploy to Azure Static Web Apps, Netlify, GitHub Pages, or any static host. No server runtime required.

## What I learned: AI as migration partner {#what-i-learned}

### The good

**1. Pattern recognition:** GitHub Agent identified design patterns I'd built unconsciously and preserved them consistently.

**2. Accessibility advocacy:** It caught accessibility considerations I might have overlooked during migration: ARIA labels, focus states, and semantic HTML structure.

**3. Context retention:** Across our multi-hour session, the Agent remembered design decisions and constraints without me having to repeat them.

**4. Proven configuration:** It set up Hugo with sitemap settings, RSS outputs, canonical URLs, and asset pipeline optimizations I didn't know existed.

**5. AI-powered content creation:** The biggest win? Now I can ask GitHub Agent to help write blog posts. It helps structure ideas, maintain consistent tone, and keep me focused on the message.

### The challenges

**1. File path confusion:** On Windows, the AI sometimes got confused between `\` and `/` in paths. I had to intervene and correct paths manually a few times.

**2. Over-engineering temptation:** The AI suggested creating shortcodes for repeated elements (good idea!) but I had to pump the brakes. "Let's get the migration done first, optimize later."

**3. Verification required:** The AI couldn't actually *see* the rendered output. I had to visually verify the site looked correct, animations worked, and responsive design behaved properly.

**Humans excel at:** Vision, taste, judgment, verification, knowing when "good enough" is good enough
**AI excels at:** Research, pattern matching, consistency, execution, tireless iteration
**Together:** We shipped a complex migration in hours, not weeks, and built a content workflow that makes writing enjoyable again.

## Recommendations for your migration {#recommendations}

### Do this:
1. **Start with research**: Have the AI analyze your current site structure thoroughly
2. **Preserve first, optimize later**: Get feature parity, then improve
3. **Use version control**: Commit after each major phase for easy rollback
4. **Visual verification**: AI can't see your site; you must verify rendering
5. **Document decisions**: Create project-specific documentation for future AI context

### Avoid this:
1. **Blind automation**: Don't accept AI suggestions without understanding them
2. **Premature optimization**: Migrate first, refactor later
3. **Skipping accessibility**: Verify ARIA labels, focus states, and semantic HTML
4. **Ignoring errors**: Hugo build errors are your friend; fix them immediately
5. **Forgetting backups**: Keep your old site intact until you're 100% confident

## The bottom line {#bottom-line}

In September 2024, I hand-coded a website because I wanted control. In November 2024, I migrated to Hugo because I wanted to actually *write*.

What changed? I realized that:
- WordPress had taught me to fear blogging (security nightmares)
- Hand-coding HTML had taught me to avoid blogging (authoring friction)
- Hugo + GitHub Agent taught me to *enjoy* blogging again (AI-assisted content flow)

The real win isn't the migration. It's the workflow transformation:
- Write in Markdown with AI assistance
- Let Hugo handle HTML, sitemap, RSS, taxonomies automatically
- Deploy static files with zero security concerns
- Sub-second builds (71ms for 27 pages)
- No database, no plugins, no attack surface

Tools should amplify your intent, not constrain it. Hugo provides the structure. GitHub Agent provides the collaboration. You provide the vision.

I'm not hand-coding anymore, and I'm not fighting WordPress hackers anymore. I'm writing. That was the whole point.

---

## Common questions {#faq}

**Is Hugo better than WordPress for a personal blog?**
Depends on your goals. Hugo is faster, more secure, and cheaper to run, but requires comfort with the command line and Markdown. If you want a drag-and-drop editor and don't mind maintaining plugins, WordPress still has its place. If you're a developer who wants to own everything, Hugo wins.

**Do you need to know Go to use Hugo?**
No. Hugo uses Go templates under the hood, but you can write full themes and content without ever touching Go. The template syntax is readable and the documentation is good.

**What about GitHub Copilot vs GitHub Agent for migrations like this?**
Copilot completes code inline. Agent plans, executes, and iterates. For a migration involving dozens of files, structural decisions, and multi-step tasks, Agent is the right tool. Copilot would have helped with individual snippets; Agent drove the whole project.

**How long did the migration actually take?**
A few hours of active work spread across a weekend. The AI handled the repetitive parts; I handled verification and decision-making. That ratio is about right for any complex migration.

---

## Getting started: your quick-start guide {#getting-started}

**1. Install Hugo (Windows)**
```powershell
# Install Chocolatey first
> winget install Chocolatey.Chocolatey

# Then install Hugo Extended
> choco install hugo-extended -y
```

**2. Create your site**
```bash
hugo new site my-blog
cd my-blog
hugo server
```

**3. Use GitHub Agent in VS Code**
- Install VS Code
- Enable GitHub Agent (Settings → GitHub Copilot)
- Ask it to help you migrate or create content

**4. Write your first post**
```bash
hugo new blog/my-first-post.md
```

Then ask GitHub Agent: "Help me write a blog post about [topic]. Include structure and examples."

That's it. You're blogging with AI assistance on a secure, fast platform.

---

*Curious about the technical details? Check out the [Hugo documentation](https://gohugo.io/documentation/).*
