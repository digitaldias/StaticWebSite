import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type {
  Check,
  CheckRun,
  Day,
  Deploy,
  Draft,
  HackerNews,
  Latest,
  NowBox,
  Snapshot,
  Traffic,
} from '../types'

import { searchStats } from './google'
import { barChartSvg, botBarsSvg, clockTime, progressSvg, relativeTime, SEA, sparkline, thousands, trafficParts } from './pane'

const PANE = 'dd-desk'
const TITLE = 'digitaldias.com'
const BLOG = 'src/content/blog'
const NETWORK_EVERY_MS = 10 * 60_000

// Change a tag when its type changes: it declines what an earlier version stored.
const snapshot = atom({ plugin: 'dd-desk', key: 'snapshot' } as const, null, {
  shape: 'snapshot-4',
})
const checkRun = atom({ plugin: 'dd-desk', key: 'check' } as const, null, {
  shape: 'check-1',
})
const busy = atom({ plugin: 'dd-desk', key: 'busy' } as const, false, {
  shape: 'busy-1',
})

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

type Host = EngineInterface

async function git($: Host, args: string[]): Promise<string> {
  const ran = await $.process.run(['git', ...args]).catch(() => null)

  return ran?.exitCode === 0 ? ran.stdout.trim() : ''
}

async function lastDeploy($: Host): Promise<Deploy | null> {
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

async function hackerNews($: Host, base: string): Promise<HackerNews | null> {
  const url = `https://hn.algolia.com/api/v1/search?tags=story&restrictSearchableAttributes=url&query=${encodeURIComponent(base)}`
  const response = await $.http.fetch(url).catch(() => null)
  if (!response?.ok) {
    return null
  }
  const { hits } = JSON.parse(response.text) as {
    hits: { url?: string; points?: number; num_comments?: number; objectID: string }[]
  }
  const hit = hits.find(one => one.url?.includes('digitaldias.com') && one.url.includes(base))

  return hit
    ? {
        points: hit.points ?? 0,
        comments: hit.num_comments ?? 0,
        url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
      }
    : null
}

const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot',
  'Amazonbot',
  'Bytespider',
  'meta-externalagent',
  'CCBot',
  'MoonshotBot',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
]

function aiBotName(userAgent: string): string | undefined {
  return AI_BOTS.find(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))
}

export function countBots(rows: { count: number; userAgent: string }[]): Traffic['bots'] {
  const totals = new Map<string, number>()
  for (const { count, userAgent } of rows) {
    const name = aiBotName(userAgent)
    if (name) {
      totals.set(name, (totals.get(name) ?? 0) + count)
    }
  }

  return [...totals].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

// Pages served per day, split into Web Analytics readers and known AI bots; the rest is other bots and unknowns.
export function dailyTraffic(
  pages: { count: number; date: string; userAgent: string }[],
  readers: { count: number; date: string }[],
): Day[] {
  const days = new Map<string, Day>()
  const day = (date: string) => {
    const known = days.get(date) ?? { date, pageViews: 0, readers: 0, aiBots: 0 }
    days.set(date, known)

    return known
  }
  for (const { count, date, userAgent } of pages) {
    const one = day(date)
    one.pageViews += count
    if (aiBotName(userAgent)) {
      one.aiBots += count
    }
  }
  for (const { count, date } of readers) {
    day(date).readers += count
  }

  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date))
}

export function envValue(text: string, name: string): string {
  return unquote(new RegExp(`^\\s*${name}\\s*=(.*)$`, 'm').exec(text)?.[1] ?? '')
}

let zoneId = ''
let accountId = ''

async function cloudflareQuery($: Host, token: string, query: string): Promise<unknown> {
  const response = await $.http.fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  const parsed = JSON.parse(response.text) as { data?: unknown; errors?: { message: string }[] | null }
  if (parsed.errors?.length) {
    throw new Error(parsed.errors[0]?.message ?? 'GraphQL error')
  }

  return parsed.data
}

async function traffic($: Host): Promise<{ traffic: Traffic | null; note: string }> {
  const token = envValue(await $.fs.read('.env').catch(() => ''), 'CLOUDFLARE_API_TOKEN')
  if (!token) {
    return { traffic: null, note: 'Ingen CLOUDFLARE_API_TOKEN i .env.' }
  }
  try {
    if (!zoneId) {
      const zones = await $.http.fetch('https://api.cloudflare.com/client/v4/zones?name=digitaldias.com', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const zone = (JSON.parse(zones.text) as { result?: { id: string; account: { id: string } }[] }).result?.[0]
      zoneId = zone?.id ?? ''
      accountId = zone?.account.id ?? ''
    }
    const now = await $.clock.now()
    const week = new Date(now - 7 * 86_400_000).toISOString().slice(0, 10)
    const day = new Date(now - 86_400_000).toISOString().slice(0, 19) + 'Z'
    const data = (await cloudflareQuery(
      $,
      token,
      `{ viewer {
        zones(filter: {zoneTag: "${zoneId}"}) {
          pages: httpRequestsAdaptiveGroups(limit: 10000, filter: {date_geq: "${week}", requestSource: "eyeball", edgeResponseContentTypeName: "html", edgeResponseStatus: 200}) { count dimensions { date userAgent } }
          agents: httpRequestsAdaptiveGroups(limit: 1000, filter: {datetime_geq: "${day}", requestSource: "eyeball"}, orderBy: [count_DESC]) { count dimensions { userAgent } }
        }
        accounts(filter: {accountTag: "${accountId}"}) {
          readers: rumPageloadEventsAdaptiveGroups(limit: 10, filter: {date_geq: "${week}", requestHost_in: ["www.digitaldias.com", "digitaldias.com"]}, orderBy: [date_ASC]) { count sum { visits } dimensions { date } }
        }
      } }`,
    )) as {
      viewer: {
        zones: {
          pages: { count: number; dimensions: { date: string; userAgent: string } }[]
          agents: { count: number; dimensions: { userAgent: string } }[]
        }[]
        accounts: { readers: { count: number; sum: { visits: number }; dimensions: { date: string } }[] }[]
      }
    }
    const zone = data.viewer.zones[0]
    const readers = data.viewer.accounts[0]?.readers ?? []
    const bots = countBots((zone?.agents ?? []).map(row => ({ count: row.count, userAgent: row.dimensions.userAgent })))

    return {
      traffic: {
        days: dailyTraffic(
          (zone?.pages ?? []).map(row => ({ count: row.count, ...row.dimensions })),
          readers.map(row => ({ count: row.count, date: row.dimensions.date })),
        ),
        visits: readers.reduce((sum, row) => sum + row.sum.visits, 0),
        bots,
        botTotal: bots.reduce((sum, bot) => sum + bot.count, 0),
      },
      note: '',
    }
  } catch (error) {
    return { traffic: null, note: `Cloudflare svarte ikke: ${String(error)}` }
  }
}

async function posts($: Host, previous: Snapshot | null, withNetwork: boolean) {
  const names = (await $.fs.list(BLOG)).map(entry => entry.name)
  const english = names
    .filter(name => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(name) && !name.endsWith('.nb.md'))
    .sort()
    .reverse()
  const depth = await $.fs.read('src/data/depth.yaml').catch(() => '')
  const drafts: Draft[] = []
  let latest: Latest | null = null
  for (const file of english) {
    const text = await $.fs.read(`${BLOG}/${file}`)
    const fields = frontMatter(text)
    const base = file.replace(/\.md$/, '')
    const title = fields.title ?? base
    if (fields.draft === 'true') {
      const hasCover =
        Boolean(fields.featuredImage) ||
        (await $.fs.exists(`src/static/images/blog/${base}/featured.jpg`))
      const checks = draftChecks(text, fields, {
        hasNb: names.includes(`${base}.nb.md`),
        hasCover,
        isScored: depth.includes(`"${base}"`) || depth.includes(`\n${base}:`),
      })
      drafts.push({ file, title, checks })
    } else if (!latest) {
      const kept = previous?.latest?.file === file ? previous.latest.hn : null
      const hn = withNetwork ? await hackerNews($, base) : kept
      latest = { file, title, date: fields.date ?? '', hn }
    }
  }

  return { drafts, latest }
}

async function collect($: Host, previous: Snapshot | null, withNetwork: boolean): Promise<Snapshot> {
  const [branch, ahead, status, deploy, toml, listening] = await Promise.all([
    git($, ['branch', '--show-current']),
    git($, ['rev-list', '--count', 'origin/main..main']),
    git($, ['status', '--porcelain']),
    lastDeploy($),
    $.fs.read('src/hugo.toml').catch(() => ''),
    $.fs.read('src/data/listening.yaml').catch(() => ''),
  ])
  const { drafts, latest } = await posts($, previous, withNetwork)
  const cloudflare = withNetwork
    ? await traffic($)
    : { traffic: previous?.traffic ?? null, note: previous?.trafficNote ?? '' }
  const google = withNetwork
    ? await searchStats($)
    : { search: previous?.search ?? null, note: previous?.searchNote ?? '' }

  return {
    traffic: cloudflare.traffic,
    trafficNote: cloudflare.note,
    search: google.search,
    searchNote: google.note,
    takenAt: await $.clock.now(),
    branch,
    ahead: Number(ahead) || 0,
    changed: status.split('\n').filter(Boolean).length,
    deploy,
    drafts,
    latest,
    now: nowBox(toml, listening),
  }
}

let pending: { promise: Promise<void>; withNetwork: boolean } | null = null

// One reading at a time; a network reading asked for during a local one runs after it.
function refresh($: Host, withNetwork: boolean): Promise<void> {
  if (pending && (pending.withNetwork || !withNetwork)) {
    return pending.promise
  }
  if (pending) {
    return pending.promise.then(() => refresh($, withNetwork))
  }
  const promise = (async () => {
    if (withNetwork) {
      await update($, busy, () => true)
    }
    try {
      const previous = await read($, snapshot)
      const next = await collect($, previous, withNetwork)
      await update($, snapshot, () => next)
    } finally {
      pending = null
      await update($, busy, () => false)
    }
  })()
  pending = { promise, withNetwork }

  return promise
}

// The refresh button: a network reading, then a toast so the press is confirmed.
async function readAgain($: Host): Promise<void> {
  await refresh($, true)
  const taken = (await read($, snapshot))?.takenAt
  await $.ui.toast(taken ? `Panelet er oppdatert ${clockTime(taken)}` : 'Panelet er oppdatert')
}

async function runCheck($: Host): Promise<void> {
  if ((await read($, checkRun))?.isRunning) {
    return
  }
  await update($, checkRun, () => ({ isRunning: true, exitCode: null, tail: '' }))
  const ran = await $.process
    .run(['just', 'check'], { timeoutMs: 600_000 })
    .catch((error: unknown) => ({ exitCode: -1, stdout: '', stderr: String(error) }))
  const tail = `${ran.stdout}\n${ran.stderr}`.trim().split(/\r?\n/).slice(-8).join('\n')
  await update($, checkRun, () => ({ isRunning: false, exitCode: ran.exitCode, tail }))
}

function ask($: Host, text: string): () => void {
  return () => {
    void $.prompt.submit({ text })
  }
}

export const PROMPTS = {
  newPost:
    'Jeg har en idé til en ny post. Start steg 1 (Interview) under «Writing a new blog post» i CLAUDE.md.',
  now: 'Gå gjennom steg 6 (Positions held and Now) under «Writing a new blog post» i CLAUDE.md, ett spørsmål om gangen.',
  unpushed:
    'main ligger foran origin/main. Vis meg commitene som ikke er pushet, og spør meg før du pusher.',
  resume: (file: string, missing: string[]) =>
    `Fortsett utkastet ${BLOG}/${file} etter «Writing a new blog post» i CLAUDE.md. Panelet ser at dette mangler: ${missing.length ? missing.join(', ') : 'ingenting'}. Finn det første steget som ikke er ferdig, og gjør det.`,
  factCheck: (file: string) =>
    `Kjør steg 8 (Fact-check and SEO) under «Writing a new blog post» i CLAUDE.md på ${BLOG}/${file}.`,
  promote: (file: string) => `Kjør promote-post-skillen for ${BLOG}/${file}.`,
  stats: (file: string) => `Hent statistikken for ${BLOG}/${file} med promote-post-skillen.`,
  fixCheck: (tail: string) =>
    `just check feilet. De siste linjene:\n\n${tail}\n\nFinn årsaken og fiks den.`,
}

export const register: Register = on => {
  let isHome = false

  on('session.start', async ($, e, next) => {
    const started = await next(e)
    const toml = await $.fs.read('src/hugo.toml').catch(() => '')
    isHome = toml.includes('digitaldias')
    if (!isHome) {
      return started
    }
    await $.command.register({ name: 'desk', description: 'Open the digitaldias.com pane' })
    void $.ui.open({ id: PANE, title: TITLE })
    $.clock.every(NETWORK_EVERY_MS, () => void refresh($, true))
    void refresh($, true)

    return started
  })

  on('command.run', { command: 'desk' }, async $ => {
    await $.ui.open({ id: PANE, title: TITLE })
    void refresh($, true)

    return { text: 'Panelet for digitaldias.com er åpnet.' }
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (isHome) {
      $.clock.after(0, () => void refresh($, false))
    }

    return result
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const ui = $.ui.resolve(e)
    const { Box, Text, Button } = ui
    const Svg = 'Svg' in ui ? ui.Svg : null
    const snap = await read($, snapshot)
    const check = await read($, checkRun)
    const isBusy = await read($, busy)
    if (!snap) {
      return <Text dimColor>Leser repoet …</Text>
    }
    const nowMs = await $.clock.now()
    const { now, latest, deploy, traffic } = snap
    const isDeployOk = deploy?.conclusion === 'success'
    const weekViews = traffic?.days.reduce((sum, one) => sum + one.pageViews, 0) ?? 0
    const weekReaders = traffic?.days.reduce((sum, one) => sum + one.readers, 0) ?? 0
    const today = traffic?.days.at(-1)
    const openSteps = snap.drafts.reduce((sum, draft) => sum + draft.checks.filter(one => !one.isDone).length, 0)

    const kicker = (text: string) => (
      <Text size="caption" weight="semibold" color={SEA.teal}>
        {text.toUpperCase()}
      </Text>
    )
    const tile = (key: string, label: string, value: string, note: string, color?: string) => (
      <Box key={key} flexDirection="column" flexGrow={1} minWidth={130} padding="sm" borderStyle="round" borderColor="subtle">
        <Text size="caption" dimColor>
          {label}
        </Text>
        <Text size="title" weight="semibold" tabular color={color}>
          {value}
        </Text>
        <Text size="footnote" dimColor>
          {note}
        </Text>
      </Box>
    )

    return (
      <Box flexDirection="column" gap="md" paddingX="xs">
        <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end">
          <Box flexDirection="column">
            <Text size="title" weight="bold">
              digitaldias<Text size="title" weight="bold" color={SEA.teal}>.com</Text>
            </Text>
            <Text size="caption" mono dimColor>
              {isBusy ? 'Redaksjonen henter tall …' : `Redaksjonen, lest ${clockTime(snap.takenAt)}`}
            </Text>
          </Box>
          <Button key="refresh" label={isBusy ? 'Henter …' : 'Les på nytt'} dimColor={isBusy} onPress={() => void readAgain($)} />
        </Box>

        <Box flexDirection="row" flexWrap="wrap" gap="sm">
          <Button key="new-post" label="Ny post" variant="primary" onPress={ask($, PROMPTS.newPost)} />
          <Button key="now" label="Oppdater Now" onPress={ask($, PROMPTS.now)} />
          <Button key="check" label={check?.isRunning ? 'Bygger …' : 'just check'} onPress={() => runCheck($)} />
        </Box>

        {snap.ahead > 0 && (
          <Box flexDirection="column" gap="xs" padding="sm" borderStyle="round" borderColor="warning">
            <Text color="warning" weight="semibold">
              main ligger {snap.ahead} commit foran origin/main
            </Text>
            <Text size="footnote" dimColor>
              Briefingen publiserer ikke i natt før det er pushet.
            </Text>
            <Button key="unpushed" label="Vis upushede" onPress={ask($, PROMPTS.unpushed)} />
          </Box>
        )}

        {check && !check.isRunning && (
          <Box
            flexDirection="column"
            gap="xs"
            padding="sm"
            borderStyle="round"
            borderColor={check.exitCode === 0 ? 'success' : 'error'}
          >
            <Text weight="semibold" color={check.exitCode === 0 ? 'success' : 'error'}>
              {check.exitCode === 0 ? 'just check: bygget er rent' : `just check feilet (kode ${check.exitCode})`}
            </Text>
            {check.exitCode !== 0 && (
              <Text mono size="footnote" dimColor>
                {check.tail}
              </Text>
            )}
            {check.exitCode !== 0 && (
              <Button key="fix-check" label="Fiks feilen" onPress={ask($, PROMPTS.fixCheck(check.tail))} />
            )}
          </Box>
        )}

        <Box flexDirection="row" flexWrap="wrap" gap="sm">
          {tile('readers', 'Lesere, 7 d', traffic ? thousands(weekReaders) : '–', traffic ? `${thousands(traffic.visits)} besøk, ${thousands(today?.readers ?? 0)} sider i dag` : snap.trafficNote || 'ingen tall', SEA.teal)}
          {tile('views', 'Sider servert, 7 d', traffic ? thousands(weekViews) : '–', today ? `${thousands(today.pageViews)} i dag hittil` : snap.trafficNote || 'ingen tall')}
          {tile('bots', 'AI-boter, 24 t', traffic ? thousands(traffic.botTotal) : '–', traffic?.bots[0] ? `flest fra ${traffic.bots[0].name}` : 'ingen tall')}
          {tile(
            'google',
            'Google-klikk, 28 d',
            snap.search ? thousands(snap.search.clicks) : '–',
            snap.search
              ? `${thousands(snap.search.impressions)} visninger, snittplass ${snap.search.position.toFixed(1)}`
              : snap.searchNote || 'ingen tall',
          )}
          {tile('drafts', 'Utkast', String(snap.drafts.length), snap.drafts.length ? `${openSteps} steg gjenstår` : 'ingenting på blokka')}
          {tile(
            'deploy',
            'Deploy',
            deploy ? (isDeployOk ? 'OK' : deploy.conclusion || deploy.status) : '–',
            deploy ? relativeTime(Date.parse(deploy.createdAt), nowMs) : 'gh svarte ikke',
            deploy ? (isDeployOk ? 'success' : 'error') : undefined,
          )}
        </Box>

        {traffic && (
          <Box flexDirection="column" gap="xs">
            {kicker('Trafikk siste uke')}
            {Svg ? (
              <Svg
                source={barChartSvg(traffic.days)}
                alt={`Sider per dag (lesere, AI-boter, andre): ${traffic.days.map(day => `${day.date} ${trafficParts(day).join('/')}`).join(', ')}`}
              />
            ) : (
              <Box flexDirection="column">
                <Text mono color={SEA.teal}>
                  {sparkline(traffic.days.map(day => day.readers))} lesere
                </Text>
                <Text mono dimColor>
                  {sparkline(traffic.days.map(day => day.pageViews))} alle sider
                </Text>
              </Box>
            )}
            <Text size="footnote" dimColor>
              Lesere er nettlesere som kjørte Cloudflare Web Analytics. AI-boter kjennes igjen på user agent. Resten er andre boter og nettlesere uten JavaScript. Stiplet søyle er i dag.
            </Text>
          </Box>
        )}

        {traffic && traffic.bots.length > 0 && (
          <Box flexDirection="column" gap="xs">
            {kicker('AI-boter siste døgn')}
            {Svg ? (
              <Svg
                source={botBarsSvg(traffic.bots.slice(0, 6))}
                alt={traffic.bots.slice(0, 6).map(bot => `${bot.name} ${bot.count}`).join(', ')}
              />
            ) : (
              <Text dimColor>{traffic.bots.slice(0, 6).map(bot => `${bot.name} ${bot.count}`).join(', ')}</Text>
            )}
          </Box>
        )}

        {snap.search && snap.search.queries.length > 0 && (
          <Box flexDirection="column" gap="xs">
            {kicker('Søkeord på Google')}
            {snap.search.queries.map(row => (
              <Box key={`q-${row.query}`} flexDirection="row" justifyContent="space-between" gap="sm">
                <Box flexShrink={1}>
                  <Text size="footnote">{row.query}</Text>
                </Box>
                <Text size="footnote" mono dimColor>
                  {row.clicks} klikk · {thousands(row.impressions)} visn.
                </Text>
              </Box>
            ))}
            <Text size="caption" dimColor>
              {snap.search.start} til {snap.search.end}. Google ligger to–tre dager etter.
            </Text>
          </Box>
        )}

        <Box flexDirection="column" gap="sm">
          {kicker('Utkast')}
          {snap.drafts.length === 0 && <Text dimColor>Ingen utkast nå. Neste idé starter med «Ny post».</Text>}
          {snap.drafts.map(draft => {
            const missing = draft.checks.filter(one => !one.isDone).map(one => one.label)
            const done = draft.checks.length - missing.length

            return (
              <Box key={`draft-${draft.file}`} flexDirection="column" gap="xs" padding="sm" borderStyle="round" borderColor="subtle">
                <Box flexDirection="row" justifyContent="space-between">
                  <Text weight="semibold">{draft.title}</Text>
                  <Text mono size="footnote" color={SEA.teal}>
                    {done}/{draft.checks.length}
                  </Text>
                </Box>
                {Svg && <Svg source={progressSvg(draft.checks)} alt={`${done} av ${draft.checks.length} steg ferdig`} />}
                <Text size="footnote" dimColor>
                  {missing.length ? `Mangler: ${missing.join(', ')}` : 'Alle sjekker er grønne'}
                </Text>
                <Box flexDirection="row" gap="sm">
                  <Button key={`resume-${draft.file}`} label="Fortsett" variant="primary" onPress={ask($, PROMPTS.resume(draft.file, missing))} />
                  <Button key={`fact-${draft.file}`} label="Faktasjekk og SEO" onPress={ask($, PROMPTS.factCheck(draft.file))} />
                </Box>
              </Box>
            )
          })}
        </Box>

        {latest && (
          <Box flexDirection="column" gap="xs">
            {kicker('Sist publisert')}
            <Text weight="semibold">{latest.title}</Text>
            <Text size="footnote" mono dimColor>
              {latest.date} · {latest.hn ? `HN ${latest.hn.points} poeng, ${latest.hn.comments} kommentarer` : 'ikke på Hacker News'}
            </Text>
            <Box flexDirection="row" gap="sm">
              <Button key="promote" label="Promoter" onPress={ask($, PROMPTS.promote(latest.file))} />
              <Button key="stats" label="Statistikk" onPress={ask($, PROMPTS.stats(latest.file))} />
            </Box>
          </Box>
        )}

        <Box flexDirection="column" gap="xs">
          {kicker('Now')}
          {[
            ['Building', now.building],
            ['Tinkering', now.tinkering],
            ['Annoyed by', now.annoyedBy],
            ['Listening', `${now.listening} (${now.listeningDate})`],
          ].map(([label, value]) => (
            <Box key={`now-${label}`} flexDirection="row" gap="sm">
              <Box width={88}>
                <Text size="footnote" dimColor>
                  {label}
                </Text>
              </Box>
              <Box flexShrink={1}>
                <Text size="footnote">{value}</Text>
              </Box>
            </Box>
          ))}
        </Box>

        <Text size="caption" mono dimColor>
          {snap.branch || 'ukjent gren'} · {snap.changed} endrede filer
        </Text>
      </Box>
    )
  })
}
