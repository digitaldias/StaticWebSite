import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { PostRow, Published, Search, Snapshot, Traffic } from '../types'

import { agenda, delta } from './agenda'
import { traffic as cloudflareTraffic } from './cloudflare'
import { channelLine, git, isPromoted, lastDeploy, nowBox, posts, PROMOTION_LOG, recordChannel } from './content'
import { searchStats } from './google'
import { barChartSvg, botBarsSvg, clockTime, progressSvg, relativeTime, SEA, sparkline, thousands, trafficParts } from './pane'
import { PROMPTS } from './prompts'

const PANE = 'dd-desk'
const TITLE = 'digitaldias.com'
const NETWORK_EVERY_MS = 10 * 60_000
const DAY_MS = 86_400_000
// Box widths count character cells; an Svg's width is CSS pixels. About nine pixels to a cell on desktop.
const CELL_PX = 9

type Host = EngineInterface

// Change a tag when its type changes: it declines what an earlier version stored.
const snapshot = atom({ plugin: 'dd-desk', key: 'snapshot' } as const, null, { shape: 'snapshot-5' })
const checkRun = atom({ plugin: 'dd-desk', key: 'check' } as const, null, { shape: 'check-1' })
const busy = atom({ plugin: 'dd-desk', key: 'busy' } as const, false, { shape: 'busy-1' })
const open = atom({ plugin: 'dd-desk', key: 'open' } as const, [], { shape: 'open-1' })
// Agenda items Pedro marked as handled, by key and fingerprint; kept in $.store across sessions, mirrored here so a press redraws.
const handled = atom({ plugin: 'dd-desk', key: 'handled' } as const, {}, { shape: 'handled-1' })
const HANDLED_STORE = 'handled'

// A published post with its numbers from Cloudflare (7 days) and Search Console (28 days).
export function postRows(published: Published[], traffic: Traffic | null, search: Search | null): PostRow[] {
  return published.map(post => {
    const seen = traffic?.perPost[post.base]
    const impressions = (search?.pages ?? [])
      .filter(page => page.url.includes(`/blog/${post.base}/`))
      .reduce((sum, page) => sum + page.impressions, 0)

    return { ...post, readers: seen?.readers ?? 0, readerDays: seen?.readerDays ?? [], ai: seen?.ai ?? 0, impressions }
  })
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
  const { drafts, published } = await posts($, previous, withNetwork)
  const cloudflare = withNetwork
    ? await cloudflareTraffic($, published.map(post => post.base))
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
    posts: postRows(published, cloudflare.traffic, google.search),
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

const POSTED = /^\d{4}-\d{2}-\d{2}$/

// Pedro pastes the LinkedIn text himself, so the pane asks him to say when it is up: the log gets today's date.
function markPosted($: Host, base: string): () => void {
  return () => {
    void (async () => {
      const log = await $.fs.read(PROMOTION_LOG).catch(() => '')
      const today = new Date(await $.clock.now()).toISOString().slice(0, 10)
      await $.fs.write(PROMOTION_LOG, recordChannel(log, base, 'linkedin', today))
      await refresh($, false)
    })()
  }
}

function markHandled($: Host, key: string, fingerprint: string): () => void {
  return () => {
    void (async () => {
      const next = { ...(await read($, handled)), [key]: fingerprint }
      await update($, handled, () => next)
      await $.store.set(HANDLED_STORE, next)
    })()
  }
}

function toggle($: Host, section: string): () => void {
  return () => {
    void update($, open, list => (list.includes(section) ? list.filter(one => one !== section) : [...list, section]))
  }
}

function age(date: string, nowMs: number): string {
  const days = Math.floor((nowMs - Date.parse(`${date}T00:00:00Z`)) / DAY_MS)

  return Number.isNaN(days) ? '' : days <= 0 ? 'i dag' : `${days} d`
}

// Chart and bot bars share a row when the pane is wide; otherwise each takes the full width.
function chartWidths(columns: number): { chart: number; bots: number } {
  const room = Math.max(300, columns * CELL_PX - 24)

  return room >= 960 ? { chart: 540, bots: 380 } : { chart: Math.min(room, 680), bots: Math.min(room, 480) }
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
    const remembered = (await $.store.get(HANDLED_STORE)) as Record<string, string> | undefined
    if (remembered) {
      await update($, handled, () => remembered)
    }
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
    const opened = await read($, open)
    const done = await read($, handled)
    if (!snap) {
      return <Text dimColor>Leser repoet …</Text>
    }
    const nowMs = await $.clock.now()
    const { now, deploy, traffic, search } = snap
    const todo = agenda(snap, nowMs, done)
    const widths = chartWidths(e.props.bodyColumns)
    // The seven finished days, so the week-on-week change compares like with like.
    const finished = traffic?.days.slice(0, -1) ?? []
    const today = traffic?.days.at(-1)
    const weekViews = finished.reduce((sum, one) => sum + one.pageViews, 0)
    const weekReaders = finished.reduce((sum, one) => sum + one.readers, 0)
    const bots = traffic?.bots.slice(0, 6) ?? []

    const kicker = (text: string) => (
      <Text size="caption" weight="semibold" color={SEA.teal}>
        {text.toUpperCase()}
      </Text>
    )
    const fold = (section: string, title: string) => (
      <Button key={`fold-${section}`} plain onPress={toggle($, section)}>
        <Text size="caption" weight="semibold" color={SEA.teal}>
          {opened.includes(section) ? '▾' : '▸'} {title.toUpperCase()}
        </Text>
      </Button>
    )
    const tile = (key: string, label: string, value: string, change: string, note: string, color?: string) => (
      <Box key={key} flexDirection="column" flexGrow={1} minWidth={17} paddingX="sm" paddingY="xs" borderStyle="round" borderColor="subtle">
        <Text size="caption" dimColor>
          {label}
        </Text>
        <Box flexDirection="row" gap="sm" alignItems="flex-end">
          <Text size="heading" weight="semibold" tabular color={color}>
            {value}
          </Text>
          {change && (
            <Text size="caption" mono dimColor>
              {change}
            </Text>
          )}
        </Box>
        <Text size="caption" dimColor wrap="truncate-end">
          {note}
        </Text>
      </Box>
    )
    const step = (key: string, value: number, label: string, color?: string) => (
      <Box key={key} flexDirection="column" minWidth={12}>
        <Text size="heading" weight="semibold" tabular color={color}>
          {thousands(value)}
        </Text>
        <Text size="caption" dimColor>
          {label}
        </Text>
      </Box>
    )

    return (
      <Box flexDirection="column" gap="md" paddingX="xs">
        <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap="sm">
          <Box flexDirection="column">
            <Text size="title" weight="bold">
              digitaldias<Text size="title" weight="bold" color={SEA.teal}>.com</Text>
            </Text>
            <Text size="caption" mono dimColor>
              {isBusy ? 'Redaksjonen henter tall …' : `Redaksjonen, lest ${clockTime(snap.takenAt)}`}
            </Text>
          </Box>
          <Box flexDirection="row" flexWrap="wrap" gap="sm">
            <Button key="new-post" label="Ny post" variant="primary" onPress={ask($, PROMPTS.newPost)} />
            <Button key="now" label="Oppdater Now" onPress={ask($, PROMPTS.now)} />
            <Button key="check" label={check?.isRunning ? 'Bygger …' : 'just check'} onPress={() => runCheck($)} />
            <Button key="refresh" label={isBusy ? 'Henter …' : 'Les på nytt'} dimColor={isBusy} onPress={() => void readAgain($)} />
          </Box>
        </Box>

        <Box flexDirection="column" gap="xs">
          {kicker('Til redaktøren')}
          {todo.length === 0 && (
            <Text size="footnote" color={SEA.teal}>
              Ingenting venter. God tid til å skrive.
            </Text>
          )}
          {todo.map(item => (
            <Box
              key={`todo-${item.key}`}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              gap="sm"
              paddingX="sm"
              paddingY="xs"
              borderStyle="round"
              borderColor={item.isUrgent ? 'warning' : 'subtle'}
            >
              <Box flexShrink={1}>
                <Text size="footnote" color={item.isUrgent ? 'warning' : undefined}>
                  {item.text}
                </Text>
              </Box>
              <Box flexDirection="row" gap="xs" flexShrink={0}>
                {item.button && <Button key={`do-${item.key}`} label={item.button.label} onPress={ask($, item.button.prompt)} />}
                {item.fingerprint !== undefined && (
                  <Button key={`done-${item.key}`} label="Løst" onPress={markHandled($, item.key, item.fingerprint)} />
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {check && !check.isRunning && (
          <Box flexDirection="column" gap="xs" paddingX="sm" paddingY="xs" borderStyle="round" borderColor={check.exitCode === 0 ? 'success' : 'error'}>
            <Text weight="semibold" color={check.exitCode === 0 ? 'success' : 'error'}>
              {check.exitCode === 0 ? 'just check: bygget er rent' : `just check feilet (kode ${check.exitCode})`}
            </Text>
            {check.exitCode !== 0 && (
              <Text mono size="footnote" dimColor>
                {check.tail}
              </Text>
            )}
            {check.exitCode !== 0 && <Button key="fix-check" label="Fiks feilen" onPress={ask($, PROMPTS.fixCheck(check.tail))} />}
          </Box>
        )}

        <Box flexDirection="row" flexWrap="wrap" gap="sm">
          {tile(
            'readers',
            'Lesere, 7 d',
            traffic ? thousands(weekReaders) : '–',
            traffic ? delta(weekReaders, traffic.previous.readers) : '',
            traffic ? `${thousands(traffic.visits)} besøk · ${thousands(today?.readers ?? 0)} i dag` : snap.trafficNote || 'ingen tall',
            SEA.teal,
          )}
          {tile(
            'views',
            'Sider servert, 7 d',
            traffic ? thousands(weekViews) : '–',
            traffic ? delta(weekViews, traffic.previous.pageViews) : '',
            today ? `${thousands(today.pageViews)} i dag` : 'ingen tall',
          )}
          {tile(
            'bots',
            'AI-boter, 24 t',
            traffic ? thousands(traffic.botTotal) : '–',
            traffic ? delta(traffic.botTotal, traffic.previous.botTotal) : '',
            traffic?.bots[0] ? `flest fra ${traffic.bots[0].name}` : 'ingen tall',
          )}
          {tile(
            'google',
            'Google-klikk, 28 d',
            search ? thousands(search.clicks) : '–',
            search ? delta(search.clicks, search.previous.clicks) : '',
            search ? `${thousands(search.impressions)} visn. · plass ${search.position.toFixed(1)}` : snap.searchNote || 'ingen tall',
          )}
        </Box>

        {traffic && (
          <Box flexDirection="row" flexWrap="wrap" gap="lg">
            <Box flexDirection="column" gap="xs" flexGrow={1}>
              {kicker('Trafikk siste uke')}
              {Svg ? (
                <Svg
                  source={barChartSvg(traffic.days, widths.chart)}
                  width={widths.chart}
                  isInteractive
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
              <Text size="caption" dimColor>
                Lesere kjørte Web Analytics i nettleseren. AI-boter kjennes på user agent. Grått er andre boter og nettlesere uten JavaScript. Hold over en søyle for tallene.
              </Text>
            </Box>
            {bots.length > 0 && (
              <Box flexDirection="column" gap="xs" flexGrow={1}>
                {kicker('AI-boter siste døgn')}
                {Svg ? (
                  <Svg source={botBarsSvg(bots, widths.bots)} width={widths.bots} alt={bots.map(bot => `${bot.name} ${bot.count}`).join(', ')} />
                ) : (
                  <Text dimColor>{bots.map(bot => `${bot.name} ${bot.count}`).join(', ')}</Text>
                )}
              </Box>
            )}
          </Box>
        )}

        {traffic && (
          <Box flexDirection="column" gap="xs">
            {kicker('AI-sitering, 7 d')}
            <Box flexDirection="row" flexWrap="wrap" alignItems="center" gap="md">
              {step('crawled', traffic.funnel.crawled, 'crawlet av AI-boter')}
              <Text dimColor>→</Text>
              {step('live', traffic.funnel.live, 'hentet live til et svar', SEA.teal)}
              <Text dimColor>→</Text>
              {step('referred', traffic.funnel.referred, 'klikk fra AI-svar', SEA.teal)}
            </Box>
            <Text size="caption" dimColor>
              {traffic.funnel.liveBy.length ? `Live: ${traffic.funnel.liveBy.map(bot => `${bot.name} ${bot.count}`).join(', ')}.` : 'Ingen live-hentinger siste uke.'}{' '}
              {traffic.funnel.referrers.length ? `Klikk fra ${traffic.funnel.referrers.map(one => `${one.name} ${one.count}`).join(', ')}.` : 'Klikk fra AI-svar telles av Web Analytics.'}
            </Text>
          </Box>
        )}

        {snap.posts.length > 0 && (
          <Box flexDirection="column" gap="xs">
            {kicker('Innleggene')}
            {snap.posts.map(post => (
              <Box key={`post-${post.base}`} flexDirection="row" justifyContent="space-between" alignItems="center" gap="sm">
                <Box flexDirection="column" flexShrink={1}>
                  <Text size="footnote" weight="semibold" wrap="truncate-end">
                    {post.title}
                  </Text>
                  <Text size="caption" mono dimColor wrap="truncate-end">
                    {age(post.date, nowMs)} · <Text size="caption" mono color={SEA.teal}>{sparkline(post.readerDays)} {post.readers} lesere</Text> · {post.ai} AI ·{' '}
                    {thousands(post.impressions)} visn.
                  </Text>
                  <Text size="caption" mono dimColor wrap="truncate-end">
                    {channelLine(post)}
                  </Text>
                </Box>
                <Box flexDirection="row" gap="xs" flexShrink={0}>
                  {!POSTED.test(post.promoted.linkedin ?? '') && <Button key={`posted-${post.base}`} label="LinkedIn lagt ut" onPress={markPosted($, post.base)} />}
                  {!isPromoted(post) && <Button key={`promote-${post.base}`} label="Promoter" onPress={ask($, PROMPTS.promote(post.file))} />}
                  <Button key={`stats-${post.base}`} label="Statistikk" onPress={ask($, PROMPTS.stats(post.file))} />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {snap.drafts.length > 0 && (
          <Box flexDirection="column" gap="xs">
            {kicker('Utkast')}
            {snap.drafts.map(draft => {
              const missing = draft.checks.filter(one => !one.isDone).map(one => one.label)
              const done = draft.checks.length - missing.length

              return (
                <Box key={`draft-${draft.file}`} flexDirection="column" gap="xs" paddingX="sm" paddingY="xs" borderStyle="round" borderColor="subtle">
                  <Box flexDirection="row" justifyContent="space-between" gap="sm">
                    <Box flexShrink={1}>
                      <Text weight="semibold">{draft.title}</Text>
                    </Box>
                    <Text mono size="footnote" color={SEA.teal}>
                      {done}/{draft.checks.length}
                    </Text>
                  </Box>
                  {Svg && <Svg source={progressSvg(draft.checks)} width={280} alt={`${done} av ${draft.checks.length} steg ferdig`} />}
                  <Text size="footnote" dimColor>
                    {missing.length ? `Mangler: ${missing.join(', ')}` : 'Alle sjekker er grønne'}
                  </Text>
                  <Box flexDirection="row" flexWrap="wrap" gap="sm">
                    <Button key={`resume-${draft.file}`} label="Fortsett" variant="primary" onPress={ask($, PROMPTS.resume(draft.file, missing))} />
                    <Button key={`fact-${draft.file}`} label="Faktasjekk og SEO" onPress={ask($, PROMPTS.factCheck(draft.file))} />
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}

        <Box flexDirection="row" flexWrap="wrap" gap="lg">
          {search && search.queries.length > 0 && (
            <Box flexDirection="column" gap="xs" flexGrow={1} minWidth={36}>
              {fold('search', 'Søkeord på Google')}
              {opened.includes('search') &&
                search.queries.map(row => (
                  <Box key={`q-${row.query}`} flexDirection="row" justifyContent="space-between" gap="sm">
                    <Box flexShrink={1}>
                      <Text size="footnote" wrap="truncate-end">
                        {row.query}
                      </Text>
                    </Box>
                    <Text size="caption" mono dimColor>
                      {row.clicks} klikk · {thousands(row.impressions)} visn.
                    </Text>
                  </Box>
                ))}
              {opened.includes('search') && (
                <Text size="caption" dimColor>
                  {search.start} til {search.end}. Google ligger to–tre dager etter.
                </Text>
              )}
            </Box>
          )}
          <Box flexDirection="column" gap="xs" flexGrow={1} minWidth={36}>
            {fold('now', 'Now')}
            {opened.includes('now') &&
              [
                ['Building', now.building],
                ['Tinkering', now.tinkering],
                ['Annoyed by', now.annoyedBy],
                ['Listening', `${now.listening} (${now.listeningDate})`],
              ].map(([label, value]) => (
                <Box key={`now-${label}`} flexDirection="row" gap="sm">
                  <Box width={11} flexShrink={0}>
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
        </Box>

        <Text size="caption" mono dimColor>
          {deploy ? `Deploy ${deploy.conclusion === 'success' ? 'OK' : deploy.conclusion || deploy.status}, ${relativeTime(Date.parse(deploy.createdAt), nowMs)}` : 'Deploy ukjent'} · {snap.branch || 'ukjent gren'} ·{' '}
          {snap.changed} endrede filer
        </Text>
      </Box>
    )
  })
}
