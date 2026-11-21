import type { PathCount } from '../types'

import { BLOG } from './content'

export const PROMPTS = {
  newPost:
    'Jeg har en idé til en ny post. Start steg 1 (Interview) under «Writing a new blog post» i CLAUDE.md.',
  now: 'Gå gjennom steg 6 (Positions held and Now) under «Writing a new blog post» i CLAUDE.md, ett spørsmål om gangen.',
  unpushed:
    'main ligger foran origin/main. Vis meg commitene som ikke er pushet, og spør meg før du pusher.',
  deployFailed:
    'Den siste kjøringen av deploy-to-azure.yml feilet. Les loggen med gh run view, finn årsaken og fiks den.',
  resume: (file: string, missing: string[]) =>
    `Fortsett utkastet ${BLOG}/${file} etter «Writing a new blog post» i CLAUDE.md. Panelet ser at dette mangler: ${missing.length ? missing.join(', ') : 'ingenting'}. Finn det første steget som ikke er ferdig, og gjør det.`,
  factCheck: (file: string) =>
    `Kjør steg 8 (Fact-check and SEO) under «Writing a new blog post» i CLAUDE.md på ${BLOG}/${file}.`,
  ideas:
    'Kjør `just stats`, si kort hva som gikk bra og hva som ikke gikk bra, og legg inn ett til tre nye forslag i ideas/ideas.json etter «Post ideas» i CLAUDE.md.',
  writeIdea: (title: string, about: string) =>
    `Jeg vil skrive forslaget «${title}» fra ideas/ideas.json. Det skal handle om: ${about}\n\nStart steg 1 (Interview) under «Writing a new blog post» i CLAUDE.md med dette som utgangspunkt.`,
  comments: (places: string[]) =>
    `Lesere har kommentert her:\n\n${places.map(one => `- ${one}`).join('\n')}\n\nBloggens kommentarer er GitHub Discussions i digitaldias/StaticWebSite (Giscus, én tråd per sti). Les kommentarene, si kort hva hver sier, og foreslå et svar i min stemme. Ikke post noe før jeg sier ja.`,
  promote: (file: string) => `Kjør promote-post-skillen for ${BLOG}/${file}.`,
  stats: (file: string) => `Hent statistikken for ${BLOG}/${file} med promote-post-skillen.`,
  fixCheck: (tail: string) =>
    `just check feilet. De siste linjene:\n\n${tail}\n\nFinn årsaken og fiks den.`,
  broken: (paths: PathCount[]) =>
    `Cloudflare så 404 på disse stiene siste uke:\n\n${paths.map(one => `- ${one.path} (${one.count})`).join('\n')}\n\nFinn ut hvor hver av dem skulle ført, og fiks lenken der den står, eller legg til en Hugo-alias. Si fra om noen av dem bare er støy.`,
}
