---
name: promote-post
description: Promotes a newly published digitaldias.com blog post on Hacker News, Dev.to and Google Search Console, and tracks its stats. Invoke after a post goes live, or when Pedro asks for promotion or stats for a post.
---

# Promote a blog post

Every step asks Pedro in chat before anything public happens. Earlier approvals never carry over to a later post.

## Hacker News

- Offer to submit the post's English URL as a link post, with its title. Submit only after Pedro approves that title and URL in chat.
- Pedro's Hacker News password is never stored in this repo or any file. Claude never reads, copies, types or prints it.
- Login: open `https://news.ycombinator.com/login` in Pedro's Chrome and stop there. Pedro signs in himself. On his Windows computer he can copy the username and password from Windows Credential Manager (target `news.ycombinator.com`). On his MacBook he uses his own password manager. Once he says he is signed in, Claude carries on.

## Dev.to

- Account `digitaldias`. Pedro signs in with his Google account. Claude opens the sign-in page in Pedro's Chrome and stops there. Once Pedro says he is signed in, Claude carries on.
- Drafts, saves and publishes only what Pedro has approved in chat. Show him the full draft first.
- Never copy the post's content to Dev.to: no sections, code, images or paragraphs lifted from the post. Every cross-post is a fresh summary in this format:
  - Title: the post's English title. Tags: up to four, lowercase, from the post's subject.
  - Three or four short paragraphs, about 120 to 180 words, in first person and the voice rules of CLAUDE.md. Open on what Pedro did or noticed, then the idea, then any honest caveat (what is an estimate, unproven or only tested on his own setup).
  - What the full post covers as a short Markdown bullet list after a lead-in line ("The full post has:"), so the reader can scan what they get (a recipe, a prompt, a rubric).
  - Bold one or two key phrases in the paragraphs. Plain paragraphs alone read like a block of code to anyone who has set Dev.to's monospace article font, as Pedro has.
  - A last line in bold with the link: `**Read the full post, with <what it gives the reader>:** <post URL>`.
  - Word the summary a little differently from the post's opening and TL;DR, so it reads as an introduction, not an excerpt.
  - Reference: https://dev.to/digitaldias/dont-write-like-a-robot-llmstxt-for-ai-agents-1hd5 (2026-11-06).
- Every cross-post gets a cover image, because Dev.to ranks posts with a cover higher in its home feed. Make a fresh one with `makeImage` (see `C:\Users\pedro\.claude\docs\makeimage.md`), never the post's own images: generate `landscape`, centre-crop to 1000×420 (Dev.to's cover ratio), and save it as a JPEG outside the repo. Keep the subject centred with empty space above and below so the crop keeps it, use the Sea Glass colours, and vary the style from the post's featured image. Show Pedro the image before uploading it with "Upload Cover Image", and regenerate with a new seed if it's weak.
- Set the canonical URL (Advanced Options) to the post's URL on `https://digitaldias.com/` and the AI Disclosure to "Some AI (AI-assisted)". Check the Preview before Publish, and confirm "Originally published at digitaldias.com" on the published page.

## LinkedIn (only when the post touches Pedro's CAIO work)

- Suggest this when the post covers Pedro's work at Tradesolution. That includes his work as Chief AI Officer (AI governance, AI adoption in an organisation, measuring AI use, leading teams through AI change, AI policy) and technical work he has done at work or shared with colleagues, such as the model-router mod. A post about a purely personal project gets no LinkedIn suggestion. When it is unclear, ask Pedro whether the work was done at Tradesolution.
- Draft a short write-up in English for Pedro to paste himself. Claude never posts to LinkedIn. The post's link goes in a comment on the post, not in the post body.
- Ask Pedro before showing the draft as final. Keep the draft to a few sentences with the takeaway first.
- Always make one image to go with the LinkedIn post, with `makeImage` (see `C:\Users\pedro\.claude\docs\makeimage.md`). Save it to a folder on the Desktop, named `linkedin-<post-slug>`, so Pedro can find it in Explorer. Never save it in the repo.
- Vary the style from post to post: realistic photograph, cartoon, 3D scene, flat illustration, and so on. Don't repeat the previous post's style.
- Run `makeImage` in PowerShell in the background. Show Pedro the image before he uploads it, and regenerate with a new seed if it's weak.
- Check any text in the image for spelling. Keep it to one to three words per string.
- Write in Norwegian humility, in English: modest and honest, never a pitch. Use "I think", "as a starting point", "I've only tested it on my own sessions". No superlatives, no exclamation marks, no claims Pedro hasn't measured. Say where the result may differ.
- When the work is for colleagues, say what it helps them with (for example, learning which model fits which task) and why it matters, without overstating the result.

## Google Search Console

- Property `digitaldias.com` (domain property, verified).
- After a new post goes live, submit its URL in URL Inspection and ask Pedro before requesting indexing.
- Claude never changes Search Console settings and never deletes anything there.

## Stats

- Hacker News: points and comments through the public API, `https://hn.algolia.com/api/v1/search?query=<title>&tags=story`.
- Dev.to: views, reactions and comments from the dashboard in Pedro's Chrome.
- AI referrals: visits to the post referred from `chatgpt.com`, `claude.ai`, `perplexity.ai`, `copilot.microsoft.com` and `gemini.google.com`, and fetches of the post by agent user agents (`ChatGPT-User`, `Claude-User`, `Perplexity-User`). Claude counts agent fetches per path itself with the read-only `CLOUDFLARE_API_TOKEN` in `.env` (GraphQL `httpRequestsAdaptiveGroups` filtered on `clientRequestPath_in`, grouped by `userAgent`, last 24 hours). Referral visits come from Cloudflare Web Analytics with the same token (`rumPageloadEventsAdaptiveGroups` on the account, grouped by `refererHost`, filtered on `requestPath_in`; keep each query window at 7 days or less, since a longer one answers an empty list). The dd-desk pane shows the same numbers per post.
- Take these as snapshots. Compare them on the same weekday each week. Report only aggregate numbers.
