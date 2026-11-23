---
name: promote-post
description: Promotes a newly published digitaldias.com blog post on Hacker News, Dev.to and Google Search Console, and tracks its stats. Invoke after a post goes live, or when Pedro asks for promotion or stats for a post.
---

# Promote a blog post

Every step asks Pedro in chat before anything public happens. Earlier approvals never carry over to a later post.

## Record where it went

After every step, add the channel to `src/data/promotion.yaml` under the post's file name without `.md`: `devto`, `linkedin` or `gsc`, with the date it happened (YYYY-MM-DD), `skipped` when Pedro passes on it, or `drafted` for LinkedIn text he still has to post himself (the pane's "LinkedIn lagt ut" button changes it to the date, or do it once he says it is up). The dd-desk pane reads this file to show where each post went and to stop nagging about promotion. Commit the file with the post's next change; never leave a step unrecorded.

## Hacker News

- On hold since 2026-11-07: Pedro emailed Hacker News and waits for their answer. Do not offer a submission, and leave `hn` out of the promotion log, until he says it is open again.

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
- Every cross-post gets a cover image, because Dev.to ranks posts with a cover higher in its home feed. Make a fresh one with `makeImage` (see `~/dev/personal/makeImage/docs/makeimage.md`), never the post's own images: generate `landscape`, centre-crop to 1000×420 (Dev.to's cover ratio), and save it as a JPEG outside the repo. Keep the subject centred with empty space above and below so the crop keeps it, use the Sea Glass colours, and vary the style from the post's featured image. Show Pedro the image before uploading it with "Upload Cover Image", and regenerate with a new seed if it's weak.
- Set the canonical URL (Advanced Options) to the post's URL on `https://www.digitaldias.com/` and the AI Disclosure to "Some AI (AI-assisted)". Check the Preview before Publish, and confirm "Originally published at digitaldias.com" on the published page.

## LinkedIn (only when the post touches Pedro's CAIO work)

- Suggest this when the post has an honest tie to Pedro's work at Tradesolution, even when the post itself is personal. That includes his work as Chief AI Officer (AI governance, AI adoption in an organisation, measuring AI use, leading teams through AI change, AI policy), technical work he has done at work or shared with colleagues, such as the model-router mod, and a personal project that taught him something he uses in the job or that colleagues can use (the presence sensor post, the nerd and geek self-test). A post where the tie would be invented, like the blues band, gets no LinkedIn suggestion.
- When the tie is unclear, ask Pedro one question: what does this show about his work, or what can colleagues use from it? Never write a work angle he has not confirmed.
- Draft a short write-up in English for Pedro to paste himself. Claude never posts to LinkedIn. The post's link goes in a comment on the post, not in the post body.
- Ask Pedro before showing the draft as final. Aim for 120 to 200 words in four to six short paragraphs, as in the posts he has published. Only the first two lines show before "… more", so the hook goes there and the reader's takeaway follows within the next two sentences.
- Always make one image to go with the LinkedIn post, with `makeImage` (see `~/dev/personal/makeImage/docs/makeimage.md`). Save it to a folder on the Desktop (`~/Desktop`), named `linkedin-<post-slug>`, so Pedro can find it. Never save it in the repo.
- Vary the style from post to post: realistic photograph, cartoon, 3D scene, flat illustration, and so on. Don't repeat the previous post's style.
- Run `makeImage` in PowerShell in the background. Show Pedro the image before he uploads it, and regenerate with a new seed if it's weak.
- Check any text in the image for spelling. Keep it to one to three words per string.
- Write direct and honest, never a pitch: short active sentences and claims stated plainly ("That's my definition."). No softeners such as "I think" or "as a starting point". Keep the humour and the real caveats about numbers Pedro measured, in one plain clause. Open on the concrete moment (what Pedro did today and what it made him ask), not on a general claim. No superlatives, no exclamation marks. The same tone applies to the Dev.to summary.
- Paste format: LinkedIn's editor collapses blank lines on paste, so give the post and the comment each in its own ```text block, with a line holding one blank Braille character (U+2800) between paragraphs. Never make Pedro open a file to find text. When he asks for an image path, give the full absolute path in one piece.
- When the work is for colleagues, say what it helps them with (for example, learning which model fits which task) and why it matters, without overstating the result.

### Angle for a wider reach

Evidence: Pedro's 16 own LinkedIn posts, impressions read from his activity page on 2026-11-23. Two stand far above the rest: the local LLMs post (51,337 impressions, 102 reactions, 54 comments) and the MacBook at work post (2,833). The other 14 sit between 321 and 1,869. The posts differ in age (the 321 is one day old) and nothing was tested, so treat these as hypotheses and update them when newer posts have a few weeks of data.

- **Open on a position or a fact the reader can take a side on.** The two wide posts opened with "Local LLMs still can't code at the level of Claude Code" after the 128GB rig, and "I ordered a MacBook at work. For everyone who knows me, yes, this is real." The narrow ones (the model mod, the nightly scout, Jev, 500 to 860 impressions) open on Pedro's own tool or process.
- **State the job tie as the reason, in one plain sentence.** The MacBook post gives it as the reason for the decision: "As the person responsible for AI adoption at Tradesolution, I can't recommend tools I've never used properly." The narrow posts add the tie as an extra paragraph at the end ("This works at work too."). One post each, so this is the weakest of the five.
- **Give the reader something to argue with.** A number or a stance (the 8 to 10 point SWE-bench gap) plus the credential in one line (Windows for Workgroups 3.11, seven years at Microsoft).
- **Tool as evidence, not subject.** When Pedro built the tool for himself, state the lesson in the reader's terms first ("Once a model is in production, who checks if a better one exists?"), then show his tool as the example.
- **What the two wide posts show in LinkedIn's own analytics (read 2026-11-23, one post each).** The local LLMs post: 35,783 members reached, 98% out of network, viewers mostly senior software engineers at large companies and spread across London, San Francisco, New York and Oslo, 54 comments (many of them long, technical disagreements with the claim), 34 saves, 32 followers gained. The MacBook post: 66% out of network but 51% in Greater Oslo, mostly IT consultants, 0 saves, 0 followers gained. So a claim that software engineers argue about travels across countries, and a story about Pedro mostly travels in Norway. Pick the idea for the reader Pedro wants to reach.
- **Reply to the comments.** Pedro answered in the local LLMs thread, and his own link comment drew 2,205 impressions, so a link in a comment didn't stop the post. Answer disagreement with a fact or a number.
- **What LinkedIn says itself (pressroom post 2026-03-12, via Buffer's 2025-12 interviews).** The feed matches posts to interests, using the industry, skills and experience in a profile and how a person engages over time. LinkedIn says it is cutting engagement bait ("comment to agree"), engagement pods and recycled, click-driven posts, and that this isn't about limiting reach. Its staff say link posts need real knowledge in the post itself. Claims about dwell time, saves, a reach penalty for links and the "360Brew" model come from marketing blogs and one-account tests; LinkedIn has not confirmed them, and the link studies disagree (about 19% to 60%). Don't build advice on them.
- **End on a question only when Pedro has a real one.** The adoption post ended on "What was your biggest unlock?" and drew 30 reactions on 1,339 impressions. Never a generic call for comments.

## Google Search Console

- Property `digitaldias.com` (domain property, verified).
- After a new post goes live, submit its URL in URL Inspection and ask Pedro before requesting indexing.
- Claude never changes Search Console settings and never deletes anything there.

## Stats

- Hacker News: points and comments through the public API, `https://hn.algolia.com/api/v1/search?query=<title>&tags=story`.
- Dev.to: views, reactions and comments from the dashboard in Pedro's Chrome.
- AI referrals: visits to the post referred from `chatgpt.com`, `claude.ai`, `perplexity.ai`, `copilot.microsoft.com` and `gemini.google.com`, and fetches of the post by agent user agents (`ChatGPT-User`, `Claude-User`, `Perplexity-User`). Claude counts agent fetches per path itself with the read-only `CLOUDFLARE_API_TOKEN` in `.env` (GraphQL `httpRequestsAdaptiveGroups` filtered on `clientRequestPath_in`, grouped by `userAgent`, last 24 hours). Referral visits come from Cloudflare Web Analytics with the same token (`rumPageloadEventsAdaptiveGroups` on the account, grouped by `refererHost`, filtered on `requestPath_in`; keep each query window at 7 days or less, since a longer one answers an empty list). The dd-desk pane shows the same numbers per post.
- Take these as snapshots. Compare them on the same weekday each week. Report only aggregate numbers.
