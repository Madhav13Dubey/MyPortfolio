// Light/dark theme. The initial theme is set by an inline script in index.html (no flash);
// this wires the toggle button and remembers the choice in localStorage.
const KEY = 'theme';

export function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  const sync = () => {
    const light = root.dataset.theme === 'light';
    btn.setAttribute('aria-pressed', String(light));
    btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  };
  sync();
  btn.addEventListener('click', () => {
    const apply = () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(KEY, root.dataset.theme);
      } catch {
        // storage blocked: theme just won't persist
      }
      sync();
    };
    // Smooth cross-fade where the View Transitions API exists.
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
  });
}
