/**
 * digitaldias.com — main.js
 * The Sea Glass edition.
 * Clean ES6+, no dependencies, respects prefers-reduced-motion.
 */

'use strict';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   Smooth scroll for in-page anchors
   Handles href="#id" links only; leaves
   cross-page navigation alone.
───────────────────────────────────────────── */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  });
}

const WORDS_PER_MINUTE = 230;
const READING_LINE = 0.3; // Fraction of the viewport where the eye sits while reading

const countWords = text => (text.trim().match(/\S+/g) || []).length;

const formatMinutes = minutes => {
  const m = Math.ceil(minutes);
  return m <= 0 ? 'Arrived' : `${m} min`;
};

/* ─────────────────────────────────────────────
   Reading log
   Per-browser memory of how far into each
   article the reader got. Storage can be blocked
   (private mode), so every access is guarded.
───────────────────────────────────────────── */
const READING_LOG_KEY = 'dd-reading-log';
const READING_LOG_LIMIT = 100;

function readReadingLog() {
  try {
    return JSON.parse(localStorage.getItem(READING_LOG_KEY)) || {};
  } catch {
    return {};
  }
}

function writeReadingLog(log) {
  const entries = Object.entries(log)
    .sort((a, b) => b[1].t - a[1].t)
    .slice(0, READING_LOG_LIMIT);
  try {
    localStorage.setItem(READING_LOG_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* Storage unavailable: the site works the same, it just forgets */
  }
}

/* ─────────────────────────────────────────────
   The Chart
   Plots the article's h2 sections as waypoints
   on a route, weighted by word count. Marks where
   the reader is and the minutes left, overall and
   per section. A rail in the margin on wide
   screens; a sticky course strip below that.
   Emits `chart:progress` for the reading log.
───────────────────────────────────────────── */
function buildSections(content) {
  if (!content.id) content.id = 'article-text';
  const sections = [{ id: content.id, title: 'Opening', anchor: content, words: 0 }];

  Array.from(content.children).forEach(el => {
    if (el.tagName === 'H2' && el.id) {
      sections.push({ id: el.id, title: el.textContent.trim(), anchor: el, words: 0 });
    } else {
      sections[sections.length - 1].words += countWords(el.textContent);
    }
  });

  // An article that opens straight into its first h2 has no Opening leg
  if (sections.length > 1 && sections[0].words < 40) {
    sections[1].words += sections[0].words;
    sections.shift();
  }
  return sections;
}

function initChart() {
  const chart = document.querySelector('.chart');
  const content = document.querySelector('.post-content');
  if (!chart || !content) return;

  const sections = buildSections(content);
  if (sections.length < 3) return;

  const totalWords = sections.reduce((sum, s) => sum + s.words, 0);
  const minutesFor = words => words / WORDS_PER_MINUTE;

  chart.innerHTML = `
    <p class="chart__label">The course</p>
    <button type="button" class="chart__strip" aria-expanded="false" aria-controls="chart-route">
      <span class="chart__leg"></span>
      <span class="chart__here"></span>
      <span class="chart__eta"></span>
    </button>
    <div class="chart__track" aria-hidden="true">
      ${sections.map(s => `<span class="chart__seg" style="flex-grow:${Math.max(s.words, 1)}"><span class="chart__fill"></span></span>`).join('')}
    </div>
    <ol class="chart__route" id="chart-route">
      ${sections.map(s => `
        <li class="chart__waypoint">
          <a href="#${s.id}">
            <span class="chart__name">${s.title.replace(/</g, '&lt;')}</span>
            <span class="chart__mins">${formatMinutes(minutesFor(s.words))}</span>
          </a>
        </li>`).join('')}
    </ol>
    <p class="chart__arrival"><span class="chart__arrival-label">Arrival in</span> <span class="chart__arrival-value"></span></p>
  `;
  chart.hidden = false;

  const strip = chart.querySelector('.chart__strip');
  const leg = chart.querySelector('.chart__leg');
  const here = chart.querySelector('.chart__here');
  const eta = chart.querySelector('.chart__eta');
  const arrival = chart.querySelector('.chart__arrival-value');
  const fills = chart.querySelectorAll('.chart__fill');
  const waypoints = chart.querySelectorAll('.chart__waypoint');

  const setOpen = open => {
    strip.setAttribute('aria-expanded', String(open));
    chart.classList.toggle('chart--open', open);
  };
  strip.addEventListener('click', () => setOpen(strip.getAttribute('aria-expanded') !== 'true'));
  chart.querySelectorAll('.chart__route a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Sit the strip and rail just under the sticky header
  const nav = document.querySelector('.mast');
  const placeBelowNav = () => {
    chart.style.top = `${nav ? nav.offsetHeight : 0}px`;
  };

  let lastIndex = -1;
  let ticking = false;

  const update = () => {
    ticking = false;
    // At the foot of the page every leg counts as sailed, however short the tail
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const line = atBottom ? Infinity : window.scrollY + window.innerHeight * READING_LINE;
    const contentTop = content.getBoundingClientRect().top + window.scrollY;
    const contentEnd = contentTop + content.offsetHeight;
    const tops = sections.map((s, i) =>
      i === 0 ? contentTop : s.anchor.getBoundingClientRect().top + window.scrollY
    );

    let current = 0;
    let currentLeg = 0;
    let wordsRead = 0;
    sections.forEach((s, i) => {
      const top = tops[i];
      const bottom = i + 1 < sections.length ? tops[i + 1] : contentEnd;
      const f = Math.min(1, Math.max(0, (line - top) / Math.max(bottom - top, 1)));
      if (line >= top) {
        current = i;
        currentLeg = f;
      }
      wordsRead += f * s.words;
      fills[i].style.transform = `scaleX(${f})`;
      waypoints[i].style.setProperty('--leg-done', f);
      waypoints[i].dataset.state = f >= 1 ? 'past' : line >= top ? 'current' : 'ahead';
    });

    const minutesLeft = minutesFor(totalWords - wordsRead);
    const progress = totalWords ? wordsRead / totalWords : 0;
    eta.textContent = minutesLeft <= 0.05 ? 'Arrived' : `${formatMinutes(minutesLeft)} to go`;
    arrival.textContent = minutesLeft <= 0.05 ? 'port' : formatMinutes(minutesLeft);

    if (current !== lastIndex) {
      lastIndex = current;
      leg.textContent = `§ ${current + 1}/${sections.length}`;
      here.textContent = sections[current].title;
      waypoints.forEach((w, i) => {
        const link = w.querySelector('a');
        if (i === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    document.dispatchEvent(new CustomEvent('chart:progress', {
      detail: { progress, minutesLeft, section: sections[current].title, index: current, leg: currentLeg },
    }));
  };

  const requestUpdate = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', () => {
    placeBelowNav();
    requestUpdate();
  });
  window.addEventListener('load', requestUpdate);
  placeBelowNav();
  update();
}

/* ─────────────────────────────────────────────
   Reader memory
   On an article: remember the reader's place,
   and offer to resume on return. Everywhere:
   stamp article links the reader has finished
   or started.
───────────────────────────────────────────── */
const FINISHED_AT = 0.92;
const STARTED_AT = 0.05;

function initReaderMemory() {
  const content = document.querySelector('.post-content');
  if (!content || !document.querySelector('.chart:not([hidden])')) return;

  const path = window.location.pathname;
  const saved = readReadingLog()[path];
  let latest = null;
  let flushTimer = null;

  const save = () => {
    flushTimer = null;
    if (!latest) return;
    const { progress, minutesLeft, section, index, leg } = latest;
    latest = null;
    const now = Date.now();
    const log = readReadingLog();
    const entry = log[path] || {};
    if (progress < STARTED_AT) return; // Back at the top (or a page unloading) never erases a saved place
    log[path] = {
      p: Math.round(progress * 1000) / 1000,
      m: Math.ceil(minutesLeft),
      s: section,
      i: index,
      f: Math.round(leg * 1000) / 1000,
      t: now,
      done: entry.done || progress >= FINISHED_AT,
    };
    writeReadingLog(log);
  };

  // Write at most every 1.5 s while scrolling, and always the final position
  document.addEventListener('chart:progress', e => {
    latest = e.detail;
    if (!flushTimer) flushTimer = setTimeout(save, 1500);
  });
  window.addEventListener('pagehide', save);

  if (!saved || saved.done || saved.p < STARTED_AT || window.location.hash) return;

  // Offer to resume only on a fresh arrival at the top. Decided after load, because a
  // text-fragment link scrolls the page late and never shows up in location.hash.
  const offerResume = () => {
    if (window.scrollY > 100) return;
    const folio = document.querySelector('.folio');
    if (!folio) return;

    const slip = document.createElement('div');
    slip.className = 'resume';
    slip.setAttribute('role', 'region');
    slip.setAttribute('aria-label', 'Resume reading');
    slip.innerHTML = `
      <p class="resume__label">Continued</p>
      <p class="resume__text">You left off at <em></em>, ${Math.round(saved.p * 100)}% of the way through. ${saved.m} min to go.</p>
      <div class="resume__actions">
        <button type="button" class="resume__go">Resume reading &darr;</button>
        <button type="button" class="resume__dismiss">Start from the top</button>
      </div>
    `;
    slip.querySelector('em').textContent = saved.s;
    folio.insertAdjacentElement('afterend', slip);

    slip.querySelector('.resume__go').addEventListener('click', () => {
      // Return to the same point in the same section; images and code take height but no words.
      // The slip sits above the article, so remove it before measuring.
      slip.remove();
      const sections = buildSections(content);
      const pageY = el => el.getBoundingClientRect().top + window.scrollY;
      const i = Math.min(saved.i || 0, sections.length - 1);
      const top = pageY(sections[i].anchor);
      const bottom = i + 1 < sections.length ? pageY(sections[i + 1].anchor) : pageY(content) + content.offsetHeight;
      const y = top + (saved.f || 0) * (bottom - top) - window.innerHeight * READING_LINE;
      window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
    slip.querySelector('.resume__dismiss').addEventListener('click', () => slip.remove());
  };
  window.addEventListener('load', () => requestAnimationFrame(offerResume), { once: true });
}

const READ_MARK_CARDS = '.stream article, .see-also__item, .next';
const READ_MARK_SKIP = '.post-content, .respond, .chart, .nav, .revision-record';

function readMarkFor(entry) {
  const mark = document.createElement('span');
  if (entry.done) {
    mark.className = 'read-mark read-mark--done';
    mark.textContent = 'Read';
  } else {
    mark.className = 'read-mark';
    mark.style.setProperty('--read', entry.p);
    mark.textContent = `${Math.round(entry.p * 100)}% read · ${entry.m} min left`;
  }
  return mark;
}

// A card's meta line takes the stamp; otherwise it sits above the headline, or after a bare link
function placeReadMark(card, link, mark) {
  const slot = card.querySelector('.meta-line');
  const headline = card.querySelector('h2, h3, h4');
  if (slot) slot.appendChild(mark);
  else if (headline) headline.insertAdjacentElement('beforebegin', mark);
  else link.insertAdjacentElement('afterend', mark);
}

function initReadMarks() {
  const log = readReadingLog();
  if (!Object.keys(log).length) return;

  const here = window.location.pathname;
  const marked = new Set();

  document.querySelectorAll('main a[href]').forEach(a => {
    if (a.closest(READ_MARK_SKIP)) return;
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === here) return;
    const entry = log[url.pathname];
    if (!entry || (!entry.done && entry.p < STARTED_AT)) return;

    const card = a.closest(READ_MARK_CARDS) || a;
    if (marked.has(card)) return;
    marked.add(card);
    placeReadMark(card, a, readMarkFor(entry));
  });
}

/* ─────────────────────────────────────────────
   Cite a passage
   § beside each section head and ¶ beside each
   paragraph copy a deep link; selecting text
   offers a link to that exact passage (a URL
   text fragment, highlighted by the browser on
   arrival) or a ready-made citation.
───────────────────────────────────────────── */
function initToast() {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('p');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  let timer;
  return message => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  };
}

// Text-fragment directives reserve - , & so they must be escaped inside the terms
const encodeFragmentTerm = text =>
  encodeURIComponent(text).replace(/-/g, '%2D');

function passageUrl(text) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const base = `${window.location.origin}${window.location.pathname}`;
  if (words.length <= 8) return `${base}#:~:text=${encodeFragmentTerm(words.join(' '))}`;
  const start = words.slice(0, 4).join(' ');
  const end = words.slice(-4).join(' ');
  return `${base}#:~:text=${encodeFragmentTerm(start)},${encodeFragmentTerm(end)}`;
}

// Text fragments only match whole words, so widen a selection that cuts one in half
function wholeWords(range) {
  const r = range.cloneRange();
  const { startContainer: s, endContainer: e } = r;
  if (s.nodeType === Node.TEXT_NODE) {
    let i = r.startOffset;
    while (i > 0 && /\S/.test(s.data[i - 1])) i--;
    r.setStart(s, i);
  }
  if (e.nodeType === Node.TEXT_NODE) {
    let i = r.endOffset;
    while (i < e.data.length && /[^\s.,;:!?)”"]/.test(e.data[i])) i++;
    r.setEnd(e, i);
  }
  return r;
}

async function copyText(text, notify, message) {
  try {
    await navigator.clipboard.writeText(text);
    notify(message);
  } catch {
    notify('Copying is blocked in this browser.');
  }
}

function initCitations() {
  const content = document.querySelector('.post-content');
  if (!content) return;

  const notify = initToast();
  const title = content.dataset.title || document.title;
  const date = content.dataset.date || '';
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  content.querySelectorAll(':scope > h2[id]').forEach(h => {
    const mark = document.createElement('a');
    mark.className = 'section-mark';
    mark.href = `#${h.id}`;
    mark.setAttribute('aria-label', `Copy link to section: ${h.textContent.trim()}`);
    mark.addEventListener('click', () => {
      history.replaceState(null, '', `#${h.id}`);
      copyText(window.location.href, notify, 'Section link copied.');
    });
    h.appendChild(mark);
  });

  content.querySelectorAll(':scope > p').forEach(p => {
    const text = p.textContent; // Read before the ¶ joins the paragraph
    if (countWords(text) < 12) return;
    const mark = document.createElement('button');
    mark.type = 'button';
    mark.className = 'para-mark';
    mark.tabIndex = -1; // Keyboard readers have § and selection; a stop per paragraph is noise
    mark.setAttribute('aria-label', 'Copy link to this paragraph');
    mark.addEventListener('click', () =>
      copyText(passageUrl(text), notify, 'Paragraph link copied. It opens highlighted.')
    );
    p.appendChild(mark);
  });

  if (!finePointer) return;

  const popover = document.createElement('div');
  popover.className = 'cite-pop';
  popover.setAttribute('role', 'toolbar');
  popover.setAttribute('aria-label', 'Selected passage');
  popover.innerHTML = `
    <button type="button" data-cite="link">Link to passage</button>
    <button type="button" data-cite="quote">Copy as quote</button>
  `;
  popover.hidden = true;
  document.body.appendChild(popover);

  let selected = '';
  const hide = () => {
    popover.hidden = true;
  };

  const show = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return hide();
    const range = sel.getRangeAt(0);
    if (!content.contains(range.commonAncestorContainer)) return hide();
    const text = wholeWords(range).toString().replace(/\s+/g, ' ').trim();
    if (text.length < 8 || text.length > 1200) return hide();

    selected = text;
    const rect = range.getBoundingClientRect();
    popover.hidden = false;
    const x = Math.min(
      Math.max(rect.left + rect.width / 2 - popover.offsetWidth / 2, 8),
      document.documentElement.clientWidth - popover.offsetWidth - 8
    );
    const above = rect.top - popover.offsetHeight - 10;
    const y = above > 70 ? above : rect.bottom + 10;
    popover.style.left = `${x + window.scrollX}px`;
    popover.style.top = `${y + window.scrollY}px`;
  };

  content.addEventListener('mouseup', () => requestAnimationFrame(show));
  content.addEventListener('keyup', e => {
    if (e.shiftKey) show();
  });
  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) hide();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hide();
  });

  popover.addEventListener('mousedown', e => e.preventDefault()); // Keep the selection alive
  popover.addEventListener('click', e => {
    const action = e.target.closest('button')?.dataset.cite;
    if (!action) return;
    const url = passageUrl(selected);
    if (action === 'link') {
      copyText(url, notify, 'Passage link copied. It opens highlighted.');
    } else {
      const citation = `“${selected}”\n— Pedro Dias, “${title}”, digitaldias.com${date ? `, ${date}` : ''}\n${url}`;
      copyText(citation, notify, 'Quote copied with its citation.');
    }
    hide();
  });
}
/* ─────────────────────────────────────────────
   Lightbox
   One <dialog> for post figures and the
   Photographs grid. The browser handles focus,
   Escape and the backdrop layer.
───────────────────────────────────────────── */
function lightboxDialog() {
  const existing = document.querySelector('dialog.lightbox');
  if (existing) return existing;

  const box = document.createElement('dialog');
  box.className = 'lightbox';
  box.setAttribute('aria-label', 'Enlarged image');
  box.innerHTML = `
    <form method="dialog"><button class="lightbox__close">Close</button></form>
    <img class="lightbox__img" alt="">
    <p class="lightbox__caption m"></p>
  `;
  box.addEventListener('click', e => {
    if (e.target === box || e.target.classList.contains('lightbox__img')) box.close();
  });
  box.addEventListener('close', () => box.querySelector('.lightbox__img').removeAttribute('src'));
  document.body.appendChild(box);
  return box;
}

function openLightbox(img, caption) {
  const box = lightboxDialog();
  const big = box.querySelector('.lightbox__img');
  big.src = img.currentSrc || img.src;
  big.alt = img.alt || '';
  box.querySelector('.lightbox__caption').textContent = caption || '';
  box.showModal();
}

function initImageLightbox() {
  document.querySelectorAll('.post-content .figure img').forEach(img => {
    img.addEventListener('click', () => {
      const caption = img.closest('.figure').querySelector('figcaption');
      openLightbox(img, caption ? caption.textContent : '');
    });
  });

  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  gallery.addEventListener('click', e => {
    const frame = e.target.closest('button');
    if (frame) openLightbox(frame.querySelector('img'), frame.querySelector('span').textContent);
  });
}

/* ─────────────────────────────────────────────
   Headline word rise
   Wraps each word of a .split-words headline in
   .w > span so CSS can raise them in sequence.
   Under reduced motion nothing is split.
───────────────────────────────────────────── */
function splitWords(node, counter) {
  Array.from(node.childNodes).forEach(child => {
    if (child.nodeType !== Node.TEXT_NODE) {
      splitWords(child, counter);
      return;
    }
    const frag = document.createDocumentFragment();
    child.textContent.split(/(\s+)/).forEach(part => {
      if (!part.trim()) {
        frag.append(part);
        return;
      }
      const word = document.createElement('span');
      const inner = document.createElement('span');
      word.className = 'w';
      inner.textContent = part;
      inner.style.setProperty('--i', counter.i++);
      word.append(inner);
      frag.append(word);
    });
    child.replaceWith(frag);
  });
}

function initHeadlineRise() {
  document.querySelectorAll('.split-words').forEach(h => {
    if (!prefersReducedMotion()) splitWords(h, { i: 0 });
    h.classList.add('is-split');
  });
}

/* ─────────────────────────────────────────────
   Giscus
   Reactions and comments, injected here so the
   first load already matches the reader's theme;
   re-themed live when theme.js emits theme:change.
───────────────────────────────────────────── */
const GISCUS_ORIGIN = 'https://giscus.app';

const giscusTheme = () => {
  const root = document.documentElement;
  const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (root.dataset.theme || (osDark ? 'dark' : 'light')) === 'dark' ? 'transparent_dark' : 'light';
};

function initGiscus() {
  const host = document.querySelector('.giscus[data-repo]');
  if (!host) return;

  const script = document.createElement('script');
  script.src = `${GISCUS_ORIGIN}/client.js`;
  Object.entries(host.dataset).forEach(([key, value]) => {
    script.dataset[key] = value;
  });
  script.dataset.theme = giscusTheme();
  script.crossOrigin = 'anonymous';
  script.async = true;
  host.appendChild(script);

  document.addEventListener('theme:change', () => {
    const frame = document.querySelector('iframe.giscus-frame');
    if (!frame) return;
    frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme() } } }, GISCUS_ORIGIN);
  });
}

/* ─────────────────────────────────────────────
   Ko-fi click tracking (Google Analytics)
───────────────────────────────────────────── */
function initKofiTracking() {
  document.querySelectorAll('a[data-cta="kofi"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'support_click', {
          event_category: 'Support',
          event_label: 'kofi',
          value: 1,
        });
      }
    });
  });
}

/* ─────────────────────────────────────────────
   Boot
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeadlineRise();
  initSmoothScroll();
  initChart();
  initReaderMemory();
  initReadMarks();
  initCitations();
  initImageLightbox();
  initGiscus();
  initKofiTracking();
});
