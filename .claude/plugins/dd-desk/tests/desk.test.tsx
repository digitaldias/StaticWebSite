import { expect, test } from 'claude-code/testing'

import { agenda, delta } from '../hooks/agenda'
import { brokenLinks, countBots, dailyTraffic, envValue, funnel, perPost } from '../hooks/cloudflare'
import { channelLine, draftChecks, frontMatter, isPromoted, nowBox, parsePromotion, recordChannel } from '../hooks/content'
import { barChartSvg, sparkline, thousands } from '../hooks/pane'
import { postRows } from '../hooks/register'
import type { Snapshot } from '../types'

const PANE = {
  plugin: 'dd-desk',
  component: 'Pane',
  requestId: 'dd-desk',
  props: {
    title: 'digitaldias.com',
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

const POST = `---
title: "Don't write like a robot"
date: 2026-11-06
draft: true
tldr: 'Let the agents in.'
---

Opening.

## First section

## Second section

## FAQ
`

const NOW_MS = Date.parse('2026-11-07T12:00:00Z')

const SNAPSHOT: Snapshot = {
  takenAt: 0,
  branch: 'main',
  ahead: 2,
  changed: 1,
  deploy: { title: 'Publish', status: 'completed', conclusion: 'success', createdAt: '2026-11-06T07:11:37Z' },
  drafts: [
    {
      file: '2026-11-07-x.md',
      title: 'A draft',
      checks: [
        { label: 'FAQ', isDone: true },
        { label: 'Norsk', isDone: false },
      ],
    },
  ],
  posts: [
    {
      file: '2026-11-06-y.md',
      base: '2026-11-06-y',
      title: 'Latest post',
      date: '2026-11-06',
      devto: null,
      promoted: {},
      readers: 12,
      readerDays: [0, 0, 0, 0, 0, 4, 8],
      ai: 7,
      impressions: 36,
    },
  ],
  now: { building: 'Mods', tinkering: 'A holder', annoyedBy: 'Routers', listening: 'Dire Straits: Sultans Of Swing', listeningDate: '2026-10-01' },
  traffic: {
    days: [
      { date: '2026-11-05', pageViews: 519, readers: 120, aiBots: 40 },
      { date: '2026-11-06', pageViews: 1285, readers: 300, aiBots: 90 },
      { date: '2026-11-07', pageViews: 95, readers: 2, aiBots: 0 },
    ],
    visits: 310,
    previous: { pageViews: 1500, readers: 400, botTotal: 50 },
    bots: [{ name: 'GPTBot', count: 55 }],
    botTotal: 55,
    funnel: { crawled: 582, live: 15, referred: 0, liveBy: [{ name: 'ChatGPT-User', count: 6 }], referrers: [] },
    broken: [{ path: '/blog/old-post/', count: 4 }],
    perPost: {},
  },
  trafficNote: '',
  search: {
    start: '2026-10-07',
    end: '2026-11-03',
    clicks: 42,
    impressions: 3100,
    position: 18.4,
    previous: { clicks: 21, impressions: 2000 },
    queries: [{ query: 'llms.txt hugo', clicks: 7, impressions: 210 }],
    pages: [],
  },
  searchNote: '',
}

test('AI bots are summed by name from their user agents', async () => {
  const bots = countBots([
    { count: 55, userAgent: 'Mozilla/5.0 AppleWebKit/537.36; compatible; GPTBot/1.4; +https://openai.com/gptbot' },
    { count: 5, userAgent: 'Mozilla/5.0 (compatible; GPTBot/1.3)' },
    { count: 50, userAgent: 'Mozilla/5.0 (compatible; MoonshotBot/1.0; +https://kimi.ai/)' },
    { count: 700, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130' },
  ])
  expect(bots.map(bot => `${bot.name}=${bot.count}`).join(',')).toBe('GPTBot=60,MoonshotBot=50')
})

test('the token is read from .env and numbers get spaces and arrows', async () => {
  expect(envValue('FOO=1\nCLOUDFLARE_API_TOKEN=abc123\n', 'CLOUDFLARE_API_TOKEN')).toBe('abc123')
  expect(envValue('FOO=1\n', 'CLOUDFLARE_API_TOKEN')).toBe('')
  expect(thousands(3668)).toBe('3 668')
  expect(sparkline([0, 50, 100])).toBe('▁▄█')
  expect(delta(112, 100)).toBe('↑ 12 %')
  expect(delta(95, 100)).toBe('↓ 5 %')
  expect(delta(5, 0)).toBe('')
})

test('pages per day are split into readers, AI bots and the rest', async () => {
  const days = dailyTraffic(
    [
      { count: 50, date: '2026-11-06', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/130' },
      { count: 7, date: '2026-11-06', userAgent: 'Mozilla/5.0 (compatible; ClaudeBot/1.0)' },
      { count: 30, date: '2026-11-05', userAgent: 'Mozilla/5.0 (compatible; GPTBot/1.3)' },
    ],
    [{ count: 20, date: '2026-11-06' }],
  )
  expect(JSON.stringify(days)).toBe(
    JSON.stringify([
      { date: '2026-11-05', pageViews: 30, readers: 0, aiBots: 30 },
      { date: '2026-11-06', pageViews: 57, readers: 20, aiBots: 7 },
    ]),
  )
})

test('the funnel separates crawlers, live fetches and clicks from AI answers', async () => {
  const result = funnel(
    [
      { count: 300, userAgent: 'Mozilla/5.0 (compatible; Claude-SearchBot/1.0)' },
      { count: 6, userAgent: 'Mozilla/5.0 (compatible; ChatGPT-User/1.0)' },
      { count: 4, userAgent: 'Mozilla/5.0 (compatible; Claude-User/1.0)' },
      { count: 900, userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/130' },
    ],
    [
      { count: 3, host: 'chatgpt.com' },
      { count: 2, host: 'www.perplexity.ai' },
      { count: 40, host: 'www.google.com' },
    ],
  )
  expect(`${result.crawled}/${result.live}/${result.referred}`).toBe('300/10/5')
  expect(result.referrers.map(one => one.name).join(',')).toBe('chatgpt.com,perplexity.ai')
})

test('broken links keep the site’s own paths and drop scanners', async () => {
  const broken = brokenLinks([
    { count: 30, path: '/.env' },
    { count: 17, path: '/images../.env' },
    { count: 14, path: '/blog/wp-login.php' },
    { count: 2, path: '/blog/2026-11-06-x/%7B%7B%20.Permalink%20%7D%7D' },
    { count: 9, path: '/briefing/en/' },
    { count: 3, path: '/blog/old-post/' },
    { count: 1, path: '/blog/rss.xml' },
    { count: 1, path: '/blog/feed' },
  ])
  expect(broken.map(one => one.path).join(',')).toBe('/briefing/en/,/blog/old-post/')
})

test('each post gets its readers per day, AI fetches and Google impressions', async () => {
  const traffic = perPost(
    ['2026-11-06-y'],
    ['2026-11-06', '2026-11-07'],
    [
      { count: 5, path: '/blog/2026-11-06-y/', userAgent: 'ClaudeBot/1.0' },
      { count: 2, path: '/nb/blog/2026-11-06-y/index.md', userAgent: 'GPTBot/1.3' },
      { count: 9, path: '/blog/2026-11-06-y/', userAgent: 'Mozilla/5.0 Chrome/130' },
    ],
    [
      { count: 3, path: '/blog/2026-11-06-y/', date: '2026-11-06' },
      { count: 1, path: '/nb/blog/2026-11-06-y/', date: '2026-11-07' },
    ],
  )
  expect(JSON.stringify(traffic['2026-11-06-y'])).toBe(JSON.stringify({ readers: 4, readerDays: [3, 1], ai: 7 }))
  const traffic0 = SNAPSHOT.traffic
  const search0 = SNAPSHOT.search
  if (!traffic0 || !search0) {
    throw new Error('fixture')
  }
  const [row] = postRows(
    [{ file: '2026-11-06-y.md', base: '2026-11-06-y', title: 'Y', date: '2026-11-06', devto: null, promoted: {} }],
    { ...traffic0, perPost: traffic },
    { ...search0, pages: [{ url: 'https://digitaldias.com/blog/2026-11-06-y/', clicks: 0, impressions: 36 }] },
  )
  expect(`${row?.readers}/${row?.ai}/${row?.impressions}`).toBe('4/7/36')
})

test('the agenda puts the push first and covers drafts, promotion, links and Now', async () => {
  const items = agenda(SNAPSHOT, NOW_MS)
  expect(items.map(item => item.key).join(',')).toBe('unpushed,draft-2026-11-07-x.md,promote,broken,now')
  expect(items[0]?.isUrgent).toBe(true)
  expect(items.find(item => item.key === 'promote')?.text).toBe('«Latest post» er ikke promotert ennå, verken på Dev.to eller LinkedIn.')
  const traffic0 = SNAPSHOT.traffic
  if (!traffic0) {
    throw new Error('fixture')
  }
  const calm = agenda(
    { ...SNAPSHOT, ahead: 0, drafts: [], posts: [], traffic: { ...traffic0, broken: [] }, now: { ...SNAPSHOT.now, listeningDate: '2026-11-06' } },
    NOW_MS,
  )
  expect(calm.length).toBe(0)
  const latest0 = SNAPSHOT.posts[0]
  if (!latest0) {
    throw new Error('fixture')
  }
  const onDevTo = agenda({ ...SNAPSHOT, posts: [{ ...latest0, devto: { reactions: 0, comments: 0, url: 'https://dev.to/x' } }] }, NOW_MS)
  expect(onDevTo.some(item => item.key === 'promote')).toBe(false)
})

test('a handled item stays away until a new 404 changes its fingerprint', async () => {
  const fingerprint = agenda(SNAPSHOT, NOW_MS).find(item => item.key === 'broken')?.fingerprint ?? ''
  expect(fingerprint).toBe('/blog/old-post/')
  const handledNow = agenda(SNAPSHOT, NOW_MS, { broken: fingerprint })
  expect(handledNow.some(item => item.key === 'broken')).toBe(false)
  expect(handledNow.some(item => item.key === 'unpushed')).toBe(true)
  const traffic0 = SNAPSHOT.traffic
  if (!traffic0) {
    throw new Error('fixture')
  }
  const busier = agenda({ ...SNAPSHOT, traffic: { ...traffic0, broken: [{ path: '/blog/old-post/', count: 147 }] } }, NOW_MS, { broken: fingerprint })
  expect(busier.some(item => item.key === 'broken')).toBe(false)
  const newPath = agenda(
    { ...SNAPSHOT, traffic: { ...traffic0, broken: [{ path: '/blog/old-post/', count: 4 }, { path: '/blog/new-gone/', count: 1 }] } },
    NOW_MS,
    { broken: fingerprint },
  )
  expect(newPath.some(item => item.key === 'broken')).toBe(true)
})

test('the promotion log says where a post went and what counts as promoted', async () => {
  const log = parsePromotion(['# header', '2026-11-06-y:', '  devto: 2026-11-07', '  linkedin: drafted', '  gsc: 2026-11-07', '', '2026-11-05-z:', '  linkedin: 2026-11-06', ''].join('\n'))
  expect(Object.keys(log).join(',')).toBe('2026-11-06-y,2026-11-05-z')
  const latest0 = SNAPSHOT.posts[0]
  if (!latest0) {
    throw new Error('fixture')
  }
  const post = { ...latest0, promoted: log['2026-11-06-y'] ?? {} }
  expect(channelLine(post)).toBe('Dev.to publisert · LinkedIn utkast · Google bedt indeksere')
  expect(isPromoted(post)).toBe(true)
  expect(isPromoted({ ...latest0, promoted: { devto: 'skipped', linkedin: 'drafted', gsc: '2026-11-07' } })).toBe(false)
  expect(isPromoted({ ...latest0, promoted: log['2026-11-05-z'] ?? {} })).toBe(true)
  expect(channelLine(latest0)).toBe('ikke Dev.to · ikke LinkedIn · ikke Google')
})

test('recording a channel edits one post block and keeps the rest of the log', async () => {
  const log = ['# header', '2026-11-06-y:', '  devto: 2026-11-07', '  linkedin: drafted', '', '2026-11-05-z:', '  gsc: 2026-11-06', ''].join('\n')
  const posted = parsePromotion(recordChannel(log, '2026-11-06-y', 'linkedin', '2026-11-08'))
  expect(posted['2026-11-06-y']?.linkedin).toBe('2026-11-08')
  expect(posted['2026-11-06-y']?.devto).toBe('2026-11-07')
  expect(posted['2026-11-05-z']?.gsc).toBe('2026-11-06')
  expect(parsePromotion(recordChannel(log, '2026-11-05-z', 'linkedin', '2026-11-08'))['2026-11-05-z']?.linkedin).toBe('2026-11-08')
  expect(parsePromotion(recordChannel(log, '2026-11-09-new', 'devto', '2026-11-09'))['2026-11-09-new']?.devto).toBe('2026-11-09')
})

test('the traffic chart stacks three colours per day and outlines today', async () => {
  const svg = barChartSvg([
    { date: '2026-11-05', pageViews: 519, readers: 120, aiBots: 40 },
    { date: '2026-11-06', pageViews: 285, readers: 0, aiBots: 85 },
  ])
  expect(svg).toContain('>Lesere<')
  expect(svg).toContain('>AI-boter<')
  expect((svg.match(/fill-opacity="0.5"/g) ?? []).length).toBe(2)
  expect(svg).toContain('stroke-dasharray="3 2"')
  expect(svg).toContain('<title>to 2026-11-05: 519 sider, 120 lesere, 40 AI-boter, 359 andre</title>')
})

test('front matter fields are read and unquoted', async () => {
  const fields = frontMatter(POST)
  expect(fields.title).toBe("Don't write like a robot")
  expect(fields.draft).toBe('true')
  expect(fields.tldr).toBe('Let the agents in.')
})

test('draft checks count sections without the FAQ', async () => {
  const checks = draftChecks(POST, frontMatter(POST), { hasNb: false, hasCover: true, isScored: false })
  const done = checks.filter(one => one.isDone).map(one => one.label)
  expect(done.join(',')).toBe('2+ seksjoner,TL;DR,FAQ,Cover')
})

test('the Now box reads hugo.toml and the newest listening pick', async () => {
  const toml = `[params]\n  [params.currently]\n    building   = "Mods"\n    tinkering  = "A holder"\n    annoyed_by = "Routers"\n\n  [params.photo]\n`
  const listening = `# history\n- date: 2026-11-06\n  artist: Dire Straits\n  song: Sultans Of Swing\n- date: 2026-11-05\n  artist: Simon Phillips\n`
  const now = nowBox(toml, listening)
  expect(now.building).toBe('Mods')
  expect(now.annoyedBy).toBe('Routers')
  expect(now.listening).toBe('Dire Straits: Sultans Of Swing')
  expect(now.listeningDate).toBe('2026-11-06')
})

test('the pane waits for its first reading', async $ => {
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect((await ui.find({ type: 'Text' }))?.text).toBe('Leser repoet …')
  await ui.unmount()
})

test('the pane draws the agenda, the funnel, the posts and the buttons', async ($, on) => {
  on('state.get', (_, e) => ({
    value:
      e.key === 'snapshot'
        ? { value: { shape: 'snapshot-5', value: SNAPSHOT }, version: 1 }
        : e.key === 'busy'
          ? { value: { shape: 'busy-1', value: true }, version: 1 }
          : { value: undefined, version: 0 },
  }))
  on('clock.now', () => ({ value: NOW_MS }))
  on('state.set', () => ({ value: { isSet: true, version: 2 } }))
  const stored: unknown[] = []
  on('store.set', (_, e) => {
    stored.push(e.value)

    return { value: undefined }
  })
  const prompts: string[] = []
  on('prompt.submit', (_, e) => {
    prompts.push(e.text)

    return { text: e.text }
  })

  for (const surface of ['desktop', 'terminal'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect((await ui.find({ type: 'Text', text: /commit foran/ }))?.text).toContain('Briefingen publiserer ikke')
    expect((await ui.find({ type: 'Text', text: /henter tall/ }))?.text).toBe('Redaksjonen henter tall …')
    expect((await ui.find({ type: 'Text', text: /besøk/ }))?.text).toBe('310 besøk · 2 i dag')
    expect((await ui.find({ type: 'Text', text: /hentet live/ }))?.text).toBe('hentet live til et svar')
    expect((await ui.find({ type: 'Text', text: /Live: / }))?.text).toContain('ChatGPT-User 6')
    expect((await ui.find({ type: 'Text', text: /^Latest post$/ }))?.text).toBe('Latest post')
    expect((await ui.find({ type: 'Text', text: /12 lesere/ }))?.text).toBe('1 d · ▁▁▁▁▁▄█ 12 lesere · 7 AI · 36 visn.')
    expect((await ui.find({ type: 'Text', text: /ikke LinkedIn/ }))?.text).toBe('ikke Dev.to · ikke LinkedIn · ikke Google')
    expect((await ui.find({ type: 'Text', text: /Mangler/ }))?.text).toBe('Mangler: Norsk')
    expect(await ui.find({ type: 'Text', text: /Sultans Of Swing/ })).toBe(undefined)
    expect(await ui.find({ type: 'Button', key: 'done-unpushed' })).toBe(undefined)
    expect(await ui.find({ type: 'Button', key: 'posted-2026-11-06-y' })).not.toBe(undefined)
    await ui.press({ key: 'do-draft-2026-11-07-x.md' })
    await ui.press({ key: 'done-broken' })
    await ui.unmount()
  }
  expect(JSON.stringify(stored.at(-1))).toBe(JSON.stringify({ broken: '/blog/old-post/' }))
  expect(prompts.length).toBe(2)
  expect(prompts[0]).toContain('src/content/blog/2026-11-07-x.md')
  expect(prompts[0]).toContain('mangler: Norsk')
})
