---
title: "\"I'll just\": a field guide to nerds and geeks"
date: 2026-11-07
draft: false
description: "Nerd or geek? A self-test for your colleagues, a floppy disk test and two pictures of me, one in clay and one with a bow."
excerpt: "Everybody knows someone who says \"I'll just\". Here is a self-test, two pictures of me, in clay and with a bow, and a floppy disk."
tldr: "Nerd or geek? I have an answer the dictionary doesn't. You get a six-question self-test to send your colleagues on Monday, a floppy disk test and two pictures of me that took five hours to make."
categories: ["AI", "Development"]
tags: ["makeImage", "Krea 2 Turbo", "ComfyUI", "Image generation", "Team culture"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-07-nerd-vs-geek/featured.jpg"
featuredAlt: "A clay figure of a bald man with glasses on his head sits at a cardboard desk beside a clay computer and a tall stack of blue floppy disks, lit by a black desk lamp"
imageCredit: "© Pedro Dias"
---

Everybody knows someone who says "I'll just". Everybody also knows someone who turns up with the finished thing. Are they a nerd and a geek, in some order?

That depends on who you ask. I asked the dictionary first. Then I asked myself.

## Nerd vs geek: what the dictionary says

"Geek" was an early twentieth-century word for a carnival performer who bit the heads off live animals ([Britannica](https://www.britannica.com/story/where-do-the-terms-nerd-and-geek-come-from)). Nobody else dared, and nobody forgot the show.

"Nerd" is a mystery. Dr. Seuss used it in *If I Ran the Zoo* in 1950, probably the first time in print. The Oxford English Dictionary calls the origin "uncertain and disputed" ([NPR](https://www.npr.org/2025/08/20/nx-s1-5507053/nerd-dr-seuss-word-of-week), [World Wide Words](https://worldwidewords.org/qa-ner1.html)).

The usual line, as Big Think tells it, is that nerds lean towards intellect and achievement while geeks are passionate about their interests ([Big Think](https://bigthink.com/culture-religion/nerd-vs-geek-compliment-or-insult/)). That doesn't answer my question. My answer is on a floppy disk.

## The floppy disk test

My definition of a nerd and a geek fits on a floppy disk.

In the eighties and nineties, somebody always came to visit with a bag of floppy disks. The nerds' disks were full of pirated fun: games, demos, whatever the swap circuit had that week. The geeks' disks were empty.

The geeks were every bit as keen. They had read the magazine, and they knew exactly what they wanted to make. They just hadn't made it yet. An empty disk is a possibility. A full disk is something you can plug in.

Here is my definition. The nerd and the geek are equally enthusiastic. The geek brings the first ideas, often half-finished, and lets go a little too early. The nerd doesn't quit until it's done. On day one they look the same. On day thirty, one has a demo and the other has an idea somebody else can pick up.

Your colleague who says "I'll just" is a geek, and without that colleague nobody would start anything. I'm a total nerd myself: I don't quit until something is finished, whatever it is. But I need the geeks. Somebody has to bring the half-finished idea I can finish.

Nerds are supposed to be antisocial creatures who talk to the screen. I'm very social and outgoing, so I'm a nerd and a geek at once, and I fit neither box. I don't quit until something is finished, but I prefer to do it with people around. No dictionary has that combination. I checked.

Now swap the disk for a repo, a script or a Teams channel you created in January. Is there anything in it? Can other people use it without you standing behind them explaining?

## Self-test: nerd or geek at work

Six questions tell you whether you're a nerd or a geek at work. Answer honestly, then count your A's. No answer is wrong.

1. At 22:00 you find a new tool. At 22:30 you have (A) it installed and doing something, or (B) twelve tabs, a Notion page and a name for the project.
2. Someone wants to see your side project. You (A) send a link, or (B) say "it's a bit hard to explain, but it's going to be big".
3. Your hobby project is (A) finished, however ugly, or (B) 80 percent done and needs a rewrite from scratch.
4. Someone asks whether it works. You say (A) "Yes, look", or (B) "Almost. I'll just ..."
5. The bug you almost fixed on Friday is, on Monday, (A) fixed, with a test, or (B) replaced by a better idea and a new folder.
6. Your oldest backlog card is (A) closed, or (B) from last year and called "Explore".

4 to 6 A's: nerd. 0 to 3: geek. Both are gold, and most of us are both, depending on the project and the day.

My suggestion for Monday: paste the six questions into your team channel and ask everybody to post their score. The geeks bring the cake idea. The nerds bake it.

## makeImage: five hours to get my face right

One Saturday morning, while everybody else was asleep, I tinkered with improving my image tool, `makeImage`. It can now do three new things: keeping a person's identity, taking negative prompts and editing pictures. It all runs on my own machine, with Krea 2 Turbo and ComfyUI. Running things locally is a habit of mine: see [AI at the workbench](/blog/2026-05-23-ai-at-the-workbench/) and [Stop paying a frontier model to read your news](/blog/2026-11-01-local-models-news-filter/). A geek would have stopped at the first image that looked good, and had three new ideas by lunch. I started at 05:00 and finished at 10:00, because the figure didn't look like me.

Both pictures below start from the same photo as on my [About page](/about/). It's one photo, so the results come from a single test and not a study:

- Plain image-to-image at denoise 0.7 gave me a different man.
- Painting only the face gave me my face, glued onto a stranger's body.
- An identity edit with the Krea2Edit LoRAs gave me me, but as an archer.

That last one is the command I use now, and it takes about 30 seconds per image. I swapped the background in a second step with `--edit general` and an instruction to make it a Norwegian fjord:

```powershell
makeImage --no-input -p landscape -s 603 --image pedro.jpg --edit identity "Turn him into a sharpshooting archer in a dark tactical outfit with a purple accent, standing in an open field at golden hour, drawing a sleek high-tech compound bow with a fancy glowing arrow aimed at a distant archery target. Keep his face, bald head and expression the same, clean shaven, no helmet, no hat. A single arrow already sits in the exact centre of the bullseye."
```

Write the prompt as an instruction, and name the clothes to replace, or the old collar shows through. When you change style, say that everything changes ("Everything in the picture is made of clay"). When I asked it to keep the framing, the clay came out half photograph.

Negative prompts work too, but they double the render time and give a different picture, not an edited one. `--negative "text, letters, logos, printed labels"` turned a shelf of packages with fake text into plain cardboard.

Here is the result. One picture in clay, one with a bow.

{{< img src="/images/blog/2026-11-07-nerd-vs-geek/clay.jpg" alt="A clay figure of a bald man in a navy shirt with glasses on his head, typing on a clay computer beside a stack of blue floppy disks, lit by a desk lamp on a cardboard table" caption="Me, in clay. The disks sit in a stack, finished." >}}

{{< img src="/images/blog/2026-11-07-nerd-vs-geek/archer.jpg" alt="A bald man with glasses on his head, in a dark tactical outfit with a purple vest, draws a black compound bow and shoots a glowing purple arrow across a misty fjord with snowy mountains at sunrise" caption="Me, with a fancy bow. The geek aims. The nerd hits." >}}

The clay figure was the geek in me. The rest was the nerd.

## FAQ

### What is the difference between a nerd and a geek?

Both are equally enthusiastic. The geek brings the ideas, often half-finished, and lets go a little too early. The nerd doesn't quit until it's done.

### Who says so?

I do. It's my definition, and it applies in this post and in your team channel on Monday. The dictionaries say something else.

### Who is better?

Neither. A geek without a nerd has a pile of ideas. A nerd without a geek has nothing to finish.

### Can I use the self-test on my team?

Yes, as a joke and never as a performance review. You laugh at your own answers first.

### Can you be both a nerd and a geek?

Yes, I am. I don't quit until something is finished, and I'm very social, which nerds are apparently not supposed to be.
