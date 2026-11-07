import type { EngineInterface } from 'claude-code'

import type { Search } from '../types'

const SITE = 'sc-domain:digitaldias.com'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const DAY_MS = 86_400_000

// The hooks runtime has no RSA signing, so Node signs the JWT (scripts/gsc-assertion.mjs).
async function accessToken($: EngineInterface): Promise<string> {
  const signed = await $.process.run(['node', 'scripts/gsc-assertion.mjs', 'gsc-key.json'])
  if (signed.exitCode !== 0) {
    const lastLine = signed.stderr.trim().split(/\r?\n/).at(-1) ?? String(signed.exitCode)
    throw new Error(`node scripts/gsc-assertion.mjs: ${lastLine}`)
  }
  const assertion = signed.stdout.trim()
  const response = await $.http.fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${assertion}`,
  })
  const parsed = JSON.parse(response.text) as { access_token?: string; error_description?: string; error?: string }
  if (!parsed.access_token) {
    throw new Error(parsed.error_description ?? parsed.error ?? `token ${response.status}`)
  }

  return parsed.access_token
}

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }

async function query($: EngineInterface, token: string, body: object): Promise<Row[]> {
  const response = await $.http.fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )
  const parsed = JSON.parse(response.text) as { rows?: Row[]; error?: { message: string } }
  if (parsed.error) {
    throw new Error(parsed.error.message)
  }

  return parsed.rows ?? []
}

function isoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

// Search Console's data lags two to three days, so the window ends three days ago.
export async function searchStats($: EngineInterface): Promise<{ search: Search | null; note: string }> {
  if (!(await $.fs.exists('gsc-key.json'))) {
    return { search: null, note: 'Ingen gsc-key.json i repoet.' }
  }
  try {
    const nowMs = await $.clock.now()
    const token = await accessToken($)
    const end = isoDate(nowMs - 3 * DAY_MS)
    const start = isoDate(nowMs - 30 * DAY_MS)
    const window = { startDate: start, endDate: end }
    const [totals, before, queries, pages] = await Promise.all([
      query($, token, window),
      query($, token, { startDate: isoDate(nowMs - 58 * DAY_MS), endDate: isoDate(nowMs - 31 * DAY_MS) }),
      query($, token, { ...window, dimensions: ['query'], rowLimit: 5 }),
      query($, token, { ...window, dimensions: ['page'], rowLimit: 100 }),
    ])
    const total = totals[0]
    if (!total) {
      return { search: null, note: 'Google har ingen søkedata ennå.' }
    }

    return {
      search: {
        start,
        end,
        clicks: total.clicks,
        impressions: total.impressions,
        position: total.position,
        previous: { clicks: before[0]?.clicks ?? 0, impressions: before[0]?.impressions ?? 0 },
        queries: queries.map(row => ({ query: row.keys?.[0] ?? '', clicks: row.clicks, impressions: row.impressions })),
        pages: pages.map(row => ({ url: row.keys?.[0] ?? '', clicks: row.clicks, impressions: row.impressions })),
      },
      note: '',
    }
  } catch (error) {
    return { search: null, note: `Search Console svarte ikke: ${String(error)}` }
  }
}
