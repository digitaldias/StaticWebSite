import type { BotCount, Check, Day } from '../types'

// Sea Glass, digitaldias.com's palette, in mid tones that read on a light and a dark pane alike.
export const SEA = {
  teal: '#3fa9a8',
  tealDeep: '#0b5d63',
  glass: '#5fc3c2',
  track: '#8a9b9933',
  muted: '#8a9b99',
  pale: '#a9d3cf',
  other: '#8a9b9966',
}

// The traffic chart's three groups, bottom to top: the readers first, they matter most.
// Sea Glass has one accent, so the groups differ in lightness: full teal, pale teal, grey.
export const TRAFFIC_GROUPS = [
  { name: 'Lesere', color: SEA.teal },
  { name: 'AI-boter', color: SEA.pale },
  { name: 'Andre boter og ukjente', color: SEA.other },
] as const

export function trafficParts(day: Day): [number, number, number] {
  return [day.readers, day.aiBots, Math.max(0, day.pageViews - day.readers - day.aiBots)]
}

const FONT = 'font-family="Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"'

const BARS = '▁▂▃▄▅▆▇█'

export function sparkline(values: number[]): string {
  const top = Math.max(1, ...values)

  return values.map(value => BARS[Math.min(7, Math.floor((value / top) * 7.999))]).join('')
}

export function thousands(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const WEEKDAYS = ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø']

export function weekday(date: string): string {
  return WEEKDAYS[new Date(`${date}T12:00:00Z`).getUTCDay()] ?? ''
}

export function relativeTime(fromMs: number, nowMs: number): string {
  const minutes = Math.max(0, Math.round((nowMs - fromMs) / 60_000))
  if (minutes < 60) {
    return `${minutes} min siden`
  }
  const hours = Math.round(minutes / 60)

  return hours < 48 ? `${hours} t siden` : `${Math.round(hours / 24)} d siden`
}

export function clockTime(ms: number): string {
  return new Date(ms).toTimeString().slice(0, 5)
}

function escape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Pages per day as stacked columns: readers, AI bots, the rest. Today is still running, so it is drawn faded and outlined.
export function barChartSvg(days: Day[]): string {
  const width = 320
  const height = 140
  const base = 116
  const room = 70
  const step = width / Math.max(1, days.length)
  const bar = Math.min(28, step * 0.56)
  const top = Math.max(1, ...days.map(day => day.pageViews))
  let legendX = 0
  const legend = TRAFFIC_GROUPS.map(group => {
    const x = legendX
    legendX += 22 + group.name.length * 6.2

    return `<rect x="${x}" y="2" width="9" height="9" rx="2" fill="${group.color}"/><text x="${x + 13}" y="10" font-size="10" fill="${SEA.muted}" ${FONT}>${escape(group.name)}</text>`
  }).join('')
  const columns = days
    .map((day, index) => {
      const x = index * step + (step - bar) / 2
      const total = Math.max(2, (day.pageViews / top) * room)
      const isToday = index === days.length - 1
      let y = base
      const segments = trafficParts(day)
        .map((part, group) => {
          const tall = (part / Math.max(1, day.pageViews)) * total
          y -= tall

          return tall > 0
            ? `<rect x="${x}" y="${y}" width="${bar}" height="${tall}" fill="${TRAFFIC_GROUPS[group]?.color}"${isToday ? ' fill-opacity="0.5"' : ''}/>`
            : ''
        })
        .join('')
      const outline = isToday
        ? `<rect x="${x}" y="${base - total}" width="${bar}" height="${total}" fill="none" stroke="${SEA.teal}" stroke-width="1.5" stroke-dasharray="3 2"/>`
        : ''

      return [
        segments,
        outline,
        `<text x="${x + bar / 2}" y="${base - total - 6}" text-anchor="middle" font-size="10" fill="${SEA.muted}" ${FONT}>${day.pageViews}</text>`,
        `<text x="${x + bar / 2}" y="${base + 16}" text-anchor="middle" font-size="10" fill="${SEA.muted}" ${FONT}>${weekday(day.date)}</text>`,
      ].join('')
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${legend}<line x1="0" y1="${base + 0.5}" x2="${width}" y2="${base + 0.5}" stroke="${SEA.track}"/>${columns}</svg>`
}

// The busiest AI bots as horizontal bars against the busiest one.
export function botBarsSvg(bots: BotCount[]): string {
  const width = 320
  const row = 22
  const label = 118
  const room = width - label - 44
  const top = Math.max(1, ...bots.map(bot => bot.count))
  const rows = bots
    .map((bot, index) => {
      const y = index * row
      const long = Math.max(2, (bot.count / top) * room)

      return [
        `<text x="0" y="${y + 14}" font-size="11" fill="${SEA.muted}" ${FONT}>${escape(bot.name)}</text>`,
        `<rect x="${label}" y="${y + 5}" width="${room}" height="10" rx="5" fill="${SEA.track}"/>`,
        `<rect x="${label}" y="${y + 5}" width="${long}" height="10" rx="5" fill="${index === 0 ? SEA.teal : SEA.glass}"/>`,
        `<text x="${width}" y="${y + 14}" text-anchor="end" font-size="11" fill="${SEA.muted}" ${FONT}>${bot.count}</text>`,
      ].join('')
    })
    .join('')
  const height = Math.max(row, bots.length * row)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rows}</svg>`
}

// One segment per workflow check, filled when it is done.
export function progressSvg(checks: Check[]): string {
  const width = 320
  const gap = 4
  const segment = (width - gap * (checks.length - 1)) / Math.max(1, checks.length)
  const parts = checks
    .map(
      (check, index) =>
        `<rect x="${index * (segment + gap)}" y="0" width="${segment}" height="6" rx="3" fill="${check.isDone ? SEA.teal : SEA.track}"/>`,
    )
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="6" viewBox="0 0 ${width} 6">${parts}</svg>`
}
