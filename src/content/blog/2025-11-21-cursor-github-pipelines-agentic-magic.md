---
title: "Agentic development in practice: Cursor + GitHub Actions"
date: 2025-11-21
draft: false
description: "Cursor AI autonomously resolved GitHub Actions pipeline issues through iterative builds. A practical look at agentic development patterns and their implications for DevOps migrations."
excerpt: "Cursor AI autonomously debugged a GitHub Actions pipeline through five build cycles, making targeted modifications until success. An instructive example of agentic development applied to infrastructure work."
readTime: "4 minute read"
categories: ["DevOps", "AI"]
tags: ["Cursor", "GitHub Actions", "AvaloniaUI", "Agentic Development", "Azure DevOps", "CI/CD"]
author: "Pedro Dias"
featuredImage: "/images/blog/2025-11-21-cursor-github-pipelines/featured.jpg"
featuredAlt: "Cursor IDE interface showing GitHub MCP integration autonomously modifying pipeline configuration"
imageCredit: "© Pedro Dias"
---

{{< callout type="success" title="TL;DR" >}}
Cursor AI autonomously debugged a GitHub Actions pipeline through five build cycles, reducing what would have been a day's work to 30 minutes. By connecting Cursor to GitHub via MCP and giving it permission to iterate, it successfully migrated an AvaloniaUI app's CI/CD from Azure DevOps to GitHub Actions without human intervention. This demonstrates agentic development's potential for infrastructure work—delegating tedious iteration cycles while developers focus on architecture and strategy.
{{< /callout >}}

## The Setup

At Tradesolution AS, we're evaluating a migration from Azure DevOps to GitHub Actions. Our test case: an AvaloniaUI desktop app requiring multi-platform builds (Windows, macOS, Linux).

In Azure DevOps, we had months of accumulated YAML tweaks—the "don't touch it, it's working" kind. Starting fresh in GitHub Actions meant rewriting all of that.

This experiment is part of our ongoing scrutiny of Cursor. We need to justify its cost and subscription model. Can it deliver enough value to offset the subscription? This pipeline migration became a real-world test case.

Or so I thought.

{{< callout type="info" title="Key Insight" >}}
This isn't about AI replacing developers. It's about delegating tedious iteration—the "try this, wait 6 minutes, try again" cycles—while you focus on architecture and strategy.
{{< /callout >}}

## What Happened

I connected Cursor to GitHub via MCP and gave it one instruction: "Set up a GitHub Actions workflow for our AvaloniaUI app. Fix any issues. Push to main."

Then I watched.

Cursor generated the initial workflow. **Build failed.** Missing dependencies.

It didn't ask for help. It parsed the error logs, identified missing .NET SDK versions, updated the workflow, and pushed again.

**Build failed again.** Avalonia build targets misconfigured.

Cursor adjusted. Pushed. Waited 6 minutes.

**Still failing.** Platform-specific NuGet packages missing.

It kept going. Five iterations. Each cycle: wait 6 minutes → parse errors → make targeted fixes → commit → monitor.

{{< img src="/images/blog/2025-11-21-cursor-github-pipelines/successful-build.png" alt="GitHub Actions dashboard showing successful multi-platform build with green checkmarks across Windows, macOS, and Linux platforms" caption="After 30 minutes of autonomous iteration: successful build across all platforms" width="1000" class="article-image featured" >}}

> "Watching AI debug a pipeline through five 6-minute build cycles without human input wasn't just impressive—it was a glimpse of how infrastructure work fundamentally changes."

**After 30 minutes: ✅ Build succeeded. All platforms. All checks passed.**

## Why This Matters

**Time compression:** Those 30 minutes would have been hours—maybe a full day—of manual debugging. Cursor compressed a day's work into half an hour without frustration or second-guessing.

**Expertise democratization:** Deep GitHub Actions knowledge becomes less critical. Define the objective; Cursor handles implementation through iteration.

**Learning by observation:** I learned from watching Cursor work. The final pipeline YAML is cleaner and more maintainable than what I would have written. It's like pair programming with infinite patience and instant access to best practices.

{{< callout type="success" title="Practical Takeaway" >}}
Don't schedule weeks of specialist time for pipeline migrations. Give Cursor clear objectives, MCP access, and permission to iterate. Monitor the first migration closely—subsequent ones get faster.
{{< /callout >}}

## Strategic Impact

This changes our migration approach. Instead of a large, risky project requiring specialist knowledge, we're treating it as a series of smaller migrations with AI-assisted iteration.

Each migration provides training data. Cursor accumulates institutional knowledge, improving with each repository. This reduces the "bus factor"—knowledge encoded in workflows rather than concentrated in individual engineers.

Three more repositories are scheduled for migration next quarter. With Cursor + GitHub MCP, this is feasible without dedicated pipeline specialist time.

**The bottom line:** Agentic development isn't just a productivity boost—it's a shift in how we approach infrastructure work. Computers now handle iterative debugging that previously consumed engineering time, enabling focus on architecture, UX, and strategic choices.

**This amplifies developers rather than replacing them.**

## Cost Justification

Cursor's $20/month subscription isn't trivial. It quickly runs out and then starts eating away on-demand usage. This experiment demonstrates tangible ROI: what would have been a day's work compressed into 30 minutes. For our team, that time savings compounds across multiple migrations and ongoing maintenance.

We're tracking these metrics: time saved per task, reduction in specialist dependencies, and quality of generated code. Early results suggest the subscription pays for itself when used strategically—not as a crutch, but as a force multiplier for complex, iterative work.

The verdict is still out, but autonomous pipeline debugging is a strong data point in Cursor's favor.

---

## Try It Yourself

Start with a non-critical repository. Give Cursor explicit permission to push changes. Watch the first few iterations closely. Document what works.

If you've experimented, I'd value hearing your results—especially failure modes and edge cases. Connect on [LinkedIn](https://linkedin.com/in/digitaldias) or [GitHub](https://github.com/digitaldias).

{{< callout type="info" >}}
**Found this helpful?** Share your thoughts on [LinkedIn](https://linkedin.com/in/digitaldias) or tag me on [GitHub](https://github.com/digitaldias)—I read and respond to every comment.
{{< /callout >}}

## References

Technologies and tools mentioned in this post:

- **[Cursor](https://cursor.sh)** - AI-powered code editor with agentic development capabilities
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD platform for automating workflows
- **[AvaloniaUI](https://avaloniaui.net/)** - Cross-platform .NET UI framework for Windows, macOS, and Linux
- **[Azure DevOps](https://azure.microsoft.com/products/devops)** - Microsoft's DevOps platform (migrated from)
- **[MCP (Model Context Protocol)](https://modelcontextprotocol.io/)** - Protocol for connecting AI assistants to external tools and data sources
- **[.NET SDK](https://dotnet.microsoft.com/download)** - Software development kit for building .NET applications
- **[NuGet](https://www.nuget.org/)** - Package manager for .NET
