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
   Image lightbox
   Click any figure image in post content to view
   it enlarged. Closes on backdrop click, the
   close button, or Escape.
───────────────────────────────────────────── */
function initImageLightbox() {
  const images = document.querySelectorAll('.post-content .figure img');
  if (!images.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Close">&times;</button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" src="" alt="">
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  let lastFocused = null;

  const open = img => {
    lastFocused = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    const caption = img.closest('.figure').querySelector('figcaption');
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
    if (lastFocused) lastFocused.focus();
  };

  images.forEach(img => {
    img.addEventListener('click', () => open(img));
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
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
  initPageFade();
  initNavigation();
  initScrollReveal();
  initSmoothScroll();
  initReadingProgress();
  initImageLightbox();
  initKofiTracking();
});
