# Norwegian bokmål style check for translated posts

Goal: the text reads as if a Norwegian wrote it first. A reader must not sense English underneath.

## Method
1. Read the `.nb.md` file alone, as a Norwegian editor would. Mark every sentence that sounds translated.
2. Rewrite those sentences from the meaning, not from the English words. Change sentence order, merge or split sentences, swap the verb. Keep the facts, numbers, hedges and structure.
3. Compare with the English only to check that no fact changed.

## What to hunt
- Särskriving (split compounds): `kontekst vindu`, `batteri test`, `ti minutters test`. Write `kontekstvindu`, `batteritest`, `timinuttersprøve` or `ti minutters test` only where Norwegian really splits (genitive). Hyphenate when a compound mixes a number or an English word: `10-minuttersprøve`, `AI-agent`, `Claude Code-økt`.
- English genitive and noun stacks: `Pedros blogg` is fine; `modellens kontekst vindu størrelse` is not.
- Calques: `det gir mening` (use `det henger sammen`, `det er fornuftig`), `på slutten av dagen` (`når alt kommer til alt`), `gjøre en forskjell` (`utgjøre en forskjell`, `ha betydning`), `sette det i perspektiv`, `ta et skritt tilbake`, `i stand til å` (use `kunne`), `basert på` (`ut fra`, `på grunnlag av`), `adressere` (`ta tak i`), `involvere`, `det er verdt å merke seg` (`merk at`), `sjekk ut` (`se på`, `prøv`), `kjøre en test` is fine, `gjøre sitt beste arbeid` (`jobbe best`), `Det avhenger av` (`Det kommer an på`), `som et resultat` (`som følge av`, `derfor`), `heldigvis`/`faktisk`/`egentlig` stuffed in to mimic `actually`.
- Passive overload: English passives become `man`, an active subject, or `-s` forms. Prefer the active.
- Overlong `å`-chains and `ved å` openings. Norwegian likes shorter main clauses and verb-second order.
- Word order after an introductory phrase: verb stays second (`I april skrev jeg`, not `I april jeg skrev`).
- `du`-address stays direct and warm. Keep sentences short, about 12 words on average, like the original voice.
- False friends: `eventuelt`, `aktuell`, `ordentlig`, `realisere`, `kritisk`, `konsekvent`, `sensitiv`, `kapasitet`. Check each against its real Norwegian meaning.
- Prepositions: `fokusere på`, `være avhengig av`, `bry seg om`, `på en flytur` (`på flyturen`), `i helgen`, `om morgenen`.
- Quotation marks in prose: use «guillemets». Leave code, URLs and shortcode attributes alone.
- Numbers: decimal comma (`7,8 s`), a space as thousands separator (`2 050`), dates as `2. november 2026`, `prosent` spelled out in prose, unit after a space (`23 GB`).
- Capitalisation: no capitals on weekdays, months, languages or nationalities except `norsk` stays lower case too; sentence-case titles and headings, with no capital after a colon.
- Commas: before `men`, `for`, `så` and subordinate clauses; none before `og` joining two main clauses with the same subject.
- Prefer an established Norwegian word where one exists and sounds natural (`oppsett`, `innlegg`, `nettleser`, `gjennomgang`, `skrivebord`, `tilbakemelding`). Keep English where Norwegian developers really say it (`commit`, `pull request`, `pipeline`, `deploy`, `prompt`, `repo`, `token`, `Wi-Fi`).
- Idioms: replace English images with a Norwegian equivalent or plain wording when the image does not travel.

## Do not change
Code blocks, inline code, commands, URLs, file names, product names, shortcode `src`, front-matter keys and the values of `date`, `draft`, `categories`, `tags`, `author`, `featuredImage`, `imageCredit`. Keep the same `## ` headings in the same order, the same FAQ `### ` questions, and the same counts of fenced blocks, lists, tables and shortcodes.
