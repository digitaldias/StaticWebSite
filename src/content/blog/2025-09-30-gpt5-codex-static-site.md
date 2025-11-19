---
title: "How GPT5-Codex and Azure Static Websites launched digitaldias.com"
date: 2025-09-30
draft: false
description: "Pedro Dias shares how GPT5-Codex helped build digitaldias.com and deploy it to Azure Storage Static Websites, including key lessons learned."
excerpt: "It finally happened—I paired with GPT5-Codex, poured a double espresso, and shipped an entirely new digitaldias.com in the space of a few thrilling sessions."
readTime: "6 minute read"
categories: ["Architecture", "Azure", "AI"]
tags: ["GPT5", "Codex", "Azure Static Web Apps", "AI", "Agentic Development"]
author: "Pedro Dias"
---

Building software for four decades gives you instincts, but partnering with **GPT5-Codex** feels like inviting a fellow architect into the room—one who never sleeps, never loses context, and has a wicked sense for design details. Together we re-imagined this site from the ground up: accessibility-first, performance-tuned, and visually aligned with the dual heritage that inspires me every day.

## Why GPT5-Codex was the perfect co-pilot

- **Instant ideation:** Need three layout variants for the hero section? Codex delivered options faster than I could sketch them on paper.
- **Accessibility watchdog:** From skip links to aria-live counters, Codex kept us honest about inclusive design from the first commit.
- **Frictionless refactoring:** Tweaking copy, trimming unused JavaScript, or inventing a new bio section became a conversation instead of a grind.

> When the code editor feels like a jam session, you know you've found the right collaborator.

## Hosting thrills with Azure Storage Static Websites

Once the pixels and prose aligned, deployment landed on **Azure Storage Static Websites**. I'm continually impressed by how little ceremony it takes to publish a lightning-fast site worldwide. A quick `az storage blob upload-batch`, a CDN endpoint, and suddenly the rest of the planet can peek into my world.

Pair that with the *pay-as-you-go* model and global redundancy, and it's a delightfully low-lift way to keep personal projects resilient. No servers to babysit, no patching windows—just commit, upload, and get back to mentoring teams or capturing that next photo.

## Key considerations for future me (and you!)

1. **Automate the pipeline:** Even for a static site, a GitHub Actions or Azure DevOps pipeline prevents manual upload mishaps.
2. **Mind the CSP:** Lock down Content Security Policy headers early—especially when sprinkling in external assets or analytics scripts.
3. **Version the blog:** Posts live in `blog/posts/`. Keep filenames ISO-dated and add them to `blog/index.html` so the feed stays fresh.
4. **Cache responsibly:** Azure's static hosting plays nice with immutable caching. Use digest-based file names for heavy assets to dodge stale content.
5. **Keep the human voice:** Codex may riff brilliantly, but the heartbeat comes from real stories. Balance generated structure with personal perspective.

## What's next?

This blog will chronicle more experiments: agentic workflows in enterprise architecture, Blazor and Avalonia patterns that excite me, and the behind-the-scenes reality of staying curious after 40 years in tech. If you're as energized by this new frontier as I am, keep the tab open—there's more on the way.
