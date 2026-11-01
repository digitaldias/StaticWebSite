/**
 * Light/dark choice, shared by digitaldias.com and /briefing/.
 * Loaded without defer in <head> so the stored choice applies before first
 * paint. No stored choice means the page follows the OS via light-dark().
 * Buttons marked [data-theme-toggle] flip the theme and remember it.
 * Emits `theme:change` on document so embeds (Giscus) can follow.
 */
(function () {
  'use strict';

  var KEY = 'dd-theme';
  var root = document.documentElement;
  var osDark = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function current() {
    return root.dataset.theme || (osDark.matches ? 'dark' : 'light');
  }

  function label(button) {
    var next = current() === 'dark' ? 'light' : 'dark';
    button.setAttribute('aria-label', 'Switch to ' + next + ' theme');
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
    document.dispatchEvent(new CustomEvent('theme:change', { detail: { theme: theme } }));
  }

  var saved = stored();
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      label(button);
      button.addEventListener('click', function () {
        choose(current() === 'dark' ? 'light' : 'dark');
      });
    });
  });

  osDark.addEventListener('change', function () {
    if (root.dataset.theme) return;
    labelAll();
    document.dispatchEvent(new CustomEvent('theme:change', { detail: { theme: current() } }));
  });
})();
