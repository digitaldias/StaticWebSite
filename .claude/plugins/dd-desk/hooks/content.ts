import type { EngineInterface } from 'claude-code'

import type { Check, Deploy, DevTo, Draft, NowBox, Promotion, Published, Snapshot } from '../types'

type Host = EngineInterface

export const BLOG = 'src/content/blog'
export const PROMOTION_LOG = 'src/data/promotion.yaml'
const POSTS_SHOWN = 6

export function unquote(value: string): string {
  const trimmed = value.trim()
  const quoted = /^"(.*)"$/.exec(trimmed) ?? /^'(.*)'$/.exec(trimmed)

  return quoted?.[1] ?? trimmed
}

export function frontMatter(text: string): Record<string, string> {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? ''
  const fields: Record<string, string> = {}
  for (const line of block.split(/\r?\n/)) {
    const [, name, value] = /^(\w+):\s*(.*)$/.exec(line) ?? []
    if (name !== undefined && value !== undefined) {
      fields[name] = unquote(value)
    }
  }

  return fields
}

export function draftChecks(
  text: string,
  fields: Record<string, string>,
  facts: { hasNb: boolean; hasCover: boolean; isScored: boolean },
): Check[] {
  const body = text.replace(/^---[\s\S]*?\n---/, '')
  const sections = (body.match(/^## (?!FAQ\b)/gm) ?? []).length

  return [
    { label: '2+ seksjoner', isDone: sections >= 2 },
    { label: 'TL;DR', isDone: Boolean(fields.tldr) },
    { label: 'FAQ', isDone: /^## FAQ\b/m.test(body) },
    { label: 'Norsk', isDone: facts.hasNb },
    { label: 'Cover', isDone: facts.hasCover },
    { label: 'Depth', isDone: facts.isScored },
  ]
}

// The promotion log: a post's file name without .md, then one indented `channel: date|skipped|drafted` line per channel.
export function parsePromotion(text: string): Record<string, Promotion> {
  const byPost: Record<string, Promotion> = {}
  let current: Promotion | null = null
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || /^\s*#/.test(line)) {
      continue
    }
    const post = /^([\w-]+):\s*$/.exec(line)?.[1]
    if (post) {
      current = {}
      byPost[post] = current
      continue
    }
    const [, channel, value] = /^\s+(\w+):\s*(.+?)\s*$/.exec(line) ?? []
    if (current && channel && value) {
      current[channel] = value
    }
  }

  return byPost
}

// Promoted once it is on Dev.to or LinkedIn. Search Console is indexing, not promotion, and a skipped
// or merely drafted channel does not count: skipping one is Pedro's call, not a missing step.
export function isPromoted(post: Published): boolean {
  const done = (channel: string): boolean => Boolean(post.promoted[channel]) && !['skipped', 'drafted'].includes(post.promoted[channel] ?? '')

  return Boolean(post.devto) || done('devto') || done('linkedin')
}

function channel(name: string, live: string | null, recorded: string | undefined, sent: string): string {
  if (live) {
    return live
  }
  if (recorded === 'skipped') {
    return `${name} hoppet over`
  }
  if (recorded === 'drafted') {
    return `${name} utkast`
  }

  return recorded ? sent : `ikke ${name}`
}

// One line for the pane: where the post went. Live numbers from Dev.to win over the log.
export function channelLine(post: Published): string {
  const { promoted } = post

  return [
    channel('Dev.to', post.devto ? `Dev.to ${post.devto.reactions}` : null, promoted.devto, 'Dev.to publisert'),
    channel('LinkedIn', null, promoted.linkedin, 'LinkedIn lagt ut'),
    channel('Google', null, promoted.gsc, 'Google bedt indeksere'),
  ].join(' · ')
}

// Sets one channel of one post in the promotion log's text and leaves the rest of the file as it was.
export function recordChannel(text: string, base: string, channelName: string, value: string): string {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex(line => line === `${base}:`)
  const entry = `  ${channelName}: ${value}`
  if (start === -1) {
    const body = text === '' || text.endsWith('\n') ? text : `${text}\n`

    return `${body}${base}:\n${entry}\n`
  }
  let end = start + 1
  while (end < lines.length && /^\s+\S/.test(lines[end] ?? '')) {
    end += 1
  }
  const own = lines.slice(start + 1, end)
  const at = own.findIndex(line => new RegExp(`^\s+${channelName}:`).test(line))
  if (at === -1) {
    own.push(entry)
  } else {
    own[at] = entry
  }

  return [...lines.slice(0, start + 1), ...own, ...lines.slice(end)].join('\n')
}

function tomlField(block: string, name: string): string {
  return new RegExp(`^\\s*${name}\\s*=\\s*"(.*)"\\s*$`, 'm').exec(block)?.[1] ?? ''
}

function yamlField(block: string, name: string): string {
  return unquote(new RegExp(`^\\s*${name}:\\s*(.*)$`, 'm').exec(block)?.[1] ?? '')
}

export function nowBox(toml: string, listening: string): NowBox {
  const block = /^\s*\[params\.currently\]\s*$([\s\S]*?)^\s*\[/m.exec(toml)?.[1] ?? ''
  const first = listening.split(/^- /m)[1] ?? ''
  const artist = yamlField(first, 'artist')
  const song = yamlField(first, 'song')

  return {
    building: tomlField(block, 'building'),
    tinkering: tomlField(block, 'tinkering'),
    annoyedBy: tomlField(block, 'annoyed_by'),
    listening: song ? `${artist}: ${song}` : artist,
    listeningDate: yamlField(first, 'date'),
  }
}

export async function git($: Host, args: string[]): Promise<string> {
  const ran = await $.process.run(['git', ...args]).catch(() => null)

  return ran?.exitCode === 0 ? ran.stdout.trim() : ''
}

export async function lastDeploy($: Host): Promise<Deploy | null> {
  const ran = await $.process
    .run(['gh', 'run', 'list', '-L', '1', '-w', 'deploy-to-azure.yml', '--json', 'status,conclusion,displayTitle,createdAt'])
    .catch(() => null)
  if (ran?.exitCode !== 0) {
    return null
  }
  const [run] = JSON.parse(ran.stdout) as {
    status: string
    conclusion: string
    displayTitle: string
    createdAt: string
  }[]

  return run
    ? { title: run.displayTitle, status: run.status, conclusion: run.conclusion, createdAt: run.createdAt }
    : null
}

// Dev.to's public API: the account's articles with their canonical URL, reactions and comments.
async function devToArticles($: Host): Promise<Map<string, DevTo> | null> {
  const response = await $.http.fetch('https://dev.to/api/articles?username=digitaldias&per_page=30').catch(() => null)
  if (!response?.ok) {
    return null
  }
  const articles = JSON.parse(response.text) as {
    canonical_url?: string
    url: string
    public_reactions_count?: number
    comments_count?: number
  }[]
  const byBase = new Map<string, DevTo>()
  for (const article of articles) {
    const base = /\/blog\/([^/]+)\/?$/.exec(article.canonical_url ?? '')?.[1]
    if (base) {
      byBase.set(base, { reactions: article.public_reactions_count ?? 0, comments: article.comments_count ?? 0, url: article.url })
    }
  }

  return byBase
}

export async function posts($: Host, previous: Snapshot | null, withNetwork: boolean): Promise<{ drafts: Draft[]; published: Published[] }> {
  const names = (await $.fs.list(BLOG)).map(entry => entry.name)
  const english = names
    .filter(name => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(name) && !name.endsWith('.nb.md'))
    .sort()
    .reverse()
  const depth = await $.fs.read('src/data/depth.yaml').catch(() => '')
  const promotion = parsePromotion(await $.fs.read(PROMOTION_LOG).catch(() => ''))
  const devto = withNetwork ? await devToArticles($) : null
  const drafts: Draft[] = []
  const published: Published[] = []
  for (const file of english) {
    const text = await $.fs.read(`${BLOG}/${file}`)
    const fields = frontMatter(text)
    const base = file.replace(/\.md$/, '')
    const title = fields.title ?? base
    if (fields.draft === 'true') {
      const hasCover =
        Boolean(fields.featuredImage) || (await $.fs.exists(`src/static/images/blog/${base}/featured.jpg`))
      const checks = draftChecks(text, fields, {
        hasNb: names.includes(`${base}.nb.md`),
        hasCover,
        isScored: depth.includes(`"${base}"`) || depth.includes(`\n${base}:`),
      })
      drafts.push({ file, title, checks })
    } else if (published.length < POSTS_SHOWN) {
      const kept = previous?.posts.find(one => one.file === file)
      published.push({
        file,
        base,
        title,
        date: fields.date ?? '',
        devto: devto ? (devto.get(base) ?? null) : (kept?.devto ?? null),
        promoted: promotion[base] ?? {},
      })
    }
  }

  return { drafts, published }
}
