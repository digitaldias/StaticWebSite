---
title: "How GPT5-Codex and Azure Static Websites launched digitaldias.com"
date: 2025-09-30
draft: false
description: "Pedro Dias shares how GPT5-Codex helped build digitaldias.com and deploy it to Azure Storage Static Websites, including key lessons learned."
excerpt: "I paired with GPT5-Codex, poured a double espresso, and shipped a new digitaldias.com across a few sessions. Here's what worked, what surprised me, and why I'd do it again."
readTime: "6 minute read"
categories: ["Architecture", "Azure", "AI"]
tags: ["GPT5", "Codex", "Azure Static Web Apps", "AI", "Agentic Development"]
author: "Pedro Dias"
---

Four decades of writing software gives you instincts. Partnering with **GPT5-Codex** gave me a collaborator who never loses context and has opinions about design details. Together we built this site from scratch: accessibility-first, performance-tuned, and built around the dual heritage that shapes how I see things.

## Why GPT5-Codex was the perfect co-pilot

- **Instant ideation:** Need three layout variants for the hero section? Codex delivered options faster than I could sketch them on paper.
- **Accessibility watchdog:** From skip links to aria-live counters, Codex kept us honest about inclusive design from the first commit.
- **Frictionless refactoring:** Tweaking copy, trimming unused JavaScript, or inventing a new bio section became a conversation instead of a grind.

> When the code editor feels like a jam session, you know you've found the right collaborator.

## Hosting thrills with Azure Storage Static Websites

Once the pixels and prose aligned, deployment landed on **Azure Storage Static Websites**. There's remarkably little ceremony involved in publishing a site worldwide. A quick `az storage blob upload-batch`, a CDN endpoint, and suddenly the rest of the planet can peek into my world.

Pair that with the *pay-as-you-go* model and global redundancy, and it's a delightfully low-lift way to keep personal projects resilient. No servers to babysit, no patching windows. Commit, upload, and get back to mentoring teams or capturing that next photo.

## Key considerations for your own build

1. **Automate the pipeline:** Even for a static site, a GitHub Actions or Azure DevOps pipeline prevents manual upload mishaps.
2. **Mind the CSP:** Lock down Content Security Policy headers early, especially when sprinkling in external assets or analytics scripts.
3. **Version the blog:** Posts live in `blog/posts/`. Keep filenames ISO-dated and add them to `blog/index.html` so the feed stays fresh.
4. **Cache responsibly:** Azure's static hosting plays nice with immutable caching. Use digest-based file names for heavy assets to dodge stale content.
5. **Keep the human voice:** Codex may riff brilliantly, but the heartbeat comes from real stories. Balance generated structure with personal perspective.

## Common questions

**Does GPT5-Codex replace a developer or just speed things up?**
It speeds things up, sometimes dramatically. But someone still has to know what "accessibility-first" means, why a CSP matters, and when the AI has gone off in the wrong direction. The judgment stays human. The typing, less so.

**Is Azure Storage Static Websites a good choice for a personal blog?**
Yes for cost and simplicity. For this site I eventually moved to Azure Static Web Apps, which adds a proper CI/CD pipeline, custom domains, and managed SSL without extra configuration. Either works; Static Web Apps is less manual.

**What's the catch with AI-assisted web development?**
Verification. The AI can't see the rendered output. You have to open the browser, check the layout, test on mobile, verify ARIA roles work. The code usually functions; the visual details still need eyes.

---

## What's next?

This blog will keep going: agentic workflows in enterprise architecture, Blazor and Avalonia patterns, and the reality of staying curious 40 years in. Subscribe to the RSS feed or check back.
