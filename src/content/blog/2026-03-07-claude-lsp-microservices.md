---
title: "You're probably opening Claude Code at the wrong level"
date: 2026-03-07
draft: false
description: "Open Claude Code at the microservices root, not per service. Without CLAUDE.md and LSP plugins first, it costs more than it saves."
excerpt: "Most people open Claude Code inside a single service. Open it at the parent folder instead: then give it the tools it needs to not go blind."
readTime: "7 minute read"
categories: ["DevOps", "AI"]
tags: ["Claude Code", "LSP", "dotnet", "csharp", "typescript", "microservices", "monorepo", "csharp-ls", "agentic-development"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-03-07-claude-lsp-microservices/featured.jpg"
featuredAlt: "Top-down aerial view of a dark city grid at night, 13 districts connected by glowing blue pathways, one central hub lit in deep red"
imageCredit: "Generated with Z-Image-Turbo"
---

If your system is split into microservices, there's a good chance you're running Claude Code inside each service separately. One session for the API, another for the worker, another for the frontend. That's the obvious approach.

It's also the wrong one.

The real productivity gain comes from opening Claude Code at the parent folder: the common root that contains all your services. One session, full system visibility, cross-service reasoning without context switching. But opening at the root without proper preparation makes things actively worse: Claude compensates for not knowing the structure by reading everything it can find, and in a 13-service repo, that burns your context window fast.

There are two things that make root-level operation work. Both are required.

{{< callout >}}
**TLDR:** Open Claude Code at the parent folder containing all your services, not inside individual ones. Add a `CLAUDE.md` at the root so Claude arrives oriented. Install LSP plugins so it navigates by type graph instead of reading files; go-to-definition drops from ~2,100 tokens to ~15. On Windows, the C# LSP works immediately; the TypeScript LSP needs a [small `.exe` shim](https://gist.github.com/digitaldias/0570fdec31127113ffd10144dad2b5b5) due to a Node.js spawn bug in Claude Code. The strategy works in Cursor and Windsurf too.
{{< /callout >}}

---

## What "root level" actually means here

The repo I work with has thirteen service directories: .NET APIs, a React SPA, a Blazor app, a desktop tool, shared NuGet libraries, and a .NET Aspire orchestrator that ties it all together. Each directory is technically its own git repository. The unified entry point is `Platform.AppHost.sln`, which references all services as cross-solution projects.

This pattern is common enough to have a name: multi-repo acting as monorepo. You get independent deployment pipelines and clean ownership per service, but local development runs as an integrated system. One `dotnet run` from the Aspire host starts everything.

Opening Claude Code at the root of this structure means it can reason across all thirteen services in a single session. That's the capability you want. When a bug spans a service boundary (something publishes an event, something else consumes it, something breaks in the middle), you want Claude to trace that flow without you having to manually relay context between separate sessions.

But here's the problem: a root-level session without any tooling means Claude is navigating blind. It sees a large directory tree it doesn't understand, and it does what any navigator does without a map: it starts reading road signs. In a large repo, that's expensive.

Teams working across multi-repo microservices architectures [routinely burn 40–60% of their token budget on cross-repo context duplication](https://richardporter.dev/blog/claude-code-token-management). Most of that is avoidable.

---

## The first requirement: CLAUDE.md as your system map

`CLAUDE.md` is loaded before anything else in a session. At the root of your repo, it's the difference between Claude arriving oriented and Claude arriving confused.

A root-level `CLAUDE.md` for a multi-service repo should cover:

- Every service: what it does, what tech it uses, what port it runs on
- Architecture decisions that apply everywhere: naming conventions, library choices, patterns to follow and avoid
- Shared libraries: what they are, what they do, the dependency chain between them
- What not to touch without asking (shared contracts, infrastructure definitions, published packages)
- Per-technology build and test commands

That last guardrail matters. In a multi-service setup, some files have blast radii that span the entire system. Claude doesn't know that unless you tell it. A casual refactor of a shared domain model can break things across services you haven't mentioned yet in the session.

Anthropic's own guidance is to keep the root `CLAUDE.md` under 10,000 words and document only what applies broadly: service-specific detail belongs in per-service `CLAUDE.md` files scoped to those directories. Claude pulls those in automatically when it works in a subdirectory. [The nested structure is intentional and supported](https://claude.com/blog/using-claude-md-files).

A well-written root `CLAUDE.md` eliminates the exploratory phase entirely. Claude doesn't need to list directories or read README files to understand what it's working with. It already knows.

{{< img src="/images/blog/2026-03-07-claude-lsp-microservices/blueprint.jpg" alt="Dark technical blueprint showing software service zones connected by annotation lines on a near-black background" caption="The CLAUDE.md acts as the system blueprint: every service, its purpose, and the rules that span all of them" credit="Generated with Z-Image-Turbo" >}}

---

## The second requirement: LSP, and why it stops being optional at root level

Here's where the setup gets critical. When you operate at the root level, the volume of potential file reads scales with your service count. Every cross-service question (where is this type consumed, who implements this interface, what does this method return) becomes a multi-directory navigation problem. Without a type graph, Claude solves it with text search: grep, read, grep again, read again.

The numbers make the problem concrete. Here's what typical navigation operations actually cost, with and without LSP:

| Operation | Without LSP | Tokens | With LSP | Tokens |
|---|---|---:|---|---:|
| Go to definition (in-solution type) | grep: 206 file paths returned | ~2,100 | `goToDefinition` call | ~15 |
| Find all references (100-file project) | grep scan + output filtering | 2,000+ | `findReferences` call | ~500 |
| Check a method's return type | read the containing file | ~800 | `hover` call | ~50 |
| Verify an interface has one implementor | grep + read matching files | ~1,500 | `findReferences` on the interface | ~150 |
| Trace a cross-service event flow | grep × 3 + read 4–5 files | ~4,500 | LSP calls + targeted reads | ~1,100 |

The go-to-definition row is a real measurement from this repo: searching for `TsExceptionHandler` via grep returned 206 file paths (~2,100 tokens); the same lookup via `goToDefinition` cost ~15 tokens and landed directly on the definition. The find-references row comes from [a published benchmark on a 100-file project](https://zircote.com/blog/2025/12/lsp-tools-plugin-for-claude-code/); the rest are derived from operation mechanics. Speed tells the same story: [grep takes 3–60 seconds per operation; LSP answers in ~50ms](https://karanbansal.in/blog/claude-code-lsp/).

In a single-service session, the overhead is manageable. At the root of a 13-service repo, it compounds fast. A non-trivial debugging task touching four services without LSP costs roughly 15,000–20,000 tokens in navigation alone; that's 10–15% of your entire context window spent finding things, not fixing them.

There's also a precision problem token counts don't capture. [Grep for `getUserById` in a moderately sized project returns 500+ matches (comments, strings, similar function names, type definitions)](https://zircote.com/blog/2025/12/lsp-tools-plugin-for-claude-code/). `findReferences` returns the 23 actual call sites. Claude has to process all 500 grep results before it can act on the 23 it actually needs. At scale, that noise accumulates into significant wasted context.

### The blind spot: types outside the indexed solution

LSP isn't unconditional. The same `TsExceptionHandler` search exposed it: when a type lives in a local NuGet library project not referenced by the indexed solution file, `goToDefinition` returns nothing. Silently. No error, no fallback, no hint. Grep found it in one call; LSP didn't see it at all.

This is a structural limitation. `csharp-ls` indexes what's in the solution. Types in separately built NuGet packages, unpublished local libraries, or projects outside the solution graph are invisible to it. In a multi-repo setup with shared library packages, you will hit this.

The practical workflow: use LSP as the first tool for in-solution navigation, keep grep as the fallback for anything that comes back empty. [LSP and grep are complementary, not alternatives](https://claudelog.com/faqs/what-is-lsp-tool-in-claude-code/): grep discovers, LSP navigates. What disappears is the expensive file-read chain that follows a successful lookup, not grep itself.

{{< img src="/images/blog/2026-03-07-claude-lsp-microservices/type-graph.jpg" alt="Abstract constellation graph of 13 glowing nodes in dark void, connected by blue edges with one red path tracing through four nodes" caption="With LSP indexing the full solution, Claude sees the type graph as a connected system: not 13 isolated directories" credit="Generated with Z-Image-Turbo" >}}

---

## Installing the plugins

Claude Code shipped native LSP support in December 2025 (version 2.0.74). Two plugins cover the full stack of the repo I work with:

**C# — all .NET services, via `csharp-ls`:**

```bash
dotnet tool install --global csharp-ls
claude plugin install csharp-lsp@claude-plugins-official --scope local
```

`csharp-ls` (version 0.22.0) is a dotnet global tool. Pointed at `Platform.AppHost.sln`, it indexes the full type graph across all .NET services simultaneously: not one project at a time, but the entire cross-solution reference graph. That's what makes the multi-repo structure transparent to the agent.

**TypeScript — the React frontend, via `typescript-language-server`:**

```bash
npm install -g typescript-language-server typescript
claude plugin install typescript-lsp@claude-plugins-official --scope local
```

`typescript-language-server` (version 5.1.3) covers all `.ts` and `.tsx` files.

The `--scope local` flag on both installs means the plugins are active for this workspace only. Both servers start automatically when Claude Code opens the workspace.

If you're working in other languages, [community-maintained LSP plugin collections](https://github.com/boostvolt/claude-code-lsps) cover most of the major ones: Go, Python, Rust, Java, Kotlin, and more.

### Windows setup notes

On Windows 11, these two installs behave very differently.

**C# worked out of the box.** `dotnet tool install -g csharp-ls` produces a real `.exe`, which Node.js can spawn directly. No fixes needed. The only thing worth knowing: the cold start while it indexes your solution takes longer than you'd expect. Give it a minute before assuming something is broken.

**TypeScript was broken.** The root cause is a Windows-specific bug in Claude Code: npm installs global binaries as `.cmd` batch wrappers, but Claude Code spawns LSP servers using Node.js `spawn()` without `shell: true`. That means it can only execute real `.exe` files. The `.cmd` wrapper is invisible to it, and the language server never starts.

There are two fixes. The one I used: build a small .NET console app that acts as a shim. A real `typescript-language-server.exe` that invokes `node.exe` directly with the path to the language server's `cli.mjs` entry point, bypassing the `.cmd` entirely. Drop it into `C:\Users\<you>\AppData\Roaming\npm\` alongside the existing `.cmd`, and Claude Code picks it up on next startup. [Source and build instructions on GitHub Gist](https://gist.github.com/digitaldias/0570fdec31127113ffd10144dad2b5b5).

The alternative is [`tweakcc --apply`](https://github.com/Piebald-AI/tweakcc), a patch that modifies Claude Code to use `shell: true` on Windows. It solves the same problem without building anything, but requires Claude Code to not be running when applied. The shim approach works without closing anything and survives Claude Code updates, which is why I prefer it.

**Beyond Claude Code.** The plugin system and `CLAUDE.md` are specific to Claude Code, but the strategy transfers to any agentic coding tool that supports language servers. Cursor and Windsurf have built-in LSP support and their own context files (`.cursorrules` and `.windsurfrules`). GitHub Copilot reads `.github/copilot-instructions.md`. The names differ; the principle is identical: arrive oriented, navigate with the type graph, not the file system.

---

## What changes in practice

With CLAUDE.md and LSP in place, opening Claude Code at the root works the way you want it to. Claude arrives knowing the system layout, the constraints, and the conventions. When it needs to trace something across service boundaries, it follows the type graph rather than reading files speculatively.

Claude navigates like a developer who's been on the project for a year. It jumps to definitions, finds all consumers of a type across the full solution, checks interface implementations, and verifies type compatibility; none of it requires reading source files unless they're actually needed.

If you're running separate sessions per service, you're paying the context-loading cost multiple times and manually bridging cross-service understanding yourself. One root-level session, properly tooled, does the work of several. The setup is about an hour. The `CLAUDE.md` takes longer to write well, but that investment pays back in every subsequent session.

---

## What's next: MCPs

LSP covers code intelligence. MCP (Model Context Protocol) servers extend Claude's awareness to external systems using the same principle: give Claude structured access to information rather than having it guess. Azure DevOps for work items and pipeline state, Azure for infrastructure, whatever else is relevant.

I'm wiring these up for the same workspace and will write about the setup separately once it's been running long enough to have an opinion. The precedent from LSP suggests the pattern works: tell Claude what it needs to know through the right interface, and it stops reaching for blunt instruments.

---

*Pedro Dias is Acting Chief AI Officer at Tradesolution AS and writes about .NET, architecture, and the tools that make development less painful. More at [digitaldias.com](https://digitaldias.com).*
