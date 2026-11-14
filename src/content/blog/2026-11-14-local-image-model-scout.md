---
title: "A nightly job that recommends better local models"
date: 2026-11-14
draft: false
description: "Local model scout: a nightly job tests new local models against the one you use and recommends a switch. Learn to build one for your own models."
excerpt: "My image command, makeImage, now tests new models for me every night and tells me whether to switch. Here is how the loop works, so you can build one for your own models."
tldr: "Every night a job collects what is new in local AI models. A Claude task then reads that report, picks one model to download, tests it against the one I use today and writes me a recommendation. I built it on my image command, makeImage; its first full run recommended MiniMax H3 Image, which spells Norwegian right where my current model garbles it. A local judge model picks the winners, I make the call, and the post shows you how to build the same loop for the models you depend on."
categories: ["AI", "Development"]
tags: ["ComfyUI", "Ollama", "Claude Code", "MiniMax H3 Image", "Krea 2"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-14-local-image-model-scout/featured.jpg"
featuredAlt: "A cartoon scout on a ladder paints NEW TRAIL on a wooden sign in a sunlit forest, a fox watching, with garbled letters still on the sign below"
imageCredit: "© Pedro Dias"
---

I asked my image command for a poster that says "Høstmarked på Grünerløkka". It wrote "Høst marked på Grüre Lløkka". Charming, but nobody will find the market.

A newer model, MiniMax H3 Image, spelled it right on both seeds I tried. I didn't go and test it. A nightly job found it, a Claude task tested it against the model I use today, and I woke up to a recommendation. I liked the coq au vin pictures best, and they came from H3.

## Local model scout: a nightly job that recommends better models

A scout is a small routine that runs every night. It finds new AI models, tests one against the model you use today, and tells you whether to switch.

Mine looks after makeImage, the command that makes the covers for this blog. First it collects what is new. At 03:00 Claude picks one new model, downloads it and gives it the same tasks as my current model. A second AI looks at both results and picks the winner. In the morning I get a recommendation and one yes-or-no question.

The scout never changes makeImage. It tests and recommends; the yes is mine.

The first new model was [MiniMax H3 Image](https://huggingface.co/Comfy-Org/MiniMax-H3-Image). It won 3 of 6 tests, so the scout recommended keeping it. This is the part I like: the verdict arrived with pictures and numbers attached.

## Decider: the local judge that can see

The Decider is a 27-billion-parameter model that runs in [Ollama](https://ollama.com) (`pplx-decider:27b`). You hand it two pictures and a question, and it returns a probability for each answer.

It sees the pictures. That's why it works as a judge: it can check whether the text is spelled right, how many cards lie on the table, whether a hand has five fingers and whether the scene matches the prompt. It also filters the night's news: the first job collects what is new on Hugging Face and Reddit, with a filter like the one in [Stop paying a frontier model to read your news](/blog/2026-11-01-local-models-news-filter/). It costs electricity only, which matters when a task runs unattended.

It has a bias. On two near-equal pictures it gave the first one 0.69, and 0.61 when I swapped them. It favours whichever comes first. The scout asks both ways and counts a verdict only when the two answers agree.

On 11 of 12 picture pairs the Decider agreed with Claude's own reading. On the twelfth, a count of playing cards, it said undecided.

It also has no taste. On the coq au vin card it scored H3 at 0.06 and 0.02, because Krea 2 spelled more of the French correctly. I preferred H3's picture: a scrap of worn paper in a believable hand. The Decider answers "which picture fits the description?", not "which picture do you want on your blog?" Excellent spelling, no taste. Read the pictures yourself.

{{< img src="/images/blog/2026-11-14-local-image-model-scout/coq-au-vin.jpg" alt="Two portraits of a smiling cook holding a recipe card for coq au vin. Left, H3: worn paper with scribbled margin notes. Right, Krea 2: a clean card with mostly legible French" caption="Coq au vin, seed 1201. H3 on the left, Krea 2 Turbo on the right. The Decider chose the right-hand picture, I preferred the left." credit="© Pedro Dias" >}}

## Test new local models at work: the same loop for your tools

The loop fits any dependency that keeps improving: a code model, an embedding model, a speech-to-text engine. I use it for covers; you can point it at whatever your team runs.

You need four things. A fixed test set of your own hard cases. A baseline you run the same way every time. A judge that gives a number. And a rule for what happens to a loser; mine deletes the downloaded files.

Keep the human step. A scout reports and asks. It doesn't deploy.

## Test set: six prompts, five of them hard

The test set has six entries on seeds 1201 and 1202: one ordinary scene and five hard cases. makeImage runs [Krea 2 Turbo](https://huggingface.co/krea/Krea-2-Turbo) on ComfyUI. H3 ran with the settings from Comfy-Org's template: 6 steps, euler sampler, cfg 1, int8 weights at 49.3 GB. H3 needs ComfyUI v0.45, so the install went from v0.34.0 to v0.45.3. The scout never updates ComfyUI on its own; this time I told it to.

| Entry | Winner | What differed |
|---|---|---|
| Ordinary scene (boathouses) | Krea 2 | Stilts and mist as prompted; H3 drew a plain pier |
| Dense text (a long paragraph) | H3 | Every word right on both seeds, one cut at the edge; Krea 2 broke a third of it |
| Norwegian poster | H3 | "Grünerløkka" exact twice; Krea 2 split it |
| Recipe card | Krea 2 | Small margin notes: H3 drew scribbles |
| Counting cards | Krea 2 | Exact count once; H3 drew 24 and turned the cards face up |
| Hands and crumpled paper | H3 | Sharp creases and correct grip |

H3 was also faster: 4 to 16 seconds a picture against 13 to 14 for Krea 2. These are my numbers from one night, one machine with 32 GB of VRAM and two seeds per entry. Treat them as a first look.

{{< img src="/images/blog/2026-11-14-local-image-model-scout/norwegian-poster.jpg" alt="Two photos of a paper poster on a brick wall. Left, H3: Høstmarked på Grünerløkka spelled correctly. Right, Krea 2: Høst marked på Grüre Lløkka with the last word split and cut off" caption="Norwegian poster, seed 1201. H3 on the left, Krea 2 Turbo on the right." credit="© Pedro Dias" >}}

## Scout prompt: paste this into your own Claude

This prompt is my scout's procedure with my paths and models taken out; the original ran in full for the first time on 14 November. Replace the bracketed parts, put it in a scheduled Claude task, and run it once by hand before you trust it.

```text
You are the nightly scout for [tool or model I use today]. You test and report. You never change my setup, and you never install code from a repository.
Each night, read [news sources] and list anything that might beat what I use today. Skip repackages, single-author quantisations and models that cannot run on [my hardware].
Keep a ledger file with every candidate you have seen, its status (queued, blocked, skipped, kept, deleted), its licence and the reason. Never test the same candidate twice unless its files changed.
Test at most one candidate per run. It must load with [my runtime] as it is. If it needs a newer runtime, mark it blocked and say which version. Download one precision only, and keep at least [N] GB of disk free.
Use my test set in [file]: one ordinary case and the hard cases where my current tool fails. Run each case on my current tool and on the candidate, with the same seeds.
Judge every pair with [judge model], once in each order. A verdict counts only when both orders agree. Then look at the results yourself and say where you disagree with the judge.
The candidate wins a case when it wins more seeds than it loses. Keep the candidate if it wins two or more cases. Otherwise delete exactly the files you downloaded.
Write a report in plain words with a table: case, winner, what differed. Quote the wrong words, counts and numbers, so I can read it without the pictures. End with one yes-or-no question: should we adopt it?
```

## Two-order judging: a fair verdict from a biased judge

Ask the judge in both orders and count a verdict only when the two answers agree. Here is the whole idea in Python; swap `ask` for your own judge call.

```python
def verdict(ask, a, b):
    forward = ask(a, b)    # probability that the first picture is better
    backward = ask(b, a)   # same question, order swapped
    p = (forward + 1 - backward) / 2
    if forward > 0.5 > backward:
        return "first", round(p, 2)
    if forward < 0.5 < backward:
        return "second", round(p, 2)
    return "undecided", round(p, 2)
```

Feed it my numbers, 0.69 forward and 0.61 backward, and it says `undecided` with p at 0.54. Without the swap, two near-equal pictures would have gone to whichever came first.

A candidate wins an entry when it wins more seeds than it loses and Claude agrees when it looks at the pictures. It's recommended when it wins two or more entries.

The scout works while I sleep. I still read the pictures.

## FAQ

### Do I need a local judge model?

No. Any model that sees pictures and gives a number works, Claude included. I use a local one because the scout runs unattended at night and costs electricity only. Whichever judge you pick, ask in both orders.

### Does the scout install the winner for me?

No. It keeps the files of a winner and asks. Adopting a model in makeImage is a separate task that starts when I say yes.

### How much disk does it need?

The H3 weights are 49.3 GB. The scout keeps at least 200 GB free on the models disk and deletes the files of any candidate that loses.
