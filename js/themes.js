/* ─── Theme Switching Logic ─── */

const themes = [
    { name: "dark", icon: "🌙", label: "Dark" },
    { name: "light", icon: "☀️", label: "Light" },
    { name: "retro", icon: "📟", label: "Retro" },
    { name: "matrix", icon: "🟢", label: "Matrix" },
];

let currentThemeIndex = 0;

/* Load saved theme from localStorage */
(function () {
    const saved = localStorage.getItem("terminal-theme");
    if (saved) {
        const idx = themes.findIndex(function (t) { return t.name === saved; });
        if (idx >= 0) {
            currentThemeIndex = idx;
            applyTheme(idx);
        }
    }
})();

/**
 * Apply theme by index.
 */
function applyTheme(idx) {
    const theme = themes[idx];
    document.documentElement.setAttribute("data-theme", theme.name);

    // Update meta theme-color for mobile browser chrome
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        const colors = { dark: "#0a0a0f", light: "#f5f5f0", retro: "#0d0208", matrix: "#000800" };
        metaTheme.content = colors[theme.name] || "#0a0a0f";
    }

    localStorage.setItem("terminal-theme", theme.name);
}

/**
 * Cycle to the next theme and return it.
 */
function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(currentThemeIndex);
    return themes[currentThemeIndex];
}
