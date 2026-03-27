---
title: "Thirty years on Windows, and I'm switching to Mac"
date: 2026-03-27
draft: false
description: "After 30+ years on Windows and 7 years at Microsoft, I'm switching to Mac for work. Not because Windows is bad. Because AI tooling lives on Mac first, and my job depends on it."
excerpt: "I started on Windows For Workgroups 3.11. I spent seven years at Microsoft. And now I'm switching to Mac for work. Not because I'm unhappy with Windows. Because the gravity in AI development has shifted, and my job requires me to follow it."
readTime: "6 minute read"
categories: ["AI"]
tags: ["Mac", "Windows", "AI tooling", "developer tools", "Claude Code"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-03-27-switching-to-mac/featured.png"
featuredAlt: "A MacBook sitting next to a tower PC, two worlds on the same desk"
imageCredit: "Pedro Dias"
---

{{< callout type="info" title="TL;DR" >}}
Thirty years on Windows, seven at Microsoft. Switching to Mac for work. Not because Windows is bad, but because the AI tooling I use every day works better there, and my job is to help 83 people get real value from AI. I need to be on the same platform as the tools I'm recommending. I'm dreading the keyboard shortcuts. Committing for three years. This is part one: the reasoning before I touch the hardware.
{{< /callout >}}

## This isn't a "Windows is bad" post

Windows For Workgroups 3.11. Windows 95. NT 4.0. XP. Seven years working at Microsoft, shipping software on the platform, living and breathing it. Windows has been the substrate of my entire career. I'm not fleeing it in frustration, not ranting about Recall or Copilot being shoved in my face (though fair points, those).

I'm switching to Mac because the work has moved there.

{{< img src="/images/blog/2026-03-27-switching-to-mac/timeline.png" alt="Split image: retro CRT monitor on the left, modern MacBook on the right, representing thirty years of computing history" caption="Thirty years of muscle memory, one platform change" >}}

## The role changed everything

In February I took on the role of Acting AI Strategy & Governance Lead at Tradesolution. In practice, the CAIO function. But the AI work goes back further. I've been deep in it for over three years, since I joined Tradesolution as Chief Architect. The difference now is that the role is formal, and the scope is broader: steering how the company adopts AI, choosing and governing tools, staying ahead of where the ecosystem is going.

That last part is what's forcing my hand.

## Why Mac for AI work, not Windows

My job isn't to build AI models. It's to help 83 people, developers and non-developers, get real practical value from AI in their daily work. That means constantly evaluating tools, testing workflows, figuring out what's worth recommending and what's hype.

The tools I use most, Claude Code being the main one, are built with Mac and Linux as the primary target. The install paths are cleaner. The terminal integration is native. The agentic workflows emerging right now, the ones I'm betting on for the next few years, assume a Unix-native environment. On Windows you're always one WSL quirk away from something not quite working the way the documentation says it should.

I've hit this enough times to stop dismissing it. A tool I want to evaluate. Instructions that assume zsh. A CLI that works in two commands on Mac and needs three workarounds on Windows. Windows can do it. The friction is always there though, quiet but cumulative.

As the person responsible for AI adoption at Tradesolution, I can't be recommending tools I haven't used properly myself. And I can't use them properly if the platform keeps getting in the way.

That's the decision. A work decision, not a preference decision.

{{< img src="/images/blog/2026-03-27-switching-to-mac/ecosystem-map.png" alt="Gravitational diagram with Mac and Linux at the centre, AI tools orbiting close, Windows further out" caption="The AI tooling ecosystem has a centre of gravity, and it isn't Windows" >}}

## I'm not replacing Windows, I'm adding Mac

My home setup is a 32-core Ryzen Threadripper, 128 GB of RAM, and an RTX 5090. That machine isn't going anywhere. It handles everything that needs raw GPU power, and local models already run better there than they would on any Mac. That's not the problem I'm solving.

The Mac is a work tool with a specific job: Claude Code, the agentic workflows I'm building around it, and the AI tooling layer that increasingly assumes you're on a Unix-native system. The two machines have different roles. They don't compete.

Nick Chapsas, who made this same switch as a .NET developer, was partly motivated by unified RAM. He runs a Mac Studio with 512 GB specifically to run large models locally. That's a different use case. I'm not trying to run models; I'm trying to use AI effectively and help others do the same. What I need is a platform where the tools work without translation.

## What I'm actually dreading about switching to Mac

Thirty years of Windows muscle memory: `Ctrl+C`, `Ctrl+V`, `Win+D`, `Alt+F4`, `Ctrl+Z`. These aren't conscious choices, they're reflexes. They live in my hands, not my head. On a Mac, a meaningful chunk of that rewires. The `Cmd` key sits where `Alt` does on Windows. The window management model is different. The way applications install is different.

There's one thing that makes this less daunting than it looks from the outside. Visual Studio has been my primary tool for as long as it has existed. Decades. And I haven't opened it since last summer, when I started coding with AI for real. Claude Code, Cursor, the terminal. That's the workflow now. The biggest Windows-specific anchor in my toolchain is already gone, and I didn't even notice it leaving.

Nick brushed off the keyboard adjustment because Rider migrated all his settings and he'd been using MacBooks for travel since 2019. His transition had a runway. Mine doesn't, but it's shorter than thirty years of history would suggest.

His reasons for switching were also different. Nick left Windows partly because he was unhappy with it: ads in Spotlight, Recall, Copilot integrations he didn't ask for, a File Explorer he considers broken. Those aren't driving me. I'm not running away from anything. I'm moving toward where the work is.

That framing matters. I'm going in without resentment as a motivator, which might make the friction feel harder to justify. There's no relief cancelling it out.

{{< img src="/images/blog/2026-03-27-switching-to-mac/keyboard-split.png" alt="Two keyboards side by side, Ctrl key highlighted on the Windows keyboard, Command key highlighted on the Mac keyboard" caption="The muscle memory problem: thirty years of Ctrl becomes thirty years of Cmd" >}}

## The three-year commitment

Three years. Minimum. This is a work tool, not a hobby experiment. If I'm going to rewire 30 years of habits and build real competence on a new platform, I can't give myself an escape hatch at six months because the shortcuts still feel wrong.

Three years means I'll stop noticing the keyboard within a few months. Three years means macOS becomes fluent, not translated. Three years means I can say whether the platform actually delivers for this kind of work, not just whether I survived the transition.

I'll document it here. The first few weeks will probably be rough. That's expected and doesn't mean the decision was wrong.

## What comes next

The hardware is settled: a MacBook Pro M5, already ordered and on its way. The software stack needs mapping: what I use daily, what has a clean equivalent, what needs replacing.

And the keyboard muscle memory needs to die and rebuild. That one you can't shortcut.

Part two comes when I've actually been using it. Not a first impressions piece, not a "here's my dock setup" post. A real accounting of what changed, what stayed hard, and whether following the ecosystem was worth leaving the platform I've called home for three decades.

---

*Nick Chapsas covered his own Windows-to-Mac switch in [Why I Moved to Mac from Windows as a .NET Developer](https://www.youtube.com/watch?v=JfiTSt16H_8). His motivation was different from mine, but his experience with the tooling transition is worth reading if you're considering the same move.*
