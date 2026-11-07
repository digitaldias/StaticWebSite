export type Check = { label: string; isDone: boolean }

export type Draft = { file: string; title: string; checks: Check[] }

export type Deploy = {
  title: string
  status: string
  conclusion: string
  createdAt: string
}

export type HackerNews = { points: number; comments: number; url: string }

export type DevTo = { reactions: number; comments: number; url: string }

// A published post as the repo, Hacker News and Dev.to know it.
export type Published = {
  file: string
  base: string
  title: string
  date: string
  hn: HackerNews | null
  devto: DevTo | null
}

// A published post with its numbers: readers and AI fetches over 7 days, Google impressions over 28.
export type PostRow = Published & {
  readers: number
  readerDays: number[]
  ai: number
  impressions: number
}

export type NowBox = {
  building: string
  tinkering: string
  annoyedBy: string
  listening: string
  listeningDate: string
}

// pageViews: HTML pages served (status 200) to anyone; readers: Web Analytics page loads,
// browsers that ran its script; aiBots: pages served to a known AI user agent.
export type Day = { date: string; pageViews: number; readers: number; aiBots: number }

export type BotCount = { name: string; count: number }

export type PathCount = { path: string; count: number }

// Over 7 days: what AI crawlers fetched, what AI assistants fetched live for a person's
// question, and the visits that came from an AI answer's link.
export type Funnel = {
  crawled: number
  live: number
  referred: number
  liveBy: BotCount[]
  referrers: BotCount[]
}

export type PostTraffic = { readers: number; readerDays: number[]; ai: number }

export type Traffic = {
  days: Day[]
  visits: number
  previous: { pageViews: number; readers: number; botTotal: number }
  bots: BotCount[]
  botTotal: number
  funnel: Funnel
  broken: PathCount[]
  perPost: Record<string, PostTraffic>
}

export type SearchQuery = { query: string; clicks: number; impressions: number }

export type Search = {
  start: string
  end: string
  clicks: number
  impressions: number
  position: number
  previous: { clicks: number; impressions: number }
  queries: SearchQuery[]
  pages: { url: string; clicks: number; impressions: number }[]
}

export type Snapshot = {
  takenAt: number
  branch: string
  ahead: number
  changed: number
  deploy: Deploy | null
  drafts: Draft[]
  posts: PostRow[]
  now: NowBox
  traffic: Traffic | null
  trafficNote: string
  search: Search | null
  searchNote: string
}

export type CheckRun = {
  isRunning: boolean
  exitCode: number | null
  tail: string
}

export type AgendaItem = {
  key: string
  text: string
  isUrgent: boolean
  button?: { label: string; prompt: string }
}

declare module 'claude-code' {
  interface PluginState {
    'dd-desk': {
      snapshot: Shaped<Snapshot | null>
      check: Shaped<CheckRun | null>
      busy: Shaped<boolean>
      open: Shaped<string[]>
    }
  }
}
