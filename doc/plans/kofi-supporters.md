# Plan: thank Ko-fi supporters on the blog

Goal: when someone buys Pedro a coffee and chooses to be public, the blog thanks them by name. The site stays static.

## How it works

1. Ko-fi sends a webhook (HTTP POST, form field `data` with JSON) when a payment completes.
2. An Azure Function in Pedro's personal subscription receives it, checks the verification token, and ignores retries by `message_id`.
3. Only when `is_public` is true does it add `{ name, message, type, date }` to `supporters.json` in the blog's `$web` container. No amount, no e-mail. When `is_public` is false nothing about the supporter is published.
4. The blog fetches `/supporters.json` from its own origin (CSP `connect-src 'self'` already allows it) and renders a quiet thank-you line in the footer's Coffee column. No file, or an empty list, renders nothing.

## Decisions

- **Code:** `functions/KofiSupporters/` in this repo, .NET 10 isolated worker, one feature slice. Tests in `functions/KofiSupporters.Tests/`.
- **Storage access:** the Function's system-assigned managed identity gets *Storage Blob Data Contributor* on the blog's storage account. No storage keys in settings.
- **Secret:** the Ko-fi verification token lives in the Function's app settings (`KOFI_VERIFICATION_TOKEN`), never in the repo.
- **Retries:** a marker blob per `message_id` in a private container `kofi-processed` (not `$web`), created only if absent. A second delivery finds it and returns 200 without writing.
- **Concurrent writes:** `supporters.json` is updated with an ETag condition and retried on conflict.
- **Caching:** `supporters.json` is written with `Cache-Control: public, max-age=300`. Cloudflare does not cache `.json` by default (unverified for this zone; check `cf-cache-status` once).
- **Hosting:** Flex Consumption, Linux, West Europe, in the blog's resource group. Expected cost: near zero at a few calls a month (estimate).
- **Deploy:** `func azure functionapp publish` from this machine for the first test. CI for the Function is a later step.

## Steps

- [ ] Function: parse payload, verify token, skip duplicates, append public supporters (unit tests for parsing, token check and the public filter)
- [ ] Azure: Function App, managed identity role, app setting for the token
- [ ] Ko-fi: set the webhook URL, send a test tip, confirm `supporters.json` updates, then remove the test entry
- [ ] Blog: `initSupporters` in `main.js`, strings in `i18n.js` for EN and NO, Ship's log note
- [ ] Privacy: one line on the About page that a name can be removed on request

## Out of scope

Backfilling earlier supporters (no Ko-fi API for it), showing amounts, a separate thank-you page.
