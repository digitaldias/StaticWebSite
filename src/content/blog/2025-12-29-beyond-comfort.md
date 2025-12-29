---
title: "Beyond the comfort of C#"
date: 2025-12-29
draft: false
description: "Agentic coding built my JS/TypeScript foosball tracker, Qt/C++ audio tool, and assembler DirectX renderer while I steered with prompts; that flipped how I ship."
excerpt: "I did not type the code for three projects: a foosball tracker, a Qt/C++ audio manager, and an assembler DirectX renderer. GPT-5 and Claude 4.5 (Opus and Sonnet) produced the code while I set prompts, tests, and constraints. Here is what worked, what surprised me, and how this changes the next builds."
readTime: "10 minute read"
categories: ["Architecture", "Development"]
tags: ["JavaScript", "TypeScript", "C++", "Assembler", "DirectX", "Qt", "Audio", "Graphics"]
author: "Pedro Dias"
featuredImage: "/images/blog/2025-12-29-beyond-comfort/featured.jpg"
featuredAlt: "Desk with Mandelbrot render, foosball ball, and audio waveforms showing a multilingual maker's tools"
imageCredit: "Pedro Dias"
---

{{< callout type="success" title="TL;DR" >}}
Agentic coding wrote three working apps for me: a JS-to-TypeScript foosball tracker, a Qt/C++ audio tool, and an assembler-powered DirectX renderer. My job was to steer with prompts, set constraints, run tests, and judge outputs. GPT-5 and Claude 4.5 (Opus and Sonnet) did the typing. The shock is how far this went without me writing the code. The next step is deciding when to trust these agents and when to slow them down.
{{< /callout >}}

## Leaving the comfort of C#

C# has been my home base ever since it came around. Strong tooling, LINQ muscle memory, and a predictable runtime meant I could build features on autopilot. That comfort now has company: GPT-5, Claude 4.5, and other agents can produce code across stacks at a pace that makes my habits look slow. The autopilot needed a seatbelt once the agents showed up. I wanted to see whether these agents could leave my C# world and ship in languages where I usually stumble. The answer landed fast. I described the target, added constraints, and watched the bots build.

Three projects show the shift. Foosh, a PWA foosball tracker with a React client, Node.js and TypeScript server, MongoDB, Socket.IO, and Microsoft Entra ID. A desktop audio manager that normalizes, compresses, cuts, and fades sound libraries. A fractal renderer that animates Mandelbrot and Julia sets without dropped frames. I did the prompting, scoping, and reviewing. The agents produced the JavaScript and TypeScript modules, the Qt and C++ code, and the assembler loop inside a DirectX pipeline. I felt less like a coder and more like a director of a fast and literal team.

## Foosball tracker: from prompt to polished Foosh

Foosh needed to feel like a game, not a spreadsheet. I asked GPT-5 for a PWA with a React client built with Vite, a Node.js and TypeScript server, MongoDB, Socket.IO, and Microsoft Entra ID via MSAL. It had to run in Docker and deploy to Azure Container Apps. The first prompt listed the features: lobby to create or join matches, a mobile scoring page that lays flat on the table with on-screen score buttons, a live watch page with a timeline, Elo leaderboards, and the three walls for bragging rights and infamy. The agent shipped a running build in minutes. I did not read the code; I opened the scoring page on my phone, started a lobby on my laptop, and watched events sync in real time.

I iterated by describing what I saw instead of reading source. When the watch page felt too quiet, I asked for sound cues on the scorer device for goals, round wins, stuffings, sudden death, and undo. When the walls were missing, I asked for the Wall of Shame (10-0 round), the Wall of Utter Disgrace (20-0 match), and the Wall of Øyvind (3 stuffings in a row) with live updates. When the lobby flow felt slow, I asked for a darker, gamey palette and a quicker path from QR join to score entry. Every change came back as a small diff with a short rationale; my loop was to play a round, note gaps, and send another prompt—like ordering refills from a very fast barista.

Architecture stayed agent-driven. I asked Claude to refit Foosh with CQRS and Event Sourcing. Commands and events gained shared TypeScript contracts so the client and server could not drift. The agent projected event streams into leaderboards, walls, and timelines, and wired Socket.IO to broadcast updates before the trash talk cooled. When the scoring page and watch page fell out of sync, I described the mismatch and the agent reconciled the contracts and shipped a new build.

Prompt discipline mattered more than syntax. I kept a living prompt that named the domain nouns (lobby, round, timeline, wall), the on-screen score buttons for tabletop mode, the rule that sound plays only on the scorer, and the ban on external calls beyond MongoDB and Entra ID. Every time I asked for an addition, I pasted the same contract first; it felt like a small ritual to keep the genie aligned. Drift dropped to near zero. When the agent proposed flashy UI I did not ask for, I sent it back with the same contract and it complied. The loop felt like managing a junior dev who moves fast as long as the spec stays visible.

<img src="/images/blog/2025-12-29-beyond-comfort/inline-01.jpg" alt="Diagram showing the foosball tracker moving from C# to JS to TypeScript" loading="lazy" decoding="async" />

## Woosh audio manager in Qt and C++: taming waveforms

The next problem was audio chaos: goal shouts, ambience, and timing cues. I could not find a commercial or open-source tool that let me edit and manage all the Foosh sounds in one place, so I asked an agent to build it. I chose C++ up front because I needed raw processing power for waveform edits and a responsive VU-meter. I handed Claude Opus a prompt: Qt desktop app, C++ core, waveform rendering, normalization, compression, cutting, fading, and exports in multiple formats. It replied with a project skeleton, CMake files, and dependencies that compile cleanly with libsndfile, mpg123, mp3lame, and Qt6 Multimedia. We named it Woosh because names matter when you are shipping game sounds; Foosh makes the goals, Woosh makes the goals sound like a meteor hit the table.

I asked the agent to add a responsive UI that never blocks. It used signals and slots to keep rendering separate from processing threads. Builds stay CMake-first; when a dependency needed a tweak, the agent gave me the patch and the rebuild steps. When the first build produced silence, I asked for a debug plan; it added logging around gain staging and buffer boundaries, and the next run produced sound.

The pipeline now scans a raw folder, renders waveforms, normalizes, compresses, cuts, applies fades, and exports to the target game sound folder without touching the originals. The raw folder is the pantry; the game folder is the plated dish. The agent cached intermediate buffers so tweaks rerun in milliseconds. A file watcher reruns the pipeline when new sounds land in the raw folder, turning the app into a quiet assistant during match days. It behaves like a native tool because it is one, and I did not type the C++.

I trusted the output because I controlled the inputs. I pulled a batch of sounds from Pixabay after the agent produced a table of search prompts for each needed clip. I downloaded, dropped them into the raw folder, and let Woosh process them. I listened, noted what felt off, and asked the agent for tweaks. That loop—prompt, download, process, listen—felt like a tasting menu for sound effects.

<img src="/images/blog/2025-12-29-beyond-comfort/inline-02.jpg" alt="Qt-based audio manager showing waveform trimming and compression" loading="lazy" decoding="async" />

## DirectX and assembler: animating fractals without waste

The third leap went to the metal. I asked GPT-5 to build a DirectX 11 fractal renderer because I had never touched real assembler beyond college or DirectX at all. The goal: smooth Mandelbrot and Julia animations, fast palette swaps, and zooms that feel like gliding instead of jolting.

The agent split the work in two. First, let the GPU paint the fractal and the starfield/smoke effects in one pass so the screen stays at 60 fps. If the GPU cannot do deep math (hello ARM laptops), the code switches to a simpler mode. Second, keep a CPU fallback: threads render small tiles, and a hand-written assembly inner loop crunches eight pixels at once; if that is too fancy for the moment, a plain C path steps in. Different brushes, same picture.

Palettes are pre-baked color ramps. Switching them is a buffer swap, not a rebuild. Zoom uses easing so moves feel smooth, pan follows the mouse, and click-to-zoom lands where you expect.

Fullscreen was the fussy part. The agent handled the DirectX setup, the shaders, the assembly kernel, and the resize safety. My job was to run it, say “it crashed,” and paste logs. It even set up log collection and later pulled the log file itself when I said so. I did not know why it failed; the agent did—and fixed it. The smoke kept rising, the frames stayed smooth, and I stayed out of the weeds.

<img src="/images/blog/2025-12-29-beyond-comfort/inline-03.jpg" alt="DirectX assembler Mandelbrot and Julia animation controls" loading="lazy" decoding="async" />

## How I prompt and review

- Start with constraints, not features: language, toolchain, no external services, and the exact folders to touch.
- Include fixtures in the prompt: example inputs, expected outputs, and failure cases. Agents respond better to concrete data than to adjectives.
- Ask for a plan before code when the task is big. Small plans reduce runaway output and make it clear where to intervene.
- Demand small diffs. When the agent sends a wall of code, ask it to resend as a patch with explanations.
- Keep a standing quality bar: lint, tests, and formatting. Mention them every time. Repetition trains the agent.
- Review like a PR: scan for scope creep, check the tests first, and reject anything that widens dependencies without approval.

## What surprised me about agentic coding

- The agents respected contracts when I repeated them. They drifted when I got lazy.
- They produced working build scripts as long as I asked for them. Missing steps were my fault for not requesting them.
- They handled refactors across files faster than I would by hand; my role was to shape the interfaces and spot the rough edges.
- They failed loudly when they lacked metrics. As soon as I supplied numbers, they optimized toward them with clarity.
- They removed ceremony. No boilerplate for its own sake; every line had to earn its place once I asked for lean outputs.

## What still needs my hands

- Picking constraints. Agents do not decide which dependencies stay out; I do.
- Protecting data. No production secrets enter prompts, and no real user files leave my machine.
- Hardware integration. When audio devices or browsers misbehave, I still plug, replug, and observe.
- Taste. The agent can suggest UI, but I choose clarity over flash, and I prune anything that distracts players.
- Accountability. If the app crashes mid-match, that is on me, not the model.

## Patterns that transfer across stacks

- Agents like constraints. The more specific the prompt on architecture, file layout, and test expectations, the closer the first draft lands.
- Ask for diffs and explanations. When GPT or Claude replies with a patch plus a rationale, review time drops.
- Keep platform edges isolated. DOM access, audio IO, and GPU calls belong at the edges so the core stays testable and the agent has less surface to break.
- Demand tests early. Property-based tests for scoring, golden files for audio, and frame timing assertions for graphics give the agent a target and keep regressions visible.
- Add instrumentation before asking for speed. Profilers in browsers, Qt, and DirectX each tell a different truth; combine them before optimizing.
- Keep loops short. Small prompts, fast feedback, and tiny binaries encourage bold edits and quick rollbacks.

## Where to go next

These experiments handed me a new role. I can ask agents for UI in JS and TypeScript, audio pipelines in C++, and assembler when cycles matter. My time shifts to scoping, reviewing, and testing. The next moves need intention.

- Foosball tracker: package the TypeScript version as a turnkey download with sync-free persistence and a friendly layout for public events. Ask the agent to polish tabletop scoring and ship checksums for the binaries.
- Audio manager: add batch presets, level targets per venue, and export profiles so friends can process libraries without thinking about compressors. Script the build so the agent cannot drift on dependencies.
- Fractal renderer: expose the assembler core as a library with a clean DirectX wrapper, then script animations from TypeScript to mix ease with speed. Add a recorded benchmark suite so future agent edits cannot slow the hot loop.
- Cross-cutting: document the prompting patterns, the tests, and the no-go rules once, then reuse them as checklists before choosing a language for the next build.

Cadence matters. I plan weekly micro-builds where the agent handles a single feature in a language that risks cooling down. Each session ends with a one-page note: what the agent got right, where it drifted, which constraints helped, and which ones slowed it. The notes become a playbook so I can reach for the right tool without guessing.

Ownership still matters. The agent writes code, but I sign off on what ships. I keep secrets out of prompts, lock down API keys, and run everything locally before trusting it near users. The speed is real; so is the need for judgment about where the code runs and who depends on it. My role shifts from typing to curating, but the responsibility remains mine.

## Try it yourself

- Pick a small feature you always build by hand and ask an agent for it in a different language this week.
- Ask for tests in the same prompt as the feature; do not bolt them on later.
- Request diffs, not walls of code, so review stays fast.
- Add logging and metrics before asking the agent to optimize; give it hard numbers to improve.
- Keep a log of prompt templates and their results so you know which constraints lead to clean code.
- Keep secrets out of prompts and avoid pasting production data; treat agents like contractors who see only what they need.
- Run the agent output locally and offline first; only connect to external services once it passes local tests.

{{< callout type="info" >}}
**Found this helpful?** Share your thoughts on [LinkedIn](https://linkedin.com/in/digitaldias) or tag me on [GitHub](https://github.com/digitaldias); I read and respond to every comment.
{{< /callout >}}

## References

- **[Hugo](https://gohugo.io/)** - Static site generator that powers this blog.
- **[JavaScript](https://developer.mozilla.org/docs/Web/JavaScript)** - Used across the Foosh client and server.
- **[TypeScript](https://www.typescriptlang.org/)** - Shared contracts across client, server, and events.
- **[React](https://react.dev/)** - PWA client for Foosh.
- **[Vite](https://vitejs.dev/)** - Build tool for the Foosh client.
- **[Node.js](https://nodejs.org/)** - Server runtime for Foosh commands and events.
- **[MongoDB](https://www.mongodb.com/)** - Persistence layer for Foosh data.
- **[Socket.IO](https://socket.io/)** - Real-time sync between scorer, lobby, and watch pages.
- **[Microsoft Entra ID](https://learn.microsoft.com/entra/identity-platform/overview)** - Identity provider via MSAL.
- **[CQRS and Event Sourcing](https://martinfowler.com/bliki/CQRS.html)** - Architecture pattern for Foosh commands and projections.
- **[Docker](https://www.docker.com/)** - Container runtime for Foosh deployments.
- **[Azure Container Apps](https://learn.microsoft.com/azure/container-apps/)** - Hosting for Foosh.
- **[Qt](https://www.qt.io/)** - Cross-platform framework behind the audio manager UI.
- **[C++](https://isocpp.org/)** - Language used for the audio pipeline and DSP hotspots.
- **[CMake](https://cmake.org/)** - Build system for Woosh.
- **[libsndfile](https://libsndfile.github.io/libsndfile/)** - Audio read/write in Woosh.
- **[mpg123](https://www.mpg123.de/)** - MP3 decoding in Woosh.
- **[LAME](https://lame.sourceforge.io/)** - MP3 encoding in Woosh.
- **[Qt6 Multimedia](https://doc.qt.io/qt-6/qtmultimedia-index.html)** - Audio playback in Woosh via QAudioSink.
- **[DirectX](https://learn.microsoft.com/windows/win32/direct3d)** - Graphics API for the fractal renderer.
- **[NASM](https://www.nasm.us/)** - Assembler used for the fractal iteration loop.
- **[GPT-5](https://openai.com/)** - Agent that generated the fractal and Foosh code.
- **[Claude 4.5 Opus](https://claude.ai/)** - Agent that produced the TypeScript refactor and Qt/C++ code.
- **[Claude 4.5 Sonnet](https://claude.ai/)** - Agent that refined prompts and projections.

