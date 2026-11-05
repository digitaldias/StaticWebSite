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
- Drafts, saves and publishes only what Pedro has approved in chat. A cross-post is a short intro with a link to the full post on digitaldias.com, not the full text. Set the canonical URL to the digitaldias.com post.

## Google Search Console

- Property `digitaldias.com` (domain property, verified).
- After a new post goes live, submit its URL in URL Inspection and ask Pedro before requesting indexing.
- Claude never changes Search Console settings and never deletes anything there.

## Stats

- Hacker News: points and comments through the public API, `https://hn.algolia.com/api/v1/search?query=<title>&tags=story`.
- Dev.to: views, reactions and comments from the dashboard in Pedro's Chrome.
- Take these as snapshots. Compare them on the same weekday each week. Report only aggregate numbers.
