/**
 * Applies the saved theme before first paint, to avoid a flash of the wrong
 * theme. Must be loaded as early as possible in <head>, before Tailwind's
 * CDN script — see any page's <head> for the exact placement.
 *
 * This only sets the `dark` class on <html> before paint. Each page still
 * owns its own toggle button wiring (some use a global toggleTheme(), the
 * OSPF lab wires it through its app.toggleTheme() method) — those aren't
 * unified here on purpose, to avoid touching working per-page logic during
 * this refactor.
 */
(function () {
    var isDark = true; // default
    try {
        var saved = localStorage.getItem('portfolio-theme');
        if (saved) isDark = saved === 'dark';
    } catch (e) {}
    document.documentElement.classList.toggle('dark', isDark);
})();
