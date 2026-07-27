---
title: "I tried to fix a Wi-Fi camera. I built a weather station."
date: 2026-07-27
draft: false
description: "A Raspberry Pi 4 was going to relay a weak Wi-Fi camera signal. Three days of driver bugs and bad power later, its touchscreen became a weather station instead."
excerpt: "A camera too far from the hub. A Raspberry Pi that refused to relay its signal. Three days of driver bugs and bad power later, I gave up and let its touchscreen do the one thing it was built for: show something useful on the wall."
readTime: "5 minute read"
categories: ["Development"]
tags: ["Raspberry Pi", "Weather Station", "Home Assistant", "Wi-Fi", "3D Printing"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-07-27-pi4-weather-station/featured.png"
featuredAlt: "A wall-mounted Raspberry Pi weather dashboard showing current conditions, next trash collection, next cleaning day, and a forecast strip"
imageCredit: "© Pedro Dias"
---

Munin, our battery camera on the kitchen side of the house, kept dropping frames. Not a battery problem. The Wi-Fi signal out there was too weak, and moving the camera around didn't help.

I had a [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) in the hallway already: powered, running, an official 7" touchscreen bolted to the front. Obvious fix: turn it into a Wi-Fi access point, sit it between Munin and the hub, let it relay the stream.

It took three days to learn why that plan doesn't work.

## The relay that wouldn't hold

First problem: two power supplies feeding the Pi at once, backfeeding each other. `vcgencmd get_throttled` showed undervoltage and throttling from the moment it booted, which meant nothing I'd measured up to that point was real. One correctly rated supply fixed it.

Second problem: Wi-Fi power saving was on by default on both of the Pi's radios, silently dropping associations. Camera connects, camera vanishes a few minutes later, no error, no log entry worth reading. A systemd service to disable power save on boot fixed that too.

Third problem: the USB access-point radio was a Broadcom chip from 2014 with known driver bugs for exactly this job, standalone AP mode. Clean power, no power-save, and it still fell into reassociation storms under load.

Munin did complete a handshake through the relay once. DHCP worked, the hub picked up the repeater path, the camera streamed. It never held for more than a few minutes at a time, though, and getting the whole path stable enough for daily use was throwing good time after old, unsupported hardware. I pulled the relay.

## What the Pi was good for

That Pi still had a screen. A decent one, in the busiest hallway in the house, already mounted, already powered. I'd spent three days trying to make it good at something it was never built for, while the one thing it actually had going for it sat unused.

So instead of another networking fix, I gave it a job that matched what it already had: show useful things to whoever walks past.

## Building the weather station

First version was a weather panel. [Yr/MET Norway](https://developer.yr.no/) runs two APIs worth combining: Nowcast for what's happening right now, refreshed every quarter hour, and Locationforecast for the next few hours and days. I pulled both, cached them server-side, and built a simple grid.

Then it kept growing. A card for the next trash collection, pulled from [Norkart's Komtek Renovasjon](https://www.norkart.no/offentlig/komtek/renovasjon) service, highlighted only on collection day and the day before. A card for the next cleaning day, since our cleaning schedule is "Fridays on even ISO weeks" and nobody remembers which week that is. A quote of the day from [ZenQuotes](https://zenquotes.io/), refreshed every four hours, because there was empty space left to fill. A colored alert stripe that shows up only when the weather service has an active warning for our coordinates, yellow, orange, or red, and disappears the moment it clears.

{{< img src="/images/blog/2026-07-27-pi4-weather-station/featured.png" alt="The finished Raspberry Pi weather dashboard showing current weather, an active wildfire-risk alert, next trash collection, next cleaning day, and a forecast strip" caption="An ordinary Monday morning: current conditions, an active low-level wildfire warning, next trash pickup, and next cleaning day." >}}

I edited our street name and the birthday details out of this screenshot before publishing it.

None of it touches Home Assistant credentials or a cloud account. The weather and quote APIs need nothing more than a User-Agent header; the waste API needs a fixed public app key, the same one every community integration for it shares. It's a Python script with no dependencies, talking to these APIs directly.

## Fighting a browser from 2019

The factory-installed Chromium on that Pi was version 74, from 2019. Modern JavaScript's nullish coalescing operator, `??`, didn't exist until Chrome 80. That's not a missing feature, it's a parse error, and a parse error kills the entire script on the page. Nothing rendered, nothing logged, no clue why. I upgraded Chromium to 92 from the same repo and the dashboard came back to life.

CSS had a second surprise waiting: `blur()` and `drop-shadow()` render as a solid black box on this GPU. No warning, no partial effect, just black. I swapped every soft-glow effect for a `radial-gradient` fading to transparent instead. Close enough that nobody but me would notice.

The OS also has no Norwegian locale installed, so asking it to format a Norwegian date quietly handed back English weekday names and an AM/PM clock. Fix was blunt: two hardcoded arrays of Norwegian weekday and month names, indexed by hand. Not elegant. Correct.

To stop the screen from burning in: the background cycles through a slow gradient, three soft light spots drift across it on their own schedule, and the whole layout nudges a few pixels every four minutes, safely inside a margin so nothing clips.

## Adding a birthday calendar

Last addition was a birthday calendar. [Home Assistant](https://www.home-assistant.io/)'s built-in calendar can hold recurring yearly events, but its default service for adding one doesn't accept a yearly recurrence rule. So I wrote a small local service that does, plus a simple form for typing in a name and a date without fighting a date picker for someone born decades ago. The dashboard now shows the next birthday, whose it is, and the age they're about to turn, tucked into the header without pushing anything else out.

## Where it ended up

I 3D printed a frame for it and mounted it on the hallway wall. It tells you what to wear, when the trash goes out, when the next big cleaning day is, and now, whose birthday is coming up.

Started as an attempt to save one struggling camera. Ended as the one screen in the house everyone reads.
