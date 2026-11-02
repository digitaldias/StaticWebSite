---
title: "Can you run a local LLM offline on a flight? What to check before you board"
date: 2026-11-02
draft: false
description: "Planning to use a local LLM on a plane? A pre-flight checklist and a ten-minute battery test, from one flight with Ollama and Qwen on an M5 MacBook Pro."
excerpt: "I packed a local coding model for a flight with no Wi-Fi. It was slower, weaker and thirstier than I hoped. Here is the checklist and the ten-minute ground test I wish I had run first."
tldr: "A local model can run on a plane, but on a laptop it is far weaker than a frontier model, its small context window makes it lose track early, and it drains the battery fast. Download it before you board, run a ten-minute test on the ground, and decide from the results whether to bring it."
categories: ["AI"]
tags: ["Ollama", "Local LLMs", "Claude Code", "Qwen", "MacBook Pro", "Offline"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-02-local-llm-on-a-plane/featured.jpg"
featuredAlt: "An airplane tray table with a closed laptop, a coffee cup and a dark window"
imageCredit: "© Pedro Dias"
---

My flight had no Wi-Fi, so I packed an AI assistant that lives on my laptop and works without internet.

It did not go well. Ten minutes of testing at home would have told me why, and this post shows you how.

## Should you bring a local LLM on a flight?

Probably not yet, and you can find out for your own machine before you leave.

A local model on a laptop is a different tool from a frontier model, not a smaller copy of the same one. On my M5 MacBook Pro it answered slower, lost the thread of tasks with more than a few steps, and drained the battery fast enough that I watched the percentage instead of the screen.

Your result depends on your laptop, your model and your task. The checklist below tells you which of those will hurt most.

## Check whether you can buy Wi-Fi

Some airlines sell Wi-Fi on board, and that changes the whole question. With a connection you can use the frontier model you already trust, and the local model stays at home.

I flew Norwegian between Faro and Oslo. On the way down I could not buy a connection at all. On the way back I could, at around 14 euros by my memory. I did not pay, because that felt like too much for a four-hour flight. Check the current price on [norwegian.com](https://www.norwegian.com) before you plan around my number, because I could not confirm a fixed price for this route.

Put it in perspective: Claude Pro costs [$20 a month in the US](https://support.anthropic.com/en/articles/8325610-how-much-does-claude-pro-cost), with local prices that vary by region. So 14 euros for a few hours buys most of a month of the subscription. Whether that is too much depends on your day. Compare it with the cost of a weaker model and a drained battery.

Norwegian does sell Wi-Fi on board, and its CEO said in February 2026 that the airline [has no plans to switch to Starlink](https://www.marketscreener.com/news/norwegian-air-does-not-plan-to-use-starlink-wi-fi-ceo-says-ce7e5ddadb8cf02c). Availability still varies by aircraft, so look it up for your own flight, and have the local model as a fallback in case the connection fails.

## Can you charge a MacBook Pro from the seat?

Some planes have USB outlets in the seat. On my Norwegian flights the plugs were there, but they no longer deliver power, so I could not test this myself. Here is what I found in the vendors' own documentation, which counts as marketing, not measurement.

Older USB-A outlets give about 15 watts at most, according to [Panasonic Avionics](https://www.panasonic.aero/blog/blog-post/why-your-airline-needs-to-adopt-in-flight-usb-c-fast-charging). That charges a phone. A laptop running a model draws far more, so the outlet can slow the drain but not stop it.

Newer USB-C outlets are a different story. Panasonic lists a guaranteed 67 watts per seat on its Astrova system, and [Astronics](https://www.militaryaerospace.com/power/product/55385632/astronics-introduces-60w-usb-c-cabin-power-system-for-commercial-aircraft) sells a 60 watt USB-C system for commercial aircraft. Apple sells the 14-inch MacBook Pro with a 70 watt adapter, with a 96 watt option, so a 60 to 67 watt seat port sits just under what the laptop is built for. Check the figures for your own model on Apple's spec page; I did not open it.

When the source delivers less than the laptop demands, the Mac makes up the difference from its battery. So the practical answer has three parts:

- **A 60 watt or stronger USB-C seat port:** it should keep the battery steady during light work and slow the drain under load. I have not measured it under model load.
- **A USB-A port at about 15 watts:** it will not keep up with a model running.
- **No seat power:** the battery is all you have.

Two checks give you a real answer once you sit down. Open System Information, go to Power, and read the charger wattage the Mac reports. Then run `pmset -g batt` and see whether it says the battery is charging or discharging. Use a cable rated for the wattage, such as the one that came with your charger.

## What it felt like

Frontier models set a bar you stop noticing. You ask for a change across three files and it happens. The local model asked me to clarify things I had already said, edited the wrong file, and needed a second attempt on tasks Claude handles in one.

My April post, [Local LLMs are not there yet](/blog/2026-04-06-local-llms-are-not-there-yet/), made the same point from a desk with an RTX 5090. A laptop on a tray table is a harder place to be right about it.

The biggest limit was the small context window. The context window is the amount of text the model can keep in mind at once: your instructions, the files it has read and the conversation so far. A coding agent fills it fast, and I had cut mine to 32K to get usable speed, as the setup section below explains. Mine started to hallucinate much earlier than I could accept, inventing file names and details, and the results were bad.

The battery fell quickly. Inference keeps the GPU busy for the whole response, and a coding agent sends many responses.

## The ten-minute battery test

This is the part that would have saved me.

1. Charge to 100 percent, unplug, and note the level:

```bash
pmset -g batt
```

2. Give the model a real task from your own work, with at least five steps. A toy prompt tells you nothing.
3. Let it run for ten minutes, then check again with the same command.
4. Multiply the drop by the minutes of your flight divided by ten.

If that number leaves you under 20 percent on landing, the model does not come with you. If the result also needs rework, you have your answer twice.

{{< img src="/images/blog/2026-11-02-local-llm-on-a-plane/ten-minute-test.jpg" alt="An unplugged laptop on a desk beside a kitchen timer set to 10:00 and a notepad headed 10 MIN" caption="Unplugged, timer set, numbers on paper." >}}

I did not log numbers on my flight, so treat my experience as one flight on one machine. Your ten-minute test will be more useful than my impressions.

## Pre-flight checklist for an offline LLM

Run through this the day before.

1. **Download everything.** Pull the model and any tools while you have a connection, then switch on airplane mode and confirm it still answers.
2. **Size the model to about half your memory.** Pick a model whose file is around half of your laptop's total RAM. The rest goes to the context window, your editor, the agent and the system. Check the size with `ollama list`.
3. **Check the context window.** Small models run out of working memory first. Run `ollama show <model>` to see the context length, and expect an agent such as Claude Code to fill it quickly. Raising it costs memory, which fights with the half-of-RAM rule above.
4. **Check your agent's offline behaviour.** Some tools call home for updates, telemetry or login checks. Test with Wi-Fi off, not just with the model running.
5. **Plan the battery.** Know your charge, your flight length and whether your seat has a USB-C port strong enough to help. Run the ten-minute battery test above.
6. **Pick a task that fits.** Small, well-defined edits suit a small model. Refactors across many files do not.

## What I ran

I let Claude pick the setup. It benchmarked three Qwen builds on my M5 Pro with 64 GB of memory, on Ollama 0.40.12, and landed on `qwen3.6:35b`: a 35-billion-parameter mixture-of-experts model that activates about 3 billion parameters per token (Qwen3.6-35B-A3B on [Hugging Face](https://huggingface.co/unsloth/Qwen3.6-35B-A3B-GGUF)), 23 GB on disk, served by Ollama and driven through the Claude Code harness.

It won on speed, because Claude Code resends a large context on every turn:

| Model | Prefill, about 16k tokens | Decode | Memory at 256K context |
|---|---|---|---|
| `qwen3.6:35b` | 2050 tokens/s (7.8 s) | about 69 tokens/s | 23 to 24 GB |
| `qwen3.8:27b-nvfp4` | 458 tokens/s (35 s) | about 46 tokens/s | 18 to 21 GB |
| `qwen3.8:27b-q8_0` | 370 tokens/s (43 s) | about 10 tokens/s | 46 GB |

All three passed the same two coding tasks, so quality did not separate them. Two tasks per model is a tiny sample.

These models have a native context window of 256K tokens. At that size the model was very slow for me, so Claude recommended cutting the context to speed up the answers. It built a lean variant with a 32K window and a lower temperature. That is the one I flew with, and the small window is the price I paid for the speed. Save this as `Modelfile`:

```text
FROM qwen3.6:35b
PARAMETER num_ctx 32768
PARAMETER temperature 0.3
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.1
```

Then build it and start Claude Code against it, while you still have a connection to pull the base model:

```bash
ollama pull qwen3.6:35b
ollama create qwen3.6:35b-lean -f Modelfile
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 ollama launch claude --model qwen3.6:35b-lean
```

`ollama launch claude` points Claude Code at the local Ollama server for you, no environment variables to set. `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` stops Claude Code from reaching for the internet for updates and telemetry. I wrapped all of this in a small script called `planemode`, which also starts the Ollama server, preloads the model, and unloads it on exit to spare the battery.

I am not sure it was the best pick. It was the pick Claude could justify from the numbers it collected.

## What to do on the plane instead

Write, don't code. Draft the plan, the post or the spec in a text editor such as Notepad, TextEdit or Notion, and hand it to a frontier model when you land. The model does its best work on the ground, with context you prepared in the air.

{{< img src="/images/blog/2026-11-02-local-llm-on-a-plane/write-offline.jpg" alt="A laptop on an airplane tray table showing a plain text editor with a SPEC heading and a short list" caption="A spec in a text editor costs almost no battery." >}}

That is less exciting than a private AI in your backpack. It also works.

The flight took me to my childhood home in Portugal, where I worked for a week. I made a video about it with Claude: [watch it on YouTube](https://youtu.be/BhXDzz7moYw).

## FAQ

### Can I buy Wi-Fi on a flight instead?

On some flights, yes. On a Norwegian flight from Faro to Oslo it was offered at around 14 euros, by my memory, and I declined. On the flight the other way I could not buy it at all. Check your airline's page for your aircraft before you rely on it.

### Can I charge my MacBook from a USB port on a plane?

It depends on the port. A 15 watt USB-A outlet will not keep a laptop running a model alive. A seat with a 60 watt USB-C port may hold the battery steady under light work. I did not test this, because the USB plugs in my Norwegian seats gave no power.

### Can I run an LLM completely offline on a laptop?

Yes. Tools like Ollama run the model on your own machine once it is downloaded. Whether the result is useful for your task is a separate question, and the ten-minute test answers it.

### How much battery does a local LLM use?

It depends on the model, the laptop and the task. I have no measured figure from my flight, which is why the test above exists. Measure your own.

### Is a local model good enough for coding?

For small, clear edits, sometimes. For multi-step work across a repository, my experience says no. The benchmark numbers are in the [April post](/blog/2026-04-06-local-llms-are-not-there-yet/).

### Would a different model have done better?

Possibly. Claude chose this one after its own tests, and I did not compare alternatives myself.
