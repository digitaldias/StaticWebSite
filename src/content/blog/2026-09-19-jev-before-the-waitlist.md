---
title: "Biggest AI lift for software since the LLM?"
date: 2026-09-19
draft: false
description: "Jev turns AI into a typed decision: a fast, calibrated answer instead of a chat reply. I built a local stand-in before my API access even came through."
excerpt: "Chat models changed how we write. Jev is built to change how software decides. I couldn't wait for API access, so I had Claude Sonnet 5 build a local stand-in: real model, real bridge, real test harness."
readTime: "6 minute read"
categories: ["AI"]
tags: ["Jev", "oMLX", "DiffusionGemma", "Bun", "Local LLMs"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-09-19-jev-before-the-waitlist/featured.jpg"
featuredAlt: "A live triage board streaming support tickets through automatic classification, each card showing a confidence score, a sentiment tag, and an urgency flag"
imageCredit: "© Pedro Dias"
---

The LLM changed how we write, search, and code. [Jev](https://typesafe.ai/) is built to change something bigger: how software decides.

Jev is a typed decision API. Send it a piece of text and a set of questions. It sends back structured answers with a confidence score attached. Not a chat reply. A classification, a score, a yes or no, calibrated enough to act on in code. That's the shift. Most AI running inside real software isn't a conversation. It's a decision, made thousands of times a minute, and Jev is the first API built to answer that directly.

I had a waitlist spot, not an API key. So I pointed Claude Sonnet 5 at [LocalJev](https://github.com/githubnext/localjev) on GitHub and asked it to get the whole thing running. It set up [oMLX](https://github.com/jundot/omlx), downloaded a model, wired the bridge, built a test harness, and tuned it until it stopped falling over under load. All of it, end to end, while I did other things.

## The stack

```
oMLX (localhost:8000)  →  LocalJev (localhost:8080)  →  jev-tester (localhost:8090)
inference server           typed decision API            tests and demos
```

[oMLX](https://github.com/jundot/omlx) is a local inference server for Apple Silicon. It serves an OpenAI-compatible API. LocalJev sits on top. It turns Jev's typed questions into a classification prompt, asks the model for a probability, checks the result, and returns a Jev-shaped answer. jev-tester is the web app that drives both and shows the results.

The model doing the thinking is `diffusiongemma-26B-A4B-it-4bit`. 26 billion parameters, 4-bit quantized, served entirely from RAM. My M5 Pro has 64GB of unified memory, shared between CPU and GPU. No separate VRAM to run out of. The model alone holds about 16GB.

## What a typed question looks like

Jev takes three question shapes. `choice` picks one label from a list. `score` rates something on a scale. `noul` answers yes or no. Send one block of text, ask several typed questions about it in the same call, and get a typed answer back for each one, with its own probability attached.

{{< img src="/images/blog/2026-09-19-jev-before-the-waitlist/playground.jpg" alt="jev-tester's Playground tab showing a support ticket sent through LocalJev, returning department classification, frustration score, and confidence in 2458 milliseconds" caption="One ticket, three typed questions, one call. 2.4 seconds on a laptop." >}}

That answer came back in 2,458 milliseconds. It routed the ticket to "technical" with 85.7% confidence and scored the customer's frustration at 0.9 on a calm-to-angry scale. No prompt engineering. No parsing a chat reply for the answer buried inside it. A typed question in, a typed answer out.

Keep that number in perspective. This is a stand-in, not Jev itself, running on a laptop's shared unified memory rather than dedicated VRAM, which costs real speed. The real Jev service is built for exactly this kind of typed decision and is expected to answer in single-digit milliseconds. 2.4 seconds is what a hobbyist rig gets you. It's not the ceiling.

## Why this is bigger than another chatbot

Most software AI isn't a conversation. It's a decision sitting inside a pipeline: is this ticket urgent, does this transaction look wrong, which queue does this request belong in. These decisions need to be fast and cheap, because they run on every event, not once per user session. They need a confidence number attached, so the system around them knows when to trust the answer and when to hand it to a person.

Chat gave us a way to talk to software. Jev gives software a way to decide on its own, with a number attached that says how sure it is. That's the part that scales into every pipeline you already run, not just the ones with a chat window bolted on.

jev-tester's Triage board demo makes this concrete.

{{< img src="/images/blog/2026-09-19-jev-before-the-waitlist/triage-board.jpg" alt="jev-tester's Triage board demo mid-run, showing support tickets landing in Billing, Technical, and Sales columns with confidence, sentiment, and latency per card" caption="Fourteen tickets in, sorted by department, each with its own confidence, sentiment, and latency." >}}

Eighteen support tickets stream through classification and land on a board sorted by department. Confidence and latency show on every card. Nothing about it looks complicated, and that's the point. This is the shape of AI that lives inside the pipeline instead of in front of it.

## The numbers hold up

I've [been skeptical of local models before](/blog/2026-04-06-local-llms-are-not-there-yet/), especially for agentic coding work. Classification is a narrower job, and here the numbers hold up well.

Claude also ran a bake-off: five installed models, three public benchmarks, 1,200 requests in about 23.5 minutes on this Mac.

| Model | AG News | BoolQ | SST-5 | Macro accuracy | p50 latency |
|---|---:|---:|---:|---:|---:|
| Gemma 4 E2B | 32.5% | 70.0% | 35.0% | 45.8% | 0.52s |
| Gemma 4 E4B | 65.0% | 75.0% | 50.0% | 63.3% | 0.54s |
| Gemma 4 26B-A4B | 87.5% | 85.0% | 52.5% | 75.0% | 0.68s |
| Qwen3.6-35B-A3B | 90.0% | 85.0% | 55.0% | 76.7% | 0.89s |
| DiffusionGemma 26B-A4B | 87.5% | 87.5% | 47.5% | 74.2% | 1.21s |

Gemma 4 26B-A4B looks like the best short-input default here. Fast, and close behind the top score on every task. Qwen3.6 edges it on raw accuracy, by two correct answers out of 120. That's a coin flip, not a lead.

Two things worth knowing before you trust these numbers on your own data. The confidence values are self-reported: the model is asked for a probability, not read directly off its logits. Check calibration on your own workload before a consequential decision leans on it. And a long, irrelevant input hurts accuracy across the board, sentiment worst of all. Keep the input short and focused, and the numbers above hold.

## Tuning it for real load

The default settings didn't survive the load-dial demo. oMLX allows 8 requests at once. LocalJev was only sending 2. Raising `LOCALJEV_MAX_INFLIGHT` from 2 to 6 fixed it, and the load demo is what surfaced the gap.

A few other changes, applied live and confirmed to survive a restart:

- oMLX's hot cache, off by default, turned on at 8GB. Repeat calls get faster.
- Memory guard set to aggressive, giving the cache more room to work with.
- The model pinned in memory, so it's never evicted during idle time.
- `LOCALJEV_OUTCOMES_PER_CALL` dropped from 128 to 64, after the test suite found the 128-outcome case failing outright.

One change was skipped on purpose. oMLX's custom Metal kernels only cover a few model families, and DiffusionGemma isn't one of them. Turning it on would have done nothing.

## The rest of the machine

oMLX's admin dashboard turned out to do more than show model status.

{{< img src="/images/blog/2026-09-19-jev-before-the-waitlist/omlx-dashboard.jpg" alt="oMLX's admin dashboard showing serving stats, active model memory usage, API endpoints, and the one-command Claude Code launch entry" caption="Same box, same model, wired up as a local backend for coding agents too." >}}

It tracks token throughput and cache efficiency for the session, and it doubles as a local backend for coding agents. Claude Code, Codex, OpenCode, OpenClaw, and Copilot CLI can all point at it with one command. The same Mac serving typed decisions for a Jev stand-in also serves tokens to whichever coding agent I reach for that day.

## What this sets up

None of this needed a patched inference backend or a rack of GPUs. It needed a model, a bridge, and enough tuning to keep the bridge out of the way. Claude Sonnet 5 built all three without supervision, and found the concurrency bug by running the load demo, not by reading a config file.

When my Jev API key lands, this rig already knows what a typed question should look like, what latency to expect, and where the tuning knobs are. That's the value of building the stand-in first: the real thing arrives, and the runway is already built.

---

## FAQ

### What is Jev?

Jev is a typed decision API from [TypeSafe](https://typesafe.ai/). Instead of a chat reply, it takes structured questions (`choice`, `score`, `noul`) about a piece of text and returns typed answers with a confidence score on each one.

### What is oMLX?

[oMLX](https://github.com/jundot/omlx) is a local inference server for Apple Silicon. It runs quantized models in unified memory and serves an OpenAI-compatible API, with no separate VRAM to manage.

### Why build a local stand-in instead of waiting for API access?

It removes the wait. You can check whether a typed decision API fits your workload, what latency and cost look like at your volume, and whether the confidence scores are calibrated, all before your invite arrives. It also keeps sensitive text off someone else's server.

### Are the confidence scores from a local model reliable?

They're self-reported: the model states a probability rather than having it read from its logits directly. That matches Jev's response format but isn't the same as a direct logit read. Check calibration on your own data before a consequential decision depends on it.

### Why does typed classification matter more than chat for AI inside software?

Most AI inside production software isn't a conversation. It's a high-frequency decision inside a pipeline: routing, moderation, triage, fraud checks. That needs speed, low cost per call, and a confidence number the system can act on. A typed decision API is built to answer exactly that, directly.

### Will the real Jev API be as slow as this local setup?

No. The 2.4-second example in this post runs on a laptop's shared unified memory, not dedicated VRAM, and it's a local stand-in, not the real service. Jev itself is built for this exact job and is expected to answer in single-digit milliseconds.
