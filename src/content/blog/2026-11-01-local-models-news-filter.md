---
title: "My computer reads the news before I do"
date: 2026-11-01
draft: false
description: "While I sleep, my PC reads 60 news sites and keeps what matters for my job. Here's how to build your own: code to copy, prompts to paste, and no API bill."
excerpt: "My PC reads about 60 news sources every night and keeps the few that matter for my job. You can build the same thing in an afternoon, and it costs next to nothing to run."
tldr: "You can build a news filter on your own machine in an afternoon, and a pile of stories you rank yourself will tell you whether to trust it. The bigger lesson is which jobs to keep away from the expensive models: reading and sorting are small work, and a local model does them for the price of electricity. Mine now agrees with me far more often than my first attempt did, though from a small batch, so treat it as a hunch with a number attached."
categories: ["AI"]
tags: ["Local LLMs", "Decision Models", "News Filtering", "Spearman", "Ollama"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-01-local-models-news-filter/featured.jpg"
featuredAlt: "Overhead view of a wooden desk with a small black computer and a wire basket of loose paper slips, one slip lifted out"
imageCredit: "© Pedro Dias"
---

At 02:30 every night my PC reads about 60 websites. I'm asleep. By morning it has picked the handful of stories that matter for my job, and the models that did the picking never left my machine.

There's no API key and no invoice. The only meter running is the one in my fuse box, and further down you'll see how little it turns.

Under the code sits a habit that's worth more than the code: don't send a frontier model a job a small local one can do.

You can build the same thing in an afternoon. Each step below ends with something you can paste or run: a scorer, a test that tells you whether it's any good, and prompts for your own Claude. I also list the three bugs that cost me an evening, so they don't cost you one.

## Why filter by role

I'm the Chief AI Officer at Tradesolution, a Norwegian software company that serves the grocery trade. Most AI news isn't written for that job. A faster chip, a funding round, a benchmark argument: real news, no effect on my Monday. Reading is the bottleneck, not finding.

So my pipeline fetches about 60 sources, drops what isn't about AI, summarizes what's left, and publishes the result as [the briefing](/briefing/), a page I read with my coffee.

The models run on my own machine. A local language model is a text model that runs on your computer instead of a provider's servers, so nothing leaves the machine and nothing is billed per story. A token is the small chunk of text a model reads or writes, and hosted services charge by the thousand. Locally the only cost is the electricity. That changes how you design. With a metered API you'd pack 30 stories into one prompt and hope for the best. Locally every story gets its own call, the same question can run twice, and a duplicate check can run whenever you want one. A call costs a rounding error, so you stop counting them.

I also keep my reading list to myself, because what you read shows what you worry about.

## Save the big model for the big jobs

If you take one thing from this post, take this habit, whether or not you build any of the code.

A frontier model is the best a provider sells: the one you pay for by the token, and the one you want on your hardest problems. Reading a headline and deciding whether it matters isn't a hard problem. Neither is skimming build output for the line that says what broke, or pulling a price out of a paragraph. These are reading jobs: short text in, one small answer out. A model on your own PC does them well and keeps doing them at 02:30 without a meter. My test below shows it for ranking news. I haven't measured it on build output, but the shape of the job is the same, and the harness below measures yours.

Here's how I sort the work:

| Job | Where it runs | Why |
|---|---|---|
| Score or sort short texts | Local | Short in, one number out, and you can check it against your own labels. |
| Skim build or test output for the line that matters | Local | Plain reading, and you can spot-check the answer. |
| Pull fields out of text, like prices, dates and names | Local | The answer is small and easy to compare with the source. |
| "Are these two stories about the same event?" | Local | A yes or no question. |
| Refactor across a repo, chase a bug through five layers, plan twenty steps | Frontier | The model has to hold a lot of state across many decisions. [Local models lose the thread there](/blog/2026-04-06-local-llms-are-not-there-yet/). |
| The last call on anything that matters | You | The model does the first pass. |

Smart doesn't mean cheap. It means matched. A frontier model on a sorting job is a surgeon opening the mail: it works, and you're paying surgeon rates for it.

Two cautions. Production logs can hold customer data, so check your company's rules before any model reads them, local or not. And don't take my word for which jobs are small: take your own numbers. The 30-story test below is the permission slip. I haven't run a frontier model on my 30 stories, so I can't tell you how far ahead it would land. Try it on yours. Score the same stories with a hosted model, compare the two Spearman numbers, and if the gap is small, you've found a job you can stop paying for.

To find the jobs in your own week, paste this into Claude:

```text
Below is a list of the tasks I currently send to a frontier model. Sort each one into LOCAL FIRST or FRONTIER. LOCAL FIRST means the input is short, the answer is one of a few options or a short extraction, and I can check the result against labels or by eye. FRONTIER means the task needs many dependent steps, a long context, or open-ended writing. For each LOCAL FIRST task, write a five-item test I can run: what to feed it, what a correct answer looks like, and what score would make me trust it. If a task touches customer data, flag it and tell me to check my company's rules first. Tasks: [paste your list]
```

## Get the details right first

A good filter lives in small details. Three of mine:

**Security warnings go on top, and no model decides them.** A security warning is a notice that a piece of software has a hole someone is already using. Think of a recall notice on a food product: you want to see it before anything else, even when you aren't sure you bought the product. I take mine from two public sources, [NSM's warnings](https://nsm.no/rss/sarbarhetsvarsler-fra-nsm/) and the US [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) list. Fixed rules decide what reaches me. A warning is the one place I don't want a guess.

Here's the CISA list as a ten-line script. It prints every hole added in the last seven days:

```python
from datetime import date, timedelta

import httpx

URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
cutoff = (date.today() - timedelta(days=7)).isoformat()

for v in httpx.get(URL, timeout=30, follow_redirects=True).json()["vulnerabilities"]:
    if v["dateAdded"] >= cutoff:
        print(v["dateAdded"], v["cveID"], v["vendorProject"], v["product"])
```

Run it once and look at the volume. If it's more than you'd read, narrow it to the products you run. That narrowing is the part only you can do.

{{< img src="/images/blog/2026-11-01-local-models-news-filter/recall-shelf.jpg" alt="A red warning triangle on a supermarket shelf edge among stacked blank cereal boxes" caption="The recall notice you want to see before the rest." >}}

**Convert the numbers so you don't have to.** A tool costs $20 a month and a delivery drone flies 10 miles. You won't convert those in your head, so you'll skip them. My pipeline puts a figure in kroner next to every foreign-currency amount and converts every measurement to metric. One rule matters: never skip an amount because its notation is vague. A bare dollar sign means US dollars. A converter that skips some currencies isn't worth having.

You can try the idea today without writing code. Paste this into Claude, followed by a few items from your own feed:

```text
Rewrite the news items below for a reader in Norway. Put every amount in a foreign currency into NOK in parentheses after the original, for example "$20 a month (X kr)". Convert imperial units to metric. Convert every time to Oslo time. Never skip an amount because the notation is vague; a bare "$" means US dollars. Tell me which exchange rate and date you assumed, because you can't see live rates. Keep everything else word for word.
```

Swap "Norway" and "NOK" for your own. Check the stated rate yourself; that's the part I'd never trust blind.

**Get the time zone right, with code.** Don't ask a model to convert times. Use the standard library:

```python
from datetime import datetime
from zoneinfo import ZoneInfo

t = datetime(2026, 11, 3, 9, 0, tzinfo=ZoneInfo("America/Los_Angeles"))
print(t.astimezone(ZoneInfo("Europe/Oslo")).strftime("%H:%M"))  # 18:00
```

Change the date to 28 October 2026 and it prints 17:00. The US and Europe switch daylight saving on different dates, so for about three weeks in spring and one in autumn the gap between Pacific time and Oslo is eight hours instead of nine. A model guesses that gap. `zoneinfo` knows it.

## One question, three levels

The first version of my picker asked a general model to choose favorites from a numbered list. It worked, and I wanted to know how well. The second version uses a decision model. A decision model doesn't write. It answers a question about a text with probabilities over levels you define, and hands back the expected level.

I ask one question per story: "How worth highlighting is this story for this reader?" The answer options are three ordered levels: 0 for not worth highlighting, 1 for worth a mention, 2 for must-read. The model's probabilities over those three become a score between 0 and 2. I like this part most: you get a dial instead of a verdict. A story at 1.9 and a story at 1.1 are both "relevant", and you can see which one wins.

The levels and the reader description are where your judgment goes. If you don't want to write them cold, paste this into Claude:

```text
I want to build a filter that scores news stories for one specific reader: me. Interview me to write the scoring prompt. Ask one question at a time and wait for my answer. Cover my role, the decisions I make in a typical month, what I already follow, and what I never want to see. After at most eight questions, write:

1. PROFILE: three sentences describing the reader, in third person.
2. LEVELS: an ordered list of three levels, 0 to 2, from "not worth highlighting" to "must-read". One sentence each, naming concrete topics, so that a small local model can apply them without guessing.
3. TEST STORIES: five invented headlines with a one-line summary each, and the level you'd expect for each. Make one of them sit on the border between two levels.

Do not praise my answers. Keep the output ready to copy.
```

Then run the scorer. This version works with any chat model in Ollama that returns token probabilities. I tested it with `qwen3:8b` on Ollama 0.40.13:

```python
import math

import httpx

OLLAMA = "http://127.0.0.1:11434"
MODEL = "qwen3:8b"
PROFILE = (
    "The reader is the Chief AI Officer of a Norwegian software company that "
    "serves grocery retailers. They want news that changes what they should "
    "know or do about AI."
)
LEVELS = {
    "0": "Not worth highlighting: off-topic, minor, or not about AI.",
    "1": "Worth a mention: relevant, but not a must-read.",
    "2": "Must-read: directly relevant to the reader's work or decisions.",
}


def score(story: str) -> float:
    levels = "\n".join(f"{k} = {v}" for k, v in LEVELS.items())
    prompt = (
        f"{PROFILE}\n\nHow worth highlighting is this story for this reader?\n"
        f"{levels}\n\nStory:\n{story}\n\nAnswer with one digit."
    )
    r = httpx.post(
        f"{OLLAMA}/api/chat",
        json={
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "think": False,
            "stream": False,
            "logprobs": True,
            "top_logprobs": 10,
            "options": {"temperature": 0, "num_predict": 1},
        },
        timeout=120,
    )
    r.raise_for_status()
    top = r.json()["logprobs"][0]["top_logprobs"]
    p = {t["token"].strip(): math.exp(t["logprob"]) for t in top if t["token"].strip() in LEVELS}
    return sum(int(k) * v for k, v in p.items()) / sum(p.values())
```

Three headlines through it gave me this:

| Headline | Score |
|---|---|
| EU AI Office publishes guidance on high-risk AI systems used in retail pricing | 2.00 |
| Chipmaker unveils faster GPU for gaming laptops | 0.00 |
| Tech start-up raises $40 million for a robot that folds laundry | 0.02 |

Scores near zero wobble by a few hundredths from run to run; the third headline came out between 0.01 and 0.05 across my runs. The trick is `num_predict: 1`. You don't want the model to write an answer. You want the odds it assigns to the first token, and the expected level falls out of them.

My production setup calls a decision model instead, through Ollama's `/v1/systemone` endpoint. Same question, same levels, and the model returns the probabilities itself:

```python
payload = {
    "model": "<your decision model>",
    "state": story,
    "questions": {
        "q": {
            "type": "score",
            "instructions": instructions,
            "criteria": ["Not worth highlighting.", "Worth a mention.", "Must-read."],
        }
    },
}
r = httpx.post("http://127.0.0.1:11434/v1/systemone", json=payload, timeout=60)
print(r.json()["answers"]["q"]["score"])
```

The response also carries `probabilities` per level and a `confidence` value. I haven't compared this route against the logprobs version on my 30 stories, so I can't tell you which one wins.

Turning scores into picks takes six lines. The best story in a category always makes it. Up to two more join if they score at least 1.0. The whole category never does:

```python
def picks(scored, max_picks=3, threshold=1.0):
    ranked = sorted(scored, key=lambda p: p[1], reverse=True)
    limit = min(max_picks, len(ranked) - 1) or 1
    chosen = [ranked[0]]
    for story, s in ranked[1:]:
        if len(chosen) >= limit or s < threshold:
            break
        chosen.append((story, s))
    return chosen
```

One more rule keeps one big launch from filling every slot: before a runner-up joins, ask the model "Do Story A and Story B report on the same news event, announcement or release?" and skip it on yes.

## The bill is electricity

The hardware wasn't free. I've said before that [my rig cost more than a year of a subscription](/blog/2026-04-06-local-llms-are-not-there-yet/). This section is about the marginal cost: what the next story costs once the machine exists.

I measured it with `qwen3:8b` on an RTX 5090, using a test story padded to about 250 prompt tokens, instructions included. The numbers:

- Each story took 0.49 seconds. A thousand stories take about eight minutes.
- The GPU averaged 68 W while scoring, against 64 W idle (`nvidia-smi`, GPU only). Counting the idle draw too, a thousand stories use at most 0.01 kWh.

For scale, boiling 300 ml of water for tea takes about 0.03 kWh. So scoring a thousand stories costs about a third of a cup of tea. If you count the whole PC instead of the GPU alone, say 300 W, it's closer to a cup and a bit. The rest of my nightly run, fetching and summarizing included, took 8 to 21 minutes on five nights in late October.

Price your own run. Save the scorer above as `score.py`, put this next to it, and replace the two constants with your numbers. A smart plug with energy metering gives you the watts:

```python
import time

from score import score

WATTS = 300          # your machine under load: read it off a smart plug
PRICE_PER_KWH = 1.0  # what a kWh costs you, in your currency

stories = ["EU AI Office publishes guidance on high-risk AI systems used in retail pricing."] * 20

start = time.time()
for story in stories:
    score(story)
seconds = (time.time() - start) / len(stories)

kwh_per_1000 = WATTS * seconds * 1000 / 3_600_000
print(f"{seconds:.2f} s per story, {kwh_per_1000:.4f} kWh per 1,000 stories, cost {kwh_per_1000 * PRICE_PER_KWH:.4f}")
```

With 0.45 seconds per story (the short headline above) and a 300 W guess, it prints about 0.04 kWh per thousand stories. Treat the GPU figure as a floor and the wall-socket figure as the bill.

## Find out whether it works

A method that feels better proves nothing. You need a number, and you can get one in about half an hour.

Label 30 stories yourself with 0, 1 or 2, before you look at any model output. Then compare your labels with the scores. The comparison is Spearman's correlation, a score for how closely two rankings agree. Say you and a friend each rank five restaurants from best to worst. The same order scores 1. Orders with no pattern in common score 0.

{{< img src="/images/blog/2026-11-01-local-models-news-filter/thirty-cards.jpg" alt="Two hands arranging thirty blank cards in two rows on a table, one row slightly out of order" caption="Thirty stories, two orders, one number." >}}

Save your labels as `labels.csv` (`id,label`) and the scores as `scores.csv` (`id,score`), then run this:

```python
import csv
import random
import statistics

from scipy.stats import spearmanr

labels = {r["id"]: float(r["label"]) for r in csv.DictReader(open("labels.csv", encoding="utf-8"))}
scores = {r["id"]: float(r["score"]) for r in csv.DictReader(open("scores.csv", encoding="utf-8"))}
ids = sorted(labels.keys() & scores.keys())


def rho(sample):
    return spearmanr([labels[i] for i in sample], [scores[i] for i in sample])[0]


spread = statistics.pstdev(scores[i] for i in ids)
boot = sorted(rho(random.choices(ids, k=len(ids))) for _ in range(5000))
print(f"n={len(ids)}  score spread={spread:.2f}")
print(f"rho={rho(ids):.2f}  95% interval {boot[125]:.2f} to {boot[4875]:.2f}")
```

The `score spread` line is not decoration. If it prints close to zero, your scorer gives every story the same answer, and the rho above it means nothing. More on that in a moment.

My numbers: the old pick-from-a-list method scored 0.39 against my labels. The decision model scored 0.77. On the AI stories alone it scored 0.70. Read 0.39 as weak agreement and 0.77 as strong, though not perfect.

Two cautions apply to those numbers, and to yours.

- **30 stories is a small sample.** A rho of 0.77 on 30 stories carries a 95% interval of roughly 0.55 to 0.89. That is my arithmetic from the standard Fisher approximation, not a re-analysis of my data.
- **I measured on the set I tuned on.** I tried more than one model and set the pick cutoff by eye, both on the same 30 stories. The 0.77 is the best result on an exam where I wrote the answer key. Do better: label 30, tune on 15, and report the other 15.

## Three bugs that cost me an evening

**Every story got the same score.** My first decision-model run returned one answer for everything. The endpoint expects the fields `instructions` and `criteria`. I had used other names, and it ignored them without a word. The `score spread` line above exists because of this bug.

**The model thought itself out of tokens.** Since Ollama 0.40, `qwen3` models think by default. The thinking trace used up my `num_predict` budget before the JSON answer started. Pass `"think": false` on every call, as in the scorer above.

**Half the model ended up on the CPU.** Ollama loaded one model with a 262k-token context and pushed part of it off the GPU. The longest prompt I send is about 4,200 tokens, so I set `num_ctx` to 8192 and the whole model stayed on the GPU. Run `ollama ps` and look at the `PROCESSOR` column. A split such as 70% CPU and 30% GPU means part of the model spilled out of video memory. In my case the cause was a context bigger than I needed.

## Build the whole thing with Claude Code

Put it together in an empty folder. Paste this into Claude Code, fill in your feeds, and have your PROFILE and LEVELS ready in a file called `profile.txt`:

```text
Build a small news-scoring harness in this empty folder. Python 3.12, httpx and scipy only. Ollama runs at http://127.0.0.1:11434 and qwen3:8b is already pulled.

1. items.csv: fetch the latest 40 items from these RSS feeds [paste 3 to 5 feed URLs] and write id, title, summary. Use the link as id. Strip HTML from summaries.
2. label.py: a terminal tool. It shows one item at a time, in random order, with no model output visible. I type 0, 1 or 2 (0 = not worth highlighting, 1 = worth a mention, 2 = must-read). It appends to labels.csv and resumes where I stopped. It stops after 30 labels.
3. score.py: for each item, call /api/chat with think=false, temperature 0, num_predict 1, logprobs=true and top_logprobs=10. Ask "How worth highlighting is this story for this reader?" with the PROFILE and LEVELS from profile.txt. Take the probabilities of the tokens "0", "1" and "2", renormalize them, and write the expected level to scores.csv.
4. eval.py: join labels.csv and scores.csv on id. Print n, the standard deviation of the scores, Spearman rho (scipy), and a 95% bootstrap interval from 5000 resamples. If the standard deviation is below 0.05, print a warning that the scorer is probably not seeing the story.
5. Split the labeled items at random into a tuning half and a test half and print rho for each half separately.

Run each script on five items to check it works before you move on. Do not write any other files.
```

Label first, score second, and don't peek. That order is the whole experiment.

## What 0.77 does not prove

My number says the new method agrees with me on 30 stories. It doesn't say the model finds everything I need, because a story it ranks low might be one I'd want. It doesn't say the number holds in another week, on other topics, or for another reader. And it was measured on the stories I tuned with, so a fresh batch will probably score lower.

The small model does the first pass. I do the last one. The big model gets the jobs that need a big model.

## FAQ

### Do I need a decision model for this?

No. The logprobs scorer above works with any chat model in Ollama that returns token probabilities. I tested it with `qwen3:8b` on Ollama 0.40.13. If your server doesn't return probabilities, ask for the digit five times at temperature 0.7 and average the answers. That version is noisier, and I haven't tested it.

### When do I still need a frontier model?

When the job has many dependent steps, a long context, or open-ended writing. Refactoring across a repository, tracking down a bug through several layers, and planning twenty steps ahead are the examples where I've watched local models lose the thread. If you can't write down what a correct answer looks like, that's usually a frontier job too.

### Is a local model free?

Not the hardware. The model itself, per story, costs electricity: on my machine at most 0.01 kWh for the GPU per thousand stories, and about 0.04 kWh if you count a whole 300 W PC. Whether that beats a hosted API depends on what you already own and how many stories you score. If you don't own a capable GPU, the math looks different.

### How many stories do I need to label?

Thirty gets you a rough number with a wide interval, about 0.55 to 0.89 around a rho of 0.77. Sixty narrows it to roughly 0.63 to 0.86 at the same rho.

### What does a Spearman score of 0.77 mean?

Spearman's correlation compares two rankings and returns a number from -1 to 1. A 1 means the rankings match, a 0 means no pattern links them, and a -1 means one is the exact reverse of the other. At 0.77 you and the model agree on most of the order, not all of it.

### Where can I read the briefing?

At [/briefing](/briefing/). It's updated daily.
