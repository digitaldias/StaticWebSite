---
title: "Make blog cover images with a local AI on your PC or Mac"
date: 2026-11-21
draft: false
description: "Make blog cover images with a local AI image model on your PC or Mac. With keying it gets close to Nano Banana 2, with no cap. Setup prompt included."
excerpt: "Most covers on this blog come from an image model that runs on my own machines. Here is what hardware it needs, how I write the prompts, and a prompt that has Claude set it up for you."
tldr: "If you have a PC with an OK graphics card or a recent Mac, a local AI image model makes cover images that are good enough for a blog, for the cost of electricity. With a reference picture and keying, my local setup came close to Google's Nano Banana 2 on a picture full of text, with no cap on how many pictures I make. The post gives you the prompt recipe I use and a prompt that has Claude set up the same thing for you."
categories: ["AI", "Development"]
tags: ["ComfyUI", "Krea 2", "Local AI", "Image generation"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-11-21-local-ai-blog-cover-images/featured.jpg"
featuredAlt: "An elderly woman in a yellow hen costume holds a sign in front of the Storting in Oslo that reads WANT EGGS? LAY THEM YOURSELF!, with three demands below"
imageCredit: "© Pedro Dias"
---

The woman in the hen costume on the cover doesn't exist. A model on my PC at home drew her in front of the Storting in 15 seconds, and a command named makeImage printed the sign in her hands. The sign is in English here and in Norwegian in the Norwegian version of this blog entry. Same picture, same seed.

Most covers on this blog are made that way, and the rest are photos I took. No subscription, no upload, no credits running out.

## Local AI image generation: good enough for blog covers

A local image model runs on your own computer and makes a picture from a text prompt. If you have a PC with an OK graphics card, or a recent Mac, you can use it to make cover images that are good enough for blogging.

I mean good enough for a blog entry, not good enough for professional work. I use two models, and they are good at different things. Krea 2 Turbo is my default. It handles busy scenes, mist and light, and a short word or two:

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/krea2-harbour.jpg" alt="Five red boathouses on tall wooden stilts in a misty Norwegian fjord at dawn, a white rowing boat tied below them and a small sign on the nearest boathouse that reads BRYGGE 5" caption="Krea 2 Turbo, second seed. I asked for five boathouses. This seed drew five, and the first one drew six." credit="© Pedro Dias" >}}

MiniMax H3 Image takes over when the picture needs a paragraph of text or hands that hold something:

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/h3-note.jpg" alt="Two hands hold a crumpled sheet of lined paper with a handwritten note: Saturday: buy eggs, milk and coffee. Pick up the parcel at the post office before five. The dog from next door stays with us until Sunday. Call the plumber about the kitchen tap. Do not forget the bins." caption="MiniMax H3 Image, second seed. All 38 words are right. The first seed wrote adout for about." credit="© Pedro Dias" >}}

Both pictures were made on my PC at home.

## Hardware for a local image model: what runs it

A local image model runs on a PC with an Nvidia graphics card that has enough video memory, or on a Mac with Apple silicon and plenty of memory. I have it installed on both: a PC at home, and a MacBook Pro M5 at work.

The PC at home has an RTX 5090 with 32 GB of video memory. You don't need that. A 3090 has 24 GB, which holds the 19 GB of model files with room to spare. I also tested an old RTX 2080 Ti and got OK results. That is one test of mine, so run your own before you trust it.

At work I use a MacBook Pro M5. A Mac with Apple silicon needs plenty of memory, and it loads larger files than a PC does, because PyTorch's Mac backend has no 8-bit float type: 26 GB for the image model against 13 GB on the PC. I haven't tried a Mac with less memory than mine. The same machines run local language models too, and I wrote a blog entry about [running one offline on a flight](/blog/2026-11-02-local-llm-on-a-plane/).

Time matters less than you'd think. You ask your AI agent for the image and go back to writing. On my PC an image takes about a minute. On the Mac it takes about four minutes with the Krea 2 model I use for most covers, and under two with MiniMax H3 Image.

## Cover prompt recipe: one paragraph, six parts

A prompt of 50 to 120 words gives a cover with a point of view. A short prompt gives you a generic stock photo.

Write one paragraph, in this order:

1. The subjects, with counts and how they relate.
2. The setting, materials and colours.
3. The camera and the light.
4. The composition, and where the empty space is.
5. Any text, in quotes, with the place where it appears.
6. The mood, in one clause, last.

Both models spell short words sharply, so if the picture should say a word, quote the word. If it should have no text, say that too. Here is the short prompt I test a new setup with:

```text
Overhead photograph of a wooden desk in warm morning light, a small black computer tower with a strip of masking tape on its front that reads "LOCAL".
```

That one is short; a real cover prompt is longer. You can paste the recipe into your own Claude and let it write the long version for your post:

```text
Write a prompt for an image model that makes the cover image for my blog post. Use one paragraph of 50 to 120 words, in this order: subjects with counts, setting and materials, camera and light, composition and empty space, any text in quotes with its position, mood in one clause. Here is the post: [paste your post or its summary]
```

## Local image models: where they fall short

Each local image model is weak at something: Krea 2 Turbo at long text, and MiniMax H3 Image at counts. In my test on 14 November, with one or two pictures per case, Krea 2 Turbo broke a third of the words in a 52-word paragraph and split a Norwegian place name in two. MiniMax H3 Image spelled both right. H3 drew 24 playing cards where I asked for 20, and Krea 2 got the count on one of two seeds. Counts slip in both, though: for this post Krea 2 drew six boathouses on one seed where I asked for five. I wrote a blog entry about the [nightly job that tests new models against the ones I use](/blog/2026-11-14-local-image-model-scout/). You should read it if you want the full table.

For a cover, one to three short words in the picture work with either model. For more text I use a trick in makeImage called keying, and it is the core of makeImage. Building it took me four days between 7 and 14 November: 22 commits, and about 22 hours from the first to the last commit of those days. The model draws the sign as a blank magenta sheet. Then makeImage stretches a web page to fill that sheet: it follows the sheet's edges, its perspective and any curve, and it takes the light from the magenta, so shadows and creases land on the print. Every letter is exact, and the page takes the same shape as the sheet. The cover of this post is made that way: the woman and the Storting come from the model, and the sign is an HTML page Claude wrote in two languages, set on the same picture. One lesson from this cover: ask for a stiff, flat board. A soft sheet bends in her hands, and the text bends with it. Keying is part of my private makeImage, so your Claude will have to build it, and the prompt for it is longer than the setup prompt further down.

## Local vs hosted image model: close to Nano Banana 2, without the cap

On one hard prompt, my local models got close to Google's Nano Banana 2, a hosted model, and they have no cap on how many pictures I make. The prompt asks for what is hard for my setup: the woman from the cover as a reference, six pieces of text, a coffee cup with a curved sleeve, and a neon sign reflected in a puddle. I gave the same prompt and the same reference to three models and kept the first picture from Nano Banana 2 and from H3. Krea 2's first picture needed keying.

Google's Nano Banana 2 got the cover of this blog entry as its reference:

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/nano-banana-tram.jpg" alt="The woman in the hen costume waits at a rainy Oslo tram stop at night, with a blue tram signed MAJORSTUEN, a KIOSK neon sign, a newspaper headline that reads HØNENE STREIKER, a timetable headed AVGANGER and a coffee cup that reads EGG ER IKKE GRATIS" caption="Nano Banana 2 in Adobe Firefly, one run. The same woman, and MAJORSTUEN, KIOSK, AVGANGER, HØNENE STREIKER and the curved cup are all spelled right. It drew her sign as a blank magenta board, the KIOSK in the puddle should be upside down, and the one in the glass reads KISO." credit="© Pedro Dias, made with Google AI" >}}

MiniMax H3 Image got the same reference, through makeImage's edit mode:

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/h3-tram.jpg" alt="The woman in the hen costume stands at a rainy tram stop at night with a coffee cup and her sign under one arm, a tram signed MAJORSTUEN behind her, a KIOSK neon sign and a newspaper that reads HØNENE STREIKER" caption="MiniMax H3 Image on my PC, one run. KIOSK, MAJORSTUEN, AVGANGER and HØNENE STREIKER are right, and the sign is under her arm as the prompt asked. The cup reads ERATIS, the KIOSK in the puddle stands upright, and the timetable is noise." credit="© Pedro Dias" >}}

Krea 2 got the same reference too. Its first picture had a headline that lost an E and a timetable of noise. So I keyed the display case: one more edit painted it magenta, and makeImage printed a newspaper front page and a timetable onto it.

{{< img src="/images/blog/2026-11-21-local-ai-blog-cover-images/krea2-tram.jpg" alt="The woman in the hen costume holds her protest sign and a coffee cup at a rainy tram stop, beside a lit display case with a newspaper front page that reads HØNENE STREIKER and a timetable headed AVGANGER" caption="Krea 2 Turbo on my PC, three runs: the edit with the reference, the edit that painted the case magenta, and the keying. Every letter in the display case is right, raindrops on the glass included. Outside the case, the tram reads OSA, the notice on the glass is noise, the first K in KIOSK is mirrored, and she still holds the sign from the cover." credit="© Pedro Dias" >}}

Nano Banana 2 did it in one run, and it is the only picture in this post that ran on someone else's servers. H3 came close in one run on my PC. Krea 2 with keying took three runs, and it has the best text in the display case: every letter in the newspaper and the timetable there is right. So with keying, the gap is a couple of extra runs.

The price is where local wins. Google charges $0.067 for a 1K picture from Nano Banana 2 through its API, $0.0336 from the newer Nano Banana 2.1, and there is no free tier ([Google's pricing page](https://aistudio.google.com/docs/pricing), checked 21 November 2026). Adobe Firefly Standard costs $11.99 a month for 2,000 credits ([Firefly plans](https://www.adobe.com/products/firefly/plans.html)), and one Nano Banana 2 picture costs 20 of them for now, a rate Adobe marks as limited time ([Adobe's partner model table](https://helpx.adobe.com/creative-cloud/apps/generative-ai/non-adobe-models-in-adobe-products.html)). That is 100 pictures a month.

I made at least 19 pictures for this post, and I threw most of them away. That is how you get a good cover: you try another seed. My PC has no cap. A picture costs electricity, and my estimate is under 2 Norwegian øre, less than a fifth of a US cent: if the whole PC draws 700 watts for a minute, that is 0.012 kWh, at 1.50 kroner per kWh. If you already have the machine, local pays off. I wrote a blog entry about the same choice for reading the news, [Stop paying a frontier model to read your news](/blog/2026-11-01-local-models-news-filter/). You should read it if you pay per token today.

## Setup prompt: let Claude install it

Claude can install a local image model for you, so you don't have to do it by hand. I keep my setup in a command named `makeImage`, and I rarely type it myself. I ask Claude, and Claude reads a file named `makeimage.md` that tells it how to use the command. Any agent that reads an `AGENTS.md` can do the same. The command wraps [ComfyUI](https://github.com/Comfy-Org/ComfyUI) and two models, [Krea 2 Turbo](https://huggingface.co/krea/Krea-2-Turbo) and MiniMax H3 Image. makeImage lives in a private repository, so you can't clone it, but your Claude can build the same thing from the files Comfy-Org publishes. This is the short form of the prompt I used, and it sets up Krea 2, the model I use for most covers.

```text
Set up local image generation on this machine, and verify each step before the next.
1. Install ComfyUI: the portable build on Windows, ComfyUI Desktop on a Mac. Ask me where to put it.
2. Download these files from https://huggingface.co/Comfy-Org/Krea-2/tree/main into ComfyUI's models folders, and check each size against what Hugging Face lists. On Windows with an Nvidia card, take diffusion_models/krea2_turbo_fp8_scaled.safetensors (13 GB) and text_encoders/qwen3vl_4b_fp8_scaled.safetensors (5 GB). On a Mac, take the bf16 versions of the same two files (26 GB and 9 GB), because a Mac has no 8-bit float. On both, take vae/qwen_image_vae.safetensors.
3. Build a ComfyUI workflow for Krea 2 Turbo from ComfyUI's own template, and write a command named makeimage that takes a prompt and a seed and saves a 1920x1080 JPEG at about 82 percent quality.
4. Test it with this prompt: overhead photograph of a wooden desk in warm morning light, a small black computer tower with a strip of masking tape on its front that reads "LOCAL". Open the picture and confirm that it shows the word LOCAL.
5. Write a short makeimage.md that tells an AI agent how to use the command: the flags, the prompt recipe (subjects, setting, camera and light, composition, quoted text, mood) and the lessons from the test. Tell me which line to add to my AGENTS.md or CLAUDE.md so that agents read it. Do not edit those files yourself.
Finish with a short report: install paths, file sizes, render time and the path of the test picture.
```

Run it in an empty folder, and let it ask before it downloads. The three files add up to about 19 GB on a PC and 35 GB on a Mac, so check your disk first. Each file has its own job: the text encoder turns your prompt into the numbers the model reads, the diffusion model draws the picture in a compressed form, and the VAE decodes that into pixels.

## FAQ

### Do I need a subscription to make AI cover images?

No. A local image model runs on your own computer and costs electricity only. The model files are free to download from Hugging Face.

### Which graphics card do I need for a local image model?

An Nvidia card with enough video memory, and I can only report my own tests. An RTX 3090 has 24 GB, which holds the 19 GB of model files, and an old RTX 2080 Ti gave me OK results in one test. The PC at home has an RTX 5090.

### Can a Mac make cover images with a local AI?

Yes, if it is Apple silicon with a lot of memory. I use a MacBook Pro M5. I haven't tried a Mac with less memory than mine.

### Is a local image model as good as Nano Banana 2?

Close, with keying. On one hard prompt, H3 got most of the text right in one run on my PC, and Krea 2 with keying got the newspaper text right in three runs. Nano Banana 2 did it in one run. That is one prompt and one picture per model, so run your own test.

### What does Nano Banana 2 cost compared with a local model?

Google charges $0.067 for a 1K picture through its API, with no free tier. In Adobe Firefly Standard, $11.99 a month buys 2,000 credits, and a Nano Banana 2 picture costs 20 for now, so 100 pictures a month. A local model has no cap, and by my estimate a picture costs less than a fifth of a US cent in electricity.

### Does a local image model spell the words in the picture?

Short words, yes. Both models I use handle one to three short labels, like BRYGGE 5 on the boathouse in this post. For a block of 9 to 50 words, H3 spelled better than Krea 2 in my test. For more text than that I use keying: the model draws a blank sheet and makeImage prints an HTML page onto it. The hen cover on this post is made that way.
