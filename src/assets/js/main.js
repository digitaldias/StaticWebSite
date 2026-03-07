/**
 * digitaldias.com — main.js
 * The Craftsman's Notebook edition.
 * Clean ES6+, no dependencies, respects prefers-reduced-motion.
 */

'use strict';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   Page fade-in
   Body starts at opacity:0 (CSS), transitions
   to 1 on DOMContentLoaded via .is-loaded class.
───────────────────────────────────────────── */
function initPageFade() {
  document.body.classList.add('is-loaded');
}

/* ─────────────────────────────────────────────
   Navigation
   - Sticky shadow on scroll
   - Mobile hamburger toggle
   - Active link detection by path
───────────────────────────────────────────── */
function initNavigation() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Shadow on scroll
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  const toggle = nav.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('nav--open', !expanded);
    });
  }

  // Close mobile menu on link click
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav--open');
    });
  });

  // Active state: compare current path to link href
  const currentPath = window.location.pathname;
  nav.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = new URL(href, window.location.href).pathname;
    // Exact match, or starts-with for section pages (/blog/ matches /blog/post-slug/)
    if (
      currentPath === linkPath ||
      (linkPath !== '/' && currentPath.startsWith(linkPath))
    ) {
      link.classList.add('nav__link--active');
    }
  });
}

/* ─────────────────────────────────────────────
   Scroll reveal
   Elements with .reveal get .is-visible when
   they enter the viewport. CSS handles the
   actual opacity/transform transition.
───────────────────────────────────────────── */
function initScrollReveal() {
  if (prefersReducedMotion()) {
    // Show everything immediately
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

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

/* ─────────────────────────────────────────────
   Reading progress bar
   Only active on single blog posts that have
   .post-content and #reading-progress-bar.
───────────────────────────────────────────── */
function initReadingProgress() {
  const bar = document.getElementById('reading-progress-bar');
  const article = document.querySelector('.post-content');
  if (!bar || !article) return;

  let ticking = false;

  const update = () => {
    const articleTop    = article.getBoundingClientRect().top + window.scrollY;
    const articleHeight = article.offsetHeight;
    const scrolled      = window.scrollY;
    const winHeight     = window.innerHeight;

    const raw      = (scrolled - articleTop) / (articleHeight - winHeight);
    const progress = Math.min(100, Math.max(0, raw * 100));
    bar.style.width = progress + '%';
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
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
  initPageFade();
  initNavigation();
  initScrollReveal();
  initSmoothScroll();
  initReadingProgress();
  initKofiTracking();
});
