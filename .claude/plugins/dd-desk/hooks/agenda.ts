import type { AgendaItem, Snapshot } from '../types'

import { PROMPTS } from './prompts'

const DAY_MS = 86_400_000
const STALE_LISTENING_DAYS = 14
const QUIET_DAYS = 14
const PROMOTE_WITHIN_DAYS = 14

function daysSince(date: string, nowMs: number): number {
  const ms = Date.parse(`${date}T00:00:00Z`)

  return Number.isNaN(ms) ? 0 : Math.floor((nowMs - ms) / DAY_MS)
}

// What the blog needs from Pedro now, most urgent first; empty when nothing waits.
export function agenda(snap: Snapshot, nowMs: number): AgendaItem[] {
  const items: AgendaItem[] = []
  if (snap.ahead > 0) {
    items.push({
      key: 'unpushed',
      text: `main ligger ${snap.ahead} commit foran origin/main. Briefingen publiserer ikke i natt før det er pushet.`,
      isUrgent: true,
      button: { label: 'Vis upushede', prompt: PROMPTS.unpushed },
    })
  }
  if (snap.deploy && snap.deploy.status === 'completed' && snap.deploy.conclusion !== 'success') {
    items.push({
      key: 'deploy',
      text: `Siste deploy endte med ${snap.deploy.conclusion}: «${snap.deploy.title}».`,
      isUrgent: true,
      button: { label: 'Finn feilen', prompt: PROMPTS.deployFailed },
    })
  }
  for (const draft of snap.drafts) {
    const missing = draft.checks.filter(one => !one.isDone).map(one => one.label)
    if (missing.length) {
      items.push({
        key: `draft-${draft.file}`,
        text: `«${draft.title}» mangler ${missing.join(', ')}.`,
        isUrgent: false,
        button: { label: 'Fortsett', prompt: PROMPTS.resume(draft.file, missing) },
      })
    }
  }
  const latest = snap.posts[0]
  // Promoted once it is on Hacker News or Dev.to: skipping one of them is Pedro's call, not a missing step.
  if (latest && daysSince(latest.date, nowMs) <= PROMOTE_WITHIN_DAYS && !latest.hn && !latest.devto) {
    items.push({
      key: 'promote',
      text: `«${latest.title}» er ikke promotert ennå, verken på Hacker News eller Dev.to.`,
      isUrgent: false,
      button: { label: 'Promoter', prompt: PROMPTS.promote(latest.file) },
    })
  }
  if (snap.traffic?.broken.length) {
    const count = snap.traffic.broken.reduce((sum, one) => sum + one.count, 0)
    items.push({
      key: 'broken',
      text: `${count} forespørsler fikk 404 på ${snap.traffic.broken.length} innholdsstier siste uke, først ${snap.traffic.broken[0]?.path}.`,
      isUrgent: false,
      button: { label: 'Se på lenkene', prompt: PROMPTS.broken(snap.traffic.broken) },
    })
  }
  const listeningAge = daysSince(snap.now.listeningDate, nowMs)
  if (snap.now.listeningDate && listeningAge > STALE_LISTENING_DAYS) {
    items.push({
      key: 'now',
      text: `Listening i Now-boksen er ${listeningAge} dager gammel.`,
      isUrgent: false,
      button: { label: 'Oppdater Now', prompt: PROMPTS.now },
    })
  }
  const quiet = latest ? daysSince(latest.date, nowMs) : 0
  if (!snap.drafts.length && quiet > QUIET_DAYS) {
    items.push({
      key: 'quiet',
      text: `Det er ${quiet} dager siden forrige innlegg, og ingen utkast ligger klare.`,
      isUrgent: false,
      button: { label: 'Ny post', prompt: PROMPTS.newPost },
    })
  }
  for (const [key, note] of [['traffic-note', snap.trafficNote], ['search-note', snap.searchNote]] as const) {
    if (note && !note.startsWith('Google har ingen')) {
      items.push({ key, text: note, isUrgent: false })
    }
  }

  return items
}

// Week-on-week change as an arrow and a whole percent; nothing when there is no earlier number.
export function delta(current: number, previous: number): string {
  if (previous <= 0) {
    return ''
  }
  const change = Math.round(((current - previous) / previous) * 100)

  return change === 0 ? '±0 %' : `${change > 0 ? '↑' : '↓'} ${Math.abs(change)} %`
}
