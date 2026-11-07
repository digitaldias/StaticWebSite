import { expect, test } from 'claude-code/testing'

import { barChartSvg, sparkline, thousands } from '../hooks/pane'
import { countBots, dailyTraffic, draftChecks, envValue, frontMatter, nowBox } from '../hooks/register'
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
  latest: { file: '2026-11-06-y.md', title: 'Latest post', date: '2026-11-06', hn: null },
  now: { building: 'Mods', tinkering: 'A holder', annoyedBy: 'Routers', listening: 'Dire Straits: Sultans Of Swing', listeningDate: '2026-11-06' },
  traffic: {
    days: [
      { date: '2026-11-05', pageViews: 519, readers: 120, aiBots: 40 },
      { date: '2026-11-06', pageViews: 1285, readers: 300, aiBots: 90 },
    ],
    visits: 310,
    bots: [{ name: 'GPTBot', count: 55 }],
    botTotal: 55,
  },
  trafficNote: '',
  search: {
    start: '2026-10-07',
    end: '2026-11-03',
    clicks: 42,
    impressions: 3100,
    position: 18.4,
    queries: [{ query: 'llms.txt hugo', clicks: 7, impressions: 210 }],
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

test('the token is read from .env and numbers get spaces', async () => {
  expect(envValue('FOO=1\nCLOUDFLARE_API_TOKEN=abc123\n', 'CLOUDFLARE_API_TOKEN')).toBe('abc123')
  expect(envValue('FOO=1\n', 'CLOUDFLARE_API_TOKEN')).toBe('')
  expect(thousands(3668)).toBe('3 668')
  expect(sparkline([0, 50, 100])).toBe('▁▄█')
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

test('the traffic chart stacks three colours per day and outlines today', async () => {
  const svg = barChartSvg([
    { date: '2026-11-05', pageViews: 519, readers: 120, aiBots: 40 },
    { date: '2026-11-06', pageViews: 285, readers: 0, aiBots: 85 },
  ])
  expect(svg).toContain('>Lesere<')
  expect(svg).toContain('>AI-boter<')
  expect((svg.match(/fill-opacity="0.5"/g) ?? []).length).toBe(2)
  expect(svg).toContain('stroke-dasharray="3 2"')
  expect(svg).toContain('>to<')
  expect(svg).toContain('>fr<')
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

test('the pane draws drafts, the push warning and the buttons', async ($, on) => {
  on('state.get', (_, e) => ({
    value:
      e.key === 'snapshot'
        ? { value: { shape: 'snapshot-4', value: SNAPSHOT }, version: 1 }
        : e.key === 'busy'
          ? { value: { shape: 'busy-1', value: true }, version: 1 }
          : { value: undefined, version: 0 },
  }))
  on('clock.now', () => ({ value: Date.parse('2026-11-06T12:00:00Z') }))
  const prompts: string[] = []
  on('prompt.submit', (_, e) => {
    prompts.push(e.text)

    return { text: e.text }
  })

  for (const surface of ['desktop', 'terminal'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect((await ui.find({ type: 'Text', text: /2 commit foran/ }))?.text).toContain('origin/main')
    expect((await ui.find({ type: 'Text', text: /A draft/ }))?.text).toBe('A draft')
    expect((await ui.find({ type: 'Text', text: /Sultans Of Swing/ }))?.text).toContain('2026-11-06')
    expect((await ui.find({ type: 'Text', text: /flest fra/ }))?.text).toBe('flest fra GPTBot')
    expect((await ui.find({ type: 'Text', text: /besøk/ }))?.text).toBe('310 besøk · 300 i dag')
    expect((await ui.find({ type: 'Text', text: /henter tall/ }))?.text).toBe('Redaksjonen henter tall …')
    expect((await ui.find({ type: 'Text', text: /Mangler/ }))?.text).toBe('Mangler: Norsk')
    expect((await ui.find({ type: 'Text', text: /plass 18/ }))?.text).toBe('3 100 visn. · plass 18.4')
    expect((await ui.find({ type: 'Text', text: /llms.txt hugo/ }))?.text).toBe('llms.txt hugo')
    await ui.press({ key: 'resume-2026-11-07-x.md' })
    await ui.unmount()
  }
  expect(prompts.length).toBe(2)
  expect(prompts[0]).toContain('src/content/blog/2026-11-07-x.md')
  expect(prompts[0]).toContain('mangler: Norsk')
})
