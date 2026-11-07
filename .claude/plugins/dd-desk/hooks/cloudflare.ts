import type { EngineInterface } from 'claude-code'

import type { BotCount, Day, Funnel, PathCount, PostTraffic, Traffic } from '../types'

import { unquote } from './content'

type Host = EngineInterface

const DAY_MS = 86_400_000
const HOSTS = '["www.digitaldias.com", "digitaldias.com"]'

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

// Agents that fetch a page because a person asked an AI assistant something just now.
const LIVE_FETCHERS = new Set(['ChatGPT-User', 'Claude-User', 'Perplexity-User', 'DuckAssistBot', 'MistralAI-User'])

const AI_REFERRERS = ['chatgpt.com', 'chat.openai.com', 'claude.ai', 'perplexity.ai', 'copilot.microsoft.com', 'gemini.google.com', 'chat.mistral.ai']

export function aiBotName(userAgent: string): string | undefined {
  return AI_BOTS.find(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))
}

function tally(entries: [string, number][]): BotCount[] {
  const totals = new Map<string, number>()
  for (const [name, count] of entries) {
    totals.set(name, (totals.get(name) ?? 0) + count)
  }

  return [...totals].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

export function countBots(rows: { count: number; userAgent: string }[]): BotCount[] {
  return tally(rows.flatMap(({ count, userAgent }) => {
    const name = aiBotName(userAgent)

    return name ? [[name, count] as [string, number]] : []
  }))
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

export function funnel(served: { count: number; userAgent: string }[], referrers: { count: number; host: string }[]): Funnel {
  const bots = countBots(served)
  const liveBy = bots.filter(bot => LIVE_FETCHERS.has(bot.name))
  const fromAi = tally(
    referrers
      .filter(row => AI_REFERRERS.some(host => row.host === host || row.host.endsWith(`.${host}`)))
      .map(row => [row.host.replace(/^www\./, ''), row.count]),
  )
  const sum = (list: BotCount[]) => list.reduce((total, one) => total + one.count, 0)

  return {
    crawled: sum(bots) - sum(liveBy),
    live: sum(liveBy),
    referred: sum(fromAi),
    liveBy,
    referrers: fromAi,
  }
}

const CONTENT_PATH = /^\/(blog|nb|tags|categories|about|recipes|briefing|listening|supporters|log|photos)(\/|$)|\.md$|^\/llms\.txt$/
const PROBE_PATH = /\.\.|%7B|\{|\.php|wp-|\.env/i

// 404s on paths that look like the site's own pages; scanners probing for secrets and WordPress are left out.
export function brokenLinks(missing: { count: number; path: string }[]): PathCount[] {
  return missing
    .filter(row => CONTENT_PATH.test(row.path) && !PROBE_PATH.test(row.path))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

// The week's 404s include paths published since; keep only those that still answer 404. The Cache Rule never caches a 404.
async function stillMissing($: Host, paths: PathCount[]): Promise<PathCount[]> {
  const answers = await Promise.all(
    paths.map(one =>
      $.http
        .fetch(`https://www.digitaldias.com${one.path}`, { method: 'HEAD' })
        .then(response => response.status)
        .catch(() => 0),
    ),
  )

  return paths.filter((_, index) => answers[index] === 404)
}

export function postPaths(base: string): string[] {
  return [`/blog/${base}/`, `/nb/blog/${base}/`, `/blog/${base}/index.md`, `/nb/blog/${base}/index.md`]
}

export function perPost(
  bases: string[],
  dates: string[],
  hits: { count: number; path: string; userAgent: string }[],
  readerPaths: { count: number; path: string; date: string }[],
): Record<string, PostTraffic> {
  const result: Record<string, PostTraffic> = {}
  for (const base of bases) {
    const paths = new Set(postPaths(base))
    const readerDays = dates.map(date =>
      readerPaths.filter(row => paths.has(row.path) && row.date === date).reduce((sum, row) => sum + row.count, 0),
    )
    result[base] = {
      readers: readerDays.reduce((sum, count) => sum + count, 0),
      readerDays,
      ai: hits.filter(row => paths.has(row.path) && aiBotName(row.userAgent)).reduce((sum, row) => sum + row.count, 0),
    }
  }

  return result
}

export function envValue(text: string, name: string): string {
  return unquote(new RegExp(`^\\s*${name}\\s*=(.*)$`, 'm').exec(text)?.[1] ?? '')
}

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

let zoneId = ''
let accountId = ''

async function ids($: Host, token: string): Promise<void> {
  if (zoneId) {
    return
  }
  const zones = await $.http.fetch('https://api.cloudflare.com/client/v4/zones?name=digitaldias.com', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const zone = (JSON.parse(zones.text) as { result?: { id: string; account: { id: string } }[] }).result?.[0]
  zoneId = zone?.id ?? ''
  accountId = zone?.account.id ?? ''
}

type Agent = { count: number; dimensions: { userAgent: string } }

type Answer = {
  viewer: {
    zones: {
      pages: { count: number; dimensions: { date: string; userAgent: string } }[]
      agents: Agent[]
      agentsBefore: Agent[]
      served: Agent[]
      postHits: { count: number; dimensions: { clientRequestPath: string; userAgent: string } }[]
      missing: { count: number; dimensions: { clientRequestPath: string } }[]
    }[]
    accounts: {
      readers: { count: number; sum: { visits: number }; dimensions: { date: string } }[]
      readersBefore: { count: number; sum: { visits: number }; dimensions: { date: string } }[]
      readerPaths: { count: number; dimensions: { requestPath: string; date: string } }[]
      referrers: { count: number; dimensions: { refererHost: string } }[]
    }[]
  }
}

function graphql(fortnight: string, week: string, day: string, twoDays: string, paths: string[]): string {
  const served = `requestSource: "eyeball", edgeResponseStatus: 200`
  const list = JSON.stringify(paths)

  return `{ viewer {
    zones(filter: {zoneTag: "${zoneId}"}) {
      pages: httpRequestsAdaptiveGroups(limit: 10000, filter: {date_geq: "${fortnight}", ${served}, edgeResponseContentTypeName: "html"}) { count dimensions { date userAgent } }
      agents: httpRequestsAdaptiveGroups(limit: 1000, filter: {datetime_geq: "${day}", requestSource: "eyeball"}) { count dimensions { userAgent } }
      agentsBefore: httpRequestsAdaptiveGroups(limit: 1000, filter: {datetime_geq: "${twoDays}", datetime_lt: "${day}", requestSource: "eyeball"}) { count dimensions { userAgent } }
      served: httpRequestsAdaptiveGroups(limit: 5000, filter: {date_geq: "${week}", ${served}}) { count dimensions { userAgent } }
      postHits: httpRequestsAdaptiveGroups(limit: 5000, filter: {date_geq: "${week}", ${served}, clientRequestPath_in: ${list}}) { count dimensions { clientRequestPath userAgent } }
      missing: httpRequestsAdaptiveGroups(limit: 2000, filter: {date_geq: "${week}", requestSource: "eyeball", edgeResponseStatus: 404}, orderBy: [count_DESC]) { count dimensions { clientRequestPath } }
    }
    accounts(filter: {accountTag: "${accountId}"}) {
      readers: rumPageloadEventsAdaptiveGroups(limit: 10, filter: {date_geq: "${week}", requestHost_in: ${HOSTS}}) { count sum { visits } dimensions { date } }
      readersBefore: rumPageloadEventsAdaptiveGroups(limit: 10, filter: {date_geq: "${fortnight}", date_lt: "${week}", requestHost_in: ${HOSTS}}) { count sum { visits } dimensions { date } }
      readerPaths: rumPageloadEventsAdaptiveGroups(limit: 1000, filter: {date_geq: "${week}", requestHost_in: ${HOSTS}, requestPath_in: ${list}}) { count dimensions { requestPath date } }
      referrers: rumPageloadEventsAdaptiveGroups(limit: 50, filter: {date_geq: "${week}", requestHost_in: ${HOSTS}}) { count dimensions { refererHost } }
    }
  } }`
}

// Seven days plus today for the chart and totals; the seven before them for the week-on-week change.
// Web Analytics answers an empty list, not an error, for a window longer than eight days, so its weeks are asked apart.
export async function traffic($: Host, bases: string[]): Promise<{ traffic: Traffic | null; note: string }> {
  const token = envValue(await $.fs.read('.env').catch(() => ''), 'CLOUDFLARE_API_TOKEN')
  if (!token) {
    return { traffic: null, note: 'Ingen CLOUDFLARE_API_TOKEN i .env.' }
  }
  try {
    await ids($, token)
    const now = await $.clock.now()
    const isoDate = (ms: number) => new Date(ms).toISOString().slice(0, 10)
    const isoTime = (ms: number) => `${new Date(ms).toISOString().slice(0, 19)}Z`
    const week = isoDate(now - 7 * DAY_MS)
    const fortnight = isoDate(now - 14 * DAY_MS)
    const data = (await cloudflareQuery(
      $,
      token,
      graphql(fortnight, week, isoTime(now - DAY_MS), isoTime(now - 2 * DAY_MS), bases.flatMap(postPaths)),
    )) as Answer
    const zone = data.viewer.zones[0]
    const account = data.viewer.accounts[0]
    const allDays = dailyTraffic(
      (zone?.pages ?? []).map(row => ({ count: row.count, ...row.dimensions })),
      [...(account?.readersBefore ?? []), ...(account?.readers ?? [])].map(row => ({ count: row.count, date: row.dimensions.date })),
    )
    const days = allDays.filter(one => one.date >= week)
    const before = allDays.filter(one => one.date < week)
    const agents = (rows: Agent[] | undefined) => (rows ?? []).map(row => ({ count: row.count, userAgent: row.dimensions.userAgent }))
    const bots = countBots(agents(zone?.agents))
    const total = (list: BotCount[]) => list.reduce((sum, one) => sum + one.count, 0)

    return {
      traffic: {
        days,
        visits: (account?.readers ?? []).reduce((sum, row) => sum + row.sum.visits, 0),
        previous: {
          pageViews: before.reduce((sum, one) => sum + one.pageViews, 0),
          readers: before.reduce((sum, one) => sum + one.readers, 0),
          botTotal: total(countBots(agents(zone?.agentsBefore))),
        },
        bots,
        botTotal: total(bots),
        funnel: funnel(
          agents(zone?.served),
          (account?.referrers ?? []).map(row => ({ count: row.count, host: row.dimensions.refererHost })),
        ),
        broken: await stillMissing($, brokenLinks((zone?.missing ?? []).map(row => ({ count: row.count, path: row.dimensions.clientRequestPath })))),
        perPost: perPost(
          bases,
          days.slice(-7).map(one => one.date),
          (zone?.postHits ?? []).map(row => ({ count: row.count, path: row.dimensions.clientRequestPath, userAgent: row.dimensions.userAgent })),
          (account?.readerPaths ?? []).map(row => ({ count: row.count, path: row.dimensions.requestPath, date: row.dimensions.date })),
        ),
      },
      note: '',
    }
  } catch (error) {
    return { traffic: null, note: `Cloudflare svarte ikke: ${String(error)}` }
  }
}
