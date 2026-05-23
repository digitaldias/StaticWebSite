---
title: "AI at the workbench"
date: 2026-05-23
draft: false
description: "How AI helped me wire up the HLK-LD2410B human presence sensor, design a custom enclosure in OpenSCAD, and actually finish a hardware project for once."
excerpt: "The HLK-LD2410B detects people who aren't moving. Getting it wired to a D1 Mini and housed in a 3D-printed enclosure was exactly the kind of project where AI made the difference between a drawer full of components and a finished thing on my wall."
readTime: "8 minute read"
categories: ["AI"]
tags: ["HLK-LD2410B", "Home Automation", "OpenSCAD", "ESPHome", "D1 Mini"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-05-23-ai-at-the-workbench/featured.jpg"
featuredAlt: "OpenSCAD exploded view of the 3D-printed enclosure for the HLK-LD2410B presence sensor and D1 Mini"
imageCredit: "© Pedro Dias"
---

I have a drawer. You probably have one too. It's full of components I bought, wired up halfway, got stuck on, and quietly retired from active duty. A handful of ESP32s. Some DHT22 sensors. Three or four Arduinos at various stages of ambition. The drawer is where good intentions go to gather dust.

The HLK-LD2410B nearly joined them.

This is a 24GHz mmWave radar module that detects human presence -- not just motion, but actual presence. A person sitting still at a desk. Someone breathing in a corner of a room. Standard PIR sensors need movement to fire, which means your lights switch off the moment you stop fidgeting. The LD2410B doesn't have that problem. It's also the size of a stick of gum.

I bought it to add proper occupancy sensing to my home office. The plan: pair it with a D1 Mini, hook it into Home Assistant via ESPHome, and stop manually toggling lights like it's 1995.

The problem, as always, was the gap between "I know how to write software" and "I know which wire goes where."

## The wiring problem

Forty years of software doesn't transfer to electronics. I can reason about protocols and timing; I still can't tell you by instinct whether a given board's GPIO pins run at 3.3V or 5V, or which pad labeled TX connects to which pad labeled RX on another board. The gap is always there.

The LD2410B datasheet exists. It is also a three-page PDF written for an audience that already knows what they're doing. The D1 Mini -- an ESP8266-based board that packs WiFi and a full GPIO set into a 26mm footprint -- has similar documentation: technically complete, but hostile to anyone approaching from the software side.

So I opened a conversation with Claude and described what I had. Two boards. I want them to talk to each other over UART. What do I need to know?

What came back was everything the datasheets weren't. The LD2410B runs on 5V power but communicates at 3.3V logic. The D1 Mini's GPIO pins are also 3.3V. Direct connection is fine; no level shifter needed. The baud rate is 256000, a non-standard value that ESPHome handles without complaint. TX on the sensor goes to RX on the D1 Mini and vice versa. GND is shared. That's it.

Knowing *why* each of those things was true helped more than having the answer alone. I understood what would break if I got it wrong. I could make decisions instead of just copying a wiring diagram and hoping.

{{< img src="/images/blog/2026-05-23-ai-at-the-workbench/pinout-documentation.jpg" alt="AI-generated wiring documentation showing the D1 Mini to HLK-LD2410B UART pin mapping table" caption="The wiring guide Claude produced. Pin table, notes, and the one thing you must not do." >}}

{{< img src="/images/blog/2026-05-23-ai-at-the-workbench/sensor.jpg" alt="The HLK-LD2410B sensor next to a ruler, showing it is about 35mm long" caption="35mm of 24GHz radar. The entire sensing antenna is in that rectangular patch on the right." >}}

## ESPHome in ten minutes

ESPHome has a proper LD2410 integration. Once the wiring was correct, getting the sensor talking to Home Assistant took about ten minutes and a YAML block Claude wrote most of. I gave it the pin assignments and baud rate; it produced a configuration that compiles, flashes, and works.

Home Assistant already runs most of our house -- several hundred sensors and lights, the cars' charging schedules optimized around spot prices, the dishwasher, a vacuum robot, two clothes dryers, and the home theatre. The LD2410B wasn't a proof of concept for anything. It was just the next thing on the list.

The sensor reports two target types: moving and stationary. Each has a detection distance and a signal strength. You can tune the detection gates -- the LD2410B has ten 75cm zones you can configure independently -- and set a timeout for how long it waits before reporting the space as empty. I set mine to 30 seconds, long enough to not flicker when I lean back in my chair and short enough to catch me actually leaving the room.

That wired-up prototype sat in a drawer for a couple of years. Working and tested. Going nowhere.

{{< img src="/images/blog/2026-05-23-ai-at-the-workbench/drawer.jpg" alt="The D1 Mini and HLK-LD2410B wired together with jumper wires, the working prototype before it got a proper enclosure" caption="Proof of concept. Functional for two years, mounted on nothing." >}}

## The enclosure problem

Two naked boards, jumper wires everywhere, and a working integration. I had no intention of zip-tying this to a wall.

{{< img src="/images/blog/2026-05-23-ai-at-the-workbench/d1-mini.jpg" alt="The Wemos D1 Mini microcontroller board next to a ruler, showing it is about 26mm long" caption="The D1 Mini. About 26mm, USB on the short end, WiFi built in. It punches well above its weight." >}}

I asked Claude what a reasonable person uses to design a small enclosure for 3D printing. It suggested OpenSCAD. I'd never opened it. The pitch: you describe geometry in code rather than pushing vertices around a GUI. Numbers change, model updates. That made sense to me. So I gave it the board dimensions and a list of requirements: USB port accessible from outside, a window in the lid over the sensor face, mounting holes, wiring clearance between the boards.

What came back was a working file. The first render had the USB cutout on the wrong side and the board mounts were too tight, but the structure was right. I spent an hour adjusting numbers rather than figuring out from scratch how the tool works.

I still had no intuition for whether any of it would survive the translation to plastic. So I got out the caliper and measured everything properly -- board lengths, widths, connector heights, the USB overhang. Fed the actual numbers in.

{{< img src="/images/blog/2026-05-23-ai-at-the-workbench/caliper.jpg" alt="The HLK-LD2410B sensor and D1 Mini next to a steel caliper, used to measure exact dimensions for the enclosure" caption="There is no substitute for a caliper and actual numbers." >}}

Then I printed just the base. The boards dropped in. Every mount hit. The USB port lined up with the cutout. Like a glove.

The full print ran on my new Bambu Lab H2C, ordered from [PolyAlkemi.no](https://www.polyalkemi.no). They were helpful, shipped fast, and -- apparently a house tradition -- included sweets with the package. If you're after filament or a new machine in Norway, worth knowing about.

The exploded view at the top of this post is the result. White top cover with a ventilated grille over the sensor window and an oblong cutout for the USB port. Dark body with board mounts, wire channels, and corner screw bosses. The assembly slides together and sits flush against a wall.

## What actually changed

There's a version of this project that never gets finished. I buy the parts, try to read the datasheets, get confused about logic levels, set it aside to look at later, and later never comes. That version sat in my drawer for two years.

What changed this time was having something to ask. Before, it was datasheets I couldn't parse and forum threads from 2019 with half the images gone. A specific question got a specific answer, with the reasoning attached. That was the whole difference.

The voltage levels, the baud rate quirk, the OpenSCAD scaffolding -- those were the specific walls this project hit twice before. I had everything else. Just not those.

It's on my wall now. The lights stay on while I'm sitting at my desk.

There's a specific feeling to going from idea to finished product in an afternoon. I grew up reading Donald Duck, and Gyro Gearloose was always the character I wanted to be -- the guy in Duckburg who could build anything he imagined. Forty years into coding and I can finally build things too. Took long enough.

I have a position on this blog that says "automate your house." A project that sat in a drawer for two years finished in an afternoon. That's what it means.

---

## FAQ

### What is the HLK-LD2410B?

The HLK-LD2410B is a 24GHz mmWave radar module from Hi-Link that detects human presence. Unlike PIR sensors that require physical movement, it can detect a stationary person by picking up micro-movements like breathing. It measures about 35mm long, communicates via UART at 256000 baud, and runs on 5V power with 3.3V logic levels.

### How is presence detection different from motion detection?

Motion detection requires physical movement -- a PIR sensor fires when your infrared signature shifts across its detection zones. Once you stop moving, it stops seeing you. Presence detection using mmWave radar picks up micro-motions: breathing, small postural adjustments, even a heartbeat at close range. For home automation purposes, presence detection answers "is a person in this room" rather than "did a person recently move."

### Can AI help with electronics wiring?

In practice, yes -- for hobbyist wiring that involves established components and documented protocols. What works well: identifying correct pins, checking voltage compatibility, explaining how a protocol works, writing configuration boilerplate. What still requires your judgment: verifying the answer against the actual datasheet, especially for unusual components or edge cases. Treat it as a knowledgeable starting point, not a hardware oracle.

### How do you use the HLK-LD2410B with ESPHome and Home Assistant?

ESPHome has a built-in LD2410 component. Wire VCC to 5V, GND to GND, sensor TX to the microcontroller RX pin, and sensor RX to TX. Set the baud rate to 256000. Define the component in your ESPHome YAML with the correct TX/RX pins, flash the device, and it appears in Home Assistant as a sensor with separate entities for moving target distance, stationary target distance, and detection state. Configuration takes about ten minutes once the wiring is right.

### What tools are used for 3D printing enclosures?

The enclosure was designed in OpenSCAD, which is free and parametric -- you write code to describe the geometry, which makes precise dimension changes easy. The model was printed on a Bambu Lab H2C.
