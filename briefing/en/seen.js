// Remembers which categories the reader has opened on each day's briefing, so
// the tiles and the rail can mark the rest as new, and scrolls the open
// category's chip into view in the rail. Kept in this browser only, and only
// for the last 14 days. Served as a file, not inline: the site's CSP
// (script-src-elem 'self') blocks inline scripts.
(function () {
    var KEY = 'dd-briefing-seen';
    var KEEP_DAYS = 14;
    var root = document.documentElement;
    var day = root.dataset.briefingDate;
    if (!day) {
        return;
    }

    function load() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function save(all) {
        try {
            localStorage.setItem(KEY, JSON.stringify(all));
        } catch (e) {
            // Storage blocked: the marks last for this page only.
        }
    }

    function prune(all) {
        var cutoff = Date.parse(day) - KEEP_DAYS * 864e5;
        Object.keys(all).forEach(function (d) {
            if (Date.parse(d) < cutoff) {
                delete all[d];
            }
        });
    }

    function mark(seen) {
        document.querySelectorAll('.tile[href^="#cat-"], .chip[href^="#cat-"]').forEach(function (a) {
            a.classList.toggle('is-seen', seen.indexOf(a.getAttribute('href').slice(1)) !== -1);
        });
    }

    function centreChip(id) {
        var rail = document.querySelector('.rail');
        var chip = rail && rail.querySelector('a[href="#' + id + '"]');
        if (chip) {
            rail.scrollLeft = chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2;
        }
    }

    function update() {
        var all = load();
        var seen = all[day] || [];
        var id = location.hash.slice(1);
        if (id.indexOf('cat-') === 0 && document.getElementById(id) && seen.indexOf(id) === -1) {
            seen.push(id);
            all[day] = seen;
            prune(all);
            save(all);
        }
        mark(seen);
        centreChip(id || 'kategorier');
    }

    document.addEventListener('DOMContentLoaded', function () {
        root.classList.add('seen-ready');
        update();
    });
    window.addEventListener('hashchange', update);
})();
