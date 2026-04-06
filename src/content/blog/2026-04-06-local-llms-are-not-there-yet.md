---
title: "Local LLMs are not there yet"
date: 2026-04-06
draft: false
description: "128GB RAM, a 32-core Threadripper, and an RTX 5090. Local LLMs still can't touch Claude Code for coding. Here's what local is actually good for."
excerpt: "I run one of the beefiest consumer AI rigs you can build right now. Local models for image generation? Excellent. For coding against something like Claude Code? Not even close. Here's my honest breakdown."
readTime: "5 minute read"
categories: ["AI"]
tags: ["Ollama", "Local LLMs", "Claude", "Image Generation", "Qwen", "Gemma"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-04-06-local-llms-are-not-there-yet/featured.jpg"
featuredAlt: "A high-end workstation glowing in the dark, surrounded by GPU heat"
imageCredit: "© Pedro Dias"
---

My workstation has 128GB of RAM, a 32-core AMD Threadripper, and an RTX 5090. It is not a modest machine. When I fire up [Ollama](https://ollama.com) and load a local model, it has every resource it could possibly ask for.

And for coding? It's still not close.

The gap is specific. Knowing where it is tells you where to spend your time and money.

## What local models are excellent at

Image generation is where local hardware earns its keep. Running [ComfyUI](https://github.com/comfyanonymous/ComfyUI) on an RTX 5090 is fast, private, and free after setup. No usage limits, no per-image billing. The control you get over fine-tuning, LoRAs, and workflows is beyond what any hosted service gives you. Every image on this blog was produced on this machine.

## Where local models fall apart

The gap isn't uniform. That distinction matters.

The best locally-runnable models right now are [Qwen3-Coder-Next](https://qwenlm.github.io/blog/qwen3-coder/) (80B total, 3B active MoE, 262K context window) and Google's [Gemma 4 31B](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/), which dropped on April 2. On [LiveCodeBench v6](https://livecodebench.github.io/), a competitive programming benchmark designed to resist dataset contamination, Gemma 4 31B scores 80.0%. Claude scores around 76% on the same benchmark. Local wins that one.

So why am I still running [Claude Code](https://claude.ai/code) for actual work?

Because LiveCodeBench measures isolated code generation. You get a problem, you write a function, you're done. That is not how software development works. The benchmark that tracks something closer to reality is [SWE-bench Verified](https://www.swebench.com/), which gives models real GitHub issues and asks them to fix the code across a full repository. On SWE-bench, the locally-runnable models land around 70-72%. Claude sits at roughly 80%. That 8-10 percentage point gap is what you feel every day.

**Multi-step reasoning.** Refactoring a service, tracking down why a test is flaky across three layers of abstraction; these require holding a lot of state across many decisions. The SWE-bench gap measures exactly this. Frontier models do it reliably. Local models lose the thread.

**Agentic coherence.** Claude Code can plan across twenty steps, backtrack when something breaks, and finish. Local models lose that narrative thread and produce plausible-looking output that doesn't integrate. You end up reviewing and fixing, which defeats the purpose.

None of this is a criticism of the teams behind Qwen, Gemma, or [DeepSeek](https://www.deepseek.com/). The Gemma 4 release is a real win for the open ecosystem. They're not at the frontier for agentic coding work, and that's the specific thing Claude Code does.

## Where local models do belong in your coding workflow

Claude Code can use Ollama as its model backend. I have `gemma4:26b-a4b-it-q4_K_M` and `gemma4:e4b` running locally, and Claude Code can spin up agent teams backed by those models.

{{< img src="/images/blog/2026-04-06-local-llms-are-not-there-yet/ollama-list.jpg" alt="Terminal output of ollama list showing two Gemma 4 models" caption="The two Gemma 4 models I run locally via Ollama." >}}

That changes the calculation. Ollama's Anthropic API compatibility layer (v0.14+) lets you point Claude Code directly at a local model:

```bash
ollama launch claude --model gemma4:26b-a4b-it-q4_K_M
```

For lighter subtasks like summarizing a file, writing a quick test scaffold, or explaining what a function does, a local Gemma 4 model is fast, private, and costs nothing per token. You can route the cheap work locally and reserve Sonnet or Opus for the reasoning that actually needs it.

This post was reviewed and corrected using exactly that setup.

## The math doesn't favor the rig

Claude Code costs a few dollars a day under normal use. My RTX 5090 cost significantly more than a year of that subscription. If coding productivity were the primary goal, the math would point at the API every time.

The rig earns its cost back on image generation, on running experiments privately, on not sending sensitive code to external services, on the flexibility of running whatever model or pipeline you want without asking anyone's permission. Those are real values. Coding productivity isn't in the list.

## What I'd tell someone evaluating this

If you're building a machine to run local LLMs primarily for coding, slow down. The hardware won't bridge the gap between open-weight models and frontier models. That gap is about training compute, data, and research investment. More RAM or a bigger GPU on your desk addresses none of that.

If you're building a machine for image generation, local audio, private experimentation, or keeping sensitive data off third-party infrastructure, the investment is defensible. The use cases are real.

The models are improving. The gap is narrowing. But as of early 2026, "local" and "frontier" are still two different categories of capability for coding work, and pretending otherwise will cost you time.

## The shift that matters more than the benchmarks

The benchmark debate is a distraction from something more fundamental: the developer role is changing.

The job is no longer to write code. It's to understand the business well enough to describe what the software must do, then let Claude handle the implementation. You still own the architecture; you pick the stack, the language, the patterns. That judgment still requires experience. But from there, Claude builds it.

This isn't a demotion. A developer who can extract the real requirement from a product conversation, choose the right architecture, and direct Claude precisely is more valuable than one who writes every line by hand. The hand-writing was never the point.

Invest more time in your business domain. Understand why the system exists, what it costs when it fails, what users actually do versus what the spec says. That's what you bring to the conversation. The better you describe what must happen in business terms, the better Claude's output will be.

The gap between a 70% and 80% SWE-bench model matters less than the gap between a developer who can articulate requirements clearly and one who can't.

## FAQ

**Which local models come closest to frontier coding performance right now?**
Qwen3-Coder-Next and Google's Gemma 4 31B (released April 2, 2026) are the strongest options available. On LiveCodeBench v6, Gemma 4 31B actually scores higher than Claude. On SWE-bench Verified, which tracks real-world software engineering tasks, locally-runnable models sit around 70-72% versus Claude at roughly 80%. The gap is specifically in multi-step agentic work, not in writing individual functions.

**Is there a hardware threshold where local coding models become competitive?**
Not yet. The bottleneck isn't raw compute; it's the model weights themselves and the research investment that produced them. You can't out-RAM a training run.

**What does "image generation" actually mean in this context?**
Image generation pipelines running locally via ComfyUI. The RTX 5090 handles large models and high resolutions without breaking a sweat. Generation times that would take minutes on a mid-range card drop to seconds.

**Will this change?**
Yes. The Gemma 4 release suggests the gap on isolated coding tasks has already closed. The remaining gap is in agentic, multi-step work. Whether that closes in 12 months or 36 is unclear. Watch SWE-bench, not LiveCodeBench, as the signal.
