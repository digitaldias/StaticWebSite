// Closes the category list once a category has been chosen. Served as a file,
// not inline: the site's CSP (script-src-elem 'self') blocks inline scripts.
// Closes after the fragment navigation: hashchange covers a new category and
// the back button; the deferred click covers re-tapping the current category,
// which fires no hashchange.
(function () {
    var bar = document.querySelector('.catbar');
    if (!bar) {
        return;
    }
    function close() {
        bar.open = false;
    }
    window.addEventListener('hashchange', close);
    bar.querySelectorAll('.catbar-list a').forEach(function (a) {
        a.addEventListener('click', function () {
            setTimeout(close, 0);
        });
    });
})();
