/**
 * Light/dark choice, shared by digitaldias.com and /briefing/.
 * Loaded without defer in <head> so the stored choice applies before first
 * paint. The site is light by default; dark only when the reader picks it.
 * Buttons marked [data-theme-toggle] flip the theme and remember it.
 * Emits `theme:change` on document so embeds (Giscus) can follow.
 */
(function () {
  'use strict';

  var KEY = 'dd-theme';
  var root = document.documentElement;

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function current() {
    return root.dataset.theme || 'light';
  }

  // The browser chrome follows the page
  function paintChrome() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', current() === 'dark' ? '#0f1a1b' : '#f4f6f4');
  }

  function label(button) {
    var next = current() === 'dark' ? 'light' : 'dark';
    var nb = (root.lang || '').slice(0, 2) === 'nb';
    button.setAttribute('aria-label', nb ? 'Bytt til ' + (next === 'dark' ? 'mørkt' : 'lyst') + ' tema' : 'Switch to ' + next + ' theme');
    button.dataset.current = current();
  }

  function labelAll() {
    document.querySelectorAll('[data-theme-toggle]').forEach(label);
  }

  function choose(theme) {
    root.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      /* Storage blocked: the choice lasts for this page only */
    }
    labelAll();
    paintChrome();
    document.dispatchEvent(new CustomEvent('theme:change', { detail: { theme: theme } }));
  }

  var saved = stored();
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;

  document.addEventListener('DOMContentLoaded', function () {
    paintChrome();
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      label(button);
      button.addEventListener('click', function () {
        choose(current() === 'dark' ? 'light' : 'dark');
      });
    });
  });
})();
