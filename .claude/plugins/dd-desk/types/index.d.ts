export type Check = { label: string; isDone: boolean }

export type Draft = { file: string; title: string; checks: Check[] }

export type Deploy = {
  title: string
  status: string
  conclusion: string
  createdAt: string
}

export type HackerNews = { points: number; comments: number; url: string }

export type Latest = {
  file: string
  title: string
  date: string
  hn: HackerNews | null
}

export type NowBox = {
  building: string
  tinkering: string
  annoyedBy: string
  listening: string
  listeningDate: string
}

export type Day = { date: string; pageViews: number; uniques: number }

export type BotCount = { name: string; count: number }

export type Traffic = {
  days: Day[]
  bots: BotCount[]
  botTotal: number
}

export type SearchQuery = { query: string; clicks: number; impressions: number }

export type Search = {
  start: string
  end: string
  clicks: number
  impressions: number
  position: number
  queries: SearchQuery[]
}

export type Snapshot = {
  takenAt: number
  branch: string
  ahead: number
  changed: number
  deploy: Deploy | null
  drafts: Draft[]
  latest: Latest | null
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

declare module 'claude-code' {
  interface PluginState {
    'dd-desk': {
      snapshot: Shaped<Snapshot | null>
      check: Shaped<CheckRun | null>
    }
  }
}
