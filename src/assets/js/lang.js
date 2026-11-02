/**
 * Language choice. English is the default; Norwegian lives under /nb/.
 * Loaded without defer in <head>, after the <link rel="alternate" hreflang>
 * tags, so a remembered choice redirects before first paint. A page without
 * a translation stays in its own language. Links marked [data-lang] remember
 * the reader's choice under `dd-lang`.
 */
(function () {
  'use strict';

  var KEY = 'dd-lang';

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function remember(lang) {
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) {
      /* Storage blocked: the choice lasts for this page only */
    }
  }

  var here = (document.documentElement.lang || 'en').slice(0, 2);
  var saved = stored();
  if (saved && saved !== here) {
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + saved + '"]');
    if (alt) {
      location.replace(new URL(alt.href, location.href).pathname + location.search + location.hash);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-lang]').forEach(function (link) {
      link.addEventListener('click', function () {
        remember(link.dataset.lang);
      });
    });
  });
})();
